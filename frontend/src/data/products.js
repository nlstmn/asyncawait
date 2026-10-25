// Static product catalogue — the site ships as a fully static Netlify build,
// so the mugs live here instead of coming from the FastAPI backend.
//
// Three mugs. Every one carries the "ok" signature on the back, written in
// binary (0110111101101011 = "ok"), and a phrase on the front.
// Each product opens with two product shots — front (phrase) and back
// (binary) — followed by lifestyle photos from the shoot. Shots that show
// several mugs at once are shared between the products they feature.
import iwommGlossyFront from '../assets/iwomm-glossy-front.jpg'
import iwommGlossyBack from '../assets/iwomm-glossy-back.jpg'
import iwommMatteFront from '../assets/iwomm-matte-front.jpg'
import iwommMatteBack from '../assets/iwomm-matte-back.jpg'
import cantReproduceFront from '../assets/cant-reproduce-front.jpg'
import cantReproduceBack from '../assets/cant-reproduce-back.jpg'
// lifestyle — "it works on my machine"
import iwommBooksCoffee from '../assets/iwomm-books-coffee.jpg'
import iwommEarphones from '../assets/iwomm-earphones.jpg'
import iwommCoffeeHands from '../assets/iwomm-coffee-hands.jpg'
import iwommHeldBack from '../assets/iwomm-held-back.jpg'
import iwommMokaPour from '../assets/iwomm-moka-pour.jpg'
// lifestyle — "can't reproduce"
import cantReproduceHeld from '../assets/cant-reproduce-held.jpg'
import cantReproduceMokaPour from '../assets/cant-reproduce-moka-pour.jpg'
// lifestyle — several mugs in one frame
import duoWall from '../assets/duo-wall.jpg'     // can't reproduce on iwomm (back)
import duoStool from '../assets/duo-stool.jpg'   // can't reproduce (back) on iwomm
import collectionTray from '../assets/collection-tray.jpg'
import collectionHeld from '../assets/collection-held.jpg'
// rendered hang tag (transparent PNG) carrying the description — per mug;
// mugs without one fall back to the CSS kraft tag
import iwommGlossyTag from '../assets/iwomm-glossy-tag.png'

export const PRODUCTS = [
  {
    id: 1,
    name: 'it works on my machine',
    phrase: 'it works on my machine',
    finish: 'glossy',
    color: 'navy blue',
    description:
      'the classic excuse, hand-glazed glossy. a navy brush stroke on cream stoneware, "ok" in binary on the back.',
    price: 29.99,
    tag: iwommGlossyTag,
    image_url: iwommGlossyFront,
    images: [
      iwommGlossyFront, iwommGlossyBack,
      iwommBooksCoffee, iwommEarphones, iwommCoffeeHands, iwommHeldBack,
      duoWall, collectionHeld,
    ],
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
    price: 29.99,
    image_url: iwommMatteFront,
    images: [
      iwommMatteFront, iwommMatteBack,
      iwommMokaPour, duoStool, collectionTray, collectionHeld,
    ],
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
    price: 29.99,
    image_url: cantReproduceFront,
    images: [
      cantReproduceFront, cantReproduceBack,
      cantReproduceHeld, cantReproduceMokaPour,
      duoWall, duoStool, collectionTray, collectionHeld,
    ],
    category: 'mug',
    in_stock: true,
  },
]

// Where the mug sits in each lifestyle photo, as a CSS object-position. The
// stage and thumbnails crop the 2:3 photos to a square, so without this the
// crop centres on the frame, not on the mug. Photos not listed are centred.
const FOCUS = {
  [iwommBooksCoffee]: '50% 20%',
  [iwommCoffeeHands]: '50% 25%',
  [iwommHeldBack]: '50% 40%',
  [iwommMokaPour]: '50% 60%',
  [duoStool]: '50% 40%',
  [duoWall]: '50% 45%',
}
export const imageFocus = (src) => FOCUS[src] ?? '50% 50%'

export const getProductById = (id) =>
  PRODUCTS.find(p => String(p.id) === String(id))

// the "ok" on the back of every mug, as it's actually written
export const OK_BINARY = '0110111101101011'

// spec chips shared by every mug (per-mug finish/color come from the product;
// material/care live in the detail spec sheet, not here)
export const CHIPS = ['480 ml', 'handmade', 'unique style for each']

// a customer can put at most this many of one mug in the cart
export const MAX_PER_ITEM = 3
