// Import the HTTP module for creating the web server
const http = require('http');
// Import the File System module with Promises API for async file operations
const fs = require('fs').promises;
// Import the Path module for handling file paths
const path = require('path');

// Function to create a file with a given message
async function createFileWithMessage(message) {
    // Generate a timestamp string, replacing colons with hyphens for filename safety
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    // Create a filename using the timestamp
    const filename = `message-${timestamp}.txt`;
    // Construct the full file path using the current directory and 'files' subdirectory
    const filepath = path.join(__dirname, 'files', filename);
    
    try {
        // Create the 'files' directory if it doesn't exist (recursive: true prevents errors if it already exists)
        await fs.mkdir(path.join(__dirname, 'files'), { recursive: true });
        // Write the message to the file
        await fs.writeFile(filepath, message);
        // Return success status and filename
        return { success: true, filename: filename };
    } catch (error) {
        // Return failure status and error message if something goes wrong
        return { success: false, error: error.message };
    }
}

// Function to delete a file by name
async function deleteFileByName(filename) {
    // Construct the full file path
    const filepath = path.join(__dirname, 'files', filename);
    
    try {
        // Delete the file
        await fs.unlink(filepath);
        // Return success status
        return { success: true };
    } catch (error) {
        // Return failure status and error message if deletion fails
        return { success: false, error: error.message };
    }
}

// Function to read file contents by name (bonus feature)
async function readFileByName(filename) {
    // Construct the full file path
    const filepath = path.join(__dirname, 'files', filename);
    
    try {
        // Read the file contents as UTF-8 text
        const content = await fs.readFile(filepath, 'utf8');
        // Return success status and file contents
        return { success: true, content: content };
    } catch (error) {
        // Return failure status and error message if reading fails
        return { success: false, error: error.message };
    }
}

// Create the HTTP server
const server = http.createServer(async (req, res) => {
    // Split the URL into parts for easier processing
    const urlParts = req.url.split('/');
    
    // Handle POST requests to /files
    if (req.method === 'POST' && req.url === '/files') {
        // Initialize an empty string to collect request body data
        let body = '';
        
        // Collect data chunks as they arrive
        req.on('data', chunk => {
            // Convert chunk to string and append to body
            body += chunk.toString();
        });
        
        // When all data is received
        req.on('end', async () => {
            // Create file with the received body content
            const result = await createFileWithMessage(body);
            
            if (result.success) {
                // Set response status to 201 (Created) and content type to JSON
                res.writeHead(201, { 'Content-Type': 'application/json' });
                // Send success response with filename
                res.end(JSON.stringify({ 
                    message: 'File created successfully', 
                    filename: result.filename 
                }));
            } else {
                // Set response status to 500 (Server Error) and content type to JSON
                res.writeHead(500, { 'Content-Type': 'application/json' });
                // Send error response
                res.end(JSON.stringify({ 
                    message: 'Failed to create file', 
                    error: result.error 
                }));
            }
        });
    }
    // Handle DELETE requests to /files/<filename>
    else if (req.method === 'DELETE' && urlParts[1] === 'files' && urlParts[2]) {
        // Get the filename from the URL
        const filename = urlParts[2];
        // Attempt to delete the file
        const result = await deleteFileByName(filename);
        
        if (result.success) {
            // Set response status to 200 (OK) and content type to JSON
            res.writeHead(200, { 'Content-Type': 'application/json' });
            // Send success response
            res.end(JSON.stringify({ message: 'File deleted successfully' }));
        } else {
            // Set response status to 404 (Not Found) and content type to JSON
            res.writeHead(404, { 'Content-Type': 'application/json' });
            // Send error response
            res.end(JSON.stringify({ 
                message: 'File not found or could not be deleted', 
                error: result.error 
            }));
        }
    }
    // Handle GET requests to /files/<filename> (bonus feature)
    else if (req.method === 'GET' && urlParts[1] === 'files' && urlParts[2]) {
        // Get the filename from the URL
        const filename = urlParts[2];
        // Attempt to read the file
        const result = await readFileByName(filename);
        
        if (result.success) {
            // Set response status to 200 (OK) and content type to plain text
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            // Send file contents
            res.end(result.content);
        } else {
            // Set response status to 404 (Not Found) and content type to JSON
            res.writeHead(404, { 'Content-Type': 'application/json' });
            // Send error response
            res.end(JSON.stringify({ 
                message: 'File not found', 
                error: result.error 
            }));
        }
    }
    // Handle invalid routes
    else if (!['/files'].includes(req.url) && !urlParts[1]?.startsWith('files')) {
        // Set response status to 404 (Not Found) and content type to JSON
        res.writeHead(404, { 'Content-Type': 'application/json' });
        // Send not found response
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
    // Handle unsupported HTTP methods
    else {
        // Set response status to 405 (Method Not Allowed) and content type to JSON
        res.writeHead(405, { 'Content-Type': 'application/json' });
        // Send method not allowed response
        res.end(JSON.stringify({ message: 'Method not allowed' }));
    }
});

// Define the port number for the server
const PORT = 3000;
// Start the server and listen on the specified port
server.listen(PORT, () => {
    // Log a message when the server starts successfully
    console.log(`Server running on port ${PORT}`);
});