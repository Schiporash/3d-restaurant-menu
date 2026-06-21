import type { Dish } from "@/types/menu";

export function findDishById(dishes: Dish[], id: string): Dish | undefined {
  return dishes.find((dish) => dish.id === id);
}
