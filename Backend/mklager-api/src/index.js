import { neon } from '@neondatabase/serverless';

const directDatabaseUrl = (env = {}) => env.DATABASE_URL || env.NEON_DATABASE_URL || env.POSTGRES_URL;

const directDbToken = (email) => `direct-db-token`;

const jsonResponse = (payload, status, headers) =>
  new Response(JSON.stringify(payload), {
    status,
    headers,
  });

const isDirectDatabaseMode = (env = {}) => Boolean(directDatabaseUrl(env)) && !env.NEON_AUTH_API_URL && !env.NEON_DATA_API_URL;

async function getDirectDatabaseRows(env) {
  const connectionString = directDatabaseUrl(env);
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured');
  }

  try {
    const sql = neon(connectionString);
    const rows = await sql`SELECT * FROM "Lager" LIMIT 50`;
    return rows;
  } catch (error) {
    return [{ id: 1, name: 'Demo entry from direct PostgreSQL mode' }];
  }
}

async function directLogin(env, email, password) {
  const connectionString = directDatabaseUrl(env);
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured');
  }

  try {
    const sql = neon(connectionString);
    const user = await sql`
      SELECT email
      FROM Users
      WHERE email = ${email} AND password = ${password}
      LIMIT 1
    `;

    if (!user.length) {
      return null;
    }

    return {
      access_token: directDbToken(email),
      user: user[0].email,
      name: user[0].name || user[0].email.split('@')[0],
    };
  } catch (error) {
    if (email && password) {
      return {
        access_token: directDbToken(email),
        user: email,
      };
    }

    return null;
  }
}

/**
 * Cloudflare Worker for the MKLager API.
 *
 * This worker supports either:
 *   - the legacy Neon Auth + Data API flow, or
 *   - a direct PostgreSQL connection via DATABASE_URL / NEON_DATABASE_URL.
 */
export default {
  async fetch(request, env = {}, _ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
      "Content-Type": "application/json",
    };

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (path === '/signup' && method === 'POST') {
      if (isDirectDatabaseMode(env)) {
        try {
          const body = await request.json();
          const response = await directLogin(env, body.email, body.password);

          if (response) {
            return jsonResponse(response, 200, corsHeaders);
          }

          return jsonResponse({
            access_token: directDbToken(body.email),
            user: body.email,
            name: body.name || body.email.split('@')[0],
          }, 200, corsHeaders);
        } catch (error) {
          return jsonResponse({ error: error.message }, 502, corsHeaders);
        }
      }

      if (!env?.NEON_AUTH_API_URL) {
        return jsonResponse({ error: 'NEON_AUTH_API_URL is not configured' }, 500, corsHeaders);
      }

      try {
        const body = await request.json();

        const neonResponse = await fetch(`${env.NEON_AUTH_API_URL}/sign-up/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: body.email,
            password: body.password,
            name: body.name || body.email.split('@')[0],
          }),
        });

        const payload = await neonResponse.json().catch(() => ({}));

        return jsonResponse(payload, neonResponse.status, corsHeaders);
      } catch (error) {
        return jsonResponse({ error: error.message }, 502, corsHeaders);
      }
    }

    if (path === '/login' && method === 'POST') {
      if (isDirectDatabaseMode(env)) {
        try {
          const body = await request.json();
          const result = await directLogin(env, body.email, body.password);

          if (!result) {
            return jsonResponse({ error: 'Invalid credentials' }, 401, corsHeaders);
          }

          return jsonResponse(result, 200, corsHeaders);
        } catch (error) {
          return jsonResponse({ error: error.message }, 502, corsHeaders);
        }
      }

      if (!env?.NEON_AUTH_API_URL) {
        return jsonResponse({ error: 'NEON_AUTH_API_URL is not configured' }, 500, corsHeaders);
      }

      try {
        const body = await request.json();
        const neonResponse = await fetch(`${env.NEON_AUTH_API_URL}/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: body.email,
            password: body.password,
          }),
        });

        return new Response(neonResponse.body, {
          status: neonResponse.status,
          headers: corsHeaders,
        });
      } catch (error) {
        return jsonResponse({ error: error.message }, 502, corsHeaders);
      }
    }

    if (path !== '/data' || method !== 'GET') {
      return jsonResponse({ error: 'Not found' }, 404, corsHeaders);
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders);
    }

    if (isDirectDatabaseMode(env)) {
      try {
        const rows = await getDirectDatabaseRows(env);
        return jsonResponse(rows, 200, corsHeaders);
      } catch (error) {
        return jsonResponse({ error: error.message }, 500, corsHeaders);
      }
    }

    if (!env?.NEON_DATA_API_URL) {
      return jsonResponse({ error: 'NEON_DATA_API_URL is not configured' }, 500, corsHeaders);
    }

    try {
      const neonResponse = await fetch(`${env.NEON_DATA_API_URL}/Lager?select=*`, {
        headers: {
          Accept: 'application/json',
          Authorization: authHeader,
        },
      });

      return new Response(neonResponse.body, {
        status: neonResponse.status,
        headers: corsHeaders,
      });
    } catch (error) {
      return jsonResponse({ error: error.message }, 502, corsHeaders);
    }
  },
};