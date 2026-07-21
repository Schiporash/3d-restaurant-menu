import { notFound } from "next/navigation";
import Link from "next/link";
import Viewer3D from "@/components/Viewer3D";
import AllergenBadge from "@/components/AllergenBadge";
import FadeIn from "@/components/motion/FadeIn";
import { findDishById } from "@/lib/findDish";
import { mockDishes } from "@/data/mockMenu";

export default async function DishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dish = findDishById(mockDishes, id);

  if (!dish) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5">
      <Link
        href="/menu"
        className="text-sm text-[var(--color-accent)] transition-opacity hover:opacity-80"
      >
        ← Back to menu
      </Link>
      <FadeIn>
        <Viewer3D dish={dish} />
      </FadeIn>
      <FadeIn delay={0.1}>
        <div>
          <h1 className="font-serif text-2xl font-semibold">{dish.name}</h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
            {dish.description}
          </p>
          <p className="mt-3 font-serif text-xl text-[var(--color-accent)]">
            ${dish.price.toFixed(2)}
          </p>
        </div>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div className="flex flex-wrap gap-1.5">
          {dish.allergenTags.map((tag) => (
            <AllergenBadge key={tag} tag={tag} />
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
