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
Open your browser at **`http://localhost:5173`**. The frontend is served from `frontend/`; Vite forwards `/api/*` requests to the backend API, which stores records in `database/local/careroute.db` and seeds synthetic records on first run.

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

## Project layout

```text
CareRoute_Startup_MVP/
├── frontend/                  # React application and browser-only services
│   ├── index.html              # Vite HTML entry point
│   └── src/                    # App, components, styles, API client, rules, types
├── backend/                   # Node.js API and production HTTP server
│   ├── server.js               # Serves dist/ and /api/* in production
│   ├── apiHandler.js            # REST endpoints and server-side role checks
│   ├── db.js                    # SQLite schema, queries, seed/reset operations
│   ├── seedData.js              # Fictional demo records
│   └── tests/                   # API and security tests
├── database/                  # Database files and schema assets
│   ├── local/careroute.db       # Local SQLite database (created on first run)
│   ├── migrations/              # Supabase PostgreSQL schema migration
│   └── scripts/                 # Supabase demo seeding notes
├── dist/                      # Production frontend build output
├── vite.config.ts              # Wires Vite frontend and backend API middleware
└── package.json                # Shared install/build/run commands
```

The frontend calls the backend through `frontend/src/apiClient.ts`. During development, the middleware in `vite.config.ts` sends `/api/*` requests to `backend/apiHandler.js`. In production, `backend/server.js` serves the built frontend and uses the same API handler. The SQLite database lives under `database/local/`; the PostgreSQL migration in `database/migrations/` is for the optional Supabase backend.

---

## 🧪 Testing & Code Quality

CareRoute includes automated test suites covering routing rules, edge cases, and backend RBAC security:

```bash
# Run unit & API integration test suites (Vitest)
npm test

# Run TypeScript compilation and production bundle build
npm run build

# Run ESLint validation
npm run lint
```

### Test Coverage Highlights
- `frontend/src/rules.test.ts`: Validates overdue calculations, due-today logic, unconfirmed referral detection, explainable reason generators, and coordination insights generation.
- `backend/tests/api_rbac.test.ts`: Exercises the API handler against SQLite and verifies that:
  - Public endpoints (`/api/health`, `/api/patients`, `/api/follow-ups`, `/api/referrals`, `/api/audit-events`) return valid data.
  - Updating routing rules as a `Health worker` returns **HTTP 403 Forbidden**.
  - Updating routing rules as a `Clinical reviewer` returns **HTTP 403 Forbidden**.
  - Updating routing rules as a `Supervisor` returns **HTTP 200 OK** and updates database state.

---

## 🔒 Architecture & Data Storage

### Relational Schema (`database/local/careroute.db`)
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
- **Local SQLite File:** All data resides in `database/local/careroute.db`. Clicking **"Reset Demo Data"** in the storage inspector will restore initial synthetic records; clicking **"Purge All Data"** will completely clear all tables for testing.
- **Offline Simulation:** Clicking "Simulate Offline" in the top bar queues updates locally in browser memory; clicking "Sync Queue" transmits them to the local SQLite server once reconnected.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
