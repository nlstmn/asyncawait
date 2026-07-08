import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../api/products'
import './Shop.css'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProducts()
      .then(data => { setProducts(data); setLoading(false) })
      .catch(err  => { setError(err.message); setLoading(false) })
  }, [])

  return (
    <div className="shop">
      <header className="shop__header">
        <h1 className="shop__category-title">Mugs</h1>
        <p className="shop__subtitle">start your morning. async-safe.</p>
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
        <div className="shop__grid">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
