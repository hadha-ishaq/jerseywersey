"use client"

import { CHECKOUT } from "@lib/brand"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, clx } from "@modules/common/components/ui"
import { useSearchParams } from "next/navigation"

import PaymentButton from "../payment-button"

const Review = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards &&
    ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])
      ?.length > 0 &&
    cart?.total === 0
  )

  const previousStepsCompleted =
    cart.shipping_address &&
    (cart.shipping_methods?.length ?? 0) > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 small:p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 small:flex-row small:items-center small:justify-between">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row items-baseline gap-x-2 text-2xl small:text-3xl text-ui-fg-base",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>

      {isOpen && previousStepsCompleted && (
        <>
          <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4">
            <Text className="jw-eyebrow mb-2 text-ui-fg-subtle">
              Final check
            </Text>
            <Text className="text-base-regular text-ui-fg-base">
              {CHECKOUT.termsNote}
            </Text>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </section>
  )
}

export default Review
