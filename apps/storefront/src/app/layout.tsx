import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Archivo, Inter } from "next/font/google"
import "styles/globals.css"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      data-mode="light"
      className={`${archivo.variable} ${inter.variable}`}
    >
      <body className="font-sans">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
