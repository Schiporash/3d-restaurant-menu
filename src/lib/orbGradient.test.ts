import { describe, it, expect } from "vitest";
import { buildOrbGradient } from "./orbGradient";

describe("buildOrbGradient", () => {
  it("returns a radial-gradient string containing the base color", () => {
    const result = buildOrbGradient("#e9c46a");
    expect(result).toContain("radial-gradient");
    expect(result).toContain("#e9c46a");
  });

  it("produces a highlight lighter than the base and a shadow darker than the base", () => {
    // base #808080 -> highlight should be brighter, shadow darker
    const result = buildOrbGradient("#808080");
    expect(result).toContain("#b3b3b3"); // +0x33 per channel, clamped
    expect(result).toContain("#4d4d4d"); // -0x33 per channel, clamped
  });

  it("clamps channels at 0 and 255", () => {
    const result = buildOrbGradient("#ffffff");
    expect(result).toContain("#ffffff"); // highlight clamps to white
    expect(result).toContain("#cccccc"); // shadow = 255-0x33
  });
});
