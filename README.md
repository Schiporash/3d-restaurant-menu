# 3D Restaurant Menu

A web-based restaurant menu accessible via QR code at the table. Customers browse dishes in a grid, tap any dish to view it as an interactive 3D model, and (eventually) customise ingredients and place an order — all from the browser.

- **Design spec:** `docs/superpowers/specs/2026-06-09-3d-restaurant-menu-design.md`
- **Current implementation plan:** `docs/superpowers/plans/2026-06-13-3d-menu-browsing.md` ("3D Menu Browsing, Frontend v1, Mock Data")
- **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + React Three Fiber/drei + Vitest

## Getting started

```bash
npm install
npm run dev   # http://localhost:3000
npm test      # vitest run
```

## Progress — "3D Menu Browsing" plan

Branch: `3d-menu-browsing`

- [x] **Task 1: Project Scaffold & Tooling** — Next.js + TS + Tailwind v4 + Vitest project, dark/amber theme, root layout
- [x] **Task 2: Domain Types, Allergen Helpers & Mock Menu Data** — `Dish`/`Ingredient` types, allergen label/color maps, 10 mock dishes across 5 categories
- [ ] **Task 3: AllergenBadge Component** — `src/components/AllergenBadge.tsx`
- [ ] **Task 4: CategoryFilter Component** — `src/components/CategoryFilter.tsx`
- [ ] **Task 5: Dish Filtering Logic & DishCard Component** — `src/lib/filterDishes.ts`, `src/components/DishCard.tsx`
- [ ] **Task 6: `/menu` Page** — `src/app/menu/page.tsx` (dish grid, category filter, search)
- [ ] **Task 7: Viewer3D Placeholder Component** — `src/components/Viewer3D.tsx` (React Three Fiber, shape-mapped placeholder geometry)
- [ ] **Task 8: `/dish/[id]` Page** — `src/lib/findDish.ts`, dish detail page with 3D viewer + allergen info
- [ ] **Task 9: QR Landing Page (`/`)** — `src/lib/menuUrl.ts`, redirect `/` to `/menu?table=<id>`

Full task details (file contents, test code, exact steps) are in `docs/superpowers/plans/2026-06-13-3d-menu-browsing.md`. To continue, pick up at Task 3 using the subagent-driven-development workflow (fresh implementer subagent per task, then spec-compliance review, then code-quality review).

### Out of scope for this plan

OrderContext/cart, OrderDrawer, CustomizerPanel, `/order`, `/confirmation`, real `.glb` model loading, AR — these will be a follow-up "Cart & Ordering Flow" plan.
