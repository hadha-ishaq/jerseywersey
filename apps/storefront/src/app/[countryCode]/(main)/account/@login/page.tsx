import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign in | JerseyWersey",
  description: "Sign in to your JerseyWersey account.",
}

export default function Login() {
  return <LoginTemplate />
}
