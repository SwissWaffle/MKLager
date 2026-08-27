/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { env } from "cloudflare:env";
export default {
	async fetch(request, ctx) {
		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method;
		const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization, Content-Type",
			"Access-Control-Allow-Methods": "GET, OPTIONS",
		};

		if (method === "OPTIONS") {
			return new Response(null, { status: 204, headers: corsHeaders });
		}

		if (path === "/") {
			return new Response("Hello World!", { headers: corsHeaders });
		}

		if (path === "/login" && method === "GET") {
			return Response.json("Login successful", { headers: corsHeaders });
		}

		if (path === "/data" && method === "GET") {
			const dataApiBaseUrl = env.NEON_DATA_API_URL || env.VITE_NEON_DATA_API_URL;
			if (!dataApiBaseUrl) {
				return Response.json(
					{ error: "NEON_DATA_API_URL is not configured" },
					{ status: 500, headers: corsHeaders },
				);
			}

			const dataApiUrl = new URL("Lager", `${dataApiBaseUrl.replace(/\/$/, "")}/`);
			const authorization = request.headers.get("Authorization");
			const headers = new Headers({ Accept: "application/json" });
			if (authorization) {
				headers.set("Authorization", authorization);
			}

			const response = await fetch(dataApiUrl, { headers });
			const responseHeaders = new Headers(corsHeaders);
			responseHeaders.set(
				"Content-Type",
				response.headers.get("Content-Type") || "application/json",
			);

			return new Response(response.body, {
				status: response.status,
				headers: responseHeaders,
			});
		}

		return Response.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
	}
};