"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCalculatorStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { Plus, Trash2, InfoIcon as InfoCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { NumericInput } from "@/components/ui/numeric-input"
import { AIChat } from "@/components/ai-chat"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export function Depreciation() {
  const { depreciation, addDepreciation, removeDepreciation, calculateResults } = useCalculatorStore()
  const [newLabel, setNewLabel] = useState("")
  const [newAmount, setNewAmount] = useState<number | null>(null)
  const [labelError, setLabelError] = useState<string | null>(null)
  const [currency, setCurrency] = useState<'ZAR' | 'USD'>('ZAR')
  const exchangeRate = 18.5

  // Reset form fields when depreciation is cleared
  useEffect(() => {
    if (depreciation.length === 0) {
      setNewLabel("")
      setNewAmount(null)
      setLabelError(null)
    }
  }, [depreciation])

  const handleAddDepreciation = () => {
    // Validate label
    if (!newLabel.trim()) {
      setLabelError("Please enter a description")
      return
    }

    // Validate amount
    if (newAmount === null || newAmount <= 0) {
      return // The NumericInput component will show its own error
    }

    // Add depreciation item
    addDepreciation({
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

  const handleRemoveDepreciation = (id: string) => {
    removeDepreciation(id)
    calculateResults()
  }

  const totalDepreciation = depreciation.reduce((sum, item) => sum + item.amount, 0)

  const handleCurrencyChange = (value: 'ZAR' | 'USD') => setCurrency(value)

  return (
    <>
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg sm:text-xl">Wear-and-Tear Depreciation</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    SARS allows depreciation of business assets over their useful life. Common rates:
                    <br />- Computers: 3 years (33.33% p.a.)
                    <br />- Office furniture: 6 years (16.67% p.a.)
                    <br />- Software: 2 years (50% p.a.)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>Add monthly depreciation amounts for business assets</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="depreciationLabel" className="text-sm sm:text-base">
                  Asset Description
                </Label>
                <div className="space-y-1">
                  <Input
                    id="depreciationLabel"
                    value={newLabel}
                    onChange={(e) => {
                      setNewLabel(e.target.value)
                      setLabelError(null)
                    }}
                    placeholder="e.g., Laptop"
                    className={`bg-yellow-50 dark:bg-yellow-950/30 ${labelError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  {labelError && <p className="text-sm text-destructive">{labelError}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="depreciationAmount" className="text-sm sm:text-base">
                  Monthly Amount (ZAR)
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
                  id="depreciationAmount"
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
              <Button onClick={handleAddDepreciation} className="w-full md:w-auto gap-2">
                <Plus className="h-4 w-4" /> Add Asset
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Asset Description</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Monthly Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depreciation.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground text-xs sm:text-sm">
                      No depreciation items added yet
                    </TableCell>
                  </TableRow>
                ) : (
                  depreciation.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs sm:text-sm">{item.label}</TableCell>
                      <TableCell className="text-right text-xs sm:text-sm">{formatCurrency(item.amount)}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveDepreciation(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove item</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {depreciation.length > 0 && (
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm">Total</TableCell>
                    <TableCell className="text-right font-medium text-xs sm:text-sm">
                      {formatCurrency(totalDepreciation)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <AIChat title="Depreciation" context="depreciation" />
    </>
  )
}
