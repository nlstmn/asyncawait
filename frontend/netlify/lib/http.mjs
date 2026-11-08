// Bits shared by the order functions (order.mjs, paid.mjs). Lives outside
// netlify/functions/ so Netlify doesn't deploy it as a function of its own.
import { getStore } from '@netlify/blobs'

// Only our own site (or a dev / preview origin) may call the functions: they
// are public, send email from our domain and write to the order store.
const DEFAULT_ORIGINS = ['https://asyncdrip.com', 'https://www.asyncdrip.com']
const DEV_ORIGIN_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/

const allowedOrigins = () =>
  (process.env.ORDER_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean).concat(DEFAULT_ORIGINS)

export function originAllowed(origin) {
  if (!origin) return false
  if (allowedOrigins().includes(origin)) return true
  if (DEV_ORIGIN_RE.test(origin)) return true
  // deploy previews / branch deploys, but never on the production site
  return process.env.CONTEXT !== 'production' && /^https:\/\/[a-z0-9-]+\.netlify\.app$/.test(origin)
}

export const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
})

export const strong = (name) => getStore({ name, consistency: 'strong' })

export async function send(payload) {
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

// Revolut: PAY_REVOLUT is the Revtag (with or without the @). A personal
// revolut.me page can't carry an amount, so the customer types it; the site
// and the email show the amount and order number right next to the link.
export const revolutTag = () => (process.env.PAY_REVOLUT || '').replace(/^@/, '').trim()
export const revolutUrl = () => (revolutTag() ? `https://revolut.me/${encodeURIComponent(revolutTag())}` : '')

// what the customer needs to pay: only the revolut page. Bank details are
// never shown or emailed.
export const payInfo = () => ({ revolut: revolutUrl() })
