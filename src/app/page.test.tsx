import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Landing from "@/components/landing/Landing";

// Keep WebGL out of jsdom — never actually mount a real canvas.
vi.mock("@react-three/fiber", () => ({
  Canvas: () => null,
  useFrame: () => {},
}));

describe("Landing", () => {
  it("renders the hero heading", () => {
    render(<Landing menuHref="/menu?table=1" tableId="1" />);
    expect(screen.getByRole("heading", { name: "3D Restaurant Menu" })).toBeInTheDocument();
  });

  it("links the CTA to the given menu href", () => {
    render(<Landing menuHref="/menu?table=5" tableId="5" />);
    expect(screen.getByRole("link", { name: "View Menu" })).toHaveAttribute(
      "href",
      "/menu?table=5"
    );
  });

  it("shows the table number in a shortcut link to the menu", () => {
    render(<Landing menuHref="/menu?table=5" tableId="5" />);
    const shortcut = screen.getByRole("link", { name: /Table 5/ });
    expect(shortcut).toHaveAttribute("href", "/menu?table=5");
  });
});
