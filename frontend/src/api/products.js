const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export async function getProducts() {
  const res = await fetch(`${BASE}/products`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
