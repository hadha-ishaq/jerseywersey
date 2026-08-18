"use client"

import { isManual, isRazorpay, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay"
import React, { useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

type PaymentSessionLike = {
  provider_id?: string
  status?: string
  data?: {
    client_secret?: string
    razorpayOrder?: {
      id: string
      amount: number
      currency: string
      receipt?: string
    }
  }
}

const getActivePaymentSession = (sessions: PaymentSessionLike[]) => {
  return sessions.find(
    (session) =>
      session.status === "pending" || session.status === "requires_more"
  )
}

const getPaymentSession = (cart: HttpTypes.StoreCart) => {
  return getActivePaymentSession(
    (cart.payment_collection?.payment_sessions ?? []) as PaymentSessionLike[]
  )
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = getPaymentSession(cart)

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    case isRazorpay(paymentSession?.provider_id):
      return (
        <RazorpayPaymentButton
          notReady={notReady}
          cart={cart}
          paymentSession={paymentSession}
          data-testid={dataTestId}
        />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending" || s.status === "requires_more"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

const RazorpayPaymentButton = ({
  cart,
  paymentSession,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  paymentSession?: PaymentSessionLike
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const {
    Razorpay: RazorpayCheckout,
    isLoading: isRazorpayLoading,
    error: razorpayLoadError,
  } = useRazorpay()

  const handleFailure = (message: string) => {
    setErrorMessage(message)
    setSubmitting(false)
  }

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    try {
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      if (!keyId) {
        throw new Error("Razorpay key is not configured")
      }

      if (!RazorpayCheckout) {
        throw new Error("Razorpay checkout is not ready yet")
      }

      const razorpayOrder = paymentSession?.data?.razorpayOrder

      if (!razorpayOrder?.id) {
        throw new Error("Razorpay order is missing from the payment session")
      }

      const billingName = [
        cart.billing_address?.first_name,
        cart.billing_address?.last_name,
      ]
        .filter(Boolean)
        .join(" ")
        .trim()

      const checkout = new RazorpayCheckout({
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency as RazorpayOrderOptions["currency"],
        name: "JerseyWersey",
        description: "Complete your JerseyWersey order",
        order_id: razorpayOrder.id,
        prefill: {
          name: billingName || cart.email || undefined,
          email: cart.email || undefined,
          contact: cart.billing_address?.phone || undefined,
        },
        theme: {
          color: "#111827",
        },
        modal: {
          backdropclose: false,
          escape: true,
          handleback: true,
          confirm_close: true,
          ondismiss: () => {
            handleFailure("Payment was cancelled before completion")
          },
        },
        handler: async () => {
          try {
            await placeOrder()
          } catch (err) {
            handleFailure(
              err instanceof Error ? err.message : "Unable to complete order"
            )
          }
        },
      })

      checkout.on("payment.failed", (response) => {
        handleFailure(
          response.error.description ||
            response.error.reason ||
            "Razorpay payment failed"
        )
      })

      checkout.open()
    } catch (err) {
      handleFailure(
        err instanceof Error ? err.message : "Unable to start Razorpay checkout"
      )
    }
  }

  return (
    <>
      <Button
        disabled={notReady || !paymentSession || isRazorpayLoading}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId}
      >
        Pay with Razorpay
      </Button>

      <ErrorMessage
        error={errorMessage || razorpayLoadError || null}
        data-testid="razorpay-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
