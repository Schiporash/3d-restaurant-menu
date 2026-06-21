function clamp(value: number): number {
  return Math.max(0, Math.min(255, value));
}

function shift(hex: string, amount: number): string {
  const normalized = hex.replace("#", "");
  const r = clamp(parseInt(normalized.slice(0, 2), 16) + amount);
  const g = clamp(parseInt(normalized.slice(2, 4), 16) + amount);
  const b = clamp(parseInt(normalized.slice(4, 6), 16) + amount);
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

/**
 * Build a soft 3D-looking radial gradient from a single dish color:
 * a lighter highlight in the upper-left, the base color in the middle,
 * and a darker shadow toward the edge.
 */
export function buildOrbGradient(color: string): string {
  const highlight = shift(color, 0x33);
  const shadow = shift(color, -0x33);
  return `radial-gradient(circle at 35% 30%, ${highlight} 0%, ${color} 45%, ${shadow} 100%)`;
}
