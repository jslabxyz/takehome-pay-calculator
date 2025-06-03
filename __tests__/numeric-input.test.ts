"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { NumericInput } from "@/components/ui/numeric-input"
import { describe, test, expect, vi } from "vitest"

describe("NumericInput Component", () => {
  test("renders with empty value when value is 0", () => {
    const mockOnChange = vi.fn()
    render(<NumericInput value={0} onValueChange={mockOnChange} data-testid="test-input" />)

    const input = screen.getByTestId("test-input")
    expect(input).toHaveValue("")
  })

  test("renders with empty value when value is null", () => {
    const mockOnChange = vi.fn()
    render(<NumericInput value={null} onValueChange={mockOnChange} data-testid="test-input" />)

    const input = screen.getByTestId("test-input")
    expect(input).toHaveValue("")
  })

  test("allows valid numeric input", () => {
    const mockOnChange = vi.fn()
    render(<NumericInput value={0} onValueChange={mockOnChange} data-testid="test-input" />)

    const input = screen.getByTestId("test-input")
    fireEvent.change(input, { target: { value: "123.45" } })

    expect(mockOnChange).toHaveBeenCalledWith(123.45)
    expect(input).toHaveValue("123.45")
  })

  test("allows negative numbers", () => {
    const mockOnChange = vi.fn()
    render(<NumericInput value={0} onValueChange={mockOnChange} data-testid="test-input" />)

    const input = screen.getByTestId("test-input")
    fireEvent.change(input, { target: { value: "-123.45" } })

    expect(mockOnChange).toHaveBeenCalledWith(-123.45)
    expect(input).toHaveValue("-123.45")
  })

  test("shows error message for invalid input", () => {
    const mockOnChange = vi.fn()
    const errorMessage = "Invalid number"
    render(<NumericInput value={0} onValueChange={mockOnChange} data-testid="test-input" errorMessage={errorMessage} />)

    const input = screen.getByTestId("test-input")
    fireEvent.change(input, { target: { value: "abc" } })

    expect(mockOnChange).not.toHaveBeenCalled()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test("handles empty input when allowEmpty is true", () => {
    const mockOnChange = vi.fn()
    render(<NumericInput value={123} onValueChange={mockOnChange} data-testid="test-input" allowEmpty={true} />)

    const input = screen.getByTestId("test-input")
    fireEvent.change(input, { target: { value: "" } })

    expect(mockOnChange).toHaveBeenCalledWith(null)
  })

  test("handles empty input when allowEmpty is false", () => {
    const mockOnChange = vi.fn()
    render(<NumericInput value={123} onValueChange={mockOnChange} data-testid="test-input" allowEmpty={false} />)

    const input = screen.getByTestId("test-input")
    fireEvent.change(input, { target: { value: "" } })

    expect(mockOnChange).toHaveBeenCalledWith(0)
  })
})
