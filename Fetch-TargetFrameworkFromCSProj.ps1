# Replace with your values
$GITHUB_USER = "Yog4Prog"
$GITHUB_REPO = "AZSampleWebApp"
$GIT_BASE = "https://api.github.com/repos"
$GITHUB_TOKEN = ""

# Function to fetch contents of a directory and look for .csproj files
function Fetch-CsprojFilesTargetVersion {
    param (
        [string]$DirUrl
     )

    $headers = @{
        Authorization = "token $GITHUB_TOKEN"
    }

    $response = Invoke-RestMethod -Uri $DirUrl -Headers $headers
    # Extract .csproj files
    $csprojFiles = $response | Where-Object { $_.type -eq 'file' -and $_.name -like '*.csproj' }
    foreach ($file in $csprojFiles) {
        $csprojPath = $file.path
        $fileContentUrl = $file.download_url
        $targetFramework = Fetch-TargetFrameworkFromRegex -FileUrl $fileContentUrl
        $global:found = $true  # Set a global flag indicating a .csproj file was found
        return $targetFramework # Break after finding the first .csproj file
  
    }

    # Find directories and recursively fetch their contents
    if($global:found -eq $false) {
        $subdirs = $response | Where-Object { $_.type -eq 'dir' }
        foreach ($subdir in $subdirs) {
            if ($global:found) {
                return  # Exit if a .csproj file has been found
            }
            $subdirUrl = $subdir.url
            Fetch-CsprojFilesTargetVersion -DirUrl $subdirUrl
        }
    }
}

# Function to fetch and parse the TargetFramework from a .csproj file
function Fetch-TargetFramework {
    param (
        [string]$FileUrl
    )

    $headers = @{
        Authorization = "token $GITHUB_TOKEN"
    }

    $fileContent = Invoke-RestMethod -Uri $FileUrl -Headers $headers

    # Load the .csproj file content as XML
    $xml = [xml]$fileContent

    # Find the TargetFramework element
    $targetFramework = $xml.Project.PropertyGroup.TargetFramework
    if ($null -eq $targetFramework) {
        $targetFramework = $xml.Project.PropertyGroup.TargetFrameworks
    }
    return $targetFramework;
}
# Function to fetch and parse the TargetFramework from a .csproj file using regex
function Fetch-TargetFrameworkFromRegex {
    param (
        [string]$FileUrl
    )

    $headers = @{
        Authorization = "token $GITHUB_TOKEN"
    }

    $fileContent = Invoke-RestMethod -Uri $FileUrl -Headers $headers

    # Convert the content to a string if it's an XML document
    if ($fileContent -is [xml]) {
            $fileContent = $fileContent.OuterXml
    }
    
    # Use regex to find the TargetFramework element
    $targetFrameworkRegex = '<TargetFramework>(.*?)<\/TargetFramework>'
    $targetFrameworksRegex = '<TargetFrameworks>(.*?)<\/TargetFrameworks>'
    
    $targetFrameworkMatch = [regex]::Match($fileContent, $targetFrameworkRegex)
    $targetFrameworksMatch = [regex]::Match($fileContent, $targetFrameworksRegex)
    if ($targetFrameworkMatch.Success) {
        return $targetFrameworkMatch.Groups[1].Value
    } elseif ($targetFrameworksMatch.Success) {
        return $targetFrameworksMatch.Groups[1].Value
    } else {
        return $null
    }
}

# Read the gitrepodetails.txt file and process each line
Get-Content gitrepodetails.txt | ForEach-Object {
    $line = $_ -split '/'
    $GITHUB_USER = $line[0].Trim()
    $GITHUB_REPO = $line[1].Trim()

    # Global variable to indicate if a .csproj file has been found
    $global:found = $false

    # Initial fetch from the root directory
    $rootUrl = "$GIT_BASE/$GITHUB_USER/$GITHUB_REPO/contents"
    $targetFramework =  Fetch-CsprojFilesTargetVersion -DirUrl $rootUrl 
    if ($targetFramework) {
         Write-Output "$GITHUB_USER/$GITHUB_REPO : $targetFramework"
    } else {
         Write-Output "$GITHUB_USER/$GITHUB_REPO : Not Found"
    }
       
}