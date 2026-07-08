import { useState } from 'react'
import FaqModal from '../components/FaqModal'
import './Contact.css'

const CONTACTS = [
  {
    icon: '📸',
    label: 'instagram',
    value: '@asyncdrip',
    href: 'https://instagram.com/asyncdrip',
  },
  {
    icon: '💬',
    label: 'whatsapp',
    value: '+34 652 21 22 71',
    href: 'https://wa.me/34652212271',
  },
  {
    icon: '✉️',
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
        <p className="contact__subtitle">we're async — but we do respond</p>
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
            <span className="contact__icon">{c.icon}</span>
            <div className="contact__info">
              <span className="contact__label">{c.label}</span>
              <span className="contact__value">{c.value}</span>
            </div>
          </a>
        ))}

        <button className="contact__card contact__card--btn" onClick={() => setFaqOpen(true)}>
          <span className="contact__icon">❓</span>
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
