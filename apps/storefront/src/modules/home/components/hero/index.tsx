import { HERO } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative w-full bg-pitch text-white overflow-hidden">
      {/* Subtle pitch-line texture */}
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 79px, rgba(255,255,255,1) 80px)",
        }}
        aria-hidden="true"
      />

      <div className="content-container relative z-10 flex flex-col justify-center min-h-[70vh] small:min-h-[80vh] py-20 small:py-32">
        <div className="max-w-3xl">
          <p className="jw-eyebrow text-jersey mb-6">{HERO.eyebrow}</p>

          <h1 className="jw-headline-xl">
            {HERO.headlineTop}
            <br />
            <span className="text-jersey">{HERO.headlineAccent}</span>
          </h1>

          <p className="mt-6 text-base small:text-lg text-neutral-300 max-w-xl leading-relaxed">
            {HERO.subheadline}
          </p>

          <div className="mt-10 flex flex-col small:flex-row gap-4">
            <LocalizedClientLink
              href={HERO.primaryCta.href}
              className="jw-btn-accent"
              data-testid="hero-shop-button"
            >
              {HERO.primaryCta.label}
            </LocalizedClientLink>
            <LocalizedClientLink
              href={HERO.secondaryCta.href}
              className="jw-btn-secondary !border-white !text-white hover:!bg-white hover:!text-pitch"
              data-testid="hero-collections-button"
            >
              {HERO.secondaryCta.label}
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Bottom trust strip */}
      <div className="relative z-10 border-t border-white/10">
        <div className="content-container py-6">
          <ul className="flex flex-col small:flex-row gap-4 small:gap-12">
            {HERO.trustItems.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-jersey rounded-full" />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    {item.label}
                  </span>
                  <span className="ml-2 text-xs text-neutral-400">
                    {item.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Hero