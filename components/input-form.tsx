"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useCalculatorStore } from "@/lib/store"
import { InfoIcon as InfoCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { NumericInput } from "@/components/ui/numeric-input"
import { useEffect, useState } from "react"
import { AIChat } from "@/components/ai-chat"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export function InputForm() {
  const {
    grossIncomeZAR,
    retirementContribution,
    medicalBeneficiaries,
    rent,
    apartmentSizeSqm,
    officeSizeSqm,
    utilities,
    internet,
    donationsToPBO,
    setGrossIncomeZAR,
    setRetirementContribution,
    setMedicalBeneficiaries,
    setRent,
    setApartmentSizeSqm,
    setOfficeSizeSqm,
    setUtilities,
    setInternet,
    setDonationsToPBO,
    calculateResults,
  } = useCalculatorStore()

  const [currency, setCurrency] = useState<'ZAR' | 'USD'>('ZAR')
  const exchangeRate = 18.5

  // Force recalculation when component mounts or values change
  useEffect(() => {
    calculateResults()
  }, [
    grossIncomeZAR,
    retirementContribution,
    medicalBeneficiaries,
    rent,
    apartmentSizeSqm,
    officeSizeSqm,
    utilities,
    internet,
    donationsToPBO,
    calculateResults,
  ])

  const handleCurrencyChange = (value: 'ZAR' | 'USD') => setCurrency(value)

  const handleValueChange = (setter: (value: number) => void) => (value: number | null) => {
    if (currency === 'USD' && value !== null) {
      setter(value * exchangeRate)
    } else {
      setter(value ?? 0)
    }
    calculateResults()
  }

  return (
    <>
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Basic Inputs</CardTitle>
          <CardDescription>All values are monthly</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="grossIncomeZAR" className="text-sm sm:text-base">
                    Gross Income (ZAR)
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Your total monthly income before any deductions or taxes.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs">Currency:</span>
                  <Select value={currency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger className="w-20 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ZAR">ZAR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <NumericInput
                  id="grossIncomeZAR"
                  value={currency === 'USD' ? grossIncomeZAR && grossIncomeZAR > 0 ? +(grossIncomeZAR / exchangeRate).toFixed(2) : null : grossIncomeZAR}
                  onValueChange={handleValueChange(setGrossIncomeZAR)}
                  placeholder={`Enter amount in ${currency}`}
                />
                {currency === 'USD' && grossIncomeZAR && grossIncomeZAR > 0 && (
                  <div className="text-xs text-muted-foreground">Converted: {formatCurrency(grossIncomeZAR)}</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="retirementContribution" className="text-sm sm:text-base">
                    Retirement Contribution
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Monthly contribution to retirement funds. Deductible up to 27.5% of gross income or R350,000
                          per year, whichever is lower.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <NumericInput
                  id="retirementContribution"
                  value={retirementContribution}
                  onValueChange={handleValueChange(setRetirementContribution)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="medicalBeneficiaries" className="text-sm sm:text-base">
                    Medical Beneficiaries
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Number of people covered by your medical aid. Affects your medical tax credit.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <NumericInput
                  id="medicalBeneficiaries"
                  value={medicalBeneficiaries}
                  onValueChange={handleValueChange(setMedicalBeneficiaries)}
                  placeholder="Enter number"
                  errorMessage="Please enter a whole number"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="donationsToPBO" className="text-sm sm:text-base">
                    Donations to PBO
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Monthly donations to Public Benefit Organizations. Tax deductible up to certain limits.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <NumericInput
                  id="donationsToPBO"
                  value={donationsToPBO}
                  onValueChange={handleValueChange(setDonationsToPBO)}
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="rent" className="text-sm sm:text-base">
                    Rent
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Monthly rent payment. Only the portion used for home office is deductible.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <NumericInput
                  id="rent"
                  value={rent}
                  onValueChange={handleValueChange(setRent)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="apartmentSizeSqm" className="text-sm sm:text-base">
                    Apartment Size (sqm)
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Total size of your apartment/house in square meters.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <NumericInput
                  id="apartmentSizeSqm"
                  value={apartmentSizeSqm}
                  onValueChange={handleValueChange(setApartmentSizeSqm)}
                  placeholder="Enter size"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="officeSizeSqm" className="text-sm sm:text-base">
                    Office Size (sqm)
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Size of your home office in square meters. Used to calculate deductible portion of rent and
                          utilities.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <NumericInput
                  id="officeSizeSqm"
                  value={officeSizeSqm}
                  onValueChange={handleValueChange(setOfficeSizeSqm)}
                  placeholder="Enter size"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="utilities" className="text-sm sm:text-base">
                    Utilities
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Monthly utilities (electricity, water, etc.). Only the portion used for home office is
                          deductible.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <NumericInput
                  id="utilities"
                  value={utilities}
                  onValueChange={handleValueChange(setUtilities)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="internet" className="text-sm sm:text-base">
                    Internet
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Monthly internet expenses. Fully deductible for contractors working from home.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <NumericInput
                  id="internet"
                  value={internet}
                  onValueChange={handleValueChange(setInternet)}
                  placeholder="Enter amount"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <AIChat title="Basic Inputs" context="inputs" />
    </>
  )
}
