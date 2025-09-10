#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// MIME types mapping
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname;

  // Determine file path
  let filePath;
  if (pathname === '/' || pathname === '/test') {
    filePath = path.join(__dirname, 'test.html');
  } else {
    filePath = path.join(__dirname, pathname);
  }

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
        return;
      }

      const mimeType = getMimeType(filePath);
      res.writeHead(200, { 
        'Content-Type': mimeType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Neo Scheduler Test Server`);
  console.log(`📍 Server running at http://localhost:${PORT}`);
  console.log(`🧪 Test page: http://localhost:${PORT}/test`);
  console.log(`\n💡 To stop the server, press Ctrl+C\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
