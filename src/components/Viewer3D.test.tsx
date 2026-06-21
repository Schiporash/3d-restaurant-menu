import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Viewer3D from "./Viewer3D";
import type { Dish } from "@/types/menu";

vi.mock("@react-three/fiber", () => ({
  Canvas: () => null,
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
}));

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

describe("Viewer3D", () => {
  it("renders a viewer container tagged with the dish's model shape", () => {
    render(<Viewer3D dish={dish} />);
    const viewer = screen.getByTestId("viewer3d");
    expect(viewer).toHaveAttribute("data-shape", "torus");
  });

  it("updates the shape tag for a different dish", () => {
    render(<Viewer3D dish={{ ...dish, modelShape: "cone" }} />);
    expect(screen.getByTestId("viewer3d")).toHaveAttribute("data-shape", "cone");
  });
});
