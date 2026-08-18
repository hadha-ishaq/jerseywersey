import { HOMEPAGE } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Editorial = () => {
  const { editorial } = HOMEPAGE

  return (
    <section className="bg-pitch text-white py-20 small:py-32">
      <div className="content-container">
        <div className="max-w-4xl">
          <p className="jw-eyebrow text-jersey mb-6">{editorial.eyebrow}</p>
          <h2 className="jw-headline-xl">{editorial.headline}</h2>
          <p className="mt-8 text-base small:text-lg text-neutral-300 max-w-2xl leading-relaxed">
            {editorial.body}
          </p>
          <LocalizedClientLink
            href={editorial.cta.href}
            className="jw-btn-accent mt-10"
            data-testid="editorial-cta"
          >
            {editorial.cta.label}
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default Editorial