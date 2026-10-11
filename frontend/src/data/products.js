// Static product catalogue — the site ships as a fully static Netlify build,
// so the mugs live here instead of coming from the FastAPI backend.
//
// Three mugs. Every one carries the "ok" signature on the back, written in
// binary (0110111101101011 = "ok"), and a phrase on the front.
// Images are placeholders until real product photos are added.
export const PRODUCTS = [
  {
    id: 1,
    name: 'it works on my machine',
    phrase: 'it works on my machine',
    finish: 'glossy',
    color: 'navy blue',
    description:
      'the classic excuse, hand-glazed glossy. a navy brush stroke on cream stoneware, "ok" in binary on the back.',
    price: 25.99,
    image_url: 'https://loremflickr.com/600/600/ceramic,mug,coffee?lock=11',
    category: 'mug',
    in_stock: true,
  },
  {
    id: 2,
    name: 'it works on my machine',
    phrase: 'it works on my machine',
    finish: 'matte',
    color: 'navy blue',
    description:
      'same excuse, quieter surface. a navy brush stroke on matte cream stoneware, "ok" in binary on the back.',
    price: 25.99,
    image_url: 'https://loremflickr.com/600/600/coffee,cup,handmade?lock=12',
    category: 'mug',
    in_stock: true,
  },
  {
    id: 3,
    name: "can't reproduce",
    phrase: "can't reproduce",
    finish: 'matte',
    color: 'vintage green anthracite',
    description:
      'closed as cannot reproduce. matte vintage green anthracite glaze, "ok" in binary on the back.',
    price: 25.99,
    image_url: 'https://loremflickr.com/600/600/espresso,mug?lock=13',
    category: 'mug',
    in_stock: true,
  },
]

export const getProductById = (id) =>
  PRODUCTS.find(p => String(p.id) === String(id))

// the "ok" on the back of every mug, as it's actually written
export const OK_BINARY = '0110111101101011'

// spec chips shared by every mug (per-mug finish/color come from the product;
// material/care live in the detail spec sheet, not here)
export const CHIPS = ['480 ml', 'handmade', 'unique style for each']

// a customer can put at most this many of one mug in the cart
export const MAX_PER_ITEM = 3
