import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <main className="bg-white" data-testid="collection-container">
      <section className="border-b border-neutral-200 bg-offwhite">
        <div className="content-container py-12 small:py-16">
          <p className="jw-eyebrow text-neutral-500">Collection</p>
          <div className="mt-4 flex flex-col gap-6 small:flex-row small:items-end small:justify-between">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight small:text-6xl">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600 small:text-base">
                  {collection.description}
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
        </div>
      </section>

      <div className="content-container grid gap-8 py-8 small:grid-cols-[260px_1fr] small:items-start small:py-12">
        <aside className="small:sticky small:top-24">
          <details className="rounded-md border border-neutral-200 bg-white small:hidden">
            <summary className="cursor-pointer px-4 py-3 text-xs font-semibold uppercase tracking-widest">
              Sort and filter
            </summary>
            <RefinementList sortBy={sort} hideOptionsPicker />
          </details>
          <div className="hidden small:block">
            <RefinementList sortBy={sort} hideOptionsPicker />
          </div>
        </aside>

        <section className="min-w-0">
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={collection.products?.length}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
            />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
