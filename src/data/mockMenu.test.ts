import { describe, it, expect } from "vitest";
import { mockDishes } from "./mockMenu";
import { ALLERGEN_TAGS, DISH_CATEGORIES } from "@/types/menu";

describe("mockDishes", () => {
  it("has at least one dish per category", () => {
    for (const category of DISH_CATEGORIES) {
      expect(mockDishes.some((dish) => dish.category === category)).toBe(true);
    }
  });

  it("has unique ids", () => {
    const ids = mockDishes.map((dish) => dish.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only uses known allergen tags", () => {
    for (const dish of mockDishes) {
      for (const tag of dish.allergenTags) {
        expect(ALLERGEN_TAGS).toContain(tag);
      }
    }
  });

  it("has positive prices", () => {
    for (const dish of mockDishes) {
      expect(dish.price).toBeGreaterThan(0);
    }
  });
});
