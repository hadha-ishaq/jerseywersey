import { Metadata } from "next"
import PolicyPage from "@modules/content/templates/policy-page"

export const metadata: Metadata = {
  title: "Football Jersey Size Guide | JerseyWersey",
  description:
    "Size guidance for buying football jerseys from JerseyWersey in India.",
}

export default function SizeGuidePage() {
  return (
    <PolicyPage
      eyebrow="Size Guide"
      title="Choose the right football jersey fit."
      description="Always check the product variant and description before ordering. Football jersey fits can vary by style."
      blocks={[
        {
          title: "Regular fit",
          body: "Regular-fit jerseys are usually comfortable for everyday wear. Choose your usual T-shirt size if you prefer a standard fit.",
        },
        {
          title: "Player fit",
          body: "Player-fit jerseys are more athletic and closer to the body. Consider sizing up if you prefer a relaxed fit.",
        },
        {
          title: "How to measure",
          body: "Measure a T-shirt that fits you well from chest to chest and shoulder to hem, then compare that against the product details where available.",
        },
      ]}
      cta={{ label: "Shop Jerseys", href: "/store" }}
    />
  )
}
