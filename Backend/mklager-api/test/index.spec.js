import { createExecutionContext } from "cloudflare:test";
import { afterEach, describe, it, expect, vi } from "vitest";
import worker from "../src";

describe("Neon data API worker", () => {
	afterEach(() => vi.restoreAllMocks());

	it("returns Lager data from Neon", async () => {
		const neonFetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify([{ id: 1 }]), { status: 200 }),
		);
		const response = await worker.fetch(
			new Request("http://example.com/data", {
				headers: { Authorization: "Bearer test-token" },
			}),
			{ NEON_DATA_API_URL: "https://neon.example/rest/v1" },
			createExecutionContext(),
		);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual([{ id: 1 }]);
		expect(neonFetch).toHaveBeenCalledWith(
			"https://neon.example/rest/v1/Lager?select=*",
			expect.objectContaining({
				headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
			}),
		);
	});

	it("handles CORS preflight requests", async () => {
		const response = await worker.fetch(
			new Request("http://example.com/data", { method: "OPTIONS" }),
			{},
			createExecutionContext(),
		);

		expect(response.status).toBe(204);
		expect(response.headers.get("Access-Control-Allow-Methods")).toBe("GET, OPTIONS");
	});

	it("rejects unknown routes", async () => {
		const response = await worker.fetch(
			new Request("http://example.com/unknown"),
			{},
			createExecutionContext(),
		);

		expect(response.status).toBe(404);
	});
});
