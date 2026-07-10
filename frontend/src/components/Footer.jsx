import { useState } from 'react'
import { Link } from 'react-router-dom'
import FaqModal from './FaqModal'
import './Footer.css'

const ICONS = {
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
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

export default function Footer() {
  const [faqOpen, setFaqOpen] = useState(false)

  return (
    <footer className="footer">
      <nav className="footer__links" aria-label="Footer">
        <Link to="/contact" aria-label="contact">
          <span className="footer__icon">{ICONS.contact}</span>
          <span className="footer__label">contact</span>
        </Link>
        <a href="https://instagram.com/asyncdrip" target="_blank" rel="noopener noreferrer" aria-label="instagram">
          <span className="footer__icon">{ICONS.instagram}</span>
          <span className="footer__label">instagram</span>
        </a>
        <a href="https://wa.me/34652212271" target="_blank" rel="noopener noreferrer" aria-label="whatsapp">
          <span className="footer__icon">{ICONS.whatsapp}</span>
          <span className="footer__label">whatsapp</span>
        </a>
        <a href="mailto:nlstmn@gmail.com" aria-label="email">
          <span className="footer__icon">{ICONS.email}</span>
          <span className="footer__label">email</span>
        </a>
        <button className="footer__faq-btn" onClick={() => setFaqOpen(true)} aria-label="faq">
          <span className="footer__icon">{ICONS.faq}</span>
          <span className="footer__label">faq</span>
        </button>
      </nav>

      <span className="footer__copy">© 2026 async/await</span>

      {faqOpen && <FaqModal onClose={() => setFaqOpen(false)} />}
    </footer>
  )
}
