import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Marquee from '../components/Marquee'
import FeaturedProduct from '../components/FeaturedProduct'
import { getProducts } from '../api/products'
import './Shop.css'

const CATEGORY_META = {
  mug:   { label: 'Mugs',  emoji: '☕', tagline: 'start your morning. async-safe.' },
  socks: { label: 'Socks', emoji: '🧦', tagline: 'warm feet. warm deploys.' },
}

const MARQUEE_TOP    = ['✦ async/await drip', '✦ tech merch', '✦ made by coder, for coders', '✦ dev society', '✦ ships asynchronously']
const MARQUEE_MIDDLE = ['☕ caffeine driven development', '✦ stack overflow approved', '🧦 warm feet warm deploys', '✦ git push your style']

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')

  useEffect(() => {
    getProducts()
      .then(data => { setProducts(data); setLoading(false) })
      .catch(err  => { setError(err.message); setLoading(false) })
  }, [])

  const { mugs, socks } = useMemo(() => ({
    mugs:  products.filter(p => p.category === 'mug'),
    socks: products.filter(p => p.category === 'socks'),
  }), [products])

  const featured = useMemo(() => mugs[0] || socks[0] || null, [mugs, socks])
  const filtered = category ? products.filter(p => p.category === category) : products
  const meta = category ? CATEGORY_META[category] : null

  return (
    <div className="shop">
      <header className="shop__header">
        {meta ? (
          <>
            <h1 className="shop__category-title">
              <span className="shop__emoji">{meta.emoji}</span>
              {meta.label}
            </h1>
            <p className="shop__subtitle">{meta.tagline}</p>
          </>
        ) : (
          <>
            <h1 className="shop__title">async/await drip 🚀</h1>
            <p className="shop__subtitle">made by coder, for coders</p>
          </>
        )}
      </header>

      {loading && (
        <p className="shop__status">// fetching products<span className="blink">_</span></p>
      )}

      {error && (
        <div className="shop__error-block">
          <p className="shop__error">// oops — couldn't load products.</p>
          <button className="shop__retry" onClick={() => window.location.reload()}>
            try again ↺
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {!category && featured && <FeaturedProduct product={featured} />}
          {!category && <Marquee items={MARQUEE_TOP} variant="blue" speed={28} />}

          {!category ? (
            <>
              <Section emoji="☕" label="Mugs"  products={mugs} />
              <Marquee items={MARQUEE_MIDDLE} variant="green" speed={36} />
              <Section emoji="🧦" label="Socks" products={socks} offset={mugs.length} />
            </>
          ) : (
            <div className="shop__grid">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Section({ emoji, label, products, offset = 0 }) {
  if (!products.length) return null
  return (
    <section className="shop__section">
      <h2 className="shop__section-title">{emoji} {label}</h2>
      <div className="shop__grid">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={offset + i} />
        ))}
      </div>
    </section>
  )
}
