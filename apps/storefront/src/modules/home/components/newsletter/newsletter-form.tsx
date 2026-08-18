"use client"

import { HOMEPAGE } from "@lib/brand"
import { useState } from "react"

/**
 * Newsletter subscription form.
 *
 * NOTE: This is a UI-only implementation. There is currently no newsletter
 * backend integration. When one becomes available, connect the `handleSubmit`
 * below to the appropriate API without changing the component's interface.
 */
const NewsletterForm = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const { newsletter } = HOMEPAGE

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error")
      return
    }

    // TODO: Connect to a newsletter provider (e.g. Mailchimp, Klaviyo)
    // when backend support is available.
    setStatus("success")
    setEmail("")
  }

  return (
    <div>
      {status === "success" ? (
        <p
          className="text-sm font-medium text-neutral-900"
          data-testid="newsletter-success"
        >
          {newsletter.successMessage}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col small:flex-row gap-3 max-w-md"
          data-testid="newsletter-form"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === "error") setStatus("idle")
            }}
            placeholder={newsletter.placeholder}
            className="h-12 flex-1 px-4 border border-neutral-300 bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-jersey focus:border-transparent transition-shadow"
            autoComplete="email"
            required
            data-testid="newsletter-input"
          />
          <button type="submit" className="jw-btn-primary">
            {newsletter.cta}
          </button>
        </form>
      )}
      {status === "error" && (
        <p
          className="mt-2 text-xs text-red-600"
          data-testid="newsletter-error"
        >
          Please enter a valid email address.
        </p>
      )}
    </div>
  )
}

export default NewsletterForm