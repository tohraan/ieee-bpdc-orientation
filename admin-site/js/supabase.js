// ============================================================
// supabase.js — IEEE BPDC Admin (standalone deployment)
// Read-only wrapper over the Supabase REST API, using the
// service-role key. Insert paths live on the public site.
// ============================================================

const Supabase = (() => {
  function serviceHeaders() {
    return {
      'apikey': CONFIG.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    };
  }



  async function fetchRegistrations() {
    const res = await fetch(
      `${CONFIG.SUPABASE_URL}/rest/v1/registrations?select=*&order=submitted_at.desc`,
      { headers: serviceHeaders() }
    );
    if (!res.ok) throw new Error('Failed to fetch registrations');
    return res.json();
  }

  // Supabase returns "0-24/87" in Content-Range with Prefer: count=exact.
  function parseCount(res) {
    return parseInt(res.headers.get('Content-Range')?.split('/')[1] || '0', 10) || 0;
  }

  async function fetchCounts() {
    const countHeaders = { ...serviceHeaders(), 'Prefer': 'count=exact' };
    const [brochureRes, regRes, totalRes] = await Promise.all([
      fetch(`${CONFIG.SUPABASE_URL}/rest/v1/page_scans?page=eq.brochure&select=id`, { headers: countHeaders }),
      fetch(`${CONFIG.SUPABASE_URL}/rest/v1/page_scans?page=eq.registration&select=id`, { headers: countHeaders }),
      fetch(`${CONFIG.SUPABASE_URL}/rest/v1/registrations?select=id`, { headers: countHeaders }),
    ]);

    if (!brochureRes.ok || !regRes.ok || !totalRes.ok) {
      throw new Error('Failed to fetch counts');
    }

    return {
      brochureScans: parseCount(brochureRes),
      registrationScans: parseCount(regRes),
      totalRegistrations: parseCount(totalRes),
    };
  }

  return { fetchRegistrations, fetchCounts };
})();
