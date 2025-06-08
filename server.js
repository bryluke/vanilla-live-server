const http = require('http');
const fs = require('fs');
const path = require('path');
const WS = require('ws');
const chokidar = require('chokidar');

const targetDirArg = process.argv[2] || '.';
const TARGET_DIR = path.resolve(process.cwd(), targetDirArg);

try {
    const stats = fs.statSync(TARGET_DIR);
    if (!stats.isDirectory()) {
        console.error(`Error: The specified target '${TARGET_DIR}' is not a directory.`);
        process.exit(1);
    }
} catch (err) {
    if (err.code === 'ENOENT') {
        console.error(`Error: The specified target directory '${TARGET_DIR}' does not exist.`);
        process.exit(1);
    } else {
        console.error(`Error reading target directory '${TARGET_DIR}': ${err.message}`);
    }
    process.exit(1);
}

const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const INJECTED_SCRIPT = `
    <script>
        const ws = new WebSocket('ws://localhost:${PORT}');
        ws.onmessage = (event) => {
            if (event.data === 'reload') {
                console.log('Reloading...');
                window.location.reload();
            }
        };
        ws.onopen = () => console.log('Live-server connection established.');
        ws.onerror = (err) => console.error('Live-server WebSocket error:', err);
    </script>
`;

const server =  http.createServer((req, res) => {
  let filePath = path.join(TARGET_DIR, req.url === '/' ? 'index.html' : req.url);
  let extname = String(path.extname(filePath));
  let contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      if (contentType === 'text/html') {
        content += INJECTED_SCRIPT;
      }
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Watching for file changes in ${TARGET_DIR}`);
  console.log('Use Ctrl+C to stop the server.');
  console.log('WebSocket server is ready for live reload.');
  console.log('Connect your browser to see live updates.');
  console.log(`Open your browser and navigate to http://localhost:${PORT}`);
});

const wss = new WS.Server({ server });

wss.on('connection', ws => {
    console.log('🔗 Client connected');
    ws.on('close', () => {
        console.log('🔌 Client disconnected');
    });
});

function broadcast(message) {
    console.log(`📢 Broadcasting message to all clients: ${message}`);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

chokidar.watch(TARGET_DIR, { ignored: /node_modules/ }).on('all', (event, path) => {
    if (event === 'change') {
        console.log(`✔️ File changed: ${path}`);
        broadcast('reload');
    }
});
