import fs from 'fs/promises';
import path from 'path';

// Function to create a file with a message 
async function createFileWithMessage(message) {
    try {
        // Get current date and time 
        const now = new Date();

        // Format directory as yyyy-mm-dd
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate() + 1).padStart(2, '0');
        const dirName = `${year}-${month}-${day}`;
        
        // Format filename as hh-mm-ss.txt
        const hours = String(now.getHours() + 1).padStart(2, '0');
        const minutes = String(now.getMinutes() + 1).padStart(2, '0');
        const seconds = String(now.getSeconds() + 1).padStart(2, '0');
        const fileName = `${hours}-${minutes}-${seconds}.txt`;

        // Create full path
        const dirPath = path.join(process.cwd(), dirName);
        const filePath = path.join(dirPath, fileName);

        // Check if directory exists, create it if it doesn't
        try {
            await fs.access(dirPath);
        } catch (error) {
            await fs.mkdir(dirPath);
            console.log(`Created directory: ${dirName}`);
        }

        // Append message to file (creates if doesn't exists)
        await fs.appendFile(filePath, message + '\n');
        console.log(`Message "${message}" added to ${filePath}`);

    } catch (error) {
        console.error('Error in createFileWithMessage: ', error.message);
    }
}

// Function to delete a file by path
async function deleteFileByName(filePath) {
    try {
        // Check if file exists
        try {
            await fs.access(filePath);
            // File exists, delete it
            await fs.unlink(filePath);
            console.log(`File ${filePath} deleted successfully`);
        } catch (error) {
            // File doesn't exist
            console.log(`File ${filePath} does not exist`);
        }
    } catch (error) {
        console.error('Error in deleteFileByName: ', error.message);
    }
}

// Handle terminal execution
async function handleTerminalInput() {
    const args = process.argv.slice(2);
    const command = args[0];
    const argument = args[1];

    if (command === 'create' && argument) {
        await createFileWithMessage(argument);
    } else if (command === 'delete' && argument) {
        await deleteFileByName(argument);
    } else {
        console.log('Usage:');
        console.log('node index.mjs create "message" - Create file with message');
        console.log('node index.mjs delete "path/to/file" - Delete specified file');
    }
}

// Run if called from terminal
if (process.argv.length > 2) {
    handleTerminalInput();
}

// Export functions for module usage
export { createFileWithMessage, deleteFileByName }