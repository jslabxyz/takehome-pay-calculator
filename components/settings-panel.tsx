/**
 * Settings Panel Component
 * Manage calculator preferences and display modes
 */

"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCalculatorStore } from "@/lib/store-enhanced"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useExchangeRate } from "@/hooks/use-exchange-rate"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import { formatUpdateTime } from "@/lib/exchange-rate"
import { Badge } from "@/components/ui/badge"

export function SettingsPanel() {
  const {
    inputMode,
    showCalculationBreakdown,
    setInputMode,
    setShowCalculationBreakdown,
  } = useCalculatorStore()

  const { exchangeRate, exchangeRateData, isLoading, error, refreshRate } = useExchangeRate()

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Settings</CardTitle>
        <CardDescription>Customize your calculator preferences</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
        {/* Input Mode */}
        <div className="space-y-3">
          <Label className="text-base">Input Mode</Label>
          <RadioGroup value={inputMode} onValueChange={(value: 'monthly' | 'annual') => setInputMode(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="font-normal cursor-pointer">
                Monthly Values
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="annual" id="annual" />
              <Label htmlFor="annual" className="font-normal cursor-pointer">
                Annual Values
              </Label>
            </div>
          </RadioGroup>
          <div className="text-xs text-muted-foreground">
            Choose whether to input and display values on a monthly or annual basis
          </div>
        </div>

        {/* Calculation Breakdown */}
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="show-breakdown" className="text-base">
              Show Calculation Breakdown
            </Label>
            <div className="text-sm text-muted-foreground">
              Display detailed step-by-step tax calculations
            </div>
          </div>
          <Switch
            id="show-breakdown"
            checked={showCalculationBreakdown}
            onCheckedChange={setShowCalculationBreakdown}
          />
        </div>

        {/* Exchange Rate Info */}
        <div className="space-y-3 pt-4 border-t">
          <Label className="text-base">Exchange Rate Information</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">USD to ZAR Rate</div>
                <div className="text-2xl font-bold">
                  R {exchangeRate.toFixed(2)}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {exchangeRateData.source === 'api' && (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>Live rate</span>
                    </>
                  )}
                  {exchangeRateData.source === 'cache' && (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-blue-600" />
                      <span>Cached</span>
                    </>
                  )}
                  {exchangeRateData.source === 'default' && (
                    <>
                      <AlertCircle className="h-3 w-3 text-yellow-600" />
                      <span>Default rate</span>
                    </>
                  )}
                  <span>·</span>
                  <span>Updated {formatUpdateTime(exchangeRateData.lastUpdated)}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshRate}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            {error && (
              <div className="text-xs text-destructive">
                {error} - Using default rate
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Exchange rates are cached for 1 hour. Click "Refresh" to get the latest rate.
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-3 pt-4 border-t">
          <Label className="text-base">Data Management</Label>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Your calculator data is automatically saved to your browser's local storage.
              This includes all inputs, scenarios, and preferences.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Auto-save enabled
              </Badge>
              <Badge variant="secondary">
                Data stored locally
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
