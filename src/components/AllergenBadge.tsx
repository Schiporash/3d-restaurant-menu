import { ALLERGEN_COLORS, ALLERGEN_LABELS } from "@/lib/allergens";
import type { AllergenTag } from "@/types/menu";

export default function AllergenBadge({ tag }: { tag: AllergenTag }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${ALLERGEN_COLORS[tag]}`}
      data-testid="allergen-badge"
    >
      {ALLERGEN_LABELS[tag]}
    </span>
  );
}
