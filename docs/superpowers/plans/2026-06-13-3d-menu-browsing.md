# 3D Menu Browsing (Frontend v1, Mock Data) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a Next.js app where a customer can browse a dish grid, filter by category, search, and open a dish to see it as a placeholder 3D model with allergen info — all backed by in-memory mock data (no backend yet).

**Architecture:** Next.js 15 App Router + TypeScript + Tailwind CSS v4 for the dark/amber UI, React Three Fiber + drei for the 3D viewer (procedural placeholder geometry mapped from each dish's `modelShape`, standing in for real `.glb` files until those exist). Vitest + React Testing Library for component/unit tests.

**Tech Stack:** Next.js 15, React 18, TypeScript, Tailwind CSS v4, @react-three/fiber v8, @react-three/drei v9, three.js, Vitest, @testing-library/react.

**Out of scope for this plan:** OrderContext/cart, OrderDrawer, CustomizerPanel, `/order`, `/confirmation`, real `.glb` loading, AR. These land in a follow-up "Cart & Ordering Flow" plan.

---

## Task 1: Project Scaffold & Tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `.gitignore`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "3d-restaurant-menu",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "three": "^0.169.0",
    "@react-three/fiber": "^8.17.10",
    "@react-three/drei": "^9.117.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.10.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.169.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.49",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.3.0",
    "@eslint/eslintrc": "^3.2.0",
    "vitest": "^2.1.8",
    "@vitejs/plugin-react": "^4.3.4",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.5.2",
    "jsdom": "^25.0.1"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json` and `next-env.d.ts`**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 3: Create `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`**

`next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

`postcss.config.mjs`:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

`eslint.config.mjs`:

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript")];

export default eslintConfig;
```

`.gitignore`:

```
node_modules
.next
out
*.local
.env*.local
```

- [ ] **Step 4: Create `vitest.config.ts` and `vitest.setup.ts`**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

`vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Create `src/app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg: #0d1b2a;
  --color-surface: #14253b;
  --color-accent: #f4a261;
  --color-text: #e8e6e3;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

- [ ] **Step 6: Create `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Restaurant Menu",
  description: "Browse dishes in interactive 3D and place your order from the table.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <header className="border-b border-white/10 px-4 py-3">
          <span className="text-lg font-semibold tracking-wide text-[var(--color-accent)]">
            3D Restaurant Menu
          </span>
        </header>
        <main className="px-4 py-4">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Create placeholder `src/app/page.tsx`**

This is a temporary placeholder so the app builds. Task 9 replaces it with the real QR-landing redirect.

```tsx
export default function HomePage() {
  return <p className="text-sm text-white/60">Coming soon.</p>;
}
```

- [ ] **Step 8: Install dependencies**

Run: `npm install`
Expected: completes without errors, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 9: Verify the build**

Run: `npm run build`
Expected: build succeeds (`Compiled successfully`).

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json tsconfig.json next-env.d.ts next.config.ts postcss.config.mjs eslint.config.mjs .gitignore vitest.config.ts vitest.setup.ts src/app/globals.css src/app/layout.tsx src/app/page.tsx
git commit -m "chore: scaffold Next.js + Tailwind v4 + Vitest project"
```

---

## Task 2: Domain Types, Allergen Helpers & Mock Menu Data

**Files:**
- Create: `src/types/menu.ts`
- Create: `src/lib/allergens.ts`
- Create: `src/data/mockMenu.ts`
- Test: `src/data/mockMenu.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { mockDishes } from "./mockMenu";
import { ALLERGEN_TAGS, DISH_CATEGORIES } from "@/types/menu";

describe("mockDishes", () => {
  it("has at least one dish per category", () => {
    for (const category of DISH_CATEGORIES) {
      expect(mockDishes.some((dish) => dish.category === category)).toBe(true);
    }
  });

  it("has unique ids", () => {
    const ids = mockDishes.map((dish) => dish.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only uses known allergen tags", () => {
    for (const dish of mockDishes) {
      for (const tag of dish.allergenTags) {
        expect(ALLERGEN_TAGS).toContain(tag);
      }
    }
  });

  it("has positive prices", () => {
    for (const dish of mockDishes) {
      expect(dish.price).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/mockMenu.test.ts`
Expected: FAIL — cannot find module `./mockMenu` (and `@/types/menu`).

- [ ] **Step 3: Create `src/types/menu.ts`**

```ts
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
```

- [ ] **Step 4: Create `src/lib/allergens.ts`**

```ts
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
```

- [ ] **Step 5: Create `src/data/mockMenu.ts`**

```ts
import type { Dish } from "@/types/menu";

export const mockDishes: Dish[] = [
  {
    id: "1",
    name: "Spaghetti Carbonara",
    description: "Egg, pecorino, guanciale and black pepper.",
    price: 14.5,
    category: "Pasta",
    allergenTags: ["gluten", "dairy"],
    ingredients: [
      { id: "1-1", name: "Spaghetti", removable: false, allergenTags: ["gluten"] },
      { id: "1-2", name: "Guanciale", removable: true, allergenTags: [] },
      { id: "1-3", name: "Pecorino", removable: true, allergenTags: ["dairy"] },
    ],
    modelShape: "torus",
    modelColor: "#e9c46a",
  },
  {
    id: "2",
    name: "Penne Arrabbiata",
    description: "Tomato sauce, garlic, chili, fresh basil.",
    price: 12.0,
    category: "Pasta",
    allergenTags: ["gluten", "vegan"],
    ingredients: [
      { id: "2-1", name: "Penne", removable: false, allergenTags: ["gluten"] },
      { id: "2-2", name: "Chili flakes", removable: true, allergenTags: [] },
      { id: "2-3", name: "Basil", removable: true, allergenTags: [] },
    ],
    modelShape: "torus",
    modelColor: "#e76f51",
  },
  {
    id: "3",
    name: "Grilled Ribeye Steak",
    description: "Char-grilled ribeye with rosemary butter.",
    price: 28.0,
    category: "Meat",
    allergenTags: ["dairy"],
    ingredients: [
      { id: "3-1", name: "Ribeye steak", removable: false, allergenTags: [] },
      { id: "3-2", name: "Rosemary butter", removable: true, allergenTags: ["dairy"] },
    ],
    modelShape: "box",
    modelColor: "#9c4221",
  },
  {
    id: "4",
    name: "Chicken Skewers",
    description: "Marinated chicken skewers with peanut sauce.",
    price: 13.5,
    category: "Meat",
    allergenTags: ["nuts"],
    ingredients: [
      { id: "4-1", name: "Chicken thigh", removable: false, allergenTags: [] },
      { id: "4-2", name: "Peanut sauce", removable: true, allergenTags: ["nuts"] },
    ],
    modelShape: "box",
    modelColor: "#d97706",
  },
  {
    id: "5",
    name: "Caesar Salad",
    description: "Romaine, parmesan, croutons, Caesar dressing.",
    price: 11.0,
    category: "Salads",
    allergenTags: ["dairy", "gluten"],
    ingredients: [
      { id: "5-1", name: "Romaine lettuce", removable: false, allergenTags: [] },
      { id: "5-2", name: "Parmesan", removable: true, allergenTags: ["dairy"] },
      { id: "5-3", name: "Croutons", removable: true, allergenTags: ["gluten"] },
    ],
    modelShape: "sphere",
    modelColor: "#84cc16",
  },
  {
    id: "6",
    name: "Greek Salad",
    description: "Tomato, cucumber, olives, feta, oregano.",
    price: 10.5,
    category: "Salads",
    allergenTags: ["vegetarian", "dairy"],
    ingredients: [
      { id: "6-1", name: "Feta cheese", removable: true, allergenTags: ["dairy", "vegetarian"] },
      { id: "6-2", name: "Olives", removable: true, allergenTags: [] },
    ],
    modelShape: "sphere",
    modelColor: "#65a30d",
  },
  {
    id: "7",
    name: "Tiramisu",
    description: "Espresso-soaked ladyfingers, mascarpone, cocoa.",
    price: 8.0,
    category: "Desserts",
    allergenTags: ["vegetarian", "dairy", "gluten"],
    ingredients: [
      { id: "7-1", name: "Ladyfingers", removable: false, allergenTags: ["gluten"] },
      { id: "7-2", name: "Mascarpone", removable: false, allergenTags: ["dairy"] },
    ],
    modelShape: "cone",
    modelColor: "#a16207",
  },
  {
    id: "8",
    name: "Vegan Chocolate Mousse",
    description: "Dark chocolate, coconut cream, almonds.",
    price: 7.5,
    category: "Desserts",
    allergenTags: ["vegan", "nuts"],
    ingredients: [
      { id: "8-1", name: "Dark chocolate", removable: false, allergenTags: [] },
      { id: "8-2", name: "Almonds", removable: true, allergenTags: ["nuts"] },
    ],
    modelShape: "cone",
    modelColor: "#451a03",
  },
  {
    id: "9",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice.",
    price: 4.5,
    category: "Drinks",
    allergenTags: ["vegan"],
    ingredients: [{ id: "9-1", name: "Oranges", removable: false, allergenTags: [] }],
    modelShape: "cylinder",
    modelColor: "#f4a261",
  },
  {
    id: "10",
    name: "Iced Latte",
    description: "Espresso, cold milk, ice.",
    price: 4.0,
    category: "Drinks",
    allergenTags: ["vegetarian", "dairy"],
    ingredients: [
      { id: "10-1", name: "Espresso", removable: false, allergenTags: [] },
      { id: "10-2", name: "Milk", removable: true, allergenTags: ["dairy", "vegetarian"] },
    ],
    modelShape: "cylinder",
    modelColor: "#78350f",
  },
];
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/data/mockMenu.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add src/types/menu.ts src/lib/allergens.ts src/data/mockMenu.ts src/data/mockMenu.test.ts
git commit -m "feat: add menu domain types, allergen helpers and mock dish data"
```

---

## Task 3: AllergenBadge Component

**Files:**
- Create: `src/components/AllergenBadge.tsx`
- Test: `src/components/AllergenBadge.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AllergenBadge from "./AllergenBadge";

describe("AllergenBadge", () => {
  it("renders the label for the given allergen tag", () => {
    render(<AllergenBadge tag="vegan" />);
    expect(screen.getByTestId("allergen-badge")).toHaveTextContent("Vegan");
  });

  it("renders a different label for a different tag", () => {
    render(<AllergenBadge tag="gluten" />);
    expect(screen.getByTestId("allergen-badge")).toHaveTextContent("Gluten");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/AllergenBadge.test.tsx`
Expected: FAIL — cannot find module `./AllergenBadge`.

- [ ] **Step 3: Create `src/components/AllergenBadge.tsx`**

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/AllergenBadge.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/AllergenBadge.tsx src/components/AllergenBadge.test.tsx
git commit -m "feat: add AllergenBadge component"
```

---

## Task 4: CategoryFilter Component

**Files:**
- Create: `src/components/CategoryFilter.tsx`
- Test: `src/components/CategoryFilter.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryFilter from "./CategoryFilter";

describe("CategoryFilter", () => {
  it("renders 'All' plus each category", () => {
    render(<CategoryFilter categories={["Pasta", "Meat"]} active="All" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Pasta" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Meat" })).toBeInTheDocument();
  });

  it("marks the active category as selected", () => {
    render(<CategoryFilter categories={["Pasta", "Meat"]} active="Meat" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "Meat" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Pasta" })).toHaveAttribute("aria-selected", "false");
  });

  it("calls onChange with the clicked category", async () => {
    const onChange = vi.fn();
    render(<CategoryFilter categories={["Pasta", "Meat"]} active="All" onChange={onChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Pasta" }));
    expect(onChange).toHaveBeenCalledWith("Pasta");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/CategoryFilter.test.tsx`
Expected: FAIL — cannot find module `./CategoryFilter`.

- [ ] **Step 3: Create `src/components/CategoryFilter.tsx`**

```tsx
"use client";

const ALL_CATEGORIES = "All";

interface CategoryFilterProps {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  const options = [ALL_CATEGORIES, ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Filter dishes by category">
      {options.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[var(--color-accent)] text-slate-900"
                : "bg-white/5 text-[var(--color-text)] hover:bg-white/10"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/CategoryFilter.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/CategoryFilter.tsx src/components/CategoryFilter.test.tsx
git commit -m "feat: add CategoryFilter component"
```

---

## Task 5: Dish Filtering Logic & DishCard Component

**Files:**
- Create: `src/lib/filterDishes.ts`
- Test: `src/lib/filterDishes.test.ts`
- Create: `src/components/DishCard.tsx`
- Test: `src/components/DishCard.test.tsx`

- [ ] **Step 1: Write the failing test for `filterDishes`**

```ts
import { describe, it, expect } from "vitest";
import { filterDishes } from "./filterDishes";
import type { Dish } from "@/types/menu";

const dishes: Dish[] = [
  {
    id: "1",
    name: "Spaghetti Carbonara",
    description: "",
    price: 10,
    category: "Pasta",
    allergenTags: [],
    ingredients: [],
    modelShape: "torus",
    modelColor: "#fff",
  },
  {
    id: "2",
    name: "Grilled Ribeye Steak",
    description: "",
    price: 20,
    category: "Meat",
    allergenTags: [],
    ingredients: [],
    modelShape: "box",
    modelColor: "#fff",
  },
];

describe("filterDishes", () => {
  it("returns all dishes for category 'All' and empty search", () => {
    expect(filterDishes(dishes, "All", "")).toEqual(dishes);
  });

  it("filters by category", () => {
    expect(filterDishes(dishes, "Meat", "")).toEqual([dishes[1]]);
  });

  it("filters by case-insensitive name search", () => {
    expect(filterDishes(dishes, "All", "ribeye")).toEqual([dishes[1]]);
  });

  it("combines category and search filters", () => {
    expect(filterDishes(dishes, "Pasta", "ribeye")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/filterDishes.test.ts`
Expected: FAIL — cannot find module `./filterDishes`.

- [ ] **Step 3: Create `src/lib/filterDishes.ts`**

```ts
import type { Dish } from "@/types/menu";

export function filterDishes(dishes: Dish[], category: string, search: string): Dish[] {
  const term = search.trim().toLowerCase();

  return dishes.filter((dish) => {
    const matchesCategory = category === "All" || dish.category === category;
    const matchesSearch = term === "" || dish.name.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/filterDishes.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Write the failing test for `DishCard`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DishCard from "./DishCard";
import type { Dish } from "@/types/menu";

const dish: Dish = {
  id: "1",
  name: "Spaghetti Carbonara",
  description: "Egg, pecorino, guanciale and black pepper.",
  price: 14.5,
  category: "Pasta",
  allergenTags: ["gluten", "dairy"],
  ingredients: [],
  modelShape: "torus",
  modelColor: "#e9c46a",
};

describe("DishCard", () => {
  it("renders the dish name, price and allergen badges", () => {
    render(<DishCard dish={dish} />);
    expect(screen.getByText("Spaghetti Carbonara")).toBeInTheDocument();
    expect(screen.getByText("$14.50")).toBeInTheDocument();
    expect(screen.getAllByTestId("allergen-badge")).toHaveLength(2);
  });

  it("links to the dish detail page", () => {
    render(<DishCard dish={dish} />);
    expect(screen.getByTestId("dish-card")).toHaveAttribute("href", "/dish/1");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/DishCard.test.tsx`
Expected: FAIL — cannot find module `./DishCard`.

- [ ] **Step 7: Create `src/components/DishCard.tsx`**

```tsx
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
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/DishCard.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 9: Commit**

```bash
git add src/lib/filterDishes.ts src/lib/filterDishes.test.ts src/components/DishCard.tsx src/components/DishCard.test.tsx
git commit -m "feat: add dish filtering logic and DishCard component"
```

---

## Task 6: `/menu` Page

**Files:**
- Create: `src/app/menu/page.tsx`
- Test: `src/app/menu/page.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuPage from "./page";

describe("MenuPage", () => {
  it("renders all mock dishes by default", () => {
    render(<MenuPage />);
    expect(screen.getAllByTestId("dish-card").length).toBeGreaterThanOrEqual(10);
  });

  it("filters dishes by category", async () => {
    render(<MenuPage />);
    await userEvent.click(screen.getByRole("tab", { name: "Drinks" }));
    const cards = screen.getAllByTestId("dish-card");
    expect(cards).toHaveLength(2);
    expect(screen.getByText("Fresh Orange Juice")).toBeInTheDocument();
    expect(screen.getByText("Iced Latte")).toBeInTheDocument();
  });

  it("filters dishes by search term", async () => {
    render(<MenuPage />);
    await userEvent.type(screen.getByPlaceholderText("Search dishes..."), "tiramisu");
    expect(screen.getAllByTestId("dish-card")).toHaveLength(1);
    expect(screen.getByText("Tiramisu")).toBeInTheDocument();
  });

  it("shows a message when no dish matches", async () => {
    render(<MenuPage />);
    await userEvent.type(screen.getByPlaceholderText("Search dishes..."), "nonexistent");
    expect(screen.getByText("No dishes match your search.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/menu/page.test.tsx`
Expected: FAIL — cannot find module `./page`.

- [ ] **Step 3: Create `src/app/menu/page.tsx`**

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/menu/page.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/menu/page.tsx src/app/menu/page.test.tsx
git commit -m "feat: add /menu page with category filter and search"
```

---

## Task 7: Viewer3D Placeholder Component

**Files:**
- Create: `src/components/Viewer3D.tsx`
- Test: `src/components/Viewer3D.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Viewer3D from "./Viewer3D";
import type { Dish } from "@/types/menu";

vi.mock("@react-three/fiber", () => ({
  Canvas: () => null,
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
}));

const dish: Dish = {
  id: "1",
  name: "Spaghetti Carbonara",
  description: "",
  price: 14.5,
  category: "Pasta",
  allergenTags: [],
  ingredients: [],
  modelShape: "torus",
  modelColor: "#e9c46a",
};

describe("Viewer3D", () => {
  it("renders a viewer container tagged with the dish's model shape", () => {
    render(<Viewer3D dish={dish} />);
    const viewer = screen.getByTestId("viewer3d");
    expect(viewer).toHaveAttribute("data-shape", "torus");
  });

  it("updates the shape tag for a different dish", () => {
    render(<Viewer3D dish={{ ...dish, modelShape: "cone" }} />);
    expect(screen.getByTestId("viewer3d")).toHaveAttribute("data-shape", "cone");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Viewer3D.test.tsx`
Expected: FAIL — cannot find module `./Viewer3D`.

- [ ] **Step 3: Create `src/components/Viewer3D.tsx`**

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Dish } from "@/types/menu";

function DishMesh({ shape, color }: { shape: Dish["modelShape"]; color: string }) {
  const material = <meshStandardMaterial color={color} />;

  switch (shape) {
    case "box":
      return (
        <mesh>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
          {material}
        </mesh>
      );
    case "torus":
      return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.4, 16, 32]} />
          {material}
        </mesh>
      );
    case "cone":
      return (
        <mesh>
          <coneGeometry args={[1, 1.6, 32]} />
          {material}
        </mesh>
      );
    case "cylinder":
      return (
        <mesh>
          <cylinderGeometry args={[1, 1, 1.2, 32]} />
          {material}
        </mesh>
      );
    default:
      return (
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          {material}
        </mesh>
      );
  }
}

export default function Viewer3D({ dish }: { dish: Dish }) {
  return (
    <div
      className="h-72 w-full overflow-hidden rounded-xl bg-[var(--color-surface)]"
      data-testid="viewer3d"
      data-shape={dish.modelShape}
    >
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <DishMesh shape={dish.modelShape} color={dish.modelColor} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Viewer3D.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Viewer3D.tsx src/components/Viewer3D.test.tsx
git commit -m "feat: add Viewer3D placeholder component with shape-mapped geometry"
```

---

## Task 8: `/dish/[id]` Page

**Files:**
- Create: `src/lib/findDish.ts`
- Test: `src/lib/findDish.test.ts`
- Create: `src/app/dish/[id]/page.tsx`
- Create: `src/app/dish/[id]/not-found.tsx`

- [ ] **Step 1: Write the failing test for `findDishById`**

```ts
import { describe, it, expect } from "vitest";
import { findDishById } from "./findDish";
import type { Dish } from "@/types/menu";

const dishes: Dish[] = [
  {
    id: "1",
    name: "Spaghetti Carbonara",
    description: "",
    price: 10,
    category: "Pasta",
    allergenTags: [],
    ingredients: [],
    modelShape: "torus",
    modelColor: "#fff",
  },
];

describe("findDishById", () => {
  it("returns the dish with a matching id", () => {
    expect(findDishById(dishes, "1")).toBe(dishes[0]);
  });

  it("returns undefined when no dish matches", () => {
    expect(findDishById(dishes, "999")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/findDish.test.ts`
Expected: FAIL — cannot find module `./findDish`.

- [ ] **Step 3: Create `src/lib/findDish.ts`**

```ts
import type { Dish } from "@/types/menu";

export function findDishById(dishes: Dish[], id: string): Dish | undefined {
  return dishes.find((dish) => dish.id === id);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/findDish.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Create `src/app/dish/[id]/page.tsx`**

```tsx
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
```

- [ ] **Step 6: Create `src/app/dish/[id]/not-found.tsx`**

```tsx
import Link from "next/link";

export default function DishNotFound() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-white/70">We couldn&apos;t find that dish.</p>
      <Link href="/menu" className="text-sm text-[var(--color-accent)]">
        ← Back to menu
      </Link>
    </div>
  );
}
```

- [ ] **Step 7: Verify the build**

Run: `npm run build`
Expected: build succeeds, `/dish/[id]` listed as a dynamic route.

- [ ] **Step 8: Commit**

```bash
git add src/lib/findDish.ts src/lib/findDish.test.ts "src/app/dish/[id]/page.tsx" "src/app/dish/[id]/not-found.tsx"
git commit -m "feat: add /dish/[id] page with 3D viewer and allergen info"
```

---

## Task 9: QR Landing Page (`/`)

**Files:**
- Create: `src/lib/menuUrl.ts`
- Test: `src/lib/menuUrl.test.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { buildMenuUrl } from "./menuUrl";

describe("buildMenuUrl", () => {
  it("defaults to table 1 when no table is given", () => {
    expect(buildMenuUrl(undefined)).toBe("/menu?table=1");
  });

  it("uses the provided table id", () => {
    expect(buildMenuUrl("7")).toBe("/menu?table=7");
  });

  it("uses the first value when given an array", () => {
    expect(buildMenuUrl(["3", "5"])).toBe("/menu?table=3");
  });

  it("falls back to table 1 for an empty string", () => {
    expect(buildMenuUrl("")).toBe("/menu?table=1");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/menuUrl.test.ts`
Expected: FAIL — cannot find module `./menuUrl`.

- [ ] **Step 3: Create `src/lib/menuUrl.ts`**

```ts
export function buildMenuUrl(table: string | string[] | undefined): string {
  const value = Array.isArray(table) ? table[0] : table;
  const tableId = value && value.trim() !== "" ? value : "1";
  return `/menu?table=${encodeURIComponent(tableId)}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/menuUrl.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Replace `src/app/page.tsx` with the QR-landing redirect**

```tsx
import { redirect } from "next/navigation";
import { buildMenuUrl } from "@/lib/menuUrl";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string | string[] }>;
}) {
  const params = await searchParams;
  redirect(buildMenuUrl(params.table));
}
```

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 7: Run the full test suite**

Run: `npm test`
Expected: all test files pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/menuUrl.ts src/lib/menuUrl.test.ts src/app/page.tsx
git commit -m "feat: redirect / to /menu with table id from query params"
```

---

## Manual Verification

After Task 9, run `npm run dev` and check in a browser:
- `/` redirects to `/menu?table=1`
- `/menu` shows the dish grid, category pills filter it, search narrows it
- Tapping a dish opens `/dish/[id]` showing a rotating placeholder shape (drag to orbit), name, price, description and allergen badges
- `/dish/999` shows the "couldn't find that dish" screen
