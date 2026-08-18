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
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
    	const path = url.pathname;
    	const method = request.method;


		try{
			if(path === '/api/login' && method === 'GET'){
				return response.json({message: "Login successful"});
			};
		} catch (error) {
			return new Response(error.message, {status: 500});
		}
	}

}
