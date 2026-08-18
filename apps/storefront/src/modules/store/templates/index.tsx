import { Suspense } from "react"

import { EMPTY_STATES } from "@lib/brand"
import { OptionValueIds } from "@lib/util/product-option-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
  q,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
  q?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <main className="bg-white" data-testid="category-container">
      <section className="border-b border-neutral-200 bg-offwhite">
        <div className="content-container py-12 small:py-16">
          <p className="jw-eyebrow text-neutral-500">JerseyWersey Shop</p>
          <div className="mt-4 flex flex-col gap-6 small:flex-row small:items-end small:justify-between">
            <div>
              <h1
                className="max-w-3xl text-4xl font-semibold tracking-tight small:text-6xl"
                data-testid="store-page-title"
              >
                Football jerseys online in India
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600 small:text-base">
                Browse club kits, national team jerseys, retro football shirts,
                new arrivals, and matchday favourites with INR pricing and
                India-only checkout.
              </p>
            </div>
            {q && (
              <LocalizedClientLink
                href="/store"
                className="text-xs font-semibold uppercase tracking-widest text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline"
              >
                Clear search
              </LocalizedClientLink>
            )}
          </div>

            {q && (
              <p className="mt-6 text-sm text-neutral-600">
                Showing results for{" "}
                <span className="font-semibold text-neutral-900">
                  &quot;{q}&quot;
                </span>
              </p>
            )}
        </div>
      </section>

      <div className="content-container grid gap-8 py-8 small:grid-cols-[260px_1fr] small:items-start small:py-12">
        <aside className="small:sticky small:top-24">
          <details className="rounded-md border border-neutral-200 bg-white small:hidden">
            <summary className="cursor-pointer px-4 py-3 text-xs font-semibold uppercase tracking-widest">
              Sort and filter
            </summary>
            <RefinementList sortBy={sort} />
          </details>
          <div className="hidden small:block">
            <RefinementList sortBy={sort} />
          </div>
        </aside>

        <section className="min-w-0">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
              q={q}
              emptyState={EMPTY_STATES.noProducts}
            />
          </Suspense>
        </section>
      </div>
    </main>
  )
}

export default StoreTemplate
