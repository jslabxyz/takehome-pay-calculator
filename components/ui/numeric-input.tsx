"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface NumericInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange: (value: number | null) => void
  value: number | null
  allowEmpty?: boolean
  errorMessage?: string
}

export function NumericInput({
  onValueChange,
  value,
  allowEmpty = true,
  errorMessage = "Please enter a valid number",
  className,
  ...props
}: NumericInputProps) {
  const [inputValue, setInputValue] = useState<string>(value === null || value === 0 ? "" : value.toString())
  const [error, setError] = useState<string | null>(null)

  // Update internal state when external value changes
  useEffect(() => {
    // Handle reset to zero or null
    if (value === 0 || value === null) {
      setInputValue("")
      setError(null)
    } else if (value.toString() !== inputValue && inputValue !== "") {
      setInputValue(value.toString())
    }
  }, [value, inputValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Allow empty input if allowEmpty is true
    if (newValue === "") {
      setInputValue("")
      setError(null)
      onValueChange(allowEmpty ? null : 0)
      return
    }

    // Check if input is a valid number
    if (/^-?\d*\.?\d*$/.test(newValue)) {
      setInputValue(newValue)
      setError(null)

      // Convert to number and pass to parent
      const numericValue = newValue === "" ? (allowEmpty ? null : 0) : Number.parseFloat(newValue)
      onValueChange(numericValue)
    } else {
      setError(errorMessage)
    }
  }

  // Handle blur event to format the value
  const handleBlur = () => {
    if (inputValue === "") {
      if (!allowEmpty) {
        setInputValue("0")
        onValueChange(0)
      }
      return
    }

    const numericValue = Number.parseFloat(inputValue)
    if (!isNaN(numericValue)) {
      // Format the number with proper decimal places if needed
      // For this app, we'll keep it simple
      setInputValue(numericValue.toString())
    }
  }

  return (
    <div className="space-y-1">
      <Input
        type="text"
        inputMode="decimal"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          "bg-yellow-50 dark:bg-yellow-950/30 text-sm sm:text-base h-9 sm:h-10 px-3 py-1 sm:py-2",
          error && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs sm:text-sm text-destructive">{error}</p>}
    </div>
  )
}
