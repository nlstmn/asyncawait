import { useCart } from '../context/CartContext'
import './AddToCart.css'

/**
 * Add-to-cart control shared by the shop card and the product detail page.
 * Shows an "add to cart" button when the item isn't in the cart yet, and a
 * green +/- quantity stepper once it is. `variant` ('card' | 'detail') only
 * changes sizing. Clicks are stopped from bubbling so it works inside the
 * clickable product card.
 */
export default function AddToCart({ product, variant = 'card' }) {
  const { items, addItem, setQty } = useCart()
  const inCart = items.find(i => i.id === product.id)?.quantity || 0
  const stop = (e) => e.stopPropagation()

  if (!product.in_stock) {
    return (
      <button className={`atc atc--${variant}`} disabled onClick={stop}>
        sold out
      </button>
    )
  }

  if (inCart > 0) {
    return (
      <div className={`atc-step atc-step--${variant}`} onClick={stop}>
        <button
          className="atc-step__btn"
          onClick={(e) => { stop(e); setQty(product.id, inCart - 1) }}
          aria-label={`Remove one ${product.name}`}
        >−</button>
        <span className="atc-step__count">{inCart}</span>
        <button
          className="atc-step__btn"
          onClick={(e) => { stop(e); setQty(product.id, inCart + 1) }}
          aria-label={`Add one more ${product.name}`}
        >+</button>
      </div>
    )
  }

  return (
    <button
      className={`atc atc--${variant}`}
      onClick={(e) => { stop(e); addItem(product) }}
    >
      add to cart &gt;
    </button>
  )
}
