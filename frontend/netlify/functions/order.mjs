// Netlify Function: receives an order from the static checkout, re-prices it
// against the real catalogue (never trust client totals), and sends two
// emails through Resend — a confirmation with payment instructions to the
// customer, and a notification to the shop.
//
// Required env vars (Netlify → Site settings → Environment variables):
//   RESEND_API_KEY   Resend API key
//   ORDER_FROM       verified sender, e.g. "async/await drip <orders@yourdomain>"
//   ORDER_TO         where shop notifications go (your inbox)
//   PAY_IBAN, PAY_BIZUM, PAY_REVOLUT   payment details shown to the customer
//
// The catalogue is duplicated here on purpose: functions can't import from
// the Vite app, and the server must be the source of truth for prices.
const CATALOGUE = {
  1: { name: 'it works on my machine', finish: 'glossy', price: 29.99 },
  2: { name: 'it works on my machine', finish: 'matte', price: 29.99 },
  3: { name: "can't reproduce", finish: 'matte', price: 29.99 },
}
const MAX_PER_ITEM = 3
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const eur = (n) => `${Number(n).toFixed(2).replace('.', ',')} €`
const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
})

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

function validate(body) {
  const c = body?.customer || {}
  if (body?.website) return { error: 'spam' } // honeypot filled
  for (const k of ['firstName', 'lastName', 'email', 'phone', 'address', 'postal', 'city', 'country']) {
    if (!String(c[k] || '').trim()) return { error: `missing ${k}` }
  }
  if (!EMAIL_RE.test(c.email)) return { error: 'invalid email' }

  const items = Array.isArray(body.items) ? body.items : []
  if (!items.length) return { error: 'empty order' }

  const lines = []
  for (const it of items) {
    const p = CATALOGUE[it.id]
    const qty = Number(it.quantity)
    if (!p || !Number.isInteger(qty) || qty < 1 || qty > MAX_PER_ITEM) return { error: 'invalid item' }
    lines.push({ ...p, quantity: qty, subtotal: p.price * qty })
  }
  const total = lines.reduce((s, l) => s + l.subtotal, 0)
  return { customer: c, lines, total }
}

// mugs sharing a name get their finish appended, same rule as the UI
const label = (line, lines) =>
  lines.some(o => o !== line && o.name === line.name) ? `${line.name} · ${line.finish}` : line.name

function customerEmail({ id, customer, lines, total }) {
  const rows = lines.map(l =>
    `<tr><td style="padding:6px 0">${esc(label(l, lines))} ×${l.quantity}</td><td align="right">${eur(l.subtotal)}</td></tr>`
  ).join('')
  const pay = [
    process.env.PAY_IBAN && `IBAN: ${esc(process.env.PAY_IBAN)}`,
    process.env.PAY_BIZUM && `Bizum: ${esc(process.env.PAY_BIZUM)}`,
    process.env.PAY_REVOLUT && `Revolut: ${esc(process.env.PAY_REVOLUT)}`,
  ].filter(Boolean).join('<br>')

  return {
    subject: `order #${id} committed — async/await drip`,
    html: `
<div style="font-family:'Courier New',monospace;color:#1a1a1a;max-width:520px;margin:0 auto;line-height:1.6">
  <h1 style="font-size:22px;color:#004ECC;margin:0 0 4px">order #${id} committed!</h1>
  <p style="margin:0 0 20px">thanks ${esc(customer.firstName)} — your mugs are staged.</p>
  <table width="100%" style="border-collapse:collapse;font-size:14px">${rows}
    <tr><td style="padding-top:10px;border-top:1px solid #ddd"><strong>total · free shipping</strong></td>
        <td align="right" style="padding-top:10px;border-top:1px solid #ddd"><strong>${eur(total)}</strong></td></tr>
  </table>
  <p style="margin:20px 0 6px"><strong>how to pay</strong></p>
  <p style="margin:0 0 6px">payment is manual for now. send ${eur(total)} to one of:</p>
  <p style="margin:0 0 20px;background:#f0f4ff;padding:10px 12px;border-radius:8px">${pay || 'we will send you payment details shortly.'}</p>
  <p style="margin:0 0 20px">put <strong>#${id}</strong> in the transfer note and reply to this email with the receipt. once it's confirmed we ship within 2–4 business days and send you photos of your mugs before they go.</p>
  <p style="font-size:12px;color:#888;margin:0">ships to: ${esc(customer.address)}, ${esc(customer.postal)} ${esc(customer.city)}, ${esc(customer.country)}</p>
  <p style="font-size:12px;color:#888;margin:16px 0 0">// async/await drip · made in Barcelona · @asyncdrip</p>
</div>`,
  }
}

function shopEmail({ id, customer, lines, total }) {
  const rows = lines.map(l => `• ${label(l, lines)} ×${l.quantity} — ${eur(l.subtotal)}`).join('\n')
  return {
    subject: `new order #${id} — ${eur(total)} — ${customer.firstName} ${customer.lastName}`,
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

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method not allowed' })
  if (!process.env.RESEND_API_KEY || !process.env.ORDER_FROM || !process.env.ORDER_TO) {
    return json(500, { error: 'order service not configured' })
  }

  let body
  try { body = await req.json() } catch { return json(400, { error: 'bad json' }) }

  const v = validate(body)
  if (v.error) return json(v.error === 'spam' ? 200 : 400, v.error === 'spam' ? { id: 0 } : { error: v.error })

  const id = Math.floor(1000 + Math.random() * 9000)
  const order = { id, ...v }

  try {
    const c = customerEmail(order)
    const s = shopEmail(order)
    await Promise.all([
      send({ from: process.env.ORDER_FROM, to: [order.customer.email], reply_to: process.env.ORDER_TO, subject: c.subject, html: c.html }),
      send({ from: process.env.ORDER_FROM, to: [process.env.ORDER_TO], reply_to: order.customer.email, subject: s.subject, text: s.text }),
    ])
  } catch (err) {
    console.error('[order] email failed', err)
    return json(502, { error: "couldn't send the confirmation email — try again or email us" })
  }

  return json(200, { id, total: order.total })
}

