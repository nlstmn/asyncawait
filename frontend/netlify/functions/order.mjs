// Netlify Function: receives an order from the static checkout, re-prices it
// against the real catalogue (never trust client totals), stores it as
// "pending" and notifies the shop. The customer gets no email yet: they go
// and pay on revolut.me and tap "I've paid" (paid.mjs), which sends their
// confirmation.
//
// Required env vars (Netlify → Site settings → Environment variables):
//   RESEND_API_KEY   Resend API key
//   ORDER_FROM       verified sender, e.g. "async/await drip <orders@yourdomain>"
//   ORDER_TO         where shop notifications go (your inbox)
//   PAY_REVOLUT      Revtag (@tag) → the customer pays at revolut.me/tag
// Optional:
//   ORDER_ORIGINS    comma-separated origins allowed to call this function
//   ORDER_DAILY_CAP  max orders accepted per day (default 40)
//
// Prices, limits, formatting and field rules come from the same file the
// app uses (src/shared/catalogue.js), so the server is the source of truth
// and the two can't drift.
import { randomUUID } from 'node:crypto'
import { CATALOGUE, MAX_PER_ITEM, EMAIL_RE, FIELD_MAX } from '../../src/shared/catalogue.js'
import { originAllowed, json, send, strong, payInfo } from '../lib/http.mjs'
import { newOrderEmail } from '../lib/emails.mjs'

const BY_ID = Object.fromEntries(CATALOGUE.map(({ id, name, finish, price }) => [id, { id, name, finish, price }]))
const MAX_LINES = CATALOGUE.length

// Abuse limits. This endpoint is public and sends email from our domain, so
// every input is capped and checked before anything else happens:
//   - only our own site (or a dev / preview origin) may call it (lib/http.mjs)
//   - every field has a max length and is collapsed to one line
//   - free-text fields may not carry links (the customer email renders the
//     first name as text, and mail clients linkify bare domains)
//   - per-IP and per-day caps, counted atomically in Netlify Blobs
// names / city / country never contain anything domain-shaped; an address may
// legitimately have a dot ("Av. Diagonal"), so it only gets the stricter check
const DOMAIN_RE = /[a-z0-9-]+\.[a-z]{2,}(\b|$)/i
const LINK_RE = /(https?:)?\/\/|www\.|\.(com|net|org|io|xyz|ru|cn|info|biz|app|dev)\b/i
const NAME_FIELDS = new Set(['firstName', 'lastName', 'city', 'country'])
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000
const DAILY_CAP = Number(process.env.ORDER_DAILY_CAP) || 40

const clientIp = (req, context) =>
  context?.ip
  || req.headers.get('x-nf-client-connection-ip')
  || 'unknown'

// read-modify-write guarded by the blob's etag, so two simultaneous requests
// never both win; the loser re-reads and tries again
async function bump(store, key, next) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const cur = await store.getWithMetadata(key, { type: 'json' })
    const value = next(cur?.data ?? null)
    const res = cur
      ? await store.setJSON(key, value, { onlyIfMatch: cur.etag })
      : await store.setJSON(key, value, { onlyIfNew: true })
    if (res.modified) return value
    await new Promise(r => setTimeout(r, 25 * (attempt + 1)))
  }
  throw new Error(`blob contention on ${key}`)
}

const today = () => new Date().toISOString().slice(0, 10)

// Sequential order numbers: #0001, #0002, … kept in a Blobs counter.
async function nextOrderId() {
  const { n } = await bump(strong('orders'), 'counter', cur => ({ n: (cur?.n ?? 0) + 1 }))
  return String(n).padStart(4, '0')
}

// true when this IP or the whole site is over its cap. Fails open on storage
// errors: a store hiccup must never block a real customer.
async function overLimit(req, context) {
  try {
    const store = strong('order-rate-limit')
    const now = Date.now()
    const ipKey = `ip/${clientIp(req, context).replace(/[^a-zA-Z0-9.:_-]/g, '_')}`
    const ip = await bump(store, ipKey, cur => {
      const rec = cur && now - cur.start <= RATE_WINDOW_MS ? cur : { start: now, count: 0 }
      return { ...rec, count: rec.count + 1 }
    })
    if (ip.count > RATE_LIMIT) return 'ip'
    const day = await bump(store, `day/${today()}`, cur => ({ count: (cur?.count ?? 0) + 1 }))
    if (day.count > DAILY_CAP) return 'day'
    return false
  } catch (err) {
    console.error('[order] rate-limit store unavailable', err)
    return false
  }
}

// one line, no control characters, trimmed
const clean = (v) => String(v).replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim()

function validate(body) {
  if (body?.website) return { error: 'spam' } // honeypot filled
  const raw = body?.customer
  if (!raw || typeof raw !== 'object') return { error: 'missing customer' }

  const customer = {}
  for (const [k, max] of Object.entries(FIELD_MAX)) {
    if (typeof raw[k] !== 'string') return { error: `missing ${k}` }
    const v = clean(raw[k])
    if (!v) return { error: `missing ${k}` }
    if (v.length > max) return { error: `${k} too long` }
    if (k !== 'email' && (NAME_FIELDS.has(k) ? DOMAIN_RE : LINK_RE).test(v)) return { error: `${k} can't contain a link` }
    customer[k] = v
  }
  if (!EMAIL_RE.test(customer.email)) return { error: 'invalid email' }

  const items = Array.isArray(body.items) ? body.items : []
  if (!items.length) return { error: 'empty order' }
  if (items.length > MAX_LINES) return { error: 'too many items' }

  // merge by id so repeating a line can't get past the per-mug cap
  const qtyById = new Map()
  for (const it of items) {
    const id = String(it?.id)
    const qty = Number(it?.quantity)
    if (!Object.hasOwn(BY_ID, id) || !Number.isInteger(qty) || qty < 1) return { error: 'invalid item' }
    qtyById.set(id, (qtyById.get(id) ?? 0) + qty)
  }
  const lines = []
  for (const [id, quantity] of qtyById) {
    if (quantity > MAX_PER_ITEM) return { error: `max ${MAX_PER_ITEM} per mug` }
    const p = BY_ID[id]
    lines.push({ ...p, quantity, subtotal: p.price * quantity })
  }
  const total = lines.reduce((s, l) => s + l.subtotal, 0)
  return { customer, lines, total }
}

// every order is kept as its own blob (`order/0001`); `npm run orders` pulls
// them all into frontend/orders.json for the owner
async function saveOrder(order) {
  try {
    await strong('orders').setJSON(`order/${order.id}`, order)
    return true
  } catch (err) {
    console.error('[order] could not store order', order.id, err)
    return false
  }
}

export default async (req, context) => {
  if (req.method !== 'POST') return json(405, { error: 'method not allowed' })
  if (!process.env.RESEND_API_KEY || !process.env.ORDER_FROM || !process.env.ORDER_TO) {
    return json(500, { error: 'order service not configured' })
  }
  if (!originAllowed(req.headers.get('origin'))) return json(403, { error: 'forbidden' })
  if (!(req.headers.get('content-type') || '').includes('application/json')) {
    return json(415, { error: 'expected json' })
  }

  let body
  try { body = await req.json() } catch { return json(400, { error: 'bad json' }) }

  const v = validate(body)
  if (v.error === 'spam') return json(200, { id: 0 }) // bots get a quiet fake success
  if (v.error) return json(400, { error: v.error })

  // only requests that pass validation count, so a typo can't burn a real
  // customer's attempts
  const limit = await overLimit(req, context)
  if (limit === 'ip') return json(429, { error: 'too many orders from this connection — try again in an hour or email us' })
  if (limit === 'day') return json(429, { error: "we're at capacity for today — email us and we'll sort it out" })

  let id
  try {
    id = await nextOrderId()
  } catch (err) {
    // counter unavailable: still take the order, with a time-based number
    console.error('[order] counter failed, using fallback id', err)
    id = `T${Date.now().toString().slice(-6)}`
  }
  // the token lets the customer (and only them) mark the order as paid later
  const order = { id, token: randomUUID(), status: 'pending', createdAt: new Date().toISOString(), ...v }
  order.stored = await saveOrder(order)

  // heads-up to the shop only; the customer is emailed once they say they paid
  const m = newOrderEmail(order)
  let notified = true
  try {
    await send({ from: process.env.ORDER_FROM, to: [process.env.ORDER_TO], reply_to: order.customer.email, subject: m.subject, text: m.text })
  } catch (err) {
    notified = false
    console.error(`[order] shop email failed for #${id}`, err)
  }
  // a failed email is logged, not fatal, as long as the order itself is stored
  if (!notified && !order.stored) {
    return json(502, { error: "couldn't register the order — try again or email us" })
  }
  return json(200, { id, total: order.total, token: order.token, pay: payInfo() })
}
