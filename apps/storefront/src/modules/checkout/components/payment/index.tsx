"use client"

import { RadioGroup } from "@headlessui/react"
import { isRazorpay, isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { Button, Container, Heading, Text, clx } from "@modules/common/components/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: { id: string }[]
}) => {
  const activeSession =
    cart.payment_collection?.payment_sessions?.find(
      (paymentSession) =>
        paymentSession.status === "pending" ||
        paymentSession.status === "requires_more"
    ) ?? null

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)

    if (
      (isStripeLike(method) || isRazorpay(method)) &&
      activeSession?.provider_id !== method
    ) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards &&
    ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])
      ?.length > 0 &&
    cart?.total === 0
  )

  const paymentReady =
    (activeSession && (cart?.shipping_methods?.length ?? 0) !== 0) ||
    paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 small:p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 small:flex-row small:items-center small:justify-between">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row items-baseline gap-x-2 text-2xl small:text-3xl text-ui-fg-base",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive transition-colors hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>

      <div className={isOpen ? "block" : "hidden"}>
        {!paidByGiftcard && availablePaymentMethods?.length > 0 && (
          <RadioGroup
            value={selectedPaymentMethod}
            onChange={(value: string) => setPaymentMethod(value)}
            className="space-y-3"
          >
            {availablePaymentMethods.map((paymentMethod) => (
              <div key={paymentMethod.id}>
                {isStripeLike(paymentMethod.id) ? (
                  <StripeCardContainer
                    paymentProviderId={paymentMethod.id}
                    selectedPaymentOptionId={selectedPaymentMethod}
                    paymentInfoMap={paymentInfoMap}
                    setCardBrand={setCardBrand}
                    setError={setError}
                    setCardComplete={setCardComplete}
                  />
                ) : (
                  <PaymentContainer
                    paymentInfoMap={paymentInfoMap}
                    paymentProviderId={paymentMethod.id}
                    selectedPaymentOptionId={selectedPaymentMethod}
                  />
                )}
              </div>
            ))}
          </RadioGroup>
        )}

        {paidByGiftcard && (
          <div className="flex flex-col gap-1">
            <Text className="jw-eyebrow text-ui-fg-subtle">
              Payment method
            </Text>
            <Text
              className="txt-medium text-ui-fg-base"
              data-testid="payment-method-summary"
            >
              Gift card
            </Text>
          </div>
        )}

        <ErrorMessage error={error} data-testid="payment-method-error-message" />

        <Button
          size="large"
          className="mt-6 w-full small:w-auto small:min-w-52"
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={
            (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
            (!selectedPaymentMethod && !paidByGiftcard)
          }
          data-testid="submit-payment-button"
        >
          {!activeSession && isStripeLike(selectedPaymentMethod)
            ? "Enter card details"
            : "Continue to review"}
        </Button>
      </div>

      <div className={isOpen ? "hidden" : "block"}>
        {cart && paymentReady && activeSession ? (
          <div className="grid grid-cols-1 gap-6 small:grid-cols-3">
            <div className="flex flex-col gap-1">
              <Text className="jw-eyebrow text-ui-fg-subtle">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-base"
                data-testid="payment-method-summary"
              >
                {paymentInfoMap[activeSession?.provider_id]?.title ||
                  activeSession?.provider_id}
              </Text>
            </div>
            <div className="flex flex-col gap-1 small:col-span-2">
              <Text className="jw-eyebrow text-ui-fg-subtle">
                Payment details
              </Text>
              <div
                className="flex items-center gap-3 text-ui-fg-subtle"
                data-testid="payment-details-summary"
              >
                <Container className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 p-0">
                  {paymentInfoMap[selectedPaymentMethod]?.icon || <CreditCard />}
                </Container>
                <Text className="txt-medium">
                  {isStripeLike(selectedPaymentMethod) && cardBrand
                    ? cardBrand
                    : "Another step will appear"}
                </Text>
              </div>
            </div>
          </div>
        ) : paidByGiftcard ? (
          <div className="flex flex-col gap-1">
            <Text className="jw-eyebrow text-ui-fg-subtle">Payment method</Text>
            <Text
              className="txt-medium text-ui-fg-base"
              data-testid="payment-method-summary"
            >
              Gift card
            </Text>
          </div>
        ) : null}
      </div>

      <Divider className="mt-8" />
    </section>
  )
}

export default Payment
