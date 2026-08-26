-- ============================================================
-- IEEE BPDC Orientation Site — schema (per BACKEND.md)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.page_scans (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  page        text        NOT NULL CHECK (page IN ('brochure', 'registration')),
  scanned_at  timestamptz DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_page_scans_page ON public.page_scans (page);

CREATE TABLE IF NOT EXISTS public.registrations (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name       text        NOT NULL,
  bits_id         text        NOT NULL,
  email           text        NOT NULL,
  phone_call      text        NOT NULL,
  phone_whatsapp  text,
  submitted_at    timestamptz DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_registrations_submitted ON public.registrations (submitted_at DESC);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE public.page_scans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- anon may INSERT only. No SELECT policy exists, so the anon key
-- cannot read either table; the admin site reads with the service key.
DROP POLICY IF EXISTS "Allow anon insert on page_scans" ON public.page_scans;
CREATE POLICY "Allow anon insert on page_scans"
  ON public.page_scans FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert on registrations" ON public.registrations;
CREATE POLICY "Allow anon insert on registrations"
  ON public.registrations FOR INSERT TO anon WITH CHECK (true);
