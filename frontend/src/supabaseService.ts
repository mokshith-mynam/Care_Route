import { getSupabaseClient } from './supabaseClient';
import { defaultRules, demoAuditEvents, demoFollowUps, demoPatients, demoReferrals } from './demoData';
import type {
  AuditEvent,
  CaregiverConsent,
  FollowUp,
  FollowUpStatus,
  NewPatientFormData,
  Patient,
  Referral,
  ReferralStatus,
  RuleConfig,
  ScreeningObservation,
  UserRole,
} from './types';

// Helper to resolve or create a default facility UUID
async function getOrCreateFacilityId(): Promise<string> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data: existing } = await supabase.from('facilities').select('id').limit(1);
  if (existing && existing.length > 0) {
    return existing[0].id;
  }

  const { data: created, error } = await supabase
    .from('facilities')
    .insert({ name: 'Community Clinic A', code: 'CCA' })
    .select('id')
    .single();

  if (error || !created) {
    throw new Error(`Failed to initialize facility: ${error?.message || 'Unknown error'}`);
  }
  return created.id;
}

// Helper to get or create a demo auth/profile user UUID for created_by fields
async function getOrCreateUserId(): Promise<string> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data: userRes } = await supabase.auth.getUser();
  if (userRes?.user?.id) {
    return userRes.user.id;
  }

  // Check if any profile exists
  const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
  if (profiles && profiles.length > 0) {
    return profiles[0].id;
  }

  // Fallback fixed UUID for synthetic demo runs (valid UUID format)
  return '00000000-0000-4000-a000-000000000001';
}

// Database row interfaces for Supabase join projections
interface PatientDbRow {
  id: string;
  patient_code: string;
  display_label: string;
  age_band?: string | null;
  contact_phone?: string | null;
  created_at: string;
  facilities?: { name?: string } | null;
  consents?:
    | {
        status?: string;
        scope?: string;
        caregiver_name?: string;
        granted_date?: string;
        revoked_date?: string;
        recorded_by?: string;
      }
    | Array<{
        status?: string;
        scope?: string;
        caregiver_name?: string;
        granted_date?: string;
        revoked_date?: string;
        recorded_by?: string;
      }>
    | null;
  screenings?: Array<{
    screening_type?: string;
    observation_summary?: string;
    observed_at?: string;
  }> | null;
}

interface FollowUpDbRow {
  id: string;
  patients?: { patient_code?: string } | null;
  follow_up_type?: string | null;
  due_date: string;
  status: string;
  reason?: string | null;
  reschedule_reason?: string | null;
  close_reason?: string | null;
  outcome?: string | null;
  next_follow_up_date?: string | null;
  updated_at?: string | null;
}

interface ReferralDbRow {
  id: string;
  patients?: { patient_code?: string } | null;
  destination_facility: string;
  receiving_service?: string | null;
  referral_date: string;
  appointment_date?: string | null;
  next_follow_up_date?: string | null;
  status: string;
  outcome?: string | null;
  unable_to_confirm_reason?: string | null;
}

interface AuditEventDbRow {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  description: string;
  created_at?: string | null;
}

export const supabaseService = {
  // ----------------- Patients -----------------
  async getPatients(): Promise<Patient[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data: patientsData, error } = await supabase
      .from('patients')
      .select(`
        id,
        patient_code,
        display_label,
        age_band,
        contact_phone,
        created_at,
        facilities ( name ),
        consents ( status, scope, caregiver_name, granted_date, revoked_date, recorded_by ),
        screenings ( screening_type, observation_summary, observed_at )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase getPatients warning:', error.message);
      return [];
    }

    if (!patientsData || patientsData.length === 0) {
      return [];
    }

    return (patientsData as unknown as PatientDbRow[]).map((row) => {
      const consentRow = Array.isArray(row.consents) ? row.consents[0] : row.consents;
      const latestScreening = Array.isArray(row.screenings) && row.screenings.length > 0 ? row.screenings[0] : null;

      const consent: CaregiverConsent | undefined = consentRow
        ? {
            patientId: row.patient_code,
            status: consentRow.status === 'revoked' ? 'Revoked' : 'Active',
            scope: consentRow.scope || 'Appointment and follow-up scheduling only',
            caregiverName: consentRow.caregiver_name || 'Designated Family Caregiver',
            grantedDate: consentRow.granted_date || row.created_at.slice(0, 10),
            revokedDate: consentRow.revoked_date || undefined,
            recordedBy: 'HW-01',
          }
        : undefined;

      return {
        id: row.patient_code,
        displayName: row.display_label,
        ageBand: row.age_band || '30–39',
        facility: row.facilities?.name || 'Community Clinic A',
        contactPhone: row.contact_phone || '555-0100',
        createdAt: row.created_at.slice(0, 10),
        lastScreening: latestScreening?.observed_at || row.created_at.slice(0, 10),
        observation: latestScreening?.observation_summary || 'Routine screening recorded',
        consent,
      };
    });
  },

  async createPatient(formData: Partial<Patient> | NewPatientFormData, actor: { role: UserRole; userId: string }): Promise<Patient> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client is not available.');

    const facilityId = await getOrCreateFacilityId();
    const userId = await getOrCreateUserId();

    const { count } = await supabase.from('patients').select('*', { count: 'exact', head: true });
    const code = `CR-${1000 + (count || 0) + 1}`;
    const displayName = ('displayName' in formData ? formData.displayName : '') || 'Unnamed Patient';
    const ageBand = ('ageBand' in formData ? formData.ageBand : '') || '30–39';
    const facilityName = ('facility' in formData ? formData.facility : '') || 'Community Clinic A';
    const phone = ('contactPhone' in formData ? formData.contactPhone : '') || '555-0199';

    const { data: createdPatient, error: pErr } = await supabase
      .from('patients')
      .insert({
        patient_code: code,
        display_label: displayName,
        age_band: ageBand,
        contact_phone: phone,
        facility_id: facilityId,
        created_by: userId,
      })
      .select('id, patient_code, display_label, age_band, contact_phone, created_at')
      .single();

    if (pErr || !createdPatient) {
      throw new Error(`Failed to create patient: ${pErr?.message}`);
    }

    // Insert consent if provided
    let createdConsent: CaregiverConsent | undefined;
    if (formData.consent) {
      const { data: cData } = await supabase
        .from('consents')
        .insert({
          patient_id: createdPatient.id,
          facility_id: facilityId,
          status: formData.consent.status === 'Revoked' ? 'revoked' : 'active',
          scope: formData.consent.scope || 'Appointment and follow-up scheduling only',
          caregiver_name: formData.consent.caregiverName || 'Designated Family Caregiver',
          recorded_by: userId,
        })
        .select()
        .single();

      if (cData) {
        createdConsent = {
          patientId: code,
          status: formData.consent.status,
          scope: formData.consent.scope,
          caregiverName: formData.consent.caregiverName,
          grantedDate: new Date().toISOString().slice(0, 10),
          recordedBy: actor.userId,
        };
      }
    }

    // Insert observation if provided
    const obsText = 'observation' in formData ? formData.observation : 'Routine screening recorded';
    if (obsText) {
      await supabase.from('screenings').insert({
        patient_id: createdPatient.id,
        facility_id: facilityId,
        screening_type: 'Routine Community Screening',
        observation_summary: obsText,
        recorded_by: userId,
      });
    }

    await this.logAuditEvent({
      entityType: 'patient',
      entityId: code,
      action: 'CREATE',
      actorRole: actor.role,
      actorId: actor.userId,
      description: `Created synthetic patient record ${code} (${displayName}) in Supabase`,
    });

    return {
      id: code,
      displayName,
      ageBand,
      facility: facilityName,
      contactPhone: phone,
      createdAt: createdPatient.created_at.slice(0, 10),
      lastScreening: new Date().toISOString().slice(0, 10),
      observation: obsText || 'Routine screening recorded',
      consent: createdConsent,
    };
  },

  async addObservation(patientCode: string, data: { screeningType: string; observationNotes: string }, actor: { role: UserRole; userId: string }): Promise<ScreeningObservation> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client is not available.');

    const { data: pData } = await supabase.from('patients').select('id, facility_id').eq('patient_code', patientCode).single();
    if (!pData) throw new Error(`Patient ${patientCode} not found in Supabase.`);

    const userId = await getOrCreateUserId();
    const { data: obs, error } = await supabase
      .from('screenings')
      .insert({
        patient_id: pData.id,
        facility_id: pData.facility_id,
        screening_type: data.screeningType,
        observation_summary: data.observationNotes,
        recorded_by: userId,
      })
      .select()
      .single();

    if (error || !obs) throw new Error(`Failed to add observation: ${error?.message}`);

    await this.logAuditEvent({
      entityType: 'observation',
      entityId: patientCode,
      action: 'CREATE',
      actorRole: actor.role,
      actorId: actor.userId,
      description: `Recorded screening observation for ${patientCode} in Supabase: ${data.screeningType}`,
    });

    return {
      id: obs.id,
      patientId: patientCode,
      screeningType: obs.screening_type,
      observationNotes: obs.observation_summary,
      recordedBy: actor.userId,
      recordedAt: obs.created_at.slice(0, 16).replace('T', ' '),
    };
  },

  async updateConsent(patientCode: string, consent: Partial<CaregiverConsent>, actor: { role: UserRole; userId: string }): Promise<CaregiverConsent> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client is not available.');

    const { data: pData } = await supabase.from('patients').select('id, facility_id').eq('patient_code', patientCode).single();
    if (!pData) throw new Error(`Patient ${patientCode} not found in Supabase.`);

    const userId = await getOrCreateUserId();
    const status = consent.status === 'Revoked' ? 'revoked' : 'active';
    const now = new Date().toISOString().slice(0, 10);

    const { data: saved, error } = await supabase
      .from('consents')
      .upsert({
        patient_id: pData.id,
        facility_id: pData.facility_id,
        status,
        scope: consent.scope || 'Appointment and follow-up scheduling only',
        caregiver_name: consent.caregiverName || 'Designated Family Caregiver',
        granted_date: now,
        revoked_date: status === 'revoked' ? now : null,
        recorded_by: userId,
      }, { onConflict: 'patient_id' })
      .select()
      .single();

    if (error || !saved) throw new Error(`Failed to update consent: ${error?.message}`);

    return {
      patientId: patientCode,
      status: consent.status || 'Active',
      scope: saved.scope,
      caregiverName: saved.caregiver_name,
      grantedDate: saved.granted_date,
      revokedDate: saved.revoked_date || undefined,
      recordedBy: actor.userId,
    };
  },

  // ----------------- Follow-Ups -----------------
  async getFollowUps(): Promise<FollowUp[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('follow_ups')
      .select(`
        id,
        follow_up_type,
        due_date,
        status,
        reason,
        reschedule_reason,
        close_reason,
        outcome,
        next_follow_up_date,
        updated_at,
        patients ( patient_code )
      `)
      .order('due_date', { ascending: true });

    if (error || !data) return [];

    const statusMap: Record<string, FollowUpStatus> = {
      scheduled: 'Scheduled',
      due_today: 'Due today',
      overdue: 'Overdue',
      contact_attempt_pending: 'Contact attempt pending',
      rescheduled: 'Rescheduled',
      completed: 'Completed',
      closed: 'Closed',
    };

    return (data as unknown as FollowUpDbRow[]).map((f, idx) => ({
      id: `FU-${3000 + idx + 1}`,
      patientId: f.patients?.patient_code || 'CR-1001',
      followUpType: f.follow_up_type || 'Routine check-in',
      dueDate: f.due_date,
      status: statusMap[f.status] || 'Scheduled',
      assignedWorker: 'HW-01',
      reason: f.reason || 'Routine follow-up',
      rescheduleReason: f.reschedule_reason || undefined,
      closeReason: f.close_reason || undefined,
      outcome: f.outcome || undefined,
      nextFollowUpDate: f.next_follow_up_date || undefined,
      updatedAt: f.updated_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    }));
  },

  async createFollowUp(data: Partial<FollowUp>, actor: { role: UserRole; userId: string }): Promise<FollowUp> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client not available.');

    const { data: pData } = await supabase.from('patients').select('id, facility_id').eq('patient_code', data.patientId || '').single();
    if (!pData) throw new Error(`Patient ${data.patientId} not found in Supabase.`);

    const userId = await getOrCreateUserId();
    const { count } = await supabase.from('follow_ups').select('*', { count: 'exact', head: true });
    const id = `FU-${3000 + (count || 0) + 1}`;

    const { data: created, error } = await supabase
      .from('follow_ups')
      .insert({
        patient_id: pData.id,
        facility_id: pData.facility_id,
        follow_up_type: data.followUpType || 'Routine check-in',
        due_date: data.dueDate,
        status: (data.status || 'scheduled').toLowerCase().replace(/\s+/g, '_'),
        reason: data.reason || 'Routine check-in',
        next_follow_up_date: data.nextFollowUpDate || null,
        created_by: userId,
      })
      .select()
      .single();

    if (error || !created) throw new Error(`Failed to create follow-up: ${error?.message}`);

    await this.logAuditEvent({
      entityType: 'follow_up',
      entityId: id,
      action: 'CREATE',
      actorRole: actor.role,
      actorId: actor.userId,
      description: `Created follow-up task ${id} for ${data.patientId} (Due: ${data.dueDate}) in Supabase`,
    });

    return {
      id,
      patientId: data.patientId || 'CR-1001',
      followUpType: data.followUpType || 'Routine check-in',
      dueDate: data.dueDate || '',
      status: data.status || 'Scheduled',
      assignedWorker: actor.userId,
      reason: data.reason || '',
      nextFollowUpDate: data.nextFollowUpDate,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  },

  async updateFollowUp(id: string, updates: Partial<FollowUp>, actor: { role: UserRole; userId: string }): Promise<FollowUp> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client not available.');

    const statusDb = updates.status ? updates.status.toLowerCase().replace(/\s+/g, '_') : undefined;

    await supabase
      .from('follow_ups')
      .update({
        status: statusDb,
        due_date: updates.dueDate,
        reschedule_reason: updates.rescheduleReason,
        close_reason: updates.closeReason,
        outcome: updates.outcome,
        next_follow_up_date: updates.nextFollowUpDate,
        updated_at: new Date().toISOString(),
      })
      .limit(1);

    await this.logAuditEvent({
      entityType: 'follow_up',
      entityId: id,
      action: updates.status === 'Rescheduled' ? 'RESCHEDULE' : 'STATUS_CHANGE',
      actorRole: actor.role,
      actorId: actor.userId,
      description: `Updated follow-up ${id} in Supabase: status=${updates.status}`,
    });

    return {
      id,
      patientId: 'CR-1001',
      followUpType: 'Routine check-in',
      dueDate: updates.dueDate || '2026-10-24',
      status: updates.status || 'Scheduled',
      assignedWorker: actor.userId,
      reason: updates.reason || 'Check-in',
      rescheduleReason: updates.rescheduleReason,
      closeReason: updates.closeReason,
      outcome: updates.outcome,
      nextFollowUpDate: updates.nextFollowUpDate,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  },

  // ----------------- Referrals -----------------
  async getReferrals(): Promise<Referral[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('referrals')
      .select(`
        id,
        destination_facility,
        receiving_service,
        referral_date,
        appointment_date,
        next_follow_up_date,
        status,
        outcome,
        unable_to_confirm_reason,
        patients ( patient_code )
      `)
      .order('referral_date', { ascending: false });

    if (error || !data) return [];

    const statusMap: Record<string, ReferralStatus> = {
      draft: 'Draft',
      sent: 'Sent',
      received: 'Received',
      appointment_pending: 'Appointment Pending',
      review_required: 'Review required',
      completed: 'Completed',
      unable_to_confirm: 'Unable to Confirm',
      cancelled: 'Cancelled',
    };

    return (data as unknown as ReferralDbRow[]).map((r, idx) => ({
      id: `RF-${2000 + idx + 1}`,
      patientId: r.patients?.patient_code || 'CR-1001',
      destination: r.destination_facility,
      receivingService: r.receiving_service || 'Primary Care Clinic',
      referralDate: r.referral_date,
      appointmentDate: r.appointment_date || undefined,
      nextFollowUpDate: r.next_follow_up_date || undefined,
      status: statusMap[r.status] || 'Sent',
      outcome: r.outcome || undefined,
      unableToConfirmReason: r.unable_to_confirm_reason || undefined,
      lastUpdatedBy: 'HW-01',
      updatedAt: new Date().toISOString().slice(0, 10),
    }));
  },

  async createReferral(data: Partial<Referral>, actor: { role: UserRole; userId: string }): Promise<Referral> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client not available.');

    const { data: pData } = await supabase.from('patients').select('id, facility_id').eq('patient_code', data.patientId || '').single();
    if (!pData) throw new Error(`Patient ${data.patientId} not found in Supabase.`);

    const userId = await getOrCreateUserId();
    const { count } = await supabase.from('referrals').select('*', { count: 'exact', head: true });
    const id = `RF-${2000 + (count || 0) + 1}`;

    const statusDb = (data.status || 'sent').toLowerCase().replace(/\s+/g, '_');
    const { data: created, error } = await supabase
      .from('referrals')
      .insert({
        patient_id: pData.id,
        facility_id: pData.facility_id,
        destination_facility: data.destination || 'Primary Care Clinic',
        receiving_service: data.receivingService || 'Primary Care Clinic',
        referral_date: data.referralDate || new Date().toISOString().slice(0, 10),
        appointment_date: data.appointmentDate || null,
        next_follow_up_date: data.nextFollowUpDate || null,
        status: statusDb,
        created_by: userId,
      })
      .select()
      .single();

    if (error || !created) throw new Error(`Failed to create referral: ${error?.message}`);

    await this.logAuditEvent({
      entityType: 'referral',
      entityId: id,
      action: 'CREATE',
      actorRole: actor.role,
      actorId: actor.userId,
      description: `Created referral ${id} for ${data.patientId} to ${data.destination} in Supabase`,
    });

    return {
      id,
      patientId: data.patientId || 'CR-1001',
      destination: data.destination || 'Primary Care Clinic',
      receivingService: data.receivingService || 'Primary Care Clinic',
      referralDate: data.referralDate || new Date().toISOString().slice(0, 10),
      appointmentDate: data.appointmentDate,
      nextFollowUpDate: data.nextFollowUpDate,
      status: data.status || 'Sent',
      lastUpdatedBy: actor.userId,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  },

  async updateReferral(id: string, updates: Partial<Referral>, actor: { role: UserRole; userId: string }): Promise<Referral> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client not available.');

    const statusDb = updates.status ? updates.status.toLowerCase().replace(/\s+/g, '_') : undefined;

    await supabase
      .from('referrals')
      .update({
        status: statusDb,
        appointment_date: updates.appointmentDate,
        next_follow_up_date: updates.nextFollowUpDate,
        outcome: updates.outcome,
        unable_to_confirm_reason: updates.unableToConfirmReason,
        updated_at: new Date().toISOString(),
      })
      .limit(1);

    await this.logAuditEvent({
      entityType: 'referral',
      entityId: id,
      action: 'STATUS_CHANGE',
      actorRole: actor.role,
      actorId: actor.userId,
      description: `Updated referral ${id} in Supabase: status=${updates.status}`,
    });

    return {
      id,
      patientId: 'CR-1001',
      destination: 'Primary Care Clinic',
      receivingService: 'Primary Care Clinic',
      referralDate: '2026-10-24',
      status: updates.status || 'Sent',
      outcome: updates.outcome,
      unableToConfirmReason: updates.unableToConfirmReason,
      lastUpdatedBy: actor.userId,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  },

  // ----------------- Rules -----------------
  async getRules(): Promise<RuleConfig> {
    const supabase = getSupabaseClient();
    if (!supabase) return defaultRules;

    const { data } = await supabase.from('rule_configs').select('*').limit(1);
    if (!data || data.length === 0) return defaultRules;

    const row = data[0];
    return {
      overdueGraceDays: row.overdue_grace_days ?? defaultRules.overdueGraceDays,
      contactAttemptsBeforeEscalation: row.contact_attempts_before_escalation ?? defaultRules.contactAttemptsBeforeEscalation,
      referralReviewDays: row.referral_review_days ?? defaultRules.referralReviewDays,
      referralInactivityDays: row.referral_inactivity_days ?? defaultRules.referralInactivityDays,
      flagUnassignedTasks: row.flag_unassigned_tasks ?? defaultRules.flagUnassignedTasks,
      flagMissingNextFollowUp: row.flag_missing_next_follow_up ?? defaultRules.flagMissingNextFollowUp,
    };
  },

  async updateRules(updates: Partial<RuleConfig>, actor: { role: UserRole; userId: string }): Promise<RuleConfig> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client not available.');

    const facilityId = await getOrCreateFacilityId();
    const userId = await getOrCreateUserId();
    const current = await this.getRules();
    const next = { ...current, ...updates };

    await supabase.from('rule_configs').upsert({
      facility_id: facilityId,
      overdue_grace_days: next.overdueGraceDays,
      contact_attempts_before_escalation: next.contactAttemptsBeforeEscalation,
      referral_review_days: next.referralReviewDays,
      referral_inactivity_days: next.referralInactivityDays,
      flag_unassigned_tasks: next.flagUnassignedTasks,
      flag_missing_next_follow_up: next.flagMissingNextFollowUp,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'facility_id' });

    await this.logAuditEvent({
      entityType: 'rules',
      entityId: 'default',
      action: 'CONFIG_UPDATE',
      actorRole: actor.role,
      actorId: actor.userId,
      description: `Updated administrative routing rules in Supabase`,
    });

    return next;
  },

  // ----------------- Audit Events -----------------
  async getTimeline(limit = 100): Promise<AuditEvent[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return demoAuditEvents;

    const { data, error } = await supabase
      .from('audit_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) return demoAuditEvents;

    return (data as unknown as AuditEventDbRow[]).map((e) => {
      const validTypes: AuditEvent['entityType'][] = ['patient', 'observation', 'follow_up', 'referral', 'consent', 'rules'];
      const entityType: AuditEvent['entityType'] = validTypes.includes(e.entity_type as AuditEvent['entityType'])
        ? (e.entity_type as AuditEvent['entityType'])
        : 'patient';

      return {
        id: e.id,
        entityType,
        entityId: e.entity_id,
        action: e.action,
        actorRole: 'Health worker' as UserRole,
        actorId: 'HW-01',
        description: e.description,
        timestamp: e.created_at?.slice(0, 19).replace('T', ' ') || new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
    });
  },

  async logAuditEvent(evt: { entityType: string; entityId: string; action: string; actorRole: string; actorId: string; description: string }): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      const facilityId = await getOrCreateFacilityId().catch(() => null);
      const userId = await getOrCreateUserId().catch(() => null);

      await supabase.from('audit_events').insert({
        actor_id: userId,
        facility_id: facilityId,
        action: evt.action,
        entity_type: evt.entityType,
        entity_id: evt.entityId,
        description: evt.description,
      });
    } catch {
      // Non-blocking
    }
  },

  // ----------------- Seed Demo Data to Supabase -----------------
  async seedDemoDataToSupabase(): Promise<{ count: number; message: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client is not available.');

    const facilityId = await getOrCreateFacilityId();
    const userId = await getOrCreateUserId();

    // Check existing count
    const { count } = await supabase.from('patients').select('*', { count: 'exact', head: true });
    if (count && count > 0) {
      return { count, message: `Supabase database already has ${count} patient record(s).` };
    }

    let insertedCount = 0;
    const patientMap = new Map<string, string>();

    for (const p of demoPatients) {
      const { data: created, error } = await supabase
        .from('patients')
        .insert({
          patient_code: p.id,
          display_label: p.displayName,
          age_band: p.ageBand,
          contact_phone: p.contactPhone,
          facility_id: facilityId,
          created_by: userId,
        })
        .select()
        .single();

      if (created) {
        insertedCount++;
        patientMap.set(p.id, created.id);

        if (p.consent) {
          await supabase.from('consents').insert({
            patient_id: created.id,
            facility_id: facilityId,
            status: p.consent.status === 'Revoked' ? 'revoked' : 'active',
            scope: p.consent.scope,
            caregiver_name: p.consent.caregiverName,
            recorded_by: userId,
          });
        }
        if (p.observation) {
          await supabase.from('screenings').insert({
            patient_id: created.id,
            facility_id: facilityId,
            screening_type: 'Routine Community Screening',
            observation_summary: p.observation,
            recorded_by: userId,
          });
        }
      } else if (error) {
        console.warn('Seed patient error:', error.message);
      }
    }

    // Seed follow-ups
    for (const f of demoFollowUps) {
      const patientUuid = patientMap.get(f.patientId);
      if (!patientUuid) continue;
      await supabase.from('follow_ups').insert({
        patient_id: patientUuid,
        facility_id: facilityId,
        follow_up_type: f.followUpType,
        due_date: f.dueDate,
        status: f.status.toLowerCase().replace(/\s+/g, '_'),
        reason: f.reason,
        next_follow_up_date: f.nextFollowUpDate || null,
        created_by: userId,
      });
    }

    // Seed referrals
    for (const r of demoReferrals) {
      const patientUuid = patientMap.get(r.patientId);
      if (!patientUuid) continue;
      await supabase.from('referrals').insert({
        patient_id: patientUuid,
        facility_id: facilityId,
        destination_facility: r.destination,
        receiving_service: r.receivingService,
        referral_date: r.referralDate,
        appointment_date: r.appointmentDate || null,
        next_follow_up_date: r.nextFollowUpDate || null,
        status: r.status.toLowerCase().replace(/\s+/g, '_'),
        outcome: r.outcome || null,
        created_by: userId,
      });
    }

    return {
      count: insertedCount,
      message: `Successfully seeded ${insertedCount} synthetic patients, referrals, and follow-ups to Supabase!`,
    };
  },
};
