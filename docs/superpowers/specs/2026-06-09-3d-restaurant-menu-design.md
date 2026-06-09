# 3D Restaurant Menu — Design Spec

**Date:** 2026-06-09
**Stack:** Next.js (React) + React Three Fiber + Node.js backend + PostgreSQL

---

## Overview

A web-based restaurant menu accessible via QR code at the table. No app download required. Customers browse dishes in a grid, tap any dish to view it as an interactive 3D model, customise ingredients, and place their order — all from the browser.

---

## Pages

| Route | Purpose |
|---|---|
| `/` | QR landing — restaurant branding, redirects to `/menu?table=<id>` |
| `/menu` | Dish grid with category filter and search |
| `/dish/[id]` | 3D viewer, allergen info, customiser, add to order |
| `/order` | Cart summary, place order |
| `/confirmation` | Order confirmed screen |

---

## Key Components

### DishCard
- Thumbnail or mini 3D preview
- Dish name, price, dietary badges
- Tap navigates to `/dish/[id]`

### Viewer3D
- React Three Fiber canvas
- Orbit controls: drag to rotate, pinch to zoom
- AR "place on table" button (WebXR)
- Loading skeleton while `.glb` model fetches

### CategoryFilter
- Horizontal scrollable pill bar
- Categories: All / Pasta / Meat / Salads / Desserts / Drinks
- Filters the dish grid client-side

### OrderDrawer
- Slide-up cart panel (mobile-friendly)
- Item list with quantities and customisations
- Total price + Place Order CTA

### AllergenBadge
- Tags: Vegetarian, Vegan, Gluten, Dairy, Nuts, Shellfish
- Shown on DishCard and dish detail page
- Also usable as filter criteria

### CustomizerPanel
- Toggle individual ingredients on/off
- 3D model updates live to reflect changes
- Free-text notes field for kitchen

---

## Data Flow

```
QR Code (table_id)
  → /menu?table=5
  → GET /api/menu          → DishCard grid

Tap dish
  → /dish/[id]
  → GET /api/dish/[id]     → load 3D model (.glb file)

Add to order
  → OrderContext (React state)
  → OrderDrawer

Place order
  → POST /api/orders       → /confirmation
```

---

## Extra Features (Phase 2)

- **AR "place on table"** — WebXR, place dish on real table surface
- **Live customisation preview** — 3D model swaps ingredient meshes on toggle
- **Nutritional overlay** — macros/calories displayed around the 3D model
- **Pairing suggestions** — recommended drinks shown when viewing a dish
- **Real photo comparison** — toggle between 3D model and customer photos
- **Multilingual auto-detection** — translate descriptions via browser language
- **Share a dish** — shareable link to a dish's 3D preview
- **Today's specials spotlight** — animated featured dish highlight

---

## Backend & Database (Phase 2 detail)

- **REST API** — Next.js API routes or separate NestJS service
- **Database** — PostgreSQL
  - `restaurants` — id, name, branding, table count
  - `dishes` — id, restaurant_id, name, description, price, category, model_url
  - `ingredients` — id, dish_id, name, removable, allergen_tags
  - `orders` — id, restaurant_id, table_number, status, created_at
  - `order_items` — id, order_id, dish_id, quantity, customisations, notes
- **3D model storage** — object storage (e.g. S3 / Cloudflare R2) for `.glb` files
- **Admin dashboard** — restaurant owner uploads dishes, 3D models, manages menu

---

## UI Design Direction

- **Dark theme** — deep navy/charcoal background, warm amber accents (`#f4a261`)
- **Mobile-first** — primary target is phones at a restaurant table
- **Layout:** Dish Grid (Option B) — cards with thumbnail + tap-to-expand 3D
- **Font:** Clean sans-serif, large dish names, readable in dim restaurant lighting

---

## Out of Scope (v1)

- Payment processing
- Loyalty/rewards system
- Multi-language admin UI
- Table reservations
