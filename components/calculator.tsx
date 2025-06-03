"use client"

import type React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dashboard } from "@/components/dashboard"
import { InputForm } from "@/components/input-form"
import { OtherExpenses } from "@/components/other-expenses"
import { Depreciation } from "@/components/depreciation"
import { ExportOptions } from "@/components/export-options"
import { ClearAllButton } from "@/components/clear-all-button"
import { useState, useEffect } from "react"
import { LayoutDashboard, FileInput, Receipt, CalculatorIcon, FileSpreadsheet } from "lucide-react"

export function Calculator() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [swipeStart, setSwipeStart] = useState<number | null>(null)
  const [swipeEnd, setSwipeEnd] = useState<number | null>(null)

  // Handle tab changes from URL parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get("tab")
      if (tabParam && ["dashboard", "inputs", "expenses", "depreciation", "export"].includes(tabParam)) {
        setActiveTab(tabParam)
      }
    }
  }, [])

  // Update URL when tab changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.set("tab", activeTab)
      window.history.replaceState({}, "", url.toString())
    }
  }, [activeTab])

  // Handle swipe gestures for tab navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setSwipeEnd(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (swipeStart === null || swipeEnd === null) return

    const swipeDistance = swipeEnd - swipeStart
    const tabs = ["dashboard", "inputs", "expenses", "depreciation", "export"]
    const currentIndex = tabs.indexOf(activeTab)

    // If swipe distance is significant enough (more than 50px)
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0 && currentIndex > 0) {
        // Swipe right - go to previous tab
        setActiveTab(tabs[currentIndex - 1])
      } else if (swipeDistance < 0 && currentIndex < tabs.length - 1) {
        // Swipe left - go to next tab
        setActiveTab(tabs[currentIndex + 1])
      }
    }

    setSwipeStart(null)
    setSwipeEnd(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold text-center sm:text-left">South African Contractor Calculator</h2>
        <ClearAllButton />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <TabsList className="grid grid-cols-5 w-full min-w-[500px]">
            <TabsTrigger value="dashboard" className="flex flex-col items-center py-3 gap-1 h-auto">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="inputs" className="flex flex-col items-center py-3 gap-1 h-auto">
              <FileInput className="h-4 w-4" />
              <span className="text-xs">Basic Inputs</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex flex-col items-center py-3 gap-1 h-auto">
              <Receipt className="h-4 w-4" />
              <span className="text-xs">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="depreciation" className="flex flex-col items-center py-3 gap-1 h-auto">
              <CalculatorIcon className="h-4 w-4" />
              <span className="text-xs">Depreciation</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex flex-col items-center py-3 gap-1 h-auto">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="text-xs">Export</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-2 pb-16">
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="inputs">
            <InputForm />
          </TabsContent>
          <TabsContent value="expenses">
            <OtherExpenses />
          </TabsContent>
          <TabsContent value="depreciation">
            <Depreciation />
          </TabsContent>
          <TabsContent value="export">
            <ExportOptions />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
