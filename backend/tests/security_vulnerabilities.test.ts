import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { handleApiRequest } from '../apiHandler.js';

let server: http.Server;
const TEST_PORT = 3199;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
};

function createTestServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

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

    let reqPath = '/index.html';
    try {
      const parsedUrl = new URL(req.url || '/', `http://localhost:${TEST_PORT}`);
      reqPath = decodeURIComponent(parsedUrl.pathname);
    } catch {
      res.statusCode = 400;
      res.end('Bad Request');
      return;
    }

    if (reqPath === '/' || !reqPath) reqPath = '/index.html';

    const safeRelativePath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '');
    let resolvedFilePath = path.resolve(DIST_DIR, '.' + safeRelativePath);

    if (!resolvedFilePath.startsWith(DIST_DIR)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    if (!fs.existsSync(resolvedFilePath) || fs.statSync(resolvedFilePath).isDirectory()) {
      resolvedFilePath = path.join(DIST_DIR, 'index.html');
    }

    try {
      const ext = path.extname(resolvedFilePath);
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const content = fs.readFileSync(resolvedFilePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(content);
    } catch {
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });
}

beforeAll(async () => {
  server = createTestServer();
  await new Promise<void>((resolve) => server.listen(TEST_PORT, () => resolve()));
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe('Security & Vulnerability Defenses', () => {
  it('prevents path traversal outside dist directory', async () => {
    // Attempting to read package.json via directory traversal
    const res = await fetch(`http://localhost:${TEST_PORT}/../../package.json`);
    // Should NOT return package.json content (must either be 403 or fallback index.html without package.json contents)
    const text = await res.text();
    expect(text).not.toContain('"name": "careroute-startup-mvp"');
  });

  it('rejects HTTP methods other than GET and HEAD on static endpoints with 405', async () => {
    const res = await fetch(`http://localhost:${TEST_PORT}/index.html`, {
      method: 'POST',
      body: 'test',
    });
    expect(res.status).toBe(405);
    const body = await res.text();
    expect(body).toBe('Method Not Allowed');
  });

  it('attaches defensive security headers to API and static responses', async () => {
    const res = await fetch(`http://localhost:${TEST_PORT}/api/health`);
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(res.headers.get('x-frame-options')).toBe('SAMEORIGIN');
    expect(res.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
  });

  it('rejects oversized JSON bodies to prevent DoS attacks with 413 Payload Too Large', async () => {
    // Generate an oversized string > 1MB
    const oversized = 'x'.repeat(1.2 * 1024 * 1024);
    const res = await fetch(`http://localhost:${TEST_PORT}/api/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ displayName: oversized }),
    });
    expect(res.status).toBe(413);
    const body = await res.json();
    expect(body.error).toContain('Payload too large');
  });

  it('returns 400 Bad Request on malformed JSON without crashing server', async () => {
    const res = await fetch(`http://localhost:${TEST_PORT}/api/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{ this is not valid json }',
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Malformed JSON payload.');
  });

  it('sanitizes prototype pollution attempts in request body', async () => {
    const res = await fetch(`http://localhost:${TEST_PORT}/api/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        displayName: 'Security Test Patient',
        __proto__: { polluted: 'true' },
      }),
    });
    expect([201, 200]).toContain(res.status);
    expect(Reflect.get(Object.prototype, 'polluted')).toBeUndefined();
  });

  it('rejects invalid ID format with 400 Bad Request', async () => {
    const res = await fetch(`http://localhost:${TEST_PORT}/api/patients/bad%20id%20$invalid`);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid patient ID format.');
  });

  it('restricts CORS by refusing wildcard reflection for untrusted third-party origins', async () => {
    const res = await fetch(`http://localhost:${TEST_PORT}/api/health`, {
      headers: {
        Origin: 'https://malicious-attacker-website.com',
      },
    });
    const allowOrigin = res.headers.get('access-control-allow-origin');
    expect(allowOrigin).not.toBe('*');
    expect(allowOrigin).not.toBe('https://malicious-attacker-website.com');
  });

  it('generates and verifies cryptographic HMAC session tokens', async () => {
    const res = await fetch(`http://localhost:${TEST_PORT}/api/auth/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'Supervisor', userId: 'SUP-01' }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.token).toBeDefined();
    expect(data.token).toContain('.');

    // Query with valid cryptographic Bearer token
    const testReq = await fetch(`http://localhost:${TEST_PORT}/api/rules`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
    expect(testReq.status).toBe(200);
  });
});
