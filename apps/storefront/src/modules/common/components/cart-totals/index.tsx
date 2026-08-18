"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 small:p-5">
      <div className="space-y-3 text-small-regular text-ui-fg-muted">
        <div className="flex items-center justify-between gap-4">
          <span>Subtotal</span>
          <span
            className="shrink-0 text-ui-fg-base"
            data-testid="cart-subtotal"
            data-value={item_subtotal || 0}
          >
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Shipping</span>
          <span
            className="shrink-0 text-ui-fg-base"
            data-testid="cart-shipping"
            data-value={shipping_subtotal || 0}
          >
            {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_subtotal && (
          <div className="flex items-center justify-between gap-4">
            <span>Discount</span>
            <span
              className="shrink-0 text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
            >
              -{" "}
              {convertToLocale({
                amount: discount_subtotal ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <span className="flex items-center gap-x-1">Taxes</span>
          <span
            className="shrink-0 text-ui-fg-base"
            data-testid="cart-taxes"
            data-value={tax_total || 0}
          >
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
      </div>
      <div className="my-4 h-px w-full border-b border-neutral-200" />
      <div className="flex items-center justify-between gap-4 text-ui-fg-base txt-medium">
        <span className="jw-eyebrow text-ui-fg-subtle">Total</span>
        <span
          className="txt-xlarge-plus text-ui-fg-base"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals
