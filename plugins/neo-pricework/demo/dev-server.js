/**
 * Local dev server for the neo-pricework demo harness.
 *
 *   npm run dev            -> http://localhost:4321/demo/
 *   PORT=5000 npm run dev  -> custom port
 *
 * - Rebuilds the plugin with webpack (same config as `npm run build`) whenever src/ changes.
 * - Builds go to .dev-build/ (gitignored). Requests for /dist/* are served from there first,
 *   so the committed dist/ bundle is only changed by an explicit `npm run build`.
 * - Tells connected demo pages to reload after each successful build or demo/ file change,
 *   and sends build errors to the page instead of reloading.
 * - Listens on 127.0.0.1 only and serves files from the plugin folder only.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const baseConfig = require('../webpack.config.js');

const ROOT = path.resolve(__dirname, '..');
const DEV_BUILD = path.join(ROOT, '.dev-build');
const DEMO_DIR = __dirname;
const PORT = Number(process.env.PORT) || 4321;
const HOST = '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

// ---- live reload (Server-Sent Events) ---------------------------------------------------

const clients = new Set();
let lastBuildError = null;

function send(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function broadcast(event, data) {
  for (const res of clients) send(res, event, data);
}

function handleLiveReload(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store',
    Connection: 'keep-alive',
  });
  res.write(': connected\n\n');
  if (lastBuildError) send(res, 'build-error', { message: lastBuildError });
  clients.add(res);
  const keepAlive = setInterval(() => res.write(': ping\n\n'), 25000);
  req.on('close', () => {
    clearInterval(keepAlive);
    clients.delete(res);
  });
}

// ---- static files -----------------------------------------------------------------------

function resolveFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const candidates = [];
  if (decoded.startsWith('/dist/')) {
    candidates.push(path.join(DEV_BUILD, decoded.slice('/dist/'.length)));
  }
  candidates.push(path.join(ROOT, decoded));

  for (let candidate of candidates) {
    candidate = path.normalize(candidate);
    const inside = candidate === ROOT || candidate.startsWith(ROOT + path.sep);
    if (!inside) continue;
    try {
      let stat = fs.statSync(candidate);
      if (stat.isDirectory()) {
        candidate = path.join(candidate, 'index.html');
        stat = fs.statSync(candidate);
      }
      if (stat.isFile()) return candidate;
    } catch {
      // try next candidate
    }
  }
  return null;
}

function handleStatic(req, res, pathname) {
  if (pathname === '/') {
    res.writeHead(302, { Location: '/demo/' });
    res.end();
    return;
  }
  // Directory URLs without a trailing slash break relative paths in index.html.
  if (!path.extname(pathname) && !pathname.endsWith('/')) {
    const dir = resolveFile(pathname + '/');
    if (dir) {
      res.writeHead(302, { Location: pathname + '/' });
      res.end();
      return;
    }
  }
  const file = resolveFile(pathname);
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  res.writeHead(200, {
    'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405);
    res.end();
    return;
  }
  if (pathname === '/__livereload') return handleLiveReload(req, res);
  return handleStatic(req, res, pathname);
});

// ---- webpack watch ----------------------------------------------------------------------

const compiler = webpack({
  ...baseConfig,
  devtool: 'source-map',
  output: { ...baseConfig.output, path: DEV_BUILD },
});

let firstBuild = true;
compiler.watch({ aggregateTimeout: 150 }, (err, stats) => {
  const time = new Date().toLocaleTimeString();
  if (err) {
    lastBuildError = err.stack || String(err);
    console.error(`[${time}] webpack failed:\n${lastBuildError}`);
    broadcast('build-error', { message: lastBuildError });
    return;
  }
  if (stats.hasErrors()) {
    // Drop Babel/webpack internal stack frames; keep the message and code frame.
    lastBuildError = stats.toString({ all: false, errors: true, colors: false })
      .split('\n')
      .filter((line) => !/^\s+at /.test(line))
      .join('\n')
      .trim();
    console.error(`[${time}] build failed:\n${lastBuildError}`);
    broadcast('build-error', { message: lastBuildError });
    return;
  }
  lastBuildError = null;
  console.log(`[${time}] build ok (${stats.endTime - stats.startTime} ms)`);
  // Also reload on the first build so pages left open from a previous run pick it up.
  broadcast('reload', { reason: firstBuild ? 'initial build' : 'plugin rebuilt' });
  firstBuild = false;
});

// ---- demo file watch --------------------------------------------------------------------

let demoTimer = null;
fs.watch(DEMO_DIR, (eventType, filename) => {
  // Ignore the server itself, dotfiles, and directory-level events some platforms emit.
  if (!filename || filename === path.basename(__filename) || filename.startsWith('.') ||
      filename === path.basename(DEMO_DIR)) return;
  clearTimeout(demoTimer);
  demoTimer = setTimeout(() => {
    console.log(`[${new Date().toLocaleTimeString()}] demo/${filename} changed`);
    broadcast('reload', { reason: `demo/${filename} changed` });
  }, 100);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other server or run: PORT=<port> npm run dev`);
  } else {
    console.error(error);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`neo-pricework demo: http://localhost:${PORT}/demo/`);
  console.log('Watching src/ and demo/ — the page reloads automatically. Ctrl+C to stop.');
});

function shutdown() {
  compiler.close(() => {});
  for (const res of clients) res.end();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 500).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
