import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Search from "@modules/layout/components/search"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    listCategories().catch(() => []),
  ])

  const topLevelCategories = categories?.filter((c) => !c.parent_category) || []

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-neutral-200">
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Left: mobile menu + desktop nav links */}
          <div className="flex-1 basis-0 h-full flex items-center gap-6">
            <div className="h-full small:hidden">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>

            {/* Desktop navigation */}
            <div className="hidden small:flex items-center gap-8 h-full">
              <LocalizedClientLink
                href="/store"
                className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jersey rounded-sm"
                data-testid="nav-store-link"
              >
                Shop All
              </LocalizedClientLink>

              {topLevelCategories.slice(0, 2).map((category) => (
                <LocalizedClientLink
                  key={category.id}
                  href={`/categories/${category.handle}`}
                  className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jersey rounded-sm"
                  data-testid="nav-category-link"
                >
                  {category.name}
                </LocalizedClientLink>
              ))}

            </div>
          </div>

          {/* Center: wordmark */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="jw-wordmark text-neutral-900 hover:text-neutral-600 transition-colors"
              data-testid="nav-store-link"
            >
              JerseyWersey
            </LocalizedClientLink>
          </div>

          {/* Right: search, account, cart */}
          <div className="flex items-center gap-2 small:gap-4 h-full flex-1 basis-0 justify-end">
            <Search />

            <LocalizedClientLink
              href="/account"
              className="font-display hidden small:flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jersey rounded-sm px-2 py-1"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>

            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  className="font-display flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors px-2 py-1"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
