const fs = require('fs');
const path = require('path');

// Helper function to pad numbers
const pad = (num) => num.toString().padStart(2, "0");

// Part 1: createFileWithMessage
async function createFileWithMessage(message) {
    const now = new Date();
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    // Format directory and file names
    const dirName = `${year}-${month}-${day}`;
    const fileName = `${hours}-${minutes}-${seconds}.txt`;
    const dirPath = path.join(__dirname, dirName);
    const filePath = path.join(dirPath, fileName);

    // Check if directory exists, if not create it
    try {
        await fs.promises.access(dirPath);
    } catch (err) {
        await fs.promises.mkdir(dirPath, { recursive: true });
    }

    // Check if the file exists; if so, append the message; otherwise, create it
    try {
        await fs.promises.access(filePath);
        // File exists - append message
        await fs.promises.appendFile(filePath, "\n" + message);
        console.log(`Appended message to ${filePath}`);
    } catch (err) {
        // File does not exist - create file with message
        await fs.promises.writeFile(filePath, message);
        console.log(`Created file ${filePath} with message.`);
    }
}

// Part 2: deleteFileByName
async function deleteFileByName(filePath) {
    try {
        // Check if file exists
        await fs.promises.access(filePath);
        // Delete the file
        await fs.promises.unlink(filePath);
        console.log(`File ${filePath} deleted successfully.`);
    } catch (err) {
        console.log(`File ${filePath} does not exist.`);
    }
}

// Command-line execution
if (require.main === module) {
    const command = process.argv[2];
    const argument = process.argv[3];

    if (command === "create") {
        if (!argument) {
            console.error("Please provide a message to create.");
            process.exit(1);
        }
        createFileWithMessage(argument);
    } else if (command === "delete") {
        if (!argument) {
            console.error("Please provide the file path to delete.");
            process.exit(1);
        }
        deleteFileByName(argument);
    } else {
        console.error("Unknown command. Use 'create' or 'delete'.");
    }
}

module.exports = { createFileWithMessage, deleteFileByName };