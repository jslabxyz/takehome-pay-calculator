"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCalculatorStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { Plus, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { NumericInput } from "@/components/ui/numeric-input"
import { AIChat } from "@/components/ai-chat"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export function OtherExpenses() {
  const { otherExpenses, addOtherExpense, removeOtherExpense, calculateResults } = useCalculatorStore()
  const [newLabel, setNewLabel] = useState("")
  const [newAmount, setNewAmount] = useState<number | null>(null)
  const [labelError, setLabelError] = useState<string | null>(null)
  const [currency, setCurrency] = useState<'ZAR' | 'USD'>('ZAR')
  const exchangeRate = 18.5

  // Reset form fields when otherExpenses is cleared
  useEffect(() => {
    if (otherExpenses.length === 0) {
      setNewLabel("")
      setNewAmount(null)
      setLabelError(null)
    }
  }, [otherExpenses])

  const handleAddExpense = () => {
    // Validate label
    if (!newLabel.trim()) {
      setLabelError("Please enter a description")
      return
    }

    // Validate amount
    if (newAmount === null || newAmount <= 0) {
      return // The NumericInput component will show its own error
    }

    // Add expense
    addOtherExpense({
      id: Date.now().toString(),
      label: newLabel.trim(),
      amount: newAmount,
    })

    // Reset form
    setNewLabel("")
    setNewAmount(null)
    setLabelError(null)
    calculateResults()
  }

  const handleRemoveExpense = (id: string) => {
    removeOtherExpense(id)
    calculateResults()
  }

  const totalOtherExpenses = otherExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const handleCurrencyChange = (value: 'ZAR' | 'USD') => setCurrency(value)

  return (
    <>
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Other Deductible Expenses</CardTitle>
          <CardDescription className="mb-2">Add other business expenses that are tax deductible</CardDescription>
          <div className="text-xs sm:text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
            <p className="mb-2">Common deductible business expenses include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Software and subscriptions</li>
              <li>Bank fees and financial charges</li>
              <li>Cleaning and maintenance</li>
              <li>Stationery and office supplies</li>
              <li>Professional fees (accounting, legal)</li>
              <li>Training and education</li>
              <li>Start-up expenses</li>
            </ul>
            <p className="mt-2 text-xs">
              Note: Only expenses directly related to earning your business income are deductible.
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expenseLabel" className="text-sm sm:text-base">
                  Expense Description
                </Label>
                <div className="space-y-1">
                  <Input
                    id="expenseLabel"
                    value={newLabel}
                    onChange={(e) => {
                      setNewLabel(e.target.value)
                      setLabelError(null)
                    }}
                    placeholder="e.g., Software Subscription"
                    className={`bg-yellow-50 dark:bg-yellow-950/30 ${labelError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  {labelError && <p className="text-sm text-destructive">{labelError}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expenseAmount" className="text-sm sm:text-base">
                  Amount (ZAR)
                </Label>
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
                  id="expenseAmount"
                  value={currency === 'USD' ? newAmount && newAmount > 0 ? +(newAmount / exchangeRate).toFixed(2) : null : newAmount}
                  onValueChange={(value) => setNewAmount(currency === 'USD' && value !== null ? value * exchangeRate : value)}
                  placeholder={`Enter amount in ${currency}`}
                  errorMessage="Please enter a valid amount"
                />
                {currency === 'USD' && newAmount && newAmount > 0 && (
                  <div className="text-xs text-muted-foreground">Converted: {formatCurrency(newAmount)}</div>
                )}
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddExpense} className="w-full md:w-auto gap-2">
                <Plus className="h-4 w-4" /> Add Expense
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Description</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground text-xs sm:text-sm">
                      No expenses added yet
                    </TableCell>
                  </TableRow>
                ) : (
                  otherExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="text-xs sm:text-sm">{expense.label}</TableCell>
                      <TableCell className="text-right text-xs sm:text-sm">{formatCurrency(expense.amount)}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveExpense(expense.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove expense</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {otherExpenses.length > 0 && (
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm">Total</TableCell>
                    <TableCell className="text-right font-medium text-xs sm:text-sm">
                      {formatCurrency(totalOtherExpenses)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <AIChat title="Other Expenses" context="expenses" />
    </>
  )
}
