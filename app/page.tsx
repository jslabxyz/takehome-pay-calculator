"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Calculator } from "@/components/calculator"
import { useCalculatorStore } from "@/lib/store"

export default function Home() {
  const { calculateResults } = useCalculatorStore()

  useEffect(() => {
    // Calculate initial results with default values
    calculateResults()

    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("Service Worker registration successful with scope: ", registration.scope)
          },
          (err) => {
            console.log("Service Worker registration failed: ", err)
          },
        )
      })
    }

    // Add iOS-specific meta tags dynamically
    const metaTags = [
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Geld Calculator" },
      { name: "format-detection", content: "telephone=no" },
    ]

    metaTags.forEach(({ name, content }) => {
      const meta = document.createElement("meta")
      meta.name = name
      meta.content = content
      document.head.appendChild(meta)
    })

    // Add iOS splash screen links
    const splashScreenSizes = [
      { href: "/splash-640x1136.png", media: "(device-width: 320px) and (device-height: 568px)" },
      { href: "/splash-750x1334.png", media: "(device-width: 375px) and (device-height: 667px)" },
      { href: "/splash-1242x2208.png", media: "(device-width: 414px) and (device-height: 736px)" },
      { href: "/splash-1125x2436.png", media: "(device-width: 375px) and (device-height: 812px)" },
      { href: "/splash-1242x2688.png", media: "(device-width: 414px) and (device-height: 896px)" },
    ]

    splashScreenSizes.forEach(({ href, media }) => {
      const link = document.createElement("link")
      link.rel = "apple-touch-startup-image"
      link.href = href
      link.media = media
      document.head.appendChild(link)
    })
  }, [calculateResults])

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center md:items-start mb-8">
          <div className="w-32 h-32 mb-4 relative">
            <Image
              src="/js-labs-logo.png"
              alt="JS Labs: Geld Calculator"
              width={128}
              height={128}
              priority
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">JS Labs: Geld Calculator</h1>
          <p className="text-muted-foreground text-center md:text-left">
            South African Contractor Take-home Pay Calculator
          </p>
        </div>
        <Calculator />
      </div>
    </main>
  )
}
