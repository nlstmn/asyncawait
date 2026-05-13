import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../api/products'

const styles = {
  page: {
    minHeight: '100vh',
    padding: '2rem',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '2.5rem',
    borderBottom: '1px solid #1e1e1e',
    paddingBottom: '1.5rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#f0f0f0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    marginTop: '0.4rem',
    fontSize: '0.85rem',
    color: '#555',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.25rem',
  },
  status: {
    padding: '3rem 0',
    color: '#555',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  error: {
    padding: '3rem 0',
    color: '#e07070',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
}

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProducts()
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>asyncdrip</h1>
        <p style={styles.subtitle}>// developer merch. ships asynchronously.</p>
      </header>

      {loading && <p style={styles.status}>// fetching products...</p>}
      {error && <p style={styles.error}>// error: {error}</p>}

      {!loading && !error && (
        <div style={styles.grid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
