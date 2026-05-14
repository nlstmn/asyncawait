import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import logoSvg from '../assets/async-await-logo.svg'
import './Navbar.css'

const LINKS = [
  { label: 'home', to: '/' },
  { label: 'mugs', to: '/shop?category=mug' },
  { label: 'socks', to: '/shop?category=socks' },
  { label: 'contact', to: '/contact' },
]

export default function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const currentCategory = searchParams.get('category')

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/' && !currentCategory
    if (to.includes('category=mug')) return currentCategory === 'mug'
    if (to.includes('category=socks')) return currentCategory === 'socks'
    return location.pathname === to
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar__brand">
          <img src={logoSvg} alt="async/await drip" className="navbar__logo" />
        </Link>

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
          <button
            className="navbar__theme-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
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
