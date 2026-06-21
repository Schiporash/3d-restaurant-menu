"use client";

import { useMemo, useState } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import DishCard from "@/components/DishCard";
import { filterDishes } from "@/lib/filterDishes";
import { mockDishes } from "@/data/mockMenu";
import { DISH_CATEGORIES } from "@/types/menu";

export default function MenuPage() {
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  const dishes = useMemo(() => filterDishes(mockDishes, category, search), [category, search]);

  return (
    <div className="flex flex-col gap-4">
      <input
        type="search"
        placeholder="Search dishes..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="w-full rounded-lg bg-[var(--color-surface)] px-4 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      />
      <CategoryFilter categories={DISH_CATEGORIES} active={category} onChange={setCategory} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
        {dishes.length === 0 && (
          <p className="col-span-full text-center text-sm text-white/60">No dishes match your search.</p>
        )}
      </div>
    </div>
  );
}
