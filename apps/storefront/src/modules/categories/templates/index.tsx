import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <main className="bg-white" data-testid="category-container">
      <section className="border-b border-neutral-200 bg-offwhite">
        <div className="content-container py-12 small:py-16">
          <p className="jw-eyebrow text-neutral-500">Category</p>
          <div className="mt-4 flex flex-col gap-6 small:flex-row small:items-end small:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                {parents?.length > 0 &&
                  parents
                    .slice()
                    .reverse()
                    .map((parent, index) => (
                      <span key={parent.id} className="flex items-center gap-2">
                        <LocalizedClientLink
                          className="hover:text-neutral-900"
                          href={`/categories/${parent.handle}`}
                          data-testid="sort-by-link"
                        >
                          {parent.name}
                        </LocalizedClientLink>
                        {index < parents.length - 1 && <span>/</span>}
                      </span>
                    ))}
              </div>
              <h1
                className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight small:text-6xl"
                data-testid="category-page-title"
              >
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600 small:text-base">
                  {category.description}
                </p>
              )}
            </div>
            <LocalizedClientLink
              href="/store"
              className="text-xs font-semibold uppercase tracking-widest text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Back to shop
            </LocalizedClientLink>
          </div>
          {category.category_children && category.category_children.length > 0 && (
            <div className="mt-8">
              <ul className="grid grid-cols-2 gap-3 small:grid-cols-4">
                {category.category_children?.map((c) => (
                  <li key={c.id}>
                    <InteractiveLink href={`/categories/${c.handle}`}>
                      {c.name}
                    </InteractiveLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <div className="content-container grid gap-8 py-8 small:grid-cols-[260px_1fr] small:items-start small:py-12">
        <aside className="small:sticky small:top-24">
          <details className="rounded-md border border-neutral-200 bg-white small:hidden">
            <summary className="cursor-pointer px-4 py-3 text-xs font-semibold uppercase tracking-widest">
              Sort and filter
            </summary>
            <RefinementList
              sortBy={sort}
              data-testid="sort-by-container"
              hideOptionsPicker
            />
          </details>
          <div className="hidden small:block">
            <RefinementList
              sortBy={sort}
              data-testid="sort-by-container"
              hideOptionsPicker
            />
          </div>
        </aside>

        <section className="min-w-0">
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
            />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
