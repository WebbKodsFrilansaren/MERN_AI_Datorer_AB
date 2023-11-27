const fs = require("fs");
const path = require("path");

const backupFolderPath = "server/images/backup"; // Update with your actual path

function readBackupFolder(backupFolder) {
  const subfolders = fs.readdirSync(backupFolder, { withFileTypes: true });

  // Sort subfolders numerically
  subfolders.sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const imagesArrays = subfolders.map((subfolder) => {
    const subfolderPath = path.join(backupFolder, subfolder.name);

    if (subfolder.isDirectory()) {
      const images = fs
        .readdirSync(subfolderPath)
        .filter((file) => file.endsWith(".webp"));
      return `componentImages: ${JSON.stringify(images)},`;
    }

    return ""; // Skip non-directory entries
  });

  return imagesArrays.filter(Boolean); // Remove empty strings
}

// Example: Read the "backup" folder
const backupFolderContent = readBackupFolder(backupFolderPath);

// Output the result
backupFolderContent.forEach((imagesArray) => {
  console.log(imagesArray);
});
