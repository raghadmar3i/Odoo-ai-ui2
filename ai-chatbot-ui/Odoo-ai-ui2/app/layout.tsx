import type React from "react"
import type { Metadata } from "next"
import { Ubuntu } from "next/font/google"
import "./globals.css"

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-ubuntu",
})

export const metadata: Metadata = {
  title: "RCC AI Chat Assistant",
  description: "AI-driven chatbot with Odoo ERP integration",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={ubuntu.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
