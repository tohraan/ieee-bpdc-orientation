# IEEE BPDC Orientation Site

Recruitment microsite for the **IEEE BPDC Student Chapter**, BITS Pilani Dubai Campus,
built for the 2026–27 orientation. Students scan a QR code, read the brochure, and
register; the committee reads submissions from a separate admin dashboard.

Vanilla HTML/CSS/JS — no framework, no npm, no build step. Open the files directly
or serve the folder.

## Deployments

| Site | URL | Source |
|------|-----|--------|
| Brochure + registration (public) | https://ieee-bpdc.vercel.app | repo root |
| Admin dashboard (private) | https://ieee-bpdc-admin.vercel.app | `admin-site/` |

The two are **separate Vercel projects on purpose**. The public bundle carries only the
Supabase anon key, which is insert-only under RLS. The service-role key and the admin
password exist solely in `admin-site/`, so nothing that reaches a student can read the
registrations table.

## Layout

```
brochure.html      Brochure recreation — the trifold, rebuilt panel by panel
register.html      Registration form
css/               tokens.css (all design tokens) · base.css · components.css
js/                config · supabase · sheets · analytics · form
assets/brand/      IEEE and BITS Pilani Dubai Campus marks
supabase/schema.sql  Tables, indexes and RLS policies
admin-site/        Standalone admin deployment (own config, own Vercel project)
```

The eight `.md` specification documents describe the intended design and are excluded
from both deployments via `.vercelignore`.

## Backend

Supabase project `ieee-bpdc` (ref `vkigdilczpwjbhsfnsbs`, ap-south-1). Two tables:

- `page_scans` — one row per page load, used as the QR scan counter
- `registrations` — submitted forms

RLS is on for both. `anon` may INSERT and nothing else; with no SELECT policy the anon
key cannot read either table. The admin dashboard reads with the service-role key.

Apply the schema with:

```sh
psql "$SUPABASE_DB_URL" -f supabase/schema.sql
```

## Deploying

Both Vercel projects are connected to this repository, so **pushing to `main`
deploys both**: `ieee-bpdc` builds from the repo root, `ieee-bpdc-admin` builds
from `admin-site/`. The root `.vercelignore` keeps `admin-site/` and the spec
documents out of the public deployment.

To deploy by hand instead:

```sh
npx vercel deploy --prod                     # public site, from the repo root
cd admin-site && npx vercel deploy --prod    # admin site
```

## Still to wire

`CONFIG.APPS_SCRIPT_URL` in `js/config.js` is a placeholder. The Google Sheets mirror
needs a sheet plus an Apps Script web app deployment (script in `BACKEND.md`).
Registrations save to Supabase regardless — Sheets is a secondary mirror.

## After the event

Per `BACKEND.md`: export both tables, revoke the Apps Script deployment, **rotate the
Supabase keys and the admin password** (they are committed to this private repo), and
take the deployments down.
