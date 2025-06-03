"use client"

import { useEffect } from "react"

export function PWASetup() {
  useEffect(() => {
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
  }, [])

  return null
}