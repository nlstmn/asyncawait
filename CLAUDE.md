# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**async/await drip** — a local developer merch shop (mugs, socks). No deployment target; runs fully on localhost. No payments in V1 — checkout will save orders to DB only.

## Dev commands

### Backend
```bash
cd backend
source venv/bin/activate          # activate venv (already created)
pip install -r requirements.txt   # if adding new deps
uvicorn main:app --reload         # http://localhost:8000 | docs at /docs
```

### Frontend
```bash
cd frontend
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview production build locally
```

No linting or test runner is configured yet.

## Architecture

### Data flow
```
browser (5173)
  └── React + React Router
        └── src/api/products.js  →  FastAPI (8000)
                                        └── SQLAlchemy → SQLite (asyncawait.db)
```

The frontend calls the backend directly via `VITE_API_BASE` (set in `frontend/.env`). Vite also proxies `/api/*` to port 8000 in dev, but current API calls use the full base URL directly.

### Backend (`backend/`)

- **`main.py`** — app entry point: loads `.env` via `python-dotenv`, registers CORS (origin from `FRONTEND_URL` env var), includes all routers with tags, runs seed logic on startup via `lifespan`
- **`database.py`** — SQLAlchemy engine + `SessionLocal` + `get_db` dependency; reads `DATABASE_URL` from env (defaults to `sqlite:///./asyncawait.db`)
- **`models.py`** — single `Product` model (id, name, description, price as `Numeric(10,2)`, image_url, category, in_stock, created_at); `name` is unique+indexed, `category` is indexed
- **`schemas.py`** — `ProductBase` / `ProductCreate` / `ProductUpdate` (partial, for PUT) / `Product` (response with id + created_at); all fields have `Field()` validators (price > 0, category constrained to `mug|socks|bag`)
- **`routes/products.py`** — full CRUD; public GET, admin POST/PUT/DELETE (no auth yet); PUT uses `UPDATABLE_FIELDS` allowlist to prevent overwriting `id`/`created_at`
- **`routes/orders.py`** and **`routes/waitlist.py`** — stubs only, not yet implemented

### Frontend (`frontend/src/`)

- **`main.jsx`** — mounts `<App>` inside `<BrowserRouter>`
- **`App.jsx`** — holds theme state (`dark` default, persisted to `localStorage`); sets `data-theme` attribute on `<html>`; renders `<Navbar>`, `<main><Routes>`, `<Footer>`
- **`pages/Shop.jsx`** — fetches all products once on mount; uses `useMemo` to split into `mugs`/`socks`; reads `?category=` param from URL to filter; home view renders both sections, category view renders filtered grid
- **`pages/Contact.jsx`** — static contact info (Instagram, email, WhatsApp)
- **`components/Navbar.jsx`** — fixed top nav; reads `useLocation` + `useSearchParams` to highlight active link; burger menu on mobile
- **`components/ProductCard.jsx`** — receives `index` prop for staggered `animationDelay`

### Styling

All styles live in co-located `.css` files. Global tokens are in `src/index.css`.

**Brand colors** — exposed as CSS vars on `:root`:

| Var | Hex | Usage |
|---|---|---|
| `--brand-blue`  | `#004ECC` | Primary accent — logo, active nav, CTAs, links |
| `--brand-green` | `#97CC04` | Prices, "in stock" highlights |
| `--brand-steel` | `#88A0A8` | Section titles, muted brand text |

**Brand fonts** — three faces:

| Var | Family | Source | Used for |
|---|---|---|---|
| `--font-display` | Slow Play       | **Self-hosted** (commercial, Pangram Pangram) — `public/fonts/SlowPlay.*` | Shop title, contact title, footer bottom |
| `--font-heading` | Garlic Butter   | **Self-hosted** (commercial, Pangram Pangram) — `public/fonts/GarlicButter.*` | Category titles, section titles |
| `--font-body`    | Poppins         | Google Fonts (loaded in `index.html`) | Body text default |
| `--font-mono`    | Courier New     | System | Code-feel labels, nav links, prices, copyright |

> Neither Slow Play nor Garlic Butter are on Google Fonts. Drop the `.woff2` files into `frontend/public/fonts/` for them to render; otherwise they fall back to serif.

**Other tokens**:
- **Animation**: `--ease-standard`, `--ease-spring`, `--dur-fast/med/slow`
- **Shared keyframes**: `fadeUp`, `slideDown`, `bounce`, `blink` — defined once in `index.css`, used across all component CSS files
- Dark/light theme via `[data-theme="dark/light"]` on `<html>`; SVG logo gets `filter: brightness(0) invert(1)` in dark mode

### Adding a new product category

1. Add `category` value to the `pattern` regex in `backend/schemas.py`
2. Add seed products to `SEED_PRODUCTS` in `backend/main.py`
3. Add an entry to `CATEGORY_META` in `frontend/src/pages/Shop.jsx`
4. Add a nav link to `LINKS` in `frontend/src/components/Navbar.jsx`
