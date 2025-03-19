import http from 'http';

const posts = [
  {
    id: '1',
    title: 'First post',
    content: 'Hello world!'
  },
  {
    id: '2',
    title: 'Second post',
    content: 'My second post!'
  }
];

const requestHandler = (req, res) => {
  const singlePostRegex = /^\/posts\/[0-9a-zA-Z]+$/;
  const { method, url } = req;

  if (url === '/posts') {
    if (method === 'GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(posts));
    } else if (method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const newPost = { id: crypto.randomUUID(), ...JSON.parse(body) };
        posts.push(newPost);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(newPost));
      });
    } else {
      res.statusCode = 405; // Method Not Allowed
      res.setHeader('Content-Type', 'text/plain');
      res.end('Invalid method');
    }
  } else if (singlePostRegex.test(url)) {
    if (method === 'GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`GET request on ${url}`);
    } else if (method === 'PUT') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`PUT request on ${url}`);
    } else if (method === 'DELETE') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`DELETE request on ${url}`);
    } else {
      res.statusCode = 405; // Method Not Allowed
      res.setHeader('Content-Type', 'text/plain');
      res.end('Invalid method');
    }
  } else {
    res.statusCode = 404; // Not Found
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid request');
  }
};

const server = http.createServer(requestHandler);

const port = 3000;
server.listen(port, () => console.log(`Server running at http://localhost:${port}/`));



// curl -X POST -H "Content-Type: application/json" -d '{"title":"Yeni Gönderi","content":"Bu benim yeni gönderim!"}' http://localhost:3000/posts