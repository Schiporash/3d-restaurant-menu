import Link from "next/link";
import AllergenBadge from "./AllergenBadge";
import type { Dish } from "@/types/menu";

export default function DishCard({ dish }: { dish: Dish }) {
  return (
    <Link
      href={`/dish/${dish.id}`}
      className="flex flex-col gap-2 rounded-xl bg-[var(--color-surface)] p-4 transition-transform hover:scale-[1.02]"
      data-testid="dish-card"
    >
      <div className="h-24 w-full rounded-lg" style={{ backgroundColor: dish.modelColor }} aria-hidden="true" />
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{dish.name}</h3>
        <span className="text-[var(--color-accent)]">${dish.price.toFixed(2)}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {dish.allergenTags.map((tag) => (
          <AllergenBadge key={tag} tag={tag} />
        ))}
      </div>
    </Link>
  );
}
