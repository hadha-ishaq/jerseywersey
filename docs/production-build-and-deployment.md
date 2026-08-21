# Production Build and Deployment Guide

This project deploys best as three separate services:

- Supabase: PostgreSQL database
- Render: Medusa backend and Admin
- Vercel: Next.js storefront

## What Was Failing

### Render Backend Build

Render failed with:

```text
Cannot find module '/opt/render/project/src/apps/backend/medusa-config'
```

The backend config existed as `medusa-config.ts`, but Render's Linux build resolved `medusa-config` through Node's plain CommonJS resolution path. The repo now includes `apps/backend/medusa-config.js`, and `medusa-config.ts` is only a compatibility shim.

### Vercel Storefront Build

Vercel failed with:

```text
Failed to collect page data for /[countryCode]/categories/[...category]
```

The storefront was prebuilding catalog pages during `next build` by fetching categories, collections, products, and regions from Medusa. That is fragile when Vercel builds before the Render backend is deployed, awake, migrated, seeded, or reachable through CORS/publishable-key settings.

Catalog prebuilds are now disabled by default. The app renders catalog pages dynamically unless you set:

```text
NEXT_PUBLIC_BUILD_STATIC_CATALOG_PAGES=true
```

Leave that unset on Vercel until the backend is stable and seeded.

### Supabase / Production DB Connections

If you see:

```text
code 53300
Knex: Timeout acquiring a connection
```

Postgres is refusing more connections. The backend now supports small production pool settings:

```text
DATABASE_POOL_MIN=0
DATABASE_POOL_MAX=3
```

Use Supabase's Session Pooler connection string on Render if the direct connection is not reachable or connection limits are tight.

## Local Production Check

From the repo root:

```bash
npm install
npm run backend:build
npm run storefront:build
```

Start the backend production build:

```bash
cd apps/backend
PORT=9000 npm run start
```

Start the storefront production build:

```bash
cd apps/storefront
PORT=8000 npm run start
```

On Windows PowerShell:

```powershell
cd apps/backend
$env:PORT="9000"; npm run start
```

```powershell
cd apps/storefront
$env:PORT="8000"; npm run start
```

## 1. Supabase PostgreSQL

Create a Supabase project and copy a Postgres connection string.

For Render backend runtime, prefer this order:

1. Direct connection, if Render can reach it.
2. Supabase Session Pooler, if direct connection fails or your Supabase project is IPv6-only.
3. Transaction Pooler only if you know your database client works without prepared statements.

Set the chosen string as Render's `DATABASE_URL`.

Recommended Supabase-related backend env:

```text
DATABASE_URL=<supabase postgres or session-pooler url>
DATABASE_SSL=true
DATABASE_POOL_MIN=0
DATABASE_POOL_MAX=3
DATABASE_POOL_IDLE_TIMEOUT_MS=10000
```

## 2. Render Backend

Create a Render Web Service.

Use:

```text
Root Directory: .
Runtime: Node
Build Command: npm ci --include=dev && npm run backend:build
Start Command: npm run backend:start
Health Check Path: /health
```

Set:

```text
NODE_VERSION=20.20.2
NODE_ENV=production
NPM_CONFIG_INCLUDE=dev
MEDUSA_DISABLE_TELEMETRY=true
DATABASE_URL=<supabase connection string>
DATABASE_SSL=true
DATABASE_POOL_MIN=0
DATABASE_POOL_MAX=3
DATABASE_POOL_IDLE_TIMEOUT_MS=10000
JWT_SECRET=<long random secret>
COOKIE_SECRET=<long random secret>
STORE_CORS=https://<your-vercel-storefront-domain>
ADMIN_CORS=https://<your-render-backend-domain>
AUTH_CORS=https://<your-render-backend-domain>,https://<your-vercel-storefront-domain>
```

Payment envs, if Razorpay is enabled:

```text
RAZORPAY_ID=<key id>
RAZORPAY_SECRET=<key secret>
RAZORPAY_ACCOUNT=<account id>
RAZORPAY_WEBHOOK_SECRET=<webhook secret>
```

### Migrations

If your Render plan supports pre-deploy commands, use:

```text
npm run backend:migrate
```

Otherwise, open a Render Shell after the first successful build and run:

```bash
cd apps/backend
npm run db:migrate
```

### First Admin User

After migrations:

```bash
cd apps/backend
npm run admin:user -- -e admin@example.com -p "replace-with-a-strong-password"
```

Admin URL:

```text
https://<your-render-backend-domain>/app
```

## 3. Vercel Storefront

Create a Vercel project from the same GitHub repo.

Recommended settings:

```text
Framework Preset: Next.js
Root Directory: apps/storefront
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

Set these Vercel environment variables for Production and Preview:

```text
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://<your-render-backend-domain>
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<publishable key from Medusa Admin>
NEXT_PUBLIC_BASE_URL=https://<your-vercel-storefront-domain>
NEXT_PUBLIC_DEFAULT_REGION=in
NEXT_PUBLIC_BUILD_STATIC_CATALOG_PAGES=false
```

Optional payment envs:

```text
NEXT_PUBLIC_RAZORPAY_KEY_ID=<razorpay key id>
NEXT_PUBLIC_STRIPE_KEY=<stripe publishable key>
NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY=<medusa payments publishable key>
NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID=<medusa payments account id>
```

After changing any `NEXT_PUBLIC_*` variable, redeploy the storefront. Next.js inlines these values at build time.

## Deployment Order

1. Create Supabase database.
2. Deploy Render backend with `DATABASE_URL`, secrets, and CORS envs.
3. Run migrations on Render.
4. Create an admin user.
5. Open Medusa Admin and create/copy the publishable API key.
6. Deploy Vercel storefront with the backend URL and publishable key.
7. Update Render `STORE_CORS` and `AUTH_CORS` if the final Vercel domain changed.
8. Redeploy backend after CORS changes.

## Troubleshooting

### `Cannot find module .../medusa-config`

Make sure `apps/backend/medusa-config.js` is committed and Render's build command is:

```text
npm ci --include=dev && npm run backend:build
```

### `http.jwtSecret not found`

Set both:

```text
JWT_SECRET=<long random secret>
COOKIE_SECRET=<long random secret>
```

### `Could not find index.html in the admin build directory`

Use the provided start command:

```text
npm run backend:start
```

Do not start production Medusa directly from `apps/backend` with `medusa start` after build; the wrapper starts from `.medusa/server` when that production bundle exists.

### Vercel `Failed to collect page data`

Keep this unset or false:

```text
NEXT_PUBLIC_BUILD_STATIC_CATALOG_PAGES=false
```

Then redeploy. Only set it to `true` after the backend is deployed, migrated, seeded, reachable from Vercel, and has stable catalog data.

### Supabase `53300` / too many connections

Use:

```text
DATABASE_POOL_MIN=0
DATABASE_POOL_MAX=3
```

If it still happens, switch `DATABASE_URL` to Supabase's Session Pooler connection string and restart the Render service.

### Storefront redirects to the wrong country

Set:

```text
NEXT_PUBLIC_DEFAULT_REGION=in
```

Make sure the `in` region exists in Medusa Admin and has countries assigned.

## References

- Render web services: https://render.com/docs/web-services
- Render deploy commands and pre-deploy commands: https://render.com/docs/deploys
- Render Node version pinning: https://render.com/docs/node-version
- Vercel monorepos: https://vercel.com/docs/monorepos
- Vercel build settings: https://vercel.com/docs/builds/configure-a-build
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Supabase Postgres connection strings and poolers: https://supabase.com/docs/guides/database/connecting-to-postgres
- Medusa application configuration: https://docs.medusajs.com/learn/configurations/medusa-config
