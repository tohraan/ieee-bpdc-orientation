# Sitemap & Navigation — IEEE BPDC Site

## URL Structure

```
/
├── index.html          → redirects to brochure.html (or IS brochure.html)
├── brochure.html       → The brochure page (Page 1 content)
├── register.html       → Registration form
└── admin.html          → Admin dashboard (password-protected)
```

All three pages are siblings in the root directory. No subdirectories for HTML files.

### URL Aliases

If deployed on Vercel or Netlify, configure rewrites:
- `/` → `/brochure.html`
- `/register` → `/register.html`
- `/admin` → `/admin.html`

If on GitHub Pages (no rewrites), the direct `.html` URLs are used. The QR codes should point to the `.html` URLs in that case.

---

## Page Inventory

### 1. Brochure Page (`brochure.html`)

**Purpose:** Recreate the IEEE BPDC print brochure as a scrollable web experience. This is the primary landing page — the first thing users see after scanning the orientation QR code.

**Sections (in scroll order):**
1. Site nav (sticky top on desktop, fixed bottom on mobile)
2. Brochure hero bar — "IEEE BPDC Student Chapter" wordmark + tagline
3. Panel A1 — About Us (left panel, front side)
4. Panel A2 — Why Join IEEE? (center panel, front side)
5. Panel A3 — Our Vision & Mission (right panel, front side)
6. Divider — "FLIP SIDE" visual separator
7. Panel B1 — Membership Benefits (left panel, back side)
8. Panel B2 — What We Organized 2025-26 (center panel, back side)
9. Panel B3 — Contact & Chapter Identity (right panel, back side)
10. CTA bar — "Ready to join?" → links to register page

**Does not include:** Admin, form, any user-specific state.

---

### 2. Registration Page (`register.html`)

**Purpose:** Capture interest from students who want to join IEEE BPDC. Simple, single-step form.

**Sections:**
1. Nav (same as brochure page)
2. Form hero — brief heading and subtext ("Join IEEE BPDC · Orientation 2025-26")
3. The form itself
4. Submit button
5. Success state (replaces form after submission)

**Form fields** (in order):
1. Full Name (required)
2. BITS ID (required, hint: "e.g. 2023A7PS0001U")
3. Email ID (required, type="email")
4. Phone — Calling Number (required, type="tel", label: "Phone (for calls)")
5. Phone — WhatsApp Number (optional, type="tel", label: "WhatsApp number", helper: "Leave blank if same as calling number")

**Does not include:** Admin, brochure content.

---

### 3. Admin Dashboard (`admin.html`)

**Purpose:** Internal tool for the organizing committee. Password-protected. Shows scan analytics and registration data.

**States:**
1. **Login state** — password input form, centered, branded
2. **Dashboard state** — shown after correct password

**Dashboard sections:**
1. Nav (simplified — just the IEEE BPDC wordmark + "Admin" label + logout button)
2. Stats row — three tiles (Brochure Scans, Registration Page Scans, Total Registrations)
3. Registrations table — full list of submissions
4. Export button — downloads registrations as CSV

**Does not include:** Brochure content, registration form.

---

## Navigation Structure

### Mobile Navigation (bottom bar, fixed, shown on all pages)

Three items, each with an SVG icon and text label:

| Icon | Label | Links To | Active On |
|------|-------|----------|-----------|
| Book/document SVG | Brochure | `brochure.html` | `brochure.html` |
| Form/clipboard SVG | Register | `register.html` | `register.html` |
| Chart/bar SVG | Admin | `admin.html` | `admin.html` |

Active item: `color: var(--color-cyan-400)`, icon fill changes to cyan.

The bottom nav takes 60px of space — add `padding-bottom: 60px` to the page body on mobile.

### Desktop Navigation (top sticky bar, shown on all pages except admin)

```
[IEEE BPDC logo/wordmark]          [Brochure]  [Register]  [Admin →]
```

- Left: IEEE logo SVG (small, 32px) + "IEEE BPDC" text in Inter 600
- Right: three nav links. "Register" is styled as the primary button (filled cyan). "Brochure" and "Admin →" are plain text links.
- Admin dashboard has a simplified nav: just the wordmark + "Admin Dashboard" label + a "Logout" ghost button.

### Cross-Page Links

- Every page links to every other page via the nav.
- The brochure page has a prominent CTA at the bottom: "Ready to join? Register now →" linking to `register.html`.
- The registration success state has a link back to the brochure page.
- The admin nav logout button clears the password session (clears `sessionStorage`) and refreshes to show the login screen.

---

## Assets Folder Structure

```
assets/
├── ieee-logo.svg              # IEEE diamond logo mark (white version)
├── brochure-side-1.png        # Screenshot reference — front side of trifold
├── brochure-side-2.png        # Screenshot reference — back side of trifold
└── icons/
    ├── globe.svg
    ├── users.svg
    ├── calendar.svg
    ├── award.svg
    ├── book.svg
    ├── chart.svg
    ├── form.svg
    └── instagram.svg
    └── linkedin.svg
    └── email.svg
    └── location.svg
    └── website.svg
```

The IEEE diamond logo (◆ with globe inside) can be approximated as an SVG if the actual asset is not available. The brochure screenshots are for developer reference only — not displayed on the site.

---

## Page Metadata

Each page must have complete `<head>` metadata:

```html
<!-- brochure.html -->
<title>IEEE BPDC Student Chapter</title>
<meta name="description" content="Advancing Technology for Humanity — BITS Pilani Dubai Campus. Join one of the most active IEEE student chapters on campus.">

<!-- register.html -->
<title>Join IEEE BPDC</title>
<meta name="description" content="Register your interest in joining IEEE BPDC Student Chapter. Open to all disciplines at BITS Pilani Dubai.">

<!-- admin.html -->
<title>IEEE BPDC Admin</title>
<meta name="robots" content="noindex, nofollow">
```

All pages:
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#060E1E">
```
