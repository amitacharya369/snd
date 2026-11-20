# Signs & Decal Corp. (S+D) — Enterprise Web Platform

Official enterprise corporate website for **Signs & Decal Corp. (S+D)**, an established architectural signage, metal, glass, fabrication, and installation contractor based in Brooklyn, New York since 1971.

---

## 1. Quick Overview

- **Legal Entity:** Signs & Decal Corp. (*Signs+Decal*, *S+D*)
- **Founded:** 1971 in New York City (50+ years of continuous fabrication)
- **Headquarters & Manufacturing Facility:** 410 Morgan Avenue, Brooklyn, NY 11211
- **Phone:** (718) 486-6400
- **Sales & Estimating Email:** `salesteam@signsanddecal.com`
- **Affiliated Manufacturing Arm:** SD Works / SD Industries LLC (Saddle Brook, NJ & Conroe, TX)
- **Verified Credentials:**
  - Certified MBE — NYC Department of Small Business Services (SBS)
  - Certified MBE — New York City School Construction Authority (NYC SCA)
  - Certified MBE / DBE / ACDBE / SBE — Port Authority of New York & New Jersey (PANYNJ)
  - AISC Member & Certified Building Fabricator (via SD Industries/Works)
  - American Welding Society (AWS) Member
  - Federal CAGE Code: 15HU7

---

## 2. Technology Stack & Architectural Decisions

- **Framework:** Next.js 16+ (App Router) with TypeScript & React 19
- **Build Mode:** Static Site Generation (SSG) for all 33 indexable pages + Server Route Handler for `/api/inquire`
- **Styling:** Tailwind CSS v4 with custom architectural tokens, hairline grid rules, and high contrast palette
- **Icons:** Lucide React (accessible, tree-shaken SVGs)
- **Image Optimization:** `next/image` generating AVIF and WebP with strict layout shifts prevention
- **Security & Headers:** Strict Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, and Permissions-Policy.
- **Auditing & Form Handling:** Multi-tier rate limiting, honeypot spam protection, input sanitization, and honest delivery logging (`.inquiries_log/inquiries_audit.jsonl`).

---

## 3. Getting Started & Local Development

### Prerequisites
- Node.js 20.x or 22.x (verified on Node v22.22.0)
- npm 10.x or later

### Installation
```bash
# Clone or navigate to the repository
cd SND

# Install pinned dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### Running Locally
```bash
# Development mode with hot-reloading
npm run dev

# Or specify a custom port
npm run dev -- -p 3001
```
Open [http://localhost:3000](http://localhost:3000) (or 3001) in your browser.

---

## 4. Production Build & Deployment

```bash
# Run production type-checking and static pre-rendering
npm run build

# Start the optimized production server
npm run start -- -p 3001
```

The build compiles 35 static routes, generates dynamic `sitemap.xml` and `robots.txt`, and configures all security headers automatically.

---

## 5. Automated Verification & Testing

To execute the automated end-to-end verification suite across all 33 public routes, security headers, and the `/api/inquire` form endpoint:

```bash
node scratch/verify_all.mjs
```

All 33 routes are verified for:
1. HTTP 200 OK (and 404 for non-existent routes)
2. Presence of security headers (`CSP`, `HSTS`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`)
3. Unique `<title>` tags without duplication
4. Page-specific `<meta name="description">`
5. Canonical `<link rel="canonical" href="...">` matching production URL
6. Valid JSON-LD structured data (`LocalBusiness`, `Service`, `CreativeWork`, `BreadcrumbList`)
7. Form input rejection on invalid submissions and honeypot bot trap verification.

---

## 6. Directory Structure

```
SND/
├── .env.example              # Environment variables template (placeholders only)
├── .gitignore                # Comprehensive git exclusions
├── next.config.ts            # Next.js configuration with security headers
├── package.json              # Pinned, zero-vulnerability dependencies
├── postcss.config.mjs        # Tailwind CSS PostCSS configuration
├── tsconfig.json             # TypeScript compiler settings
├── public/
│   └── images/
│       ├── brand/            # Official vector SVG logos & favicons
│       ├── clients/          # Client and contractor marks (MLJ, MBTA, Suffolk)
│       ├── projects/         # High-resolution verified project photography
│       └── team/             # Verified leadership portraits
└── src/
    ├── app/                  # Next.js App Router pages
    │   ├── api/inquire/      # Secure POST route handler with audit logging
    │   ├── about/            # History (1971), 50-year timeline, leadership, MBE
    │   ├── accessibility/    # WCAG 2.2 AA accessibility statement & reporting
    │   ├── capabilities/     # 9 specialized trade discipline pages
    │   │   └── [slug]/       # Dynamic technical discipline pages
    │   ├── careers/          # Apprenticeships, shop trades & privacy notice
    │   ├── contact/          # Project inquiry form, maps, bidding checklist
    │   ├── industries/       # Transit, Aviation, High-Rise, Institutional, Civil
    │   ├── privacy-policy/   # Privacy policy & data handling disclosures
    │   ├── projects/         # Filterable portfolio & 10 landmark case studies
    │   │   └── [slug]/       # Dynamic case study detail pages
    │   ├── quality-delivery/ # 5-stage QA/QC and union field installation protocol
    │   ├── terms-of-use/     # Commercial terms and governing law (New York)
    │   ├── globals.css       # Tailwind v4 styles, architectural grid rules
    │   ├── layout.tsx        # Global layout, metadataBase, Organization JSON-LD
    │   ├── not-found.tsx     # Custom 404 page
    │   ├── page.tsx          # Homepage
    │   ├── robots.ts         # Dynamic robots.txt
    │   └── sitemap.ts        # Dynamic sitemap.xml
    ├── components/           # Reusable typed UI components
    │   ├── Breadcrumbs.tsx   # Semantic breadcrumbs with JSON-LD schema
    │   ├── ContactCta.tsx    # Reusable industrial architectural CTA band
    │   ├── Footer.tsx        # Complete footer with certified credentials & links
    │   ├── Header.tsx        # Accessible header with mega dropdowns & mobile drawer
    │   ├── Icons.tsx         # Lucide icon mapper
    │   ├── ProjectCard.tsx   # Reusable project portfolio card
    │   └── SkipLink.tsx      # Accessibility skip to content link
    ├── data/                 # Centralized typed source of truth
    │   ├── capabilities.ts   # 9 core fabrication disciplines
    │   ├── company.ts        # Corporate facts, milestones, certifications
    │   ├── industries.ts     # 6 industry sectors
    │   ├── leadership.ts     # Executive and management team data
    │   ├── navigation.ts     # Menu structure, mega-menu links, footer links
    │   └── projects.ts       # 10 verified landmark projects with specs
    └── types/
        └── index.ts          # Central TypeScript interfaces
```

---

## 7. Additional Documentation Guides

- [MAINTENANCE.md](file:///C:/Users/Production/Documents/SND/MAINTENANCE.md) — How to add new projects, capabilities, team members, and metadata.
- [SECURITY.md](file:///C:/Users/Production/Documents/SND/SECURITY.md) — Cybersecurity measures, HTTP headers, dependency updates, and audit logging.
- [DEPLOYMENT.md](file:///C:/Users/Production/Documents/SND/DEPLOYMENT.md) — Production hosting, environment configuration, reverse proxy setup, and rollback instructions.
- [TEST_REPORT.md](file:///C:/Users/Production/Documents/SND/TEST_REPORT.md) — Full automated test suite results and verification logs.
