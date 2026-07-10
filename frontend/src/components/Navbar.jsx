import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import logoSvg from '../assets/async-await-logo.svg'
import './Navbar.css'

const LINKS = [
  { label: 'home', to: '/' },
  { label: 'shop', to: '/shop' },
  { label: 'about', to: '/about' },
  { label: 'contact', to: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { count } = useCart()

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname === to

  const isHome = location.pathname === '/'

  return (
    <>
      <nav className={`navbar ${isHome ? 'navbar--home' : ''}`}>
        {isHome ? (
          <div className="navbar__brand" aria-hidden="true" />
        ) : (
          <Link to="/" className="navbar__brand">
            <img src={logoSvg} alt="async/await drip" className="navbar__logo" />
          </Link>
        )}

        <ul className="navbar__links">
          {LINKS.map(l => (
            <li key={l.label}>
              <Link to={l.to} className={isActive(l.to) ? 'active' : ''}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar__right">
          <Link
            to="/cart"
            className={`navbar__cart ${location.pathname === '/cart' ? 'active' : ''}`}
            aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && <span className="navbar__cart-count">{count}</span>}
          </Link>
          <button
            className={`navbar__burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`navbar__mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          {LINKS.map(l => (
            <li key={l.label}>
              <Link
                to={l.to}
                className={isActive(l.to) ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
