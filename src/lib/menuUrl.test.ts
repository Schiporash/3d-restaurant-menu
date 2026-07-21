import { describe, it, expect } from "vitest";
import { buildMenuUrl, resolveTableId } from "./menuUrl";

describe("resolveTableId", () => {
  it("defaults to table 1 when no table is given", () => {
    expect(resolveTableId(undefined)).toBe("1");
  });

  it("returns the provided table id", () => {
    expect(resolveTableId("7")).toBe("7");
  });

  it("uses the first value when given an array", () => {
    expect(resolveTableId(["3", "5"])).toBe("3");
  });

  it("falls back to table 1 for an empty string", () => {
    expect(resolveTableId("   ")).toBe("1");
  });
});

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
