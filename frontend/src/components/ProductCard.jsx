import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { CHIPS } from '../data/products'
import './ProductCard.css'

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)

  const openDetail = () => navigate(`/product/${product.id}`)

  const handleAdd = (e) => {
    e.stopPropagation() // don't open the detail page when adding to cart
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <article
      className="card"
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={openDetail}
      onKeyDown={(e) => { if (e.key === 'Enter') openDetail() }}
      role="link"
      tabIndex={0}
      aria-label={product.name}
    >
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
