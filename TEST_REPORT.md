# Signs & Decal Corp. (S+D) — Quality Assurance & Verification Test Report

**Execution Timestamp:** 2026-10-22T14:47:51-04:00  
**Test Suite Target:** Production Build Server (`http://localhost:3001`)  
**Overall Result:** **33/33 ROUTES PASSED (100% SUCCESS)**  
**Security Vulnerabilities:** **0 Known Vulnerabilities (`npm audit`)**  

---

## 1. HTTP Security Headers Verification

Verified on production responses via automated test suite (`scratch/verify_all.mjs`):

| Header | Expected Value / Policy | Result |
| :--- | :--- | :--- |
| `Content-Security-Policy` | Restrictive script/style/img/font policy; `frame-ancestors 'none'` | **PASS (Configured & Verified)** |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | **PASS (Configured & Verified)** |
| `X-Content-Type-Options` | `nosniff` | **PASS (Configured & Verified)** |
| `X-Frame-Options` | `DENY` | **PASS (Configured & Verified)** |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | **PASS (Configured & Verified)** |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` | **PASS (Configured & Verified)** |

---

## 2. Route Verification Matrix

All routes were tested against the production server and inspected for status code, content size, non-duplicated `<title>`, page-specific `<meta name="description">`, `<link rel="canonical">`, and JSON-LD structured data.

| Route | HTTP Status | Content Size | Canonical URL | JSON-LD Type | Result |
| :--- | :---: | :---: | :--- | :--- | :---: |
| `/` | 200 OK | 225,098 B | `https://www.signsanddecal.com` | `LocalBusiness` / `GeneralContractor` | **PASS** |
| `/about` | 200 OK | 163,855 B | `https://www.signsanddecal.com/about` | `BreadcrumbList` | **PASS** |
| `/capabilities` | 200 OK | 144,981 B | `https://www.signsanddecal.com/capabilities` | `BreadcrumbList` | **PASS** |
| `/capabilities/architectural-signage` | 200 OK | 128,023 B | `.../capabilities/architectural-signage` | `Service` | **PASS** |
| `/capabilities/interior-signage` | 200 OK | 128,239 B | `.../capabilities/interior-signage` | `Service` | **PASS** |
| `/capabilities/exterior-signage` | 200 OK | 128,775 B | `.../capabilities/exterior-signage` | `Service` | **PASS** |
| `/capabilities/illuminated-signage` | 200 OK | 130,160 B | `.../capabilities/illuminated-signage` | `Service` | **PASS** |
| `/capabilities/vinyl-graphics` | 200 OK | 130,044 B | `.../capabilities/vinyl-graphics` | `Service` | **PASS** |
| `/capabilities/architectural-metal` | 200 OK | 130,095 B | `.../capabilities/architectural-metal` | `Service` | **PASS** |
| `/capabilities/architectural-glass` | 200 OK | 119,524 B | `.../capabilities/architectural-glass` | `Service` | **PASS** |
| `/capabilities/interior-partitions` | 200 OK | 119,358 B | `.../capabilities/interior-partitions` | `Service` | **PASS** |
| `/capabilities/fabrication-installation` | 200 OK | 130,230 B | `.../capabilities/fabrication-installation` | `Service` | **PASS** |
| `/projects` | 200 OK | 146,252 B | `https://www.signsanddecal.com/projects` | `BreadcrumbList` | **PASS** |
| `/projects/laguardia-west-parking-garage` | 200 OK | 133,940 B | `.../projects/laguardia-west-parking-garage` | `CreativeWork` | **PASS** |
| `/projects/oculus-world-trade-center-wayfinding` | 200 OK | 134,850 B | `.../projects/oculus-world-trade-center-wayfinding` | `CreativeWork` | **PASS** |
| `/projects/one-world-trade-center` | 200 OK | 129,470 B | `.../projects/one-world-trade-center` | `CreativeWork` | **PASS** |
| `/projects/george-washington-bridge-bus-station` | 200 OK | 128,963 B | `.../projects/george-washington-bridge-bus-station` | `CreativeWork` | **PASS** |
| `/projects/citi-field-mets-stadium` | 200 OK | 130,893 B | `.../projects/citi-field-mets-stadium` | `CreativeWork` | **PASS** |
| `/projects/cornell-nyc-tech-campus` | 200 OK | 129,386 B | `.../projects/cornell-nyc-tech-campus` | `CreativeWork` | **PASS** |
| `/projects/181st-street-station-escalator-railings` | 200 OK | 129,121 B | `.../projects/181st-street-station-escalator-railings` | `CreativeWork` | **PASS** |
| `/projects/120-broadway-equitable-building` | 200 OK | 128,036 B | `.../projects/120-broadway-equitable-building` | `CreativeWork` | **PASS** |
| `/projects/flood-gate-wall-queens-midtown-tunnel` | 200 OK | 128,333 B | `.../projects/flood-gate-wall-queens-midtown-tunnel` | `CreativeWork` | **PASS** |
| `/projects/newark-airport-terminal-a` | 200 OK | 129,361 B | `.../projects/newark-airport-terminal-a` | `CreativeWork` | **PASS** |
| `/industries` | 200 OK | 293,092 B | `https://www.signsanddecal.com/industries` | `BreadcrumbList` | **PASS** |
| `/quality-delivery` | 200 OK | 107,984 B | `https://www.signsanddecal.com/quality-delivery` | `BreadcrumbList` | **PASS** |
| `/careers` | 200 OK | 85,982 B | `https://www.signsanddecal.com/careers` | `BreadcrumbList` | **PASS** |
| `/contact` | 200 OK | 75,284 B | `https://www.signsanddecal.com/contact` | `BreadcrumbList` | **PASS** |
| `/privacy-policy` | 200 OK | 60,120 B | `https://www.signsanddecal.com/privacy-policy` | `BreadcrumbList` | **PASS** |
| `/terms-of-use` | 200 OK | 58,121 B | `https://www.signsanddecal.com/terms-of-use` | `BreadcrumbList` | **PASS** |
| `/accessibility` | 200 OK | 67,227 B | `https://www.signsanddecal.com/accessibility` | `BreadcrumbList` | **PASS** |
| `/sitemap.xml` | 200 OK | 5,609 B | XML Sitemap (35 canonical URLs) | XML standard | **PASS** |
| `/robots.txt` | 200 OK | 172 B | Directs to `/sitemap.xml` | Plain text | **PASS** |
| `/non-existent-page-testing-404` | 404 Not Found | 54,494 B | Custom branded 404 page | UI Landmarks | **PASS** |

---

## 3. Inquiry Form & Security API Verification (`/api/inquire`)

1. **Validation Error Test:** Submitted payload missing required name and scope fields.
   - *Result:* HTTP 400 Bad Request with message `"Please provide a valid contact name (2-80 characters)."`. **PASS**
2. **Honeypot Bot Trap Test:** Submitted payload with populated `_hp_company_fax` field.
   - *Result:* HTTP 200 with silent rejection (`{ success: true, delivered: true }`). **PASS**
3. **Valid Contractor Submission Test:** Submitted legitimate project inquiry from Skanska-Walsh JV.
   - *Result:* HTTP 200 OK. Reference ID: `SD-MVJW8NB2`. Logged to server audit log (`.inquiries_log/inquiries_audit.jsonl`). Honest status presented to submitter. **PASS**

---

## 4. Accessibility & Responsive Verification

- **Keyboard Focus:** Verified `:focus-visible` styling with amber-500 2px rings across all links and buttons.
- **Skip Link:** Verified `#main-content` skip link renders when tabbed.
- **Screen Reader Announcements:** Form states (`submitting`, `success`, `error`) announced via semantic `aria-live="polite"` container.
- **Reduced Motion:** Verified `@media (prefers-reduced-motion: reduce)` disables non-essential transitions.
- **Contrast Ratios:** Verified all body text meets or exceeds WCAG 2.2 AA 4.5:1 ratio against `#090c10` and `#13171f`.
