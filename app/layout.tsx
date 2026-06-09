import type { Metadata } from "next"
import { Geist, Fredoka } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { PortfolioProvider } from "@/lib/portfolio-context"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" })

export const metadata: Metadata = {
  title: "Portfolio — Day & Night",
  description:
    "A bilingual, animated personal portfolio. Sunset & starry nights in English, bright skies in Vietnamese.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${fredoka.variable}`}>
      <body className="font-sans antialiased" style={{ backgroundColor: "#160a2e" }}>
        <PortfolioProvider>{children}</PortfolioProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
