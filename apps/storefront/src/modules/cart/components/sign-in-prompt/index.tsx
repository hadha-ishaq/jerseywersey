import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 small:flex-row small:items-center small:justify-between small:p-5">
      <div className="space-y-2">
        <p className="jw-eyebrow text-ui-fg-subtle">Account</p>
        <Heading level="h2" className="text-xl small:text-2xl text-ui-fg-base">
          Already have an account?
        </Heading>
        <Text className="text-small-regular small:text-base text-ui-fg-muted">
          Sign in to keep your address, checkout faster, and track your orders.
        </Text>
      </div>
      <div className="w-full small:w-auto">
        <LocalizedClientLink href="/account">
          <Button
            variant="secondary"
            className="h-11 w-full small:w-auto small:min-w-36"
            data-testid="sign-in-button"
          >
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
