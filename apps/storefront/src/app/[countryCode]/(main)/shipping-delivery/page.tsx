import { Metadata } from "next"
import PolicyPage from "@modules/content/templates/policy-page"

export const metadata: Metadata = {
  title: "Shipping & Delivery | JerseyWersey",
  description:
    "Shipping and delivery information for JerseyWersey football jersey orders across India.",
}

export default function ShippingDeliveryPage() {
  return (
    <PolicyPage
      eyebrow="Shipping"
      title="Trackable delivery across India."
      description="Delivery options and prices are calculated from the live Medusa shipping methods available for your cart."
      blocks={[
        {
          title: "Delivery coverage",
          body: "JerseyWersey currently accepts Indian delivery addresses only. Please enter a valid 6-digit PIN code and a reachable Indian phone number during checkout.",
        },
        {
          title: "Shipping methods",
          body: "Available shipping methods are fetched from Medusa during checkout. If no delivery method appears, the store's India region, fulfillment provider, or shipping options need to be configured in Medusa Admin.",
        },
        {
          title: "Order tracking",
          body: "After your order is placed and fulfilled, tracking details may be shared through the contact information provided at checkout, depending on the configured fulfillment workflow.",
        },
      ]}
      cta={{ label: "Start Shopping", href: "/store" }}
    />
  )
}
