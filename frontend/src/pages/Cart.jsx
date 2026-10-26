import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ICONS } from '../components/icons'
import { formatPrice, itemLabel } from '../shared/catalogue'
import Typewriter from '../components/Typewriter'
import './Cart.css'

export default function Cart() {
  const { items, setQty, removeItem, clear, total, maxPerItem } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="status">
        <h1 className="status__title">your cart</h1>
        <span className="status__icon" aria-hidden="true">{ICONS.cart}</span>
        <p className="status__sub"><Typewriter text="no items staged for commit yet" /></p>
        <Link to="/shop" className="status__btn">browse the shop &gt;</Link>
      </div>
    )
  }

  return (
    <div className="cart">
      <header className="cart__header">
        <h1 className="cart__title">your cart</h1>
        <p className="cart__subtitle"><Typewriter text="review before you push to prod" /></p>
      </header>

      <ul className="cart__list">
        {items.map(item => (
          <li key={item.id} className="cart__item">
            <img className="cart__item-img" src={item.image_url} alt={item.name} loading="lazy" />

            <div className="cart__item-info">
              <h3 className="cart__item-name">{itemLabel(item, items)}</h3>
              <span className="cart__item-price">{formatPrice(item.price)} each</span>
            </div>

            <div className="cart__qty">
              <button
                className="cart__qty-btn"
                onClick={() => setQty(item.id, item.quantity - 1)}
                aria-label={`Decrease quantity of ${item.name}`}
              >−</button>
              <span className="cart__qty-value">{item.quantity}</span>
              <button
                className="cart__qty-btn"
                onClick={() => setQty(item.id, item.quantity + 1)}
                disabled={item.quantity >= maxPerItem}
                title={item.quantity >= maxPerItem ? `max ${maxPerItem} per mug` : undefined}
                aria-label={item.quantity >= maxPerItem ? `Maximum ${maxPerItem} per mug` : `Increase quantity of ${item.name}`}
              >+</button>
            </div>

            <span className="cart__item-total">{formatPrice(item.price * item.quantity)}</span>

            <button
              className="cart__remove"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name} from cart`}
            >×</button>
          </li>
        ))}
      </ul>

      <div className="cart__footer">
        <div className="cart__actions">
          <Link to="/shop" className="cart__continue">&lt; keep shopping</Link>
          <button className="cart__clear" onClick={clear} aria-label="empty cart">
            <span className="cart__clear-icon" aria-hidden="true">{ICONS.trash}</span>
            <span className="cart__clear-text">empty cart</span>
          </button>
        </div>

        {/* bordered summary panel; on phones it becomes a sticky bar pinned
            to the bottom of the screen */}
        <div className="cart__summary panel bar">
          <div className="cart__summary-row">
            <span className="cart__summary-label">
              total
              <small className="cart__free">✓ free EU shipping</small>
            </span>
            <span className="cart__summary-total">{formatPrice(total)}</span>
          </div>
          <button className="cart__checkout" onClick={() => navigate('/checkout')}>
            checkout &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
