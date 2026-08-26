# Build, Structure & Deployment — IEEE BPDC Site

## Complete File Tree

```
ieee-bpdc/
│
├── brochure.html              # Brochure recreation (main landing page)
├── register.html              # Registration form
├── admin.html                 # Admin dashboard (password-protected)
│
├── css/
│   ├── tokens.css             # All CSS custom properties (ONLY :root block)
│   ├── base.css               # Reset, body, typography, nav styles
│   └── components.css         # Buttons, cards, inputs, stat tiles, table, nav
│
├── js/
│   ├── config.js              # Credentials and constants (fill before deploy)
│   ├── supabase.js            # Supabase REST API client module
│   ├── sheets.js              # Google Sheets Apps Script webhook caller
│   ├── analytics.js           # Page scan tracking (fires on brochure + register pages)
│   ├── form.js                # Registration form validation + submission
│   └── admin.js               # Admin auth, data loading, table rendering, CSV export
│
└── assets/
    ├── ieee-logo.svg          # IEEE diamond logo mark (white version)
    └── icons/
        ├── globe.svg          # Used in stats row and panel B2 heading
        ├── users.svg          # Stats row (members)
        ├── calendar.svg       # Stats row (founded)
        ├── award.svg          # Stats row (legacy)
        ├── book.svg           # Nav icon for brochure page
        ├── clipboard.svg      # Nav icon for register page
        ├── chart.svg          # Nav icon for admin page
        ├── instagram.svg      # Panel B3 contact
        ├── linkedin.svg       # Panel B3 contact
        ├── email.svg          # Panel B3 contact
        ├── location.svg       # Panel B3 contact
        └── website.svg        # Panel B3 contact
```

No `node_modules`. No `package.json`. No build output folder. The repo root IS the deployable artifact.

---

## HTML File Shell

Every HTML file follows this exact structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#060E1E">
  <title>PAGE TITLE HERE</title>
  <meta name="description" content="PAGE DESCRIPTION HERE">
  <!-- admin.html only: <meta name="robots" content="noindex, nofollow"> -->

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
</head>
<body data-page="PAGE_NAME_HERE">

  <!-- PAGE CONTENT -->

  <!-- Scripts (always at end of body) -->
  <script src="js/config.js"></script>
  <script src="js/supabase.js"></script>
  <!-- page-specific scripts: -->
  <!-- brochure.html: analytics.js -->
  <!-- register.html: analytics.js, sheets.js, form.js -->
  <!-- admin.html: admin.js -->
</body>
</html>
```

`data-page` values:
- `brochure.html` → `data-page="brochure"`
- `register.html` → `data-page="registration"`
- `admin.html` → `data-page="admin"`

---

## Script Load Order Per Page

### `brochure.html`
```html
<script src="js/config.js"></script>
<script src="js/supabase.js"></script>
<script src="js/analytics.js"></script>
```

### `register.html`
```html
<script src="js/config.js"></script>
<script src="js/supabase.js"></script>
<script src="js/sheets.js"></script>
<script src="js/analytics.js"></script>
<script src="js/form.js"></script>
```

### `admin.html`
```html
<script src="js/config.js"></script>
<script src="js/supabase.js"></script>
<script src="js/admin.js"></script>
```

**Rule:** `config.js` always loads first. `supabase.js` always loads second. Page-specific scripts always load last.

---

## SVG Icons

All icons in `assets/icons/` should be simple single-path or minimal SVGs:
- Viewbox: `0 0 24 24`
- No hardcoded fill colors — icons should inherit `currentColor` so CSS `color` controls them
- Stroke-based style preferred (stroke-width: 1.5, stroke: currentColor, fill: none) — matches the brochure's line-art aesthetic

When embedding inline in HTML for decorative elements (dot grid, sparkles, circuit pattern, city skyline), use `aria-hidden="true"`.

When used as meaningful icons next to text (contact list, stats row), add `role="img"` and `aria-label="..."`.

---

## CSS Architecture Rules

### `css/tokens.css`
- Contains ONLY the `:root { }` block
- No selectors other than `:root`
- Directly mirrors the token definitions in `DESIGN_SYSTEM.md`
- If a new color or spacing value is needed, add it here first, then reference via `var()`

### `css/base.css`
Contents (in order):
1. `@media (prefers-reduced-motion: reduce)` block — disable all transitions/animations
2. CSS reset (`*, *::before, *::after`)
3. `body` styles
4. Base typographic rules (`h1`-`h3`, `p`, `a`, `ul`)
5. `.nav-top` styles (desktop sticky nav)
6. `.nav-bottom` styles (mobile fixed nav)
7. Responsive `body` padding adjustments for nav

### `css/components.css`
Contents (in order):
1. `.btn-primary` and states
2. `.btn-secondary` and states
3. `.btn-full`, `.btn-sm` modifier classes
4. `.spinner` (loading animation)
5. `.form-group`, `.form-label`, `.form-error`, `.required-star`
6. `input`, `textarea` base styles + focus + error states
7. `.card` base (the glass card)
8. `.stat-tile` and child elements
9. `.data-table`, `th`, `td`, `.table-empty`
10. `.panel` base class (for brochure panels)
11. `.benefit-pill`, `.event-card`, `.chapter-card` (brochure-specific components)
12. `.contact-list`, `.contact-item`
13. `.success-state`, `.success-icon`
14. `.error-banner`
15. `.flip-divider`
16. `.admin-nav`, `.admin-label`
17. `.login-card`, `.admin-login-screen`

---

## Navigation HTML (shared across pages)

### Mobile Bottom Nav (include in all three pages)

```html
<nav class="nav-bottom" aria-label="Main navigation">
  <a href="brochure.html" class="nav-item" data-page="brochure">
    <svg class="nav-icon" aria-hidden="true"><!-- book icon --></svg>
    <span class="nav-label">Brochure</span>
  </a>
  <a href="register.html" class="nav-item" data-page="register">
    <svg class="nav-icon" aria-hidden="true"><!-- clipboard icon --></svg>
    <span class="nav-label">Register</span>
  </a>
  <a href="admin.html" class="nav-item" data-page="admin">
    <svg class="nav-icon" aria-hidden="true"><!-- chart icon --></svg>
    <span class="nav-label">Admin</span>
  </a>
</nav>
```

**Active state logic** — add to `js/config.js` or inline in a small `<script>`:
```javascript
// Highlight the current page's nav item
document.querySelectorAll('.nav-item').forEach(item => {
  if (item.dataset.page === document.body.dataset.page.replace('registration', 'register')) {
    item.classList.add('active');
  }
});
```

```css
.nav-item.active { color: var(--color-cyan-400); }
.nav-item.active .nav-icon { color: var(--color-cyan-400); }
```

### Desktop Top Nav (include in `brochure.html` and `register.html` only)

```html
<header class="nav-top" aria-label="Site navigation">
  <a href="brochure.html" class="nav-logo">
    <!-- ieee-logo.svg inline, 28px -->
    <span>IEEE BPDC</span>
  </a>
  <nav class="nav-links">
    <a href="brochure.html" class="nav-link">Brochure</a>
    <a href="register.html" class="nav-link nav-link-primary">Register</a>
    <a href="admin.html" class="nav-link nav-link-muted">Admin →</a>
  </nav>
</header>
```

---

## Pre-Deployment Checklist

Run through this list before the orientation event:

### Configuration
- [ ] `CONFIG.SUPABASE_URL` filled in
- [ ] `CONFIG.SUPABASE_ANON_KEY` filled in
- [ ] `CONFIG.SUPABASE_SERVICE_KEY` filled in
- [ ] `CONFIG.APPS_SCRIPT_URL` filled in (test the doGet endpoint first)
- [ ] `CONFIG.ADMIN_PASSWORD` set to the chosen password

### Supabase
- [ ] `page_scans` table created with correct schema
- [ ] `registrations` table created with correct schema
- [ ] RLS enabled on both tables
- [ ] INSERT policy for `anon` on `page_scans`
- [ ] INSERT policy for `anon` on `registrations`
- [ ] Test INSERT via Supabase table editor
- [ ] Test SELECT via service key

### Google Sheets
- [ ] Sheet created with "Registrations" tab
- [ ] Headers in row 1: Timestamp, Full Name, BITS ID, Email, Phone (Call), Phone (WhatsApp)
- [ ] Apps Script deployed as Web App (Execute as Me, Access: Anyone)
- [ ] `doGet` endpoint returns "IEEE BPDC Registration Mirror — OK"
- [ ] Manual `doPost` test (via Postman or curl) appends a row

### Frontend
- [ ] All three HTML pages open and render correctly
- [ ] Bottom nav visible on mobile (375px width in browser DevTools)
- [ ] Top nav visible on desktop (≥768px)
- [ ] Active nav item highlights correctly on each page
- [ ] Brochure scroll-in animations work (and don't fire if `prefers-reduced-motion` is on)
- [ ] All brochure panel text matches `BROCHURE_CONTENT.md` exactly
- [ ] Registration form validates all five fields
- [ ] Registration form shows error states correctly
- [ ] Registration form submits successfully (check Supabase + Sheets)
- [ ] Registration success state shows with the correct name
- [ ] Admin login rejects wrong passwords
- [ ] Admin login accepts the correct password
- [ ] Admin stats row shows correct counts
- [ ] Admin table renders all registrations
- [ ] Admin CSV export downloads correct data
- [ ] Admin logout returns to login screen

### QR Codes
- [ ] QR Code A generated pointing to brochure page URL
- [ ] QR Code B generated pointing to register page URL
- [ ] Both QR codes scanned from a phone and pages load correctly

---

## Deployment Options

### Option A: Vercel (Recommended)
1. Push the repo to GitHub
2. Import into Vercel
3. No build configuration needed (static site)
4. Add rewrites in `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/", "destination": "/brochure.html" },
    { "source": "/register", "destination": "/register.html" },
    { "source": "/admin", "destination": "/admin.html" }
  ]
}
```

### Option B: Netlify
1. Push to GitHub, import to Netlify
2. Add `netlify.toml`:
```toml
[[redirects]]
  from = "/"
  to = "/brochure.html"
  status = 200

[[redirects]]
  from = "/register"
  to = "/register.html"
  status = 200

[[redirects]]
  from = "/admin"
  to = "/admin.html"
  status = 200
```

### Option C: GitHub Pages
- No rewrites available. QR codes must point to `/brochure.html` and `/register.html` directly.
- Enable GitHub Pages in repo settings → source: root of `main` branch.

---

## Development Workflow (No Build Step)

Open the files directly in a browser, or use VS Code's Live Server extension (right-click any HTML file → "Open with Live Server").

To test cross-page navigation locally without a server, use Live Server — direct `file://` URLs will cause navigation link issues on some browsers.

No compilation, no transpilation, no minification required. Ship source files directly.
