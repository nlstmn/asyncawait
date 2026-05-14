import logoSvg from '../assets/async-await-logo.svg'
import './Footer.css'

export default function Footer() {
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
        <hr className="footer__divider" />
        <p className="footer__bottom">
          ships asynchronously · always in stock, eventually
        </p>
      </div>
    </footer>
  )
}
