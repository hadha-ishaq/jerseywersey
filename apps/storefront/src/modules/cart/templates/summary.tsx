"use client"

import { Button, Heading } from "@modules/common/components/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 small:p-6 shadow-sm">
      <div className="mb-4">
        <p className="jw-eyebrow text-ui-fg-subtle">Checkout</p>
        <Heading
          level="h2"
          className="mt-2 text-2xl small:text-[2rem] small:leading-[2.75rem] text-ui-fg-base"
        >
          Summary
        </Heading>
      </div>
      <div className="space-y-4">
        <CartTotals totals={cart} />
        <DiscountCode cart={cart} />
      </div>
      <Divider className="my-5" />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="h-11 w-full">Go to checkout</Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
