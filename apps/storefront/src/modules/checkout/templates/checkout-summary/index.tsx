import { Heading } from "@modules/common/components/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <div className="small:sticky small:top-6 flex flex-col gap-y-4 small:gap-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 small:p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="jw-eyebrow text-ui-fg-subtle">Order summary</p>
            <Heading
              level="h2"
              className="mt-2 text-2xl small:text-3xl text-ui-fg-base"
            >
              In your cart
            </Heading>
          </div>
          <p className="hidden small:block text-small-regular text-ui-fg-muted text-right max-w-[10rem]">
            Review items, discounts, and totals before payment.
          </p>
        </div>

        <Divider className="my-5" />
        <CartTotals totals={cart} />
        <div className="my-5">
          <ItemsPreviewTemplate cart={cart} />
        </div>
        <Divider className="my-5" />
        <DiscountCode cart={cart} />
      </div>
    </div>
  )
}

export default CheckoutSummary
