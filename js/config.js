// ============================================================
// config.js — IEEE BPDC public site
// Loaded first on brochure.html and register.html.
//
// Public-safe values only. The service-role key and the admin
// password live in the separate admin deployment — never here.
// ============================================================

const CONFIG = {
  SUPABASE_URL: 'https://vkigdilczpwjbhsfnsbs.supabase.co',            // e.g. https://abcdefgh.supabase.co
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZraWdkaWxjenB3amJoc2Zuc2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NDgyMTgsImV4cCI6MjEwMzMyNDIxOH0.h74kyFE1ndmvx_hr78H3knW85UWqSNH7bSD_6GjfSl0',  // insert-only under RLS
  APPS_SCRIPT_URL: 'YOUR_APPS_SCRIPT_URL_HERE',      // Google Apps Script web app URL
};

// ── Shared nav: highlight the current page ──────────────────
(function () {
  function markActiveNav() {
    const page = (document.body.dataset.page || '').replace('registration', 'register');
    if (!page) return;

    document.querySelectorAll('.nav-item').forEach((item) => {
      if (item.dataset.page === page) item.classList.add('active');
    });

    document.querySelectorAll('.nav-links .nav-link').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href === `${page}.html`) link.classList.add('active');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markActiveNav);
  } else {
    markActiveNav();
  }
})();
