import { describe, it } from "node:test";
import assert from "node:assert";
import { GET } from "./route.ts";

describe("Readiness Check API", () => {
  it("returns ready status response structure", async () => {
    const res = await GET();
    assert.ok(res instanceof Response);
    assert.ok(res.status === 200 || res.status === 503);

    const body = await res.json();
    assert.ok(["ready", "not_ready"].includes(body.status));
    assert.ok(["connected", "disconnected"].includes(body.database));
    assert.ok(typeof body.timestamp === "string");
  });
});
