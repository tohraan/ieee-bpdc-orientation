# Design System — IEEE BPDC Site

## Visual Philosophy

The site is a direct extension of the print brochure. The brochure lives in a dark, high-contrast world of deep navy blues, IEEE's official cyan, and gold accents. The site honors that world precisely — it should feel like stepping from the printed piece into the same brand environment on screen.

This is a **single-theme dark design**. There is no light mode. Set explicit `background` on `body` and all major containers.

---

## Color Tokens

Define these as CSS custom properties on `:root`. Every color in the codebase must reference one of these — no hardcoded hex values elsewhere.

```css
:root {
  /* === Primary Palette === */
  --color-navy-900: #060E1E;        /* Deepest background — page body */
  --color-navy-800: #0A1628;        /* Section backgrounds, card base */
  --color-navy-700: #0D1F3C;        /* Slightly lighter panels */
  --color-navy-600: #1A3A6E;        /* Mid-blue, secondary cards, borders */
  --color-navy-500: #1E4080;        /* Interactive hover states */

  /* === Accent — Cyan (IEEE brand) === */
  --color-cyan-400: #00AEEF;        /* Primary accent: links, highlights, bullets, active states */
  --color-cyan-300: #33C0F4;        /* Lighter cyan for hover on cyan elements */
  --color-cyan-600: #007BAB;        /* Darker cyan for pressed states */
  --color-cyan-muted: rgba(0,174,239,0.12);   /* Low-opacity cyan for highlight boxes */
  --color-cyan-border: rgba(0,174,239,0.30);  /* Cyan border without full saturation */

  /* === Accent — Gold (BPDC chapter) === */
  --color-gold-400: #C9A84C;        /* Used sparingly: chapter badge, premium labels */
  --color-gold-300: #DEC070;        /* Hover on gold elements */
  --color-gold-muted: rgba(201,168,76,0.15);  /* Gold highlight wash */

  /* === Text === */
  --color-text-primary: #F0F6FF;    /* Headings, primary body copy */
  --color-text-secondary: #A8BDD4;  /* Captions, secondary body, metadata */
  --color-text-muted: #5A7A9A;      /* Placeholder text, disabled states */
  --color-text-inverse: #060E1E;    /* Text on cyan or gold backgrounds */

  /* === Surface / UI === */
  --color-surface-card: rgba(255,255,255,0.04);     /* Glass card base */
  --color-surface-card-hover: rgba(255,255,255,0.07);
  --color-surface-input: rgba(255,255,255,0.06);    /* Form input backgrounds */
  --color-surface-input-focus: rgba(0,174,239,0.08);
  --color-border: rgba(255,255,255,0.10);           /* Default dividers and borders */
  --color-border-accent: var(--color-cyan-border);  /* Focused input borders */

  /* === Semantic (admin dashboard) === */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}
```

### Color Usage Rules

- **`--color-navy-900`** is always the page body background.
- **`--color-cyan-400`** is the only accent color for interactive elements (links, focus rings, primary buttons, bullet points, stat tile accent bar).
- **`--color-gold-400`** appears exactly twice on the site: the BPDC chapter badge/stripe and the decorative diamond element in the brochure's contact panel. Do not use it for anything else.
- Never use pure white (`#FFFFFF`) for large text blocks — use `--color-text-primary`.
- Never use pure black for backgrounds — use `--color-navy-900`.

---

## Typography

### Typeface Roles

| Role | Family | Weight(s) | Use |
|------|---------|-----------|-----|
| Display | Bebas Neue | 400 (only weight available) | Section hero headings, panel titles, stat numbers |
| Body | Inter | 400, 500, 600, 700 | All body copy, labels, buttons, nav, form text |
| Mono | JetBrains Mono | 400, 500 | Admin table data, BITS ID input, stat count numbers, technical values |

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type Scale

```css
:root {
  /* Display (Bebas Neue) */
  --type-display-xl: clamp(3.5rem, 8vw, 6rem);    /* Hero panel titles: "WHY JOIN IEEE?" */
  --type-display-lg: clamp(2.5rem, 5vw, 4rem);    /* Section titles: "OUR VISION", "MEMBERSHIP BENEFITS" */
  --type-display-md: clamp(1.8rem, 3.5vw, 2.5rem); /* Sub-section headers */

  /* Body (Inter) */
  --type-body-xl: 1.125rem;    /* Lead paragraph, intro copy */
  --type-body-lg: 1rem;        /* Standard body copy */
  --type-body-md: 0.9375rem;   /* Card body, secondary paragraphs */
  --type-body-sm: 0.8125rem;   /* Captions, helper text, metadata */
  --type-body-xs: 0.6875rem;   /* Legal, footnotes */

  /* Labels */
  --type-label-lg: 0.875rem;   /* Button text, nav items */
  --type-label-sm: 0.6875rem;  /* Tags, chips */

  /* Mono (JetBrains Mono) */
  --type-mono-lg: 1rem;
  --type-mono-sm: 0.8125rem;
}
```

### Typography Rules

- Bebas Neue is always uppercase by nature — never apply `text-transform: lowercase` to display text.
- Body text max-width: `65ch` for readability in prose blocks.
- All headings: `text-wrap: balance`.
- Uppercase label text (e.g., nav items, stat tile labels): `letter-spacing: 0.08em`.
- Line height: display = `1.0`–`1.05`; body = `1.6`–`1.7`; mono = `1.5`.

---

## Spacing Scale

Use a base-4 scale. Reference these as CSS custom properties.

```css
:root {
  --space-1: 0.25rem;   /*  4px */
  --space-2: 0.5rem;    /*  8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

---

## Border Radius

```css
:root {
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --radius-pill: 999px;
}
```

---

## Shadows and Glows

```css
:root {
  --shadow-card: 0 2px 16px rgba(0,0,0,0.4);
  --shadow-card-hover: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px var(--color-cyan-border);
  --glow-cyan: 0 0 24px rgba(0,174,239,0.25);
  --shadow-button: 0 4px 16px rgba(0,174,239,0.30);
}
```

---

## Component Specifications

### Buttons

**Primary Button** (used for form submit, admin login):
```
background: var(--color-cyan-400)
color: var(--color-text-inverse)
font: Inter 600, var(--type-label-lg)
letter-spacing: 0.06em
text-transform: uppercase
padding: var(--space-4) var(--space-8)
border-radius: var(--radius-sm)
border: none
box-shadow: var(--shadow-button)
transition: background 0.18s, transform 0.12s
min-height: 48px   ← touch target requirement
```
Hover: `background: var(--color-cyan-300)`, `transform: translateY(-1px)`
Active: `background: var(--color-cyan-600)`, `transform: translateY(0)`
Disabled: `opacity: 0.45`, `cursor: not-allowed`

**Secondary Button** (admin export CSV):
```
background: transparent
color: var(--color-cyan-400)
border: 1px solid var(--color-cyan-border)
Same sizing as primary
```

### Cards

All cards on the site use the same base:
```
background: var(--color-surface-card)
border: 1px solid var(--color-border)
border-radius: var(--radius-md)
padding: var(--space-6)
backdrop-filter: blur(8px)
```

Hover (interactive cards only): `box-shadow: var(--shadow-card-hover)`

### Form Inputs

```
background: var(--color-surface-input)
border: 1px solid var(--color-border)
border-radius: var(--radius-sm)
color: var(--color-text-primary)
font: Inter 400, var(--type-body-lg)
padding: var(--space-3) var(--space-4)
min-height: 48px
transition: border-color 0.18s, background 0.18s
```
Focus:
```
outline: none
border-color: var(--color-cyan-400)
background: var(--color-surface-input-focus)
box-shadow: 0 0 0 3px rgba(0,174,239,0.15)
```
Error state:
```
border-color: var(--color-error)
box-shadow: 0 0 0 3px rgba(239,68,68,0.15)
```

### Navigation (Bottom Nav — Mobile)

```
position: fixed
bottom: 0
width: 100%
background: var(--color-navy-800)
border-top: 1px solid var(--color-border)
display: flex
height: 60px
```
Each nav item: icon (24px SVG) + label (Inter 500, `--type-body-xs`), stacked vertically, centered. Active state: `color: var(--color-cyan-400)`.

### Navigation (Top Nav — Desktop ≥768px)

```
position: sticky
top: 0
background: rgba(10,22,40,0.92)
backdrop-filter: blur(12px)
border-bottom: 1px solid var(--color-border)
height: 64px
display: flex, align-items: center, justify-content: space-between
```

### Stat Tiles (Admin Dashboard)

```
background: var(--color-surface-card)
border: 1px solid var(--color-border)
border-radius: var(--radius-md)
border-left: 3px solid var(--color-cyan-400)   ← accent stripe
padding: var(--space-6)
```
Number: JetBrains Mono 500, `--type-display-md`, `--color-text-primary`
Label: Inter 500, `--type-body-sm`, `--color-text-secondary`, `letter-spacing: 0.08em`, uppercase

---

## Layout Breakpoints

```css
/* Mobile first — base styles target 375px */
/* Tablet */
@media (min-width: 640px) { ... }
/* Desktop */
@media (min-width: 768px) { ... }
/* Wide Desktop */
@media (min-width: 1100px) { ... }
```

---

## Decorative Elements (Brochure Panels)

These appear in the brochure recreation panels and should be reproduced as inline SVG, not images.

**Dot grid pattern** (appears top-right of the "About Us" panel):
```
Small circles, ~3px diameter, rgba(255,255,255,0.15), arranged in a 6×6 grid with 12px gap
Implemented as an SVG with repeated <circle> elements or a CSS radial-gradient background-image
```

**Sparkle/diamond icons** (appear near "Our Vision" title):
```
4-pointed star shapes, thin strokes, --color-text-secondary, 12–20px
Implemented as inline SVG path
```

**Circuit line pattern** (BPDC contact panel background):
```
Thin lines with small square endpoints, suggesting circuit board traces
Implemented as an SVG placed as a background layer with reduced opacity (0.08–0.12)
```

**City skyline silhouette** (About Us panel):
```
Simplified Dubai skyline silhouette
Implemented as an SVG path at the bottom of the panel, opacity 0.15, --color-cyan-400 fill
```

---

## Gradient Patterns

The brochure uses bold gradients. Replicate these exactly:

**Membership Benefits panel background**:
```css
background: linear-gradient(160deg, #1A8FB8 0%, #0A1628 60%);
```

**Right panel front (Vision/Mission) background**:
```css
background: linear-gradient(180deg, #0D1F3C 0%, #060E1E 100%);
/* + subtle background texture via CSS noise or SVG filter */
```

**Page body background**:
```css
background: var(--color-navy-900);
/* Optional: very subtle radial glow at top center */
background-image: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,174,239,0.06) 0%, transparent 70%);
```

---

## Animation and Motion

Keep motion minimal and purposeful.

```css
/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Allowed animations:**
- Form field focus: `border-color` and `box-shadow` transitions, 180ms ease
- Button hover: `background`, `transform` transitions, 120–180ms ease
- Card hover: `box-shadow`, `border-color` transitions, 200ms ease
- Page section fade-in on scroll: `opacity` 0→1, `translateY` 16px→0, 400ms ease-out, staggered 80ms per section. Use `IntersectionObserver`.
- Success state on form: opacity fade-in of confirmation panel, 300ms ease

**Not allowed:**
- Parallax scrolling (performance + accessibility)
- Auto-playing video or GIF backgrounds
- Spinning or pulsing elements on the brochure page (distract from content)
- Animation on the admin dashboard data rows (distracting in a data context)
