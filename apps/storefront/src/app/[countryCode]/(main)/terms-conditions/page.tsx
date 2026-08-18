import { Metadata } from "next"
import PolicyPage from "@modules/content/templates/policy-page"

export const metadata: Metadata = {
  title: "Terms & Conditions | JerseyWersey",
  description:
    "Terms and conditions for using JerseyWersey and placing football jersey orders in India.",
}

export default function TermsConditionsPage() {
  return (
    <PolicyPage
      eyebrow="Terms"
      title="Terms for shopping with JerseyWersey."
      description="These terms describe the practical conditions for browsing, buying, and receiving football jerseys through the JerseyWersey storefront."
      blocks={[
        {
          title: "Store usage",
          body: "Use the storefront only for lawful purchases and accurate checkout information. Orders may be delayed or cancelled if address, payment, inventory, or fraud checks fail.",
        },
        {
          title: "Product information",
          body: "We aim to keep titles, images, descriptions, variant options, pricing, and availability accurate. Product data is served from Medusa and may change as catalogue and inventory are updated.",
        },
        {
          title: "Checkout and payment",
          body: "Orders are only confirmed after successful payment and order creation through the configured Medusa checkout flow. A UI message alone is not a completed order.",
        },
        {
          title: "Delivery and returns",
          body: "Shipping, return, refund, and replacement handling follows the policies published on this storefront and the options configured for the India region in Medusa.",
        },
      ]}
      cta={{ label: "Shop Jerseys", href: "/store" }}
    />
  )
}
