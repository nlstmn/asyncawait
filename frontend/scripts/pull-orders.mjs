// Pulls every stored order out of the site's Netlify Blobs store into
// frontend/orders.json (gitignored). Run with `npm run orders`; needs
// NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN in frontend/.env.
import { writeFileSync } from 'node:fs'
import { getStore } from '@netlify/blobs'

const { NETLIFY_SITE_ID: siteID, NETLIFY_AUTH_TOKEN: token } = process.env
if (!siteID || !token) {
  console.error('set NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN in frontend/.env (see .env.example)')
  process.exit(1)
}

const store = getStore({ name: 'orders', siteID, token, consistency: 'strong' })
const { blobs } = await store.list({ prefix: 'order/' })

const orders = []
for (const { key } of blobs) orders.push(await store.get(key, { type: 'json' }))
orders.sort((a, b) => String(a.id).localeCompare(String(b.id)))

const out = new URL('../orders.json', import.meta.url)
writeFileSync(out, JSON.stringify(orders, null, 2) + '\n')
console.log(`${orders.length} order(s) → frontend/orders.json`)
