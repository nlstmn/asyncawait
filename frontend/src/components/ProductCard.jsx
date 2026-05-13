import React from 'react'

const styles = {
  card: {
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    padding: '1.25rem',
    background: '#141414',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    transition: 'border-color 0.2s, transform 0.2s',
    cursor: 'default',
  },
  name: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#f0f0f0',
    letterSpacing: '0.02em',
  },
  description: {
    fontSize: '0.85rem',
    color: '#a0a0a0',
    lineHeight: '1.5',
    flexGrow: 1,
  },
  price: {
    fontSize: '1.1rem',
    color: '#7ec8e3',
    fontWeight: 'bold',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.6rem 1rem',
    background: '#1e1e1e',
    color: '#555',
    border: '1px solid #2a2a2a',
    borderRadius: '4px',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.8rem',
    cursor: 'not-allowed',
    letterSpacing: '0.05em',
  },
}

export default function ProductCard({ product }) {
  const formattedPrice = `$${product.price.toFixed(2)}`

  return (
    <div
      style={styles.card}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#7ec8e3'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#2a2a2a'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={styles.name}>{product.name}</div>
      <p style={styles.description}>{product.description}</p>
      <div style={styles.price}>{formattedPrice}</div>
      <button style={styles.button} disabled>
        // add to cart — coming soon
      </button>
    </div>
  )
}
