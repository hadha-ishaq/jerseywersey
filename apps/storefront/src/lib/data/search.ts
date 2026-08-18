"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export type SearchResult = {
  products: HttpTypes.StoreProduct[]
  count: number
}

export async function searchProducts(
  query: string,
  regionId?: string,
  limit = 8
): Promise<SearchResult> {
  if (!query || query.trim().length < 2) {
    return { products: [], count: 0 }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  const params: Record<string, unknown> = {
    limit,
    offset: 0,
    q: query.trim(),
    fields:
      "id,title,handle,thumbnail,images,*variants.calculated_price",
  }

  if (regionId) {
    params["region_id"] = regionId
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: params,
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => ({ products, count }))
    .catch(() => ({ products: [], count: 0 }))
}