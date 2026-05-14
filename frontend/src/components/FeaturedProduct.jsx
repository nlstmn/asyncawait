import './FeaturedProduct.css'

export default function FeaturedProduct({ product }) {
  if (!product) return null

  return (
    <section className="featured">
      <div className="featured__text">
        <span className="featured__eyebrow">// new drop · 11:11</span>
        <h2 className="featured__name">{product.name}</h2>
        <p className="featured__subtitle">{product.category} · ships async</p>
        <p className="featured__description">{product.description}</p>
        <div className="featured__price">${product.price.toFixed(2)}</div>
        <button className="featured__cta">view product →</button>
      </div>

      <div className="featured__visual">
        <CircularBadge text="✦ NEW ARRIVAL ✦ ASYNC/AWAIT DRIP " />
        <div className="featured__image-wrap">
          <img
            src={product.image_url}
            alt={product.name}
            className="featured__image"
          />
        </div>
      </div>
    </section>
  )
}

function CircularBadge({ text }) {
  return (
    <svg className="circular-badge" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <path
          id="badge-circle"
          d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          fill="none"
        />
      </defs>
      <text>
        <textPath href="#badge-circle" startOffset="0">{text}{text}</textPath>
      </text>
      <circle cx="50" cy="50" r="4" className="circular-badge__dot" />
    </svg>
  )
}
