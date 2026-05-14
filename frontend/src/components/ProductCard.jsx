import './ProductCard.css'

export default function ProductCard({ product, index = 0 }) {
  return (
    <article className="card" style={{ animationDelay: `${index * 0.07}s` }}>
      <div className="card__media">
        <img src={product.image_url} alt={product.name} loading="lazy" />
        {!product.in_stock && <span className="card__badge">sold out</span>}
      </div>
      <div className="card__body">
        <h3 className="card__name">{product.name}</h3>
        <p className="card__description">{product.description}</p>
        <div className="card__footer">
          <span className="card__price">${product.price.toFixed(2)}</span>
          <button className="card__button" disabled>add to cart →</button>
        </div>
      </div>
    </article>
  )
}
