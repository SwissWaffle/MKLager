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

	it("proxies login requests to the Neon auth endpoint", async () => {
		const neonFetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ access_token: "abc" }), { status: 200 }),
		);
		const response = await worker.fetch(
			new Request("http://example.com/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: "user@example.com", password: "secret" }),
			}),
			{ NEON_AUTH_API_URL: "https://neon.example/auth", NEON_DATA_API_URL: "https://neon.example/rest/v1" },
			createExecutionContext(),
		);

		expect(response.status).toBe(200);
		expect(neonFetch).toHaveBeenCalledWith(
			"https://neon.example/auth/token",
			expect.objectContaining({
				method: "POST",
				headers: expect.objectContaining({ "Content-Type": "application/json" }),
			}),
		);
	});

	it("supports direct Neon PostgreSQL connections without Neon Auth or Data API", async () => {
		const response = await worker.fetch(
			new Request("http://example.com/data", {
				headers: { Authorization: "Bearer direct-db" },
			}),
			{ DATABASE_URL: "postgresql://user:pass@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require" },
			createExecutionContext(),
		);

		expect(response.status).toBe(200);
		const payload = await response.json();
		expect(Array.isArray(payload)).toBe(true);
		expect(payload[0]).toEqual(expect.objectContaining({ id: 1 }));
	});

	it("allows direct-database login when Neon Auth is not configured", async () => {
		const response = await worker.fetch(
			new Request("http://example.com/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: "user@example.com", password: "secret" }),
			}),
			{ DATABASE_URL: "postgresql://user:pass@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require" },
			createExecutionContext(),
		);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({
			access_token: "direct-db-token",
			user: "user@example.com",
		});
	});

	it("requires auth for the protected data route", async () => {
		const neonFetch = vi.spyOn(globalThis, "fetch");
		const response = await worker.fetch(
			new Request("http://example.com/data"),
			{ NEON_DATA_API_URL: "https://neon.example/rest/v1" },
			createExecutionContext(),
		);

		expect(response.status).toBe(401);
		expect(neonFetch).not.toHaveBeenCalled();
	});

	it("handles CORS preflight requests", async () => {
		const response = await worker.fetch(
			new Request("http://example.com/data", { method: "OPTIONS" }),
			{},
			createExecutionContext(),
		);

		expect(response.status).toBe(204);
		expect(response.headers.get("Access-Control-Allow-Methods")).toBe("GET, OPTIONS, POST");
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
