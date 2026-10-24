# Web and Android Platform-Specific Notes

## If building a web app
- Define supported browsers and responsive breakpoints.
- Keep privileged logic and secrets server-side.
- Use secure cookies or a carefully designed token strategy; do not store long-lived sensitive tokens in localStorage by default.
- Review CORS, CSRF, CSP, security headers, cache rules, upload handling, redirects, and SSRF risk if the server fetches user-supplied URLs.
- Avoid exposing internal IDs or assuming obscurity is access control.
- Test keyboard navigation, screen readers, mobile layouts, and slow connections.
- Define SEO/indexing rules and prevent indexing of private pages.

## If building an Android app
- Define min/target SDK and supported device range.
- Use Android Keystore / platform secure storage for appropriate secrets; do not embed backend master keys or private API credentials.
- Minimize permissions and justify each one.
- Review exported activities/services/receivers/providers, intent filters, deep links, WebView usage, clipboard use, screenshots, backups, and notification privacy.
- Apply network security configuration and HTTPS; never accept all certificates in production.
- Handle process death, rotation, offline state, app upgrades, and OS permission revocation.
- Do not treat client-side feature flags, role checks, or obfuscation as security boundaries.
- Protect signing keys and configure a controlled release process.

## If building both
- Define a single source of truth for business rules and permissions, normally the backend.
- Specify API contracts before implementing both clients.
- Keep behavior consistent while allowing platform-appropriate UI.
- Test authorization independently of either client.
