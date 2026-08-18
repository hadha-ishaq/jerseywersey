import { Metadata } from "next"
import PolicyPage from "@modules/content/templates/policy-page"

export const metadata: Metadata = {
  title: "FAQ | JerseyWersey",
  description:
    "Answers to common JerseyWersey questions about football jerseys, sizing, delivery, returns, payments, and accounts.",
}

export default function FaqPage() {
  return (
    <PolicyPage
      eyebrow="FAQ"
      title="Quick answers before kickoff."
      description="Common questions about buying football jerseys from JerseyWersey in India."
      blocks={[
        {
          title: "Are prices shown in INR?",
          body: "Yes. JerseyWersey is configured as an India-only storefront and prices should display in rupees when the Medusa India region is configured correctly.",
        },
        {
          title: "Can I checkout outside India?",
          body: "No. The current storefront is built for Indian addresses only. Medusa still keeps its region and country model behind the scenes, but customers should not see international country selection.",
        },
        {
          title: "How do I choose my size?",
          body: "Use the product size selector and the size guide before ordering. Football jerseys can vary by fit, especially player-fit and oversized styles.",
        },
        {
          title: "Where can I see my order?",
          body: "Create or sign in to your account to view order history and saved addresses. Guest order confirmation remains available through the confirmation page after checkout.",
        },
      ]}
    />
  )
}
