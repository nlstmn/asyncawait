import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../api/orders'
import './Checkout.css'

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const [form, setForm] = useState({ name: '', email: '', address: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | done | error
  const [error, setError] = useState(null)
  const [order, setOrder] = useState(null)

  const update = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    try {
      const result = await createOrder({ ...form, items })
      setOrder(result)
      setStatus('done')
      clear()
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  if (status === 'done' && order) {
    return (
      <div className="checkout checkout--done">
        <div className="checkout__success">
          <span className="checkout__check">✓</span>
          <h1 className="checkout__title">order committed!</h1>
          <p className="checkout__success-msg">
            thanks {order.name.split(' ')[0]} — order <span className="checkout__oid">#{order.id}</span> is in.
          </p>
          <p className="checkout__success-sub">
            total <strong>${order.total.toFixed(2)}</strong> · confirmation sent to {order.email}
          </p>
          <Link to="/shop" className="checkout__back">&lt; back to the shop</Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="checkout checkout--empty">
        <h1 className="checkout__title">checkout</h1>
        <p className="checkout__empty-msg">// nothing to check out<span className="blink">_</span></p>
        <Link to="/shop" className="checkout__back">browse the shop &gt;</Link>
      </div>
    )
  }

  return (
    <div className="checkout">
      <header className="checkout__header">
        <h1 className="checkout__title">checkout</h1>
        <p className="checkout__subtitle">last step before deploy</p>
      </header>

      <div className="checkout__grid">
        <form className="checkout__form" onSubmit={handleSubmit}>
          <label className="checkout__field">
            <span>name</span>
            <input
              name="name"
              value={form.name}
              onChange={update}
              required
              autoComplete="name"
              placeholder="ada lovelace"
            />
          </label>

          <label className="checkout__field">
            <span>email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              required
              autoComplete="email"
              placeholder="ada@example.com"
            />
          </label>

          <label className="checkout__field">
            <span>shipping address</span>
            <textarea
              name="address"
              value={form.address}
              onChange={update}
              required
              rows={3}
              autoComplete="street-address"
              placeholder="1 analytical engine way, london"
            />
          </label>

          {status === 'error' && (
            <p className="checkout__error">// {error}</p>
          )}

          <button
            className="checkout__submit"
            type="submit"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'committing…' : `place order · $${subtotal.toFixed(2)}`}
          </button>
        </form>

        <aside className="checkout__summary">
          <h2 className="checkout__summary-title">order summary</h2>
          <ul className="checkout__items">
            {items.map(item => (
              <li key={item.id} className="checkout__item">
                <span className="checkout__item-name">
                  {item.name}
                  <span className="checkout__item-qty">×{item.quantity}</span>
                </span>
                <span className="checkout__item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="checkout__summary-total">
            <span>total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
