/**
 * Calculation Breakdown Component
 * Shows detailed step-by-step tax calculations
 */

"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCalculatorStore } from "@/lib/store-enhanced"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export function CalculationBreakdown() {
  const {
    grossIncomeZAR,
    allowedRet,
    dedRent,
    dedUtilities,
    dedInternet,
    otherTotal,
    deprTotal,
    donationsToPBO,
    totalDeductions,
    taxableMonthly,
    taxableAnnual,
    taxBreakdown,
    annualTax,
    monthlyTaxPreCredit,
    medicalCredit,
    monthlyPAYE,
    netMonthly,
    effectiveRate,
  } = useCalculatorStore()

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Calculation Breakdown</CardTitle>
        <CardDescription>Detailed step-by-step tax calculations</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
        <Accordion type="multiple" className="w-full">
          {/* Step 1: Income */}
          <AccordionItem value="income">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Badge variant="outline">1</Badge>
                <span>Monthly Gross Income</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span>Gross Income (Monthly)</span>
                  <span className="font-semibold">{formatCurrency(grossIncomeZAR)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Gross Income (Annual)</span>
                  <span>{formatCurrency(grossIncomeZAR * 12)}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Step 2: Deductions */}
          <AccordionItem value="deductions">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Badge variant="outline">2</Badge>
                <span>Deductions</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allowedRet > 0 && (
                      <TableRow>
                        <TableCell>Retirement Contribution</TableCell>
                        <TableCell className="text-right">{formatCurrency(allowedRet)}</TableCell>
                      </TableRow>
                    )}
                    {dedRent > 0 && (
                      <TableRow>
                        <TableCell>Deductible Rent (Home Office)</TableCell>
                        <TableCell className="text-right">{formatCurrency(dedRent)}</TableCell>
                      </TableRow>
                    )}
                    {dedUtilities > 0 && (
                      <TableRow>
                        <TableCell>Deductible Utilities (Home Office)</TableCell>
                        <TableCell className="text-right">{formatCurrency(dedUtilities)}</TableCell>
                      </TableRow>
                    )}
                    {dedInternet > 0 && (
                      <TableRow>
                        <TableCell>Internet</TableCell>
                        <TableCell className="text-right">{formatCurrency(dedInternet)}</TableCell>
                      </TableRow>
                    )}
                    {donationsToPBO > 0 && (
                      <TableRow>
                        <TableCell>Donations to PBO</TableCell>
                        <TableCell className="text-right">{formatCurrency(donationsToPBO)}</TableCell>
                      </TableRow>
                    )}
                    {otherTotal > 0 && (
                      <TableRow>
                        <TableCell>Other Expenses</TableCell>
                        <TableCell className="text-right">{formatCurrency(otherTotal)}</TableCell>
                      </TableRow>
                    )}
                    {deprTotal > 0 && (
                      <TableRow>
                        <TableCell>Depreciation</TableCell>
                        <TableCell className="text-right">{formatCurrency(deprTotal)}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell className="font-semibold">Total Deductions</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(totalDeductions)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Step 3: Taxable Income */}
          <AccordionItem value="taxable">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Badge variant="outline">3</Badge>
                <span>Taxable Income</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span>Gross Income</span>
                  <span>{formatCurrency(grossIncomeZAR)}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>Less: Deductions</span>
                  <span>-{formatCurrency(totalDeductions)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold">Taxable Income (Monthly)</span>
                  <span className="font-semibold">{formatCurrency(taxableMonthly)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxable Income (Annual)</span>
                  <span>{formatCurrency(taxableAnnual)}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Step 4: Tax Calculation */}
          <AccordionItem value="tax">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Badge variant="outline">4</Badge>
                <span>Tax Calculation (SARS 2025/26 Brackets)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bracket</TableHead>
                      <TableHead>Income Range</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxBreakdown.map((bracket) => (
                      <TableRow key={bracket.bracket}>
                        <TableCell>{bracket.bracket}</TableCell>
                        <TableCell className="text-xs">
                          {formatCurrency(bracket.from)} - {bracket.to === Infinity ? '∞' : formatCurrency(bracket.to)}
                        </TableCell>
                        <TableCell className="text-right">{formatPercentage(bracket.rate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(bracket.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-semibold">Total Annual Tax</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(annualTax)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="font-semibold">Monthly Tax (before credits)</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(monthlyTaxPreCredit)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Step 5: Tax Credits */}
          <AccordionItem value="credits">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Badge variant="outline">5</Badge>
                <span>Tax Credits</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span>Monthly Tax (before credits)</span>
                  <span>{formatCurrency(monthlyTaxPreCredit)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Less: Medical Tax Credit</span>
                  <span>-{formatCurrency(medicalCredit)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold">Monthly PAYE</span>
                  <span className="font-semibold">{formatCurrency(monthlyPAYE)}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Step 6: Take-home Pay */}
          <AccordionItem value="takehome">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Badge variant="outline">6</Badge>
                <span>Take-home Pay</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span>Gross Income</span>
                  <span>{formatCurrency(grossIncomeZAR)}</span>
                </div>
                <div className="flex justify-between text-destructive">
                  <span>Less: PAYE</span>
                  <span>-{formatCurrency(monthlyPAYE)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold text-lg">Take-home Pay (Monthly)</span>
                  <span className="font-semibold text-lg text-green-600">{formatCurrency(netMonthly)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Effective Tax Rate</span>
                  <span>{formatPercentage(effectiveRate)}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
