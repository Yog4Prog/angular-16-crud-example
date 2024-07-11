# Replace with your values
$GITHUB_USER = "Yog4Prog"
$GITHUB_REPO = "AZSampleWebApp"
$GITHUB_TOKEN = "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"

# Function to fetch contents of a directory and look for .csproj files
function Fetch-CsprojFiles {
    param (
        [string]$DirUrl
    )

    $headers = @{
        Authorization = "token $GITHUB_TOKEN"
    }

    $response = Invoke-RestMethod -Uri $DirUrl -Headers $headers

    # Extract .csproj files
    $response | Where-Object { $_.type -eq 'file' -and $_.name -like '*.csproj' } | ForEach-Object {
        Write-Output $_.path
    }

    # Find directories and recursively fetch their contents
    $response | Where-Object { $_.type -eq 'dir' } | ForEach-Object {
        $subdirUrl = $_.url
        Fetch-CsprojFiles -DirUrl $subdirUrl
    }
}

# Initial fetch from the root directory
$rootUrl = "https://api.github.com/repos/$GITHUB_USER/$GITHUB_REPO/contents"
Fetch-CsprojFiles -DirUrl $rootUrl
