export type Language = 'en' | 'te' | 'hi' | 'mr' | 'ta';

export interface Translations {
  appName: string;
  appTagline: string;
  demoNotice: string;
  demoBanner: string;
  nonDiagnosticDisclaimer: string;
  nonDiagnosticReminder: string;
  roleSwitcher: string;
  activeRole: string;
  roleWorker: string;
  roleSupervisor: string;
  roleReviewer: string;
  navOverview: string;
  navPatients: string;
  navFollowUps: string;
  navReferrals: string;
  navNeedsAttention: string;
  navAnalytics: string;
  navTimeline: string;
  navRules: string;
  newFollowUp: string;
  newReferral: string;
  addPatient: string;
  recordObservation: string;
  activePatients: string;
  dueToday: string;
  overdueTasks: string;
  openReferrals: string;
  needsAttention: string;
  unassignedTasks: string;
  searchPlaceholder: string;
  statusScheduled: string;
  statusDueToday: string;
  statusOverdue: string;
  statusCompleted: string;
  statusRescheduled: string;
  statusContactPending: string;
  statusClosed: string;
  referralDraft: string;
  referralSent: string;
  referralReceived: string;
  referralAppointmentPending: string;
  referralReviewRequired: string;
  referralCompleted: string;
  referralUnableToConfirm: string;
  consentActive: string;
  consentRevoked: string;
  consentNotProvided: string;
  exportSummary: string;
  resetDemo: string;
  purgeData: string;
  offlineMode: string;
  onlineMode: string;
  syncSuccess: string;
  permissionDeniedTitle: string;
  filterAll: string;
  resolve: string;
  reschedule: string;
  close: string;
  viewDetails: string;
  manageReferrals: string;
  demoEnvironment: string;
  syntheticOnly: string;
  simulateOffline: string;
  syncQueue: string;
  goOnline: string;
  demoDate: string;
  viewOverdueAlerts: string;
  overviewEyebrow: string;
  overviewTitle: string;
  overviewDescription: string;
  protocolTitle: string;
  syntheticRecords: string;
  dueForCheckin: string;
  exceedsGrace: string;
  pendingHandoff: string;
  priorityQueue: string;
  queueDescription: string;
  viewAllFollowUps: string;
  noOverdueFollowUps: string;
  withinGrace: string;
  assigned: string;
  markCompleted: string;
  rescheduleWithReason: string;
  rulesChecked: string;
  configureGrace: string;
  referralHandoffs: string;
  directoryEyebrow: string;
  patientsDescription: string;
  searchPatients: string;
  allFacilities: string;
  records: string;
  recordId: string;
  personLabel: string;
  ageBand: string;
  primaryFacility: string;
  caregiverConsent: string;
  lastScreening: string;
  activeWork: string;
  actions: string;
  noMatchingRecords: string;
  refineSearch: string;
  active: string;
  notProvided: string;
  task: string;
  tasks: string;
  ref: string;
  viewProfile: string;
  coordinationWorkspace: string;
  backendValidatesPermissions: string;
  administrator: string;
  connectedSQLite: string;
  connectedSupabase: string;
  configureSupabase: string;
  viewStorageSettings: string;
  revoked: string;
  cancelled: string;
  appFooter: string;
  databaseLabel: string;
  followupsEyebrow: string;
  followupsDescription: string;
  overdueRule: string;
  worker: string;
  allWorkers: string;
  unassigned: string;
  taskIdType: string;
  dueDate: string;
  assignedWorker: string;
  statusLabel: string;
  coordinationNotes: string;
  noMatchingFollowUps: string;
  adjustFilters: string;
  referralsEyebrow: string;
  referralsDescription: string;
  loopIntegrity: string;
  allStatuses: string;
  referralId: string;
  destinationService: string;
  referralDate: string;
  daysOpen: string;
  handoffStatus: string;
  nextFollowUp: string;
  noReferralsFound: string;
  overdueRuleBody: string;
  loopIntegrityBody: string;
  searchFollowUps: string;
  searchReferrals: string;
  loopTracking: string;
  allReferralRegistry: string;
  noOpenReferrals: string;
  allReferralsRecorded: string;
  loopClosure: string;
  openFullRegistry: string;
  day: string;
  days: string;
  by: string;
  appointmentShort: string;
  reasonLabel: string;
  outcomeLabel: string;
  notScheduled: string;
  none: string;
  updateStatus: string;
  recordHandoffUpdate: string;
  markUnableToConfirm: string;
  loopClosed: string;
  attentionDescription: string;
  operationalWorkflowOnly: string;
  attentionWarning: string;
  noCoordinationGaps: string;
  itemsRequiringReview: string;
  administrativeTrigger: string;
  timelineDescription: string;
  factualAuditHistory: string;
  factualAuditDescription: string;
  entityType: string;
  allActivities: string;
  screeningObservations: string;
  events: string;
  noEvents: string;
  noActivitiesMatch: string;
  rulesDescription: string;
  restrictedRoles: string;
  adminRulesProtocol: string;
  adminRulesDescription: string;
  overdueGracePeriod: string;
  referralAppointmentThreshold: string;
  referralInactivityThreshold: string;
  flagUnassignedTasks: string;
  flagMissingDate: string;
  livePreview: string;
  recalculatedPreview: string;
  flaggedItems: string;
  whyFlagged: string;
  enabled: string;
  disabled: string;
  analyticsDescription: string;
  operationalMetrics: string;
  completionRate: string;
  unassignedWork: string;
  unconfirmedReferrals: string;
  teamWorkload: string;
  receivingFacilityBottlenecks: string;
  sevenDayTrend: string;
  noFacilityReferrals: string;
  supervisorAction: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'CareRoute',
    appTagline: 'Community care, connected',
    demoNotice: 'Privacy-First Demo · Fictional Records Only',
    demoBanner: 'DEMO ENVIRONMENT: Synthetic data only. Never input real patient data.',
    nonDiagnosticDisclaimer: 'Administrative coordination platform. Does not calculate medical risk, diagnose, or recommend clinical treatment.',
    nonDiagnosticReminder: 'Reminder: Do not enter diagnoses, prescriptions, or clinical assessments. Record only administrative coordination notes.',
    roleSwitcher: 'Demo Role Simulator',
    activeRole: 'Active Role',
    roleWorker: 'Health Worker (HW-01)',
    roleSupervisor: 'Supervisor (SUP-01)',
    roleReviewer: 'Clinical Reviewer (CR-01)',
    navOverview: 'Overview',
    navPatients: 'People & Records',
    navFollowUps: 'Follow-ups',
    navReferrals: 'Referral Tracking',
    navNeedsAttention: 'Needs Attention',
    navAnalytics: 'Supervisor Analytics',
    navTimeline: 'Audit Timeline',
    navRules: 'Routing Rules',
    newFollowUp: 'New Follow-Up',
    newReferral: 'New Referral',
    addPatient: 'Add Person',
    recordObservation: 'Record Screening Note',
    activePatients: 'Active People',
    dueToday: 'Due Today',
    overdueTasks: 'Overdue Follow-ups',
    openReferrals: 'Open Referrals',
    needsAttention: 'Needs Attention',
    unassignedTasks: 'Unassigned Tasks',
    searchPlaceholder: 'Search by ID, name, facility, or service...',
    statusScheduled: 'Scheduled',
    statusDueToday: 'Due Today',
    statusOverdue: 'Overdue',
    statusCompleted: 'Completed',
    statusRescheduled: 'Rescheduled',
    statusContactPending: 'Contact Attempt Pending',
    statusClosed: 'Closed',
    referralDraft: 'Draft',
    referralSent: 'Sent',
    referralReceived: 'Received',
    referralAppointmentPending: 'Appointment Pending',
    referralReviewRequired: 'Review Required',
    referralCompleted: 'Completed',
    referralUnableToConfirm: 'Unable to Confirm',
    consentActive: 'Consent Active',
    consentRevoked: 'Consent Revoked',
    consentNotProvided: 'Consent Not Provided',
    exportSummary: 'Export Coordination Summary',
    resetDemo: 'Reset Demo Data',
    purgeData: 'Purge Local Data',
    offlineMode: 'Offline Mode (Queued)',
    onlineMode: 'Connected to Local SQLite',
    syncSuccess: 'Offline actions synced successfully with backend database.',
    permissionDeniedTitle: 'Permission Denied (Backend Enforced)',
    filterAll: 'All Records',
    resolve: 'Complete',
    reschedule: 'Reschedule',
    close: 'Close',
    viewDetails: 'View Profile',
    manageReferrals: 'Manage Referrals',
    demoEnvironment: 'DEMO ENVIRONMENT:', syntheticOnly: 'Synthetic data only. Fictional patient records and facilities.',
    simulateOffline: 'Simulate Offline', syncQueue: 'Sync Queue', goOnline: 'Go Online', demoDate: 'Demo Date:', viewOverdueAlerts: 'View overdue alerts',
    overviewEyebrow: 'COMMUNITY HEALTH COORDINATION', overviewTitle: 'CareRoute Overview', overviewDescription: 'Transparent follow-up scheduling, handoff visibility, and administrative coordination.',
    protocolTitle: 'Non-Diagnostic Coordination Protocol:', syntheticRecords: 'Synthetic records in workspace', dueForCheckin: 'Due for check-in on', exceedsGrace: 'Exceeds {days}-day grace period', pendingHandoff: 'Pending handoff or outcome',
    priorityQueue: 'Priority Work Queue', queueDescription: 'Tasks surfaced by transparent administrative rules', viewAllFollowUps: 'View all follow-ups', noOverdueFollowUps: 'No overdue follow-ups', withinGrace: 'All coordination tasks are within the configured {days}-day grace period.',
    assigned: 'Assigned:', markCompleted: 'Mark Completed', rescheduleWithReason: 'Reschedule with reason', rulesChecked: 'Rules checked against demo date:', configureGrace: 'Configure Grace Period', referralHandoffs: 'Referral Handoffs',
    directoryEyebrow: 'COORDINATION DIRECTORY', patientsDescription: 'Search, review, and coordinate synthetic patient records and routine observations.', searchPatients: 'Search by ID, name, facility, or screening note...', allFacilities: 'All Facilities', records: 'records',
    recordId: 'Record ID', personLabel: 'Person Label', ageBand: 'Age Band', primaryFacility: 'Primary Facility', caregiverConsent: 'Caregiver Consent', lastScreening: 'Last Screening', activeWork: 'Active Work', actions: 'Actions',
    noMatchingRecords: 'No matching records found', refineSearch: 'Try refining your search terms or filter criteria.', active: 'Active', notProvided: 'Not Provided', task: 'task', tasks: 'tasks', ref: 'ref', viewProfile: 'View Profile',
    coordinationWorkspace: 'Coordination Workspace', backendValidatesPermissions: 'Backend validates permissions', administrator: 'Administrator', connectedSQLite: 'Connected to Local SQLite', connectedSupabase: 'Connected to Supabase Cloud', configureSupabase: 'Click to configure Supabase.', viewStorageSettings: 'Click to view storage and database settings.', revoked: 'Revoked', cancelled: 'Cancelled', appFooter: 'CareRoute Community Health Follow-Up Coordination MVP', databaseLabel: 'SQLite Database:',
    followupsEyebrow: 'TASK WORKFLOW', followupsDescription: 'Schedule, complete, reschedule, and track routine follow-up tasks with clear status reasons.', overdueRule: 'Transparent Overdue Rule:', worker: 'Worker:', allWorkers: 'All Workers', unassigned: 'Unassigned', taskIdType: 'Task ID & Type', dueDate: 'Due Date', assignedWorker: 'Assigned Worker', statusLabel: 'Status', coordinationNotes: 'Coordination Notes', noMatchingFollowUps: 'No follow-up tasks match these criteria', adjustFilters: 'Adjust the status or worker filter to see more tasks.', referralsEyebrow: 'CARE CONTINUITY', referralsDescription: 'Track receiving facilities, handoff confirmations, loop closures, and unconfirmed referrals.', loopIntegrity: 'Loop-Closure Integrity Protocol:', allStatuses: 'All Statuses', referralId: 'Referral ID', destinationService: 'Receiving Destination & Service', referralDate: 'Referral Date', daysOpen: 'Days Open', handoffStatus: 'Handoff Status', nextFollowUp: 'Next Follow-up', noReferralsFound: 'No referrals found',
    overdueRuleBody: 'A task is overdue only while unresolved after its {days}-day grace period, calculated against {date}. Completed or closed tasks are not overdue.', loopIntegrityBody: 'A referral is not treated as received, scheduled, or completed until authorized staff record that update. Unconfirmed referrals remain visible until documented.', searchFollowUps: 'Search by ID, person, worker, or reason...', searchReferrals: 'Search by referral ID, person, facility, or service...', loopTracking: 'Loop-Closure Tracking', allReferralRegistry: 'All Referrals Registry', noOpenReferrals: 'No open referrals', allReferralsRecorded: 'All referrals have recorded closure outcomes.', loopClosure: 'Loop Closure', openFullRegistry: 'Open Full Referral Registry & Loop Closure',
    day: 'day', days: 'days', by: 'by', appointmentShort: 'Appt:', reasonLabel: 'Reason:', outcomeLabel: 'Outcome:', notScheduled: 'Not Scheduled', none: 'None', updateStatus: 'Update Status', recordHandoffUpdate: 'Record staff-confirmed handoff update', markUnableToConfirm: 'Mark as Unable to Confirm with documented reason', loopClosed: 'Loop Closed',
    attentionDescription: 'Administrative coordination gaps surfaced by transparent rules. Each item explains the rule that was triggered.', operationalWorkflowOnly: 'Operational Workflow Only:', attentionWarning: 'These flags highlight scheduling and documentation gaps. They do not assess clinical risk, illness severity, or medical emergencies.', noCoordinationGaps: 'No coordination gaps detected', itemsRequiringReview: 'administrative coordination items requiring review:', administrativeTrigger: 'Administrative Trigger:',
    timelineDescription: 'Chronological record of coordination events, status updates, rescheduling actions, and configuration changes.', factualAuditHistory: 'Factual Audit History:', factualAuditDescription: 'This timeline records administrative actions and when they occurred. It is not a clinical chart or diagnostic record.', entityType: 'Entity Type:', allActivities: 'All Activities', screeningObservations: 'Screening Observations', events: 'events', noEvents: 'No events found', noActivitiesMatch: 'No recorded activities match your selected filter.',
    rulesDescription: 'Configure administrative routing thresholds, overdue grace periods, and explainable flag criteria.', restrictedRoles: 'Restricted to Supervisors and Administrators', adminRulesProtocol: 'Administrative Rules Protocol:', adminRulesDescription: 'These rules organize administrative queues, handoff reminders, and follow-up tasks. They are not clinical triage algorithms, medical risk scores, or diagnostic indicators.', overdueGracePeriod: 'Overdue Grace Period', referralAppointmentThreshold: 'Referral Appointment Review Threshold', referralInactivityThreshold: 'Referral Inactivity Threshold', flagUnassignedTasks: 'Flag Unassigned Coordination Tasks', flagMissingDate: 'Flag Referrals Missing Next Check-in Date', livePreview: 'Live Rule Impact Preview', recalculatedPreview: 'Recalculated in real time using the selected thresholds and demo date', flaggedItems: 'flagged coordination items', whyFlagged: 'Why Cases Would Be Flagged Under These Rules', enabled: 'Enabled', disabled: 'Disabled',
    analyticsDescription: 'Administrative coordination performance, referral handoffs, and team workload.', operationalMetrics: 'Operational Workflow Metrics:', completionRate: 'Completion Rate', unassignedWork: 'Unassigned Work', unconfirmedReferrals: 'Unconfirmed Referrals', teamWorkload: 'Team Workload Distribution', receivingFacilityBottlenecks: 'Receiving Facility Bottlenecks', sevenDayTrend: '7-Day Coordination Activity Trend', noFacilityReferrals: 'No facility referrals recorded.', supervisorAction: 'Supervisor Action:',
  },
  te: {
    "appName": "CareRoute",
    "appTagline": "కమ్యూనిటీ కేర్, కనెక్ట్ చేయబడింది",
    "demoNotice": "గోప్యత-మొదటి డెమో · కల్పిత రికార్డులు మాత్రమే",
    "demoBanner": "డెమో ఎన్విరాన్ ‌ మెంట్: సింథటిక్ డేటా మాత్రమే. నిజమైన రోగి డేటాను ఎప్పుడూ ఇన్ ‌ పుట్ చేయవద్దు.",
    "nonDiagnosticDisclaimer": "అడ్మినిస్ట్రేటివ్ కోఆర్డినేషన్ ప్లాట్ ‌ ఫాం. వైద్య ప్రమాదాన్ని లెక్కించదు, క్లినికల్ చికిత్సను నిర్ధారించదు లేదా సిఫారసు చేయదు.",
    "nonDiagnosticReminder": "రిమైండర్: రోగ నిర్ధారణలు, ప్రిస్క్రిప్షన్ ‌ లు లేదా క్లినికల్ అసెస్ ‌ మెంట్ ‌ లను నమోదు చేయవద్దు. పరిపాలనా సమన్వయ గమనికలను మాత్రమే రికార్డ్ చేయండి.",
    "roleSwitcher": "డెమో రోల్ సిమ్యులేటర్",
    "activeRole": "యాక్టివ్ రోల్",
    "roleWorker": "హెల్త్ వర్కర్ (HW-01)",
    "roleSupervisor": "సూపర్ ‌ వైజర్ (SUP-01)",
    "roleReviewer": "క్లినికల్ రివ్యూయర్ (CR-01)",
    "navOverview": "అవలోకనం",
    "navPatients": "వ్యక్తులు & రికార్డులు",
    "navFollowUps": "ఫాలో-అప్ ‌ లు",
    "navReferrals": "రెఫరల్ ట్రాకింగ్",
    "navNeedsAttention": "శ్రద్ధ అవసరం",
    "navAnalytics": "సూపర్ ‌ వైజర్ అనలిటిక్స్",
    "navTimeline": "ఆడిట్ టైమ్ ‌ లైన్",
    "navRules": "రూటింగ్ నియమాలు",
    "newFollowUp": "కొత్త ఫాలో-అప్",
    "newReferral": "కొత్త రెఫరల్",
    "addPatient": "వ్యక్తిని జోడించండి",
    "recordObservation": "రికార్డ్ స్క్రీనింగ్ గమనిక",
    "activePatients": "చురుకైన వ్యక్తులు",
    "dueToday": "నేడు బకాయి ఉంది",
    "overdueTasks": "బకాయి ఉన్న ఫాలో-అప్ ‌ లు",
    "openReferrals": "రిఫరల్ ‌ లను తెరవండి",
    "needsAttention": "శ్రద్ధ అవసరం",
    "unassignedTasks": "కేటాయించని టాస్క్ ‌ లు",
    "searchPlaceholder": "ID, పేరు, సౌకర్యం లేదా సేవ ద్వారా శోధించండి...",
    "statusScheduled": "షెడ్యూల్ చేయబడింది",
    "statusDueToday": "నేడు బకాయి ఉంది",
    "statusOverdue": "బకాయి",
    "statusCompleted": "పూర్తయింది",
    "statusRescheduled": "రీషెడ్యూల్ చేయబడింది",
    "statusContactPending": "కాంటాక్ట్ ప్రయత్నం పెండింగ్ ‌ లో ఉంది",
    "statusClosed": "మూసివేయబడింది",
    "referralDraft": "డ్రాఫ్ట్",
    "referralSent": "పంపబడింది",
    "referralReceived": "అందుకుంది",
    "referralAppointmentPending": "అపాయింట్ ‌ మెంట్ పెండింగ్ ‌ లో ఉంది",
    "referralReviewRequired": "సమీక్ష అవసరం",
    "referralCompleted": "పూర్తయింది",
    "referralUnableToConfirm": "నిర్ధారణ చేయలేకపోయింది",
    "consentActive": "సమ్మతి యాక్టివ్",
    "consentRevoked": "సమ్మతి ఉపసంహరించబడింది",
    "consentNotProvided": "సమ్మతి అందించబడలేదు",
    "exportSummary": "ఎగుమతి సమన్వయ సారాంశం",
    "resetDemo": "డెమో డేటాను రీసెట్ చేయండి",
    "purgeData": "స్థానిక డేటాను ప్రక్షాళన చేయండి",
    "offlineMode": "ఆఫ్ ‌ లైన్ మోడ్ (క్యూలో ఉంది)",
    "onlineMode": "స్థానిక SQLiteకు కనెక్ట్ చేయబడింది",
    "syncSuccess": "బ్యాకెండ్ డేటాబేస్ ‌ తో ఆఫ్ ‌ లైన్ చర్యలు విజయవంతంగా సమకాలీకరించబడ్డాయి.",
    "permissionDeniedTitle": "అనుమతి నిరాకరించబడింది (బ్యాకెండ్ అమలు చేయబడింది)",
    "filterAll": "అన్ని రికార్డులు",
    "resolve": "పూర్తయింది",
    "reschedule": "రీషెడ్యూల్ చేయండి",
    "close": "మూయండి",
    "viewDetails": "ప్రొఫైల్‌ను వీక్షించండి",
    "manageReferrals": "రెఫరల్ ‌ లను నిర్వహించండి",
    "demoEnvironment": "డెమో ఎన్విరాన్ ‌ మెంట్:",
    "syntheticOnly": "సింథటిక్ డేటా మాత్రమే. కాల్పనిక రోగి రికార్డులు మరియు సౌకర్యాలు.",
    "simulateOffline": "ఆఫ్ ‌ లైన్ ‌ ను అనుకరించండి",
    "syncQueue": "సింక్ క్యూ",
    "goOnline": "ఆన్‌లైన్‌కు వెళ్ళండి",
    "demoDate": "డెమో తేదీ:",
    "viewOverdueAlerts": "ఆలస్యమైన అలర్ట్ ‌ లను వీక్షించండి",
    "overviewEyebrow": "కమ్యూనిటీ హెల్త్ కోఆర్డినేషన్",
    "overviewTitle": "CareRoute అవలోకనం",
    "overviewDescription": "పారదర్శక ఫాలో-అప్ షెడ్యూల్, హ్యాండ్-ఆఫ్ దృశ్యమానత మరియు పరిపాలనా సమన్వయం.",
    "protocolTitle": "నాన్-డయాగ్నొస్టిక్ కోఆర్డినేషన్ ప్రోటోకాల్:",
    "syntheticRecords": "వర్క్ ‌ స్పేస్ ‌ లో సింథటిక్ రికార్డులు",
    "dueForCheckin": "చెక్-ఇన్ కోసం బకాయి ఉంది",
    "exceedsGrace": "{days}-రోజు గ్రేస్ పీరియడ్ దాటింది",
    "pendingHandoff": "పెండింగ్ ‌ లో ఉన్న హ్యాండ్ ‌ ఆఫ్ లేదా ఫలితం",
    "priorityQueue": "ప్రాధాన్యత పని క్యూ",
    "queueDescription": "పారదర్శక పరిపాలనా నియమాల ద్వారా ఏర్పడిన పనులు",
    "viewAllFollowUps": "అన్ని ఫాలో-అప్ ‌ లను చూడండి",
    "noOverdueFollowUps": "గడువుకు మించి ఫాలో-అప్ ‌ లు లేవు",
    "withinGrace": "అన్ని సమన్వయ పనులు కాన్ఫిగర్ చేసిన {days}-రోజు గ్రేస్ పీరియడ్ ‌ లో ఉన్నాయి.",
    "assigned": "రెక్",
    "markCompleted": "మార్క్ పూర్తయింది",
    "rescheduleWithReason": "కారణంతో రీషెడ్యూల్ చేయండి",
    "rulesChecked": "డెమో తేదీకి వ్యతిరేకంగా తనిఖీ చేసిన నియమాలు:",
    "configureGrace": "గ్రేస్ పీరియడ్ ‌ ను కాన్ఫిగర్ చేయండి",
    "referralHandoffs": "రెఫరల్ హ్యాండ్ ‌ ఆఫ్ ‌ లు",
    "directoryEyebrow": "సమన్వయ డైరెక్టరీ",
    "patientsDescription": "సింథటిక్ రోగి రికార్డులు మరియు సాధారణ పరిశీలనలను శోధించండి, సమీక్షించండి మరియు సమన్వయం చేయండి.",
    "searchPatients": "ID, పేరు, సౌకర్యం లేదా స్క్రీనింగ్ నోట్ ద్వారా శోధించండి...",
    "allFacilities": "అన్ని సౌకర్యాలు",
    "records": "రికార్డులు",
    "recordId": "రికార్డ్ ID",
    "personLabel": "వ్యక్తి లేబుల్",
    "ageBand": "ఏజ్ బ్యాండ్",
    "primaryFacility": "ప్రాథమిక సదుపాయం",
    "caregiverConsent": "సంరక్షకుని సమ్మతి",
    "lastScreening": "చివరి స్క్రీనింగ్",
    "activeWork": "చురుకైన పని",
    "actions": "చర్యలు",
    "noMatchingRecords": "సరిపోలే రికార్డులు కనుగొనబడలేదు",
    "refineSearch": "మీ శోధన నిబంధనలను లేదా ఫిల్టర్ ప్రమాణాలను మెరుగుపరచడానికి ప్రయత్నించండి.",
    "active": "క్రియాశీల",
    "notProvided": "అందించబడలేదు",
    "task": "పని",
    "tasks": "టాస్క్‌లు",
    "ref": "రిఫరెన్స్. ",
    "viewProfile": "ప్రొఫైల్‌ను వీక్షించండి",
    "coordinationWorkspace": "కోఆర్డినేషన్ వర్క్ ‌ స్పేస్",
    "backendValidatesPermissions": "బ్యాకెండ్ అనుమతులను ధృవీకరిస్తుంది",
    "administrator": "నిర్వాహకుడు",
    "connectedSQLite": "స్థానిక SQLiteకు కనెక్ట్ చేయబడింది",
    "connectedSupabase": "సుపాబేస్ క్లౌడ్ ‌ కు కనెక్ట్ చేయబడింది",
    "configureSupabase": "సుపాబేస్ ‌ ను కాన్ఫిగర్ చేయడానికి క్లిక్ చేయండి.",
    "viewStorageSettings": "స్టోరేజ్ మరియు డేటాబేస్ సెట్టింగ్ ‌ లను వీక్షించడానికి క్లిక్ చేయండి.",
    "revoked": "ఉపసంహరించబడింది",
    "cancelled": "రద్దు చేయండి",
    "appFooter": "CareRoute కమ్యూనిటీ హెల్త్ ఫాలో-అప్ కోఆర్డినేషన్ MVP",
    "databaseLabel": "SQLite డేటాబేస్:",
    "followupsEyebrow": "టాస్క్ వర్క్ ‌ ఫ్లో",
    "followupsDescription": "స్పష్టమైన స్టేటస్ కారణాలతో సాధారణ ఫాలో-అప్ టాస్క్ ‌ లను షెడ్యూల్ చేయండి, పూర్తి చేయండి, రీషెడ్యూల్ చేయండి మరియు ట్రాక్ చేయండి.",
    "overdueRule": "పారదర్శక ఓవర్ ‌ డ్యూ రూల్:",
    "worker": "పనివాడు:",
    "allWorkers": "కార్మికులందరూ",
    "unassigned": "అప్పగించని",
    "taskIdType": "టాస్క్ ID & రకం",
    "dueDate": "గడువు తేది",
    "assignedWorker": "కేటాయించిన కార్మికుడు",
    "statusLabel": "స్థితి",
    "coordinationNotes": "సమన్వయ గమనికలు",
    "noMatchingFollowUps": "ఫాలో-అప్ టాస్క్ ‌ లు ఈ ప్రమాణాలకు సరిపోలడం లేదు",
    "adjustFilters": "మరిన్ని పనులను చూడటానికి స్టేటస్ లేదా వర్కర్ ఫిల్టర్ ‌ ను సర్దుబాటు చేయండి.",
    "referralsEyebrow": "సంరక్షణ కొనసాగింపు",
    "referralsDescription": "స్వీకరించే సదుపాయాలు, హ్యాండ్ ‌ ఆఫ్ నిర్ధారణలు, లూప్ క్లోజర్ ‌ లు మరియు ధృవీకరించని రిఫరల్ ‌ లను ట్రాక్ చేయండి.",
    "loopIntegrity": "లూప్-క్లోజర్ సమగ్రత ప్రోటోకాల్:",
    "allStatuses": "అన్ని స్టేటస్ ‌ లు",
    "referralId": "రెఫరల్ ID",
    "destinationService": "గమ్యస్థానం & సేవను స్వీకరించడం",
    "referralDate": "రెఫరల్ తేదీ",
    "daysOpen": "తెరిచిన రోజులు",
    "handoffStatus": "హ్యాండ్ఆఫ్ స్టేటస్",
    "nextFollowUp": "తదుపరి ఫాలో-అప్",
    "noReferralsFound": "రెఫరల్ ‌ లు ఏవీ కనుగొనబడలేదు",
    "overdueRuleBody": "ఒక టాస్క్ దాని {days}-రోజుల గ్రేస్ పీరియడ్ తర్వాత, {date} కు వ్యతిరేకంగా లెక్కించబడిన తర్వాత పరిష్కరించబడనప్పుడు మాత్రమే ఆలస్యం అవుతుంది. పూర్తయిన లేదా మూసివేసిన టాస్క్ ‌ లు ఆలస్యం కావు.",
    "loopIntegrityBody": "అధీకృత సిబ్బంది ఆ అప్ ‌ డేట్ ‌ ను రికార్డ్ చేసే వరకు రిఫరల్ ‌ ను స్వీకరించినట్లుగా, షెడ్యూల్ చేసినట్లుగా లేదా పూర్తి చేసినట్లుగా పరిగణించరు. డాక్యుమెంట్ చేసే వరకు ధృవీకరించని రెఫరల్ ‌ లు కనిపిస్తాయి.",
    "searchFollowUps": "ID, వ్యక్తి, కార్మికుడు లేదా కారణం ద్వారా శోధించండి...",
    "searchReferrals": "రిఫరల్ ID, వ్యక్తి, సౌకర్యం లేదా సేవ ద్వారా శోధించండి...",
    "loopTracking": "లూప్-క్లోజర్ ట్రాకింగ్",
    "allReferralRegistry": "అన్ని రెఫరల్ ‌ ల రిజిస్ట్రీ",
    "noOpenReferrals": "ఓపెన్ రిఫరల్ ‌ లు లేవు",
    "allReferralsRecorded": "అన్ని రిఫరల్ ‌ లు మూసివేత ఫలితాలను నమోదు చేశాయి.",
    "loopClosure": "లూప్ క్లోజర్",
    "openFullRegistry": "పూర్తి రెఫరల్ రిజిస్ట్రీ & లూప్ క్లోజర్ ‌ ను తెరవండి",
    "day": "రోజు",
    "days": "రోజులు",
    "by": "చే",
    "appointmentShort": "అపాయింట్‌మెంట్:",
    "reasonLabel": "కారణం: ",
    "outcomeLabel": "ఫలితం",
    "notScheduled": "షెడ్యూల్ చేయబడలేదు",
    "none": "ఏమీ లేదు",
    "updateStatus": "స్టేటస్ ‌ ను అప్ ‌ డేట్ చేయండి",
    "recordHandoffUpdate": "సిబ్బంది-ధృవీకరించిన హ్యాండ్ ‌ ఆఫ్ అప్ ‌ డేట్ ‌ ను రికార్డ్ చేయండి",
    "markUnableToConfirm": "డాక్యుమెంట్ చేసిన కారణంతో నిర్ధారించడం సాధ్యం కాదని గుర్తించండి",
    "loopClosed": "లూప్ మూసివేయబడింది",
    "attentionDescription": "పరిపాలనా సమన్వయ లోపాలు పారదర్శక నియమాల ద్వారా బయటపడ్డాయి. ప్రతి అంశం ట్రిగ్గర్ చేసిన నియమాన్ని వివరిస్తుంది.",
    "operationalWorkflowOnly": "కార్యాచరణ వర్క్ ‌ ఫ్లో మాత్రమే:",
    "attentionWarning": "ఈ ఫ్లాగ్ ‌ లు షెడ్యూల్ మరియు డాక్యుమెంటేషన్ అంతరాలను హైలైట్ చేస్తాయి. వారు క్లినికల్ రిస్క్, అనారోగ్య తీవ్రత లేదా వైద్య అత్యవసర పరిస్థితులను అంచనా వేయరు.",
    "noCoordinationGaps": "సమన్వయ అంతరాలు ఏవీ కనుగొనబడలేదు",
    "itemsRequiringReview": "సమీక్ష అవసరమయ్యే పరిపాలనా సమన్వయ అంశాలు:",
    "administrativeTrigger": "అడ్మినిస్ట్రేటివ్ ట్రిగ్గర్:",
    "timelineDescription": "సమన్వయ సంఘటనలు, స్టేటస్ అప్ ‌ డేట్ ‌ లు, రీషెడ్యూల్ చర్యలు మరియు కాన్ఫిగరేషన్ మార్పుల కాలక్రమానుసారం రికార్డ్.",
    "factualAuditHistory": "వాస్తవ ఆడిట్ చరిత్ర:",
    "factualAuditDescription": "ఈ కాలపట్టిక పరిపాలనా చర్యలను మరియు అవి ఎప్పుడు సంభవించాయో నమోదు చేస్తుంది. ఇది క్లినికల్ చార్ట్ లేదా డయాగ్నొస్టిక్ రికార్డ్ కాదు.",
    "entityType": "ఎంటిటీ రకం:",
    "allActivities": "అన్ని కార్యకలాపాలు",
    "screeningObservations": "స్క్రీనింగ్ పరిశీలనలు",
    "events": "% 1 ప్రచురించు",
    "noEvents": "ఈవెంట్ ‌ లు ఏవీ కనుగొనబడలేదు",
    "noActivitiesMatch": "మీరు ఎంచుకున్న ఫిల్టర్ ‌ తో రికార్డ్ చేసిన యాక్టివిటీలు ఏవీ సరిపోలలేదు.",
    "rulesDescription": "అడ్మినిస్ట్రేటివ్ రూటింగ్ పరిమితులు, ఆలస్యమైన గ్రేస్ పీరియడ్ ‌ లు మరియు వివరించదగిన ఫ్లాగ్ ప్రమాణాలను కాన్ఫిగర్ చేయండి.",
    "restrictedRoles": "పర్యవేక్షకులు మరియు నిర్వాహకులకు పరిమితం చేయబడింది",
    "adminRulesProtocol": "అడ్మినిస్ట్రేటివ్ రూల్స్ ప్రోటోకాల్:",
    "adminRulesDescription": "ఈ నియమాలు అడ్మినిస్ట్రేటివ్ క్యూలు, హ్యాండ్ ఆఫ్ రిమైండర్ ‌ లు మరియు ఫాలో-అప్ టాస్క్ ‌ లను నిర్వహిస్తాయి. అవి క్లినికల్ ట్రయాజ్ అల్గోరిథంలు, మెడికల్ రిస్క్ స్కోర్లు లేదా డయాగ్నొస్టిక్ ఇండికేటర్ ‌ లు కాదు.",
    "overdueGracePeriod": "గడువు మించిన గ్రేస్ పీరియడ్",
    "referralAppointmentThreshold": "రెఫరల్ అపాయింట్ ‌ మెంట్ సమీక్ష పరిమితి",
    "referralInactivityThreshold": "రెఫరల్ ఇనాక్టివిటీ పరిమితి",
    "flagUnassignedTasks": "కేటాయించని సమన్వయ పనులను ఫ్లాగ్ చేయండి",
    "flagMissingDate": "ఫ్లాగ్ రిఫరల్స్ తదుపరి చెక్-ఇన్ తేదీ లేదు",
    "livePreview": "లైవ్ రూల్ ఇంపాక్ట్ ప్రివ్యూ",
    "recalculatedPreview": "ఎంచుకున్న పరిమితులు మరియు డెమో తేదీని ఉపయోగించి నిజ సమయంలో తిరిగి లెక్కించబడుతుంది",
    "flaggedItems": "ఫ్లాగ్ చేయబడిన సమన్వయ అంశాలు",
    "whyFlagged": "ఈ నిబంధనల ప్రకారం కేసులు ఎందుకు ఫ్లాగ్ చేయబడతాయి",
    "enabled": "చేతనంచేసిన",
    "disabled": "వికలాంగులు",
    "analyticsDescription": "పరిపాలనా సమన్వయ పనితీరు, రెఫరల్ హ్యాండ్ ‌ ఆఫ్ ‌ లు మరియు జట్టు పనిభారం.",
    "operationalMetrics": "కార్యాచరణ వర్క్ ‌ ఫ్లో కొలమానాలు:",
    "completionRate": "పూర్తి చేసిన రేటు",
    "unassignedWork": "కేటాయించని పని",
    "unconfirmedReferrals": "ధృవీకరించని రిఫరల్ ‌ లు",
    "teamWorkload": "టీమ్ వర్క్ ‌ లోడ్ పంపిణీ",
    "receivingFacilityBottlenecks": "ఫెసిలిటీ బాటిల్ ‌ నెక్ ‌ లను స్వీకరించడం",
    "sevenDayTrend": "7-రోజుల సమన్వయ కార్యాచరణ ట్రెండ్",
    "noFacilityReferrals": "సౌకర్యం రెఫరల్ ‌ లు రికార్డ్ చేయబడలేదు.",
    "supervisorAction": "సూపర్ ‌ వైజర్ చర్య:",
  },
  mr: {
    "appName": "केअर रूट",
    "appTagline": "सामुदायिक काळजी, कनेक्ट केलेले",
    "demoNotice": "गोपनीयता - प्रथम डेमो · केवळ काल्पनिक रेकॉर्ड",
    "demoBanner": "डेमो वातावरण: केवळ सिंथेटिक डेटा. वास्तविक रुग्णांचा डेटा कधीही इनपुट करू नका.",
    "nonDiagnosticDisclaimer": "प्रशासकीय समन्वय व्यासपीठ. वैद्यकीय जोखीम गणना नाही, निदान, किंवा क्लिनिकल उपचार शिफारस.",
    "nonDiagnosticReminder": "रिमाइंडर: निदान, प्रिस्क्रिप्शन किंवा क्लिनिकल मूल्यांकन प्रविष्ट करू नका. केवळ प्रशासकीय समन्वयाच्या नोट्स रेकॉर्ड करा.",
    "roleSwitcher": "डेमो भूमिका सिम्युलेटर",
    "activeRole": "सक्रिय भूमिका",
    "roleWorker": "आरोग्य कर्मचारी (HW -01)",
    "roleSupervisor": "पर्यवेक्षक (एसयूपी -01)",
    "roleReviewer": "क्लिनिकल समीक्षक (सीआर -01)",
    "navOverview": "अवलोकन",
    "navPatients": "लोक आणि नोंदी",
    "navFollowUps": "पाठपुरावा",
    "navReferrals": "रेफरल ट्रॅकिंग",
    "navNeedsAttention": "लक्ष देण्याची गरज",
    "navAnalytics": "पर्यवेक्षक विश्लेषण",
    "navTimeline": "ऑडिट टाइमलाइन",
    "navRules": "रूटिंगचे नियम",
    "newFollowUp": "नवीन पाठपुरावा",
    "newReferral": "नवीन रेफरल",
    "addPatient": "व्यक्ती जोडा",
    "recordObservation": "रेकॉर्ड स्क्रीनिंग टीप",
    "activePatients": "सक्रिय लोक",
    "dueToday": "आज देय",
    "overdueTasks": "प्रलंबित पाठपुरावा",
    "openReferrals": "रेफरल्स उघडा",
    "needsAttention": "लक्ष देण्याची गरज",
    "unassignedTasks": "नियुक्त न केलेली कार्ये",
    "searchPlaceholder": "आयडी, नाव, सुविधा किंवा सेवेद्वारे शोधा...",
    "statusScheduled": "शेड्युल केले",
    "statusDueToday": "आज देय",
    "statusOverdue": "थकीत",
    "statusCompleted": "पूर्ण केले",
    "statusRescheduled": "पुन्हा शेड्युल केले",
    "statusContactPending": "संपर्क करण्याचा प्रयत्न प्रलंबित",
    "statusClosed": "बंद झालेले",
    "referralDraft": "मसुदा ",
    "referralSent": "पाठविले",
    "referralReceived": "प्राप्त केले",
    "referralAppointmentPending": "अपॉइंटमेंट प्रलंबित",
    "referralReviewRequired": "पुनरावलोकन आवश्यक आहे",
    "referralCompleted": "पूर्ण केले",
    "referralUnableToConfirm": "पुष्टी करू शकत नाही",
    "consentActive": "संमती सक्रिय",
    "consentRevoked": "संमती रद्द केली",
    "consentNotProvided": "संमती दिली नाही",
    "exportSummary": "निर्यात समन्वय सारांश",
    "resetDemo": "डेमो डेटा रीसेट करा",
    "purgeData": "स्थानिक डेटा पुसून टाका",
    "offlineMode": "ऑफलाइन मोड (रांगेत)",
    "onlineMode": "स्थानिक SQLite शी जोडलेले",
    "syncSuccess": "ऑफलाइन क्रिया बॅकएंड डेटाबेससह यशस्वीरित्या समक्रमित केल्या.",
    "permissionDeniedTitle": "परवानगी नाकारली (बॅकएंड लागू केली)",
    "filterAll": "सर्व नोंदी",
    "resolve": "पूर्ण केले",
    "reschedule": "पुन्हा शेड्युल करा",
    "close": "बंद",
    "viewDetails": "प्रोफाइल पहा",
    "manageReferrals": "रेफरल्स व्यवस्थापित करा",
    "demoEnvironment": "डेमो वातावरण:",
    "syntheticOnly": "केवळ कृत्रिम डेटा. काल्पनिक रुग्णांच्या नोंदी आणि सुविधा.",
    "simulateOffline": "ऑफलाइनचे अनुकरण करा",
    "syncQueue": "रांग समक्रमित करा",
    "goOnline": "ऑनलाइन जा",
    "demoDate": "डेमो तारीख:",
    "viewOverdueAlerts": "थकीत सूचना पहा",
    "overviewEyebrow": "सामुदायिक आरोग्य समन्वय",
    "overviewTitle": "CareRoute विहंगावलोकन",
    "overviewDescription": "पारदर्शक पाठपुरावा शेड्युलिंग, हँडऑफ दृश्यमानता आणि प्रशासकीय समन्वय.",
    "protocolTitle": "गैर - निदान समन्वय प्रोटोकॉल:",
    "syntheticRecords": "वर्कस्पेसमधील सिंथेटिक रेकॉर्ड",
    "dueForCheckin": "रोजी चेक - इनसाठी देय आहे",
    "exceedsGrace": "{days}- दिवसांच्या अतिरिक्त कालावधीपेक्षा जास्त",
    "pendingHandoff": "प्रलंबित हँडऑफ किंवा निकाल",
    "priorityQueue": "प्राधान्य कार्य रांग",
    "queueDescription": "पारदर्शक प्रशासकीय नियमांद्वारे उद्‌भवलेली कामे",
    "viewAllFollowUps": "सर्व पाठपुरावा पहा",
    "noOverdueFollowUps": "अवांछित पाठपुरावा नाही",
    "withinGrace": "सर्व समन्वय कार्ये कॉन्फिगर केलेल्या {days}- दिवसांच्या अतिरिक्त कालावधीत आहेत.",
    "assigned": "नियुक्त केले:",
    "markCompleted": "चिन्ह पूर्ण झाले",
    "rescheduleWithReason": "कारणासह पुन्हा शेड्युल करा",
    "rulesChecked": "डेमो तारखेच्या विरूद्ध तपासलेले नियम:",
    "configureGrace": "ग्रेस कालावधी संयोजीत करा",
    "referralHandoffs": "रेफरल हँडऑफ्स",
    "directoryEyebrow": "समन्वय निर्देशिका",
    "patientsDescription": "कृत्रिम रुग्णांच्या नोंदी आणि नियमित निरीक्षणे शोधा, पुनरावलोकन करा आणि समन्वय साधा.",
    "searchPatients": "आयडी, नाव, सुविधा किंवा स्क्रीनिंग नोटनुसार शोधा...",
    "allFacilities": "सर्व सुविधा",
    "records": "रेकॉर्ड",
    "recordId": "रेकॉर्ड आयडी",
    "personLabel": "व्यक्ती लेबल",
    "ageBand": "वयोगटातील बँड",
    "primaryFacility": "प्राथमिक सुविधा",
    "caregiverConsent": "काळजीवाहकांची संमती",
    "lastScreening": "शेवटचे स्क्रिनिंग",
    "activeWork": "सक्रिय कार्य",
    "actions": "कृत्या",
    "noMatchingRecords": "कोणतीही जुळणारी रेकॉर्ड आढळली नाहीत",
    "refineSearch": "आपल्या शोध अटी किंवा फिल्टर निकष परिष्कृत करण्याचा प्रयत्न करा.",
    "active": "सक्रिय",
    "notProvided": "प्रदान केलेले नाही",
    "task": "कार्य",
    "tasks": "कार्ये",
    "ref": "संदर्भ",
    "viewProfile": "प्रोफाइल पहा",
    "coordinationWorkspace": "समन्वय वर्कस्पेस",
    "backendValidatesPermissions": "बॅकएंड परवानग्यांची पडताळणी करते",
    "administrator": "प्रशासक",
    "connectedSQLite": "स्थानिक SQLite शी जोडलेले",
    "connectedSupabase": "बाहुबलीला जोडलेली पाने - विकिपीडिया",
    "configureSupabase": "सुपाबेस कॉन्फिगर करण्यासाठी क्लिक करा.",
    "viewStorageSettings": "स्टोरेज आणि डेटाबेस सेटिंग्ज पाहण्यासाठी क्लिक करा.",
    "revoked": "रद्द केले",
    "cancelled": "रद्द केले",
    "appFooter": "CareRoute सामुदायिक आरोग्य पाठपुरावा समन्वय MVP",
    "databaseLabel": "SQLite डेटाबेस:",
    "followupsEyebrow": "कार्यप्रवाह",
    "followupsDescription": "स्पष्ट स्थिती कारणांसह नियमित पाठपुरावा कार्ये शेड्युल करा, पूर्ण करा, पुन्हा शेड्युल करा आणि ट्रॅक करा.",
    "overdueRule": "पारदर्शक थकीत नियम:",
    "worker": "कामगार",
    "allWorkers": "सर्व कामगार",
    "unassigned": "नियुक्त न केलेले:",
    "taskIdType": "कार्य आयडी प्रकार (T)",
    "dueDate": "देय तारीख ",
    "assignedWorker": "असाइन केलेला कर्मचारी",
    "statusLabel": "स्थिती",
    "coordinationNotes": "समन्वय नोट्स",
    "noMatchingFollowUps": "कोणतेही पाठपुरावा कार्य या निकषांशी जुळत नाही",
    "adjustFilters": "अधिक कार्ये पाहण्यासाठी स्थिती किंवा कामगार फिल्टर समायोजित करा.",
    "referralsEyebrow": "काळजी सातत्य",
    "referralsDescription": "ट्रॅक प्राप्त सुविधा, हँडऑफ पुष्टीकरण, लूप बंद करणे आणि पुष्टी न केलेले रेफरल्स.",
    "loopIntegrity": "लूप - क्लोझर इंटिग्रिटी प्रोटोकॉल:",
    "allStatuses": "सर्व स्थिती",
    "referralId": "रेफरल आयडी",
    "destinationService": "गंतव्य आणि सेवा प्राप्त करणे",
    "referralDate": "रेफरल तारीख",
    "daysOpen": "दिवस उघडे",
    "handoffStatus": "सुपूर्द करण्याची स्थिती",
    "nextFollowUp": "पुढील पाठपुरावा",
    "noReferralsFound": "कोणतेही रेफरल्स आढळले नाहीत",
    "overdueRuleBody": "{date} च्या तुलनेत गणना केलेल्या त्याच्या {days}- दिवसांच्या अतिरिक्त कालावधीनंतर निराकरण न केलेले एखादे कार्य केवळ थकीत आहे. पूर्ण झालेली किंवा बंद झालेली कामे वेळेत पूर्ण होत नाहीत.",
    "loopIntegrityBody": "अधिकृत स्टाफने ते अपडेट रेकॉर्ड करेपर्यंत रेफरल प्राप्त झाल्याप्रमाणे, शेड्युल केल्याप्रमाणे किंवा पूर्ण केल्याप्रमाणे मानले जात नाही. दस्तऐवज होईपर्यंत पुष्टी न केलेले रेफरल्स दृश्यमान राहतील.",
    "searchFollowUps": "आयडी, व्यक्ती, कामगार किंवा कारणानुसार शोधा...",
    "searchReferrals": "रेफरल आयडी, व्यक्ती, सुविधा किंवा सेवेद्वारे शोधा...",
    "loopTracking": "लूप - बंद ट्रॅकिंग",
    "allReferralRegistry": "सर्व संदर्भ नोंदणी",
    "noOpenReferrals": "कोणतेही खुले रेफरल्स नाहीत",
    "allReferralsRecorded": "प्रत्येक नोटाबंदीचे परिणाम दिसू लागले आहेत.",
    "loopClosure": "लूप बंद करणे",
    "openFullRegistry": "पूर्ण रेफरल रजिस्ट्री आणि लूप क्लोजर उघडा",
    "day": "दिवस",
    "days": "दिवस",
    "by": "द्वारे",
    "appointmentShort": "अ‍ॅप:",
    "reasonLabel": "कारण: ",
    "outcomeLabel": "परिणाम:",
    "notScheduled": "शेड्युल केलेले नाही",
    "none": "काहीही नाही",
    "updateStatus": "स्थिती अपडेट करा",
    "recordHandoffUpdate": "कर्मचारी - पुष्टी केलेले हँडऑफ अपडेट रेकॉर्ड करा",
    "markUnableToConfirm": "दस्तऐवजीकरण कारणासह पुष्टी करू शकत नाही म्हणून चिन्हांकित करा",
    "loopClosed": "लूप बंद",
    "attentionDescription": "प्रशासकीय समन्वयातील त्रुटी पारदर्शक नियमांद्वारे समोर आल्या. प्रत्येक लेखात त्यांनी मांडलेला नियम समजावून सांगितला आहे.",
    "operationalWorkflowOnly": "केवळ ऑपरेशनल वर्कफ्लो:",
    "attentionWarning": "हे ध्वज वेळापत्रक आणि दस्तऐवजीकरण अंतरांवर प्रकाश टाकतात. ते क्लिनिकल जोखीम, आजाराची तीव्रता किंवा वैद्यकीय आपत्कालीन परिस्थितीचे मूल्यांकन करत नाहीत.",
    "noCoordinationGaps": "समन्वय अंतर आढळले नाही",
    "itemsRequiringReview": "पुनरावलोकन आवश्यक असलेल्या प्रशासकीय समन्वय आयटम:",
    "administrativeTrigger": "प्रशासकीय ट्रिगर:",
    "timelineDescription": "समन्वय इव्हेंट्स, स्थिती अद्यतने, रीशेडिंग क्रिया आणि कॉन्फिगरेशन बदलांची कालक्रमानुसार नोंद.",
    "factualAuditHistory": "वास्तविक लेखापरीक्षण इतिहास:",
    "factualAuditDescription": "ही कालमर्यादा प्रशासकीय कारवाईची नोंद करते आणि ती केव्हा घडली. हे क्लिनिकल चार्ट किंवा निदान रेकॉर्ड नाही.",
    "entityType": "संस्था प्रकार:",
    "allActivities": "सर्व क्रियाकलाप",
    "screeningObservations": "स्क्रिनिंग निरीक्षणे",
    "events": "घटना/कार्यक्रम",
    "noEvents": "कोणतेही इव्हेंट आढळले नाहीत",
    "noActivitiesMatch": "कोणतेही रेकॉर्ड केलेले क्रिया आपल्या निवडलेल्या फिल्टरशी जुळत नाहीत.",
    "rulesDescription": "प्रशासकीय मार्ग मर्यादा कॉन्फिगर करा, थकीत ग्रेस पीरियड्स, आणि स्पष्ट ध्वज निकष.",
    "restrictedRoles": "पर्यवेक्षक आणि प्रशासकांसाठी प्रतिबंधित",
    "adminRulesProtocol": "प्रशासकीय नियम प्रोटोकॉल:",
    "adminRulesDescription": "हे नियम प्रशासकीय रांगा, हँडऑफ स्मरणपत्रे आणि पाठपुरावा कार्ये आयोजित करतात. ते क्लिनिकल ट्रायज अल्गोरिदम, वैद्यकीय जोखीम स्कोअर किंवा निदान निर्देशक नाहीत.",
    "overdueGracePeriod": "थकीत ग्रेस कालावधी",
    "referralAppointmentThreshold": "रेफरल अपॉइंटमेंट पुनरावलोकन मर्यादा",
    "referralInactivityThreshold": "रेफरल निष्क्रियता मर्यादा",
    "flagUnassignedTasks": "ध्वजांकित नसलेली समन्वय कार्ये",
    "flagMissingDate": "फ्लॅग रेफरल्स पुढील चेक - इन तारीख गहाळ आहे",
    "livePreview": "थेट नियम प्रभाव पूर्वावलोकन",
    "recalculatedPreview": "निवडलेल्या थ्रेशोल्ड्स आणि डेमो तारखेचा वापर करून रिअल टाइममध्ये पुन्हा गणना केली जाते",
    "flaggedItems": "ध्वजांकित समन्वय आयटम",
    "whyFlagged": "या नियमांनुसार प्रकरणे ध्वजांकित का केली गेली?",
    "enabled": "सक्रीय केलेले",
    "disabled": "निष्क्रिय केलेले",
    "analyticsDescription": "प्रशासकीय समन्वय कामगिरी, रेफरल हँडऑफ्स आणि टीमचा कामाचा भार.",
    "operationalMetrics": "ऑपरेशनल वर्कफ्लो मेट्रिक्स:",
    "completionRate": "पूर्ण करण्याचा दर",
    "unassignedWork": "नियुक्त न केलेले कार्य",
    "unconfirmedReferrals": "पुष्टी न केलेले रेफरल्स",
    "teamWorkload": "टीम वर्कलोड वितरण",
    "receivingFacilityBottlenecks": "सुविधा बॉटलनेक प्राप्त करणे",
    "sevenDayTrend": "7 - दिवसीय समन्वय क्रियाकलाप कल",
    "noFacilityReferrals": "कोणतीही सुविधा रेफरल्स नोंदवलेली नाहीत.",
    "supervisorAction": "पर्यवेक्षक क्रिया:",
  },
  ta: {
    "appName": "CareRoute",
    "appTagline": "சமூகப் பராமரிப்பு, இணைக்கப்பட்டுள்ளது",
    "demoNotice": "தனியுரிமை-முதல் டெமோ · கற்பனையான பதிவுகள் மட்டும்",
    "demoBanner": "டெமோ சூழல்: செயற்கை தரவு மட்டுமே. உண்மையான நோயாளியின் தரவை ஒருபோதும் உள்ளிட வேண்டாம்.",
    "nonDiagnosticDisclaimer": "நிர்வாக ஒருங்கிணைப்பு தளம். மருத்துவ அபாயத்தை கணக்கிடவோ, மருத்துவ சிகிச்சையை கண்டறியவோ அல்லது பரிந்துரைக்கவோ இல்லை.",
    "nonDiagnosticReminder": "நினைவூட்டல்: நோயறிதல்கள், பரிந்துரைகள் அல்லது மருத்துவ மதிப்பீடுகளை உள்ளிட வேண்டாம். நிர்வாக ஒருங்கிணைப்பு குறிப்புகளை மட்டுமே பதிவு செய்யவும்.",
    "roleSwitcher": "டெமோ ரோல் சிமுலேட்டர்",
    "activeRole": "செயலில் உள்ள பங்கு",
    "roleWorker": "சுகாதாரப் பணியாளர் (HW-01)",
    "roleSupervisor": "மேற்பார்வையாளர் (SUP-01)",
    "roleReviewer": "மருத்துவ மதிப்பீட்டாளர் (CR-01)",
    "navOverview": "மேலோட்டம்",
    "navPatients": "மக்கள் & பதிவுகள்",
    "navFollowUps": "பின்தொடர்தல்கள்",
    "navReferrals": "ரெஃபரல் கண்காணிப்பு",
    "navNeedsAttention": "கவனம் தேவை",
    "navAnalytics": "மேற்பார்வையாளர் பகுப்பாய்வு",
    "navTimeline": "தணிக்கை காலக்கெடு",
    "navRules": "ரூட்டிங் விதிகள்",
    "newFollowUp": "புதிய பின்தொடர்தல்",
    "newReferral": "புதிய ரெஃபரல்",
    "addPatient": "நபரைச் சேர்க்கவும்",
    "recordObservation": "பதிவு ஸ்கிரீனிங் குறிப்பு",
    "activePatients": "செயலில் உள்ளவர்கள்",
    "dueToday": "இன்றே நிறைவுறுto- do is completed",
    "overdueTasks": "தாமதமான பின்தொடர்தல்கள்",
    "openReferrals": "ரெஃபரல்களைத் திறக்கவும்",
    "needsAttention": "கவனம் தேவை",
    "unassignedTasks": "ஒதுக்கப்படாத பணிகள்",
    "searchPlaceholder": "ID, பெயர், வசதி அல்லது சேவை மூலம் தேடுங்கள்...",
    "statusScheduled": "திட்டமிடப்பட்டது",
    "statusDueToday": "இன்றே நிறைவுறுto- do is completed",
    "statusOverdue": "காலங்கடந்த தவணை",
    "statusCompleted": "முடிவடைந்தது",
    "statusRescheduled": "மறுதிட்டமிடப்பட்டது",
    "statusContactPending": "தொடர்பு முயற்சி நிலுவையில் உள்ளது",
    "statusClosed": "மூடப்பட்டது",
    "referralDraft": "வரைவு",
    "referralSent": "அனுப்பப்பட்டது",
    "referralReceived": "பெறப்பட்டது",
    "referralAppointmentPending": "நியமனம் நிலுவையில் உள்ளது",
    "referralReviewRequired": "மதிப்பாய்வு தேவை",
    "referralCompleted": "முடிவடைந்தது",
    "referralUnableToConfirm": "உறுதிப்படுத்த முடியவில்லை",
    "consentActive": "ஒப்புதல் செயலில் உள்ளது",
    "consentRevoked": "ஒப்புதல் ரத்து செய்யப்பட்டது",
    "consentNotProvided": "ஒப்புதல் வழங்கப்படவில்லை",
    "exportSummary": "ஏற்றுமதி ஒருங்கிணைப்பு சுருக்கம்",
    "resetDemo": "டெமோ தரவை மீட்டமைக்கவும்",
    "purgeData": "உள்ளூர் தரவை அகற்றவும்",
    "offlineMode": "ஆஃப்லைன் பயன்முறை (வரிசையில்)",
    "onlineMode": "உள்ளூர் SQLite உடன் இணைக்கப்பட்டுள்ளது",
    "syncSuccess": "பேக்எண்ட் தரவுத்தளத்துடன் ஆஃப்லைன் செயல்கள் வெற்றிகரமாக ஒத்திசைக்கப்பட்டுள்ளன.",
    "permissionDeniedTitle": "அனுமதி மறுக்கப்பட்டது (பின்னணி அமல்படுத்தப்பட்டது)",
    "filterAll": "அனைத்து பதிவுகளும்",
    "resolve": "நிறைவுசெய்க",
    "reschedule": "மீண்டும் திட்டமிடவும்",
    "close": "மூடு",
    "viewDetails": "காட்சிப் பண்பினை ஏற்றுக",
    "manageReferrals": "ரெஃபரல்களை நிர்வகிக்கவும்",
    "demoEnvironment": "டெமோ சூழல்:",
    "syntheticOnly": "செயற்கை தரவு மட்டுமே. கற்பனையான நோயாளி பதிவுகள் மற்றும் வசதிகள்.",
    "simulateOffline": "ஆஃப்லைனை உருவகப்படுத்தவும்",
    "syncQueue": "வரிசையை ஒத்திசைக்கவும்",
    "goOnline": "ஆன்லைனுக்குச் செல்லுங்கள்",
    "demoDate": "டெமோ தேதி:",
    "viewOverdueAlerts": "தாமதமான விழிப்பூட்டல்களைக் காண்க",
    "overviewEyebrow": "சமூக சுகாதார ஒருங்கிணைப்பு",
    "overviewTitle": "CareRoute கண்ணோட்டம்",
    "overviewDescription": "வெளிப்படையான பின்தொடர்தல் திட்டமிடல், கைவிடுதல் தெரிவுநிலை மற்றும் நிர்வாக ஒருங்கிணைப்பு.",
    "protocolTitle": "நோயறிதல் அல்லாத ஒருங்கிணைப்பு நெறிமுறை:",
    "syntheticRecords": "பணியிடத்தில் செயற்கை பதிவுகள்",
    "dueForCheckin": "செக்-இன் செய்ய வேண்டிய தேதி",
    "exceedsGrace": "{days} - நாள் கருணைக் காலம் மீறுகிறது",
    "pendingHandoff": "கையளிப்பு அல்லது முடிவு நிலுவையில் உள்ளது",
    "priorityQueue": "முன்னுரிமை வேலை வரிசை",
    "queueDescription": "வெளிப்படையான நிர்வாக விதிகளால் வெளிப்பட்ட பணிகள்",
    "viewAllFollowUps": "அனைத்து பின்தொடர்தல்களையும் காண்க",
    "noOverdueFollowUps": "தாமதமான பின்தொடர்தல்கள் இல்லை",
    "withinGrace": "அனைத்து ஒருங்கிணைப்புப் பணிகளும் உள்ளமைக்கப்பட்ட {days}-நாள் கருணைக் காலத்திற்குள் உள்ளன.",
    "assigned": "இருத்திய",
    "markCompleted": "மார்க் முடிந்தது",
    "rescheduleWithReason": "காரணத்துடன் மறுதிட்டமிடவும்",
    "rulesChecked": "டெமோ தேதிக்கு எதிராக சரிபார்க்கப்பட்ட விதிகள்:",
    "configureGrace": "கிரேஸ் காலத்தை உள்ளமைக்கவும்",
    "referralHandoffs": "ரெஃபரல் கையளிப்புகள்",
    "directoryEyebrow": "ஒருங்கிணைப்பு அடைவு",
    "patientsDescription": "செயற்கை நோயாளி பதிவுகள் மற்றும் வழக்கமான அவதானிப்புகளைத் தேடவும், மதிப்பாய்வு செய்யவும் மற்றும் ஒருங்கிணைக்கவும்.",
    "searchPatients": "ID, பெயர், வசதி அல்லது ஸ்கிரீனிங் குறிப்பு மூலம் தேடவும்...",
    "allFacilities": "அனைத்து வசதிகளும்",
    "records": "பதிவேடுகள்",
    "recordId": "à®à®±à¯à®±à®¿à®à¯à®µà®¿à®±à¯à®à®¾à® à®®à¯à®à®µà®°à®¿ à®ªà¯à®¤à¯à®¤à®à®¤à¯à®¤à¯ à®¤à¯à®µà®à¯à®à®µà¯à®®à¯ à®à®±à¯à®±à®µà¯à®®à¯ à®®à¯à®à®¿à®¯à®µà®¿à®²à¯à®²à¯",
    "personLabel": "நபர் லேபிள்",
    "ageBand": "வயது பேண்ட்",
    "primaryFacility": "முதன்மை வசதி",
    "caregiverConsent": "பராமரிப்பாளர் ஒப்புதல்",
    "lastScreening": "கடைசியாக ஸ்கிரீனிங் செய்யப்பட்டது",
    "activeWork": "செயலில் உள்ள வேலை",
    "actions": "செயல்கள்",
    "noMatchingRecords": "பொருந்தும் பதிவுகள் எதுவும் கிடைக்கவில்லை",
    "refineSearch": "உங்கள் தேடல் விதிமுறைகளைச் சரிசெய்ய முயற்சிக்கவும் அல்லது வடிகட்டி அளவுகோல்களைச் சரிசெய்யவும்.",
    "active": "நடப்பில் உள்ள",
    "notProvided": "தமிழ் மொழிபெயர்ப்பு சேவை ஆங்கிலம் இலவச ஆன்லைன்",
    "task": "பணி",
    "tasks": "பணிகள்",
    "ref": "குறிப்பு ",
    "viewProfile": "காட்சிப் பண்பினை ஏற்றுக",
    "coordinationWorkspace": "ஒருங்கிணைப்பு பணியிடம்",
    "backendValidatesPermissions": "பேக்எண்ட் அனுமதிகளை சரிபார்க்கிறது",
    "administrator": "நிர்வாகி",
    "connectedSQLite": "உள்ளூர் SQLite உடன் இணைக்கப்பட்டுள்ளது",
    "connectedSupabase": "சுப்பாபேஸ் கிளவுட் உடன் இணைக்கப்பட்டுள்ளது",
    "configureSupabase": "சுபாபேஸை உள்ளமைக்க கிளிக் செய்யவும்.",
    "viewStorageSettings": "சேமிப்பகம் மற்றும் தரவுத்தள அமைப்புகளைக் காண கிளிக் செய்யவும்.",
    "revoked": "ஒத்தி வை",
    "cancelled": "ரத்து செய்யப்பட்டது",
    "appFooter": "CareRoute சமூக சுகாதார பின்தொடர்தல் ஒருங்கிணைப்பு MVP",
    "databaseLabel": "SQLite தரவுத்தளம்:",
    "followupsEyebrow": "பணி பணிப்பாய்வு",
    "followupsDescription": "தெளிவான நிலை காரணங்களுடன் வழக்கமான பின்தொடர்தல் பணிகளைத் திட்டமிடுங்கள், முடிக்கவும், மறுபரிசீலனை செய்யவும் மற்றும் கண்காணிக்கவும்.",
    "overdueRule": "வெளிப்படையான காலதாமத விதி:",
    "worker": "தொழிலாளி",
    "allWorkers": "அனைத்து தொழிலாளர்களும்",
    "unassigned": "பொறுப்பளிக்கபடாத",
    "taskIdType": "பணி ஐடி & வகை",
    "dueDate": "முடியும் தேதி@ title: column to- do location",
    "assignedWorker": "ஒதுக்கப்பட்ட பணியாளர்",
    "statusLabel": "நிலை",
    "coordinationNotes": "ஒருங்கிணைப்பு குறிப்புகள்",
    "noMatchingFollowUps": "பின்தொடர்தல் பணிகள் எதுவும் இந்த அளவுகோல்களுடன் பொருந்தவில்லை",
    "adjustFilters": "கூடுதல் பணிகளைக் காண நிலை அல்லது பணியாளர் வடிகட்டியை சரிசெய்யவும்.",
    "referralsEyebrow": "பராமரிப்பு தொடர்ச்சி",
    "referralsDescription": "பெறும் வசதிகள், கையளிப்பு உறுதிப்படுத்தல்கள், லூப் மூடல் மற்றும் உறுதிப்படுத்தப்படாத பரிந்துரைகளைக் கண்காணிக்கவும்.",
    "loopIntegrity": "லூப்-கிளோசர் ஒருமைப்பாடு நெறிமுறை:",
    "allStatuses": "அனைத்து நிலைகளிலும்",
    "referralId": "ரெஃபரல் ஐடி",
    "destinationService": "சேருமிடம் மற்றும் சேவையைப் பெறுதல்",
    "referralDate": "ரெஃபரல் தேதி",
    "daysOpen": "நாட்கள் திறந்திருக்கும்",
    "handoffStatus": "கையளிப்பு நிலை",
    "nextFollowUp": "அடுத்த பின்தொடர்தல்",
    "noReferralsFound": "ரெஃபரல்கள் எதுவும் கிடைக்கவில்லை",
    "overdueRuleBody": "ஒரு பணி அதன் {days}-நாள் கருணைக் காலத்திற்குப் பிறகு தீர்க்கப்படாதபோது மட்டுமே தாமதமாகும், இது {date} க்கு எதிராக கணக்கிடப்படுகிறது. முடிக்கப்பட்ட அல்லது மூடப்பட்ட பணிகள் தாமதமாகவில்லை.",
    "loopIntegrityBody": "அங்கீகரிக்கப்பட்ட பணியாளர்கள் புதுப்பிப்பைப் பதிவு செய்யும் வரை ஒரு ரெஃபரல் பெறப்பட்டதாகவோ, திட்டமிடப்பட்டதாகவோ அல்லது முடிக்கப்பட்டதாகவோ கருதப்படாது. ஆவணப்படுத்தப்படும் வரை உறுதிப்படுத்தப்படாத பரிந்துரைகள் தெரியும்.",
    "searchFollowUps": "ID, நபர், பணியாளர் அல்லது காரணம் மூலம் தேடவும்...",
    "searchReferrals": "ரெஃபரல் ஐடி, நபர், வசதி அல்லது சேவை மூலம் தேடவும்...",
    "loopTracking": "லூப்-கிளோசர் டிராக்கிங்",
    "allReferralRegistry": "அனைத்து பரிந்துரைகள் பதிவேடு",
    "noOpenReferrals": "திறந்த பரிந்துரைகள் இல்லை",
    "allReferralsRecorded": "அனைத்து பரிந்துரைகளுக்கும் முடிவு பதிவு செய்யப்பட்டுள்ளது.",
    "loopClosure": "பரிந்துரை நிறைவு",
    "openFullRegistry": "முழு பரிந்துரை பதிவேடு மற்றும் நிறைவைத் திறக்கவும்",
    "day": "நாள்",
    "days": "நாட்கள்",
    "by": "மூலம்",
    "appointmentShort": "சந்திப்பு:",
    "reasonLabel": "காரணம்:",
    "outcomeLabel": "முடிவு:",
    "notScheduled": "திட்டமிடப்படவில்லை",
    "none": "எதுவுமில்லை",
    "updateStatus": "நிலையைப் புதுப்பிக்கவும்",
    "recordHandoffUpdate": "பணியாளர் உறுதிப்படுத்திய ஒப்படைப்பு புதுப்பிப்பைப் பதிவு செய்யவும்",
    "markUnableToConfirm": "காரணத்துடன் உறுதிப்படுத்த முடியவில்லை எனக் குறிக்கவும்",
    "loopClosed": "பரிந்துரை முடிக்கப்பட்டது",
    "attentionDescription": "வெளிப்படையான விதிகள் மூலம் கண்டறியப்பட்ட நிர்வாக ஒருங்கிணைப்பு இடைவெளிகள். தூண்டப்பட்ட விதியை ஒவ்வொரு உருப்படியும் விளக்குகிறது.",
    "operationalWorkflowOnly": "செயல்பாட்டு பணிச்சுற்று மட்டும்:",
    "attentionWarning": "இந்தக் குறியீடுகள் திட்டமிடல் மற்றும் ஆவணப்படுத்தல் இடைவெளிகளைக் காட்டுகின்றன. மருத்துவ ஆபத்து, நோயின் தீவிரம் அல்லது அவசரநிலைகளை மதிப்பிடுவதில்லை.",
    "noCoordinationGaps": "ஒருங்கிணைப்பு இடைவெளிகள் இல்லை",
    "itemsRequiringReview": "மதிப்பாய்வு தேவைப்படும் நிர்வாக ஒருங்கிணைப்பு உருப்படிகள்:",
    "administrativeTrigger": "நிர்வாகத் தூண்டுதல்:",
    "timelineDescription": "ஒருங்கிணைப்பு நிகழ்வுகள், நிலை மாற்றங்கள், மறுதிட்டமிடல் மற்றும் அமைப்பு மாற்றங்களின் காலவரிசை.",
    "factualAuditHistory": "உண்மைத் தணிக்கை வரலாறு:",
    "factualAuditDescription": "இந்த காலவரிசை நிர்வாக நடவடிக்கைகளையும் அவை நடந்த நேரத்தையும் பதிவு செய்கிறது. இது மருத்துவ அல்லது நோயறிதல் பதிவு அல்ல.",
    "entityType": "உருப்படி வகை:",
    "allActivities": "அனைத்து செயல்பாடுகள்",
    "screeningObservations": "பரிசோதனை குறிப்புகள்",
    "events": "நிகழ்வுகள்",
    "noEvents": "நிகழ்வுகள் இல்லை",
    "noActivitiesMatch": "தேர்ந்தெடுத்த வடிகட்டிக்கு பொருந்தும் செயல்பாடுகள் இல்லை.",
    "rulesDescription": "நிர்வாக வழிமுறை வரம்புகள், தாமத சலுகைக் காலம் மற்றும் விளக்கக்கூடிய குறியீட்டு விதிகளை அமைக்கவும்.",
    "restrictedRoles": "மேற்பார்வையாளர்கள் மற்றும் நிர்வாகிகளுக்கு மட்டும்",
    "adminRulesProtocol": "நிர்வாக விதிமுறை நெறிமுறை:",
    "adminRulesDescription": "இந்த விதிகள் நிர்வாகப் பணிப்பட்டியல், ஒப்படைப்பு நினைவூட்டல்கள் மற்றும் பின்தொடர்தல் பணிகளை ஒழுங்குபடுத்துகின்றன. இவை மருத்துவ முன்னுரிமை அல்லது நோயறிதல் கருவிகள் அல்ல.",
    "overdueGracePeriod": "தாமத சலுகைக் காலம்",
    "referralAppointmentThreshold": "பரிந்துரை சந்திப்பு மதிப்பாய்வு வரம்பு",
    "referralInactivityThreshold": "பரிந்துரை செயலற்ற கால வரம்பு",
    "flagUnassignedTasks": "ஒதுக்கப்படாத ஒருங்கிணைப்பு பணிகளைக் குறிக்கவும்",
    "flagMissingDate": "அடுத்த சரிபார்ப்பு தேதி இல்லாத பரிந்துரைகளைக் குறிக்கவும்",
    "livePreview": "விதி தாக்கத்தின் நேரடி முன்னோட்டம்",
    "recalculatedPreview": "தேர்ந்தெடுத்த வரம்புகள் மற்றும் டெமோ தேதியைப் பயன்படுத்தி உடனடியாக மறுகணக்கிடப்பட்டது",
    "flaggedItems": "குறிக்கப்பட்ட ஒருங்கிணைப்பு உருப்படிகள்",
    "whyFlagged": "இந்த விதிகளின் கீழ் வழக்குகள் ஏன் குறிக்கப்படும்",
    "enabled": "இயக்கப்பட்டது",
    "disabled": "முடக்கப்பட்டது",
    "analyticsDescription": "நிர்வாக ஒருங்கிணைப்பு செயல்திறன், பரிந்துரை ஒப்படைப்புகள் மற்றும் குழுப் பணிச்சுமை.",
    "operationalMetrics": "செயல்பாட்டு பணிச்சுற்று அளவீடுகள்:",
    "completionRate": "நிறைவு விகிதம்",
    "unassignedWork": "ஒதுக்கப்படாத பணி",
    "unconfirmedReferrals": "உறுதிப்படுத்தப்படாத பரிந்துரைகள்",
    "teamWorkload": "குழுப் பணிச்சுமை பகிர்வு",
    "receivingFacilityBottlenecks": "பெறும் மைய இடையூறுகள்",
    "sevenDayTrend": "7 நாள் ஒருங்கிணைப்பு செயல்பாட்டு போக்கு",
    "noFacilityReferrals": "மையப் பரிந்துரைகள் எதுவும் பதிவு செய்யப்படவில்லை.",
    "supervisorAction": "மேற்பார்வையாளர் நடவடிக்கை:",
  },
  hi: {
    appName: 'CareRoute',
    appTagline: 'सामुदायिक स्वास्थ्य समन्वय',
    demoNotice: 'गोपनीयता-प्रथम डेमो · केवल काल्पनिक रिकॉर्ड',
    demoBanner: 'डेमो वातावरण: केवल कृत्रिम डेटा। वास्तविक रोगी विवरण कभी दर्ज न करें।',
    nonDiagnosticDisclaimer: 'प्रशासनिक समन्वय मंच। यह चिकित्सीय निदान या उपचार की सिफारिश नहीं करता है।',
    nonDiagnosticReminder: 'स्मरण: निदान या दवाएं दर्ज न करें। केवल प्रशासनिक समन्वय नोट्स दर्ज करें।',
    roleSwitcher: 'भूमिका चयनकर्ता',
    activeRole: 'सक्रिय भूमिका',
    roleWorker: 'स्वास्थ्य कार्यकर्ता (HW-01)',
    roleSupervisor: 'पर्यवेक्षक (SUP-01)',
    roleReviewer: 'चिकित्सीय समीक्षक (CR-01)',
    navOverview: 'अवलोकन',
    navPatients: 'व्यक्ति एवं रिकॉर्ड',
    navFollowUps: 'फॉलो-अप कार्य',
    navReferrals: 'रेफरल ट्रैकिंग',
    navNeedsAttention: 'ध्यानाकर्षण सूची',
    navAnalytics: 'पर्यवेक्षक विश्लेषण',
    navTimeline: 'गतिविधि इतिहास',
    navRules: 'प्रशासनिक नियम',
    newFollowUp: 'नया फॉलो-अप',
    newReferral: 'नया रेफरल',
    addPatient: 'व्यक्ति जोड़ें',
    recordObservation: 'स्क्रीनिंग नोट जोड़ें',
    activePatients: 'सक्रिय व्यक्ति',
    dueToday: 'आज देय',
    overdueTasks: 'अतिदेय कार्य',
    openReferrals: 'सक्रिय रेफरल',
    needsAttention: 'ध्यानाकर्षण आवश्यक',
    unassignedTasks: 'अनावंटित कार्य',
    searchPlaceholder: 'आईडी, नाम या केंद्र से खोजें...',
    statusScheduled: 'निर्धारित',
    statusDueToday: 'आज देय',
    statusOverdue: 'अतिदेय',
    statusCompleted: 'पूर्ण',
    statusRescheduled: 'पुनर्निर्धारित',
    statusContactPending: 'संपर्क प्रयास लंबित',
    statusClosed: 'बंद',
    referralDraft: 'प्रारूप',
    referralSent: 'भेजा गया',
    referralReceived: 'प्राप्त हुआ',
    referralAppointmentPending: 'मुलाकात लंबित',
    referralReviewRequired: 'समीक्षा आवश्यक',
    referralCompleted: 'पूर्ण',
    referralUnableToConfirm: 'पुष्टि करने में असमर्थ',
    consentActive: 'सहमति सक्रिय',
    consentRevoked: 'सहमति वापस ली गई',
    consentNotProvided: 'सहमति उपलब्ध नहीं',
    exportSummary: 'समन्वय सारांश निर्यात',
    resetDemo: 'डेमो रीसेट करें',
    purgeData: 'स्थानीय डेटा हटाएं',
    offlineMode: 'ऑफ़लाइन मोड (कतारबद्ध)',
    onlineMode: 'स्थानीय SQLite से जुड़ा हुआ',
    syncSuccess: 'ऑफ़लाइन क्रियाएं सफलतापूर्वक सिंक्रनाइज़ की गईं।',
    permissionDeniedTitle: 'अनुमति अस्वीकृत (सर्वर द्वारा सत्यापित)',
    filterAll: 'सभी रिकॉर्ड',
    resolve: 'पूर्ण करें',
    reschedule: 'पुनर्निर्धारित करें',
    close: 'बंद करें',
    viewDetails: 'प्रोफ़ाइल देखें',
    manageReferrals: 'रेफरल प्रबंधित करें',
    demoEnvironment: 'डेमो वातावरण:', syntheticOnly: 'केवल काल्पनिक डेटा। व्यक्ति और केंद्र रिकॉर्ड डेमो के हैं।',
    simulateOffline: 'ऑफ़लाइन स्थिति आज़माएं', syncQueue: 'कतार सिंक करें', goOnline: 'ऑनलाइन करें', demoDate: 'डेमो तिथि:', viewOverdueAlerts: 'अतिदेय अलर्ट देखें',
    overviewEyebrow: 'सामुदायिक स्वास्थ्य समन्वय', overviewTitle: 'CareRoute अवलोकन', overviewDescription: 'फॉलो-अप, रेफरल और प्रशासनिक समन्वय की पारदर्शी योजना।',
    protocolTitle: 'गैर-नैदानिक समन्वय प्रोटोकॉल:', syntheticRecords: 'कार्यस्थान में काल्पनिक रिकॉर्ड', dueForCheckin: 'जांच की नियत तिथि', exceedsGrace: '{days} दिन की छूट अवधि से अधिक', pendingHandoff: 'रेफरल या परिणाम लंबित',
    priorityQueue: 'प्राथमिकता कार्य सूची', queueDescription: 'पारदर्शी प्रशासनिक नियमों से चुने गए कार्य', viewAllFollowUps: 'सभी फॉलो-अप देखें', noOverdueFollowUps: 'कोई अतिदेय फॉलो-अप नहीं', withinGrace: 'सभी समन्वय कार्य {days} दिन की छूट अवधि के भीतर हैं।',
    assigned: 'जिम्मेदार:', markCompleted: 'पूर्ण चिह्नित करें', rescheduleWithReason: 'कारण सहित पुनर्निर्धारित करें', rulesChecked: 'डेमो तिथि पर नियम जांचे गए:', configureGrace: 'छूट अवधि सेट करें', referralHandoffs: 'रेफरल हस्तांतरण',
    directoryEyebrow: 'समन्वय निर्देशिका', patientsDescription: 'काल्पनिक व्यक्ति रिकॉर्ड और नियमित टिप्पणियां खोजें व समन्वित करें।', searchPatients: 'आईडी, नाम, केंद्र या स्क्रीनिंग नोट से खोजें...', allFacilities: 'सभी केंद्र', records: 'रिकॉर्ड',
    recordId: 'रिकॉर्ड आईडी', personLabel: 'व्यक्ति का नाम', ageBand: 'आयु समूह', primaryFacility: 'मुख्य केंद्र', caregiverConsent: 'देखभालकर्ता की सहमति', lastScreening: 'अंतिम स्क्रीनिंग', activeWork: 'सक्रिय कार्य', actions: 'कार्रवाई',
    noMatchingRecords: 'कोई मिलते-जुलते रिकॉर्ड नहीं', refineSearch: 'खोज शब्द या फ़िल्टर बदलकर देखें।', active: 'सक्रिय', notProvided: 'नहीं दिया गया', task: 'कार्य', tasks: 'कार्य', ref: 'रेफरल', viewProfile: 'प्रोफ़ाइल देखें',
    coordinationWorkspace: 'समन्वय कार्यक्षेत्र', backendValidatesPermissions: 'बैकएंड अनुमतियों की पुष्टि करता है', administrator: 'व्यवस्थापक', connectedSQLite: 'स्थानीय SQLite से जुड़ा', connectedSupabase: 'Supabase Cloud से जुड़ा', configureSupabase: 'Supabase सेट करने के लिए क्लिक करें।', viewStorageSettings: 'स्टोरेज और डेटाबेस सेटिंग देखने के लिए क्लिक करें।', revoked: 'वापस लिया गया', cancelled: 'रद्द', appFooter: 'CareRoute · सामुदायिक स्वास्थ्य फॉलो-अप समन्वय', databaseLabel: 'SQLite डेटाबेस:',
    followupsEyebrow: 'कार्य प्रवाह', followupsDescription: 'नियमित फॉलो-अप कार्यों को निर्धारित, पूर्ण, पुनर्निर्धारित और ट्रैक करें।', overdueRule: 'पारदर्शी अतिदेय नियम:', worker: 'कार्यकर्ता:', allWorkers: 'सभी कार्यकर्ता', unassigned: 'बिना आवंटित', taskIdType: 'कार्य आईडी और प्रकार', dueDate: 'नियत तिथि', assignedWorker: 'आवंटित कार्यकर्ता', statusLabel: 'स्थिति', coordinationNotes: 'समन्वय नोट्स', noMatchingFollowUps: 'इन मानदंडों से मेल खाता कार्य नहीं', adjustFilters: 'अधिक कार्य देखने के लिए स्थिति या कार्यकर्ता फ़िल्टर बदलें।', referralsEyebrow: 'सेवा निरंतरता', referralsDescription: 'प्राप्तकर्ता केंद्र, हस्तांतरण की पुष्टि, समापन और अपुष्ट रेफरल ट्रैक करें।', loopIntegrity: 'रेफरल समापन प्रोटोकॉल:', allStatuses: 'सभी स्थितियां', referralId: 'रेफरल आईडी', destinationService: 'प्राप्तकर्ता केंद्र और सेवा', referralDate: 'रेफरल तिथि', daysOpen: 'खुले दिन', handoffStatus: 'हस्तांतरण स्थिति', nextFollowUp: 'अगला फॉलो-अप', noReferralsFound: 'कोई रेफरल नहीं मिला',
    overdueRuleBody: '{days} दिन की छूट अवधि के बाद अनसुलझा रहने पर ही कार्य अतिदेय होता है (गणना तिथि {date})। पूर्ण या बंद कार्य अतिदेय नहीं होते।', loopIntegrityBody: 'अधिकृत कर्मचारी द्वारा दर्ज होने तक रेफरल को प्राप्त, निर्धारित या पूर्ण नहीं माना जाता। अपुष्ट रेफरल सूची में बने रहते हैं।', searchFollowUps: 'आईडी, व्यक्ति, कार्यकर्ता या कारण से खोजें...', searchReferrals: 'रेफरल आईडी, व्यक्ति, केंद्र या सेवा से खोजें...', loopTracking: 'रेफरल समापन ट्रैकिंग', allReferralRegistry: 'सभी रेफरल रजिस्टर', noOpenReferrals: 'कोई खुला रेफरल नहीं', allReferralsRecorded: 'सभी रेफरल के समापन परिणाम दर्ज हैं।', loopClosure: 'रेफरल समापन', openFullRegistry: 'पूरा रेफरल रजिस्टर खोलें',
    day: 'दिन', days: 'दिन', by: 'द्वारा', appointmentShort: 'मुलाकात:', reasonLabel: 'कारण:', outcomeLabel: 'परिणाम:', notScheduled: 'निर्धारित नहीं', none: 'कोई नहीं', updateStatus: 'स्थिति अपडेट करें', recordHandoffUpdate: 'कर्मचारी द्वारा पुष्टि दर्ज करें', markUnableToConfirm: 'कारण सहित अपुष्ट चिह्नित करें', loopClosed: 'रेफरल बंद',
    attentionDescription: 'पारदर्शी नियमों से पहचाने गए प्रशासनिक समन्वय अंतर। हर आइटम सक्रिय नियम समझाता है।', operationalWorkflowOnly: 'केवल संचालन कार्यप्रवाह:', attentionWarning: 'ये अलर्ट समय-सारणी और दस्तावेज़ीकरण की कमी दिखाते हैं। ये चिकित्सीय जोखिम, बीमारी की गंभीरता या आपात स्थिति का आकलन नहीं करते।', noCoordinationGaps: 'कोई समन्वय अंतर नहीं मिला', itemsRequiringReview: 'समीक्षा हेतु प्रशासनिक समन्वय आइटम:', administrativeTrigger: 'प्रशासनिक कारण:',
    timelineDescription: 'समन्वय घटनाओं, स्थिति बदलाव, पुनर्निर्धारण और कॉन्फ़िगरेशन बदलावों का कालक्रम।', factualAuditHistory: 'तथ्यात्मक ऑडिट इतिहास:', factualAuditDescription: 'यह समयरेखा प्रशासनिक कार्रवाइयों और उनके समय को दर्ज करती है। यह नैदानिक या निदान रिकॉर्ड नहीं है।', entityType: 'इकाई प्रकार:', allActivities: 'सभी गतिविधियां', screeningObservations: 'स्क्रीनिंग टिप्पणियां', events: 'घटनाएं', noEvents: 'कोई घटना नहीं मिली', noActivitiesMatch: 'चयनित फ़िल्टर से कोई गतिविधि मेल नहीं खाती।',
    rulesDescription: 'प्रशासनिक रूटिंग सीमा, अतिदेय छूट अवधि और स्पष्ट अलर्ट मानदंड सेट करें।', restrictedRoles: 'केवल पर्यवेक्षक और व्यवस्थापक के लिए', adminRulesProtocol: 'प्रशासनिक नियम प्रोटोकॉल:', adminRulesDescription: 'ये नियम प्रशासनिक कतार, हस्तांतरण रिमाइंडर और फॉलो-अप व्यवस्थित करते हैं। ये चिकित्सीय ट्रायेज या निदान संकेतक नहीं हैं।', overdueGracePeriod: 'अतिदेय छूट अवधि', referralAppointmentThreshold: 'रेफरल मुलाकात समीक्षा सीमा', referralInactivityThreshold: 'रेफरल निष्क्रियता सीमा', flagUnassignedTasks: 'बिना आवंटित कार्यों को चिह्नित करें', flagMissingDate: 'अगली तिथि के बिना रेफरल चिह्नित करें', livePreview: 'नियम प्रभाव का लाइव पूर्वावलोकन', recalculatedPreview: 'चयनित सीमा और डेमो तिथि के आधार पर तुरंत पुनर्गणना', flaggedItems: 'चिह्नित समन्वय आइटम', whyFlagged: 'इन नियमों से मामले क्यों चिह्नित होंगे', enabled: 'सक्रिय', disabled: 'निष्क्रिय',
    analyticsDescription: 'प्रशासनिक समन्वय प्रदर्शन, रेफरल हस्तांतरण और टीम कार्यभार।', operationalMetrics: 'संचालन कार्यप्रवाह मेट्रिक्स:', completionRate: 'पूर्णता दर', unassignedWork: 'बिना आवंटित कार्य', unconfirmedReferrals: 'अपुष्ट रेफरल', teamWorkload: 'टीम कार्यभार वितरण', receivingFacilityBottlenecks: 'प्राप्तकर्ता केंद्र की बाधाएं', sevenDayTrend: '7-दिन की समन्वय गतिविधि', noFacilityReferrals: 'केंद्र के लिए कोई रेफरल दर्ज नहीं।', supervisorAction: 'पर्यवेक्षक कार्रवाई:',
  },
};

export function localizeStatus(status: string, t: Translations): string {
  const labels: Record<string, string> = {
    Scheduled: t.statusScheduled,
    'Due Today': t.statusDueToday,
    Overdue: t.statusOverdue,
    Completed: t.statusCompleted,
    Rescheduled: t.statusRescheduled,
    'Contact Attempt Pending': t.statusContactPending,
    Closed: t.statusClosed,
    Draft: t.referralDraft,
    Sent: t.referralSent,
    Received: t.referralReceived,
    'Appointment Pending': t.referralAppointmentPending,
    'Review required': t.referralReviewRequired,
    'Unable to Confirm': t.referralUnableToConfirm,
    Active: t.active,
    Revoked: t.revoked,
    Cancelled: t.cancelled,
  };
  const matchingKey = Object.keys(labels).find((label) => label.toLowerCase() === status.toLowerCase());
  return matchingKey ? labels[matchingKey] : status;
}
