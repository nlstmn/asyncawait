// Netlify Function: receives an order from the static checkout, re-prices it
// against the real catalogue (never trust client totals), stores it, and
// sends two emails through Resend — a confirmation with payment instructions
// to the customer, and a notification to the shop.
//
// Required env vars (Netlify → Site settings → Environment variables):
//   RESEND_API_KEY   Resend API key
//   ORDER_FROM       verified sender, e.g. "async/await drip <orders@yourdomain>"
//   ORDER_TO         where shop notifications go (your inbox)
//   PAY_IBAN, PAY_BIZUM, PAY_REVOLUT   payment details shown to the customer
//   PAY_NAME         account holder, shown after the IBAN and Bizum number
// Optional:
//   ORDER_ORIGINS    comma-separated origins allowed to call this function
//   ORDER_DAILY_CAP  max orders accepted per day (default 40)
//
// The catalogue is duplicated here on purpose: functions can't import from
// the Vite app, and the server must be the source of truth for prices.
import { getStore } from '@netlify/blobs'

const CATALOGUE = {
  1: { name: 'it works on my machine', finish: 'glossy', price: 29.99 },
  2: { name: 'it works on my machine', finish: 'matte', price: 29.99 },
  3: { name: "can't reproduce", finish: 'matte', price: 29.99 },
}
const MAX_PER_ITEM = 3
const MAX_LINES = Object.keys(CATALOGUE).length
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Abuse limits. This endpoint is public and sends email from our domain, so
// every input is capped and checked before anything else happens:
//   - only our own site (or a dev / preview origin) may call it
//   - every field has a max length and is collapsed to one line
//   - free-text fields may not carry links (the customer email renders the
//     first name as text, and mail clients linkify bare domains)
//   - per-IP and per-day caps, counted atomically in Netlify Blobs
const DEFAULT_ORIGINS = ['https://asyncdrip.com', 'https://www.asyncdrip.com']
const DEV_ORIGIN_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/
const FIELD_MAX = { firstName: 60, lastName: 60, email: 120, phone: 30, address: 200, postal: 12, city: 80, country: 60 }
// names / city / country never contain anything domain-shaped; an address may
// legitimately have a dot ("Av. Diagonal"), so it only gets the stricter check
const DOMAIN_RE = /[a-z0-9-]+\.[a-z]{2,}(\b|$)/i
const LINK_RE = /(https?:)?\/\/|www\.|\.(com|net|org|io|xyz|ru|cn|info|biz|app|dev)\b/i
const NAME_FIELDS = new Set(['firstName', 'lastName', 'city', 'country'])
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000
const DAILY_CAP = Number(process.env.ORDER_DAILY_CAP) || 40

const allowedOrigins = () =>
  (process.env.ORDER_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean).concat(DEFAULT_ORIGINS)

function originAllowed(origin) {
  if (!origin) return false
  if (allowedOrigins().includes(origin)) return true
  if (DEV_ORIGIN_RE.test(origin)) return true
  // deploy previews / branch deploys, but never on the production site
  return process.env.CONTEXT !== 'production' && /^https:\/\/[a-z0-9-]+\.netlify\.app$/.test(origin)
}

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

const strong = (name) => getStore({ name, consistency: 'strong' })
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

const eur = (n) => `${Number(n).toFixed(2).replace('.', ',')} €`
const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
})

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

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
    if (!Object.hasOwn(CATALOGUE, id) || !Number.isInteger(qty) || qty < 1) return { error: 'invalid item' }
    qtyById.set(id, (qtyById.get(id) ?? 0) + qty)
  }
  const lines = []
  for (const [id, quantity] of qtyById) {
    if (quantity > MAX_PER_ITEM) return { error: `max ${MAX_PER_ITEM} per mug` }
    const p = CATALOGUE[id]
    lines.push({ id: Number(id), ...p, quantity, subtotal: p.price * quantity })
  }
  const total = lines.reduce((s, l) => s + l.subtotal, 0)
  return { customer, lines, total }
}

// mugs sharing a name get their finish appended, same rule as the UI
const label = (line, lines) =>
  lines.some(o => o !== line && o.name === line.name) ? `${line.name} · ${line.finish}` : line.name

function customerEmail({ id, customer, lines, total }) {
  // same bordered table as the site's .table: 1px #ddd frame, 12px radius,
  // 12/16px cells, blue prices, muted total label with the bold blue amount
  const cell = 'padding:12px 16px;border-bottom:1px solid #ddd'
  const rows = lines.map(l =>
    `<tr><td style="${cell}">${esc(label(l, lines))} <span style="color:#004ECC;font-size:12px;font-weight:bold">×${l.quantity}</span></td>` +
    `<td align="right" style="${cell};color:#004ECC;white-space:nowrap">${eur(l.subtotal)}</td></tr>`
  ).join('')
  // the customer's own details, so they can spot a typo before we ship
  const details = [
    ['name', `${customer.firstName} ${customer.lastName}`],
    ['email', customer.email],
    ['phone', customer.phone],
    ['ships to', `${customer.address}, ${customer.postal} ${customer.city}, ${customer.country}`],
  ].map(([k, v], i, all) =>
    `<tr><td style="${i < all.length - 1 ? cell : 'padding:12px 16px'};color:#888;white-space:nowrap">${k}</td>` +
    `<td style="${i < all.length - 1 ? cell : 'padding:12px 16px'}">${esc(v)}</td></tr>`
  ).join('')
  const holder = process.env.PAY_NAME ? ` · ${esc(process.env.PAY_NAME)}` : ''
  const pay = [
    process.env.PAY_IBAN && `IBAN: ${esc(process.env.PAY_IBAN)}${holder}`,
    process.env.PAY_BIZUM && `Bizum: ${esc(process.env.PAY_BIZUM)}${holder}`,
    process.env.PAY_REVOLUT && `Revolut: ${esc(process.env.PAY_REVOLUT)}`,
  ].filter(Boolean).join('<br>')

  return {
    subject: 'order confirmation · async/await drip',
    html: `
<div style="font-family:'Courier New',monospace;color:#1a1a1a;max-width:520px;margin:0 auto;line-height:1.6">
  <h1 style="font-size:22px;color:#004ECC;margin:0 0 4px">order #${id} committed!</h1>
  <p style="margin:0 0 20px">thanks ${esc(customer.firstName)} — your mugs are staged.</p>
  <table width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #ddd;border-radius:12px;border-collapse:separate;font-size:13px">${rows}
    <tr><td style="padding:12px 16px;color:#888">total · free shipping</td>
        <td align="right" style="padding:12px 16px;font-size:18px;font-weight:bold;color:#004ECC;white-space:nowrap">${eur(total)}</td></tr>
  </table>
  <p style="margin:20px 0 6px"><strong>HOW TO PAY</strong></p>
  <p style="margin:0 0 6px">payment is manual for now. send ${eur(total)} to one of:</p>
  <p style="margin:0 0 20px;background:#f0f4ff;padding:10px 12px;border-radius:8px">${pay || 'we will send you payment details shortly.'}</p>
  <p style="margin:0 0 20px">put <strong>#${id}</strong> in the transfer note and reply to this email with the receipt. once it's confirmed we ship within 2–4 business days and send you photos of your mugs before they go.</p>
  <p style="margin:0 0 6px"><strong>YOUR DETAILS</strong></p>
  <table width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #ddd;border-radius:12px;border-collapse:separate;font-size:13px">${details}</table>
  <p style="margin:6px 0 20px;font-size:12px;color:#888">something off? reply to this email and we'll fix it before it ships.</p>
  <p style="font-size:12px;color:#888;margin:16px 0 0">© ${new Date().getFullYear()} async/await drip · made in Barcelona · @asyncdrip</p>
</div>`,
  }
}

function shopEmail({ id, customer, lines, total }) {
  const rows = lines.map(l => `• ${label(l, lines)} ×${l.quantity} — ${eur(l.subtotal)}`).join('\n')
  return {
    subject: `new order #${id} · ${eur(total)} · ${customer.firstName} ${customer.lastName}`,
    text: `order #${id}

${rows}
total: ${eur(total)}

${customer.firstName} ${customer.lastName}
${customer.email}
${customer.phone}
${customer.address}, ${customer.postal} ${customer.city}, ${customer.country}
`,
  }
}

async function send(payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`)
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
  const order = { id, createdAt: new Date().toISOString(), ...v }
  order.stored = await saveOrder(order)

  const c = customerEmail(order)
  const s = shopEmail(order)
  const [shop, customer] = await Promise.allSettled([
    send({ from: process.env.ORDER_FROM, to: [process.env.ORDER_TO], reply_to: order.customer.email, subject: s.subject, text: s.text }),
    send({ from: process.env.ORDER_FROM, to: [order.customer.email], reply_to: process.env.ORDER_TO, subject: c.subject, html: c.html }),
  ])
  for (const [who, r] of [['shop', shop], ['customer', customer]]) {
    if (r.status === 'rejected') console.error(`[order] ${who} email failed for #${id}`, r.reason)
  }

  // the order is already stored, so a failed email is logged, not fatal —
  // unless nothing at all got through and we couldn't store it either
  if (shop.status === 'rejected' && customer.status === 'rejected' && !order.stored) {
    return json(502, { error: "couldn't send the confirmation email — try again or email us" })
  }
  return json(200, { id, total: order.total, emailed: customer.status === 'fulfilled' })
}
