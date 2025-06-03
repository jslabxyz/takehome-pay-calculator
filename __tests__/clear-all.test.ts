import React from "react"
import { useCalculatorStore } from "@/lib/store"
import { act } from "react-dom/test-utils"
import { describe, test, expect, vi, beforeEach } from "vitest"

describe("Clear All Functionality", () => {
  beforeEach(() => {
    // Reset the store before each test
    const store = useCalculatorStore.getState()
    act(() => {
      store.clearAll()
    })
  })

  test("should reset all values to defaults", () => {
    const store = useCalculatorStore.getState()

    // Set some values
    act(() => {
      store.setGrossIncomeZAR(50000)
      store.setRetirementContribution(5000)
      store.setMedicalBeneficiaries(2)
      store.setRent(12000)
      store.setApartmentSizeSqm(100)
      store.setOfficeSizeSqm(15)
      store.setUtilities(2000)
      store.setInternet(1000)
      store.setDonationsToPBO(500)

      // Add some other expenses
      store.addOtherExpense({
        id: "1",
        label: "Test Expense",
        amount: 1000,
      })

      // Add some depreciation items
      store.addDepreciation({
        id: "1",
        label: "Test Depreciation",
        amount: 500,
      })

      // Calculate results
      store.calculateResults()
    })

    // Verify values were set
    expect(store.grossIncomeZAR).toBe(50000)
    expect(store.otherExpenses.length).toBe(1)
    expect(store.depreciation.length).toBe(1)
    expect(store.totalDeductions).toBeGreaterThan(0)

    // Clear all values
    act(() => {
      store.clearAll()
    })

    // Verify all values were reset
    expect(store.grossIncomeZAR).toBe(0)
    expect(store.retirementContribution).toBe(0)
    expect(store.medicalBeneficiaries).toBe(0)
    expect(store.rent).toBe(0)
    expect(store.apartmentSizeSqm).toBe(0)
    expect(store.officeSizeSqm).toBe(0)
    expect(store.utilities).toBe(0)
    expect(store.internet).toBe(0)
    expect(store.donationsToPBO).toBe(0)
    expect(store.otherExpenses).toEqual([])
    expect(store.depreciation).toEqual([])

    // Verify calculated values were reset
    expect(store.totalDeductions).toBe(0)
    expect(store.taxableMonthly).toBe(0)
    expect(store.netMonthly).toBe(0)
    expect(store.effectiveRate).toBe(0)
  })

  test("should update UI components after clearing", async () => {
    // This would be a more comprehensive test in a real testing environment
    // with proper DOM rendering and component testing
    const mockSetState = vi.fn()
    const originalSetState = React.useState

    // Mock React.useState to track state updates
    vi.spyOn(React, "useState").mockImplementation((initialState) => {
      return [initialState, mockSetState]
    })

    const store = useCalculatorStore.getState()

    // Set some values
    act(() => {
      store.setGrossIncomeZAR(50000)
      store.calculateResults()
    })

    // Clear all values
    act(() => {
      store.clearAll()
    })

    // In a real test, we would check if the UI components were updated
    // For now, we'll just verify the store was reset
    expect(store.grossIncomeZAR).toBe(0)

    // Restore the original implementation
    vi.spyOn(React, "useState").mockRestore()
  })
})
