import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './FaqModal.css'

const FAQ = [
  {
    q: 'when will my order ship?',
    a: 'once your payment is in and we’ve confirmed the receipt, we ship within 2–4 business days and email you to confirm.',
  },
  {
    q: 'do you ship worldwide?',
    a: 'no — we ship within the EU only. shipping is free for now, and it reaches you in 4–8 days depending on the country.',
  },
  {
    q: 'can I return a mug?',
    a: 'no — our mugs can’t be returned. every one is handmade and one of a kind, so we can’t take on the cost of a return. to keep things transparent, we package each order carefully and send you detailed photos before it ships.',
  },
  {
    q: 'are the mugs dishwasher-safe?',
    a: 'yes. thread-safe too.',
  },
  {
    q: 'how do I reach a human?',
    a: 'Instagram, WhatsApp, or email — all linked below. we’re async, but we do respond.',
  },
]

export default function FaqModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // portal to <body>: escapes the page/footer stacking contexts so the
  // overlay really covers everything (navbar + footer included)
  return createPortal(
    <div className="faq__overlay" onClick={onClose}>
      <div
        className="faq__dialog"
        role="dialog"
        aria-modal="true"
        aria-label="faq"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="faq__close" onClick={onClose} aria-label="Close FAQ">
          ✕
        </button>

        <div className="faq__scroll">
          <h2 className="faq__title">faq</h2>

          <dl className="faq__list">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="faq__item">
                <dt className="faq__q">// {q}</dt>
                <dd className="faq__a">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>,
    document.body
  )
}
