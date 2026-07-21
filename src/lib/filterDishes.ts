import type { Dish } from "@/types/menu";

export function filterDishes(dishes: Dish[], category: string, search: string): Dish[] {
  const term = search.trim().toLowerCase();

  return dishes.filter((dish) => {
    const matchesCategory = category === "All" || dish.category === category;
    const matchesSearch = term === "" || dish.name.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });
}
