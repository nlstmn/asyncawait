import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { formatPrice, itemLabel } from '../shared/catalogue'
import './Modal.css'
import './ConfirmOrderModal.css'

/**
 * Last look before the order is placed: who it's for, where it ships, what's
 * in it, and the total. `onConfirm` runs the real submit; `onCancel` goes back
 * to the form. Escape / backdrop click / the "x" cancel.
 */
export default function ConfirmOrderModal({ form, items, total, busy, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onCancel() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onCancel, busy])

  return createPortal(
    <div className="modal__overlay" onClick={busy ? undefined : onCancel}>
      <div
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onCancel} disabled={busy} aria-label="Close">
          ✕
        </button>

        <div className="modal__scroll">
          <h2 id="confirm-title" className="modal__title">confirm your order</h2>

          <dl className="confirm__meta">
            <div className="confirm__row">
              <dt>name</dt>
              <dd>{form.firstName} {form.lastName}</dd>
            </div>
            <div className="confirm__row">
              <dt>email</dt>
              <dd>{form.email}</dd>
            </div>
            <div className="confirm__row">
              <dt>phone</dt>
              <dd>{form.dial} {form.phone}</dd>
            </div>
            <div className="confirm__row">
              <dt>ships to</dt>
              <dd>{form.address}, {form.postal} {form.city}, {form.country}</dd>
            </div>
          </dl>

          <div className="confirm__table table">
            {items.map(item => (
              <div key={item.id} className="table__row">
                <span className="confirm__item-name">
                  {itemLabel(item, items)} <span className="confirm__item-qty">×{item.quantity}</span>
                </span>
                <span className="confirm__item-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="table__row table__row--total">
              <span className="table__label">total · free shipping</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="confirm__actions">
            <button type="button" className="confirm__cancel" onClick={onCancel} disabled={busy}>
              &lt; edit details
            </button>
            <button type="button" className="confirm__ok" onClick={onConfirm} disabled={busy}>
              {busy ? 'committing…' : 'confirm order >'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
