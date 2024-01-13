// File system and Pathing modules from NodeJS and also 'util'ities
// to convert functions as promises for easy use of async await etc.
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

// Prepare async handling
const readdirAsync = promisify(fs.readdir);
const copyFileAsync = promisify(fs.copyFile);

// Where from and where to copying backup images
const sourceDirectory = "server/images/backup";
const destinationDirectory = "server/images/";

// Recursive function that will go inside each folder and sub-folder to copy each file from within it/them!
async function copyFilesRecursively(source, destination) {
  // Create (sub-)folder if it doesn't exist already
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  // Start reading the current (sub-)folder!
  const entries = await readdirAsync(source, { withFileTypes: true });

  // Loop through each file there and grab its file path and file name
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    // Is current "file" a folder/directory?...
    if (entry.isDirectory()) {
      //... Then go inside of it and start all over this recursive function
      await copyFilesRecursively(sourcePath, destinationPath);
    } // If it is NOT a directory, then we now by logic it is a file...
    else {
      // ... so start copying it!
      await copyFileAsync(sourcePath, destinationPath);
      console.log(`SUCCESS - IMAGE COPIED: ${entry.name}`);
    }
  }
}

// Start running the async recursive function now with those directories defined in the beginning!
copyFilesRecursively(sourceDirectory, destinationDirectory)
  .then(() => console.log("SUCCESS - EVERYTHING WAS COPIED!"))
  .catch((err) => console.error("ERROR(S) - NOT EVERYTHING WAS COPIED: ", err));
// SCRIPT ENDS!
