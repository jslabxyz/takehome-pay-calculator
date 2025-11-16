/**
 * Provisional Tax Component
 * Display provisional tax payment calculations
 */

"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCalculatorStore } from "@/lib/store-enhanced"
import { formatCurrency } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function ProvisionalTax() {
  const {
    provisionalTaxFirstPayment,
    provisionalTaxSecondPayment,
    provisionalTaxThirdPayment,
    annualTax,
    grossIncomeZAR,
  } = useCalculatorStore()

  // Calculate current date and tax year
  const now = new Date()
  const currentMonth = now.getMonth() + 1 // 1-12
  const currentYear = now.getFullYear()

  // Tax year in South Africa runs from March to February
  const taxYearStart = currentMonth >= 3 ? currentYear : currentYear - 1
  const taxYearEnd = taxYearStart + 1

  // Calculate payment due dates
  const firstPaymentDate = new Date(taxYearEnd, 7, 31) // August 31
  const secondPaymentDate = new Date(taxYearEnd + 1, 1, 28) // February 28/29
  const thirdPaymentDate = new Date(taxYearEnd + 1, 8, 30) // September 30 (7 months after year end)

  const payments = [
    {
      name: "First Payment",
      amount: provisionalTaxFirstPayment,
      dueDate: firstPaymentDate,
      description: "50% of estimated annual tax",
      status: now > firstPaymentDate ? "overdue" : "upcoming",
    },
    {
      name: "Second Payment",
      amount: provisionalTaxSecondPayment,
      dueDate: secondPaymentDate,
      description: "Remaining 50% or top-up",
      status: now > secondPaymentDate ? "overdue" : "upcoming",
    },
  ]

  if (provisionalTaxThirdPayment > 0) {
    payments.push({
      name: "Third Payment",
      amount: provisionalTaxThirdPayment,
      dueDate: thirdPaymentDate,
      description: "Additional payment if required",
      status: now > thirdPaymentDate ? "overdue" : "upcoming",
    })
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Provisional Tax Payments
        </CardTitle>
        <CardDescription>
          Tax year {taxYearStart}/{String(taxYearEnd).slice(2)} (1 Mar {taxYearStart} - 28 Feb {taxYearEnd})
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Total Annual Tax</div>
            <div className="text-2xl font-bold">{formatCurrency(annualTax)}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Annual Income</div>
            <div className="text-2xl font-bold">{formatCurrency(grossIncomeZAR * 12)}</div>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="space-y-4">
          <h4 className="font-semibold">Payment Schedule</h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div>
                        {payment.name}
                        <div className="text-xs text-muted-foreground">{payment.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.dueDate.toLocaleDateString('en-ZA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={payment.status === 'overdue' ? 'destructive' : 'secondary'}
                      >
                        {payment.status === 'overdue' ? 'Overdue' : 'Upcoming'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="font-semibold">Total Provisional Tax</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(provisionalTaxFirstPayment + provisionalTaxSecondPayment + provisionalTaxThirdPayment)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Important Information */}
        <div className="space-y-2">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Who Must Pay Provisional Tax?</AlertTitle>
            <AlertDescription className="text-xs space-y-1 mt-2">
              <p>
                You must register as a provisional taxpayer if you earn income that is not subject
                to PAYE (employees' tax), including:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Self-employment income (contractors, consultants)</li>
                <li>Rental income</li>
                <li>Investment income (interest, dividends over certain thresholds)</li>
                <li>Directors' fees</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Penalty for Late Payment</AlertTitle>
            <AlertDescription className="text-xs">
              SARS charges a 10% penalty on the outstanding amount if provisional tax is paid late.
              Interest is also charged at the prescribed rate on late payments.
            </AlertDescription>
          </Alert>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>How to Pay</AlertTitle>
            <AlertDescription className="text-xs space-y-1 mt-2">
              <p>You can pay provisional tax through:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>SARS eFiling (IRP6 return)</li>
                <li>Your bank's online banking (using your SARS tax number as reference)</li>
                <li>At any SARS branch</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  )
}
