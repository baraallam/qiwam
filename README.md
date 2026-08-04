# Qiwam

Qiwam is split into a Vite React client and an Express API server.

## Structure

```txt
client/
  src/
  vite.config.js

server/
  src/
    config/
    domain/
    middleware/
    routes/
    services/
    utils/
  prisma/
    schema.prisma

docs/
  database-map.md
```

## Development

```bash
npm install
npm run dev
```

The dev command starts:

- client: `http://localhost:5173`
- API: `http://localhost:3001`

The client proxies `/api/*` to the API server.

## Environment

Use `.env.example` as the template. Keep `.env` local only.

Backend-only values:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`

The browser should not receive database credentials.

For Supabase, use the pooler host shown in `.env.example`. Do not use
`db.qftylxsandewmivtohgg.supabase.co:5432` for local development, because that
direct host can resolve IPv6-only and Prisma may fail with:

```txt
Can't reach database server at db.qftylxsandewmivtohgg.supabase.co:5432
```

Use this shape instead:

```env
DATABASE_URL=postgresql://postgres.qftylxsandewmivtohgg:<password>@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
DIRECT_URL=postgresql://postgres.qftylxsandewmivtohgg:<password>@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

## Database

See `docs/database-map.md` for the current Supabase schema, app-to-database field mapping, and known mismatches.

Current auth model:

- users are stored in `public.profiles`
- passwords are bcrypt hashes in `profiles.password_hash`
- sessions are signed JWTs from the backend
- login accepts email or name

## Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

Migrations require a reachable Postgres connection. The direct Supabase host currently resolves IPv6-only in this environment, so use the Supabase pooler connection string for local migration work.
