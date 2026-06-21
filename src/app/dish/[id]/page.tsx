import { notFound } from "next/navigation";
import Link from "next/link";
import Viewer3D from "@/components/Viewer3D";
import AllergenBadge from "@/components/AllergenBadge";
import { findDishById } from "@/lib/findDish";
import { mockDishes } from "@/data/mockMenu";

export default async function DishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dish = findDishById(mockDishes, id);

  if (!dish) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Link href="/menu" className="text-sm text-[var(--color-accent)]">
        ← Back to menu
      </Link>
      <Viewer3D dish={dish} />
      <div>
        <h1 className="text-xl font-semibold">{dish.name}</h1>
        <p className="mt-1 text-sm text-white/70">{dish.description}</p>
        <p className="mt-2 text-lg text-[var(--color-accent)]">${dish.price.toFixed(2)}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {dish.allergenTags.map((tag) => (
          <AllergenBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
