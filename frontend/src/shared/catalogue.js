// Single source of truth shared by the Vite app and the Netlify order
// function: the catalogue (so prices can't drift), the cart limit, money
// formatting, the cart-line label rule and the customer-field rules.
// Plain ESM with no imports, so the function bundles it without touching
// the app (images are added on top in data/products.js).

export const CATALOGUE = [
  {
    id: 1,
    name: 'it works on my machine',
    phrase: 'it works on my machine',
    finish: 'glossy',
    color: 'navy blue',
    description:
      'the classic excuse, hand-glazed glossy. a navy brush stroke on cream stoneware, "ok" in binary on the back.',
    price: 29.99,
  },
  {
    id: 2,
    name: 'it works on my machine',
    phrase: 'it works on my machine',
    finish: 'matte',
    color: 'navy blue',
    description:
      'same excuse, quieter surface. a navy brush stroke on matte cream stoneware, "ok" in binary on the back.',
    price: 29.99,
  },
  {
    id: 3,
    name: "can't reproduce",
    phrase: "can't reproduce",
    finish: 'matte',
    color: 'vintage green anthracite',
    description:
      'closed as cannot reproduce. matte vintage green anthracite glaze, "ok" in binary on the back.',
    price: 29.99,
  },
]

// a customer can put at most this many of one mug in an order
export const MAX_PER_ITEM = 3

// All prices are in euros. European format: comma decimal, € after the
// number (29,99 €). Every page and both emails go through this.
export const formatPrice = (amount) => `${Number(amount).toFixed(2).replace('.', ',')} €`

// Display name for an order line. Two mugs share a name and differ only by
// finish; when both are in the same list, append the finish so they can be
// told apart. Otherwise just the name.
export const itemLabel = (item, items) => {
  const twin = items.some(other => other.id !== item.id && other.name === item.name)
  return twin && item.finish ? `${item.name} · ${item.finish}` : item.name
}

// customer fields: the same checks on the form and on the server
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const POSTAL_RE = /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/
export const isPhone = (v) => /^[+\d\s().-]+$/.test(v) && (v.match(/\d/g) || []).length >= 7
export const FIELD_MAX = { firstName: 60, lastName: 60, email: 120, phone: 30, address: 200, postal: 12, city: 80, country: 60 }
