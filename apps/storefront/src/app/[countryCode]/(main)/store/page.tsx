import { Metadata } from "next"

import { parseOptionValueIds } from "@lib/util/product-option-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Shop Football Jerseys Online in India | JerseyWersey",
  description:
    "Browse JerseyWersey football jerseys in India. Shop club kits, national team jerseys, retro football shirts, new arrivals, and best sellers in INR.",
  alternates: {
    canonical: "/store",
  },
  openGraph: {
    title: "Shop Football Jerseys Online in India | JerseyWersey",
    description:
      "Find premium football jerseys for Indian fans with secure checkout and India delivery.",
  },
}

type StorePageSearchParams = Record<string, string | string[] | undefined> & {
  sortBy?: SortOptions
  page?: string
  optionValueIds?: string | string[]
  q?: string
}

type Params = {
  searchParams: Promise<StorePageSearchParams>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, q } = searchParams
  const optionValueIds = parseOptionValueIds(searchParams)

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      optionValueIds={optionValueIds}
      q={typeof q === "string" ? q : undefined}
    />
  )
}
