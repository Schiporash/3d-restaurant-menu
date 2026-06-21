import { describe, it, expect } from "vitest";
import { buildMenuUrl } from "./menuUrl";

describe("buildMenuUrl", () => {
  it("defaults to table 1 when no table is given", () => {
    expect(buildMenuUrl(undefined)).toBe("/menu?table=1");
  });

  it("uses the provided table id", () => {
    expect(buildMenuUrl("7")).toBe("/menu?table=7");
  });

  it("uses the first value when given an array", () => {
    expect(buildMenuUrl(["3", "5"])).toBe("/menu?table=3");
  });

  it("falls back to table 1 for an empty string", () => {
    expect(buildMenuUrl("")).toBe("/menu?table=1");
  });
});
