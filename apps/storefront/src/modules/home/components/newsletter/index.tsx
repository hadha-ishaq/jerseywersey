import { HOMEPAGE } from "@lib/brand"
import NewsletterForm from "./newsletter-form"

const Newsletter = () => {
  const { newsletter } = HOMEPAGE

  return (
    <section className="bg-offwhite py-16 small:py-24">
      <div className="content-container">
        <div className="max-w-2xl">
          <h2 className="jw-eyebrow text-neutral-900 mb-4">
            {newsletter.title}
          </h2>
          <p className="font-display text-2xl small:text-3xl font-semibold tracking-tight">
            {newsletter.subtitle}
          </p>
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter