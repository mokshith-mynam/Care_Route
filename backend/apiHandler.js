import crypto from 'node:crypto';
import * as db from './db.js';

const MAX_BODY_SIZE = 1024 * 1024; // 1MB payload ceiling to prevent DoS
const VALID_ID_PATTERN = /^[A-Za-z0-9_-]+$/;
const SESSION_SECRET = process.env.CAREROUTE_SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const DEMO_MODE = process.env.CAREROUTE_DEMO_MODE !== 'false';

// In-memory rate limiting map per client IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_GENERAL_REQUESTS = 500;
const MAX_DESTRUCTIVE_REQUESTS = 60;

function checkRateLimit(req, isDestructive = false) {
  const ip = req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const key = `${ip}:${isDestructive ? 'destruct' : 'general'}`;
  const max = isDestructive ? MAX_DESTRUCTIVE_REQUESTS : MAX_GENERAL_REQUESTS;

  let record = rateLimitMap.get(key);
  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    record = { count: 1, startTime: now };
    rateLimitMap.set(key, record);
    return true;
  }

  record.count += 1;
  return record.count <= max;
}

export function createSessionToken(role, userId) {
  const payload = Buffer.from(
    JSON.stringify({
      role,
      userId,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000,
    })
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadStr, signature] = parts;
  try {
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('base64url');
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const data = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (data.exp && data.exp < Date.now()) return null;
    return { role: data.role, userId: data.userId };
  } catch {
    return null;
  }
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const clean = Object.create(null);
  for (const [key, value] of Object.entries(obj)) {
    // Prevent Prototype Pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    clean[key] = sanitizeObject(value);
  }
  return clean;
}

function setApiSecurityHeaders(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Cache-Control', 'no-store');

  const origin = req?.headers?.origin;
  if (origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CareRoute-Role, X-CareRoute-User, Authorization, X-Requested-With');
}

export async function handleApiRequest(req, res) {
  setApiSecurityHeaders(req, res);

  let urlObj;
  try {
    urlObj = new URL(req.url, 'http://localhost');
  } catch {
    sendJson(res, 400, { error: 'Invalid request URL.' });
    return;
  }

  const pathname = urlObj.pathname;
  const method = (req.method || 'GET').toUpperCase();

  // Enforce rate limiting
  const isDestructive = pathname === '/api/reset' || pathname === '/api/delete-data';
  if (!checkRateLimit(req, isDestructive)) {
    res.setHeader('Retry-After', '60');
    sendJson(res, 429, { error: 'Too many requests. Rate limit exceeded. Please wait a moment.' });
    return;
  }

  // Extract actor from verified Authorization Bearer token or fallback to validated headers
  let actor = null;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    actor = verifySessionToken(token);
  }

  if (!actor && !DEMO_MODE && pathname !== '/api/auth/session') {
    sendJson(res, 401, { error: 'A valid Bearer session token is required.' });
    return;
  }

  if (!actor) {
    const rawRole = String(req.headers['x-careroute-role'] || 'Health worker').trim();
    const allowedRoles = ['Health worker', 'Supervisor', 'Clinical reviewer', 'Administrator'];
    const role = allowedRoles.includes(rawRole) ? rawRole : 'Health worker';
    const defaultUser = role === 'Supervisor' ? 'SUP-01' : role === 'Clinical reviewer' ? 'CR-01' : role === 'Administrator' ? 'ADM-01' : 'HW-01';
    const rawUser = String(req.headers['x-careroute-user'] || defaultUser).trim().slice(0, 50);
    const userId = VALID_ID_PATTERN.test(rawUser) ? rawUser : defaultUser;
    actor = { role, userId };
  }
  const role = actor.role;

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch (parseErr) {
      if (parseErr.code === 'PAYLOAD_TOO_LARGE') {
        res.setHeader('Connection', 'close');
        sendJson(res, 413, { error: 'Payload too large. Maximum body size is 1MB.' });
        return;
      }
      sendJson(res, 400, { error: 'Malformed JSON payload.' });
      return;
    }

    // 0. Cryptographic Authentication & Session Tokens
    if (pathname === '/api/auth/session') {
      if (method === 'POST') {
        const reqRole = String(body.role || actor.role);
        const allowedRoles = ['Health worker', 'Supervisor', 'Clinical reviewer', 'Administrator'];
        const targetRole = allowedRoles.includes(reqRole) ? reqRole : 'Health worker';
        const defaultUser = targetRole === 'Supervisor' ? 'SUP-01' : targetRole === 'Clinical reviewer' ? 'CR-01' : targetRole === 'Administrator' ? 'ADM-01' : 'HW-01';
        const targetUser = VALID_ID_PATTERN.test(String(body.userId || '')) ? String(body.userId).slice(0, 50) : defaultUser;
        const token = createSessionToken(targetRole, targetUser);
        sendJson(res, 200, { token, actor: { role: targetRole, userId: targetUser } });
        return;
      }
      if (method === 'GET') {
        const token = createSessionToken(actor.role, actor.userId);
        sendJson(res, 200, { token, actor });
        return;
      }
    }

    // 1. Health check & system metadata
    if (pathname === '/api/health' && method === 'GET') {
      const patients = db.getPatients();
      const followUps = db.getFollowUps();
      const referrals = db.getReferrals();
      sendJson(res, 200, {
        status: 'ok',
        engine: 'Node.js SQLite (node:sqlite DatabaseSync)',
        storagePath: 'database/local/careroute.db',
        records: {
          patients: patients.length,
          followUps: followUps.length,
          referrals: referrals.length,
        },
        safetyNotice: 'Administrative coordination prototype. Synthetic data only. Does not provide medical diagnosis or calculate clinical urgency.',
        activeActor: actor,
      });
      return;
    }

    // 2. Patients API
    if (pathname === '/api/patients' && method === 'GET') {
      const q = (urlObj.searchParams.get('q') || '').toLowerCase().slice(0, 100);
      const facility = (urlObj.searchParams.get('facility') || '').slice(0, 100);
      let patients = db.getPatients();
      if (q) {
        patients = patients.filter((p) =>
          `${p.id} ${p.displayName} ${p.facility}`.toLowerCase().includes(q)
        );
      }
      if (facility) {
        patients = patients.filter((p) => p.facility === facility);
      }
      sendJson(res, 200, patients);
      return;
    }

    if (pathname === '/api/patients' && method === 'POST') {
      if (!body.displayName || typeof body.displayName !== 'string' || !body.displayName.trim()) {
        sendJson(res, 400, { error: 'Valid display name is required.' });
        return;
      }
      const created = db.createPatient(body, actor);
      sendJson(res, 201, created);
      return;
    }

    const patientDetailMatch = pathname.match(/^\/api\/patients\/([^/]+)$/);
    if (patientDetailMatch && method === 'GET') {
      const patientId = patientDetailMatch[1];
      if (!VALID_ID_PATTERN.test(patientId)) {
        sendJson(res, 400, { error: 'Invalid patient ID format.' });
        return;
      }
      const patient = db.getPatientById(patientId);
      if (!patient) {
        sendJson(res, 404, { error: `Patient ${patientId} not found.` });
        return;
      }
      sendJson(res, 200, patient);
      return;
    }

    const observationMatch = pathname.match(/^\/api\/patients\/([^/]+)\/observations$/);
    if (observationMatch && method === 'POST') {
      const patientId = observationMatch[1];
      if (!VALID_ID_PATTERN.test(patientId)) {
        sendJson(res, 400, { error: 'Invalid patient ID format.' });
        return;
      }
      if (!body.observationNotes || typeof body.observationNotes !== 'string' || !body.observationNotes.trim()) {
        sendJson(res, 400, { error: 'Observation notes are required.' });
        return;
      }
      const obs = db.addObservation(
        patientId,
        {
          screeningType: String(body.screeningType || 'Routine Community Screening').slice(0, 100),
          observationNotes: String(body.observationNotes).slice(0, 2000),
        },
        actor
      );
      sendJson(res, 201, obs);
      return;
    }

    const consentMatch = pathname.match(/^\/api\/patients\/([^/]+)\/consent$/);
    if (consentMatch && method === 'POST') {
      const patientId = consentMatch[1];
      if (!VALID_ID_PATTERN.test(patientId)) {
        sendJson(res, 400, { error: 'Invalid patient ID format.' });
        return;
      }
      const updatedConsent = db.updateConsent(patientId, body, actor);
      sendJson(res, 200, updatedConsent);
      return;
    }

    // 3. Follow-Ups API
    if (pathname === '/api/follow-ups' && method === 'GET') {
      const status = urlObj.searchParams.get('status');
      const worker = urlObj.searchParams.get('worker');
      let followUps = db.getFollowUps();
      if (status) {
        followUps = followUps.filter((f) => f.status === status);
      }
      if (worker) {
        followUps = followUps.filter((f) => f.assignedWorker === worker);
      }
      sendJson(res, 200, followUps);
      return;
    }

    if (pathname === '/api/follow-ups' && method === 'POST') {
      if (!body.patientId || !body.dueDate || !body.reason) {
        sendJson(res, 400, { error: 'patientId, dueDate, and reason are required.' });
        return;
      }
      const created = db.createFollowUp(body, actor);
      sendJson(res, 201, created);
      return;
    }

    const followUpDetailMatch = pathname.match(/^\/api\/follow-ups\/([^/]+)$/);
    if (followUpDetailMatch && method === 'PATCH') {
      const id = followUpDetailMatch[1];
      if (!VALID_ID_PATTERN.test(id)) {
        sendJson(res, 400, { error: 'Invalid follow-up ID format.' });
        return;
      }
      const updated = db.updateFollowUp(id, body, actor);
      if (!updated) {
        sendJson(res, 404, { error: `Follow-up ${id} not found.` });
        return;
      }
      sendJson(res, 200, updated);
      return;
    }

    // 4. Referrals API
    if (pathname === '/api/referrals' && method === 'GET') {
      const status = urlObj.searchParams.get('status');
      let referrals = db.getReferrals();
      if (status) {
        referrals = referrals.filter((r) => r.status === status);
      }
      sendJson(res, 200, referrals);
      return;
    }

    if (pathname === '/api/referrals' && method === 'POST') {
      if (!body.patientId || !body.destination) {
        sendJson(res, 400, { error: 'patientId and destination are required.' });
        return;
      }
      const created = db.createReferral(body, actor);
      sendJson(res, 201, created);
      return;
    }

    const referralDetailMatch = pathname.match(/^\/api\/referrals\/([^/]+)$/);
    if (referralDetailMatch && method === 'PATCH') {
      const id = referralDetailMatch[1];
      if (!VALID_ID_PATTERN.test(id)) {
        sendJson(res, 400, { error: 'Invalid referral ID format.' });
        return;
      }
      const updated = db.updateReferral(id, body, actor);
      if (!updated) {
        sendJson(res, 404, { error: `Referral ${id} not found.` });
        return;
      }
      sendJson(res, 200, updated);
      return;
    }

    // 5. Rules API (RBAC PROTECTED!)
    if (pathname === '/api/rules' && method === 'GET') {
      const rules = db.getRules();
      sendJson(res, 200, rules);
      return;
    }

    if (pathname === '/api/rules' && (method === 'PUT' || method === 'POST')) {
      // Backend permission enforcement!
      if (role !== 'Supervisor' && role !== 'Administrator') {
        sendJson(res, 403, {
          error: `Permission denied: ${role}s are not permitted to modify administrative routing rules. Only Supervisors and Administrators can configure routing thresholds.`,
          requiredRole: 'Supervisor or Administrator',
          providedRole: role,
        });
        return;
      }

      const updated = db.updateRules(body, actor);
      sendJson(res, 200, updated);
      return;
    }

    // 6. Analytics API
    if (pathname === '/api/analytics' && method === 'GET') {
      const today = urlObj.searchParams.get('today') || '2026-10-23';
      const summary = db.getAnalyticsSummary(today);
      sendJson(res, 200, summary);
      return;
    }

    // 7. Audit Timeline API
    if (pathname === '/api/timeline' && method === 'GET') {
      const rawLimit = Number(urlObj.searchParams.get('limit'));
      const limit = Number.isFinite(rawLimit) && rawLimit > 0 && rawLimit <= 500 ? rawLimit : 100;
      const events = db.getAuditEvents(limit);
      sendJson(res, 200, events);
      return;
    }

    // 8. Demo Data Reset & Purge (RBAC PROTECTED!)
    if (pathname === '/api/reset' && method === 'POST') {
      if (role !== 'Supervisor' && role !== 'Administrator') {
        sendJson(res, 403, {
          error: `Permission denied: Only Supervisors and Administrators can reset the system demo dataset.`,
          providedRole: role,
        });
        return;
      }
      const result = db.resetDatabase();
      sendJson(res, 200, result);
      return;
    }

    if (pathname === '/api/delete-data' && method === 'POST') {
      if (role !== 'Supervisor' && role !== 'Administrator') {
        sendJson(res, 403, {
          error: `Permission denied: Only Supervisors and Administrators can purge local demo data.`,
          providedRole: role,
        });
        return;
      }
      const result = db.purgeDatabase();
      sendJson(res, 200, result);
      return;
    }

    // Fallthrough - 404 for unknown /api endpoint
    sendJson(res, 404, { error: `Endpoint not found: ${method} ${pathname}` });
  } catch (err) {
    console.error('API Error:', err);
    sendJson(res, 500, { error: 'Internal server error' });
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    let bytesReceived = 0;

    req.on('data', (chunk) => {
      bytesReceived += chunk.length;
      if (bytesReceived > MAX_BODY_SIZE) {
        req.pause();
        const err = new Error('Payload too large');
        err.code = 'PAYLOAD_TOO_LARGE';
        return reject(err);
      }
      data += chunk;
    });

    req.on('end', () => {
      if (!data || !data.trim()) return resolve({});
      try {
        const parsed = JSON.parse(data);
        if (typeof parsed !== 'object' || parsed === null) {
          return resolve({});
        }
        resolve(sanitizeObject(parsed));
      } catch (err) {
        reject(err);
      }
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.end(JSON.stringify(obj));
}
