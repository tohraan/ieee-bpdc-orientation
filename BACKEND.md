# Backend Specification — IEEE BPDC Site

## Architecture Overview

```
Browser (static site)
    │
    ├──► Supabase REST API (primary data store)
    │        └── PostgreSQL database
    │                ├── page_scans table
    │                └── registrations table
    │
    └──► Google Apps Script Web App (spreadsheet mirror)
             └── Google Sheet: "IEEE BPDC Registrations 2025-26"
```

The frontend talks directly to both backends over HTTPS from the browser. There is no intermediate server. The Supabase anon key and Apps Script URL are visible in client-side code — this is acceptable for a student chapter orientation site, but **rotate both keys after the event**.

---

## Supabase Setup

### Project Setup

1. Create a new Supabase project at https://supabase.com
2. Note your **Project URL** (e.g., `https://abcdefgh.supabase.co`) and **anon (public) key**
3. Both go into `js/config.js`

### Database Schema

Run these SQL statements in the Supabase SQL Editor:

```sql
-- ============================================================
-- TABLE: page_scans
-- Records every page load (used as QR code scan counter)
-- ============================================================
CREATE TABLE public.page_scans (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  page        text        NOT NULL CHECK (page IN ('brochure', 'registration')),
  scanned_at  timestamptz DEFAULT now() NOT NULL
);

-- Index for fast counting by page name
CREATE INDEX idx_page_scans_page ON public.page_scans (page);

-- ============================================================
-- TABLE: registrations
-- Stores submitted registration form data
-- ============================================================
CREATE TABLE public.registrations (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name       text        NOT NULL,
  bits_id         text        NOT NULL,
  email           text        NOT NULL,
  phone_call      text        NOT NULL,
  phone_whatsapp  text,
  submitted_at    timestamptz DEFAULT now() NOT NULL
);

-- Index for chronological listing
CREATE INDEX idx_registrations_submitted ON public.registrations (submitted_at DESC);
```

### Row Level Security (RLS)

Enable RLS on both tables and create the following policies:

```sql
-- Enable RLS
ALTER TABLE public.page_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- page_scans: anyone with the anon key can INSERT (for tracking)
-- but NOT SELECT (data only visible via service key in admin)
CREATE POLICY "Allow anon insert on page_scans"
  ON public.page_scans
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- page_scans: no SELECT for anon (admin uses service key)
-- (no SELECT policy = no access)

-- registrations: anyone with the anon key can INSERT
CREATE POLICY "Allow anon insert on registrations"
  ON public.registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- registrations: no SELECT for anon
-- (admin reads via service key or we use a separate approach — see Admin section)
```

### Admin Read Access Strategy

The admin dashboard needs to **read** both tables. Since the anon key cannot SELECT (by design above), we have two options. **Choose one:**

**Option A — Admin uses the service role key** (simpler, less secure):
- Store the service role key in `CONFIG.ADMIN_SERVICE_KEY`
- Only used in `admin.js`, only after the password check passes
- The service role key is visible in client-side JS — acceptable for an internal tool on a short-lived orientation site; rotate after the event

**Option B — Create a Supabase Edge Function** (more secure, more work):
- A serverless function that accepts the admin password and returns data
- Keeps the service key server-side
- Not recommended for a one-day event with time constraints

**Recommendation: Use Option A.** Add to `js/config.js`:
```javascript
const CONFIG = {
  SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE',
  SUPABASE_ANON_KEY: 'YOUR_ANON_KEY_HERE',
  SUPABASE_SERVICE_KEY: 'YOUR_SERVICE_ROLE_KEY_HERE', // used only in admin.js
  APPS_SCRIPT_URL: 'YOUR_APPS_SCRIPT_URL_HERE',
  ADMIN_PASSWORD: 'ieee_bpdc_2026',
};
```

### Supabase REST API Patterns

All requests use the Supabase REST API directly (no SDK — keeps things framework-free).

**Base headers for anon operations:**
```javascript
const anonHeaders = {
  'apikey': CONFIG.SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};
```

**Base headers for admin (service role) operations:**
```javascript
const serviceHeaders = {
  'apikey': CONFIG.SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`,
  'Content-Type': 'application/json',
};
```

**INSERT a registration:**
```javascript
async function insertRegistration(data) {
  const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/registrations`, {
    method: 'POST',
    headers: { ...anonHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      full_name: data.full_name,
      bits_id: data.bits_id,
      email: data.email,
      phone_call: data.phone_call,
      phone_whatsapp: data.phone_whatsapp || data.phone_call,
    })
  });
  if (!res.ok) throw new Error(`Supabase insert failed: ${res.status}`);
}
```

**INSERT a page scan:**
```javascript
async function trackPageScan(page) {
  const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/page_scans`, {
    method: 'POST',
    headers: { ...anonHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ page })
  });
  // Do not throw — analytics failure should never break the user experience
  if (!res.ok) console.warn('Scan tracking failed:', res.status);
}
```

**SELECT all registrations (admin):**
```javascript
async function fetchRegistrations() {
  const res = await fetch(
    `${CONFIG.SUPABASE_URL}/rest/v1/registrations?select=*&order=submitted_at.desc`,
    { headers: serviceHeaders }
  );
  if (!res.ok) throw new Error('Failed to fetch registrations');
  return res.json();
}
```

**SELECT scan counts (admin):**
```javascript
async function fetchScanCounts() {
  // Get count for brochure page
  const brochureRes = await fetch(
    `${CONFIG.SUPABASE_URL}/rest/v1/page_scans?page=eq.brochure&select=id`,
    { headers: { ...serviceHeaders, 'Prefer': 'count=exact' } }
  );
  const brochureCount = parseInt(brochureRes.headers.get('Content-Range')?.split('/')[1] || '0');

  // Get count for registration page
  const regRes = await fetch(
    `${CONFIG.SUPABASE_URL}/rest/v1/page_scans?page=eq.registration&select=id`,
    { headers: { ...serviceHeaders, 'Prefer': 'count=exact' } }
  );
  const regCount = parseInt(regRes.headers.get('Content-Range')?.split('/')[1] || '0');

  return { brochure: brochureCount, registration: regCount };
}
```

The `Content-Range` header from Supabase with `Prefer: count=exact` returns `0-24/87` format — parse the number after `/`.

**SELECT total registration count (admin):**
```javascript
async function fetchRegistrationCount() {
  const res = await fetch(
    `${CONFIG.SUPABASE_URL}/rest/v1/registrations?select=id`,
    { headers: { ...serviceHeaders, 'Prefer': 'count=exact' } }
  );
  return parseInt(res.headers.get('Content-Range')?.split('/')[1] || '0');
}
```

---

## Google Sheets Setup

### Purpose

A Google Sheet acts as a human-readable mirror of the `registrations` table. The committee can open a spreadsheet and see all submissions without needing Supabase access. This is the secondary store — Supabase is authoritative.

### Setup Steps

1. **Create the Google Sheet**
   - Title: "IEEE BPDC Registrations 2025-26"
   - Sheet tab name: "Registrations"
   - Row 1 headers (add manually): `Timestamp | Full Name | BITS ID | Email | Phone (Call) | Phone (WhatsApp)`

2. **Create the Apps Script**
   - In the Sheet: Extensions → Apps Script
   - Replace the default `Code.gs` content with the script below
   - Deploy as a Web App: Execute as "Me", Who has access: "Anyone"
   - Copy the deployment URL → `CONFIG.APPS_SCRIPT_URL`

**Apps Script code (`Code.gs`):**

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registrations');

    sheet.appendRow([
      new Date().toISOString(),
      data.full_name || '',
      data.bits_id || '',
      data.email || '',
      data.phone_call || '',
      data.phone_whatsapp || data.phone_call || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: GET endpoint to verify the script is live
function doGet() {
  return ContentService
    .createTextOutput('IEEE BPDC Registration Mirror — OK')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

### `js/sheets.js` — Frontend Webhook Caller

```javascript
// sheets.js
async function mirrorToSheets(data) {
  try {
    await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      // Apps Script requires no-cors for cross-origin POST
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: data.full_name,
        bits_id: data.bits_id,
        email: data.email,
        phone_call: data.phone_call,
        phone_whatsapp: data.phone_whatsapp || data.phone_call,
      })
    });
    // Note: with mode: 'no-cors', we cannot read the response.
    // Errors are silently swallowed — this is intentional.
    // Supabase is the authoritative store.
  } catch (err) {
    console.warn('Google Sheets mirror failed:', err);
    // Non-fatal — do not throw
  }
}
```

**Important:** Google Apps Script Web Apps do not support CORS by default, so the request must use `mode: 'no-cors'`. This means we cannot read the response. The submission is fire-and-forget for the Sheets mirror. Supabase is the source of truth.

---

## `js/supabase.js` — Supabase Client Module

```javascript
// supabase.js
// Thin wrapper around the Supabase REST API.
// No external SDK — uses native fetch.

const Supabase = (() => {
  function anonHeaders() {
    return {
      'apikey': CONFIG.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  function serviceHeaders() {
    return {
      'apikey': CONFIG.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  async function insertRegistration(data) {
    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/registrations`, {
      method: 'POST',
      headers: { ...anonHeaders(), 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        full_name: data.full_name,
        bits_id: data.bits_id,
        email: data.email,
        phone_call: data.phone_call,
        phone_whatsapp: data.phone_whatsapp || data.phone_call,
      })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Registration insert failed (${res.status}): ${text}`);
    }
  }

  async function trackPageScan(page) {
    try {
      await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/page_scans`, {
        method: 'POST',
        headers: { ...anonHeaders(), 'Prefer': 'return=minimal' },
        body: JSON.stringify({ page })
      });
    } catch (e) {
      console.warn('Scan tracking error:', e);
    }
  }

  async function fetchRegistrations() {
    const res = await fetch(
      `${CONFIG.SUPABASE_URL}/rest/v1/registrations?select=*&order=submitted_at.desc`,
      { headers: serviceHeaders() }
    );
    if (!res.ok) throw new Error('Failed to fetch registrations');
    return res.json();
  }

  async function fetchCounts() {
    const [brochureRes, regRes, totalRes] = await Promise.all([
      fetch(`${CONFIG.SUPABASE_URL}/rest/v1/page_scans?page=eq.brochure&select=id`,
        { headers: { ...serviceHeaders(), 'Prefer': 'count=exact' } }),
      fetch(`${CONFIG.SUPABASE_URL}/rest/v1/page_scans?page=eq.registration&select=id`,
        { headers: { ...serviceHeaders(), 'Prefer': 'count=exact' } }),
      fetch(`${CONFIG.SUPABASE_URL}/rest/v1/registrations?select=id`,
        { headers: { ...serviceHeaders(), 'Prefer': 'count=exact' } }),
    ]);

    function parseCount(res) {
      return parseInt(res.headers.get('Content-Range')?.split('/')[1] || '0');
    }

    return {
      brochureScans: parseCount(brochureRes),
      registrationScans: parseCount(regRes),
      totalRegistrations: parseCount(totalRes),
    };
  }

  return { insertRegistration, trackPageScan, fetchRegistrations, fetchCounts };
})();
```

---

## Error Handling Policy

| Error | User sees | Logged |
|-------|-----------|--------|
| Supabase insert fails | Form-level error message with support email | `console.error` |
| Sheets mirror fails | Nothing (silent) | `console.warn` |
| Scan tracking fails | Nothing (silent) | `console.warn` |
| Admin data fetch fails | Error banner in dashboard | `console.error` |
| Network offline | Form error: "No internet connection detected" | `console.warn` |

Always check `navigator.onLine` before submit — if offline, show the error immediately without attempting any network calls.

---

## Post-Event Cleanup

After the orientation event:
1. Export the Google Sheet as CSV (backup)
2. Export Supabase `registrations` table as CSV (backup)
3. Revoke the deployed Apps Script URL
4. Delete or disable the Supabase project
5. Take down the deployed site
