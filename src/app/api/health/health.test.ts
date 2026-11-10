import { describe, it } from "node:test";
import assert from "node:assert";
import { GET } from "./route.ts";

describe("Health Check API", () => {
  it("returns health check payload with required status fields", async () => {
    const response = await GET();
    assert.ok(response instanceof Response);
    assert.ok(response.status === 200 || response.status === 503);

    const body = await response.json();
    assert.ok(["ok", "degraded"].includes(body.status));
    assert.ok(typeof body.timestamp === "string");
    assert.ok(typeof body.uptimeSeconds === "number");
    assert.ok(typeof body.environment === "string");
    assert.ok(body.services && typeof body.services === "object");
    assert.ok(["connected", "disconnected"].includes(body.services.database.status));
  });
});
