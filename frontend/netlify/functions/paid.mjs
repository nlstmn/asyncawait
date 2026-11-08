// Netlify Function: the customer says they've paid (after coming back from
// the revolut tab). It is only their word — the order is marked "customer
// says paid", the shop gets an email to go and check the account, and the
// customer gets their order confirmation (their first and only email).
// Needs the order's token (handed out when the order was placed), so nobody
// can poke at other people's orders.
import { timingSafeEqual } from 'node:crypto'
import { originAllowed, json, send, strong } from '../lib/http.mjs'
import { paidEmail, customerEmail } from '../lib/emails.mjs'

const ID_RE = /^(\d{4,6}|T\d{6})$/
const TOKEN_RE = /^[0-9a-f-]{36}$/

const sameToken = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b))
  return x.length === y.length && timingSafeEqual(x, y)
}

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method not allowed' })
  if (!originAllowed(req.headers.get('origin'))) return json(403, { error: 'forbidden' })
  if (!(req.headers.get('content-type') || '').includes('application/json')) {
    return json(415, { error: 'expected json' })
  }

  let body
  try { body = await req.json() } catch { return json(400, { error: 'bad json' }) }
  const id = String(body?.id ?? '')
  const token = String(body?.token ?? '')
  if (!ID_RE.test(id) || !TOKEN_RE.test(token)) return json(400, { error: 'unknown order' })

  let store, cur
  try {
    store = strong('orders')
    cur = await store.getWithMetadata(`order/${id}`, { type: 'json' })
  } catch (err) {
    console.error('[paid] store unavailable', err)
    return json(503, { error: "couldn't save that — try again in a moment or reply to your confirmation email" })
  }
  const order = cur?.data
  if (!order?.token || !sameToken(order.token, token)) return json(404, { error: 'unknown order' })

  // first claim only: no second round of emails if they tap twice
  if (order.paidClaimedAt) return json(200, { ok: true, emailed: true })

  order.paidClaimedAt = new Date().toISOString()
  order.status = 'customer-says-paid'
  try {
    await store.setJSON(`order/${id}`, order, { onlyIfMatch: cur.etag })
  } catch (err) {
    console.error('[paid] could not update order', id, err)
  }
  const shop = paidEmail(order)
  const cust = customerEmail(order)
  const [s, c] = await Promise.allSettled([
    send({ from: process.env.ORDER_FROM, to: [process.env.ORDER_TO], reply_to: order.customer.email, subject: shop.subject, text: shop.text }),
    send({ from: process.env.ORDER_FROM, to: [order.customer.email], reply_to: process.env.ORDER_TO, subject: cust.subject, html: cust.html }),
  ])
  for (const [who, r] of [['shop', s], ['customer', c]]) {
    if (r.status === 'rejected') console.error(`[paid] ${who} email failed for #${id}`, r.reason)
  }
  return json(200, { ok: true, emailed: c.status === 'fulfilled' })
}
