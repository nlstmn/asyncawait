import './ProductCard.css'

export default function ProductCard({ product, index = 0 }) {
  return (
    <div className="card" style={{ animationDelay: `${index * 0.07}s` }}>
      <div className="card__name">{product.name}</div>
      <p className="card__description">{product.description}</p>
      <div className="card__price">${product.price.toFixed(2)}</div>
      <button className="card__button" disabled>
        add to cart — coming soon
      </button>
    </div>
  )
}
