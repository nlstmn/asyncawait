// Sends the order to the Netlify function that emails the customer and the
// shop. In plain `npm run dev` there is no function server, so in DEV a
// network failure falls back to a local mock order (same as before) — run
// `npx netlify dev` from the repo root to exercise the real email path.
const ENDPOINT = import.meta.env.VITE_ORDER_ENDPOINT || '/.netlify/functions/order'

const mockOrder = () => ({ id: Math.floor(1000 + Math.random() * 9000), mocked: true })

export async function placeOrder({ form, items, total, website = '' }) {
  const payload = {
    customer: {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: `${form.dial} ${form.phone}`.trim(),
      address: form.address,
      postal: form.postal,
      city: form.city,
      country: form.country,
    },
    // the function re-prices from its own catalogue; it only needs id + qty
    items: items.map(i => ({ id: i.id, quantity: i.quantity })),
    // honeypot: real users never fill this
    website,
  }

  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[orders] function unreachable in dev, using mock order', err)
      return mockOrder()
    }
    throw new Error("couldn't reach the order service — try again in a moment")
  }

  if (res.status === 404 && import.meta.env.DEV) {
    console.warn('[orders] no function in dev (run `npx netlify dev`), using mock order')
    return mockOrder()
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `order failed (${res.status})`)
  return data
}
