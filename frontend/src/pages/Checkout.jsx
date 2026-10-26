import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { COUNTRIES, DIAL_CODES } from '../data/countries'
import { formatPrice, itemLabel, EMAIL_RE, POSTAL_RE, isPhone } from '../shared/catalogue'
import { placeOrder as sendOrder } from '../utils/orders'
import { ICONS } from '../components/icons'
import Typewriter from '../components/Typewriter'
import ConfirmOrderModal from '../components/ConfirmOrderModal'
import './Checkout.css'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', confirmEmail: '', dial: '+34', phone: '',
    address: '', country: '', city: '', postal: '',
    website: '', // honeypot, stays empty for humans
  })
  const [status, setStatus] = useState('idle') // idle | submitting | done | error
  const [error, setError] = useState(null)
  const [order, setOrder] = useState(null)
  const [confirming, setConfirming] = useState(false) // confirm-order modal open

  // selecting a country resets the (now-stale) city choice
  const update = (e) => {
    const { name, value } = e.target
    setForm(f => (name === 'country' ? { ...f, country: value, city: '' } : { ...f, [name]: value }))
  }

  const cities = COUNTRIES.find(c => c.name === form.country)?.cities || []

  // ── validation ──
  const emailOk  = EMAIL_RE.test(form.email)
  const emailsMatch = form.email === form.confirmEmail
  const phoneOk  = isPhone(form.phone)
  const postalOk = POSTAL_RE.test(form.postal)
  const isValid =
    form.firstName.trim() && form.lastName.trim() && form.address.trim() &&
    form.country && form.city && emailOk && emailsMatch && phoneOk && postalOk

  // submitting the form only opens the confirm modal; the order is placed
  // from there
  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    setConfirming(true)
  }

  const placeOrder = async () => {
    setStatus('submitting')
    try {
      // POSTs to the Netlify function, which emails the customer + the shop
      const { id, emailed } = await sendOrder({ form, items, total, website: form.website })
      setOrder({
        id,
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        total,
        emailed: emailed !== false,
      })
      setConfirming(false)
      setStatus('done')
      clear()
      window.scrollTo(0, 0) // success screen starts at the top (esp. mobile)
    } catch (err) {
      setConfirming(false)
      setStatus('error')
      setError(err.message || "couldn't place the order — try again or email us")
    }
  }

  if (status === 'done' && order) {
    // same shared layout as the empty-cart / empty-checkout screens
    return (
      <div className="status">
        <h1 className="status__title">order committed!</h1>
        <span className="status__icon status__icon--ok" aria-hidden="true">✓</span>
        <p className="status__sub">
          thanks {order.name.split(' ')[0]} — order <span className="checkout__oid">#{order.id}</span> is in.
        </p>
        <p className="checkout__success-sub">
          total <strong>{formatPrice(order.total)}</strong>
          {order.emailed ? ` · confirmation sent to ${order.email}` : ' · we have your order and will email you shortly'}
        </p>
        <p className="checkout__pay-note">
          check your email 📨 payment is handled manually for now — we'll send
          you IBAN / Bizum / Revolut details to settle your order before online
          payment goes live.
        </p>
        <Link to="/shop" className="status__btn">back to the shop &gt;</Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="status">
        <h1 className="status__title">checkout</h1>
        <span className="status__icon" aria-hidden="true">{ICONS.cart}</span>
        <p className="status__sub"><Typewriter text="nothing to check out yet" /></p>
        <Link to="/shop" className="status__btn">browse the shop &gt;</Link>
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
              aria-invalid={Boolean(form.email) && !emailOk}
            />
            {form.email && !emailOk && <span className="checkout__err" role="alert">enter a valid email</span>}
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
              aria-invalid={Boolean(form.confirmEmail) && !emailsMatch}
            />
            {form.confirmEmail && !emailsMatch && <span className="checkout__err" role="alert">emails don't match</span>}
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
                aria-invalid={Boolean(form.phone) && !phoneOk}
              />
            </div>
            {form.phone && !phoneOk && <span className="checkout__err" role="alert">enter a valid phone number</span>}
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
                aria-invalid={Boolean(form.postal) && !postalOk}
              />
              {form.postal && !postalOk && <span className="checkout__err" role="alert">enter a valid postal code</span>}
            </label>
          </div>

          {/* honeypot: hidden from people, filled by form-stuffing bots */}
          <label className="checkout__trap" aria-hidden="true">
            <span>website</span>
            <input name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" />
          </label>

          {status === 'error' && (
            <p className="checkout__error">// {error}</p>
          )}

          <button
            className="checkout__submit"
            type="submit"
            disabled={!isValid || status === 'submitting'}
          >
            {status === 'submitting' ? 'committing…' : `place order · ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="checkout__summary">
          <h2 className="checkout__summary-title">order summary</h2>
          <ul className="checkout__items">
            {items.map(item => (
              <li key={item.id} className="checkout__item">
                <span className="checkout__item-name">
                  {itemLabel(item, items)} <span className="checkout__item-qty">×{item.quantity}</span>
                </span>
                <span className="checkout__item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="checkout__ship">
            <span>shipping</span>
            <span className="checkout__free">free</span>
          </div>
          <div className="checkout__summary-total">
            <span>total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>

      {confirming && (
        <ConfirmOrderModal
          form={form}
          items={items}
          total={total}
          busy={status === 'submitting'}
          onConfirm={placeOrder}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  )
}
