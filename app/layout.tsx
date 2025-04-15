import type React from "react"
import "@/app/globals.css"
import { Instrument_Serif } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"

// Configuración correcta de la fuente Instrument Serif
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-instrument-serif",
})

export const metadata = {
  title: "Mis Lecturas",
  description: "Tu registro personal de lecturas",
  manifest: "/manifest.json",
  icons: {
    icon: "/crabcito.png",
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Mis Lecturas",
    statusBarStyle: "default",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#FDFCFB",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={instrumentSerif.variable}>
      <head>
        <link rel="icon" href="/crabcito.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mis Lecturas" />
        <meta name="theme-color" content="#FDFCFB" />
        <meta name="application-name" content="Mis Lecturas" />
        <meta name="msapplication-TileColor" content="#FDFCFB" />
        <meta name="msapplication-TileImage" content="/apple-icon.png" />
        <style>
          {`
            .font-serif {
              font-family: var(--font-instrument-serif), Georgia, serif;
              letter-spacing: -0.025em;
            }
            
            body {
              font-family: Helvetica, Arial, sans-serif;
            }
          `}
        </style>
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'