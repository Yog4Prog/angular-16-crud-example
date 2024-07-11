const glob = require('glob');
const path = require('path');

/**
 * Function to find and print the full path of files with a given name in a specified directory.
 * @param {string} directory - The directory to search in.
 * @param {string} fileName - The name of the file to search for.
 */
function findFilePath(directory, fileName) {
    // Use glob to find the file in the directory and its subdirectories
    const pattern = path.join(directory, '**', fileName);

    let searchResults = glob(pattern, {ignore: []});
    console.log(searchResults)
    console.log(searchResults.length);
}

// Replace 'your-directory' with the path to the directory you want to search
// Replace 'your-file.ext' with the name of the file you want to find
const directoryToSearch = '.';
const fileNameToFind = 'index.html';

findFilePath(directoryToSearch, fileNameToFind);
