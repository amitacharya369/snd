# Signs & Decal Corp. (S+D) — Security & Maintenance Policy

This document details the cybersecurity measures, HTTP response headers, form protection mechanisms, and operational maintenance procedures implemented for the Signs & Decal Corp. web platform.

---

## 1. Application Security Measures

### Input Validation & Sanitization
- Untrusted inputs submitted to `/api/inquire` are strictly sanitized on the server before processing.
- HTML angle brackets (`<` and `>`) are stripped to prevent Stored and Reflected Cross-Site Scripting (XSS).
- Carriage return and line feed characters (`\r` and `\n`) are stripped from single-line fields to prevent HTTP and SMTP header injection attacks.
- Field length constraints are enforced on both client and server:
  - Name: 2 – 80 characters
  - Company: 2 – 100 characters
  - Email: Valid RFC regex format, max 100 characters
  - Scope / Message: 10 – 3,000 characters

### Anti-Spam & Bot Mitigation
- **Invisible Honeypot Field:** The inquiry form includes an invisible input field (`_hp_company_fax`) styled off-screen and excluded from keyboard tab indexing. Automated bots that fill this field receive a silent, generic success response without server execution.
- **In-Memory Rate Limiting:** A sliding window rate limiter restricts submissions to a maximum of 5 requests per 10-minute window per IP subnet.

### Zero Secrets Exposure & Privacy Protection
- No database credentials, email passwords, private certificates, or internal API tokens are committed to source control or exposed in client JavaScript bundles.
- Environment variables are isolated via `.env.local` and `.env.example`.
- Production error messages returned to clients are generic; internal stack traces and server environment variables are never exposed publicly.
- Submitted inquiries log only masked IP subnets (`192.168.x.x`) to preserve user privacy under applicable privacy frameworks.

---

## 2. Configured Production HTTP Security Headers

Configured in `next.config.ts` and verified in actual server responses:

| Header | Production Setting | Purpose |
| :--- | :--- | :--- |
| **Content-Security-Policy (CSP)** | `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none';` | Restricts script execution, prevents clickjacking, blocks malicious object embeddings. |
| **Strict-Transport-Security (HSTS)** | `max-age=63072000; includeSubDomains; preload` | Forces encrypted HTTPS communication for 2 years across all subdomains. |
| **X-Frame-Options** | `DENY` | Prevents framing and clickjacking attacks. |
| **X-Content-Type-Options** | `nosniff` | Blocks MIME-type sniffing by browsers. |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Protects referrer privacy when navigating externally. |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=(), browsing-topics=()` | Disables unnecessary device hardware access and ad-tracking APIs. |

---

## 3. Dependency Security & Audit Procedures

- All dependencies are tracked and locked via `package-lock.json`.
- The production package set has been audited and resolved to **0 known vulnerabilities**:
  ```bash
  npm audit
  # Output: found 0 vulnerabilities
  ```
- **Quarterly Dependency Review Procedure:**
  1. Run `npm outdated` to identify maintained versions.
  2. Run `npm audit` to check for new security advisories.
  3. Apply patches with `npm audit fix`.
  4. Run `npm run build && node scratch/verify_all.mjs` to ensure zero breaking changes.

---

## 4. Pre-Launch Security Verification Checklist

- [x] Strict Content Security Policy (CSP) tested and active.
- [x] Strict-Transport-Security (HSTS) with 2-year max-age active.
- [x] X-Frame-Options set to DENY.
- [x] X-Content-Type-Options set to nosniff.
- [x] Form rate limiting active on `/api/inquire` (5 per 10 mins).
- [x] Honeypot anti-spam trap verified.
- [x] Form input length and type validation enforced on server.
- [x] Zero API keys or private tokens committed to Git.
- [x] .env.example contains only non-sensitive placeholders.
- [x] Production build completes with zero vulnerabilities (`npm audit`).
- [x] Public contact form provides honest delivery states and server audit logging.
- [ ] Production SSL/TLS certificate installed at reverse proxy (Nginx / Cloudflare / Vercel).
- [ ] Production SMTP credentials supplied via hosting environment variables (SendGrid / Postmark / AWS SES).
