// ============================================================
// sheets.js — IEEE BPDC Site
// Mirrors a registration into the Google Sheet via the
// Apps Script web app. Fire-and-forget: Supabase is the
// source of truth, so failures here are never fatal.
// ============================================================

async function mirrorToSheets(data) {
  try {
    await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      // Apps Script web apps do not send CORS headers, so the response
      // is opaque and unreadable. That is expected.
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: data.full_name,
        bits_id: data.bits_id,
        email: data.email,
        phone_call: data.phone_call,
        phone_whatsapp: data.phone_whatsapp || data.phone_call,
      }),
    });
  } catch (err) {
    console.warn('Google Sheets mirror failed:', err);
    // Non-fatal — do not rethrow.
  }
}
