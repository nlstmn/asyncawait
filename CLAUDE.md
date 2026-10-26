# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**async/await drip** — a developer merch shop (handmade ceramic mugs, Barcelona). Static React site on Netlify, auto-deployed from `master`. Payment is manual (IBAN / Bizum / Revolut sent by email); there is no card checkout. The `backend/` folder (FastAPI + SQLite) is legacy and **not deployed** — ignore it unless asked.

Commits go straight to `master` under the personal GitHub account `nlstmn`, Conventional Commits. Commit or push only when Liana says so.

## Commands

```bash
cd frontend
npm run dev        # http://localhost:5173 — checkout falls back to a mock order
npx netlify dev    # real order function + emails (needs frontend/.env)
npm run build      # production build → dist/
npm run orders     # pull stored orders → frontend/orders.json (gitignored)
```

No lint, tests or CI yet. Verify with `npm run build` and the browser.

## Architecture

```
browser → React + React Router (Vite)
            └── POST /.netlify/functions/order   (frontend/netlify/functions/order.mjs)
                  ├── Netlify Blobs: order counter, rate limits, stored orders
                  └── Resend: customer confirmation + shop notification
```

### `frontend/src/`

- **`shared/catalogue.js`** — the one source of truth shared by the app *and* the function: products (name, finish, colour, price), `MAX_PER_ITEM`, `formatPrice`, `itemLabel`, customer-field regexes and max lengths. Plain ESM, no imports. Change prices here only.
- **`data/products.js`** — the catalogue plus bundled images (`image_url`, `images`, `imageFocus`), `CHIPS`, `OK_BINARY`, `getProductById`.
- **`data/countries.js`** — European countries with flag, dial code and city list.
- **`context/CartContext.jsx`** — `useCart()`; persists `{id, quantity}` only in `localStorage` (`asyncdrip_cart`) and re-hydrates from the catalogue.
- **`utils/orders.js`** — `placeOrder()`; POSTs to the function, mock order in plain `npm run dev`.
- **`pages/`** — `Home`, `Shop`, `ProductDetail` (`/mug/:id`), `About`, `Contact`, `Cart`, `Checkout`, `NotFound` (catch-all).
- **`components/`** — `Navbar`, `Footer`, `ProductCard`, `AddToCart` (shared add → stepper), `SmartImage`, `Typewriter`, `ConfirmOrderModal`, `FaqModal` (both on `Modal.css`), `icons.jsx` (all inline SVGs).
- **`index.css`** — every design token (`:root`), the shared `.table`, `.status`, grain overlay, keyframes.

### Order function (`frontend/netlify/functions/order.mjs`)

Validates and re-prices against the shared catalogue, stores the order in Blobs (`orders` → `order/<id>`), then emails via Resend; a failed email is logged, not fatal. Abuse protection: origin allow-list, JSON only, field caps, no links in names, honeypot, per-IP and per-day caps. Env vars are documented in `frontend/.env.example`; real values only in gitignored `.env` and in Netlify.

## Design system

The full rules are in [README.md](README.md) → "Style rules". Non-negotiables: tokens only (colours, `--sp-*` spacing, `--r-*` radii, two shadows), font sizes in `px`, lowercase copy, 780px / 1100px page widths, reuse `.table` / `.status` / `Modal.css` / `AddToCart` before inventing a new pattern, and document any new pattern in the README in the same change.

## Vault

Project notes live in the Obsidian vault at `personal project asyncawait/` (`index.md`, `dev-log.md`, `rubric.md`, `roast-*.md`). The gitignored `RUBRIC.md` here mirrors the vault rubric — run through it before calling a change done.
