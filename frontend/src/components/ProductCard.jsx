import { useState } from 'react'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

const CHIPS = ['ceramic', '325 ml', 'dishwasher-safe']

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className="card" style={{ animationDelay: `${index * 0.07}s` }}>
      <div className="card__media">
        <img src={product.image_url} alt={product.name} loading="lazy" />
        <span className="card__price-tag">${product.price.toFixed(2)}</span>
        {!product.in_stock && <span className="card__badge">sold out</span>}
      </div>

      <div className="card__row">
        <h3 className="card__name">{product.name}</h3>
        <button
          className={`card__button ${added ? 'card__button--added' : ''}`}
          onClick={handleAdd}
          disabled={!product.in_stock}
        >
          {!product.in_stock ? 'sold out' : added ? 'added ✓' : 'add to cart >'}
        </button>
      </div>

      <div className="card__chips">
        <span className="card__chip">{product.category}</span>
        {CHIPS.map(chip => (
          <span key={chip} className="card__chip">{chip}</span>
        ))}
      </div>
    </article>
  )
}
