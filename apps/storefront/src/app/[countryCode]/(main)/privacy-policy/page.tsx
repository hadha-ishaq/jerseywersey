import { Metadata } from "next"
import PolicyPage from "@modules/content/templates/policy-page"

export const metadata: Metadata = {
  title: "Privacy Policy | JerseyWersey",
  description:
    "How JerseyWersey handles customer information for orders, accounts, delivery, payments, and support.",
}

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy"
      title="How we handle customer information."
      description="This page explains the storefront-level information JerseyWersey uses to process orders and support customers."
      blocks={[
        {
          title: "Information we collect",
          body: "We collect information needed to run the store, including name, email, phone number, shipping and billing address, account details, cart details, and order history.",
        },
        {
          title: "How we use it",
          body: "We use customer information to create carts, process checkout, accept payment through configured providers, arrange delivery, provide order support, prevent fraud, and improve store operations.",
        },
        {
          title: "Payments",
          body: "Payment details are handled by the configured payment provider. Do not send card, UPI, OTP, or bank credentials to JerseyWersey support.",
        },
        {
          title: "Your choices",
          body: "You can contact support to request help with account, address, or order information. Legal retention requirements and platform records may limit what can be changed or removed.",
        },
      ]}
      cta={{ label: "Contact Support", href: "/contact" }}
    />
  )
}
