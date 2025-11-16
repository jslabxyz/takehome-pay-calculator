/**
 * Warnings Display Component
 * Shows validation warnings and helpful information
 */

"use client"

import React from "react"
import { useCalculatorStore } from "@/lib/store-enhanced"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

export function WarningsDisplay() {
  const { warnings } = useCalculatorStore()

  if (warnings.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {warnings.map((warning, index) => (
        <Alert
          key={index}
          variant={warning.severity === 'error' ? 'destructive' : 'default'}
          className={
            warning.severity === 'warning'
              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30'
              : warning.severity === 'info'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
              : ''
          }
        >
          {warning.severity === 'error' && <AlertCircle className="h-4 w-4" />}
          {warning.severity === 'warning' && <AlertTriangle className="h-4 w-4" />}
          {warning.severity === 'info' && <Info className="h-4 w-4" />}
          <AlertTitle className="capitalize">{warning.severity}</AlertTitle>
          <AlertDescription>{warning.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
