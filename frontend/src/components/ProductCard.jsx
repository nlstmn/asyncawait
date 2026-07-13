import { useNavigate } from 'react-router-dom'
import { CHIPS } from '../data/products'
import AddToCart from './AddToCart'
import './ProductCard.css'

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate()
  const openDetail = () => navigate(`/mug/${product.id}`)

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
        <AddToCart product={product} variant="card" />
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
