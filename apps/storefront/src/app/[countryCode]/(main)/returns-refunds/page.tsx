import { Metadata } from "next"
import PolicyPage from "@modules/content/templates/policy-page"

export const metadata: Metadata = {
  title: "Returns & Refunds | JerseyWersey",
  description:
    "JerseyWersey returns and refunds information for football jersey orders in India.",
}

export default function ReturnsRefundsPage() {
  return (
    <PolicyPage
      eyebrow="Returns"
      title="Returns that stay clear and practical."
      description="We want every jersey to arrive as expected. Contact support quickly if something is wrong with your order."
      blocks={[
        {
          title: "Return eligibility",
          body: "Items should be unused, unwashed, with tags and original packaging where applicable. Customised, personalised, damaged-after-delivery, or final-sale items may not be eligible for return.",
        },
        {
          title: "Damaged or incorrect item",
          body: "Contact support with your order number and clear photos within 48 hours of delivery. We will review the issue and guide you through replacement, return, or refund options.",
        },
        {
          title: "Refund processing",
          body: "Approved refunds are processed through the original payment method configured in checkout. Bank and payment provider timelines may vary.",
        },
      ]}
      cta={{ label: "Contact Support", href: "/contact" }}
    />
  )
}
