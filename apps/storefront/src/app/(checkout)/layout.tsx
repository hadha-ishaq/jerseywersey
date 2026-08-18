import { CHECKOUT } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      <div className="h-16 bg-white border-b border-neutral-200">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-xs font-semibold uppercase tracking-widest text-neutral-600 flex items-center gap-x-2 flex-1 basis-0"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block">
              {CHECKOUT.backToCart}
            </span>
            <span className="mt-px block small:hidden">{CHECKOUT.back}</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="jw-wordmark text-neutral-900"
            data-testid="store-link"
          >
            {CHECKOUT.wordmark}
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}