import { BRAND } from "@lib/brand"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
}

export default async function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <p className="jw-eyebrow text-neutral-400">404</p>
      <h1 className="jw-headline text-neutral-900 text-center">
        Page not found
      </h1>
      <p className="text-sm text-neutral-500 max-w-sm text-center">
        The page you are looking for has been subbed off. Head back to the
        pitch.
      </p>
      <Link href="/" className="jw-btn-primary mt-4">
        Back to {BRAND.name}
      </Link>
    </div>
  )
}