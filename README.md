# asyncdrip

Developer merch shop. Dark roast, async-safe.

## Stack

- **Backend**: FastAPI + SQLAlchemy (SQLite)
- **Frontend**: React + Vite

## Run the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API available at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`.

## Style rules (design system)

All design tokens live in `frontend/src/index.css` under `:root`. Keep to these
rules so the UI stays consistent.

### Colors (system)

| Token             | Value      | Use                                  |
| ----------------- | ---------- | ------------------------------------ |
| `--brand-blue`    | `#004ECC`  | primary actions, links, prices (cart/checkout) |
| `--brand-green`   | `#97CC04`  | positive/confirm (place-order, in-cart stepper, detail price) |
| `--brand-steel`   | `#88A0A8`  | subtle accents                       |
| `--bg`            | `#f4f4f4`  | page background                      |
| `--surface`       | `#ffffff`  | cards, inputs, bars                  |
| `--surface-hover` | `#f0f4ff`  | hover / tint base                    |
| `--border`        | `#ddd`     | 1px borders                          |
| `--text`          | `#1a1a1a`  | body text                            |
| `--text-muted`    | `#888`     | secondary text                       |
| `--error`         | `#cc4444`  | destructive (empty cart, remove)     |

Light theme only (no dark mode). There are exactly **two greens**: `--brand-green`
(lime — button / stepper / sticker backgrounds) and `--accent-green` (darker,
text-safe — used as a text color for prices/notes). On lime green always use the
`--text` token for contrast, never white (do not hardcode a dark hex).

### Typography

- `--font-display` (Slow Play): page titles / tab titles / product & mug names.
- `--font-heading` (Garlic Butter): reserved heading face.
- `--font-body` (Poppins): body copy, form inputs.
- `--font-mono` (Courier New): taglines, prices, chips, nav/footer, buttons, specs.
- **All font sizes are declared in `px`, never `rem`** (deliberate: pixel-exact
  type across the app; the root stays at the 16px default).
- Typewriter taglines/subtitles use the `Typewriter` component and render bold
  via `.typewriter { font-weight: 700 }`. Every page **subtitle** is `14px`.
- All page **titles** (contact, about, cart, checkout, shop tabs) are `35px`,
  `--font-display`. The shared empty-state title matches at `35px`.
- **Navbar** links are `15px` **bold**; **footer** links are `13px` **bold**
  (both `--font-mono`, lowercase).

### Currency

- **All prices are in euros (€).** Never render `$`.
- Format money through the single helper `formatPrice()` in
  `src/utils/format.js` (`€` prefix, two decimals) — used by the shop card,
  product detail, cart, and checkout so currency is identical everywhere.

### Shape & spacing

- **Corner radii use exactly three tokens** (defined in `index.css`) — never a
  raw px value:
  - `--r-sm: 8px` — inputs/selects, small tags & badges, stepper `+/−` buttons.
  - `--r-md: 12px` — **all buttons**, chips, thumbnails, price tags, bordered
    info panels (contact card, checkout summary, pay-note).
  - `--r-lg: 20px` — elevated / media surfaces: product cards, cart items,
    carousel stage, about photo, FAQ modal.
  - Genuinely round elements (carousel arrows, pin/close badges, the nav count
    pill) stay `50%` / pill and are exempt.
- Both quantity steppers (the shared `AddToCart` green stepper and the cart
  page's qty control) share one shape: `--r-md` container, `--r-sm` buttons,
  `15px` glyph/count text.
- Page container gutter is `1.5rem`; content max-width is **`780px`** for
  cart / checkout / contact / about, and `1100px` for shop / product detail.
- `--nav-height: 60px`, `--footer-height: 52px`.
- **Elevation uses exactly two shadow tokens** — never a bespoke shadow:
  `--shadow-card` (resting cards, panels, media) and `--shadow-float` (hover
  lift, carousel arrows, stickers, the FAQ modal).

### Empty states

- Every "nothing here yet" screen (empty cart, empty checkout) uses the shared
  `.empty-state` block in `index.css` — title, blue icon, `Typewriter`
  subtitle, filled CTA — so they're pixel-identical in layout and position.

### Motion

- Tokens: `--dur-fast .2s`, `--dur-med .4s`, `--dur-slow .6s`;
  `--ease-standard: ease`, `--ease-spring: cubic-bezier(0.16,1,0.3,1)`.
- Nav + footer links: center **zoom on hover** (`scale(1.08)`), color → blue.
- Product cards: opacity-only entrance; hover lifts + tilts (desktop only).
- Route changes fade (`.page`) and scroll to top. All motion respects
  `prefers-reduced-motion`.

### Texture

Global grain overlay via `body::before` (feTurbulence SVG); `0.26` opacity on
mobile, `0.4` on desktop. The mobile home page adds floating blurred
blue/green blobs behind the content.

### Components

- `AddToCart` — shared add-to-cart control (blue button → green `+/−` stepper
  once in cart). Used by the shop card and product detail (`variant` sizes it).
- `icons.jsx` — single source for all inline SVG icons.
- Product/spec data lives in `data/products.js`; countries/cities/dial codes in
  `data/countries.js`.
