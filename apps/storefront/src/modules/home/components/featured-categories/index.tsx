import { HOMEPAGE } from "@lib/brand"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FEATURED_HANDLES = ["club", "national", "retro", "new"]

const FeaturedCategories = ({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) => {
  // Only show categories that map to actual live store data
  const featured = categories.filter((c) => {
    if (!c.parent_category) return false
    const handle = c.handle?.toLowerCase() ?? ""
    const name = c.name?.toLowerCase() ?? ""
    return FEATURED_HANDLES.some(
      (keyword) => handle.includes(keyword) || name.includes(keyword)
    )
  })

  // Fall back to top-level categories if no keyword matches
  let displayCategories = featured.slice(0, 3)
  if (displayCategories.length === 0) {
    displayCategories = categories.filter((c) => !c.parent_category).slice(0, 3)
  }

  if (displayCategories.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-16 small:py-24">
      <div className="content-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="jw-eyebrow text-neutral-900 mb-3">
              {HOMEPAGE.featuredCategoriesTitle}
            </h2>
            <p className="font-display text-2xl small:text-3xl font-semibold tracking-tight">
              {HOMEPAGE.featuredCategoriesSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-3 gap-6">
          {displayCategories.map((category, index) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="group relative bg-pitch text-white overflow-hidden aspect-[4/5] block"
              data-testid="featured-category"
            >
              <div
                className="absolute inset-0 flex items-end p-6 small:p-8"
                style={{
                  background: `linear-gradient(180deg, transparent 40%, rgba(10,11,13,0.85) 75%)`,
                }}
              >
                <div>
                  <span className="jw-eyebrow text-jersey mb-2 block">
                    0{index + 1}
                  </span>
                  <h3 className="text-2xl small:text-3xl font-semibold uppercase tracking-tight group-hover:text-jersey transition-colors">
                    {category.name}
                  </h3>
                  <span className="mt-3 text-xs uppercase tracking-widest text-neutral-400 inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Shop now
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCategories
