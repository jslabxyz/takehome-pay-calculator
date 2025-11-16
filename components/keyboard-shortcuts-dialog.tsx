/**
 * Keyboard Shortcuts Dialog
 * Displays available keyboard shortcuts
 */

"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Keyboard } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ShortcutInfo {
  keys: string[]
  description: string
  category: string
}

const shortcuts: ShortcutInfo[] = [
  {
    keys: ['?'],
    description: 'Show keyboard shortcuts',
    category: 'General',
  },
  {
    keys: ['Ctrl', 'S'],
    description: 'Save current scenario',
    category: 'Scenarios',
  },
  {
    keys: ['Ctrl', 'K'],
    description: 'Clear all inputs',
    category: 'General',
  },
  {
    keys: ['Ctrl', 'E'],
    description: 'Export to Excel',
    category: 'Export',
  },
  {
    keys: ['Ctrl', 'P'],
    description: 'Export to PDF',
    category: 'Export',
  },
  {
    keys: ['1'],
    description: 'Go to Dashboard',
    category: 'Navigation',
  },
  {
    keys: ['2'],
    description: 'Go to Basic Inputs',
    category: 'Navigation',
  },
  {
    keys: ['3'],
    description: 'Go to Expenses',
    category: 'Navigation',
  },
  {
    keys: ['4'],
    description: 'Go to Depreciation',
    category: 'Navigation',
  },
  {
    keys: ['5'],
    description: 'Go to Export',
    category: 'Navigation',
  },
  {
    keys: ['Ctrl', 'B'],
    description: 'Toggle calculation breakdown',
    category: 'Display',
  },
]

// Group shortcuts by category
const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
  if (!acc[shortcut.category]) {
    acc[shortcut.category] = []
  }
  acc[shortcut.category].push(shortcut)
  return acc
}, {} as Record<string, ShortcutInfo[]>)

export function KeyboardShortcutsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and use the calculator more efficiently
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="font-semibold mb-3">{category}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Shortcut</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryShortcuts.map((shortcut, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex gap-1">
                          {shortcut.keys.map((key, i) => (
                            <React.Fragment key={i}>
                              <Badge variant="secondary" className="font-mono">
                                {key}
                              </Badge>
                              {i < shortcut.keys.length - 1 && <span className="mx-1">+</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{shortcut.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
