/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { env } from "cloudflare:workers";
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


		try{
			if(path === '/login' && method === 'GET'){
				return new Response(JSON.stringify({message: "Login successful"}), {
					status: 200,
					headers: {"Access-Control-Allow-Origin": "*"}
				});
			};

			if(path === '/data' && method === 'GET'){
				return new Response(JSON.stringify({message: "Data retrieved successfully"}), {
					status: 200,
					headers: {"Access-Control-Allow-Origin": "*"}
				});
			};
		} catch (error) {
			return new Response(error.message, {status: 500});
		}
	}
}
