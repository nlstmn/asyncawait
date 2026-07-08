import { useState } from 'react'
import { Link } from 'react-router-dom'
import Typewriter from '../components/Typewriter'
import logoSvg from '../assets/async-await-logo.svg'
import './Home.css'

const REST = { rx: 0, ry: 0, tx: 0, ty: 0, mx: 0, my: 0, glow: 0 }

export default function Home() {
  const [t, setT] = useState(REST)

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width - 0.5   // -0.5 .. 0.5
    const py = y / rect.height - 0.5
    const dist = Math.min(1, Math.hypot(px, py) / 0.5) // 0 at center → 1 at edges
    setT({
      rx: -py * 18,          // tilt up/down
      ry:  px * 24,          // tilt left/right
      tx:  px * 20,          // parallax drift
      ty:  py * 20,
      mx:  x,                // glow follows the actual cursor position
      my:  y,
      glow: 0.9 * (1 - dist), // fades the farther the cursor is from the logo
    })
  }

  return (
    <section className="home" onMouseMove={handleMove} onMouseLeave={() => setT(REST)}>
      <div
        className="home__glow"
        aria-hidden="true"
        style={{ '--mx': `${t.mx}px`, '--my': `${t.my}px`, opacity: t.glow }}
      />

      <div className="home__stage">
        <div
          className="home__logo-wrap"
          style={{
            transform: `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) translate3d(${t.tx}px, ${t.ty}px, 0)`,
          }}
        >
          <img src={logoSvg} alt="async/await drip" className="home__logo" draggable="false" />
        </div>

        <p className="home__tagline">
          <Typewriter text="made by coder, for coders" />
        </p>
        <Link to="/shop" className="home__cta">&gt; enter shop</Link>
      </div>
    </section>
  )
}
