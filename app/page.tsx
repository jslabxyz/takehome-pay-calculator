import { useEffect } from "react"
import Image from "next/image"
import { Calculator } from "@/components/calculator"

export default function Home() {
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
