import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProductById } from '../data/products'
import './ProductDetail.css'

const CHIPS = ['ceramic', '325 ml', 'dishwasher-safe', 'handmade', 'unique style for each']

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

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [active, setActive] = useState(0)
  const [added, setAdded] = useState(false)

  const product = getProductById(id)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  if (!product) {
    return (
      <div className="pd pd--msg">
        <p>// mug not found.</p>
        <Link to="/shop" className="pd__back">&lt; back to shop</Link>
      </div>
    )
  }

  const gallery = galleryFor(product)

  return (
    <div className="pd">
      <Link to="/shop" className="pd__back">&lt; back to shop</Link>

      <div className="pd__grid">
        {/* ── Carousel ── */}
        <div className="pd__carousel">
          <div className="pd__stage">
            <img
              key={active}
              src={gallery[active]}
              alt={`${product.name} — view ${active + 1}`}
              className="pd__img"
              loading="lazy"
            />
            {!product.in_stock && <span className="pd__badge">sold out</span>}

            <button
              className="pd__nav pd__nav--prev"
              onClick={() => setActive(a => (a - 1 + gallery.length) % gallery.length)}
              aria-label="Previous image"
            >&lt;</button>
            <button
              className="pd__nav pd__nav--next"
              onClick={() => setActive(a => (a + 1) % gallery.length)}
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
          <p className="pd__price">${product.price.toFixed(2)}</p>
          <p className="pd__desc">{product.description}</p>

          <div className="pd__chips">
            <span className="pd__chip">{product.category}</span>
            {CHIPS.map(chip => (
              <span key={chip} className="pd__chip">{chip}</span>
            ))}
          </div>

          <button
            className={`pd__add ${added ? 'pd__add--added' : ''}`}
            onClick={handleAdd}
            disabled={!product.in_stock}
          >
            {!product.in_stock ? 'sold out' : added ? 'added ✓' : 'add to cart >'}
          </button>
        </div>
      </div>
    </div>
  )
}
