import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

export default function App() {
  const location = useLocation()

  // every route change starts at the top (e.g. opening a product detail)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <CartProvider>
      <Navbar />
      {/* keyed by pathname so every route change replays the page fade */}
      <main key={location.pathname} className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      {location.pathname !== '/' && <Footer />}
    </CartProvider>
  )
}
