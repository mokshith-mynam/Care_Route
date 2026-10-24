# Environment Variables and Repository Hygiene

## `.env.example` template
Copy the names below as appropriate. Keep values empty or use obvious non-secret placeholders.

```dotenv
APP_ENV=development
APP_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:8000
DATABASE_URL=
AUTH_ISSUER_URL=
AUTH_CLIENT_ID=
AUTH_CLIENT_SECRET=
STORAGE_BUCKET=
EMAIL_PROVIDER_API_KEY=
PAYMENT_PROVIDER_SECRET_KEY=
LOG_LEVEL=info
```

Remove variables that do not apply. Public client IDs are not necessarily secrets, but confirm each provider's rules. Never place server-only secrets in a frontend-prefixed variable that gets bundled into the client.

## `.gitignore` baseline
```gitignore
.env
.env.*
!.env.example
*.pem
*.key
*.p12
*.pfx
secrets/
credentials/
node_modules/
dist/
build/
coverage/
.gradle/
local.properties
*.keystore
*.jks
.DS_Store
```

Adapt to the chosen stack. Ignore rules do not protect secrets already committed; rotate exposed credentials.

## Repository rules
- Use lockfiles and repeatable package manager commands.
- Protect main branch and require review/CI where possible.
- Enable secret scanning and dependency alerts.
- Keep a changelog or release notes.
- Never commit production database dumps, access tokens, signing keys, or real personal data.
- Review generated code and dependency install scripts before trusting them.
