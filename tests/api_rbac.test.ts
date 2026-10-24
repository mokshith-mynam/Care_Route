import { describe, expect, it } from 'vitest';
import { EventEmitter } from 'node:events';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleApiRequest } from '../src/server/apiHandler.js';

interface MockResponseResult<T = Record<string, unknown>> {
  statusCode: number;
  data: T;
  headers: Record<string, string>;
}

interface MockResponse {
  setHeader: (k: string, v: string) => void;
  statusCode: number;
  end: (chunk?: string) => void;
  data: Promise<MockResponseResult>;
}

function mockReq(url: string, method: string, headers: Record<string, string> = {}, body: unknown = null): IncomingMessage {
  const req = new EventEmitter() as unknown as IncomingMessage & {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
  req.url = url;
  req.method = method;
  req.headers = { ...headers };
  process.nextTick(() => {
    if (body) req.emit('data', JSON.stringify(body));
    req.emit('end');
  });
  return req as IncomingMessage;
}

function mockRes(): MockResponse {
  let statusCode = 200;
  const headers: Record<string, string> = {};
  let bodyStr = '';

  let resolveData: (val: MockResponseResult) => void;
  const data = new Promise<MockResponseResult>((resolve) => {
    resolveData = resolve;
  });

  return {
    setHeader: (k: string, v: string) => {
      headers[k] = v;
    },
    set statusCode(code: number) {
      statusCode = code;
    },
    get statusCode() {
      return statusCode;
    },
    end: (chunk?: string) => {
      if (chunk) bodyStr += chunk;
      let parsed: Record<string, unknown> = {};
      try {
        parsed = JSON.parse(bodyStr || '{}') as Record<string, unknown>;
      } catch {
        parsed = { raw: bodyStr };
      }
      resolveData({ statusCode, data: parsed, headers });
    },
    data,
  };
}

describe('CareRoute Backend API & SQLite Persistence', () => {
  it('GET /api/health returns database status and synthetic counts', async () => {
    const req = mockReq('/api/health', 'GET');
    const res = mockRes();
    await handleApiRequest(req, res as unknown as ServerResponse);
    const result = await res.data;

    expect(result.statusCode).toBe(200);
    expect(result.data.status).toBe('ok');
    expect(String(result.data.engine)).toContain('SQLite');
    const records = result.data.records as { patients: number };
    expect(records.patients).toBeGreaterThanOrEqual(12);
    expect(String(result.data.safetyNotice)).toContain('Synthetic data only');
  });

  it('GET /api/patients returns list of fictional patients with consent', async () => {
    const req = mockReq('/api/patients', 'GET');
    const res = mockRes();
    await handleApiRequest(req, res as unknown as ServerResponse);
    const result = await res.data;

    expect(result.statusCode).toBe(200);
    expect(Array.isArray(result.data)).toBe(true);
    const list = result.data as unknown as Array<{ displayName: string; facility: string }>;
    expect(list.length).toBeGreaterThanOrEqual(12);
    expect(list[0]).toHaveProperty('displayName');
    expect(list[0]).toHaveProperty('facility');
  });

  it('POST /api/patients/:id/observations records neutral observation with author', async () => {
    const req = mockReq(
      '/api/patients/CR-1001/observations',
      'POST',
      { 'x-careroute-role': 'Health worker', 'x-careroute-user': 'HW-01' },
      {
        screeningType: 'Transportation Access Check',
        observationNotes: 'Patient completed routine transportation assistance screening.',
      }
    );
    const res = mockRes();
    await handleApiRequest(req, res as unknown as ServerResponse);
    const result = await res.data;

    expect(result.statusCode).toBe(201);
    expect(result.data.patientId).toBe('CR-1001');
    expect(result.data.recordedBy).toBe('HW-01');
    expect(result.data.screeningType).toBe('Transportation Access Check');
  });

  it('POST /api/patients/:id/consent records caregiver-sharing consent', async () => {
    const req = mockReq(
      '/api/patients/CR-1003/consent',
      'POST',
      { 'x-careroute-role': 'Health worker', 'x-careroute-user': 'HW-02' },
      {
        status: 'Active',
        caregiverName: 'Salma Z. (Sister)',
        scope: 'Appointment and follow-up scheduling only',
      }
    );
    const res = mockRes();
    await handleApiRequest(req, res as unknown as ServerResponse);
    const result = await res.data;

    expect(result.statusCode).toBe(200);
    expect(result.data.status).toBe('Active');
    expect(result.data.caregiverName).toBe('Salma Z. (Sister)');
  });

  it('PATCH /api/follow-ups/:id reschedules task with administrative reason', async () => {
    const req = mockReq(
      '/api/follow-ups/FU-3001',
      'PATCH',
      { 'x-careroute-role': 'Health worker', 'x-careroute-user': 'HW-01' },
      {
        dueDate: '2026-10-28',
        status: 'Rescheduled',
        rescheduleReason: 'Patient requested shift to morning slot',
      }
    );
    const res = mockRes();
    await handleApiRequest(req, res as unknown as ServerResponse);
    const result = await res.data;

    expect(result.statusCode).toBe(200);
    expect(result.data.status).toBe('Rescheduled');
    expect(result.data.dueDate).toBe('2026-10-28');
    expect(result.data.rescheduleReason).toBe('Patient requested shift to morning slot');
  });

  it('PATCH /api/referrals/:id marks referral as Unable to Confirm with documented reason', async () => {
    const req = mockReq(
      '/api/referrals/RF-2005',
      'PATCH',
      { 'x-careroute-role': 'Health worker', 'x-careroute-user': 'HW-03' },
      {
        status: 'Unable to Confirm',
        unableToConfirmReason: 'Receiving clinic unreachable after 3 contact attempts',
      }
    );
    const res = mockRes();
    await handleApiRequest(req, res as unknown as ServerResponse);
    const result = await res.data;

    expect(result.statusCode).toBe(200);
    expect(result.data.status).toBe('Unable to Confirm');
    expect(result.data.unableToConfirmReason).toBe('Receiving clinic unreachable after 3 contact attempts');
  });
});

describe('Backend Role-Based Access Control (RBAC) Enforcement', () => {
  it('rejects Health worker attempts to modify administrative routing rules with HTTP 403', async () => {
    const req = mockReq(
      '/api/rules',
      'PUT',
      { 'x-careroute-role': 'Health worker', 'x-careroute-user': 'HW-01' },
      { overdueGraceDays: 5 }
    );
    const res = mockRes();
    await handleApiRequest(req, res as unknown as ServerResponse);
    const result = await res.data;

    expect(result.statusCode).toBe(403);
    expect(String(result.data.error)).toContain('Permission denied');
    expect(String(result.data.requiredRole)).toContain('Supervisor');
  });

  it('rejects Clinical reviewer attempts to modify administrative routing rules with HTTP 403', async () => {
    const req = mockReq(
      '/api/rules',
      'PUT',
      { 'x-careroute-role': 'Clinical reviewer', 'x-careroute-user': 'CR-01' },
      { overdueGraceDays: 5 }
    );
    const res = mockRes();
    await handleApiRequest(req, res as unknown as ServerResponse);
    const result = await res.data;

    expect(result.statusCode).toBe(403);
    expect(String(result.data.error)).toContain('Permission denied');
  });

  it('permits Supervisors to modify administrative routing rules with HTTP 200', async () => {
    const req = mockReq(
      '/api/rules',
      'PUT',
      { 'x-careroute-role': 'Supervisor', 'x-careroute-user': 'SUP-01' },
      {
        overdueGraceDays: 2,
        referralReviewDays: 3,
        referralInactivityDays: 7,
      }
    );
    const res = mockRes();
    await handleApiRequest(req, res as unknown as ServerResponse);
    const result = await res.data;

    expect(result.statusCode).toBe(200);
    expect(result.data.overdueGraceDays).toBe(2);
    expect(result.data.referralReviewDays).toBe(3);
    expect(result.data.referralInactivityDays).toBe(7);
  });
});
