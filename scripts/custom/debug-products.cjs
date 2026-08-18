const fs = require("fs")
const path = require("path")

let PK = ""
for (const f of ["apps/storefront/.env.local", "apps/storefront/.env"]) {
  try {
    const c = fs.readFileSync(path.join(process.cwd(), f), "utf8")
    const m = c.match(/NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=(.+)/)
    if (m) { PK = m[1].trim(); break }
  } catch (e) {}
}

const BASES = ["http://localhost:9000", "http://[::1]:9000", "http://127.0.0.1:9000"]

async function tryFetch(url, init) {
  try {
    const res = await fetch(url, init)
    let body
    try { body = await res.json() } catch { body = null }
    return { ok: true, status: res.status, body }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

async function main() {
  console.log("PK set:", !!PK)
  const headers = { "x-publishable-api-key": PK }

  let base = null
  for (const b of BASES) {
    const r = await tryFetch(b + "/store/regions", { headers })
    if (r.ok) { base = b; console.log("using base:", b, "regions status:", r.status); break }
    console.log("base failed:", b, r.ok ? r.status : r.error)
  }
  if (!base) { console.log("NO REACHABLE BACKEND"); return }

  const regionsRes = await tryFetch(base + "/store/regions", { headers })
  const regions = (regionsRes.body && regionsRes.body.regions) || []
  console.log("regions:", JSON.stringify(regions.map(r => ({ id: r.id, name: r.name, currency_code: r.currency_code, countries: (r.countries || []).map(c => c.iso_2) }))))

  const region = regions.find(r => r.name && r.name.toLowerCase() === "india") || regions[0]
  console.log("using region for price test:", region && region.id)

  const noRegion = await tryFetch(base + "/store/products?limit=10&fields=id,title,handle,thumbnail", { headers })
  console.log("no-region count:", noRegion.ok ? noRegion.body.count : noRegion.error)
  console.log("no-region titles:", noRegion.ok ? (noRegion.body.products || []).map(p => p.title) : [])

  if (region) {
    const withRegion = await tryFetch(base + "/store/products?limit=10&region_id=" + region.id + "&fields=id,title,handle,thumbnail", { headers })
    console.log("with-region count:", withRegion.ok ? withRegion.body.count : withRegion.error)
    console.log("with-region titles:", withRegion.ok ? (withRegion.body.products || []).map(p => p.title) : [])

    // Exact fields string used by storefront listProducts (trailing comma)
    const fields = "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,"
    const fullFields = await tryFetch(base + "/store/products?limit=10&region_id=" + region.id + "&fields=" + encodeURIComponent(fields), { headers })
    console.log("full-fields count:", fullFields.ok ? fullFields.body.count : fullFields.error)
    if (!fullFields.ok || fullFields.body.message) {
      console.log("full-fields response:", JSON.stringify(fullFields.body))
    } else {
      console.log("full-fields titles:", (fullFields.body.products || []).map(p => p.title))
    }

    // Same fields but WITHOUT region_id (like search)
    const fullFieldsNoRegion = await tryFetch(base + "/store/products?limit=10&fields=" + encodeURIComponent(fields), { headers })
    console.log("full-fields-no-region count:", fullFieldsNoRegion.ok ? fullFieldsNoRegion.body.count : fullFieldsNoRegion.error)
    if (!fullFieldsNoRegion.ok || fullFieldsNoRegion.body.message) {
      console.log("full-fields-no-region response:", JSON.stringify(fullFieldsNoRegion.body))
    } else {
      console.log("full-fields-no-region titles:", (fullFieldsNoRegion.body.products || []).map(p => p.title))
    }
  }
}

main()