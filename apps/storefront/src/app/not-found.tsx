import { Text } from "@modules/common/components/ui"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page not found | JerseyWersey",
  description: "The page you are looking for does not exist on JerseyWersey.",
}

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl-semi text-ui-fg-base">Page not found</h1>
      <p className="max-w-md text-small-regular text-ui-fg-base">
        The page you tried to access does not exist. Return to the store or go
        back to the home page.
      </p>
      <Link className="jw-btn-primary mt-4" href="/">
        <Text className="text-inherit">Go to home</Text>
      </Link>
    </div>
  )
}
