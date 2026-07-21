import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { COUNTRIES, DIAL_CODES } from '../data/countries'
import { formatPrice } from '../utils/format'
import Typewriter from '../components/Typewriter'
import './Checkout.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const POSTAL_RE = /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', confirmEmail: '', dial: '+34', phone: '',
    address: '', country: '', city: '', postal: '',
  })
  const [status, setStatus] = useState('idle') // idle | submitting | done | error
  const [error, setError] = useState(null)
  const [order, setOrder] = useState(null)

  // selecting a country resets the (now-stale) city choice
  const update = (e) => {
    const { name, value } = e.target
    setForm(f => (name === 'country' ? { ...f, country: value, city: '' } : { ...f, [name]: value }))
  }

  const cities = COUNTRIES.find(c => c.name === form.country)?.cities || []

  // ── validation ──
  const emailOk  = EMAIL_RE.test(form.email)
  const emailsMatch = form.email === form.confirmEmail
  const phoneOk  = /^[+\d\s().-]+$/.test(form.phone) && (form.phone.match(/\d/g) || []).length >= 7
  const postalOk = POSTAL_RE.test(form.postal)
  const isValid =
    form.firstName.trim() && form.lastName.trim() && form.address.trim() &&
    form.country && form.city && emailOk && emailsMatch && phoneOk && postalOk

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    // static site: no backend — simulate an async "commit" and confirm locally
    setTimeout(() => {
      setOrder({
        id: Math.floor(1000 + Math.random() * 9000),
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        total: subtotal,
      })
      setStatus('done')
      clear()
      window.scrollTo(0, 0) // success screen starts at the top (esp. mobile)
    }, 700)
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
            total <strong>{formatPrice(order.total)}</strong> · confirmation sent to {order.email}
          </p>
          <p className="checkout__pay-note">
            check your email 📨 payment is handled manually for now — we'll send
            you IBAN / Bizum / Revolut details to settle your order before online
            payment goes live.
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
        <p className="checkout__empty-msg">// nothing to check out</p>
        <Link to="/shop" className="checkout__back">browse the shop &gt;</Link>
      </div>
    )
  }

  return (
    <div className="checkout">
      <header className="checkout__header">
        <h1 className="checkout__title">checkout</h1>
        <p className="checkout__subtitle"><Typewriter text="last step before deploy" /></p>
      </header>

      <div className="checkout__grid">
        <form className="checkout__form" onSubmit={handleSubmit}>
          <div className="checkout__row">
            <label className="checkout__field">
              <span>first name</span>
              <input
                name="firstName"
                value={form.firstName}
                onChange={update}
                required
                autoComplete="given-name"
                placeholder="ada"
              />
            </label>

            <label className="checkout__field">
              <span>surname</span>
              <input
                name="lastName"
                value={form.lastName}
                onChange={update}
                required
                autoComplete="family-name"
                placeholder="lovelace"
              />
            </label>
          </div>

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
            {form.email && !emailOk && <span className="checkout__err">enter a valid email</span>}
          </label>

          <label className="checkout__field">
            <span>confirm email</span>
            <input
              type="email"
              name="confirmEmail"
              value={form.confirmEmail}
              onChange={update}
              required
              autoComplete="off"
              placeholder="re-enter your email"
            />
            {form.confirmEmail && !emailsMatch && <span className="checkout__err">emails don't match</span>}
          </label>

          <label className="checkout__field">
            <span>phone</span>
            <div className="checkout__phone">
              <select
                name="dial"
                value={form.dial}
                onChange={update}
                className="checkout__dial"
                aria-label="country dialing code"
              >
                {DIAL_CODES.map(c => (
                  <option key={c.name} value={c.dial}>{c.flag} {c.dial}</option>
                ))}
              </select>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={update}
                required
                autoComplete="tel"
                placeholder="600 000 000"
              />
            </div>
            {form.phone && !phoneOk && <span className="checkout__err">enter a valid phone number</span>}
          </label>

          <label className="checkout__field">
            <span>shipping address</span>
            <input
              name="address"
              value={form.address}
              onChange={update}
              required
              autoComplete="street-address"
              placeholder="carrer de la ràdio, 12, 2n 1a"
            />
          </label>

          <label className="checkout__field">
            <span>country</span>
            <select name="country" value={form.country} onChange={update} required>
              <option value="" disabled>select a country</option>
              {COUNTRIES.map(c => (
                <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
              ))}
            </select>
          </label>

          <div className="checkout__row">
            <label className="checkout__field">
              <span>city</span>
              <select name="city" value={form.city} onChange={update} required disabled={!form.country}>
                <option value="" disabled>{form.country ? 'select a city' : 'pick a country first'}</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="checkout__field checkout__field--postal">
              <span>postal code</span>
              <input
                name="postal"
                value={form.postal}
                onChange={update}
                required
                autoComplete="postal-code"
                placeholder="08001"
              />
              {form.postal && !postalOk && <span className="checkout__err">enter a valid postal code</span>}
            </label>
          </div>

          {status === 'error' && (
            <p className="checkout__error">// {error}</p>
          )}

          <button
            className="checkout__submit"
            type="submit"
            disabled={!isValid || status === 'submitting'}
          >
            {status === 'submitting' ? 'committing…' : `place order · ${formatPrice(subtotal)}`}
          </button>
        </form>

        <aside className="checkout__summary">
          <h2 className="checkout__summary-title">order summary</h2>
          <ul className="checkout__items">
            {items.map(item => (
              <li key={item.id} className="checkout__item">
                <span className="checkout__item-name">
                  {item.name} <span className="checkout__item-qty">×{item.quantity}</span>
                </span>
                <span className="checkout__item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="checkout__summary-total">
            <span>total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
