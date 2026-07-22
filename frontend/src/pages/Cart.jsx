import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ICONS } from '../components/icons'
import { formatPrice } from '../utils/format'
import Typewriter from '../components/Typewriter'
import './Cart.css'

export default function Cart() {
  const { items, setQty, removeItem, clear, subtotal } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h1 className="empty-state__title">your cart</h1>
        <span className="empty-state__icon" aria-hidden="true">{ICONS.cart}</span>
        <p className="empty-state__sub"><Typewriter text="no items staged for commit yet" /></p>
        <Link to="/shop" className="empty-state__btn">browse the shop &gt;</Link>
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
              <h3 className="cart__item-name">{item.name}</h3>
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
                aria-label={`Increase quantity of ${item.name}`}
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
        <button className="cart__clear" onClick={clear}>empty cart</button>

        <div className="cart__summary">
          <div className="cart__summary-row">
            <span>subtotal</span>
            <span className="cart__summary-total">{formatPrice(subtotal)}</span>
          </div>
          <span className="cart__free-badge">✓ free shipping across the EU</span>
          <button className="cart__checkout" onClick={() => navigate('/checkout')}>
            checkout &gt;
          </button>
          <Link to="/shop" className="cart__continue">&lt; keep shopping</Link>
        </div>
      </div>
    </div>
  )
}
