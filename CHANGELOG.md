# Changelog

All notable changes to **Bhumika Style Studio** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-05-30

First public release. A full-featured e-commerce storefront + admin panel,
inspired by Lifestylestores.com, built with Next.js 14, TypeScript, and
Tailwind CSS. All state is mock / in-memory (persisted to `localStorage`)
— no backend required.

### Added — Storefront

- **Home page** with hero, category grid, top picks, and best-deals sections.
- **Product catalog** (`/products`) with:
  - Category, price-range, rating, brand, and stock filters.
  - Five sort modes (popularity, price asc/desc, rating, discount).
  - Real-time search with autocomplete suggestions in the navbar.
  - Skeleton loaders during the simulated fetch latency.
  - Quick-view modal for fast preview without leaving the catalog.
- **Product detail page** (`/products/[id]`) with image gallery, tabs
  (Description / Specifications / Reviews), stock indicator, quantity
  selector, "Add to Cart", "Buy Now", wishlist toggle, and related
  products.
- **Cart** (`/cart`) with quantity controls, line totals, free-shipping
  threshold, tax computation, and order summary.
- **Wishlist** (`/wishlist`) with one-click toggle from any card.
- **Multi-step checkout** (`/checkout`): Address → Payment → Review,
  with COD / Card / UPI / Netbanking payment options and an inline
  add-new-address form.

### Added — Account

- **Authentication**: signup, login, password reset (all mock; demo
  accounts seeded — `demo@bhumikastyle.com` / `demo123` and
  `admin@bhumikastyle.com` / `admin123`).
- **Profile** with editable name and phone, plus account stats.
- **Order history** with full line items, status badges, and a
  post-checkout "order placed" confirmation banner.
- **Saved addresses** with default-address selection and inline form.
- **Settings** with theme toggle and "clear local data" reset button.

### Added — Admin Panel

- **Dashboard** (`/admin`) with revenue, total orders, total products,
  low-stock count, orders-by-status bar chart, products-by-category
  chart, and a recent-orders table.
- **Product management** (`/admin/products`) with full CRUD, search,
  category filter, and a modal-based add/edit form.
- **Order management** (`/admin/orders`) with status filter and inline
  fulfillment-status updates (placed / processing / shipped / delivered
  / cancelled).
- Admin-only routes guarded by role check; non-admin users redirected to
  the storefront.

### Added — Cross-cutting UX

- **Dark mode** with system-preference detection and persistent toggle.
- **Toast notifications** (success / error / info) for cart, wishlist,
  auth, and form actions.
- **Smooth animations**: fade-in, slide-up, slide-down, scale-in, and
  shimmer keyframes in Tailwind config.
- **Responsive design**: mobile-first; dedicated mobile drawers for
  navigation and filters; sticky navbar with backdrop blur.
- **Persistent state** in `localStorage` keyed by `bhumika:*` prefixes
  — cart, wishlist, user, users, orders, catalog, theme.

### Added — Architecture

- **Next.js 14 App Router** with file-based routing and React Server
  Components where applicable.
- **Six React Context providers** wired in `src/app/providers.tsx`:
  `ThemeContext`, `ToastContext`, `AuthContext`,
  `AdminProductsContext`, `WishlistContext`, `CartContext`.
- **Deterministic mock data**: a seeded PRNG generates ~480 products
  across 8 categories on every render — guaranteed identical output
  for SSR/hydration safety.
- **`next.config.js`** allows external image hosts: `images.unsplash.com`,
  `picsum.photos`, `placehold.co`.
- **`.nvmrc`** pins Node 20 LTS for local + CI + Vercel parity.

### Fixed

- Escaped raw apostrophes in `src/app/not-found.tsx` and quotes in
  `src/components/Navbar.tsx` to satisfy ESLint's
  `react/no-unescaped-entities` rule, which had blocked the first
  Vercel production build. (See commit `6810506`.)

---

## Commit Reference

| SHA       | Type  | Summary                                                  |
|-----------|-------|----------------------------------------------------------|
| `0628b82` | feat  | Initial commit: Bhumika Style Studio e-commerce platform |
| `6810506` | fix   | Escape unescaped quotes in JSX text for ESLint            |
| `37e6ee4` | chore | Pin Node.js version to 20 via `.nvmrc`                   |

[1.0.0]: https://github.com/udaykarthik4245/Bhumika_lstyle/releases/tag/v1.0.0
