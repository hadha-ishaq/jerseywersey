const fs = require("fs")
const { Client } = require("pg")

let dbUrl = ""
for (const f of ["apps/backend/.env", "apps/backend/.env.local"]) {
  try {
    const c = fs.readFileSync(f, "utf8")
    const m = c.match(/DATABASE_URL=(.+)/)
    if (m) { dbUrl = m[1].trim(); break }
  } catch (e) {}
}

async function main() {
  if (!dbUrl) { console.log("NO DATABASE_URL"); return }
  const client = new Client({ connectionString: dbUrl })
  await client.connect()

  const regionRes = await client.query(
    "SELECT id, name, currency_code FROM region ORDER BY name"
  )
  console.log("regions:", JSON.stringify(regionRes.rows, null, 2))

  const productCount = await client.query("SELECT COUNT(*)::int AS c FROM product")
  const published = await client.query(
    "SELECT COUNT(*)::int AS c FROM product WHERE status = 'published'"
  )
  console.log("products total:", productCount.rows[0].c, "published:", published.rows[0].c)

  const priceRes = await client.query(
    "SELECT p.currency_code, COUNT(*)::int AS c FROM price p GROUP BY p.currency_code ORDER BY p.currency_code"
  )
  console.log("prices by currency:", JSON.stringify(priceRes.rows))

  const scRes = await client.query(
    "SELECT id, name FROM sales_channel ORDER BY name"
  )
  console.log("sales channels:", JSON.stringify(scRes.rows))

  const apiKeyRes = await client.query(
    "SELECT id, title, type FROM api_key ORDER BY title"
  )
  console.log("api keys:", JSON.stringify(apiKeyRes.rows))

  const tblRes = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND (table_name ILIKE '%api%' OR table_name ILIKE '%sales_channel%') ORDER BY table_name"
  )
  console.log("relevant tables:", JSON.stringify(tblRes.rows.map((r) => r.table_name)))

  const scProducts = await client.query(
    "SELECT sc.id, sc.name, COUNT(psc.product_id)::int AS products FROM sales_channel sc LEFT JOIN product_sales_channel psc ON psc.sales_channel_id = sc.id GROUP BY sc.id, sc.name ORDER BY sc.name"
  )
  console.log("products per sales channel:", JSON.stringify(scProducts.rows))

  const kcRes = await client.query(
    "SELECT COUNT(*)::int AS c FROM product WHERE handle IS NULL OR handle = ''"
  )
  console.log("products with missing handle:", kcRes.rows[0].c)

  const unpub = await client.query(
    "SELECT id, title, handle, status FROM product WHERE status <> 'published' ORDER BY title"
  )
  console.log("unpublished products:", JSON.stringify(unpub.rows))

  const pkSc = await client.query("SELECT * FROM publishable_api_key_sales_channel")
  console.log("pub-key sales channels:", JSON.stringify(pkSc.rows))

  const stores = await client.query("SELECT id, name, default_sales_channel_id FROM store")
  console.log("stores:", JSON.stringify(stores.rows))

  const rc = await client.query(
    "SELECT r.name, c.iso_2 FROM region r JOIN region_country c ON c.region_id = r.id ORDER BY r.name, c.iso_2"
  )
  console.log("region countries:", JSON.stringify(rc.rows))

  const priceCols = await client.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'price' ORDER BY ordinal_position"
  )
  console.log("price columns:", JSON.stringify(priceCols.rows.map((r) => r.column_name)))

  const psCols = await client.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'price_set' ORDER BY ordinal_position"
  )
  console.log("price_set columns:", JSON.stringify(psCols.rows.map((r) => r.column_name)))

  const pvCols = await client.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'product_variant' ORDER BY ordinal_position"
  )
  console.log("product_variant columns:", JSON.stringify(pvCols.rows.map((r) => r.column_name)))

  const linkTables = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND (table_name ILIKE '%price_set%' OR table_name ILIKE '%variant%') ORDER BY table_name"
  )
  console.log("price/variant related tables:", JSON.stringify(linkTables.rows.map((r) => r.table_name)))

  await client.end()
}

main().catch((e) => {
  console.error("DB ERROR:", e.message)
  process.exitCode = 1
})