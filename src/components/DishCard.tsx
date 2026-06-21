"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import AllergenBadge from "./AllergenBadge";
import DishCardPreview from "./DishCardPreview";
import { staggerItem } from "./motion/StaggerGrid";
import type { Dish } from "@/types/menu";

export default function DishCard({ dish }: { dish: Dish }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={staggerItem}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <Link
        href={`/dish/${dish.id}`}
        data-testid="dish-card"
        className="flex flex-col gap-3 rounded-2xl bg-[var(--color-surface)] p-4 ring-1 ring-[var(--color-accent)]/10 shadow-lg shadow-black/20 transition-shadow hover:shadow-xl hover:shadow-[var(--color-accent)]/10"
      >
        <DishCardPreview dish={dish} />
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-serif text-base font-semibold">{dish.name}</h3>
          <span className="font-serif text-[var(--color-accent)]">${dish.price.toFixed(2)}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {dish.allergenTags.map((tag) => (
            <AllergenBadge key={tag} tag={tag} />
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
