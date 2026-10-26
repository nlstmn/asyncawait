import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { MAX_PER_ITEM, getProductById } from '../data/products'

const CartContext = createContext(null)
const clampQty = (q) => Math.min(q, MAX_PER_ITEM)
const STORAGE_KEY = 'asyncdrip_cart'

// a stored line keeps only what the catalogue can't give back: id + quantity.
// name / price / image are re-read from the current catalogue so a renamed
// asset or a price change never leaves a stale cart behind
function hydrate({ id, quantity }) {
  const p = getProductById(id)
  if (!p) return null
  const qty = clampQty(Math.max(1, Math.floor(Number(quantity) || 0)))
  return { id: p.id, name: p.name, finish: p.finish, price: p.price, image_url: p.image_url, quantity: qty }
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const stored = raw ? JSON.parse(raw) : []
    return (Array.isArray(stored) ? stored : []).map(hydrate).filter(Boolean)
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map(({ id, quantity }) => ({ id, quantity }))))
    } catch {
      // private mode / full storage: the cart just doesn't persist
    }
  }, [items])

  function addItem(product, quantity = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: clampQty(i.quantity + quantity) } : i
        )
      }
      return [...prev, hydrate({ id: product.id, quantity })]
    })
  }

  function setQty(id, quantity) {
    if (quantity < 1) return removeItem(id)
    setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity: clampQty(quantity) } : i)))
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function clear() {
    setItems([])
  }

  const { count, total } = useMemo(() => ({
    count:    items.reduce((n, i) => n + i.quantity, 0),
    total:    items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  }), [items])

  const value = { items, addItem, setQty, removeItem, clear, count, total, maxPerItem: MAX_PER_ITEM }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
