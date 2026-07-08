import { useState } from 'react'
import { Link } from 'react-router-dom'
import FaqModal from './FaqModal'
import './Footer.css'

export default function Footer() {
  const [faqOpen, setFaqOpen] = useState(false)

  return (
    <footer className="footer">
      <nav className="footer__links" aria-label="Footer">
        <Link to="/contact">contact</Link>
        <a href="https://instagram.com/asyncdrip" target="_blank" rel="noopener noreferrer">
          instagram
        </a>
        <a href="https://wa.me/34652212271" target="_blank" rel="noopener noreferrer">
          whatsapp
        </a>
        <a href="mailto:nlstmn@gmail.com">email</a>
        <button className="footer__faq-btn" onClick={() => setFaqOpen(true)}>
          faq
        </button>
      </nav>

      <span className="footer__copy">© 2026 async/await</span>

      {faqOpen && <FaqModal onClose={() => setFaqOpen(false)} />}
    </footer>
  )
}
