import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../api/products'
import './Shop.css'

const CATEGORY_META = {
  mug:   { label: 'Mugs',  emoji: '☕', tagline: 'start your morning. async-safe.' },
  socks: { label: 'Socks', emoji: '🧦', tagline: 'warm feet. warm deploys.' },
}

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

  const filtered = category
    ? products.filter(p => p.category === category)
    : products

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
            <p className="shop__subtitle">// {meta.tagline}</p>
          </>
        ) : (
          <>
            <h1 className="shop__title">async/await drip 🚀</h1>
            <p className="shop__subtitle">// developer merch. ships asynchronously.</p>
          </>
        )}
      </header>

      {loading && <p className="shop__status">// fetching products<span className="blink">_</span></p>}
      {error   && <p className="shop__error">// error: {error}</p>}

      {!loading && !error && (
        <>
          {!category && (
            <>
              <Section emoji="☕" label="Mugs" products={filtered.filter(p => p.category === 'mug')} />
              <Section emoji="🧦" label="Socks" products={filtered.filter(p => p.category === 'socks')} offset={filtered.filter(p => p.category === 'mug').length} />
            </>
          )}
          {category && (
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
