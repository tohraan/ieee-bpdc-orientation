# Admin Portal Specification — IEEE BPDC Site

## Overview

`admin.html` is an internal dashboard for the IEEE BPDC organizing committee. It shows:
- QR code scan counts (brochure page vs. registration page)
- Total number of submitted registrations
- Full table of all registration submissions
- CSV export of registrations

**Access:** Protected by a client-side password check. Password is set in `CONFIG.ADMIN_PASSWORD` in `js/config.js`.

---

## Page States

The admin page has exactly two visual states:

### State 1: Login Screen

Shown on initial load and after logout. The rest of the page content is **not rendered** — it exists in a `hidden` div or is injected dynamically after login.

### State 2: Dashboard

Shown only after the correct password is entered. On valid login:
- Store `true` in `sessionStorage` under key `ieee_admin_auth`
- Show the dashboard, hide the login form
- Load data immediately

On page refresh: check `sessionStorage.getItem('ieee_admin_auth')`. If `'true'`, skip the login screen and show the dashboard directly.

---

## Login Screen Layout

```css
.admin-login-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-navy-900);
}
.login-card {
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-10);
  width: 100%;
  max-width: 360px;
  box-shadow: var(--shadow-card);
}
```

**Login card contents:**

1. IEEE logo SVG (40px, white), centered
2. "IEEE BPDC" — Bebas Neue, `--type-display-md`, `--color-text-primary`, centered
3. "Admin Dashboard" — Inter 500, `--type-body-sm`, `--color-text-muted`, `letter-spacing: 0.08em`, uppercase, centered
4. Divider line (1px, `--color-border`), `margin: var(--space-6) 0`
5. Password field:
   ```html
   <div class="form-group">
     <label for="admin-password" class="form-label">Password</label>
     <input type="password" id="admin-password" placeholder="Enter admin password" autocomplete="current-password">
     <p class="form-error" id="login-error" hidden>Incorrect password. Try again.</p>
   </div>
   ```
6. Submit button: "Access Dashboard →" (full width, primary button)

**Login logic:**
```javascript
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const entered = document.getElementById('admin-password').value;
  if (entered === CONFIG.ADMIN_PASSWORD) {
    sessionStorage.setItem('ieee_admin_auth', 'true');
    showDashboard();
  } else {
    document.getElementById('login-error').hidden = false;
    document.getElementById('admin-password').value = '';
    document.getElementById('admin-password').focus();
  }
});
```

On enter key in the password field — submit (default form behavior, no extra handling needed).

---

## Dashboard Layout

```css
.admin-layout {
  min-height: 100vh;
  background: var(--color-navy-900);
  display: flex;
  flex-direction: column;
}
.admin-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}
```

### Admin Navigation

Simplified top bar (no bottom nav on admin page — this is a desktop-first tool, but must still work on mobile).

```html
<header class="admin-nav">
  <div class="admin-nav-left">
    <!-- IEEE logo SVG (24px) -->
    <span class="admin-nav-title">IEEE BPDC <span class="admin-label">Admin</span></span>
  </div>
  <div class="admin-nav-right">
    <button id="logout-btn" class="btn-secondary btn-sm">Logout</button>
  </div>
</header>
```

```css
.admin-nav {
  background: rgba(10,22,40,0.95);
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--space-6);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}
.admin-nav-title {
  font: Inter 600 var(--type-body-lg);
  color: var(--color-text-primary);
}
.admin-label {
  background: var(--color-cyan-muted);
  color: var(--color-cyan-400);
  border: 1px solid var(--color-cyan-border);
  border-radius: var(--radius-sm);
  font-size: var(--type-body-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 6px;
  margin-left: var(--space-2);
  vertical-align: middle;
}
.btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--type-body-sm); min-height: 36px; }
```

**Logout behavior:** Clear `sessionStorage.removeItem('ieee_admin_auth')`, reload the page.

---

### Stats Row

Three stat tiles in a horizontal row (wraps to single column on mobile).

```html
<section class="stats-section">
  <div class="stats-row">
    <div class="stat-tile" id="stat-brochure">
      <div class="stat-number" id="count-brochure">—</div>
      <div class="stat-label">Brochure Page Scans</div>
      <div class="stat-description">QR Code A</div>
    </div>
    <div class="stat-tile" id="stat-registration">
      <div class="stat-number" id="count-registration">—</div>
      <div class="stat-label">Registration Page Scans</div>
      <div class="stat-description">QR Code B</div>
    </div>
    <div class="stat-tile" id="stat-total">
      <div class="stat-number" id="count-total">—</div>
      <div class="stat-label">Total Registrations</div>
      <div class="stat-description">Completed forms</div>
    </div>
  </div>
</section>
```

```css
.stats-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}
@media (min-width: 640px) {
  .stats-row { grid-template-columns: repeat(3, 1fr); }
}

.stat-tile {
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-cyan-400);
  border-radius: var(--radius-md);
  padding: var(--space-6);
}
.stat-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--type-display-md);
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1;
  margin-bottom: var(--space-2);
}
.stat-label {
  font: Inter 600 var(--type-body-sm);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.stat-description {
  font: Inter 400 var(--type-body-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}
```

**Loading state:** Show `—` in `.stat-number` while fetching. Replace with the actual number once loaded. Do not use skeleton loaders — plain dashes are simpler and cleaner for an internal tool.

**Error state:** If fetch fails, show `!` in the stat number and a brief banner below the row:
```html
<div class="error-banner" hidden id="stats-error">
  Failed to load stats. Check your Supabase connection.
</div>
```

---

### Registrations Section

```html
<section class="registrations-section">
  <div class="section-header">
    <h2 class="section-title">Registrations</h2>
    <div class="section-actions">
      <button id="refresh-btn" class="btn-secondary btn-sm">↻ Refresh</button>
      <button id="export-btn" class="btn-secondary btn-sm">↓ Export CSV</button>
    </div>
  </div>
  <div class="table-container" id="registrations-table-container">
    <!-- Table injected here by admin.js -->
  </div>
</section>
```

```css
.registrations-section { display: flex; flex-direction: column; gap: var(--space-5); }
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}
.section-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: var(--type-display-md);
  color: var(--color-text-primary);
}
.section-actions { display: flex; gap: var(--space-3); }
.table-container {
  overflow-x: auto; /* critical — prevents page from scrolling horizontally */
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
```

---

### Registrations Table

`admin.js` generates this table HTML dynamically after fetching data.

```html
<table class="data-table">
  <thead>
    <tr>
      <th>#</th>
      <th>Full Name</th>
      <th>BITS ID</th>
      <th>Email</th>
      <th>Phone (Call)</th>
      <th>WhatsApp</th>
      <th>Submitted At</th>
    </tr>
  </thead>
  <tbody>
    <!-- one <tr> per registration, injected by admin.js -->
  </tbody>
</table>
```

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--type-body-sm);
  white-space: nowrap;
}
.data-table th {
  background: var(--color-navy-800);
  color: var(--color-text-muted);
  font: Inter 600 var(--type-body-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: var(--space-3) var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 56px; /* below the admin nav */
}
.data-table td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--type-mono-sm);
}
.data-table td:nth-child(2) {
  /* Name column — use Inter, not mono */
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}
.data-table tbody tr:hover {
  background: var(--color-surface-card-hover);
}
.data-table tbody tr:last-child td {
  border-bottom: none;
}
.row-number {
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}
```

**Timestamp formatting:** Use `Intl.DateTimeFormat` with locale `'en-AE'`, timezone `'Asia/Dubai'`:
```javascript
function formatTimestamp(iso) {
  return new Intl.DateTimeFormat('en-AE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Dubai'
  }).format(new Date(iso));
}
```

**Empty state:** When no registrations exist yet, show:
```html
<tr>
  <td colspan="7" class="table-empty">No registrations yet. Check back after the orientation begins.</td>
</tr>
```
```css
.table-empty {
  text-align: center;
  color: var(--color-text-muted);
  font-family: 'Inter', sans-serif;
  padding: var(--space-12) var(--space-6);
}
```

---

### CSV Export

Implemented entirely in the browser — no server needed.

```javascript
document.getElementById('export-btn').addEventListener('click', () => {
  if (!window._adminData || window._adminData.length === 0) {
    alert('No data to export.');
    return;
  }

  const headers = ['#', 'Full Name', 'BITS ID', 'Email', 'Phone (Call)', 'WhatsApp', 'Submitted At'];
  const rows = window._adminData.map((r, i) => [
    i + 1,
    r.full_name,
    r.bits_id,
    r.email,
    r.phone_call,
    r.phone_whatsapp || r.phone_call,
    r.submitted_at,
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ieee-bpdc-registrations-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});
```

Store the fetched registrations array in `window._adminData` so the export function can access it.

---

## `js/admin.js` — Full Structure

```javascript
// admin.js
// Runs only on admin.html

(function() {
  // ── Authentication ──────────────────────────────────────────
  const loginScreen = document.getElementById('login-screen');
  const dashboard   = document.getElementById('dashboard');

  function checkAuth() {
    if (sessionStorage.getItem('ieee_admin_auth') === 'true') {
      showDashboard();
    }
  }

  function showDashboard() {
    loginScreen.hidden = true;
    dashboard.hidden = false;
    loadDashboardData();
  }

  function logout() {
    sessionStorage.removeItem('ieee_admin_auth');
    location.reload();
  }

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('admin-password').value;
    if (val === CONFIG.ADMIN_PASSWORD) {
      sessionStorage.setItem('ieee_admin_auth', 'true');
      showDashboard();
    } else {
      document.getElementById('login-error').hidden = false;
      document.getElementById('admin-password').value = '';
    }
  });

  document.getElementById('logout-btn').addEventListener('click', logout);

  // ── Data Loading ─────────────────────────────────────────────
  async function loadDashboardData() {
    try {
      const [counts, registrations] = await Promise.all([
        Supabase.fetchCounts(),
        Supabase.fetchRegistrations(),
      ]);
      renderStats(counts);
      renderTable(registrations);
      window._adminData = registrations;
    } catch (err) {
      console.error('Dashboard load error:', err);
      document.getElementById('stats-error').hidden = false;
    }
  }

  document.getElementById('refresh-btn').addEventListener('click', loadDashboardData);

  // ── Stats Rendering ──────────────────────────────────────────
  function renderStats({ brochureScans, registrationScans, totalRegistrations }) {
    document.getElementById('count-brochure').textContent = brochureScans.toLocaleString();
    document.getElementById('count-registration').textContent = registrationScans.toLocaleString();
    document.getElementById('count-total').textContent = totalRegistrations.toLocaleString();
  }

  // ── Table Rendering ──────────────────────────────────────────
  function renderTable(registrations) {
    const container = document.getElementById('registrations-table-container');

    if (registrations.length === 0) {
      container.innerHTML = `<table class="data-table"><tbody><tr>
        <td colspan="7" class="table-empty">No registrations yet.</td>
      </tr></tbody></table>`;
      return;
    }

    const rows = registrations.map((r, i) => `
      <tr>
        <td class="row-number">${i + 1}</td>
        <td>${escapeHtml(r.full_name)}</td>
        <td>${escapeHtml(r.bits_id)}</td>
        <td>${escapeHtml(r.email)}</td>
        <td>${escapeHtml(r.phone_call)}</td>
        <td>${escapeHtml(r.phone_whatsapp || r.phone_call)}</td>
        <td>${formatTimestamp(r.submitted_at)}</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th><th>Full Name</th><th>BITS ID</th>
            <th>Email</th><th>Phone (Call)</th><th>WhatsApp</th><th>Submitted At</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  // ── Utilities ────────────────────────────────────────────────
  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str ?? '';
    return d.innerHTML;
  }

  function formatTimestamp(iso) {
    return new Intl.DateTimeFormat('en-AE', {
      dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Dubai'
    }).format(new Date(iso));
  }

  // ── CSV Export (see spec above) ──────────────────────────────
  document.getElementById('export-btn').addEventListener('click', () => { /* ... */ });

  // ── Init ─────────────────────────────────────────────────────
  checkAuth();
})();
```

---

## Security Notes

- The admin password is in plain JavaScript. Anyone who views source on `admin.html` can find it. This is acceptable for a one-day orientation tool with a small, trusted audience.
- The Supabase service role key is also in JavaScript. Same caveat — rotate after the event.
- The `<meta name="robots" content="noindex, nofollow">` tag on `admin.html` prevents search engine indexing.
- Do not link to `admin.html` from any public page. Distribute the URL verbally or via internal channels only.
- **After the event:** delete the Supabase project and revoke the Apps Script deployment.
