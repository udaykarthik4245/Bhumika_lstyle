# Bhumika Style Studio — Next.js E-commerce Platform

A full-featured e-commerce platform — **Bhumika Style Studio** — inspired by [Lifestylestores.com](https://www.lifestylestores.com/), built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

All data is **mock / in-memory** (persisted to `localStorage`) — no database required.

---

## Features

### Customer Storefront
- **Home page** with hero banner, category showcase, top picks, and best deals
- **Product catalog** with advanced filtering (category, price, rating, brand, stock)
- **Real-time search** with autocomplete suggestions in the navbar
- **Product detail page** with image gallery, tabs (Description / Specs / Reviews), specifications, and customer reviews
- **Quick-view modal** for fast product preview without leaving the catalog
- **Shopping cart** with add/remove/quantity management (persisted across reloads)
- **Wishlist** with one-click toggle
- **Multi-step checkout** (Address → Payment → Review) with multiple payment methods
- **User authentication** (signup, login, password reset — all mock)
- **User profile** with editable info, order history, saved addresses, and settings

### Admin Panel
- **Dashboard** with revenue, order, and product analytics
- **Product management** — add, edit, delete with full CRUD, search, category filter
- **Order management** — view all orders, filter by status, update fulfillment status

### UI/UX Enhancements
- **Dark mode** with system-preference detection and manual toggle
- **Toast notifications** for cart, wishlist, and form actions
- **Skeleton loaders** during data fetch simulations
- **Smooth animations** — fade-in, slide-up, scale-in, shimmer
- **Responsive design** — mobile-first, works on phone / tablet / desktop
- **Sticky navbar** with backdrop blur
- **Persistent state** in `localStorage` — cart, wishlist, user, orders, and admin catalog edits all survive page refresh

---

## Folder Structure

```
bhumika-style-studio/
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── layout.tsx             # Root layout with providers
│   │   ├── providers.tsx          # All context providers wired together
│   │   ├── page.tsx               # Home
│   │   ├── globals.css            # Tailwind + theme variables
│   │   ├── not-found.tsx          # 404
│   │   ├── login/                 # Login
│   │   ├── signup/                # Sign up
│   │   ├── forgot-password/       # Password reset
│   │   ├── products/              # Catalog + [id] detail
│   │   ├── cart/                  # Cart
│   │   ├── wishlist/              # Wishlist
│   │   ├── checkout/              # Checkout
│   │   ├── account/               # User account (profile, orders, addresses, settings)
│   │   └── admin/                 # Admin dashboard
│   │       ├── page.tsx           # Dashboard analytics
│   │       ├── products/          # Product CRUD
│   │       └── orders/            # Order management
│   ├── components/                # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductCardSkeleton.tsx
│   │   ├── QuickViewModal.tsx
│   │   └── Filters.tsx
│   ├── context/                   # React Context providers
│   │   ├── ThemeContext.tsx
│   │   ├── ToastContext.tsx
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── WishlistContext.tsx
│   │   └── AdminProductsContext.tsx
│   └── lib/                       # Data + helpers
│       ├── types.ts               # Shared TypeScript types
│       ├── categories.ts          # 8 product categories
│       ├── mockProducts.ts        # ~480 generated products
│       ├── mockUsers.ts           # Seeded users (customer + admin)
│       └── utils.ts               # cn(), formatINR(), calcDiscount(), generateId()
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
├── postcss.config.js
└── package.json
```

---

## Getting Started

### Prerequisites
- **Node.js 18.17+** (or 20+)
- **npm**, **yarn**, or **pnpm**

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## Demo Accounts

The app seeds two users for testing:

| Role     | Email                       | Password   |
|----------|-----------------------------|------------|
| Customer | demo@bhumikastyle.com       | demo123    |
| Admin    | admin@bhumikastyle.com      | admin123   |

> Login with the **admin** account to access `/admin`. The admin link also appears in the user dropdown menu when logged in as admin.

You can also sign up new accounts — they're stored in `localStorage`.

---

## Key Implementation Notes

### State Management
- Pure **React Context + hooks** — no Redux needed for this scale.
- Each domain (cart, wishlist, auth, theme, toasts, admin catalog) has its own provider in `src/context/`.
- All persistent state hydrates from `localStorage` on mount and re-syncs on change.

### Mock Data Generation
- Products are generated deterministically using a seeded PRNG (`mockProducts.ts`) so the catalog is identical on every render — no SSR/hydration mismatch.
- ~60 products per category × 8 categories = **~480 products** seeded.

### Images
- The mock data uses Unsplash URLs as placeholders. The `next.config.js` allows `images.unsplash.com`, `picsum.photos`, and `placehold.co`.
- The user can replace image URLs via the Admin Panel → Products → Edit, or by editing `src/lib/mockProducts.ts` and `src/lib/categories.ts`.

### Auth
- Login/signup write to `localStorage` keys (`bhumika:user`, `bhumika:users`). Passwords are stored in plaintext for demo simplicity — **do not use this approach in production**.

### Admin Catalog Sync
- Admin product edits are reflected immediately on the storefront because the catalog is read from `AdminProductsContext`, not the static seed.

### Performance
- Images are lazy-loaded with `loading="lazy"`.
- Catalog page memoizes filter/sort results.
- Skeleton loaders are shown during the simulated 350ms fetch latency.

---

## Resetting Demo Data

If you want to start fresh:

1. Go to **Account → Settings → Clear Data**, OR
2. In browser DevTools, run:
   ```js
   localStorage.clear(); location.reload();
   ```

---

## Deployment

The app is **Vercel-ready** — push to a Git repository and import it on Vercel.

Other platforms that support Next.js 14 standalone output (Netlify, Render, AWS Amplify, self-hosted Node) will also work with `npm run build && npm start`.

```bash
# Vercel CLI
npx vercel
```

No environment variables are required — everything is mock/in-memory.

---

## Tech Stack

- **Next.js 14** — App Router, React Server Components, file-based routing
- **React 18**
- **TypeScript 5**
- **Tailwind CSS 3** with dark mode (`class` strategy) and custom animations
- **lucide-react** — icon set
- **clsx** — conditional classnames

---

## License

Demo project — free to use, modify, and distribute.
