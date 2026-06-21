import { describe, it, expect } from "vitest";
import { filterDishes } from "./filterDishes";
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
  {
    id: "2",
    name: "Grilled Ribeye Steak",
    description: "",
    price: 20,
    category: "Meat",
    allergenTags: [],
    ingredients: [],
    modelShape: "box",
    modelColor: "#fff",
  },
];

describe("filterDishes", () => {
  it("returns all dishes for category 'All' and empty search", () => {
    expect(filterDishes(dishes, "All", "")).toEqual(dishes);
  });

  it("filters by category", () => {
    expect(filterDishes(dishes, "Meat", "")).toEqual([dishes[1]]);
  });

  it("filters by case-insensitive name search", () => {
    expect(filterDishes(dishes, "All", "ribeye")).toEqual([dishes[1]]);
  });

  it("combines category and search filters", () => {
    expect(filterDishes(dishes, "Pasta", "ribeye")).toEqual([]);
  });
});
