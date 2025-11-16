/**
 * Enhanced Calculator Component
 * Main calculator with all new features integrated
 */

"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dashboard } from "@/components/dashboard"
import { InputForm } from "@/components/input-form"
import { OtherExpenses } from "@/components/other-expenses"
import { Depreciation } from "@/components/depreciation"
import { ExportOptions } from "@/components/export-options"
import { ClearAllButton } from "@/components/clear-all-button"
import { CalculationBreakdown } from "@/components/calculation-breakdown"
import { ScenarioComparison } from "@/components/scenario-comparison"
import { VATSettings } from "@/components/vat-settings"
import { ProvisionalTax } from "@/components/provisional-tax"
import { SettingsPanel } from "@/components/settings-panel"
import { WarningsDisplay } from "@/components/warnings-display"
import { GuidedTour } from "@/components/guided-tour"
import { KeyboardShortcutsDialog } from "@/components/keyboard-shortcuts-dialog"

import {
  LayoutDashboard,
  FileInput,
  Receipt,
  CalculatorIcon,
  FileSpreadsheet,
  Settings,
  TrendingUp,
  DollarSign,
  Calendar,
  FileBarChart,
} from "lucide-react"
import { useCalculatorStore } from "@/lib/store"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { Button } from "@/components/ui/button"

export function Calculator() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [swipeStart, setSwipeStart] = useState<number | null>(null)
  const [swipeEnd, setSwipeEnd] = useState<number | null>(null)
  const { calculateResults, clearAll, saveScenario, showCalculationBreakdown, setShowCalculationBreakdown } = useCalculatorStore()
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false)

  useEffect(() => {
    calculateResults()
  }, [calculateResults])

  // Handle tab changes from URL parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get("tab")
      const validTabs = ["dashboard", "inputs", "expenses", "depreciation", "breakdown", "scenarios", "vat", "provisional", "export", "settings"]
      if (tabParam && validTabs.includes(tabParam)) {
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

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => setShortcutsDialogOpen(true),
    },
    {
      key: 's',
      ctrl: true,
      description: 'Save current scenario',
      action: () => {
        const name = prompt('Enter scenario name:')
        if (name) saveScenario(name)
      },
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Clear all inputs',
      action: () => {
        if (confirm('Are you sure you want to clear all inputs?')) {
          clearAll()
        }
      },
    },
    {
      key: '1',
      description: 'Go to Dashboard',
      action: () => setActiveTab('dashboard'),
    },
    {
      key: '2',
      description: 'Go to Basic Inputs',
      action: () => setActiveTab('inputs'),
    },
    {
      key: '3',
      description: 'Go to Expenses',
      action: () => setActiveTab('expenses'),
    },
    {
      key: '4',
      description: 'Go to Depreciation',
      action: () => setActiveTab('depreciation'),
    },
    {
      key: '5',
      description: 'Go to Export',
      action: () => setActiveTab('export'),
    },
    {
      key: 'b',
      ctrl: true,
      description: 'Toggle calculation breakdown',
      action: () => setShowCalculationBreakdown(!showCalculationBreakdown),
    },
  ])

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
    const tabs = ["dashboard", "inputs", "expenses", "depreciation", "breakdown", "scenarios", "vat", "provisional", "export", "settings"]
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
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-center sm:text-left">South African Contractor Calculator</h2>
          <div className="flex gap-2">
            <KeyboardShortcutsDialog />
            <ClearAllButton />
          </div>
        </div>

        {/* Warnings Display */}
        <WarningsDisplay />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full min-w-[500px] lg:min-w-[1000px]">
              <TabsTrigger value="dashboard" className="flex flex-col items-center py-3 gap-1 h-auto">
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-xs">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="inputs" className="flex flex-col items-center py-3 gap-1 h-auto">
                <FileInput className="h-4 w-4" />
                <span className="text-xs">Inputs</span>
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex flex-col items-center py-3 gap-1 h-auto">
                <Receipt className="h-4 w-4" />
                <span className="text-xs">Expenses</span>
              </TabsTrigger>
              <TabsTrigger value="depreciation" className="flex flex-col items-center py-3 gap-1 h-auto">
                <CalculatorIcon className="h-4 w-4" />
                <span className="text-xs">Depreciation</span>
              </TabsTrigger>
              <TabsTrigger value="breakdown" className="flex flex-col items-center py-3 gap-1 h-auto">
                <FileBarChart className="h-4 w-4" />
                <span className="text-xs">Breakdown</span>
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="flex flex-col items-center py-3 gap-1 h-auto">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Scenarios</span>
              </TabsTrigger>
              <TabsTrigger value="vat" className="flex flex-col items-center py-3 gap-1 h-auto">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs">VAT</span>
              </TabsTrigger>
              <TabsTrigger value="provisional" className="flex flex-col items-center py-3 gap-1 h-auto">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Prov. Tax</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex flex-col items-center py-3 gap-1 h-auto">
                <FileSpreadsheet className="h-4 w-4" />
                <span className="text-xs">Export</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex flex-col items-center py-3 gap-1 h-auto">
                <Settings className="h-4 w-4" />
                <span className="text-xs">Settings</span>
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
            <TabsContent value="breakdown">
              <CalculationBreakdown />
            </TabsContent>
            <TabsContent value="scenarios">
              <ScenarioComparison />
            </TabsContent>
            <TabsContent value="vat">
              <VATSettings />
            </TabsContent>
            <TabsContent value="provisional">
              <ProvisionalTax />
            </TabsContent>
            <TabsContent value="export">
              <ExportOptions />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Guided Tour */}
      <GuidedTour />
    </>
  )
}
