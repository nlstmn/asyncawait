import { useState } from 'react'
import FaqModal from '../components/FaqModal'
import Typewriter from '../components/Typewriter'
import './Contact.css'

const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  faq: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
}

const CONTACTS = [
  {
    label: 'instagram',
    value: '@asyncdrip',
    href: 'https://instagram.com/asyncdrip',
  },
  {
    label: 'whatsapp',
    value: '+34 652 21 22 71',
    href: 'https://wa.me/34652212271',
  },
  {
    label: 'email',
    value: 'nlstmn@gmail.com',
    href: 'mailto:nlstmn@gmail.com',
  },
]

export default function Contact() {
  const [faqOpen, setFaqOpen] = useState(false)

  return (
    <div className="contact">
      <header className="contact__header">
        <h1 className="contact__title">contact</h1>
        <p className="contact__subtitle">
          <Typewriter text="we're async — but we do respond" />
        </p>
      </header>

      <div className="contact__cards">
        {CONTACTS.map(c => (
          <a
            key={c.label}
            className="contact__card"
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact__icon">{ICONS[c.label]}</span>
            <div className="contact__info">
              <span className="contact__label">{c.label}</span>
              <span className="contact__value">{c.value}</span>
            </div>
          </a>
        ))}

        <button className="contact__card contact__card--btn" onClick={() => setFaqOpen(true)}>
          <span className="contact__icon">{ICONS.faq}</span>
          <div className="contact__info">
            <span className="contact__label">faq</span>
            <span className="contact__value">frequently asked questions</span>
          </div>
        </button>
      </div>

      {faqOpen && <FaqModal onClose={() => setFaqOpen(false)} />}
    </div>
  )
}
