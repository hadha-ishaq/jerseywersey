import { Metadata } from "next"

import Editorial from "@modules/home/components/editorial"
import FeaturedCategories from "@modules/home/components/featured-categories"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import NewArrivals from "@modules/home/components/new-arrivals"
import TrustBar from "@modules/home/components/trust-bar"
import { SEO } from "@lib/brand"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  openGraph: SEO.openGraph,
  twitter: SEO.twitter,
  alternates: {
    canonical: "/",
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const [{ collections }, categories] = await Promise.all([
    listCollections({
      fields: "id, handle, title",
    }).catch(() => ({ collections: [], count: 0 })),
    listCategories().catch(() => []),
  ])

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <FeaturedCategories categories={categories} />
      <NewArrivals region={region} />
      <FeaturedProducts collections={collections} region={region} />
      <Editorial />
      <TrustBar />
    </>
  )
}
