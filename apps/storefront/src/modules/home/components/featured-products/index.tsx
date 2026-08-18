import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import { HOMEPAGE } from "@lib/brand"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  if (!collections?.length) {
    return null
  }

  return (
    <section className="bg-white py-16 small:py-24">
      <div className="content-container">
        <div className="mb-10">
          <h2 className="jw-eyebrow text-neutral-900 mb-3">
            {HOMEPAGE.featuredProductsTitle}
          </h2>
          <p className="text-2xl small:text-3xl font-semibold tracking-tight">
            {HOMEPAGE.featuredProductsSubtitle}
          </p>
        </div>
        <div className="flex flex-col gap-y-16 small:gap-y-24">
          {collections.map((collection) => (
            <ProductRail key={collection.id} collection={collection} region={region} />
          ))}
        </div>
      </div>
    </section>
  )
}