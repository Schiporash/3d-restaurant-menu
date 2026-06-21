import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AllergenBadge from "./AllergenBadge";

describe("AllergenBadge", () => {
  it("renders the label for the given allergen tag", () => {
    render(<AllergenBadge tag="vegan" />);
    expect(screen.getByTestId("allergen-badge")).toHaveTextContent("Vegan");
  });

  it("renders a different label for a different tag", () => {
    render(<AllergenBadge tag="gluten" />);
    expect(screen.getByTestId("allergen-badge")).toHaveTextContent("Gluten");
  });
});
