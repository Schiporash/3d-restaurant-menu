# Warm & Elegant Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing 3D restaurant menu into a warm, cozy, elegant experience with smooth Framer Motion animations and lazy 3D previews on dish cards, without changing any behavior.

**Architecture:** Pure look-and-motion redesign on the existing Next.js 15 App Router app. New warm design tokens + background gradient in `globals.css`; serif+sans fonts via `next/font`; a small reusable Framer Motion primitive set; a shared `DishMesh` geometry component used by both the detail viewer and a new lazy-3D card preview. All existing routes/behaviors and the 27 passing tests stay intact.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, framer-motion, @react-three/fiber v9, @react-three/drei v10, Vitest, React Testing Library.

**Working directory:** `C:/Users/Andrei/Desktop/3d-restaurant-menu/.worktrees/3d-menu-browsing` (run all commands here).

**Note on npm:** this project installs with `--legacy-peer-deps` (R3F/testing-library peer ranges). Always pass that flag to `npm install`.

---

## File Structure

**New files:**
- `src/components/three/DishMesh.tsx` — shared shape→geometry mesh (extracted from `Viewer3D`)
- `src/components/motion/FadeIn.tsx` — fade + slide-up section wrapper
- `src/components/motion/StaggerGrid.tsx` — staggered-entrance grid container
- `src/lib/orbGradient.ts` — pure helper: dish color → CSS radial-gradient string
- `src/lib/orbGradient.test.ts` — unit tests for the helper
- `src/components/DishCardPreview.tsx` — gradient orb + lazy 3D upgrade
- `src/components/DishCardPreview.test.tsx` — smoke test (orb by default)

**Modified files:**
- `src/app/globals.css` — warm tokens, background gradient, font wiring
- `src/app/layout.tsx` — load fonts, restyle header, page-transition wrapper
- `src/components/Viewer3D.tsx` — consume shared `DishMesh`, warm lighting/bg
- `src/components/CategoryFilter.tsx` — warm pills + animated underline
- `src/components/DishCard.tsx` — warm styling, serif name, preview, hover motion
- `src/components/AllergenBadge.tsx` — warm-toned badge colors
- `src/app/menu/page.tsx` — stagger grid, warm search input
- `src/app/dish/[id]/page.tsx` — FadeIn sections, serif name, refined spacing
- `src/app/dish/[id]/not-found.tsx` — warm styling

---

## Task 1: Install framer-motion

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the dependency**

Run: `npm install framer-motion --legacy-peer-deps`
Expected: completes, `framer-motion` added to `dependencies`.

- [ ] **Step 2: Verify it resolves and tests still pass**

Run: `npm test`
Expected: 9 files / 27 tests pass (unchanged).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion"
```

---

## Task 2: Warm Design Tokens, Background Gradient & Fonts

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace `src/app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg: #1c1512;
  --color-surface: #2a2018;
  --color-accent: #e0a458;
  --color-accent-2: #7d8b6a;
  --color-text: #f0e9df;
  --color-muted: #a99e90;

  --font-serif: var(--font-playfair), Georgia, serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  background-image: radial-gradient(
    120% 80% at 50% -10%,
    rgba(224, 164, 88, 0.16) 0%,
    rgba(224, 164, 88, 0.05) 35%,
    transparent 70%
  );
  background-attachment: fixed;
  background-repeat: no-repeat;
}
```

- [ ] **Step 2: Update `src/app/layout.tsx` to load fonts + restyle header**

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "3D Restaurant Menu",
  description: "Browse dishes in interactive 3D and place your order from the table.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <header className="border-b border-[var(--color-accent)]/15 px-4 py-4">
          <span className="font-serif text-2xl font-semibold tracking-wide text-[var(--color-accent)]">
            3D Restaurant Menu
          </span>
        </header>
        <main className="px-4 py-5">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the build and tests**

Run: `npm run build`
Expected: build succeeds.
Run: `npm test`
Expected: 27 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: warm design tokens, background glow and serif/sans fonts"
```

---

## Task 3: Extract Shared DishMesh & Warm the Viewer3D

**Files:**
- Create: `src/components/three/DishMesh.tsx`
- Modify: `src/components/Viewer3D.tsx`
- Test: `src/components/Viewer3D.test.tsx` (unchanged — must still pass)

- [ ] **Step 1: Create `src/components/three/DishMesh.tsx`**

```tsx
import type { Dish } from "@/types/menu";

export default function DishMesh({
  shape,
  color,
}: {
  shape: Dish["modelShape"];
  color: string;
}) {
  const material = <meshStandardMaterial color={color} roughness={0.45} metalness={0.1} />;

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
```

- [ ] **Step 2: Rewrite `src/components/Viewer3D.tsx` to use it + warm lighting**

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import DishMesh from "./three/DishMesh";
import type { Dish } from "@/types/menu";

export default function Viewer3D({ dish }: { dish: Dish }) {
  return (
    <div
      className="h-72 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[var(--color-surface)] to-[#221a14] ring-1 ring-[var(--color-accent)]/10"
      data-testid="viewer3d"
      data-shape={dish.modelShape}
    >
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} color="#ffe6c4" />
        <directionalLight position={[-4, -2, -3]} intensity={0.3} color="#7d8b6a" />
        <DishMesh shape={dish.modelShape} color={dish.modelColor} />
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Run the Viewer3D test to confirm it still passes**

Run: `npx vitest run src/components/Viewer3D.test.tsx`
Expected: PASS (2 tests) — the test mocks `@react-three/fiber`/`@react-three/drei` and only checks the outer `data-testid`/`data-shape`, which are unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/components/three/DishMesh.tsx src/components/Viewer3D.tsx
git commit -m "refactor: extract shared DishMesh; warm Viewer3D lighting + autorotate"
```

---

## Task 4: Motion Primitives (FadeIn, StaggerGrid)

**Files:**
- Create: `src/components/motion/FadeIn.tsx`
- Create: `src/components/motion/StaggerGrid.tsx`

- [ ] **Step 1: Create `src/components/motion/FadeIn.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export default function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create `src/components/motion/StaggerGrid.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function StaggerGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={container}
      initial={reduce ? false : "hidden"}
      animate="show"
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Verify the build (no test for pure motion wrappers yet)**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/motion/FadeIn.tsx src/components/motion/StaggerGrid.tsx
git commit -m "feat: add FadeIn and StaggerGrid motion primitives"
```

---

## Task 5: Orb Gradient Helper (TDD)

**Files:**
- Create: `src/lib/orbGradient.ts`
- Test: `src/lib/orbGradient.test.ts`

- [ ] **Step 1: Write the failing test `src/lib/orbGradient.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { buildOrbGradient } from "./orbGradient";

describe("buildOrbGradient", () => {
  it("returns a radial-gradient string containing the base color", () => {
    const result = buildOrbGradient("#e9c46a");
    expect(result).toContain("radial-gradient");
    expect(result).toContain("#e9c46a");
  });

  it("produces a highlight lighter than the base and a shadow darker than the base", () => {
    // base #808080 -> highlight should be brighter, shadow darker
    const result = buildOrbGradient("#808080");
    expect(result).toContain("#b3b3b3"); // +0x33 per channel, clamped
    expect(result).toContain("#4d4d4d"); // -0x33 per channel, clamped
  });

  it("clamps channels at 0 and 255", () => {
    const result = buildOrbGradient("#ffffff");
    expect(result).toContain("#ffffff"); // highlight clamps to white
    expect(result).toContain("#cccccc"); // shadow = 255-0x33
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/orbGradient.test.ts`
Expected: FAIL — cannot find module `./orbGradient`.

- [ ] **Step 3: Create `src/lib/orbGradient.ts`**

```ts
function clamp(value: number): number {
  return Math.max(0, Math.min(255, value));
}

function shift(hex: string, amount: number): string {
  const normalized = hex.replace("#", "");
  const r = clamp(parseInt(normalized.slice(0, 2), 16) + amount);
  const g = clamp(parseInt(normalized.slice(2, 4), 16) + amount);
  const b = clamp(parseInt(normalized.slice(4, 6), 16) + amount);
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

/**
 * Build a soft 3D-looking radial gradient from a single dish color:
 * a lighter highlight in the upper-left, the base color in the middle,
 * and a darker shadow toward the edge.
 */
export function buildOrbGradient(color: string): string {
  const highlight = shift(color, 0x33);
  const shadow = shift(color, -0x33);
  return `radial-gradient(circle at 35% 30%, ${highlight} 0%, ${color} 45%, ${shadow} 100%)`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/orbGradient.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/orbGradient.ts src/lib/orbGradient.test.ts
git commit -m "feat: add orb gradient helper"
```

---

## Task 6: DishCardPreview (gradient orb + lazy 3D)

**Files:**
- Create: `src/components/DishCardPreview.tsx`
- Test: `src/components/DishCardPreview.test.tsx`

- [ ] **Step 1: Write the failing test `src/components/DishCardPreview.test.tsx`**

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DishCardPreview from "./DishCardPreview";
import type { Dish } from "@/types/menu";

// Keep WebGL out of jsdom — never actually mount a real canvas.
vi.mock("@react-three/fiber", () => ({ Canvas: () => null }));
vi.mock("@react-three/drei", () => ({ OrbitControls: () => null }));

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

beforeEach(() => {
  // jsdom has no IntersectionObserver — stub one that never fires (cards stay as orbs).
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("IntersectionObserver", IO);
});

describe("DishCardPreview", () => {
  it("renders a gradient orb by default with the dish color baked into the gradient", () => {
    render(<DishCardPreview dish={dish} />);
    const orb = screen.getByTestId("dish-card-preview");
    expect(orb).toBeInTheDocument();
    expect(orb.style.backgroundImage).toContain("radial-gradient");
    expect(orb.style.backgroundImage).toContain("#e9c46a");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/DishCardPreview.test.tsx`
Expected: FAIL — cannot find module `./DishCardPreview`.

- [ ] **Step 3: Create `src/components/DishCardPreview.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import DishMesh from "./three/DishMesh";
import { buildOrbGradient } from "@/lib/orbGradient";
import type { Dish } from "@/types/menu";

export default function DishCardPreview({ dish }: { dish: Dish }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const show3D = inView || hovered;

  return (
    <div
      ref={ref}
      data-testid="dish-card-preview"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="h-28 w-full overflow-hidden rounded-xl ring-1 ring-black/20"
      style={{ backgroundImage: buildOrbGradient(dish.modelColor) }}
      aria-hidden="true"
    >
      {show3D && (
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 4, 5]} intensity={1} color="#ffe6c4" />
          <DishMesh shape={dish.modelShape} color={dish.modelColor} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
        </Canvas>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/DishCardPreview.test.tsx`
Expected: PASS (1 test) — the stubbed IntersectionObserver never fires, so only the orb renders.

- [ ] **Step 5: Commit**

```bash
git add src/components/DishCardPreview.tsx src/components/DishCardPreview.test.tsx
git commit -m "feat: add DishCardPreview with gradient orb and lazy 3D"
```

---

## Task 7: CategoryFilter — warm pills + animated underline

**Files:**
- Modify: `src/components/CategoryFilter.tsx`
- Test: `src/components/CategoryFilter.test.tsx` (unchanged — must still pass)

- [ ] **Step 1: Rewrite `src/components/CategoryFilter.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

const ALL_CATEGORIES = "All";

interface CategoryFilterProps {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  const options = [ALL_CATEGORIES, ...categories];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2"
      role="tablist"
      aria-label="Filter dishes by category"
    >
      {options.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={`relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-[var(--color-accent)]/12 ring-1 ring-[var(--color-accent)]/40"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Run the CategoryFilter test**

Run: `npx vitest run src/components/CategoryFilter.test.tsx`
Expected: PASS (3 tests) — `role="tab"`, `aria-selected`, and the `onChange` click handler are all preserved.

- [ ] **Step 3: Commit**

```bash
git add src/components/CategoryFilter.tsx
git commit -m "feat: warm CategoryFilter with animated sliding underline"
```

---

## Task 8: AllergenBadge — warm-toned colors

**Files:**
- Modify: `src/components/AllergenBadge.tsx`
- Test: `src/components/AllergenBadge.test.tsx` (unchanged — must still pass)

Note: `ALLERGEN_LABELS` and `ALLERGEN_COLORS` live in `src/lib/allergens.ts`. The test only asserts on label text, so we restyle by editing the color map there.

- [ ] **Step 1: Update the color map in `src/lib/allergens.ts`**

Replace the `ALLERGEN_COLORS` object with warm-toned variants (leave `ALLERGEN_LABELS` untouched):

```ts
export const ALLERGEN_COLORS: Record<AllergenTag, string> = {
  vegetarian: "bg-[#7d8b6a]/20 text-[#b9c4a3]",
  vegan: "bg-[#6f8f5a]/20 text-[#aecb92]",
  gluten: "bg-[#e0a458]/20 text-[#f0c98a]",
  dairy: "bg-[#caa472]/20 text-[#e6c89c]",
  nuts: "bg-[#b5703a]/25 text-[#e0a877]",
  shellfish: "bg-[#c77b62]/25 text-[#e6a892]",
};
```

- [ ] **Step 2: Run the AllergenBadge test**

Run: `npx vitest run src/components/AllergenBadge.test.tsx`
Expected: PASS (2 tests) — labels unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/lib/allergens.ts
git commit -m "feat: warm-toned allergen badge colors"
```

---

## Task 9: DishCard — warm styling, preview, hover motion

**Files:**
- Modify: `src/components/DishCard.tsx`
- Test: `src/components/DishCard.test.tsx` (unchanged — must still pass)

- [ ] **Step 1: Rewrite `src/components/DishCard.tsx`**

```tsx
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
```

- [ ] **Step 2: Run the DishCard test**

Run: `npx vitest run src/components/DishCard.test.tsx`
Expected: PASS (2 tests) — name, `$14.50`, two allergen badges, and `href="/dish/1"` on the `dish-card` element are all preserved (the `data-testid` + `href` stay on the `Link`).

Note: `DishCardPreview` mocks aren't set in this test file, but its 3D canvas only mounts on intersection/hover, which never fires in jsdom — the orb renders harmlessly. If jsdom errors on missing `IntersectionObserver`, add the same `IO` stub used in `DishCardPreview.test.tsx` to this file's `beforeEach`.

- [ ] **Step 3: Commit**

```bash
git add src/components/DishCard.tsx
git commit -m "feat: warm DishCard with 3D preview and hover lift"
```

---

## Task 10: Menu Page — stagger grid + warm search

**Files:**
- Modify: `src/app/menu/page.tsx`
- Test: `src/app/menu/page.test.tsx` (unchanged — must still pass)

- [ ] **Step 1: Rewrite `src/app/menu/page.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import DishCard from "@/components/DishCard";
import StaggerGrid from "@/components/motion/StaggerGrid";
import { filterDishes } from "@/lib/filterDishes";
import { mockDishes } from "@/data/mockMenu";
import { DISH_CATEGORIES } from "@/types/menu";

export default function MenuPage() {
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  const dishes = useMemo(() => filterDishes(mockDishes, category, search), [category, search]);

  return (
    <div className="flex flex-col gap-5">
      <input
        type="search"
        placeholder="Search dishes..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="w-full rounded-xl bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] ring-1 ring-[var(--color-accent)]/10 placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/60 transition-shadow"
      />
      <CategoryFilter categories={DISH_CATEGORIES} active={category} onChange={setCategory} />
      <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
        {dishes.length === 0 && (
          <p className="col-span-full text-center text-sm text-[var(--color-muted)]">
            No dishes match your search.
          </p>
        )}
      </StaggerGrid>
    </div>
  );
}
```

- [ ] **Step 2: Run the menu page test**

Run: `npx vitest run src/app/menu/page.test.tsx`
Expected: PASS (4 tests) — placeholder `"Search dishes..."`, category tab clicks, `dish-card` count, and the `"No dishes match your search."` message are all preserved.

Note: if jsdom errors on `IntersectionObserver` (from `DishCardPreview` inside the cards), add the `IO` stub in a `beforeEach` at the top of `page.test.tsx`:

```tsx
import { beforeEach, vi } from "vitest";
beforeEach(() => {
  class IO { observe() {} unobserve() {} disconnect() {} }
  vi.stubGlobal("IntersectionObserver", IO);
});
```

- [ ] **Step 3: Commit**

```bash
git add src/app/menu/page.tsx src/app/menu/page.test.tsx
git commit -m "feat: staggered menu grid and warm search input"
```

---

## Task 11: Dish Detail Page + Not-Found — warm polish

**Files:**
- Modify: `src/app/dish/[id]/page.tsx`
- Modify: `src/app/dish/[id]/not-found.tsx`

- [ ] **Step 1: Rewrite `src/app/dish/[id]/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Rewrite `src/app/dish/[id]/not-found.tsx`**

```tsx
import Link from "next/link";

export default function DishNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-3 py-12 text-center">
      <p className="font-serif text-lg text-[var(--color-text)]">
        We couldn&apos;t find that dish.
      </p>
      <Link
        href="/menu"
        className="text-sm text-[var(--color-accent)] transition-opacity hover:opacity-80"
      >
        ← Back to menu
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: build succeeds; `/dish/[id]` still a dynamic route.

- [ ] **Step 4: Commit**

```bash
git add "src/app/dish/[id]/page.tsx" "src/app/dish/[id]/not-found.tsx"
git commit -m "feat: warm dish detail page with fade-in sections"
```

---

## Task 12: Full Verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all test files pass (27 existing + orbGradient (3) + DishCardPreview (1) = 31 tests).

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 3: Manual smoke (dev server)**

Run: `npm run dev` and verify in a browser:
- `/menu` cards cascade in; category underline slides between tabs; search narrows the grid; cards lift on hover and show a rotating 3D model when hovered/in view (orb otherwise).
- Tapping a dish fades into `/dish/[id]` with the auto-rotating warm viewer, serif name, gold price, allergen badges.
- `/dish/999` shows the warm "couldn't find that dish" screen.
- Whole app reads warm (espresso/gold/cream), not cold blue.

- [ ] **Step 4: Final commit (if any stray changes)**

```bash
git add -A
git commit -m "chore: warm & elegant redesign verification" || echo "nothing to commit"
```

---

## Self-Review Notes

- **Spec coverage:** tokens+gradient (T2), fonts (T2), motion system incl. reduced-motion (T4, used in T9/T11) and animated underline (T7), lazy 3D on cards + shared DishMesh (T3, T5, T6, T9), all component restyles (T2,T7,T8,T9,T10,T11), testing (T5,T6,T12). All spec sections map to tasks.
- **Type consistency:** `buildOrbGradient(color: string): string` (T5) consumed in T6; `staggerItem` exported from `StaggerGrid` (T4) consumed in T9; `DishMesh({shape,color})` (T3) consumed in T3/T6.
- **Test integrity:** existing 27 assertions preserved; markup-coupled selectors (`data-testid`, `role`, `aria-selected`, labels, placeholder, empty-state text, `href`) all kept. New tests added for the only new pure logic (orb gradient) and a preview smoke test. IntersectionObserver stub documented where jsdom needs it.
