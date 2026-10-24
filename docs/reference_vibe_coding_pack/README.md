# Production-Oriented Vibe-Coding Documentation Pack

This pack is a reusable starting point for planning, building, testing, securing, and deploying a **web application, Android app, or both** with AI coding tools.

## Important reality check
No collection of documents, prompt, framework, or test suite can guarantee an application has **zero vulnerabilities** or is automatically production-ready. Security depends on implementation, configuration, dependencies, infrastructure, operational practices, and independent review. This pack makes risks explicit and gives you repeatable checks; it does not replace security testing or qualified review for high-risk products.

## How to use this pack
1. Copy this folder for each new project.
2. Replace every `[TODO: ...]` placeholder. Do not let an AI agent silently invent business rules, legal obligations, or security decisions.
3. Start with `01_PRODUCT_REQUIREMENTS.md`, then `02_SCOPE_AND_ACCEPTANCE.md`.
4. Make architecture and data decisions in `03_ARCHITECTURE.md`, `04_DATA_AND_PRIVACY.md`, and `05_SECURITY_THREAT_MODEL.md`.
5. Define API contracts and UI flows before implementation.
6. Ask the coding agent to implement **one small vertical slice at a time**, update tests and docs, and report files changed and commands run.
7. Run the release gates in `12_RELEASE_CHECKLIST.md`. Do not deploy if critical/high findings, failing tests, exposed secrets, or unreviewed migrations remain.

## Suggested project structure
```text
project/
├── docs/                  # this documentation pack
├── src/                   # application source
├── tests/                 # automated tests
├── migrations/            # versioned database migrations
├── scripts/               # repeatable development/deployment tasks
├── .github/workflows/     # CI checks
├── .env.example           # variable names only; no secrets
├── .gitignore
└── README.md
```

## Project profile to fill in
- Product name: [TODO]
- Product owner / decision-maker: [TODO]
- Target users and countries: [TODO]
- Platform: [web / Android / both]
- Data sensitivity: [public / personal / sensitive / regulated]
- Authentication needed: [yes/no; method]
- Payments or financial actions: [yes/no]
- External integrations: [TODO]
- Hosting / app distribution: [TODO]
- Expected users and traffic: [TODO]
- Budget and deadline: [TODO]
- Legal / compliance review needed: [TODO]

## Recommended baseline
- Use supported, maintained frameworks and pin dependencies with a lockfile.
- Keep secrets out of source control and client-side code.
- Enforce authorization on the server for every protected resource/action.
- Validate untrusted input on the server; use safe output encoding and parameterized database operations.
- Use TLS in production, secure session/token handling, least-privilege access, backups, monitoring, and tested recovery.
- Automate formatting, linting, type checks, unit/integration tests, dependency scanning, secret scanning, and static analysis in CI.
- Maintain a rollback plan and test it.
