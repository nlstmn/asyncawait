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

Light theme only (no dark mode). On lime green (`--brand-green`) always use dark
text (`#0d0d0d`) for contrast, never white.

### Typography

- `--font-display` (Slow Play): page titles / tab titles / product & mug names.
- `--font-heading` (Garlic Butter): reserved heading face.
- `--font-body` (Poppins): body copy, form inputs.
- `--font-mono` (Courier New): taglines, prices, chips, nav/footer, buttons, specs.
- Typewriter taglines/subtitles use the `Typewriter` component and render bold
  via `.typewriter { font-weight: 700 }`. Every page **subtitle** is `0.85rem`.
- All page **titles** (contact, about, cart, checkout, shop tabs) are `2.2rem`,
  `--font-display`.

### Shape & spacing

- **All buttons use `border-radius: 12px`.** (Round elements — qty steppers'
  `+/−`, carousel arrows, pin/close badges — stay circular.)
- Page container gutter is `1.5rem`; content max-width is **`780px`** for
  cart / checkout / contact / about, and `1100px` for shop / product detail.
- `--nav-height: 60px`, `--footer-height: 52px`.

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
