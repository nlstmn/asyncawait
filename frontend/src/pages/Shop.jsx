import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import Typewriter from '../components/Typewriter'
import { PRODUCTS } from '../data/products'
import './Shop.css'

export default function Shop() {
  const [tab, setTab] = useState('mugs')

  return (
    <div className="shop">
      <header className="shop__header">
        <div className="shop__tabs">
          <button
            className={`shop__tab ${tab === 'mugs' ? 'active' : ''}`}
            onClick={() => setTab('mugs')}
          >
            mugs
          </button>
          <button
            className={`shop__tab ${tab === 'socks' ? 'active' : ''}`}
            onClick={() => setTab('socks')}
          >
            socks<span className="shop__soon">soon</span>
          </button>
        </div>

        {tab === 'mugs' && (
          <p className="shop__subtitle">
            <Typewriter text="start your morning · async-safe" />
          </p>
        )}
      </header>

      {tab === 'mugs' ? (
        <div className="shop__grid">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="shop__soon-block">
          <p className="shop__soon-title">compiling…</p>
          <p className="shop__soon-sub">// coming soon — async-knit, for cold feet</p>
        </div>
      )}
    </div>
  )
}
