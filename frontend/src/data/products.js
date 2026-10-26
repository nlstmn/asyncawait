// Product catalogue for the app: the shared catalogue (names, finishes,
// prices — also used by the order function) plus the bundled images.
//
// Three mugs. Every one carries the "ok" signature on the back, written in
// binary (0110111101101011 = "ok"), and a phrase on the front.
// Each product opens with two product shots — front (phrase) and back
// (binary) — followed by lifestyle photos from the shoot. Shots that show
// several mugs at once are shared between the products they feature.
import iwommGlossyFront from '../assets/products/iwomm-glossy-front.jpg'
import iwommGlossyBack from '../assets/products/iwomm-glossy-back.jpg'
import iwommMatteFront from '../assets/products/iwomm-matte-front.jpg'
import iwommMatteBack from '../assets/products/iwomm-matte-back.jpg'
import cantReproduceFront from '../assets/products/cant-reproduce-front.jpg'
import cantReproduceBack from '../assets/products/cant-reproduce-back.jpg'
// lifestyle — "it works on my machine" (finish per shot confirmed by Liana)
import iwommBooksCoffee from '../assets/lifestyle/iwomm-books-coffee.jpg'   // glossy
import iwommEarphones from '../assets/lifestyle/iwomm-earphones.jpg'        // matte
import iwommCoffeeHands from '../assets/lifestyle/iwomm-coffee-hands.jpg'   // matte
import iwommHeldBack from '../assets/lifestyle/iwomm-held-back.jpg'         // matte
import iwommMokaPour from '../assets/lifestyle/iwomm-moka-pour.jpg'         // glossy
// lifestyle — "can't reproduce"
import cantReproduceHeld from '../assets/lifestyle/cant-reproduce-held.jpg'
import cantReproduceMokaPour from '../assets/lifestyle/cant-reproduce-moka-pour.jpg'
// lifestyle — several mugs in one frame
import duoWall from '../assets/lifestyle/duo-wall.jpg'     // can't reproduce on iwomm (back)
import duoStool from '../assets/lifestyle/duo-stool.jpg'   // can't reproduce (back) on iwomm
import collectionTray from '../assets/lifestyle/collection-tray.jpg'
import collectionHeld from '../assets/lifestyle/collection-held.jpg'

import { CATALOGUE, MAX_PER_ITEM } from '../shared/catalogue'

// per mug: front (phrase), back (binary "ok"), then lifestyle shots
const IMAGES = {
  1: [iwommGlossyFront, iwommGlossyBack, iwommBooksCoffee, iwommMokaPour, duoWall, collectionTray, collectionHeld],
  2: [iwommMatteFront, iwommMatteBack, iwommEarphones, iwommCoffeeHands, iwommHeldBack, duoStool, collectionHeld],
  3: [cantReproduceFront, cantReproduceBack, cantReproduceHeld, cantReproduceMokaPour, duoWall, duoStool, collectionTray, collectionHeld],
}

export const PRODUCTS = CATALOGUE.map(p => ({
  ...p,
  image_url: IMAGES[p.id][0],
  images: IMAGES[p.id],
  in_stock: true,
}))

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

export { MAX_PER_ITEM }
