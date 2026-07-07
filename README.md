# Wedding Invitation

A mobile-first wedding invitation website with RSVP collection, built with Next.js, TypeScript, Tailwind CSS.

## Features

- Fullscreen video hero, photo gallery, RSVP form, recommendations, dress code
- **RSVP backend with China-friendly architecture** — guests only call your domain (`/api/rsvp`), never Supabase or other blocked services from the browser
- Pluggable storage: Postgres, Supabase, SQLite (self-hosted), or demo mode
- Password-protected `/admin` page with CSV export
- Self-hosted fonts (no Google Fonts CDN)

## Quick Start

```bash
npm install
cp .env.example .env.local
# Configure RSVP storage (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## RSVP Backend

### How it works (important for China)

```
Guest browser  →  POST /api/rsvp  →  Your Next.js server  →  Database
     ↑ same domain only — no Supabase/Google from the browser
```

Mainland guests **do not** need access to Supabase. They only need to reach **your wedding website**. The server saves RSVPs using the configured storage driver.

### Storage options

Set `RSVP_STORAGE` in `.env.local`:

| Value | When to use |
|-------|-------------|
| `postgres` | **Recommended.** Any Postgres: Supabase direct URL, Neon, **Aliyun RDS**, HK/SG cloud |
| `supabase` | Supabase REST API (server-side service role only) |
| `sqlite` | Self-hosted VPS/Docker with persistent disk (`./data/rsvp.db`, Node 22+) |
| `auto` | Default — picks `DATABASE_URL` → Supabase → sqlite → demo |
| `demo` | Preview only — RSVPs stored in memory |

### Option A — Postgres (recommended for China guests)

1. Create Postgres in **Singapore / Hong Kong** (Supabase region `ap-southeast-1`, Aliyun RDS HK, Neon, etc.)
2. Copy the connection string to `DATABASE_URL`
3. Set `RSVP_STORAGE=postgres` (or `auto`)
4. Table is created automatically on first submit

Supabase direct URL: **Project Settings → Database → Connection string → URI**

### Option B — Supabase REST

1. Create project at [supabase.com](https://supabase.com) (choose **Singapore** region)
2. Run `supabase/schema.sql` in SQL Editor
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
4. Set `RSVP_STORAGE=supabase`

### Option C — SQLite (self-hosted VPS)

Best for a single **Hong Kong / Singapore VPS** with Docker:

```bash
RSVP_STORAGE=sqlite
SQLITE_PATH=rsvp.db
npm run build && npm run start
```

Database file: `./data/rsvp.db` (mount `./data` as a persistent volume in Docker).

### Health check

```bash
curl https://your-domain.com/api/rsvp/health
# → { "ok": true, "driver": "postgres", "guestAccess": "same-origin-api" }
```

### Admin

Set `ADMIN_PASSWORD` in `.env.local`. Admin panel: **`/admin`**

- View all RSVPs in a sortable table
- Search by name, flight, notes
- Filter attending / not attending
- Click **Edit** to update any field or delete a response
- Export CSV

## Deploying for mainland China guests

1. **Host the site** on a domain reachable from China:
   - Hong Kong / Singapore VPS (recommended)
   - Or Vercel + custom domain (may be slower; test from China)
2. **Database** in the same region (Postgres in SG/HK)
3. **Do not** call Supabase from client-side JavaScript (this project already avoids that)
4. Test RSVP from a mainland network or ask a guest to try `/api/rsvp/health`

## Customize content

Edit `src/lib/wedding.ts` and `src/lib/i18n/translations.ts`.

## Project Structure

```
src/
  app/api/rsvp/     # POST submit, GET health
  app/api/admin/    # Admin auth + list responses
  lib/rsvp/         # Storage adapters, validation, rate limit
supabase/
  schema.sql        # Supabase SQL (also mirrored in lib/rsvp/schema.sql)
data/               # SQLite file (gitignored)
```
