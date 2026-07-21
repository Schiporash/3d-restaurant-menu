export const ALLERGEN_TAGS = [
  "vegetarian",
  "vegan",
  "gluten",
  "dairy",
  "nuts",
  "shellfish",
] as const;

export type AllergenTag = (typeof ALLERGEN_TAGS)[number];

export const DISH_CATEGORIES = ["Pasta", "Meat", "Salads", "Desserts", "Drinks"] as const;

export type DishCategory = (typeof DISH_CATEGORIES)[number];

export const MODEL_SHAPES = ["sphere", "box", "torus", "cone", "cylinder"] as const;

export type ModelShape = (typeof MODEL_SHAPES)[number];

export interface Ingredient {
  id: string;
  name: string;
  removable: boolean;
  allergenTags: AllergenTag[];
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: DishCategory;
  allergenTags: AllergenTag[];
  ingredients: Ingredient[];
  modelShape: ModelShape;
  modelColor: string;
}
