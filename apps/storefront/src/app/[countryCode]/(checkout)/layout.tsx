import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import { BRAND, CHECKOUT } from "@lib/brand"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      <div className="sticky top-0 z-30 h-16 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <nav className="flex h-full items-center content-container justify-between gap-4">
          <LocalizedClientLink
            href="/cart"
            className="flex flex-1 basis-0 items-center gap-x-2 text-small-semi uppercase text-ui-fg-base transition-colors hover:text-ui-fg-interactive"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle">
              {CHECKOUT.backToCart}
            </span>
            <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle">
              {CHECKOUT.back}
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="jw-wordmark text-ui-fg-base transition-colors hover:text-ui-fg-interactive"
            data-testid="store-link"
          >
            {BRAND.wordmark}
          </LocalizedClientLink>
          <div className="flex flex-1 basis-0 justify-end">
            <span className="hidden small:block jw-eyebrow text-ui-fg-subtle">
              Secure India checkout
            </span>
          </div>
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
  )
}
