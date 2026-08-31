# MKLager
This repo contains a small inventory app with a Cloudflare Worker API and a simple frontend.

## Neon connection options

The app supports either:

- the legacy Neon Auth + Data API flow, or
- a direct PostgreSQL connection using `DATABASE_URL` without Neon Auth/Data API.

1. Configure the Worker environment variables:
   - `DATABASE_URL` for direct PostgreSQL access
   - optional: `NEON_AUTH_API_URL` and `NEON_DATA_API_URL` for the legacy flow

   Example values are already in `Backend/mklager-api/env.local`.

2. If you want to bypass Neon Auth/Data API entirely, set `DATABASE_URL` and leave the Neon Auth/Data API variables unset.

## Neon Auth login flow

The app uses Neon Auth for email/password sign-in and then sends the returned bearer token to the protected Data API route.

2. Start the API locally:
   - `cd Backend/mklager-api`
   - `npm install`
   - `npx wrangler dev --env-file env.local`

3. Log in from the frontend:
   - the browser posts email/password to `/login`
   - the response is expected to contain an access token such as `access_token`
   - the token is stored in `localStorage` under `neon_access_token`

4. Fetch protected data:
   - subsequent calls to `/data` include `Authorization: Bearer <token>`
   - the Worker forwards that token to the Neon Data API endpoint

Example request flow:

```bash
curl -X POST https://your-worker.example/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'

curl https://your-worker.example/data \
  -H "Authorization: Bearer <access_token>"
```

For production, prefer setting the values as Wrangler secrets instead of committing them to source control:

```bash
cd Backend/mklager-api
npx wrangler secret put NEON_AUTH_API_URL
npx wrangler secret put NEON_DATA_API_URL
```
