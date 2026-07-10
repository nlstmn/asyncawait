import { useState } from 'react'
import { Link } from 'react-router-dom'
import FaqModal from './FaqModal'
import { ICONS } from './icons'
import './Footer.css'

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
