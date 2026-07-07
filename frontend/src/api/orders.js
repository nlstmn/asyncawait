const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export async function createOrder({ name, email, address, items }) {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      address,
      items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
    }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.detail || `HTTP ${res.status}`)
  }
  return res.json()
}
