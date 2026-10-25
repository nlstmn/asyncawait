import { useState, useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById, imageFocus, CHIPS, OK_BINARY } from '../data/products'
import { formatPrice } from '../utils/format'
import SmartImage from '../components/SmartImage'
import AddToCart from '../components/AddToCart'
import './ProductDetail.css'

// product shots (front phrase, back binary "ok") followed by lifestyle photos
const galleryFor = (product) => product.images ?? [product.image_url]

// same brief for every mug, with the per-mug finish / color / phrase filled in
const specsFor = (p) => [
  ['front', p.phrase],
  ['back', `"ok" in binary · ${OK_BINARY}`],
  ['finish', `${p.finish}, hand-glazed, food-safe`],
  ['color', p.color],
  ['capacity', '480 ml'],
  ['height', '10 cm'],
  ['diameter', '8 cm'],
  ['material', 'stoneware ceramic'],
  ['care', 'dishwasher & microwave safe'],
]

// the twine from the photo box to the tag's hole (px, matches the CSS offsets)
const ROPE = 'M 0 10 C 30 17, 64 19, 104 12'

export default function ProductDetail() {
  const { id } = useParams()
  const [active, setActive] = useState(0)
  const touchStartX = useRef(null)

  const product = getProductById(id)
  const gallery = product ? galleryFor(product) : []
  const go = (dir) => setActive(a => (a + dir + gallery.length) % gallery.length)

  // ← / → keys flip the carousel, same as the arrows and swiping
  useEffect(() => {
    if (gallery.length < 2) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gallery.length])

  if (!product) {
    return (
      <div className="pd pd--msg">
        <p>// mug not found.</p>
        <Link to="/shop" className="pd__back">&lt; back to shop</Link>
      </div>
    )
  }

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
              style={{ objectPosition: imageFocus(gallery[active]) }}
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
                <img src={src} alt="" loading="lazy" style={{ objectPosition: imageFocus(src) }} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Details ── */}
        <div className="pd__info">
          <h1 className="pd__name">{product.name}</h1>
          <p className="pd__price">{formatPrice(product.price)}</p>

          {/* kraft swing tag lying beside the photo box, tied to it with twine */}
          <aside className="pd__tag">
            <svg className="pd__tag-rope" width="104" height="24" aria-hidden="true">
              <path className="pd__tag-rope-core" d={ROPE} />
              <path className="pd__tag-rope-twist" d={ROPE} />
            </svg>
            <p className="pd__tag-card">{product.description}</p>
          </aside>

          <div className="pd__chips">
            <span className="pd__chip">{product.finish}</span>
            <span className="pd__chip">{product.color}</span>
            {CHIPS.map(chip => (
              <span key={chip} className="pd__chip">{chip}</span>
            ))}
          </div>

          <dl className="pd__specs table">
            {specsFor(product).map(([label, value]) => (
              <div key={label} className="table__row">
                <dt className="pd__spec-label">{label}</dt>
                <dd className="pd__spec-value">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="pd__note">
            // handmade, not fabricated — glaze, strokes and lettering vary a
            little from mug to mug, so yours may differ slightly from the photo.
            that's the point.
          </p>

          <div className="pd__cart">
            <AddToCart product={product} variant="detail" />
          </div>
        </div>
      </div>
    </div>
  )
}
