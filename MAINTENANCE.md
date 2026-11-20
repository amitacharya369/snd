# Signs & Decal Corp. (S+D) — Content Maintenance Guide

This document describes how an authorized developer or content editor can maintain, expand, and update the website content without manually editing JSX code across multiple pages.

---

## 1. Centralized Data Architecture

All content is managed through typed TypeScript data modules in the `src/data/` directory:

| Data File | Content Managed |
| :--- | :--- |
| `src/data/projects.ts` | All project case studies, scopes, materials, images, stats |
| `src/data/capabilities.ts` | The 9 core fabrication disciplines, deliverables, specs |
| `src/data/industries.ts` | Market sectors, client relationships, compliance standards |
| `src/data/company.ts` | Address, phone, emails, certifications, 50-year history timeline |
| `src/data/leadership.ts` | Executive and technical leadership bios, roles, portraits |
| `src/data/navigation.ts` | Header menu, dropdowns, footer links, and call-to-actions |

---

## 2. How to Add a New Project Case Study

To add a new project to the portfolio:

1. Place the project image (PNG, JPG, or WebP) in `public/images/projects/your-project-slug.jpg`.
2. Open `src/data/projects.ts`.
3. Add a new object conforming to the `Project` interface:

```typescript
{
  slug: 'new-transit-hub-terminal',
  title: 'Grand Central Madison — Concourse Architectural Wayfinding',
  shortTitle: 'Grand Central Madison',
  subtitle: 'Subterranean Transit Directional & Illuminated Wayfinding Network',
  client: 'MTA Capital Construction / LIRR',
  contractorOrPartner: 'Tutor Perini / Frontier-Kemper Joint Venture',
  location: 'Midtown Manhattan, New York',
  completionYear: '2023',
  industries: ['transportation', 'infrastructure'],
  capabilities: ['architectural-signage', 'illuminated-signage', 'architectural-metal', 'fabrication-installation'],
  featuredImage: '/images/projects/your-project-slug.jpg',
  summary: 'Turnkey fabrication and union installation of deep-cavern illuminated directional signs and stainless steel blade markers.',
  verifiedScope: [
    'Fabrication of custom 316 stainless steel overhead wayfinding sign assemblies',
    'High-efficiency LED edge-lit directional panels with quick-service ballast trays',
    'Concealed vibration-damping acoustic ceiling attachments',
  ],
  specifications: {
    materials: ['Type 316 Stainless Steel', 'Optical Cast Acrylic', 'Low-Smoke Zero-Halogen Wiring'],
    finishes: ['#4 Satin Brushed Finish', 'Anti-Graffiti Clear Fluoropolymer'],
    disciplines: ['3D BIM Coordination', 'Seismic Anchor Calculations', 'Night Track Curfew Rigging'],
  },
  overviewText: [
    'Grand Central Madison represents the largest expansion of Long Island Rail Road service in over a century...',
  ],
  challengeAndSolution: {
    challenge: 'Installing overhead suspended fixtures in cavernous concourses 140 feet below street level.',
    solution: 'Engineered lightweight modular aluminum internal sub-frames hoisted via custom mobile gantries.',
  },
  highlightStat: {
    value: '140 ft',
    label: 'Subterranean Depth Navigated',
  },
}
```

4. Run `npm run build`.
   - The new project is automatically generated at `/projects/new-transit-hub-terminal`.
   - It automatically appears in the `/projects` searchable and filterable grid.
   - It is automatically added to `sitemap.xml` with canonical tagging and JSON-LD schema!

---

## 3. How to Update or Add a Capability

1. Open `src/data/capabilities.ts`.
2. Edit or append an entry conforming to the `Capability` interface:
   - Provide `id`, `slug`, `title`, `shortTitle`, `heroHeadline`, `overview`, `deliverables`, `keyCapabilities`, `materialsAndFinishes`, and `engineeringSpecs`.
3. Link relevant project slugs in `relatedProjects: ['laguardia-west-parking-garage', ...]`.
4. Run `npm run build`. Next.js pre-renders the updated capability page, updates the navigation dropdown, and registers it in `sitemap.xml`.

---

## 4. How to Update Company Information & Certifications

1. Open `src/data/company.ts`.
2. Update corporate addresses, telephone numbers, emails, or active certifications.
3. Every page (header, footer, pre-header, contact page, layout schema) automatically reflects the change without manual edits.

---

## 5. Adding Images Safely

- Store all high-resolution brand and project imagery in `public/images/`.
- Ensure files have descriptive basenames (e.g. `120broadway.jpg` instead of `IMG_0855.jpg`).
- Optimize images prior to committing (WebP or compressed JPEG/PNG under 1 MB). Next.js automatically creates AVIF/WebP variants at runtime.
