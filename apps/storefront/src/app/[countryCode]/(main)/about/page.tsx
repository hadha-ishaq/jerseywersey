import { Metadata } from "next"
import PolicyPage from "@modules/content/templates/policy-page"

export const metadata: Metadata = {
  title: "About JerseyWersey | Football Jerseys in India",
  description:
    "Learn about JerseyWersey, an India-focused football jersey ecommerce store for club, national team, and retro football shirts.",
}

export default function AboutPage() {
  return (
    <PolicyPage
      eyebrow="About"
      title="A football jersey store built for Indian fans."
      description="JerseyWersey brings premium football jerseys into a focused India-only shopping experience with clear pricing, reliable delivery, and practical support."
      blocks={[
        {
          title: "What we sell",
          body: "We focus on football jerseys across club teams, national teams, retro-inspired shirts, and new-season drops. Product availability depends on the catalogue configured in Medusa, so every product shown is pulled from the live store data.",
        },
        {
          title: "Why India-only",
          body: "The storefront is designed around INR pricing, Indian PIN codes, Indian phone numbers, and domestic delivery expectations. That keeps checkout simpler and avoids country selectors that do not apply to the current business.",
        },
        {
          title: "Our promise",
          body: "We aim for accurate product information, clear delivery timelines, secure checkout, and support that helps you resolve sizing, delivery, and order questions quickly.",
        },
      ]}
      cta={{ label: "Shop Jerseys", href: "/store" }}
    />
  )
}
