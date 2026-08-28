/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export default {
	async fetch(request, env) {
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

			const body = await neonResponse.text();
			return new Response(body, {
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
};
