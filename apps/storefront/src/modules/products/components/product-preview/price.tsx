import { clx } from "@modules/common/components/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  const isSale = price.price_type === "sale"

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span
        className={clx(
          "font-display text-sm font-semibold tracking-tight text-neutral-900",
          isSale && "text-red-600"
        )}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
      {isSale && (
        <span
          className="text-xs text-neutral-400 line-through"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
    </div>
  )
}