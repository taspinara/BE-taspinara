import { promises as fs } from "fs";
import path from "path";

// Function to create a file with a given message
export async function createFileWithMessage(message) {
    try {
        // Get current date and time
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, 0);
        const day = String(now.getDate()).padStart(2, 0);
        const hours = String(now.getHours()).padStart(2, 0);
        const minutes = String(now.getMinutes()).padStart(2, 0);
        const seconds = String(now.getSeconds()).padStart(2, 0);

        // Directory and file naming
        const dirName = `${year}-${month}-${day}`;
        const fileName = `${hours}-${minutes}-${seconds}.txt`;
        const dirPath = path.join(process.cwd(), dirName);

        // Check if the directory exists; if not, create it.
        try {
            await fs.access(dirPath);
            // Directory exists, nothing to do.
        } catch (err) {
            // Directory does not exists: create it.
            await fs.mkdir(dirPath);
        }

        // Full path for the file
        const filePath = path.join(dirPath, fileName);

        // Check if the file exists and append or create accordingly.
        try {
            await fs.access(filePath);
            // File exists: append the message
            await fs.appendFile(filePath, `\n${message}`);
        } catch (err) {
            // File doesn't exist: create file with the message.
            await fs.writeFile(filePath, message);
        }

        console.log(`Message written to ${filePath}`);
    } catch (error) {
        console.error("An error occurred in createFileWithMessage:", error);
    }
}

// Function to delete a file by its path
export async function deleteFileByName(filePath) {
    try {
        // Check if the file exits
        await fs.access(filePath);
        // Delete the file if it exists
        await fs.unlink(filePath);
        console.log(`File ${filePath} has been deleted.`);
    } catch (error) {
        console.error(`Cannot delete: File ${filePath} does not exist or another error occurred.`);
    }
}

// Terminal execution handling
const [,, command, ...args] = process.argv;
if (command === "create") {
    // Join arguments in case the message contains spaces.
    const message = args.join(" ");
    createFileWithMessage(message);
} else if (command === 'delete') {
    // The first argument should be the file path.
    const filePath = args[0];
    if (!filePath) {
        console.error("Please provide the file path to delete.");
    } else {
        deleteFileByName(filePath);
    }
}