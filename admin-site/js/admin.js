// ============================================================
// admin.js — IEEE BPDC Site
// Auth gate, dashboard data loading, table rendering, CSV export.
// Runs only on admin.html.
// ============================================================

(function () {
  const loginScreen = document.getElementById('login-screen');
  const dashboard   = document.getElementById('dashboard');
  if (!loginScreen || !dashboard) return;

  const AUTH_KEY = 'ieee_admin_auth';

  // ── Authentication ──────────────────────────────────────────
  function showDashboard() {
    loginScreen.hidden = true;
    dashboard.hidden = false;
    loadDashboardData();
  }

  function checkAuth() {
    if (sessionStorage.getItem(AUTH_KEY) === 'true') showDashboard();
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    location.reload();
  }

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('admin-password');
    if (input.value === CONFIG.ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      document.getElementById('login-error').hidden = true;
      showDashboard();
    } else {
      document.getElementById('login-error').hidden = false;
      input.value = '';
      input.focus();
    }
  });

  document.getElementById('logout-btn').addEventListener('click', logout);

  // ── Data loading ────────────────────────────────────────────
  async function loadDashboardData() {
    const statsError = document.getElementById('stats-error');
    statsError.hidden = true;

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
      ['count-brochure', 'count-registration', 'count-total'].forEach((id) => {
        document.getElementById(id).textContent = '!';
      });
      statsError.hidden = false;
    }
  }

  document.getElementById('refresh-btn').addEventListener('click', loadDashboardData);

  // ── Stats rendering ─────────────────────────────────────────
  function renderStats({ brochureScans, registrationScans, totalRegistrations }) {
    document.getElementById('count-brochure').textContent = brochureScans.toLocaleString();
    document.getElementById('count-registration').textContent = registrationScans.toLocaleString();
    document.getElementById('count-total').textContent = totalRegistrations.toLocaleString();
  }

  // ── Table rendering ─────────────────────────────────────────
  function renderTable(registrations) {
    const container = document.getElementById('registrations-table-container');

    if (!registrations.length) {
      container.innerHTML = `<table class="data-table"><tbody><tr>
        <td colspan="7" class="table-empty">No registrations yet. Check back after the orientation begins.</td>
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
        <td>${escapeHtml(formatTimestamp(r.submitted_at))}</td>
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

  // ── Utilities ───────────────────────────────────────────────
  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str ?? '';
    return d.innerHTML;
  }

  function formatTimestamp(iso) {
    if (!iso) return '';
    return new Intl.DateTimeFormat('en-AE', {
      dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Dubai',
    }).format(new Date(iso));
  }

  // ── CSV export ──────────────────────────────────────────────
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
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ieee-bpdc-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  // ── Init ────────────────────────────────────────────────────
  checkAuth();
})();
