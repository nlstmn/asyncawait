import { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById, CHIPS } from '../data/products'
import { formatPrice } from '../utils/format'
import SmartImage from '../components/SmartImage'
import AddToCart from '../components/AddToCart'
import './ProductDetail.css'

// a few extra shots per mug — random ceramic/coffee photos, seeded by id so
// each product keeps a stable little gallery across reloads
const KEYWORDS = ['ceramic,mug', 'coffee,cup', 'espresso,mug', 'latte,ceramic', 'handmade,pottery']

function galleryFor(product) {
  const shots = [product.image_url]
  for (let i = 0; i < KEYWORDS.length; i++) {
    shots.push(`https://loremflickr.com/800/800/${KEYWORDS[i]}?lock=${product.id * 100 + i + 1}`)
  }
  return shots
}

// every mug is handmade to the same brief — shared spec sheet
const SPECS = [
  ['capacity', '325 ml'],
  ['height', '9.5 cm'],
  ['diameter', '8 cm'],
  ['material', 'stoneware ceramic'],
  ['finish', 'hand-glazed, food-safe'],
  ['care', 'dishwasher & microwave safe'],
  ['made in', 'Barcelona, Spain'],
]

export default function ProductDetail() {
  const { id } = useParams()
  const [active, setActive] = useState(0)
  const touchStartX = useRef(null)

  const product = getProductById(id)

  if (!product) {
    return (
      <div className="pd pd--msg">
        <p>// mug not found.</p>
        <Link to="/shop" className="pd__back">&lt; back to shop</Link>
      </div>
    )
  }

  const gallery = galleryFor(product)
  const go = (dir) => setActive(a => (a + dir + gallery.length) % gallery.length)

  // let mobile users swipe the carousel left/right by hand, not just the arrows
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1) // swipe left → next, right → prev
    touchStartX.current = null
  }

  return (
    <div className="pd">
      <Link to="/shop" className="pd__back">&lt; back to shop</Link>

      <div className="pd__grid">
        {/* ── Carousel ── */}
        <div className="pd__carousel">
          <div className="pd__stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <SmartImage
              key={active}
              src={gallery[active]}
              alt={`${product.name} — view ${active + 1}`}
              wrapClassName="pd__stage-img"
              imgClassName="pd__img"
            />
            {!product.in_stock && <span className="pd__badge">sold out</span>}

            <button
              className="pd__nav pd__nav--prev"
              onClick={() => go(-1)}
              aria-label="Previous image"
            >&lt;</button>
            <button
              className="pd__nav pd__nav--next"
              onClick={() => go(1)}
              aria-label="Next image"
            >&gt;</button>
          </div>

          <div className="pd__thumbs">
            {gallery.map((src, i) => (
              <button
                key={src}
                className={`pd__thumb ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Details ── */}
        <div className="pd__info">
          <h1 className="pd__name">{product.name}</h1>
          <p className="pd__price">{formatPrice(product.price)}</p>
          <p className="pd__desc">{product.description}</p>

          <div className="pd__chips">
            <span className="pd__chip">{product.category}</span>
            {CHIPS.map(chip => (
              <span key={chip} className="pd__chip">{chip}</span>
            ))}
          </div>

          <dl className="pd__specs">
            {SPECS.map(([label, value]) => (
              <div key={label} className="pd__spec">
                <dt className="pd__spec-label">{label}</dt>
                <dd className="pd__spec-value">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="pd__cart">
            <AddToCart product={product} variant="detail" />
          </div>
        </div>
      </div>
    </div>
  )
}
