const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Function to create a file with a message
const createFileWithMessage = (fileName, message, res) => {
    fs.writeFile(fileName, message, (err) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error creating file');
        } else {
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('File created successfully');
        }
    });
};

// Function to delete a file
const deleteFileByName = (fileName, res) => {
    fs.unlink(fileName, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('File deleted successfully');
        }
    });
}

// Function to read a file
const readFileContents = (fileName, res) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        }
    });
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const urlParts = req.url.split('/');

    if (req.method === 'POST' && req.url === '/files') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { fileName, message } = JSON.parse(body);
            if (!fileName || !message) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                return res.end('Missing fileName or message');
            }
            createFileWithMessage(fileName, message, res);
        });
    } 
    else if (req.method === 'DELETE' && urlParts[1] === 'files' && urlParts[2]) {
        const fileName = path.join(__dirname, urlParts[2]);
        deleteFileByName(fileName, res);
    }
    else if (req.method === 'GET' && urlParts[1] === 'files' && urlParts[2]) {
        const fileName = path.join(__dirname, urlParts[2]);
        readFileContents(fileName, res);
    }
    else {
        res.writeHead(req.method === 'GET' || req.method === 'POST' || req.method === 'DELETE' ? 404 : 405, { 'Content-Type': 'text/plain' });
        res.end(req.method === 'GET' || req.method === 'POST' || req.method === 'DELETE' ? 'Not Found' : 'Method Not Allowed');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});