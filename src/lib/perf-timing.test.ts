import { describe, it } from "node:test";
import assert from "node:assert";
import { PerformanceTracker } from "./perf-timing.ts";

describe("Performance Tracker & Server-Timing Utility", () => {
  it("tracks phase durations and formats valid Server-Timing header", async () => {
    const tracker = new PerformanceTracker();

    tracker.start("db_query");
    await new Promise((resolve) => setTimeout(resolve, 15));
    const dur = tracker.stop("db_query", "Database Read");

    assert.ok(dur >= 10);
    const header = tracker.formatServerTimingHeader();
    assert.ok(header.includes("db_query;dur="));
    assert.ok(header.includes('desc="Database Read"'));
  });

  it("returns 0 for untracked stop calls", () => {
    const tracker = new PerformanceTracker();
    const dur = tracker.stop("non_existent");
    assert.strictEqual(dur, 0);
    assert.strictEqual(tracker.formatServerTimingHeader(), "");
  });
});
