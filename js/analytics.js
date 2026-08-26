// ============================================================
// analytics.js — IEEE BPDC Site
// Records a page load as a QR scan. Runs on brochure.html
// and register.html. Silent on failure by design.
// ============================================================

(function () {
  const pageName = document.body.dataset.page;
  // page_scans only accepts these two values (CHECK constraint).
  if (pageName !== 'brochure' && pageName !== 'registration') return;

  function track() {
    Supabase.trackPageScan(pageName);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', track);
  } else {
    track();
  }
})();
