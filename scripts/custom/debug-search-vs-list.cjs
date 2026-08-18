const fs = require("fs")
const path = require("path")
const { Client } = require("pg")

let PK = ""
let DBURL = ""
for (const f of ["apps/storefront/.env.local", "apps/storefront/.env"]) {
  try {
    const c = fs.readFileSync(path.join(process.cwd(), f), "utf8")
    const m = c.match(/NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=(.+)/)
    if (m) { PK = m[1].trim(); break }
  } catch (e) {}
}
for (const f of ["apps/backend/.env", "apps/backend/.env.local"]) {
  try {
    const c = fs.readFileSync(f, "utf8")
    const m = c.match(/DATABASE_URL=(.+)/)
    if (m) { DBURL = m[1].trim(); break }
  } catch (e) {}
}

const BASE = "http://localhost:9000"
const headers = { "x-publishable-api-key": PK }

async function tryFetch(url) {
  try {
    const res = await fetch(BASE + url, { headers })
    let body
    try { body = await res.json() } catch { body = null }
    return { ok: res.ok, status: res.status, body }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

async function main() {
  console.log("PK set:", !!PK)

  // Get all products from DB with their handles
  const db = new Client({ connectionString: DBURL })
  await db.connect()
  const prodRes = await db.query(
    "SELECT id, title, handle, status FROM product ORDER BY title"
  )
  const products = prodRes.rows
  console.log("DB products:")
  products.forEach((p) => console.log("  ", p.status, p.title, "->", p.handle, p.id))

  // Test each product handle via the store API (like product page listing)
  console.log("\n=== per-handle store API results ===")
  for (const p of products) {
    const r = await tryFetch("/store/products?handle=" + encodeURIComponent(p.handle) + "&fields=id,title,handle")
    const count = r.ok && r.body ? r.body.count : "ERR " + (r.error || r.status)
    const got = r.ok && r.body && r.body.products && r.body.products.length ? r.body.products[0].title : "-"
    console.log("  handle=" + p.handle + " -> count=" + count + " first=" + got)
  }

  // Test search queries (mimic searchProducts with q)
  console.log("\n=== search q= param results ===")
  for (const q of ["jersey", "Portugal", "medusa", "shirt", "a"]) {
    const r = await tryFetch("/store/products?q=" + encodeURIComponent(q) + "&fields=id,title,handle,thumbnail")
    const count = r.ok && r.body ? r.body.count : "ERR " + (r.error || r.status)
    const titles = r.ok && r.body && r.body.products ? r.body.products.map((x) => x.title) : []
    console.log("  q=" + q + " -> count=" + count + " titles=" + JSON.stringify(titles))
  }

  // Check which sales channel each product is in
  const scRes = await db.query(
    "SELECT p.title, sc.name AS sc FROM product p JOIN product_sales_channel psc ON psc.product_id = p.id JOIN sales_channel sc ON sc.id = psc.sales_channel_id ORDER BY p.title"
  )
  console.log("\nDB product -> sales channel:", JSON.stringify(scRes.rows))

  // Check variants -> price sets -> prices for each product
  const vpRes = await db.query(
    "SELECT p.title, pc.currency_code, COUNT(*)::int AS n " +
    "FROM product p " +
    "JOIN product_variant pv ON pv.product_id = p.id " +
    "JOIN product_variant_price_set pvps ON pvps.variant_id = pv.id " +
    "JOIN price_set ps ON ps.id = pvps.price_set_id " +
    "JOIN price pc ON pc.price_set_id = ps.id " +
    "GROUP BY p.title, pc.currency_code ORDER BY p.title, pc.currency_code"
  )
  console.log("\nDB product prices:", JSON.stringify(vpRes.rows))

  await db.end()
}

main().catch((e) => {
  console.error("ERR:", e.message)
})