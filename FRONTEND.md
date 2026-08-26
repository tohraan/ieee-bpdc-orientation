# Frontend Specification — IEEE BPDC Site

Read `DESIGN_SYSTEM.md` and `BROCHURE_CONTENT.md` before implementing anything in this document.

---

## File Structure

```
/
├── brochure.html
├── register.html
├── admin.html
├── css/
│   ├── tokens.css        # All CSS custom properties from DESIGN_SYSTEM.md
│   ├── base.css          # Reset, body, typography base, nav
│   └── components.css    # Buttons, cards, inputs, stat tiles, table
├── js/
│   ├── config.js         # Credentials constants (filled in before build)
│   ├── analytics.js      # Page scan tracking
│   ├── supabase.js       # Supabase client + CRUD helpers
│   ├── sheets.js         # Google Sheets Apps Script webhook
│   ├── form.js           # Registration form logic
│   └── admin.js          # Dashboard data loading + rendering
└── assets/
    ├── ieee-logo.svg
    └── icons/ (see SITEMAP.md)
```

Each HTML file links:
```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
```

And loads scripts at bottom of `<body>`:
```html
<script src="js/config.js"></script>
<script src="js/supabase.js"></script>
<!-- page-specific scripts last -->
```

---

## `css/tokens.css`

Contains **only** the `:root { }` block from `DESIGN_SYSTEM.md`. No selectors other than `:root`. This is the single source of all tokens.

---

## `css/base.css`

### Reset
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
img, svg { display: block; max-width: 100%; }
button { cursor: pointer; font: inherit; }
a { color: inherit; text-decoration: none; }
```

### Body
```css
body {
  background: var(--color-navy-900);
  color: var(--color-text-primary);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: var(--type-body-lg);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  padding-bottom: 60px; /* bottom nav height on mobile */
}
@media (min-width: 768px) {
  body { padding-bottom: 0; padding-top: 64px; /* top nav height */ }
}
```

### Typography base
```css
h1, h2, h3 { font-family: 'Bebas Neue', sans-serif; font-weight: 400; text-wrap: balance; line-height: 1.02; }
p { max-width: 65ch; }
```

---

## Page 1: `brochure.html`

### Overall Layout

On **mobile** (< 768px): All six panels stack vertically, full-width, in the order A1 → A2 → A3 → B1 → B2 → B3.

On **desktop** (≥ 768px): Two rows of three columns (CSS Grid, `grid-template-columns: 1fr 1fr 1fr`):
- Row 1: Panel A1, A2, A3 side by side (mimics the front trifold)
- Divider row: "FLIP SIDE" separator
- Row 2: Panel B1, B2, B3 side by side (mimics the back trifold)

Each panel has a minimum height of `640px` on desktop and fills its grid cell completely.

### Scroll-in animation

Use `IntersectionObserver` with threshold `0.15`. As each panel enters the viewport, add a class `is-visible` that transitions `opacity: 0 → 1` and `transform: translateY(20px) → translateY(0)`, duration 400ms ease-out. Stagger children within a panel by 80ms.

---

### Section: Brochure Hero Bar

Sits above all panels. Thin horizontal bar, full width.

```
Background: var(--color-navy-800)
Border-bottom: 1px solid var(--color-border)
Height: 56px (mobile), 64px (desktop)
Display: flex, align-items: center, justify-content: center, gap: var(--space-3)
```

Contents:
- IEEE diamond logo SVG (24px, white)
- Text: "IEEE BPDC STUDENT CHAPTER" — Inter 600, `--type-body-sm`, `letter-spacing: 0.12em`, uppercase, `--color-text-secondary`
- Separator dot (·)
- Text: "Orientation 2025–26" — Inter 400, `--type-body-sm`, `--color-text-muted`

---

### Panel A1 — About Us

**CSS background:** White/near-white base. This is the only panel with a light background.

```css
.panel-a1 {
  background: linear-gradient(170deg, #FFFFFF 0%, #E8F4FD 60%, #C5E0F5 100%);
  color: #0A1628; /* dark text on light background */
  position: relative;
  overflow: hidden;
}
```

**Structure (top to bottom):**

1. **IEEE Logo block** — centered horizontally
   - IEEE diamond SVG logo, 80px wide, `color: #0A1628` (dark version)
   - Below: "IEEE" in Bebas Neue, `font-size: 2.5rem`, `color: #0A1628`
   - Below: "Advancing Technology for Humanity" in Inter 400 italic, `--type-body-md`, `color: #1A3A6E`

2. **"ABOUT US" badge** — centered
   - `background: #0A1628`, `color: white`, `border-radius: var(--radius-pill)`
   - `padding: var(--space-2) var(--space-5)`
   - `font: Inter 700, --type-label-sm, letter-spacing: 0.1em`, uppercase

3. **Body paragraph 1** — `color: #0A1628`, Inter 400
   - Wrap "1884", "460000", "190+ countries" in `<span class="text-accent">` → `color: #1A3A6E; font-weight: 700`

4. **Body paragraph 2** — same styling
   - Wrap "140+ years" in `<span class="text-accent">`

5. **Icon block** — small globe-people SVG icon (24px) + paragraph text, displayed as flex row

6. **Divider line** (1px, `rgba(10,22,40,0.15)`)

7. **Stats row** — 4 items in a flex row
   - Each: icon SVG (28px) + number in Bebas Neue + label in Inter 600 uppercase
   - `color: #0A1628` for the number, `color: #1A3A6E` for the label

8. **Decorative dot-grid** — positioned top-right, `position: absolute`, `z-index: 0`. All content above it at `z-index: 1`.

9. **City skyline SVG** — positioned absolutely at bottom of panel, `opacity: 0.2`, `fill: #1A3A6E`

---

### Panel A2 — Why Join IEEE?

```css
.panel-a2 {
  background: var(--color-navy-700);
  position: relative;
  overflow: hidden;
}
/* Optional: faint student photo texture as CSS background-blend or pseudo-element at 8% opacity */
```

**Structure (top to bottom):**

1. **"WHY JOIN IEEE?"** — Bebas Neue, `--type-display-xl`, `--color-text-primary`

2. **Body paragraph** — Inter 400, `--type-body-lg`, `--color-text-primary`

3. **Highlight card** (the member benefits list)
   ```css
   .benefit-card {
     background: rgba(255,255,255,0.07);
     border: 1px solid var(--color-cyan-border);
     border-radius: var(--radius-lg);
     padding: var(--space-6);
   }
   ```
   - Sub-heading: "As an IEEE member, you can gain access to:" — Inter 600, `--type-body-md`, `--color-text-primary`
   - Unordered list: each `<li>` has `color: var(--color-text-primary)` for text, `::before` pseudo-element `content: "•"` with `color: var(--color-cyan-400)`; `font-weight: 700`

4. **"WHO CAN JOIN?"** — Bebas Neue, `--type-display-lg`, `--color-text-primary`, `margin-top: var(--space-10)`

5. **"Open to students from all disciplines !!"** — Inter 700, `--type-body-xl`, `--color-text-primary`

6. **Disciplines line** — Inter 600, `--type-body-lg`
   - Wrap CS, ECE, ECOM, CHEMICAL, BIOTECH, MECHANICAL, MATHEMATICS in `<span class="discipline">` → `color: var(--color-cyan-400)`
   - Punctuation and "and more." remain in `--color-text-primary`

7. **"No prior experience required..."** — Inter 400, `--type-body-lg`, `--color-text-secondary`

---

### Panel A3 — Our Vision & Mission

```css
.panel-a3 {
  background: linear-gradient(180deg, #0D1F3C 0%, #060E1E 100%);
  position: relative;
  overflow: hidden;
}
/* Dark overlay pseudo-element to deepen a faint student photo texture */
```

**Structure (top to bottom):**

1. **Sparkle decoration** — 3–4 small 4-pointed SVG star shapes scattered above the "OUR VISION" heading. `color: rgba(255,255,255,0.4)`, 12–18px, positioned absolutely.

2. **"OUR VISION"** — Bebas Neue, `--type-display-xl`, `--color-text-primary`
   - Inline: eye-in-hand SVG icon to the right (40px, `--color-text-secondary`)

3. **Vision body** — Inter 400, `--type-body-lg`, `--color-text-secondary`

4. **"OUR MISSION"** — Bebas Neue, `--type-display-xl`, `--color-text-primary`, `margin-top: var(--space-12)`
   - Inline: target/bullseye SVG icon to the right (40px, `--color-text-secondary`)

5. **Mission body** — Inter 400, `--type-body-lg`, `--color-text-secondary`

6. **Bottom CTA text**:
   ```html
   <p class="panel-cta">
     <span>JOIN THE IEEE Community</span><br>
     <span>Innovate with Purpose</span>
   </p>
   ```
   Style: Inter 700, `--type-body-xl`, `--color-cyan-400`, underline on "JOIN THE IEEE Community" and "Innovate with Purpose", `margin-top: auto` (pushes to bottom of panel)

---

### "Flip Side" Divider

Between the A panels and B panels on desktop; hidden on mobile (panels just stack continuously).

```html
<div class="flip-divider" aria-hidden="true">
  <div class="flip-line"></div>
  <span class="flip-label">— BACK SIDE —</span>
  <div class="flip-line"></div>
</div>
```

```css
.flip-divider {
  display: none; /* hidden on mobile */
  grid-column: 1 / -1;
}
@media (min-width: 768px) {
  .flip-divider {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-6) var(--space-8);
  }
  .flip-line { flex: 1; height: 1px; background: var(--color-border); }
  .flip-label { font: Inter 500, var(--type-body-xs); letter-spacing: 0.15em; color: var(--color-text-muted); text-transform: uppercase; white-space: nowrap; }
}
```

---

### Panel B1 — Membership Benefits

```css
.panel-b1 {
  background: linear-gradient(160deg, #1A8FB8 0%, #0A1628 60%);
}
```

**Structure:**

1. **"MEMBERSHIP BENEFITS"** — Bebas Neue, `--type-display-lg`, white

2. **Six benefit cards** — stacked vertically with `gap: var(--space-3)`
   ```css
   .benefit-pill {
     background: rgba(255,255,255,0.10);
     border: 1px solid rgba(255,255,255,0.18);
     border-radius: var(--radius-lg);
     padding: var(--space-4) var(--space-5);
   }
   .benefit-pill strong { display: block; color: white; font-weight: 700; margin-bottom: var(--space-1); }
   .benefit-pill span { color: rgba(255,255,255,0.80); font-size: var(--type-body-sm); }
   ```
   Content: see `BROCHURE_CONTENT.md` Panel B1.

---

### Panel B2 — What We Have Organized

```css
.panel-b2 {
  background: var(--color-navy-800);
}
```

**Structure:**

1. **Heading row** — flex, `align-items: center`, `gap: var(--space-3)`
   - "WHAT WE HAVE ORGANIZED" in Bebas Neue, `--type-display-md`
   - "(2025-26)" in Inter 600, `--type-body-md`, `--color-text-secondary`
   - Globe SVG icon (24px, `--color-cyan-400`) to the right of the heading

2. **Four category cards** — 2×2 grid on desktop, stacked on mobile
   ```css
   .event-grid {
     display: grid;
     grid-template-columns: 1fr;
     gap: var(--space-4);
   }
   @media (min-width: 480px) {
     .event-grid { grid-template-columns: 1fr 1fr; }
   }
   ```
   Each card:
   ```css
   .event-card {
     background: rgba(255,255,255,0.05);
     border: 1px solid var(--color-border);
     border-radius: var(--radius-md);
     padding: var(--space-5);
   }
   .event-card-label {
     font: Inter 700 var(--type-body-md);
     color: var(--color-cyan-400);
     margin-bottom: var(--space-3);
   }
   .event-card ul { list-style: none; }
   .event-card li {
     font-size: var(--type-body-sm);
     color: var(--color-text-secondary);
     padding: var(--space-1) 0;
     padding-left: var(--space-4);
     position: relative;
   }
   .event-card li::before {
     content: "•";
     color: var(--color-cyan-400);
     position: absolute;
     left: 0;
   }
   ```
   Content: see `BROCHURE_CONTENT.md` Panel B2.

---

### Panel B3 — Contact & Chapter Identity

```css
.panel-b3 {
  background: var(--color-navy-800);
  position: relative;
  overflow: hidden;
}
/* Circuit line SVG pattern as ::before pseudo-element at opacity 0.08 */
```

**Structure:**

1. **Chapter logo card** — centered horizontally
   ```css
   .chapter-card {
     background: var(--color-navy-900);
     border: 1px solid var(--color-gold-400);
     border-radius: var(--radius-md);
     padding: var(--space-8);
     text-align: center;
     position: relative;
   }
   ```
   Contents:
   - Gold diamond SVG icon (48px, `color: var(--color-gold-400)`) — with circuit board / open book decorative detail inside
   - "IEEE" in Bebas Neue, `font-size: 2.5rem`, white
   - "— BPDC STUDENT CHAPTER —" in Inter 600, `--type-body-sm`, `color: var(--color-gold-400)`, `letter-spacing: 0.12em`, uppercase
   - "INNOVATE • CONNECT • INSPIRE" in Inter 400, `--type-body-xs`, `--color-text-muted`, `letter-spacing: 0.10em`

2. **Contact list** — stacked rows, each row is flex with icon + text
   ```css
   .contact-list { list-style: none; display: flex; flex-direction: column; gap: var(--space-4); margin-top: var(--space-6); }
   .contact-item { display: flex; align-items: flex-start; gap: var(--space-3); }
   .contact-icon { width: 20px; height: 20px; color: var(--color-cyan-400); flex-shrink: 0; margin-top: 2px; }
   .contact-text { font-size: var(--type-body-sm); color: var(--color-text-secondary); }
   .contact-text a { color: var(--color-cyan-400); }
   .contact-text a:hover { color: var(--color-cyan-300); }
   ```
   Items (in order): Instagram, Email, Website (link), LinkedIn, Location.
   See `BROCHURE_CONTENT.md` Panel B3 for exact values.

3. **Bottom strip** — same IEEE logo + tagline as Panel A1, small version, at very bottom.

---

### CTA Section (Bottom of Brochure Page)

Below all six panels. Full-width section.

```css
.brochure-cta {
  background: var(--color-navy-800);
  border-top: 1px solid var(--color-border);
  text-align: center;
  padding: var(--space-16) var(--space-6);
}
```

Contents:
- Small text: "Interested in joining?" — Inter 400, `--type-body-sm`, `--color-text-muted`
- Heading: "Become a member of IEEE BPDC" — Bebas Neue, `--type-display-md`, `--color-text-primary`
- Body: "Registration is open to all students. No prior experience required." — Inter 400, `--type-body-md`, `--color-text-secondary`
- Primary button: "Register Now →" — links to `register.html`

---

## Page 2: `register.html`

### Overall Layout

Single-column, centered. Max-width `480px` for the form card, centered horizontally with `margin: 0 auto`.

On mobile: form fills the screen with `padding: var(--space-4)`. On desktop: form card floats in the center of the page with a glow effect below it.

### Section: Page Header

```css
.register-header {
  text-align: center;
  padding: var(--space-12) var(--space-6) var(--space-8);
}
```

- IEEE logo (32px) centered
- "JOIN IEEE BPDC" — Bebas Neue, `--type-display-lg`, `--color-text-primary`
- "Orientation 2025–26" — Inter 400, `--type-body-md`, `--color-text-secondary`
- "Fill in your details below and we'll reach out to complete your IEEE membership." — Inter 400, `--type-body-md`, `--color-text-muted`

### Section: The Form

```html
<form id="registration-form" class="form-card" novalidate>
  <!-- fields here -->
  <button type="submit" class="btn-primary btn-full">Register →</button>
</form>
```

```css
.form-card {
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  box-shadow: var(--shadow-card);
  max-width: 480px;
  margin: 0 auto;
}
```

**Field structure (each field is a `.form-group`):**
```html
<div class="form-group">
  <label for="full-name" class="form-label">Full Name <span class="required-star">*</span></label>
  <input type="text" id="full-name" name="full_name" placeholder="e.g. Arjun Sharma" required>
  <p class="form-error" id="full-name-error" role="alert" hidden></p>
</div>
```

```css
.form-group { display: flex; flex-direction: column; gap: var(--space-2); }
.form-label { font: Inter 500 var(--type-body-sm); color: var(--color-text-secondary); }
.required-star { color: var(--color-cyan-400); }
.form-error { font-size: var(--type-body-sm); color: var(--color-error); }
.btn-full { width: 100%; justify-content: center; }
```

**Fields in order:**

| # | Label | Input type | ID | name | Required | Helper/Placeholder |
|---|-------|------------|-----|------|----------|--------------------|
| 1 | Full Name | text | `full-name` | `full_name` | Yes | Placeholder: "e.g. Arjun Sharma" |
| 2 | BITS ID | text | `bits-id` | `bits_id` | Yes | Helper text: "e.g. 2023A7PS0001U" — show below input always |
| 3 | Email ID | email | `email` | `email` | Yes | Placeholder: "you@dubai.bits-pilani.ac.in" |
| 4 | Phone (for calls) | tel | `phone-call` | `phone_call` | Yes | Placeholder: "+971 XX XXX XXXX" |
| 5 | WhatsApp Number | tel | `phone-whatsapp` | `phone_whatsapp` | No | Helper: "Leave blank if same as calling number" |

**Spacing between form groups:** `gap: var(--space-5)` on the `<form>` element using `display: flex; flex-direction: column`.

**Submit button:**
```
text: "Register Now →"
class: btn-primary btn-full
```

While submitting: replace button text with a spinner + "Submitting…", disable the button.

### Validation Rules

Run on submit (not on blur — avoid annoying inline validation while the user is typing).

- **Full Name**: required, min 2 chars, max 100 chars
- **BITS ID**: required, regex `/^[0-9]{4}[A-Z][0-9][A-Z]{2}[0-9]{4}[A-Z]$/i` — show hint in error if invalid format
- **Email**: required, valid email format, optionally warn (not error) if not a BITS email domain
- **Phone (calls)**: required, min 7 digits after stripping non-numeric chars
- **WhatsApp**: optional, but if provided, min 7 digits

### Success State

After successful submission, hide the form and show:

```html
<div class="success-state" id="success-state" hidden>
  <div class="success-icon">✓</div>
  <h2>You're registered!</h2>
  <p>We'll reach out on your calling number to complete the IEEE membership process.</p>
  <p class="success-meta">Registered as: <strong id="success-name"></strong></p>
  <a href="brochure.html" class="btn-secondary">← Back to Brochure</a>
</div>
```

```css
.success-state { text-align: center; padding: var(--space-12) var(--space-6); }
.success-icon {
  width: 64px; height: 64px;
  background: var(--color-cyan-muted);
  border: 2px solid var(--color-cyan-400);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; color: var(--color-cyan-400);
  margin: 0 auto var(--space-6);
}
.success-state h2 { font-family: 'Bebas Neue', sans-serif; font-size: var(--type-display-md); color: var(--color-text-primary); }
.success-meta { font-size: var(--type-body-sm); color: var(--color-text-muted); margin-top: var(--space-4); }
```

---

## Page 3: `admin.html`

See `ADMIN.md` for the complete admin portal specification.

---

## JavaScript: `js/config.js`

```javascript
// IEEE BPDC Site — Configuration
// Fill these in before deployment.

const CONFIG = {
  SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE',
  APPS_SCRIPT_URL: 'YOUR_APPS_SCRIPT_URL_HERE',
  ADMIN_PASSWORD: 'ieee_bpdc_2026',
};
```

Every other script reads from `CONFIG` — no credentials anywhere else.

---

## JavaScript: `js/analytics.js`

Fires on DOMContentLoaded in `brochure.html` and `register.html`. Determines the page name and inserts a row into Supabase `page_scans`.

```javascript
// analytics.js
(function() {
  const pageName = document.body.dataset.page; // set via <body data-page="brochure"> etc.
  if (!pageName) return;

  async function trackScan(page) {
    try {
      const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/page_scans`, {
        method: 'POST',
        headers: {
          'apikey': CONFIG.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ page })
      });
      if (!res.ok) console.warn('Analytics failed:', res.status);
    } catch (e) {
      console.warn('Analytics error:', e);
    }
  }

  document.addEventListener('DOMContentLoaded', () => trackScan(pageName));
})();
```

Set `<body data-page="brochure">` in `brochure.html` and `<body data-page="registration">` in `register.html`.

---

## JavaScript: `js/form.js`

Handles the registration form. Runs only on `register.html`.

**Responsibilities:**
1. Client-side validation on submit
2. Show/hide field error messages
3. Submit to Supabase via `supabase.js`
4. Mirror submission to Google Sheets via `sheets.js`
5. Show success state or error message

```javascript
// Pseudo-code structure
document.getElementById('registration-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = collectFormData();
  const errors = validateForm(data);
  if (errors.length) { renderErrors(errors); return; }
  
  setSubmitLoading(true);
  try {
    await Promise.all([
      insertRegistration(data),      // supabase.js
      mirrorToSheets(data)           // sheets.js — non-blocking, errors swallowed
    ]);
    showSuccessState(data.full_name);
  } catch (err) {
    showFormError('Something went wrong. Please try again or contact us at ieee_bpdc@dubai.bits-pilani.ac.in');
  } finally {
    setSubmitLoading(false);
  }
});
```

**`collectFormData()`** reads all five field values. If `phone_whatsapp` is empty, set it to the `phone_call` value before sending.

**`setSubmitLoading(loading)`** — when `true`: disable submit button, replace text with `<span class="spinner"></span> Submitting…`. When `false`: re-enable, restore original text.

The spinner is a CSS-only rotating ring:
```css
.spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```
