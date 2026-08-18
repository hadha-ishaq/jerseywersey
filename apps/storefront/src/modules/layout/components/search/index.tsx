"use client"

import { searchProducts } from "@lib/data/search"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { XMark } from "@medusajs/icons"
import SearchIcon from "@modules/common/icons/search"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useCallback, useEffect, useRef, useState } from "react"

const Search = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<HttpTypes.StoreProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search as the user types
  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (query.trim().length < 2) {
      setResults([])
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    const timeoutId = setTimeout(async () => {
      try {
        const { products } = await searchProducts(query, undefined, 8)
        setResults(products)
      } catch {
        setError("Something went wrong. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }, 250)

    return () => clearTimeout(timeoutId)
  }, [query, isOpen])

  const open = useCallback(() => {
    setIsOpen(true)
    // Focus the input after the overlay mounts
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery("")
    setResults([])
    setError(null)
  }, [])

  // Close on escape
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen, close])

  // Lock body scroll while the overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={open}
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jersey rounded-sm px-2 py-1"
        aria-label="Search products"
        data-testid="nav-search-button"
      >
        <SearchIcon size={18} />
        <span className="hidden small:block">Search</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          data-testid="search-overlay"
        >
          <div
            className="fixed inset-x-0 top-0 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
          >
            <div className="content-container py-6 small:py-10">
              <div className="flex items-center justify-between mb-6">
                <span className="jw-eyebrow text-neutral-400">Search</span>
                <button
                  onClick={close}
                  className="flex items-center gap-2 text-sm uppercase tracking-wider hover:text-neutral-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jersey rounded-md px-2 py-1"
                  aria-label="Close search"
                  data-testid="search-close-button"
                >
                  Close
                  <XMark />
                </button>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <SearchIcon size={20} color="#9CA3AF" />
                </div>
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search clubs, teams, players..."
                  className="w-full h-14 pl-12 pr-4 border-b-2 border-neutral-900 text-xl small:text-2xl font-medium placeholder:text-neutral-400 focus:outline-none focus:border-jersey transition-colors"
                  autoComplete="off"
                  data-testid="search-input"
                />
              </div>

              <div className="mt-6 min-h-[120px]" data-testid="search-results">
                {query.trim().length < 2 ? (
                  <p className="text-sm text-neutral-500 py-8 text-center">
                    Type at least 2 characters to search.
                  </p>
                ) : isLoading ? (
                  <div className="py-8 flex flex-col gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex gap-4 animate-pulse"
                        aria-hidden="true"
                      >
                        <div className="w-16 h-20 bg-neutral-100" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-neutral-100 w-2/3 rounded" />
                          <div className="h-3 bg-neutral-100 w-1/4 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <p className="text-sm text-red-600 py-8 text-center">
                    {error}
                  </p>
                ) : results.length === 0 ? (
                  <p className="text-sm text-neutral-500 py-8 text-center">
                    No jerseys found for "{query}". Try a different
                    search.
                  </p>
                ) : (
                  <ul className="divide-y divide-neutral-100">
                    {results.map((product) => {
                      const { cheapestPrice } = getProductPrice({ product })
                      return (
                        <li key={product.id}>
                          <LocalizedClientLink
                            href={`/products/${product.handle}`}
                            onClick={close}
                            className="flex items-center gap-4 py-4 hover:bg-neutral-50 transition-colors rounded-md px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jersey"
                            data-testid="search-result"
                          >
                            <div className="w-14 h-[70px] bg-neutral-100 overflow-hidden flex-shrink-0">
                              {product.thumbnail && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-neutral-900 truncate">
                                {product.title}
                              </p>
                              {cheapestPrice && (
                                <p className="text-xs text-neutral-500 mt-0.5">
                                  {cheapestPrice.calculated_price}
                                </p>
                              )}
                            </div>
                            <span className="text-xs uppercase tracking-wider text-neutral-400 hidden small:block">
                              View
                            </span>
                          </LocalizedClientLink>
                        </li>
                      )
                    })}
                    <li className="pt-4">
                      <LocalizedClientLink
                        href={`/store?q=${encodeURIComponent(query)}`}
                        onClick={close}
                        className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-pitch hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jersey rounded-md px-2 py-2"
                        data-testid="search-view-all"
                      >
                        View all results
                      </LocalizedClientLink>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Search