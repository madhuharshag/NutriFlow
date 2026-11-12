import { describe, it } from "node:test";
import assert from "node:assert";
import { calculateDailyWaterMl, mlToGlasses } from "./water-intake.ts";

describe("Water Intake Recommendation Utility", () => {
  it("calculates baseline intake based on body weight", () => {
    // 60 kg * 35 ml = 2100 ml
    const ml = calculateDailyWaterMl({ weightKg: 60 });
    assert.strictEqual(ml, 2100);
  });

  it("adds water for daily exercise activity", () => {
    // 60 kg baseline = 2100 ml + 60 mins activity (700 ml) = 2800 ml
    const ml = calculateDailyWaterMl({ weightKg: 60, activityMinutesPerDay: 60 });
    assert.strictEqual(ml, 2800);
  });

  it("applies climate factor for hot/tropical environments", () => {
    // 60 kg baseline = 2100 * 1.15 = 2415 -> rounded to 2400 ml
    const ml = calculateDailyWaterMl({ weightKg: 60, isHotClimate: true });
    assert.strictEqual(ml, 2400);
  });

  it("converts ml to glass counts accurately", () => {
    assert.strictEqual(mlToGlasses(2000, 250), 8);
    assert.strictEqual(mlToGlasses(2500, 250), 10);
  });

  it("throws on invalid non-positive weights", () => {
    assert.throws(() => calculateDailyWaterMl({ weightKg: 0 }));
  });
});
