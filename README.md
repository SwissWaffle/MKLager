# MKLager

This repository contains an inventory app with an Express API deployed to Cloudflare Workers and a simple frontend.

## Run the API locally

From `Backend/mklager-api`, install dependencies and create a local `.dev.vars` file containing your Neon connection string:

```text
DATABASE_URL=postgresql://...
```

Then run the Worker locally:

```sh
npm install
npm run dev
```

Alternatively, run the Express app directly with Node.js. Put `DATABASE_URL` in a local `.env` file and run `node server.js`.

## Deploy to Cloudflare Workers

From `Backend/mklager-api`, authenticate with Wrangler and set the database URL as a Worker secret:

```sh
npx wrangler login
npx wrangler secret put DATABASE_URL
npm run deploy
```

The Express API routes are `/data`, `/data/month`, `/test`, and `/user/login`.
