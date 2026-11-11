import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { checkRateLimit, resetRateLimits } from "./rate-limit.ts";

describe("Rate Limiter", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests within the configured limit", () => {
    assert.strictEqual(checkRateLimit("user-1", 3, 60_000), true);
    assert.strictEqual(checkRateLimit("user-1", 3, 60_000), true);
    assert.strictEqual(checkRateLimit("user-1", 3, 60_000), true);
  });

  it("blocks requests exceeding the limit", () => {
    assert.strictEqual(checkRateLimit("user-2", 2, 60_000), true);
    assert.strictEqual(checkRateLimit("user-2", 2, 60_000), true);
    assert.strictEqual(checkRateLimit("user-2", 2, 60_000), false);
    assert.strictEqual(checkRateLimit("user-2", 2, 60_000), false);
  });

  it("isolates limits across different keys", () => {
    assert.strictEqual(checkRateLimit("ip-a", 1, 60_000), true);
    assert.strictEqual(checkRateLimit("ip-a", 1, 60_000), false);
    assert.strictEqual(checkRateLimit("ip-b", 1, 60_000), true);
  });

  it("resets limit after window expires", async () => {
    assert.strictEqual(checkRateLimit("temp-user", 1, 20), true);
    assert.strictEqual(checkRateLimit("temp-user", 1, 20), false);
    await new Promise((resolve) => setTimeout(resolve, 35));
    assert.strictEqual(checkRateLimit("temp-user", 1, 20), true);
  });
});
