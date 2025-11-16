/**
 * Scenario Comparison Component
 * Compare multiple saved scenarios side by side
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCalculatorStore } from "@/lib/store-enhanced"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Save, Trash2, Edit2, Check, X, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function ScenarioComparison() {
  const {
    scenarios,
    currentScenarioId,
    saveScenario,
    loadScenario,
    deleteScenario,
    updateScenarioName,
    grossIncomeZAR,
    netMonthly,
    monthlyPAYE,
    effectiveRate,
    totalDeductions,
  } = useCalculatorStore()

  const [newScenarioName, setNewScenarioName] = useState("")
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSaveScenario = () => {
    if (newScenarioName.trim()) {
      saveScenario(newScenarioName.trim())
      setNewScenarioName("")
      setIsDialogOpen(false)
    }
  }

  const handleUpdateName = (id: string) => {
    if (editName.trim()) {
      updateScenarioName(id, editName.trim())
      setEditingScenarioId(null)
      setEditName("")
    }
  }

  const handleToggleScenario = (id: string) => {
    setSelectedScenarios((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  // Calculate comparison data for selected scenarios
  const comparisonData = selectedScenarios.map((id) => {
    const scenario = scenarios.find((s) => s.id === id)
    if (!scenario) return null

    // We need to recalculate the values for each scenario
    // For now, we'll store the current values when saving
    return scenario
  }).filter(Boolean)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Saved Scenarios</CardTitle>
              <CardDescription>Save and compare different tax scenarios</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Save Current
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Scenario</DialogTitle>
                  <DialogDescription>
                    Give your current calculation a name to save it for later comparison.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="scenario-name">Scenario Name</Label>
                    <Input
                      id="scenario-name"
                      value={newScenarioName}
                      onChange={(e) => setNewScenarioName(e.target.value)}
                      placeholder="e.g., Current Setup, High Income, etc."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveScenario()
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Gross Income:</span>
                      <span className="font-medium">{formatCurrency(grossIncomeZAR)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Take-home Pay:</span>
                      <span className="font-medium">{formatCurrency(netMonthly)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Rate:</span>
                      <span className="font-medium">{formatPercentage(effectiveRate)}</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveScenario} disabled={!newScenarioName.trim()}>
                      Save Scenario
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {scenarios.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No saved scenarios yet. Click "Save Current" to create one.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Compare</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Gross Income</TableHead>
                      <TableHead className="text-right">Take-home</TableHead>
                      <TableHead className="text-right">Tax Rate</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scenarios.map((scenario) => (
                      <TableRow
                        key={scenario.id}
                        className={currentScenarioId === scenario.id ? 'bg-muted/50' : ''}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedScenarios.includes(scenario.id)}
                            onCheckedChange={() => handleToggleScenario(scenario.id)}
                          />
                        </TableCell>
                        <TableCell>
                          {editingScenarioId === scenario.id ? (
                            <div className="flex gap-1">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-8"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateName(scenario.id)
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingScenarioId(null)
                                    setEditName("")
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => handleUpdateName(scenario.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => {
                                  setEditingScenarioId(null)
                                  setEditName("")
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>{scenario.name}</span>
                              {currentScenarioId === scenario.id && (
                                <Badge variant="secondary" className="text-xs">Current</Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(scenario.data.grossIncomeZAR)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {/* Note: We'd need to store calculated values or recalculate */}
                          -
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">-</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => loadScenario(scenario.id)}
                              title="Load scenario"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setEditingScenarioId(scenario.id)
                                setEditName(scenario.name)
                              }}
                              title="Edit name"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteScenario(scenario.id)}
                              title="Delete scenario"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedScenarios.length > 1 && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-semibold mb-2">Comparison View</h4>
                  <p className="text-sm text-muted-foreground">
                    Selected {selectedScenarios.length} scenarios for comparison.
                    Full comparison feature coming soon!
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
