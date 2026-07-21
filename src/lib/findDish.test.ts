import { describe, it, expect } from "vitest";
import { findDishById } from "./findDish";
import type { Dish } from "@/types/menu";

const dishes: Dish[] = [
  {
    id: "1",
    name: "Spaghetti Carbonara",
    description: "",
    price: 10,
    category: "Pasta",
    allergenTags: [],
    ingredients: [],
    modelShape: "torus",
    modelColor: "#fff",
  },
];

describe("findDishById", () => {
  it("returns the dish with a matching id", () => {
    expect(findDishById(dishes, "1")).toBe(dishes[0]);
  });

  it("returns undefined when no dish matches", () => {
    expect(findDishById(dishes, "999")).toBeUndefined();
  });
});
