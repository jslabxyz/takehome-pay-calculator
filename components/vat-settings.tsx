/**
 * VAT Settings Component
 * Manage VAT registration and calculations
 */

"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCalculatorStore } from "@/lib/store-enhanced"
import { formatCurrency } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { NumericInput } from "@/components/ui/numeric-input"

export function VATSettings() {
  const {
    isVATRegistered,
    vatRate,
    setVATRegistered,
    setVATRate,
    outputVAT,
    inputVAT,
    netVATPayable,
    grossIncomeZAR,
  } = useCalculatorStore()

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">VAT Settings</CardTitle>
        <CardDescription>
          Configure VAT registration and view calculations
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
        {/* VAT Registration Toggle */}
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="vat-registered" className="text-base">
              VAT Registered
            </Label>
            <div className="text-sm text-muted-foreground">
              Are you registered for VAT with SARS?
            </div>
          </div>
          <Switch
            id="vat-registered"
            checked={isVATRegistered}
            onCheckedChange={setVATRegistered}
          />
        </div>

        {/* VAT Registration Info */}
        {!isVATRegistered && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>VAT Registration:</strong> You must register for VAT if your annual turnover
              exceeds R1 million. You may register voluntarily if your turnover is between R50,000
              and R1 million per year.
            </AlertDescription>
          </Alert>
        )}

        {/* VAT Rate Input */}
        {isVATRegistered && (
          <>
            <div className="space-y-2">
              <Label htmlFor="vat-rate">VAT Rate (%)</Label>
              <NumericInput
                id="vat-rate"
                value={vatRate}
                onValueChange={(value) => setVATRate(value ?? 15)}
                placeholder="Enter VAT rate"
                max={100}
              />
              <div className="text-xs text-muted-foreground">
                Standard VAT rate in South Africa is 15%
              </div>
            </div>

            {/* VAT Calculations */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold">Annual VAT Calculations</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium">Output VAT</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-lg font-bold">{formatCurrency(outputVAT)}</p>
                    <p className="text-xs text-muted-foreground">
                      VAT on income: {formatCurrency(grossIncomeZAR * 12)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium">Input VAT</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-lg font-bold">{formatCurrency(inputVAT)}</p>
                    <p className="text-xs text-muted-foreground">VAT on expenses</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium">Net VAT Payable</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className={`text-lg font-bold ${netVATPayable >= 0 ? 'text-destructive' : 'text-green-600'}`}>
                      {formatCurrency(Math.abs(netVATPayable))}
                      {netVATPayable < 0 ? ' (Refund)' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {netVATPayable >= 0 ? 'To pay to SARS' : 'SARS owes you'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>VAT Filing:</strong> VAT vendors must submit VAT returns either monthly
                  (turnover &gt; R30m) or bi-monthly (turnover &lt; R30m). Payment is due by the
                  25th of the month following the tax period.
                </AlertDescription>
              </Alert>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
