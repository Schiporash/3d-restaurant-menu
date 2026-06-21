import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DishCard from "./DishCard";
import type { Dish } from "@/types/menu";

const dish: Dish = {
  id: "1",
  name: "Spaghetti Carbonara",
  description: "Egg, pecorino, guanciale and black pepper.",
  price: 14.5,
  category: "Pasta",
  allergenTags: ["gluten", "dairy"],
  ingredients: [],
  modelShape: "torus",
  modelColor: "#e9c46a",
};

describe("DishCard", () => {
  it("renders the dish name, price and allergen badges", () => {
    render(<DishCard dish={dish} />);
    expect(screen.getByText("Spaghetti Carbonara")).toBeInTheDocument();
    expect(screen.getByText("$14.50")).toBeInTheDocument();
    expect(screen.getAllByTestId("allergen-badge")).toHaveLength(2);
  });

  it("links to the dish detail page", () => {
    render(<DishCard dish={dish} />);
    expect(screen.getByTestId("dish-card")).toHaveAttribute("href", "/dish/1");
  });
});
