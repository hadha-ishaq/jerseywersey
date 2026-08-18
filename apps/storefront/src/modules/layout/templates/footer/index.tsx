import { listCategories } from "@lib/data/categories";
import { listCollections } from "@lib/data/collections";
import { BRAND, FOOTER } from "@lib/brand";

import LocalizedClientLink from "@modules/common/components/localized-client-link";

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  }).catch(() => ({ collections: [], count: 0 }));
  const productCategories = await listCategories().catch(() => []);

  return (
    <footer className="border-t border-neutral-200 w-full bg-white">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 small:gap-y-16 py-16 small:py-24">
          {/* Top: brand + nav columns */}
          <div className="flex flex-col gap-y-10 small:flex-row items-start justify-between">
            <div className="max-w-xs">
              <LocalizedClientLink
                href="/"
                className="jw-wordmark text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                {BRAND.name}
              </LocalizedClientLink>
              <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                {BRAND.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 md:gap-x-16">
              {/* Shop */}
              <div className="flex flex-col gap-y-3">
                <span className="jw-eyebrow text-neutral-900">Shop</span>
                <ul className="grid grid-cols-1 gap-y-2.5 text-sm text-neutral-500">
                  {FOOTER.shopLinks.map((link) => (
                    <li key={link.label}>
                      <LocalizedClientLink
                        className="hover:text-neutral-900 transition-colors"
                        href={link.href}
                      >
                        {link.label}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              {productCategories.length > 0 && (
                <div className="flex flex-col gap-y-3">
                  <span className="jw-eyebrow text-neutral-900">
                    Categories
                  </span>
                  <ul
                    className="grid grid-cols-1 gap-y-2.5 text-sm text-neutral-500"
                    data-testid="footer-categories"
                  >
                    {productCategories
                      ?.filter((c) => !c.parent_category)
                      .slice(0, 5)
                      .map((c) => (
                        <li key={c.id}>
                          <LocalizedClientLink
                            className="hover:text-neutral-900 transition-colors"
                            href={`/categories/${c.handle}`}
                            data-testid="category-link"
                          >
                            {c.name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Collections */}
              {collections.length > 0 && (
                <div className="flex flex-col gap-y-3">
                  <span className="jw-eyebrow text-neutral-900">
                    Collections
                  </span>
                  <ul className="grid grid-cols-1 gap-y-2.5 text-sm text-neutral-500">
                    {collections?.slice(0, 5).map((c) => (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="hover:text-neutral-900 transition-colors"
                          href={`/collections/${c.handle}`}
                        >
                          {c.title}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Customer Support */}
              <div className="flex flex-col gap-y-3">
                <span className="jw-eyebrow text-neutral-900">Support</span>
                <ul className="grid grid-cols-1 gap-y-2.5 text-sm text-neutral-500">
                  {FOOTER.customerService.map((link) => (
                    <li key={link.label}>
                      <LocalizedClientLink
                        className="hover:text-neutral-900 transition-colors"
                        href={link.href}
                      >
                        {link.label}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: copyright + policies */}
        <div className="flex flex-col small:flex-row gap-y-4 items-start small:items-center justify-between py-8 border-t border-neutral-200">
          <p className="text-xs text-neutral-400">{BRAND.copyright}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER.policies.map((link) => (
              <li key={link.label}>
                <LocalizedClientLink
                  className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
                  href={link.href}
                >
                  {link.label}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}