export type Language = 'en' | 'es' | 'sw' | 'hi';

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
  },
  es: {
    appName: 'CareRoute',
    appTagline: 'Atención comunitaria conectada',
    demoNotice: 'Demostración de Privacidad · Solo Registros Ficticios',
    demoBanner: 'ENTORNO DE DEMO: Datos sintéticos únicamente. No ingrese información real de pacientes.',
    nonDiagnosticDisclaimer: 'Plataforma de coordinación administrativa. No realiza diagnósticos ni recomienda tratamientos.',
    nonDiagnosticReminder: 'Recordatorio: No ingrese diagnósticos ni recetas. Registre solo notas de coordinación administrativa.',
    roleSwitcher: 'Simulador de Roles',
    activeRole: 'Rol Activo',
    roleWorker: 'Agente de Salud (HW-01)',
    roleSupervisor: 'Supervisor (SUP-01)',
    roleReviewer: 'Revisor Clínico (CR-01)',
    navOverview: 'Resumen',
    navPatients: 'Personas y Registros',
    navFollowUps: 'Seguimientos',
    navReferrals: 'Derivaciones',
    navNeedsAttention: 'Requiere Atención',
    navAnalytics: 'Analítica de Supervisión',
    navTimeline: 'Línea de Tiempo',
    navRules: 'Reglas de Enrutamiento',
    newFollowUp: 'Nuevo Seguimiento',
    newReferral: 'Nueva Derivación',
    addPatient: 'Añadir Persona',
    recordObservation: 'Registrar Observación',
    activePatients: 'Personas Activas',
    dueToday: 'Vence Hoy',
    overdueTasks: 'Seguimientos Vencidos',
    openReferrals: 'Derivaciones Abiertas',
    needsAttention: 'Requiere Atención',
    unassignedTasks: 'Tareas sin Asignar',
    searchPlaceholder: 'Buscar por ID, nombre o centro...',
    statusScheduled: 'Programado',
    statusDueToday: 'Vence Hoy',
    statusOverdue: 'Vencido',
    statusCompleted: 'Completado',
    statusRescheduled: 'Reprogramado',
    statusContactPending: 'Intento de Contacto Pendiente',
    statusClosed: 'Cerrado',
    referralDraft: 'Borrador',
    referralSent: 'Enviado',
    referralReceived: 'Recibido',
    referralAppointmentPending: 'Cita Pendiente',
    referralReviewRequired: 'Revisión Requerida',
    referralCompleted: 'Completado',
    referralUnableToConfirm: 'No se Pudo Confirmar',
    consentActive: 'Consentimiento Activo',
    consentRevoked: 'Consentimiento Revocado',
    consentNotProvided: 'Sin Consentimiento',
    exportSummary: 'Exportar Resumen',
    resetDemo: 'Restablecer Datos',
    purgeData: 'Borrar Datos Locales',
    offlineMode: 'Modo Desconectado (En Cola)',
    onlineMode: 'Conectado a SQLite Local',
    syncSuccess: 'Acciones sincronizadas con la base de datos local.',
    permissionDeniedTitle: 'Permiso Denegado (Verificado en Servidor)',
    filterAll: 'Todos los Registros',
    resolve: 'Completar',
    reschedule: 'Reprogramar',
    close: 'Cerrar',
    viewDetails: 'Ver Perfil',
    manageReferrals: 'Gestionar Derivaciones',
  },
  sw: {
    appName: 'CareRoute',
    appTagline: 'Huduma ya jamii, imeunganishwa',
    demoNotice: 'Mfano wa Faragha · Rekodi za Kubuni Pekee',
    demoBanner: 'MAZINGIRA YA MFANO: Takwimu za mfano tu. Usiweke taarifa za wagonjwa halisi.',
    nonDiagnosticDisclaimer: 'Jukwaa la uratibu wa kiutawala. Halitoi utambuzi wa kimatibabu wala kupendekeza matibabu.',
    nonDiagnosticReminder: 'Kikumbusho: Usiweke utambuzi wa ugonjwa au maagizo ya dawa. Weka maelezo ya uratibu pekee.',
    roleSwitcher: 'Kibadilisha Majukumu',
    activeRole: 'Jukumu Linalotumika',
    roleWorker: 'Mhudumu wa Afya (HW-01)',
    roleSupervisor: 'Msimamizi (SUP-01)',
    roleReviewer: 'Mkaguzi wa Kliniki (CR-01)',
    navOverview: 'Muhtasari',
    navPatients: 'Watu na Rekodi',
    navFollowUps: 'Ufuatiliaji',
    navReferrals: 'Uhamisho wa Wagonjwa',
    navNeedsAttention: 'Inayohitaji Uangalizi',
    navAnalytics: 'Takwimu za Msimamizi',
    navTimeline: 'Historia ya Matukio',
    navRules: 'Kanuni za Utawala',
    newFollowUp: 'Ufuatiliaji Mpya',
    newReferral: 'Uhamisho Mpya',
    addPatient: 'Ongeza Mtu',
    recordObservation: 'Andika Uchunguzi',
    activePatients: 'Watu Walio Orodheshwa',
    dueToday: 'Inatakiwa Leo',
    overdueTasks: 'Zilizochelewa',
    openReferrals: 'Uhamisho Ulio Wazi',
    needsAttention: 'Inahitaji Uangalizi',
    unassignedTasks: 'Kazi Zisizopangwa',
    searchPlaceholder: 'Tafuta kwa kitambulisho, jina...',
    statusScheduled: 'Imepangwa',
    statusDueToday: 'Inatakiwa Leo',
    statusOverdue: 'Imechelewa',
    statusCompleted: 'Imekamilika',
    statusRescheduled: 'Imeahirishwa',
    statusContactPending: 'Jaribio la Mawasiliano',
    statusClosed: 'Imefungwa',
    referralDraft: 'Rasimu',
    referralSent: 'Imetumwa',
    referralReceived: 'Imepokelewa',
    referralAppointmentPending: 'Miadi Inasubiriwa',
    referralReviewRequired: 'Uhakiki Unahitajika',
    referralCompleted: 'Imekamilika',
    referralUnableToConfirm: 'Haiwezekani Kuthibitisha',
    consentActive: 'Idhini Ipo Hai',
    consentRevoked: 'Idhini Imefutwa',
    consentNotProvided: 'Hakuna Idhini',
    exportSummary: 'Pakua Muhtasari',
    resetDemo: 'Rejesha Data',
    purgeData: 'Futa Data ya Ndani',
    offlineMode: 'Nje ya Mtandao (Kwenye Foleni)',
    onlineMode: 'Imeunganishwa na SQLite',
    syncSuccess: 'Mabadiliko yamesawazishwa vizuri.',
    permissionDeniedTitle: 'Hauruhusiwi (Imethibitishwa na Mfumo)',
    filterAll: 'Rekodi Zote',
    resolve: 'Kamilisha',
    reschedule: 'Ahirisha',
    close: 'Funga',
    viewDetails: 'Tazama Wasifu',
    manageReferrals: 'Dhibiti Uhamisho',
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
  },
};
