/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
const env = {
  	NEON_DATA_API_URL: "https://ep-broad-hat-a2mbfm2b.apirest.eu-central-1.aws.neon.tech/neondb/rest/v1",
  	NEON_AUTH_API_URL: "https://ep-broad-hat-a2mbfm2b.neonauth.eu-central-1.aws.neon.tech/neondb/auth",
	};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Content-Type": "application/json",
    };

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (path === '/login' && method === 'POST') {
      try {
        const neonResponse = await fetch(`${env.NEON_AUTH_API_URL}/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: await request.text(),
        });

        return new Response(neonResponse.body, {
          status: neonResponse.status,
          headers: corsHeaders,
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 502,
          headers: corsHeaders,
        });
      }
    }

    if (path !== '/data' || method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    if (!env?.NEON_DATA_API_URL) {
      return new Response(JSON.stringify({ error: 'NEON_DATA_API_URL is not configured' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    try {
      const neonResponse = await fetch(`${env.NEON_DATA_API_URL}/Lager?select=*`, {
        headers: {
          Accept: 'application/json',
          ...(request.headers.get('Authorization')
            ? { Authorization: request.headers.get('Authorization') }
            : {}),
        },
      });

      return new Response(neonResponse.body, {
        status: neonResponse.status,
        headers: corsHeaders,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 502,
        headers: corsHeaders,
      });
    }
  },
};