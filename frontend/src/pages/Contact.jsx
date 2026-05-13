import React from 'react'
import './Contact.css'

const CONTACTS = [
  {
    icon: '📸',
    label: 'instagram',
    value: '@asyncdrip',
    href: 'https://instagram.com/asyncdrip',
  },
  {
    icon: '✉️',
    label: 'email',
    value: 'nlstmn@gmail.com',
    href: 'mailto:nlstmn@gmail.com',
  },
  {
    icon: '💬',
    label: 'whatsapp',
    value: '+34 652 21 22 71',
    href: 'https://wa.me/34652212271',
  },
]

export default function Contact() {
  return (
    <div className="contact">
      <header className="contact__header">
        <h1 className="contact__title">contact</h1>
        <p className="contact__subtitle">// we're async — but we do respond</p>
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
      </div>
    </div>
  )
}
