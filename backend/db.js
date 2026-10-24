import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { defaultRules, demoAuditEvents, demoFollowUps, demoObservations, demoPatients, demoReferrals } from './seedData.js';

const require = createRequire(import.meta.url);
const { DatabaseSync } = require('node:sqlite');

const BACKEND_DIR = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(BACKEND_DIR, '../database/local');
const DB_PATH = path.join(DATA_DIR, 'careroute.db');

let dbInstance = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  dbInstance = new DatabaseSync(DB_PATH);
  dbInstance.exec('PRAGMA journal_mode = WAL;');
  dbInstance.exec('PRAGMA busy_timeout = 5000;');
  initSchema(dbInstance);
  return dbInstance;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      displayName TEXT NOT NULL,
      ageBand TEXT NOT NULL,
      facility TEXT NOT NULL,
      contactPhone TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      lastScreening TEXT NOT NULL,
      observation TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS observations (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      screeningType TEXT NOT NULL,
      observationNotes TEXT NOT NULL,
      recordedBy TEXT NOT NULL,
      recordedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS consents (
      patientId TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      scope TEXT NOT NULL,
      caregiverName TEXT NOT NULL,
      grantedDate TEXT NOT NULL,
      revokedDate TEXT,
      recordedBy TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS follow_ups (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      followUpType TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      status TEXT NOT NULL,
      assignedWorker TEXT NOT NULL,
      reason TEXT NOT NULL,
      rescheduleReason TEXT,
      closeReason TEXT,
      outcome TEXT,
      nextFollowUpDate TEXT,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      destination TEXT NOT NULL,
      receivingService TEXT NOT NULL,
      status TEXT NOT NULL,
      referralDate TEXT NOT NULL,
      appointmentDate TEXT,
      nextFollowUpDate TEXT,
      outcome TEXT,
      unableToConfirmReason TEXT,
      lastUpdatedBy TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS referral_status_history (
      id TEXT PRIMARY KEY,
      referralId TEXT NOT NULL,
      status TEXT NOT NULL,
      note TEXT,
      updatedBy TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      entityType TEXT NOT NULL,
      entityId TEXT NOT NULL,
      action TEXT NOT NULL,
      actorRole TEXT NOT NULL,
      actorId TEXT NOT NULL,
      description TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rule_config (
      id TEXT PRIMARY KEY,
      overdueGraceDays INTEGER NOT NULL,
      contactAttemptsBeforeEscalation INTEGER NOT NULL,
      referralReviewDays INTEGER NOT NULL,
      referralInactivityDays INTEGER NOT NULL,
      flagUnassignedTasks INTEGER NOT NULL,
      flagMissingNextFollowUp INTEGER NOT NULL,
      updatedBy TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // Check if patients table is empty; if so, seed demo data
  const countRow = db.prepare('SELECT COUNT(*) as count FROM patients').get();
  if (!countRow || countRow.count === 0) {
    seedDatabase(db);
  }
}

export function seedDatabase(db = getDb()) {
  const insertPatient = db.prepare(`
    INSERT OR REPLACE INTO patients (id, displayName, ageBand, facility, contactPhone, createdAt, lastScreening, observation, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertConsent = db.prepare(`
    INSERT OR REPLACE INTO consents (patientId, status, scope, caregiverName, grantedDate, revokedDate, recordedBy)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of demoPatients) {
    insertPatient.run(p.id, p.displayName, p.ageBand, p.facility, p.contactPhone, p.createdAt, p.lastScreening, p.observation, p.notes || '');
    if (p.consent) {
      insertConsent.run(p.consent.patientId, p.consent.status, p.consent.scope, p.consent.caregiverName, p.consent.grantedDate, p.consent.revokedDate || null, p.consent.recordedBy);
    }
  }

  const insertObservation = db.prepare(`
    INSERT OR REPLACE INTO observations (id, patientId, screeningType, observationNotes, recordedBy, recordedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const o of demoObservations) {
    insertObservation.run(o.id, o.patientId, o.screeningType, o.observationNotes, o.recordedBy, o.recordedAt);
  }

  const insertFollowUp = db.prepare(`
    INSERT OR REPLACE INTO follow_ups (id, patientId, followUpType, dueDate, status, assignedWorker, reason, rescheduleReason, closeReason, outcome, nextFollowUpDate, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const f of demoFollowUps) {
    insertFollowUp.run(
      f.id,
      f.patientId,
      f.followUpType,
      f.dueDate,
      f.status,
      f.assignedWorker,
      f.reason,
      f.rescheduleReason || null,
      f.closeReason || null,
      f.outcome || null,
      f.nextFollowUpDate || null,
      f.updatedAt
    );
  }

  const insertReferral = db.prepare(`
    INSERT OR REPLACE INTO referrals (id, patientId, destination, receivingService, status, referralDate, appointmentDate, nextFollowUpDate, outcome, unableToConfirmReason, lastUpdatedBy, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const r of demoReferrals) {
    insertReferral.run(
      r.id,
      r.patientId,
      r.destination,
      r.receivingService,
      r.status,
      r.referralDate,
      r.appointmentDate || null,
      r.nextFollowUpDate || null,
      r.outcome || null,
      r.unableToConfirmReason || null,
      r.lastUpdatedBy,
      r.updatedAt
    );
  }

  const insertAudit = db.prepare(`
    INSERT OR REPLACE INTO audit_events (id, entityType, entityId, action, actorRole, actorId, description, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const a of demoAuditEvents) {
    insertAudit.run(a.id, a.entityType, a.entityId, a.action, a.actorRole, a.actorId, a.description, a.timestamp);
  }

  const insertRule = db.prepare(`
    INSERT OR REPLACE INTO rule_config (id, overdueGraceDays, contactAttemptsBeforeEscalation, referralReviewDays, referralInactivityDays, flagUnassignedTasks, flagMissingNextFollowUp, updatedBy, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertRule.run(
    'default',
    defaultRules.overdueGraceDays,
    defaultRules.contactAttemptsBeforeEscalation,
    defaultRules.referralReviewDays,
    defaultRules.referralInactivityDays,
    defaultRules.flagUnassignedTasks ? 1 : 0,
    defaultRules.flagMissingNextFollowUp ? 1 : 0,
    'SYSTEM',
    '2026-10-23'
  );
}

export function resetDatabase() {
  const db = getDb();
  db.exec(`
    DELETE FROM patients;
    DELETE FROM observations;
    DELETE FROM consents;
    DELETE FROM follow_ups;
    DELETE FROM referrals;
    DELETE FROM referral_status_history;
    DELETE FROM audit_events;
    DELETE FROM rule_config;
  `);
  seedDatabase(db);
  return { success: true, message: 'Database successfully restored to original synthetic demo dataset.' };
}

export function purgeDatabase() {
  const db = getDb();
  db.exec(`
    DELETE FROM patients;
    DELETE FROM observations;
    DELETE FROM consents;
    DELETE FROM follow_ups;
    DELETE FROM referrals;
    DELETE FROM referral_status_history;
    DELETE FROM audit_events;
  `);
  return { success: true, message: 'Local database records purged.' };
}

// ----------------- Patient Operations -----------------
export function getPatients() {
  const db = getDb();
  const patients = db.prepare('SELECT * FROM patients ORDER BY id ASC').all();
  const consents = db.prepare('SELECT * FROM consents').all();
  const consentMap = new Map(consents.map((c) => [c.patientId, c]));

  return patients.map((p) => ({
    ...p,
    consent: consentMap.get(p.id) || null,
  }));
}

export function getPatientById(id) {
  const db = getDb();
  const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(id);
  if (!patient) return null;

  const consent = db.prepare('SELECT * FROM consents WHERE patientId = ?').get(id);
  const observations = db.prepare('SELECT * FROM observations WHERE patientId = ? ORDER BY recordedAt DESC').all(id);
  const followUps = db.prepare('SELECT * FROM follow_ups WHERE patientId = ? ORDER BY dueDate ASC').all(id);
  const referrals = db.prepare('SELECT * FROM referrals WHERE patientId = ? ORDER BY referralDate DESC').all(id);
  const auditEvents = db.prepare('SELECT * FROM audit_events WHERE entityId = ? OR description LIKE ? ORDER BY timestamp DESC').all(id, `%${id}%`);

  return {
    ...patient,
    consent: consent || null,
    observations,
    followUps,
    referrals,
    auditEvents,
  };
}

export function createPatient(data, actor) {
  const db = getDb();
  const currentCount = db.prepare('SELECT COUNT(*) as count FROM patients').get().count;
  const id = `CR-${1000 + currentCount + 1}`;
  const now = new Date().toISOString().slice(0, 10);

  const displayName = String(data.displayName || '').trim().slice(0, 100);
  const ageBand = String(data.ageBand || '30–39').slice(0, 30);
  const facility = String(data.facility || 'Community Clinic A').slice(0, 100);
  const contactPhone = String(data.contactPhone || `555-01${String(currentCount + 1).padStart(2, '0')}`).slice(0, 30);
  const observation = String(data.observation || 'Routine screening recorded').slice(0, 2000);
  const notes = String(data.notes || '').slice(0, 4000);

  db.prepare(`
    INSERT INTO patients (id, displayName, ageBand, facility, contactPhone, createdAt, lastScreening, observation, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, displayName, ageBand, facility, contactPhone, now, now, observation, notes);

  if (data.consent) {
    db.prepare(`
      INSERT INTO consents (patientId, status, scope, caregiverName, grantedDate, revokedDate, recordedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.consent.status || 'Active', data.consent.scope || 'Appointment and follow-up scheduling only', data.consent.caregiverName || 'Designated Family Caregiver', now, null, actor.userId || 'HW-01');
  }

  logAuditEvent({
    entityType: 'patient',
    entityId: id,
    action: 'CREATE',
    actorRole: actor.role,
    actorId: actor.userId,
    description: `Created synthetic patient record ${id} (${displayName}) at ${facility}`,
  });

  return getPatientById(id);
}

export function addObservation(patientId, { screeningType, observationNotes }, actor) {
  const db = getDb();
  const id = `OB-${Date.now().toString().slice(-4)}`;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

  db.prepare(`
    INSERT INTO observations (id, patientId, screeningType, observationNotes, recordedBy, recordedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, patientId, screeningType, observationNotes, actor.userId, now);

  db.prepare('UPDATE patients SET lastScreening = ?, observation = ? WHERE id = ?').run(now.slice(0, 10), observationNotes, patientId);

  logAuditEvent({
    entityType: 'observation',
    entityId: id,
    action: 'CREATE',
    actorRole: actor.role,
    actorId: actor.userId,
    description: `Recorded neutral screening observation (${screeningType}) for patient ${patientId}`,
  });

  return db.prepare('SELECT * FROM observations WHERE id = ?').get(id);
}

export function updateConsent(patientId, consentData, actor) {
  const db = getDb();
  const now = new Date().toISOString().slice(0, 10);

  const existing = db.prepare('SELECT * FROM consents WHERE patientId = ?').get(patientId);

  if (consentData.status === 'Revoked') {
    if (existing) {
      db.prepare(`
        UPDATE consents SET status = 'Revoked', revokedDate = ?, recordedBy = ?
        WHERE patientId = ?
      `).run(now, actor.userId, patientId);
    } else {
      db.prepare(`
        INSERT INTO consents (patientId, status, scope, caregiverName, grantedDate, revokedDate, recordedBy)
        VALUES (?, 'Revoked', 'None', 'None', ?, ?, ?)
      `).run(patientId, now, now, actor.userId);
    }

    logAuditEvent({
      entityType: 'consent',
      entityId: patientId,
      action: 'CONSENT_CHANGE',
      actorRole: actor.role,
      actorId: actor.userId,
      description: `Revoked caregiver-sharing consent for patient ${patientId}`,
    });
  } else {
    const scope = consentData.scope || 'Appointment and follow-up scheduling only';
    const caregiverName = consentData.caregiverName || 'Designated Family Caregiver';

    db.prepare(`
      INSERT OR REPLACE INTO consents (patientId, status, scope, caregiverName, grantedDate, revokedDate, recordedBy)
      VALUES (?, 'Active', ?, ?, ?, NULL, ?)
    `).run(patientId, scope, caregiverName, now, actor.userId);

    logAuditEvent({
      entityType: 'consent',
      entityId: patientId,
      action: 'CONSENT_CHANGE',
      actorRole: actor.role,
      actorId: actor.userId,
      description: `Recorded caregiver-sharing consent for ${patientId} (Caregiver: ${caregiverName}, Scope: ${scope})`,
    });
  }

  return db.prepare('SELECT * FROM consents WHERE patientId = ?').get(patientId);
}

// ----------------- Follow-Up Operations -----------------
export function getFollowUps() {
  const db = getDb();
  return db.prepare('SELECT * FROM follow_ups ORDER BY dueDate ASC').all();
}

export function createFollowUp(data, actor) {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as count FROM follow_ups').get().count;
  const id = `FU-${3000 + count + 1}`;
  const now = new Date().toISOString().slice(0, 10);

  db.prepare(`
    INSERT INTO follow_ups (id, patientId, followUpType, dueDate, status, assignedWorker, reason, rescheduleReason, closeReason, outcome, nextFollowUpDate, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.patientId,
    String(data.followUpType || 'Routine check-in').slice(0, 100),
    data.dueDate,
    data.status || 'Scheduled',
    String(data.assignedWorker || actor.userId || 'HW-01').slice(0, 50),
    String(data.reason || '').slice(0, 1000),
    null,
    null,
    null,
    data.nextFollowUpDate || null,
    now
  );

  logAuditEvent({
    entityType: 'follow_up',
    entityId: id,
    action: 'CREATE',
    actorRole: actor.role,
    actorId: actor.userId,
    description: `Created follow-up task ${id} for patient ${data.patientId} (Due: ${data.dueDate}, Assigned: ${data.assignedWorker || 'HW-01'})`,
  });

  return db.prepare('SELECT * FROM follow_ups WHERE id = ?').get(id);
}

export function updateFollowUp(id, updates, actor) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM follow_ups WHERE id = ?').get(id);
  if (!existing) return null;

  const now = new Date().toISOString().slice(0, 10);
  const status = updates.status || existing.status;
  const dueDate = updates.dueDate || existing.dueDate;
  const assignedWorker = updates.assignedWorker ? String(updates.assignedWorker).slice(0, 50) : existing.assignedWorker;
  const reason = updates.reason ? String(updates.reason).slice(0, 1000) : existing.reason;
  const rescheduleReason = updates.rescheduleReason !== undefined && updates.rescheduleReason !== null ? String(updates.rescheduleReason).slice(0, 1000) : existing.rescheduleReason;
  const closeReason = updates.closeReason !== undefined && updates.closeReason !== null ? String(updates.closeReason).slice(0, 1000) : existing.closeReason;
  const outcome = updates.outcome !== undefined && updates.outcome !== null ? String(updates.outcome).slice(0, 1000) : existing.outcome;
  const nextFollowUpDate = updates.nextFollowUpDate !== undefined ? updates.nextFollowUpDate : existing.nextFollowUpDate;

  db.prepare(`
    UPDATE follow_ups
    SET status = ?, dueDate = ?, assignedWorker = ?, reason = ?, rescheduleReason = ?, closeReason = ?, outcome = ?, nextFollowUpDate = ?, updatedAt = ?
    WHERE id = ?
  `).run(status, dueDate, assignedWorker, reason, rescheduleReason, closeReason, outcome, nextFollowUpDate, now, id);

  let actionDesc = `Updated follow-up ${id} (Status: ${status})`;
  if (updates.rescheduleReason) actionDesc = `Rescheduled follow-up ${id} to ${dueDate}. Reason: ${updates.rescheduleReason}`;
  if (status === 'Completed') actionDesc = `Completed follow-up ${id}. Outcome: ${outcome || 'Recorded in demo'}`;
  if (status === 'Closed') actionDesc = `Closed follow-up ${id}. Reason: ${closeReason || 'Closed administratively'}`;

  logAuditEvent({
    entityType: 'follow_up',
    entityId: id,
    action: status === 'Rescheduled' ? 'RESCHEDULE' : 'STATUS_CHANGE',
    actorRole: actor.role,
    actorId: actor.userId,
    description: actionDesc,
  });

  return db.prepare('SELECT * FROM follow_ups WHERE id = ?').get(id);
}

// ----------------- Referral Operations -----------------
export function getReferrals() {
  const db = getDb();
  return db.prepare('SELECT * FROM referrals ORDER BY referralDate DESC').all();
}

export function createReferral(data, actor) {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as count FROM referrals').get().count;
  const id = `RF-${2000 + count + 1}`;
  const now = new Date().toISOString().slice(0, 10);

  db.prepare(`
    INSERT INTO referrals (id, patientId, destination, receivingService, status, referralDate, appointmentDate, nextFollowUpDate, outcome, unableToConfirmReason, lastUpdatedBy, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.patientId,
    data.destination,
    data.receivingService || 'Primary Care Clinic',
    data.status || 'Sent',
    data.referralDate || now,
    data.appointmentDate || null,
    data.nextFollowUpDate || null,
    null,
    null,
    actor.userId || 'HW-01',
    now
  );

  const histId = `RFH-${Date.now().toString().slice(-4)}`;
  db.prepare(`
    INSERT INTO referral_status_history (id, referralId, status, note, updatedBy, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(histId, id, data.status || 'Sent', 'Initial referral created', actor.userId || 'HW-01', now);

  logAuditEvent({
    entityType: 'referral',
    entityId: id,
    action: 'CREATE',
    actorRole: actor.role,
    actorId: actor.userId,
    description: `Created referral ${id} for patient ${data.patientId} to ${data.destination} (${data.receivingService || 'Primary Care'})`,
  });

  return db.prepare('SELECT * FROM referrals WHERE id = ?').get(id);
}

export function updateReferral(id, updates, actor) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM referrals WHERE id = ?').get(id);
  if (!existing) return null;

  const now = new Date().toISOString().slice(0, 10);
  const status = updates.status || existing.status;
  const destination = updates.destination || existing.destination;
  const receivingService = updates.receivingService || existing.receivingService;
  const appointmentDate = updates.appointmentDate !== undefined ? updates.appointmentDate : existing.appointmentDate;
  const nextFollowUpDate = updates.nextFollowUpDate !== undefined ? updates.nextFollowUpDate : existing.nextFollowUpDate;
  const outcome = updates.outcome !== undefined ? updates.outcome : existing.outcome;
  const unableToConfirmReason = updates.unableToConfirmReason !== undefined ? updates.unableToConfirmReason : existing.unableToConfirmReason;

  db.prepare(`
    UPDATE referrals
    SET status = ?, destination = ?, receivingService = ?, appointmentDate = ?, nextFollowUpDate = ?, outcome = ?, unableToConfirmReason = ?, lastUpdatedBy = ?, updatedAt = ?
    WHERE id = ?
  `).run(status, destination, receivingService, appointmentDate, nextFollowUpDate, outcome, unableToConfirmReason, actor.userId, now, id);

  const histId = `RFH-${Date.now().toString().slice(-4)}`;
  db.prepare(`
    INSERT INTO referral_status_history (id, referralId, status, note, updatedBy, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(histId, id, status, updates.note || updates.unableToConfirmReason || updates.outcome || `Status updated to ${status}`, actor.userId, now);

  let desc = `Updated referral ${id} status to ${status}`;
  if (status === 'Unable to Confirm') desc = `Marked referral ${id} as Unable to Confirm. Reason: ${unableToConfirmReason}`;
  if (status === 'Completed') desc = `Confirmed referral ${id} completed. Outcome: ${outcome || 'Care received'}`;

  logAuditEvent({
    entityType: 'referral',
    entityId: id,
    action: 'STATUS_CHANGE',
    actorRole: actor.role,
    actorId: actor.userId,
    description: desc,
  });

  return db.prepare('SELECT * FROM referrals WHERE id = ?').get(id);
}

// ----------------- Rule Config Operations -----------------
export function getRules() {
  const db = getDb();
  const row = db.prepare('SELECT * FROM rule_config WHERE id = ?').get('default');
  if (!row) return defaultRules;
  return {
    overdueGraceDays: row.overdueGraceDays,
    contactAttemptsBeforeEscalation: row.contactAttemptsBeforeEscalation,
    referralReviewDays: row.referralReviewDays,
    referralInactivityDays: row.referralInactivityDays,
    flagUnassignedTasks: Boolean(row.flagUnassignedTasks),
    flagMissingNextFollowUp: Boolean(row.flagMissingNextFollowUp),
  };
}

export function updateRules(updates, actor) {
  const db = getDb();
  const current = getRules();
  const next = { ...current, ...updates };
  const now = new Date().toISOString().slice(0, 10);

  db.prepare(`
    UPDATE rule_config
    SET overdueGraceDays = ?, contactAttemptsBeforeEscalation = ?, referralReviewDays = ?, referralInactivityDays = ?, flagUnassignedTasks = ?, flagMissingNextFollowUp = ?, updatedBy = ?, updatedAt = ?
    WHERE id = 'default'
  `).run(
    next.overdueGraceDays,
    next.contactAttemptsBeforeEscalation,
    next.referralReviewDays,
    next.referralInactivityDays,
    next.flagUnassignedTasks ? 1 : 0,
    next.flagMissingNextFollowUp ? 1 : 0,
    actor.userId || 'SUP-01',
    now
  );

  logAuditEvent({
    entityType: 'rules',
    entityId: 'default',
    action: 'CONFIG_UPDATE',
    actorRole: actor.role,
    actorId: actor.userId,
    description: `Updated administrative routing rules: overdueGraceDays=${next.overdueGraceDays}, referralReviewDays=${next.referralReviewDays}, referralInactivityDays=${next.referralInactivityDays}`,
  });

  return getRules();
}

// ----------------- Audit Events -----------------
export function getAuditEvents(limit = 100) {
  const db = getDb();
  return db.prepare('SELECT * FROM audit_events ORDER BY timestamp DESC LIMIT ?').all(limit);
}

export function logAuditEvent({ entityType, entityId, action, actorRole, actorId, description }) {
  const db = getDb();
  const id = `EVT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  db.prepare(`
    INSERT INTO audit_events (id, entityType, entityId, action, actorRole, actorId, description, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, entityType, entityId, action, actorRole, actorId, description, timestamp);

  return { id, timestamp };
}

// ----------------- Analytics -----------------
export function getAnalyticsSummary(today = '2026-10-23') {
  const db = getDb();
  const patients = getPatients();
  const followUps = getFollowUps();
  const referrals = getReferrals();
  const rules = getRules();

  const totalPatients = patients.length;
  const totalFollowUps = followUps.length;
  const dueTodayCount = followUps.filter((f) => f.dueDate === today && f.status !== 'Completed' && f.status !== 'Closed').length;
  const overdueCount = followUps.filter((f) => {
    if (['Completed', 'Closed'].includes(f.status)) return false;
    const [y, m, d] = f.dueDate.split('-').map(Number);
    const [ty, tm, td] = today.split('-').map(Number);
    const diff = Math.floor(Date.UTC(ty, tm - 1, td) / 86400000) - Math.floor(Date.UTC(y, m - 1, d) / 86400000);
    return diff > rules.overdueGraceDays;
  }).length;
  const completedFollowUps = followUps.filter((f) => f.status === 'Completed').length;
  const unassignedFollowUps = followUps.filter((f) => !f.assignedWorker || f.assignedWorker === 'Unassigned').length;

  const totalReferrals = referrals.length;
  const openReferrals = referrals.filter((r) => !['Completed', 'Cancelled', 'Unable to Confirm'].includes(r.status)).length;
  const unconfirmedReferrals = referrals.filter((r) => ['Draft', 'Sent', 'Received', 'Appointment Pending', 'Review required'].includes(r.status)).length;
  const completedReferrals = referrals.filter((r) => r.status === 'Completed').length;
  const unableToConfirmReferrals = referrals.filter((r) => r.status === 'Unable to Confirm').length;

  // Workload by Worker
  const workers = ['HW-01', 'HW-02', 'HW-03', 'Unassigned'];
  const workloadByWorker = workers.map((worker) => {
    const workerTasks = followUps.filter((f) => (worker === 'Unassigned' ? !f.assignedWorker || f.assignedWorker === 'Unassigned' : f.assignedWorker === worker));
    const workerOverdue = workerTasks.filter((f) => {
      if (['Completed', 'Closed'].includes(f.status)) return false;
      const [y, m, d] = f.dueDate.split('-').map(Number);
      const [ty, tm, td] = today.split('-').map(Number);
      const diff = Math.floor(Date.UTC(ty, tm - 1, td) / 86400000) - Math.floor(Date.UTC(y, m - 1, d) / 86400000);
      return diff > rules.overdueGraceDays;
    }).length;
    const workerCompleted = workerTasks.filter((f) => f.status === 'Completed').length;

    return {
      worker,
      assignedCount: workerTasks.length,
      overdueCount: workerOverdue,
      completedCount: workerCompleted,
    };
  });

  // Service Bottlenecks by Destination Facility
  const destinationMap = new Map();
  for (const r of referrals) {
    const key = r.destination;
    if (!destinationMap.has(key)) {
      destinationMap.set(key, { destination: key, receivingService: r.receivingService, total: 0, open: 0, unconfirmed: 0, totalDaysOpen: 0 });
    }
    const item = destinationMap.get(key);
    item.total += 1;
    if (!['Completed', 'Cancelled', 'Unable to Confirm'].includes(r.status)) {
      item.open += 1;
      item.unconfirmed += 1;
      const [y, m, d] = r.referralDate.split('-').map(Number);
      const [ty, tm, td] = today.split('-').map(Number);
      const days = Math.max(0, Math.floor(Date.UTC(ty, tm - 1, td) / 86400000) - Math.floor(Date.UTC(y, m - 1, d) / 86400000));
      item.totalDaysOpen += days;
    }
  }

  const serviceBottlenecks = Array.from(destinationMap.values()).map((s) => ({
    destination: s.destination,
    receivingService: s.receivingService,
    total: s.total,
    open: s.open,
    unconfirmed: s.unconfirmed,
    avgDaysOpen: s.open > 0 ? Math.round(s.totalDaysOpen / s.open) : 0,
  }));

  // Daily activity trends (last 7 days leading to demo date)
  const dailyTrends = [
    { date: '2026-10-17', scheduled: 8, completed: 5, overdue: 1 },
    { date: '2026-10-18', scheduled: 9, completed: 6, overdue: 2 },
    { date: '2026-10-19', scheduled: 10, completed: 7, overdue: 2 },
    { date: '2026-10-20', scheduled: 11, completed: 8, overdue: 3 },
    { date: '2026-10-21', scheduled: 12, completed: 9, overdue: 3 },
    { date: '2026-10-22', scheduled: 12, completed: 10, overdue: 3 },
    { date: '2026-10-23', scheduled: totalFollowUps, completed: completedFollowUps, overdue: overdueCount },
  ];

  return {
    totalPatients,
    totalFollowUps,
    dueTodayCount,
    overdueCount,
    completedFollowUps,
    unassignedFollowUps,
    totalReferrals,
    openReferrals,
    unconfirmedReferrals,
    completedReferrals,
    unableToConfirmReferrals,
    workloadByWorker,
    serviceBottlenecks,
    dailyTrends,
  };
}
