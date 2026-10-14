import { getProductById } from '../data/products'

// All prices are in euros — single source of money formatting so every page
// (shop card, product detail, cart, checkout) renders currency identically.
// European format: comma decimal, € after the number (e.g. 29,99 €).
export const formatPrice = (amount) => `${Number(amount).toFixed(2).replace('.', ',')} €`

// Display name for a cart line. Two mugs can share a name and differ only by
// finish (glossy / matte); when that happens in the same list, append the
// finish so the customer can tell them apart. Otherwise just the name.
export const itemLabel = (item, items) => {
  const twin = items.some(other => other.id !== item.id && other.name === item.name)
  if (!twin) return item.name
  const finish = item.finish ?? getProductById(item.id)?.finish
  return finish ? `${item.name} · ${finish}` : item.name
}
