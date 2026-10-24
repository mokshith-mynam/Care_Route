import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { handleApiRequest } from './src/server/apiHandler.js';

const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://*.supabase.co; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
  );
}

const server = http.createServer(async (req, res) => {
  setSecurityHeaders(res);

  // 1. API routes
  if (req.url && req.url.startsWith('/api')) {
    return handleApiRequest(req, res);
  }

  // 2. Only allow GET and HEAD for static files
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD');
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.end('Method Not Allowed');
    return;
  }

  // 3. Static file serving from dist/
  if (!fs.existsSync(DIST_DIR)) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>CareRoute Server</title>
        </head>
        <body style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: auto;">
          <h2>CareRoute Backend API Server is Running</h2>
          <p>The static frontend has not been built yet. Run <code>npm run build</code> to generate the client bundle, or run <code>npm run dev</code> for development mode.</p>
          <p><a href="/api/health">Check API Health (/api/health)</a></p>
        </body>
      </html>
    `);
    return;
  }

  let reqPath = '/index.html';
  try {
    const parsedUrl = new URL(req.url || '/', `http://localhost:${PORT}`);
    reqPath = decodeURIComponent(parsedUrl.pathname);
  } catch {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.end('Bad Request');
    return;
  }

  if (reqPath === '/' || !reqPath) reqPath = '/index.html';

  // Secure path normalization and traversal prevention
  const safeRelativePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  let resolvedFilePath = path.resolve(DIST_DIR, '.' + safeRelativePath);

  // Enforce boundary check: resolved path must reside strictly inside DIST_DIR
  if (!resolvedFilePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.end('Forbidden');
    return;
  }

  // SPA fallback if path doesn't exist or is a directory
  if (!fs.existsSync(resolvedFilePath) || fs.statSync(resolvedFilePath).isDirectory()) {
    resolvedFilePath = path.join(DIST_DIR, 'index.html');
  }

  try {
    const ext = path.extname(resolvedFilePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = fs.readFileSync(resolvedFilePath);

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    if (req.method === 'HEAD') {
      res.end();
    } else {
      res.end(content);
    }
  } catch (err) {
    console.error('File serving error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`CareRoute production server listening at http://localhost:${PORT}`);
  console.log(`Database: SQLite (data/careroute.db)`);
  console.log(`API Health: http://localhost:${PORT}/api/health`);
});
