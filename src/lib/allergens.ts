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
  vegetarian: "bg-emerald-500/20 text-emerald-300",
  vegan: "bg-green-500/20 text-green-300",
  gluten: "bg-amber-500/20 text-amber-300",
  dairy: "bg-blue-500/20 text-blue-300",
  nuts: "bg-orange-500/20 text-orange-300",
  shellfish: "bg-pink-500/20 text-pink-300",
};
