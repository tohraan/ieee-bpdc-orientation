# IEEE BPDC Orientation Site — Master Project Brief

## What This Project Is

A recruitment microsite for the **IEEE BPDC Student Chapter** (BITS Pilani Dubai Campus), deployed for their annual orientation. Students arrive at the orientation, scan a QR code, read about the chapter on the brochure page, and register their interest. The committee then accesses an admin dashboard to view registrations and track engagement.

## Read These Documents In Order Before Writing Any Code

1. `CLAUDE.md` ← you are here (project overview and rules)
2. `DESIGN_SYSTEM.md` — color tokens, typography, spacing scale, component rules
3. `SITEMAP.md` — page list, URL structure, navigation
4. `FRONTEND.md` — detailed per-page spec (layout, sections, interactions)
5. `BROCHURE_CONTENT.md` — every piece of text and panel content from the brochure, verbatim
6. `BACKEND.md` — Supabase schema, Google Sheets webhook, API patterns
7. `ADMIN.md` — admin portal spec
8. `BUILD.md` — file structure, tooling, deployment, env vars

## Project Stack

- **Frontend**: Vanilla HTML + CSS + JavaScript. No framework, no build step. Three separate HTML files.
- **Backend**: Supabase (Postgres) as primary data store. Google Apps Script webhook as spreadsheet mirror.
- **Hosting**: Static hosting — Vercel, Netlify, or GitHub Pages. All three HTML files are self-contained.
- **Fonts**: Google Fonts only (Bebas Neue, Inter, JetBrains Mono)

## The Three Pages

| URL | File | Purpose |
|-----|------|---------|
| `/` or `/brochure` | `brochure.html` | Pixel-faithful recreation of the IEEE BPDC print brochure |
| `/register` | `register.html` | Registration form (Name, BITS ID, Email, Calling #, WhatsApp #) |
| `/admin` | `admin.html` | Password-protected dashboard for the organizing committee |

## Absolute Rules — Do Not Break These

1. **No frameworks.** No React, Vue, Svelte, Tailwind, Bootstrap. Pure HTML/CSS/JS only.
2. **No npm, no build step.** The project must work by opening HTML files directly. CDN scripts are allowed only from `cdnjs.cloudflare.com` or `fonts.googleapis.com`.
3. **Mobile-first.** Every layout must work cleanly at 375px wide before desktop breakpoints are added.
4. **Dark-only design.** The site matches the brochure's dark navy world. Set explicit backgrounds everywhere — do not rely on browser defaults.
5. **Supabase is the source of truth.** Google Sheets is a mirror/backup. If Supabase fails, log the error but still attempt the Sheets submission.
6. **Never expose admin data on public pages.** The `admin.html` page must check for the password before rendering any data.
7. **All color and spacing decisions come from the design system tokens in `DESIGN_SYSTEM.md`.** Do not hardcode color hex values in component CSS — always reference a CSS custom property.
8. **Recreate the brochure in HTML/CSS.** Do not embed the PDF. Do not use an `<iframe>`. The brochure is rebuilt panel-by-panel as HTML sections.

## Key Contacts / Credentials (Fill In Before Build)

```
SUPABASE_URL=           # e.g. https://xyzxyz.supabase.co
SUPABASE_ANON_KEY=      # starts with eyJ...
APPS_SCRIPT_URL=        # deployed Google Apps Script web app URL
ADMIN_PASSWORD=         # e.g. ieee_bpdc_2026
```

These are injected into the HTML files as JavaScript constants at the top of each `<script>` block. They are not secret (client-side code is visible), but should be rotated after the orientation event.

## QR Code Strategy

Two QR codes are printed/displayed at the orientation:
- **QR A** → points to `https://your-domain.com/` (the brochure page)
- **QR B** → points to `https://your-domain.com/register`

Each page fires a scan-tracking event on load, so the admin dashboard can show separate counters per QR code.

## Visual Reference

The brochure is a standard trifold (two sides, three panels each). Screenshots of both sides are in `assets/brochure-side-1.png` and `assets/brochure-side-2.png`. All content text is documented verbatim in `BROCHURE_CONTENT.md`. When in doubt about what a section should say, read `BROCHURE_CONTENT.md` — do not invent text.
