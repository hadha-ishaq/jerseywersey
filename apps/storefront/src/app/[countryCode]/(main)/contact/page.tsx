import { BRAND } from "@lib/brand"
import { Metadata } from "next"
import PolicyPage from "@modules/content/templates/policy-page"

export const metadata: Metadata = {
  title: "Contact JerseyWersey",
  description:
    "Contact JerseyWersey for order, delivery, sizing, return, and product support.",
}

export default function ContactPage() {
  return (
    <PolicyPage
      eyebrow="Contact"
      title="Need help with a jersey, order, or delivery?"
      description="Send us your order number, email address, and a short description of the issue so our support team can help quickly."
      blocks={[
        {
          title: "Customer support",
          body: `Email: ${BRAND.supportEmail}\nPhone: ${BRAND.supportPhone}\nLocation: ${BRAND.city}`,
        },
        {
          title: "Order help",
          body: "For order-specific requests, include your order number and the email or phone number used at checkout. This helps us find the order without asking for sensitive payment information.",
        },
        {
          title: "Typical response time",
          body: "We aim to respond within 1 business day. Delivery and payment issues may take longer when they require confirmation from the shipping or payment provider.",
        },
      ]}
      cta={{ label: "View Account", href: "/account" }}
    />
  )
}
