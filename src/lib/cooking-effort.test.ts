import { describe, it } from "node:test";
import assert from "node:assert";
import { computeEffortScore } from "./cooking-effort.ts";

describe("Cooking Effort Utility", () => {
  it("rates quick simple meals with LOW effort tier", () => {
    // 15 min, 3 steps, 4 ingredients, one pot
    const effort = computeEffortScore({
      totalTimeMinutes: 15,
      stepCount: 3,
      ingredientCount: 4,
      isOnePot: true,
    });
    assert.strictEqual(effort.tier, "LOW");
    assert.strictEqual(effort.isQuick, true);
    assert.strictEqual(effort.isBeginnerFriendly, true);
  });

  it("rates complex multi-step meals with HIGH effort tier", () => {
    // 60 min, 8 steps, 12 ingredients
    const effort = computeEffortScore({
      totalTimeMinutes: 60,
      stepCount: 8,
      ingredientCount: 12,
    });
    assert.strictEqual(effort.tier, "HIGH");
    assert.strictEqual(effort.isQuick, false);
    assert.strictEqual(effort.isBeginnerFriendly, false);
  });

  it("applies one-pot cleanup discount", () => {
    const multiPot = computeEffortScore({ totalTimeMinutes: 30, stepCount: 5, ingredientCount: 7, isOnePot: false });
    const onePot = computeEffortScore({ totalTimeMinutes: 30, stepCount: 5, ingredientCount: 7, isOnePot: true });
    assert.strictEqual(onePot.score, multiPot.score - 1);
  });
});
