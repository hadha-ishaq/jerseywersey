import { BRAND } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ContentBlock = {
  title: string
  body: string
}

type PolicyPageProps = {
  eyebrow: string
  title: string
  description: string
  blocks: ContentBlock[]
  cta?: {
    label: string
    href: string
  }
}

export default function PolicyPage({
  eyebrow,
  title,
  description,
  blocks,
  cta,
}: PolicyPageProps) {
  return (
    <main className="bg-white">
      <section className="border-b border-neutral-200 bg-offwhite">
        <div className="content-container py-16 small:py-24">
          <p className="jw-eyebrow text-neutral-500">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight small:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600 small:text-lg">
            {description}
          </p>
        </div>
      </section>

      <section className="content-container grid gap-10 py-14 small:grid-cols-[280px_1fr] small:py-20">
        <aside className="text-sm text-neutral-500">
          <p className="font-semibold text-neutral-900">{BRAND.name}</p>
          <p className="mt-2">{BRAND.city}</p>
          <p className="mt-2">{BRAND.supportEmail}</p>
          <p>{BRAND.supportPhone}</p>
        </aside>

        <div className="max-w-3xl space-y-10">
          {blocks.map((block) => (
            <section key={block.title}>
              <h2 className="text-xl font-semibold tracking-tight">
                {block.title}
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral-600 small:text-base">
                {block.body}
              </p>
            </section>
          ))}

          {cta && (
            <LocalizedClientLink href={cta.href} className="jw-btn-primary">
              {cta.label}
            </LocalizedClientLink>
          )}
        </div>
      </section>
    </main>
  )
}
