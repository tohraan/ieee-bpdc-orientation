// ============================================================
// supabase.js — IEEE BPDC public site
// Insert-only wrapper over the Supabase REST API, using the
// anon key under RLS. Admin reads live in the admin deployment.
// ============================================================

const Supabase = (() => {
  function anonHeaders() {
    return {
      'apikey': CONFIG.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
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
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Registration insert failed (${res.status}): ${text}`);
    }
  }

  // Analytics must never break the page — swallow everything.
  async function trackPageScan(page) {
    try {
      const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/page_scans`, {
        method: 'POST',
        headers: { ...anonHeaders(), 'Prefer': 'return=minimal' },
        body: JSON.stringify({ page }),
      });
      if (!res.ok) console.warn('Scan tracking failed:', res.status);
    } catch (e) {
      console.warn('Scan tracking error:', e);
    }
  }



  return { insertRegistration, trackPageScan };
})();
