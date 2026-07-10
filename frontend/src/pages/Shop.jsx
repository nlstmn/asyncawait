import ProductCard from '../components/ProductCard'
import Typewriter from '../components/Typewriter'
import { PRODUCTS } from '../data/products'
import './Shop.css'

export default function Shop() {
  return (
    <div className="shop">
      <header className="shop__header">
        <h1 className="shop__category-title">Mugs</h1>
        <p className="shop__subtitle">
          <Typewriter text="start your morning. async-safe." />
        </p>
      </header>

      <div className="shop__grid">
        {PRODUCTS.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  )
}
