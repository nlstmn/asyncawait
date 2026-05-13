const BASE = 'http://localhost:8000'

export async function getProducts() {
  const res = await fetch(`${BASE}/products`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}
