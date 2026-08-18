const fs = require("fs")
const path = require("path")

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

  // Find India region id
  const regRes = await tryFetch("/store/regions")
  const india = (regRes.body && regRes.body.regions || []).find((r) => r.name === "India")
  console.log("india id:", india && india.id)

  // Exact searchProducts() call - no region_id, includes calculated_price
  const searchFields = "id,title,handle,thumbnail,*variants.calculated_price"
  for (const q of ["medusa", "shirt", "jersey", "portugal"]) {
    const r = await tryFetch("/store/products?limit=8&offset=0&q=" + encodeURIComponent(q) + "&fields=" + encodeURIComponent(searchFields))
    console.log("SEARCH q=" + q + " -> ok=" + r.ok + " status=" + r.status + " count=" + ((r.body && r.body.count) ?? r.error || r.status))
    if (r.body && r.body.message) console.log("   msg:", r.body.message)
    if (r.ok && r.body && r.body.products) console.log("   titles:", JSON.stringify(r.body.products.map((p) => p.title)))
  }

  // Exact listProducts() call with region_id + the full fields string from the storefront
  if (india) {
    const fullFields = "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,"
    const r = await tryFetch("/store/products?limit=12&offset=0&region_id=" + india.id + "&fields=" + encodeURIComponent(fullFields))
    console.log("\nLIST with region_id (storefront fields) -> ok=" + r.ok + " status=" + r.status + " count=" + ((r.body && r.body.count) ?? r.error || r.status))
    if (r.body && r.body.message) console.log("   msg:", r.body.message)
    if (r.ok && r.body && r.body.products) console.log("   titles:", JSON.stringify(r.body.products.map((p) => p.title)))
  }

  // listProducts with just calculated_price + region India
  if (india) {
    const r = await tryFetch("/store/products?limit=4&region_id=" + india.id + "&fields=" + encodeURIComponent("*variants.calculated_price"))
    console.log("\nLIST with region_id + calc_price only -> count=" + ((r.body && r.body.count) ?? r.error || r.status))
    if (r.ok && r.body && r.body.products) console.log("   titles:", JSON.stringify(r.body.products.map((p) => p.title)))
  }
}

main().catch((e) => {
  console.error("ERR:", e.message)
})