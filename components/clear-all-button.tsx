"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useCalculatorStore } from "@/lib/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ClearAllButton() {
  const { clearAll } = useCalculatorStore()
  const [open, setOpen] = useState(false)

  const handleClearAll = () => {
    // Call the clearAll function from the store
    clearAll()

    // Close the dialog
    setOpen(false)

    // Force recalculation to update the dashboard
    setTimeout(() => {
      useCalculatorStore.getState().calculateResults()
    }, 0)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2 text-xs sm:text-sm w-full sm:w-auto">
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Clear All</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Clear all data?</AlertDialogTitle>
          <AlertDialogDescription>
            This will reset all input fields to their default values. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClearAll}>Clear All</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
