"use client"

import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"
import { useCallback, useState } from "react"

type QuickAddProps = {
  product: HttpTypes.StoreProduct
  className?: string
}

const QuickAdd = ({ product, className }: QuickAddProps) => {
  const { countryCode } = useParams<{ countryCode: string }>()
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const variants = product.variants ?? []
  const singleVariant = variants.length === 1 ? variants[0] : null
  const canQuickAdd = !!singleVariant?.id

  const handleAdd = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (!singleVariant?.id || !countryCode) {
        return
      }

      setIsAdding(true)
      setError(null)

      try {
        await addToCart({
          variantId: singleVariant.id,
          quantity: 1,
          countryCode,
        })
      } catch {
        setError("Could not add to cart")
      } finally {
        setIsAdding(false)
      }
    },
    [singleVariant, countryCode]
  )

  if (!canQuickAdd) {
    return null
  }

  return (
    <div className={className}>
      {error && (
        <p className="mb-2 bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-600">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleAdd}
        disabled={isAdding}
        className="font-display w-full bg-pitch/90 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-all duration-300 hover:bg-pitch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jersey disabled:cursor-wait disabled:opacity-60 small:translate-y-2 small:opacity-0 small:group-hover:translate-y-0 small:group-hover:opacity-100"
        data-testid="quick-add-button"
      >
        {isAdding ? "Adding..." : "Add to cart"}
      </button>
    </div>
  )
}

export default QuickAdd