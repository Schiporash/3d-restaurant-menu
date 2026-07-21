import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryFilter from "./CategoryFilter";

describe("CategoryFilter", () => {
  it("renders 'All' plus each category", () => {
    render(<CategoryFilter categories={["Pasta", "Meat"]} active="All" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Pasta" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Meat" })).toBeInTheDocument();
  });

  it("marks the active category as selected", () => {
    render(<CategoryFilter categories={["Pasta", "Meat"]} active="Meat" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "Meat" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Pasta" })).toHaveAttribute("aria-selected", "false");
  });

  it("calls onChange with the clicked category", async () => {
    const onChange = vi.fn();
    render(<CategoryFilter categories={["Pasta", "Meat"]} active="All" onChange={onChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Pasta" }));
    expect(onChange).toHaveBeenCalledWith("Pasta");
  });
});
