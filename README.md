# CareRoute — Community Health Follow-Up Coordination (IC26-03-01)

> **IMPORTANT NON-CLINICAL NOTICE:**  
> CareRoute is an administrative coordination and tracking tool designed for primary-care workers and community health coordinators. **CareRoute does not diagnose, predict clinical outcomes, calculate medical risk scores, triage clinical emergencies, or recommend medical treatments.** All sample data within this repository is **100% synthetic and fictional**.

---

## 🎯 Executive Overview & Hackathon Challenge

Primary-care and community health workers frequently encounter disjointed communication, missed appointments, and unconfirmed referrals. CareRoute provides an explainable, privacy-conscious platform to record non-diagnostic screening observations, schedule follow-ups, and route cases using transparent administrative rules.

### Core Capabilities
1. **Explainable Routing Rules:** Clear, configurable thresholds (e.g., overdue window in days, referral confirmation follow-up threshold, review requirements) that explicitly state *why* a record appears in a queue.
2. **Referral Loop-Closure Tracking:** Dedicated workflow to monitor unconfirmed referrals, log contact attempts, document confirmation outcomes, or capture detailed drop-off reasons (e.g., transport barrier, financial constraints, specialist backlog).
3. **Actionable Coordination Insights:** "Needs Attention" queue identifying coordination bottlenecks (overdue tasks, contact pending, unassigned records, unconfirmed referrals) paired with plain-language explanations.
4. **Supervisor Workload & Bottleneck Analytics:** Operational views detailing health worker task distributions, facility referral turnaround, and aging statistics without diagnostic or clinician rankings.
5. **Role-Based Access Control (RBAC):** Backend-enforced role policies separating **Health Workers**, **Supervisors**, and **Clinical Reviewers**. Protected administrative operations (e.g., updating routing rules) return HTTP 403 Forbidden when unauthorized.
6. **Privacy-Conscious Minimum-Necessary Data Model:** Separation of operational tracking from sensitive records. Includes caregiver consent tracking, pseudonymized display identifiers, and one-click printable Minimum-Necessary Coordination Summary exports with prominent synthetic watermarks.
7. **Offline Simulation Mode:** Simulates connectivity disruptions in rural or low-bandwidth environments by queueing local mutations and providing visual indicators and manual sync capabilities.
8. **Internationalization & Accessibility:** 4 fully translated languages (English, Spanish, Kiswahili, Hindi), high-contrast toggle, keyboard-navigable dialogs, and responsive layouts.
9. **Zero Paid Cloud Accounts / Zero External Dependencies:** Built with Node.js 20+ built-in SQLite (`node:sqlite`), React 18, and Vite. Runs entirely on the local developer machine without cloud subscriptions, API keys, or remote services.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: Version 20 or higher (Node 22/24 recommended with native `node:sqlite` support).
- **npm**: Version 9 or higher.

### Installation
```bash
# Clone repository and navigate to folder
cd CareRoute_Startup_MVP

# Install all dependencies (zero external cloud SDKs)
npm install
```

### Running in Development Mode
Starts the Vite dev server with integrated local SQLite API middleware:
```bash
npm run dev
```
Open your browser at **`http://localhost:5173`**. The app connects to the embedded SQLite database (`data/careroute.db`) and automatically seeds realistic synthetic demonstration records.

### Running in Production Server Mode
Builds the optimized production client bundle and launches the standalone Node.js HTTP server:
```bash
npm run build
npm start
```
Open **`http://localhost:3000`**. The server serves both the static UI bundle and all `/api/*` endpoints.

For any non-demo deployment, set a random session secret and disable simulated header-based roles:
```bash
CAREROUTE_SESSION_SECRET="$(openssl rand -hex 32)" CAREROUTE_DEMO_MODE=false npm start
```
`CAREROUTE_DEMO_MODE` defaults to `true` for the local synthetic demo. Production deployments must replace the demo session endpoint with a real identity provider before exposing the server publicly.

---

## 🧪 Testing & Code Quality

CareRoute includes comprehensive automated test suites covering routing rules, edge cases, and backend RBAC security:

```bash
# Run unit & API integration test suites (Vitest)
npm test

# Run TypeScript compilation and production bundle build
npm run build

# Run ESLint validation
npm run lint
```

### Test Coverage Highlights
- `src/rules.test.ts`: Validates overdue calculations, due-today logic, unconfirmed referral detection, explainable reason generators, and coordination insights generation.
- `tests/api_rbac.test.ts`: Starts an ephemeral HTTP test server against SQLite and verifies that:
  - Public endpoints (`/api/health`, `/api/patients`, `/api/follow-ups`, `/api/referrals`, `/api/audit-events`) return valid data.
  - Updating routing rules as a `Health worker` returns **HTTP 403 Forbidden**.
  - Updating routing rules as a `Clinical reviewer` returns **HTTP 403 Forbidden**.
  - Updating routing rules as a `Supervisor` returns **HTTP 200 OK** and updates database state.

---

## 🔒 Architecture & Data Storage

```text
CareRoute_Startup_MVP/
├── data/
│   └── careroute.db             # Local relational SQLite database file (created on launch)
├── src/
│   ├── components/              # Modular UI components
│   │   ├── DashboardView.tsx    # Live operational metric counters & priority work queues
│   │   ├── PatientsView.tsx     # Patient directory, search, and detail drawer
│   │   ├── FollowUpsView.tsx    # Routine follow-up list, status update, & reschedule modals
│   │   ├── ReferralsView.tsx    # Referral registry & loop closure tracker
│   │   ├── NeedsAttentionView.tsx # Explainable coordination gap insights
│   │   ├── SupervisorAnalyticsView.tsx # Workload distribution & facility turnaround
│   │   ├── RulesConfigView.tsx  # Interactive rule threshold configuration with live preview
│   │   ├── TimelineView.tsx     # Chronological audit stream of coordination events
│   │   ├── ExportModal.tsx      # Printable minimum-necessary coordination summary
│   │   ├── StorageInfoModal.tsx # Local SQLite storage inspector, reset & purge controls
│   │   ├── CreateModals.tsx     # Modals for new patients, follow-ups, and referrals
│   │   ├── Sidebar.tsx          # Navigation, role switcher, language, & contrast toggles
│   │   └── TopBar.tsx           # Demo watermark, connection status, & offline simulation
│   ├── server/
│   │   ├── db.js                # SQLite schema migration, queries, seed, reset & purge
│   │   ├── apiHandler.js        # REST API endpoints & server-side RBAC enforcement
│   │   └── seedData.js          # Realistic synthetic test data (12 patients, tasks, referrals)
│   ├── apiClient.ts             # Client API wrapper with offline queue fallback
│   ├── demoData.ts              # Client fallback seed data and mock structures
│   ├── i18n.ts                  # Localization dictionaries (EN, ES, SW, HI)
│   ├── rules.ts                 # Pure administrative routing & insight calculation logic
│   ├── types.ts                 # TypeScript type definitions for domain entities
│   ├── App.tsx                  # Root application controller and modal orchestrator
│   └── styles.css               # Accessible, responsive CSS design system
├── tests/
│   └── api_rbac.test.ts         # Server-side HTTP RBAC test suite
├── server.js                    # Standalone Node.js HTTP server for production
├── vite.config.ts               # Vite configuration with embedded dev API middleware
└── README.md
```

### Relational Schema (`data/careroute.db`)
- `patients`: Demographics, contact method, caregiver name/phone, preferred language, enrollment date.
- `observations`: Non-diagnostic basic screening notes (e.g. routine checkup date, adherence barrier category, administrative notes).
- `consents`: Caregiver consent documentation, relation, and purpose.
- `follow_ups`: Scheduled dates, assigned community health worker, task type, status (`Scheduled`, `Due today`, `Overdue`, `Contact pending`, `Rescheduled`, `Completed`, `Cancelled`), reschedule reasons.
- `referrals`: Destination facility, specialty category, status (`Draft`, `Sent`, `Received`, `Appointment Pending`, `Completed`, `Unable to Confirm`, `Review Required`), confirmation attempts, failure reasons.
- `referral_status_history`: Audit trail of referral status transitions.
- `audit_events`: Immutable log of actions with timestamp, actor role, actor ID, entity ID, and description.
- `rule_config`: Persisted routing thresholds (`overdueDaysThreshold`, `unconfirmedReferralDaysThreshold`, `routineFollowUpIntervalDays`, `requireReviewForSpecialties`).

---

## 👥 Role-Based Access Control (RBAC) Demonstration

Switch roles using the bottom selector in the sidebar:
1. **Health Worker (`HW-101`)**:
   - Access: View patient queues, update follow-up statuses, log referral confirmation attempts, record caregiver consent.
   - Restriction: Attempting to modify routing rules is blocked with a 403 Forbidden response.
2. **Supervisor (`SUP-01`)**:
   - Access: Everything above plus team workload distribution analytics, facility turnaround bottleneck monitoring, and modifying administrative routing thresholds.
3. **Clinical Reviewer (`CR-01`)**:
   - Access: Read-only observation log review, verifying complex referral loop closures. Restricted from updating administrative routing thresholds.

---

## 🛡️ Privacy, Safety & Limitations

- **Non-Diagnostic:** CareRoute does not suggest clinical diagnoses, triage acuity scores, or medications.
- **Minimum-Necessary Data:** Displays only necessary operational data. Detailed health notes are restricted to factual non-diagnostic check-ins.
- **Local SQLite File:** All data resides in `data/careroute.db`. Clicking **"Reset Demo Data"** in the Local Storage inspector will restore initial synthetic records; clicking **"Purge All Data"** will completely clear all tables for testing.
- **Offline Simulation:** Clicking "Simulate Offline" in the top bar queues updates locally in browser memory; clicking "Sync Queue" transmits them to the local SQLite server once reconnected.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
