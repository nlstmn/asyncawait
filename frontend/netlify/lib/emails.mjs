// The three emails. Shop ones are plain text; the customer one is HTML styled
// like the site (grey page, white card, bordered tables, blue prices).
//
//   newOrderEmail   → shop, when the order is placed
//   paidEmail       → shop, when the customer taps "I've paid"
//   customerEmail   → customer, when they tap "I've paid" (their only email)
import { formatPrice, itemLabel } from '../../src/shared/catalogue.js'
import { revolutUrl } from './http.mjs'

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

// product photos + logo live in frontend/public/email/ (served from the site
// root), so they can be referenced by absolute URL
const SITE_URL = (process.env.URL || 'https://asyncdrip.com').replace(/\/$/, '')
const photo = (id) => `${SITE_URL}/email/mug-${id}.jpg`

const fullName = (c) => `${c.firstName} ${c.lastName}`

const shipsTo = (c) => `${fullName(c)}\n${c.address}\n${c.postal} ${c.city}\n${c.country}\n${c.phone}`

export function newOrderEmail({ id, customer, lines, total }) {
  const rows = lines.map(l => `• ${itemLabel(l, lines)} ×${l.quantity} — ${formatPrice(l.subtotal)}`).join('\n')
  return {
    subject: `new order #${id} · ${formatPrice(total)} · ${fullName(customer)}`,
    text: `order #${id} — waiting for the customer to pay

${rows}
total: ${formatPrice(total)}

ships to
${shipsTo(customer)}

customer
${fullName(customer)}
${customer.email}
${customer.phone}
`,
  }
}

export function paidEmail({ id, customer, total }) {
  return {
    subject: `#${id} · customer says paid · ${formatPrice(total)} · ${fullName(customer)}`,
    text: `${fullName(customer)} tapped "I've paid" on order #${id} (${formatPrice(total)}).

check revolut for ${formatPrice(total)} with #${id} in the note, then send the payment-received email.

${customer.email}
${customer.phone}
`,
  }
}

export function customerEmail({ id, customer, lines, total }) {
  // same bordered table as the site's .table: 1px #ddd frame, 12px radius,
  // 12/16px cells, blue prices, muted total label with the bold blue amount
  const cell = 'padding:12px 16px;border-bottom:1px solid #ddd'
  const rows = lines.map(l =>
    `<tr><td width="48" style="padding:12px 0 12px 16px;border-bottom:1px solid #ddd">` +
    `<img src="${photo(l.id)}" width="48" height="48" alt="" style="display:block;width:48px;height:48px;border-radius:8px"></td>` +
    `<td style="${cell}">${esc(itemLabel(l, lines))} <span style="color:#004ECC;font-size:12px;font-weight:bold">×${l.quantity}</span></td>` +
    `<td align="right" style="${cell};color:#004ECC;white-space:nowrap">${formatPrice(l.subtotal)}</td></tr>`
  ).join('')
  // the customer's own details, so they can spot a typo before we ship:
  // where it goes on the left, who ordered on the right
  const name = fullName(customer)
  const block = (title, rowsIn, extra = '') =>
    `<td width="50%" valign="top" style="padding:12px 16px;line-height:1.7;${extra}">` +
    `<div style="color:#888;font-size:12px;letter-spacing:0.04em;margin-bottom:2px">${title}</div>` +
    rowsIn.map(esc).join('<br>') + `</td>`
  const details =
    block('SHIPS TO', [name, customer.address, `${customer.postal} ${customer.city}`, customer.country, customer.phone]) +
    block('CUSTOMER', [name, customer.email, customer.phone], 'border-left:1px solid #ddd')
  const revolut = revolutUrl()

  return {
    subject: 'order confirmed · async/await drip',
    // page background + white card mirror the site (--bg #f4f4f4, --surface,
    // --r-lg 20px, 1px --border); the footer echoes the site footer
    html: `
<table width="100%" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4" style="background:#f4f4f4;font-family:'Courier New',monospace;color:#1a1a1a;line-height:1.6">
<tr><td align="center" style="padding:32px 16px">
<div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #ddd;border-radius:20px;padding:32px 28px;text-align:left">
  <h1 style="font-size:22px;color:#004ECC;margin:0 0 4px">order #${id} confirmed!</h1>
  <p style="margin:0 0 20px">thanks ${esc(customer.firstName)} — your mugs are staged.</p>
  <table width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #ddd;border-radius:12px;border-collapse:separate;font-size:13px">${rows}
    <tr><td colspan="2" style="padding:12px 16px;color:#888">total · free shipping</td>
        <td align="right" style="padding:12px 16px;font-size:18px;font-weight:bold;color:#004ECC;white-space:nowrap">${formatPrice(total)}</td></tr>
  </table>
  <p style="margin:20px 0 6px"><strong>PAYMENT</strong></p>
  <p style="margin:0 0 12px">you sent <strong>${formatPrice(total)}</strong> with <strong>#${id}</strong> in the note. we check it by hand — once it's confirmed we ship within 2–4 business days and send you photos of your mugs before they go.</p>
  ${revolut ? `<p style="margin:0 0 20px;font-size:12px;color:#888">didn't go through? <a href="${revolut}" style="color:#004ECC;font-weight:bold">open the payment tab &gt;</a> — ${formatPrice(total)}, note #${id}.</p>` : ''}
  <p style="margin:0 0 6px"><strong>YOUR DETAILS</strong></p>
  <table width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #ddd;border-radius:12px;border-collapse:separate;font-size:13px"><tr>${details}</tr></table>
  <p style="margin:6px 0 0;font-size:12px;color:#888">something off? reply to this email and we'll fix it before it ships.</p>
</div>
<div style="max-width:520px;margin:0 auto;padding:32px 16px 8px;text-align:center;font-size:12px;color:#888">
  <p style="margin:0 0 28px;font-size:13px">
    <a href="https://instagram.com/asyncdrip" style="color:#1a1a1a;font-weight:bold;text-decoration:none">instagram</a>
    &nbsp;&nbsp;·&nbsp;&nbsp;
    <a href="https://wa.me/34652212271" style="color:#1a1a1a;font-weight:bold;text-decoration:none">whatsapp</a>
    &nbsp;&nbsp;·&nbsp;&nbsp;
    <a href="mailto:info@asyncdrip.com" style="color:#1a1a1a;font-weight:bold;text-decoration:none">email</a>
  </p>
  <p style="margin:0 0 4px">made by coder, for coders · Barcelona</p>
  <p style="margin:0 0 24px">© ${new Date().getFullYear()} async/await drip</p>
  <a href="${SITE_URL}"><img src="${SITE_URL}/email/logo.png" width="96" alt="async/await drip" style="display:inline-block;width:96px;height:auto"></a>
</div>
</td></tr>
</table>`,
  }
}
