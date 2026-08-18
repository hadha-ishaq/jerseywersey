import { Heading, Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="mx-auto flex max-w-2xl flex-col items-start justify-center px-4 py-20 small:py-28"
      data-testid="empty-cart-message"
    >
      <p className="jw-eyebrow text-ui-fg-subtle">Cart</p>
      <Heading
        level="h1"
        className="mt-3 flex flex-row items-baseline gap-x-2 text-3xl small:text-5xl text-ui-fg-base"
      >
        Your cart is empty
      </Heading>
      <Text className="mt-4 mb-8 max-w-[36rem] text-base-regular small:text-lg text-ui-fg-muted">
        You haven&apos;t added anything yet. Browse the latest jerseys, club
        drops, and national team kits to get started.
      </Text>
      <div>
        <InteractiveLink href="/store">Explore jerseys</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
