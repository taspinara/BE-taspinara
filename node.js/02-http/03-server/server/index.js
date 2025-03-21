import { createServer } from "http";
import { parse } from "url";
import db from './db.js'

const server = createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    // Get all users
    if (req.method === 'GET' && pathname === '/users') {
        try {
            const result = await db.query('SELECT * FROM users');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database error: ' + err.message);
        }
    }

    // Get all orders
    else if (req.method === 'GET' && pathname === '/orders') {
        try {
            const result = await db.query('SELECT * FROM orders');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database error: ' + err.message);
        }
    }

    // Get user by ID
    else if (req.method === 'GET' && pathname.startsWith('/users/')) {
        const userId = pathname.split('/')[2]; // Extract ID from URL
        try {
            const result = await db.query('SELECT * FROM users WHERE id = $1', [
                userId,
            ]);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database error: ' + err.message);
        }
    }

    // Search users by first_name, last_name, or age
    else if (req.method === 'GET' && pathname === '/search') {
        const column = query.column; // Column name (first_name, last_name, or age)
        const value = query.value; // Search value
        try {
            const result = await db.query(`SELECT * FROM users WHERE ${column} = $1`, 
                [value],
            );
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database error: ' + err.message);
        }
    }

    // Add a new user
    else if (req.method === 'POST' && pathname === '/users') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
            try {
                const { firstname, lastname, age } = JSON.parse(body)[0]; 
                await db.query(
                    'INSERT INTO users (firstname, lastname, age) VALUES ($1, $2, $3)',
                    [firstname, lastname, age]
                );
                res.writeHead(201, { 'Content-Type': 'text/plain' });
                res.end('User added successfully!');
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database error: ' + err.message);
            }
        });
    }

    // Update a user by ID
    else if (req.method === 'PUT' && pathname.startsWith('/users/')) {
        const userId = pathname.split('/')[2];
        
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
            try {
                const { firstname, lastname, age } = JSON.parse(body)[0]; 
                const result = await db.query(
                    'UPDATE users SET firstname = $1, lastname = $2, age = $3 WHERE id = $4 RETURNING *',
                    [firstname, lastname, age, userId]
                );
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.rows));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database error: ' + err.message);
            }
        });
    }

    // Delete a user by ID
    else if (req.method === 'DELETE' && pathname.startsWith('/users/')) {
        const userId = pathname.split('/')[2];
        try {
            // Delete related orders first
            await db.query('DELETE FROM orders WHERE user_id = $1', [userId]);

            // Now delete the user
            const result = await db.query(
                'DELETE FROM users WHERE id = $1 RETURNING *',
                [userId]
            );
            if (result.rowCount === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('User not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.rows[0]));
            }
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database error: ' + err.message);
        }
    }
    
    // Not Found
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, ()  => {
    console.log('Server is running on port 3000');
});