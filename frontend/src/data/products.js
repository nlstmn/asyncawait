// Static product catalogue — the site ships as a fully static Netlify build,
// so the mugs live here instead of coming from the FastAPI backend.
export const PRODUCTS = [
  {
    id: 1,
    name: 'async',
    description: 'Start your morning with async/await. Dark roast, async-safe.',
    price: 14.99,
    image_url: 'https://loremflickr.com/600/600/ceramic,mug,coffee?lock=11',
    category: 'mug',
    in_stock: true,
  },
  {
    id: 2,
    name: 'promise',
    description: 'Always resolves. Eventually.',
    price: 12.99,
    image_url: 'https://loremflickr.com/600/600/coffee,cup,handmade?lock=12',
    category: 'mug',
    in_stock: true,
  },
  {
    id: 3,
    name: 'deadlock',
    description: 'Two threads enter. Neither leaves.',
    price: 13.99,
    image_url: 'https://loremflickr.com/600/600/espresso,mug?lock=13',
    category: 'mug',
    in_stock: true,
  },
  {
    id: 4,
    name: 'nullpointer',
    description: 'A classic. A tragedy.',
    price: 11.99,
    image_url: 'https://loremflickr.com/600/600/latte,mug,ceramic?lock=14',
    category: 'mug',
    in_stock: true,
  },
]

export const getProductById = (id) =>
  PRODUCTS.find(p => String(p.id) === String(id))

// spec chips shown on cards and the product detail page
export const CHIPS = ['ceramic', '325 ml', 'dishwasher-safe', 'handmade', 'unique style for each']
