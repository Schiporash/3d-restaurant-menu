import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DishCardPreview from "./DishCardPreview";
import type { Dish } from "@/types/menu";

// Keep WebGL out of jsdom — never actually mount a real canvas.
vi.mock("@react-three/fiber", () => ({ Canvas: () => null }));
vi.mock("@react-three/drei", () => ({ OrbitControls: () => null }));

const dish: Dish = {
  id: "1",
  name: "Spaghetti Carbonara",
  description: "",
  price: 14.5,
  category: "Pasta",
  allergenTags: [],
  ingredients: [],
  modelShape: "torus",
  modelColor: "#e9c46a",
};

beforeEach(() => {
  // jsdom has no IntersectionObserver — stub one that never fires (cards stay as orbs).
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("IntersectionObserver", IO);
});

describe("DishCardPreview", () => {
  it("renders a gradient orb by default with the dish color baked into the gradient", () => {
    render(<DishCardPreview dish={dish} />);
    const orb = screen.getByTestId("dish-card-preview");
    expect(orb).toBeInTheDocument();
    expect(orb.style.backgroundImage).toContain("radial-gradient");
    expect(orb.style.backgroundImage).toContain("#e9c46a");
  });
});
