import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import Image from "next/image"
import PreviewPrice from "./price"
import QuickAdd from "./quick-add"

const NEW_PRODUCT_RECENCY_DAYS = 30

const isRecentlyCreated = (createdAt: string | null | undefined) => {
  if (!createdAt) {
    return false
  }

  const created = new Date(createdAt).getTime()

  if (Number.isNaN(created)) {
    return false
  }

  const cutoff = Date.now() - NEW_PRODUCT_RECENCY_DAYS * 24 * 60 * 60 * 1000

  return created >= cutoff
}

export default async function ProductPreview({
  product,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const image = product.thumbnail || product.images?.[0]?.url || null
  const isNew = isRecentlyCreated(product.created_at)
  const isOnSale = cheapestPrice?.price_type === "sale"
  const discountLabel = isOnSale ? `-${cheapestPrice?.percentage_diff}%` : null

  return (
    <div data-testid="product-wrapper" className="group flex h-full flex-col">
      {/* Image + hover quick-add */}
      <div className="group/img relative aspect-[3/4] w-full overflow-hidden bg-offwhite">
        {image ? (
          <Image
            src={image}
            alt={product.title ?? "Product image"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="absolute inset-0 object-cover object-center transition-transform duration-500 ease-out group-hover/img:scale-[1.04]"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlaceholderImage size={24} />
          </div>
        )}

        {/* Whole-card link overlay */}
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="absolute inset-0 z-10 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jersey focus-visible:ring-inset"
          aria-label={product.title ?? "View product"}
          data-testid="product-image-link"
        />

        {/* Badges from real product data */}
        {(isOnSale || isNew) && (
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col items-start gap-2">
            {isOnSale && discountLabel && (
              <span
                className="bg-jersey px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-pitch"
                data-testid="sale-badge"
              >
                {discountLabel}
              </span>
            )}
            {isNew && (
              <span className="bg-pitch px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                New
              </span>
            )}
          </div>
        )}

        <QuickAdd product={product} className="absolute inset-x-3 bottom-3 z-20" />
      </div>

      {/* Info */}
      <div className="mt-4 flex flex-1 flex-col gap-1.5">
        {product.collection?.title && (
          <span
            className="jw-eyebrow text-neutral-400"
            data-testid="product-collection"
          >
            {product.collection.title}
          </span>
        )}

        <LocalizedClientLink href={`/products/${product.handle}`}>
          <h3
            className="text-sm font-semibold leading-snug text-neutral-900 line-clamp-2 transition-colors group-hover:text-neutral-600"
            data-testid="product-title"
          >
            {product.title}
          </h3>
        </LocalizedClientLink>

        {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
      </div>
    </div>
  )
}