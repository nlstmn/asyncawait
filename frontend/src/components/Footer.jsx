import { useState } from 'react'
import { Link } from 'react-router-dom'
import FaqModal from './FaqModal'
import logoSvg from '../assets/async-await-logo.svg'
import './Footer.css'

export default function Footer() {
  const [faqOpen, setFaqOpen] = useState(false)

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <img src={logoSvg} alt="async/await drip" className="footer__logo" />
            <span className="footer__tagline">
              tech merch · dev society
            </span>
          </div>
          <span className="footer__copy">© 2026 async/await</span>
        </div>

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

        <hr className="footer__divider" />
        <p className="footer__bottom">
          ships asynchronously · always in stock, eventually
        </p>
      </div>

      {faqOpen && <FaqModal onClose={() => setFaqOpen(false)} />}
    </footer>
  )
}
