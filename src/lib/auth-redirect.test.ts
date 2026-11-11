import { describe, it } from "node:test";
import assert from "node:assert";
import { getAuthRedirect, getSafeNextPath } from "./auth-redirect.ts";

describe("Auth Redirect Utilities", () => {
  describe("getSafeNextPath", () => {
    it("returns safe relative paths unchanged", () => {
      assert.strictEqual(getSafeNextPath("/pantry"), "/pantry");
      assert.strictEqual(getSafeNextPath("/plan?meal=lunch"), "/plan?meal=lunch");
    });

    it("falls back to default for null or empty values", () => {
      assert.strictEqual(getSafeNextPath(null), "/home");
      assert.strictEqual(getSafeNextPath(""), "/home");
      assert.strictEqual(getSafeNextPath(null, "/onboarding"), "/onboarding");
    });

    it("prevents open redirects via protocol-relative or external URLs", () => {
      assert.strictEqual(getSafeNextPath("//evil.com"), "/home");
      assert.strictEqual(getSafeNextPath("https://evil.com/phish"), "/home");
      assert.strictEqual(getSafeNextPath("http://localhost:9000"), "/home");
      assert.strictEqual(getSafeNextPath("javascript:alert(1)"), "/home");
    });
  });

  describe("getAuthRedirect", () => {
    it("constructs server-side redirect URL from NEXT_PUBLIC_APP_URL", () => {
      const prev = process.env.NEXT_PUBLIC_APP_URL;
      process.env.NEXT_PUBLIC_APP_URL = "https://nutriflow.example.com";
      try {
        assert.strictEqual(
          getAuthRedirect("/auth/callback?next=/home"),
          "https://nutriflow.example.com/auth/callback?next=/home"
        );
      } finally {
        if (prev === undefined) {
          delete process.env.NEXT_PUBLIC_APP_URL;
        } else {
          process.env.NEXT_PUBLIC_APP_URL = prev;
        }
      }
    });

    it("throws when NEXT_PUBLIC_APP_URL is missing on server", () => {
      const prev = process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.NEXT_PUBLIC_APP_URL;
      try {
        assert.throws(() => getAuthRedirect("/auth/callback"), {
          message: "NEXT_PUBLIC_APP_URL is required for server-side auth redirects",
        });
      } finally {
        if (prev !== undefined) {
          process.env.NEXT_PUBLIC_APP_URL = prev;
        }
      }
    });
  });
});
