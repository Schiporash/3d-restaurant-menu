import type { AllergenTag } from "@/types/menu";

export const ALLERGEN_LABELS: Record<AllergenTag, string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  gluten: "Gluten",
  dairy: "Dairy",
  nuts: "Nuts",
  shellfish: "Shellfish",
};

export const ALLERGEN_COLORS: Record<AllergenTag, string> = {
  vegetarian: "bg-[#7d8b6a]/20 text-[#b9c4a3]",
  vegan: "bg-[#6f8f5a]/20 text-[#aecb92]",
  gluten: "bg-[#e0a458]/20 text-[#f0c98a]",
  dairy: "bg-[#caa472]/20 text-[#e6c89c]",
  nuts: "bg-[#b5703a]/25 text-[#e0a877]",
  shellfish: "bg-[#c77b62]/25 text-[#e6a892]",
};
