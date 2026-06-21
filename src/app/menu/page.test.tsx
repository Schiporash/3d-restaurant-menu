import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuPage from "./page";

describe("MenuPage", () => {
  it("renders all mock dishes by default", () => {
    render(<MenuPage />);
    expect(screen.getAllByTestId("dish-card").length).toBeGreaterThanOrEqual(10);
  });

  it("filters dishes by category", async () => {
    render(<MenuPage />);
    await userEvent.click(screen.getByRole("tab", { name: "Drinks" }));
    const cards = screen.getAllByTestId("dish-card");
    expect(cards).toHaveLength(2);
    expect(screen.getByText("Fresh Orange Juice")).toBeInTheDocument();
    expect(screen.getByText("Iced Latte")).toBeInTheDocument();
  });

  it("filters dishes by search term", async () => {
    render(<MenuPage />);
    await userEvent.type(screen.getByPlaceholderText("Search dishes..."), "tiramisu");
    expect(screen.getAllByTestId("dish-card")).toHaveLength(1);
    expect(screen.getByText("Tiramisu")).toBeInTheDocument();
  });

  it("shows a message when no dish matches", async () => {
    render(<MenuPage />);
    await userEvent.type(screen.getByPlaceholderText("Search dishes..."), "nonexistent");
    expect(screen.getByText("No dishes match your search.")).toBeInTheDocument();
  });
});
