/**
 * Guided Tour Component
 * Provides an interactive tour for first-time users
 */

"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface TourStep {
  title: string
  description: string
  target?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to JS Labs Geld Calculator!",
    description: "This calculator helps South African contractors calculate their take-home pay after taxes and deductions. Let's take a quick tour!",
  },
  {
    title: "Dashboard",
    description: "View your key financial metrics at a glance, including gross income, deductions, and take-home pay. Visual charts help you understand where your money goes.",
  },
  {
    title: "Basic Inputs",
    description: "Enter your gross income, retirement contributions, and home office details. You can input values in ZAR or USD - we'll convert automatically!",
  },
  {
    title: "Other Expenses",
    description: "Add business expenses like software subscriptions, professional fees, and office supplies. All deductible expenses help reduce your tax burden.",
  },
  {
    title: "Depreciation",
    description: "Track wear-and-tear depreciation for business assets like computers and furniture. SARS allows you to deduct these over their useful life.",
  },
  {
    title: "Advanced Features",
    description: "Check out VAT calculations, provisional tax payments, and scenario comparisons. Save multiple scenarios to compare different income situations!",
  },
  {
    title: "Export Your Data",
    description: "Download your calculations as Excel or PDF for your records or tax filing. Perfect for sharing with your accountant!",
  },
]

export function GuidedTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSeenTour, setHasSeenTour] = useState(false)

  useEffect(() => {
    // Check if user has seen the tour before
    const tourSeen = localStorage.getItem('tourCompleted')
    if (!tourSeen) {
      // Show tour after a brief delay for first-time users
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setHasSeenTour(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('tourCompleted', 'true')
    setHasSeenTour(true)
    setIsOpen(false)
    setCurrentStep(0)
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setIsOpen(true)
  }

  const step = tourSteps[currentStep]
  const progress = ((currentStep + 1) / tourSteps.length) * 100

  return (
    <>
      {/* Restart Tour Button (for users who've completed it) */}
      {hasSeenTour && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestart}
          className="fixed bottom-4 left-4 z-50 gap-2"
        >
          <span>🎯</span> Restart Tour
        </Button>
      )}

      {/* Tour Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-sm">
                    Step {currentStep + 1} of {tourSteps.length}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSkip}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{step.description}</p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={handleSkip} variant="ghost" size="sm">
                  Skip Tour
                </Button>
                <Button onClick={handleNext} className="gap-2">
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep < tourSteps.length - 1 && <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}
