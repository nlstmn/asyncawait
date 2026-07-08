import { useEffect } from 'react'
import './FaqModal.css'

const FAQ = [
  {
    q: 'when will my order ship?',
    a: 'asynchronously. it resolves when it resolves — usually within 3–5 business days.',
  },
  {
    q: 'do you ship worldwide?',
    a: 'yes — anywhere a promise can reach. shipping is free for now.',
  },
  {
    q: 'can i return a mug?',
    a: 'sure, within 14 days. no breaking changes, please — unbroken mugs only.',
  },
  {
    q: 'are the mugs dishwasher-safe?',
    a: 'yes. thread-safe too.',
  },
  {
    q: 'how do i reach a human?',
    a: 'instagram, whatsapp or email — all linked below. we are async, but we do respond.',
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

  return (
    <div className="faq__overlay" onClick={onClose}>
      <div
        className="faq__dialog"
        role="dialog"
        aria-modal="true"
        aria-label="faq"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="faq__head">
          <h2 className="faq__title">faq</h2>
          <button className="faq__close" onClick={onClose} aria-label="Close FAQ">
            ✕
          </button>
        </div>

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
  )
}
