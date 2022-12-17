const http = require('http');
const PORT = 8008;
const routes = require('./routes')

const server = http.createServer(routes)

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})

console.log('Listening on port 5000...');
