# Render Backend Deployment

Use these settings to deploy the Medusa backend from this monorepo to Render.

## 1. Create Services

Create a Render PostgreSQL database first, in the same region as the backend web service. Use the database's internal connection URL for `DATABASE_URL` because Render-hosted services in the same region can connect over Render's private network.

Create a Node.js web service for the backend:

```text
Root Directory: .
Build Command: npm install && npm run build --workspace=@dtc/backend
Start Command: npm run start --workspace=@dtc/backend
```

The start command uses `apps/backend/package.json`, which runs `scripts/start-medusa.js`. That wrapper starts the compiled Medusa server from `apps/backend/.medusa/server`, binds to Render's `PORT`, and disables Medusa telemetry for production.

## 2. Environment Variables

Set these on the backend web service:

```text
NODE_VERSION=20
NODE_ENV=production
DATABASE_URL=<Render internal Postgres URL>
JWT_SECRET=<long random string>
COOKIE_SECRET=<long random string>
STORE_CORS=https://<your-storefront-domain>
ADMIN_CORS=https://<your-backend-domain>,https://<your-backend-domain>/app
AUTH_CORS=https://<your-backend-domain>,https://<your-backend-domain>/app,https://<your-storefront-domain>
MEDUSA_DISABLE_TELEMETRY=true
```

Optional but recommended for production:

```text
REDIS_URL=<Render Redis internal URL>
RAZORPAY_ID=<your Razorpay key id>
RAZORPAY_SECRET=<your Razorpay key secret>
RAZORPAY_ACCOUNT=<your Razorpay account id>
RAZORPAY_WEBHOOK_SECRET=<your Razorpay webhook secret>
```

Render sets `PORT` automatically. The backend start wrapper sets `HOST=0.0.0.0` if you do not provide one.

## 3. Migrations

On paid Render web services, set this as the Pre-deploy Command:

```text
cd apps/backend && npm exec medusa db:migrate
```

If your Render plan does not support pre-deploy commands, run the same command from a one-off shell before the first production start and after deployments that add migrations.

## 4. First Admin User

After the first successful deploy and migration, open a Render shell for the backend service and run:

```text
cd apps/backend && npm exec medusa user -e admin@example.com -p "replace-with-a-strong-password"
```

Then open:

```text
https://<your-backend-domain>/app
```

## 5. Storefront Connection

When the backend URL is final, set these on the storefront service:

```text
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://<your-backend-domain>
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<publishable key from Medusa Admin>
NEXT_PUBLIC_BASE_URL=https://<your-storefront-domain>
NEXT_PUBLIC_DEFAULT_REGION=in
```

For a Render storefront web service from this monorepo, use:

```text
Root Directory: .
Build Command: npm install && npm run build --workspace=@dtc/storefront
Start Command: npm run start --workspace=@dtc/storefront
```

## Notes

- Do not deploy files from `apps/backend/.medusa` directly. Render should build them with `npm run build --workspace=@dtc/backend`.
- After changing `STORE_CORS`, `ADMIN_CORS`, or `AUTH_CORS`, redeploy the backend.
- If you use Render Redis, replace the local event bus / in-memory locking warnings by configuring Redis-backed Medusa modules separately.
