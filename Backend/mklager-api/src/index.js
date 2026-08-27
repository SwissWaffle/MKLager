/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
const url = "https://ep-broad-hat-a2mbfm2b.apirest.eu-central-1.aws.neon.tech/neondb/rest/v1"
export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
    	const path = url.pathname;
    	const method = request.method;


		try{
			if(path === '/login' && method === 'GET'){
				return new Response(JSON.stringify("Login successful"), {
					status: 200,
					headers: {"Access-Control-Allow-Origin": "*"}
				});
			};

			if(path === '/data' && method === 'GET'){
				try{
					const response = await fetch(url+"/Lager",{method: 'GET', headers: {'Content-Type': 'application/json'}})
					
					return await response.json();
				}
				catch(error){
					return new Response(error.message, {status: 500});
				}
			}
		} catch (error) {
			return new Response(error.message, {status: 500});
		}
	}
	

}