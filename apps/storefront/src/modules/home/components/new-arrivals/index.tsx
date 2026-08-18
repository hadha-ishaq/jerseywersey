import { listProducts } from "@lib/data/products"
import { HOMEPAGE } from "@lib/brand"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const NewArrivals = async ({ region }: { region: HttpTypes.StoreRegion | null }) => {
  if (!region) {
    return null
  }
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 4,
      fields: "*variants.calculated_price",
      order: "created_at",
    },
  }).catch(() => ({ response: { products: [], count: 0 } }))

  if (!products?.length) {
    return null
  }

  return (
    <section className="bg-offwhite py-16 small:py-24">
      <div className="content-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="jw-eyebrow text-neutral-900 mb-3">
              {HOMEPAGE.newArrivalsTitle}
            </h2>
            <p className="font-display text-2xl small:text-3xl font-semibold tracking-tight">
              {HOMEPAGE.newArrivalsSubtitle}
            </p>
          </div>
          <LocalizedClientLink
            href="/store"
            className="hidden small:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-900 hover:text-neutral-500 transition-colors"
          >
            View all
            <span aria-hidden="true">&rarr;</span>
          </LocalizedClientLink>
        </div>

        <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} />
            </li>
          ))}
        </ul>

        <div className="mt-10 small:hidden">
          <LocalizedClientLink
            href="/store"
            className="jw-btn-secondary w-full"
          >
            View all
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default NewArrivals