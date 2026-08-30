/**
 * Cloudflare Worker for the MKLager API.
 *
 * This worker expects Neon bindings in the runtime environment, for example via
 * Wrangler or Cloudflare secrets:
 *   - NEON_DATA_API_URL
 *   - NEON_AUTH_API_URL
 *
 * It enforces authentication on the protected /data route and proxies the login
 * flow to the Neon Auth token endpoint.
 */


import { createClient } from "@neondatabase/neon-js";



export default {
  async fetch(request, data, _ctx) {
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

    if (path === '/login' && method === 'POST') {
      if (!env?.NEON_AUTH_API_URL) {
        return new Response(JSON.stringify({ error: 'NEON_AUTH_API_URL is not configured' }), {
          status: 500,
          headers: corsHeaders,
        });
      }

      try {
        const client = createClient({
          authUrl: process.env.NEON_AUTH_API_URL,
          dataUrl: process.env.NEON_DATA_API_URL,
        });
        const neonResponse = await fetch(client.auth.signIn.email({
          email: data.email,
          password: data.password,
          })
        );
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

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders,
      });
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
      return new Response(JSON.stringify({ error: error.message }), {
        status: 502,
        headers: corsHeaders,
      });
    }
  },
};