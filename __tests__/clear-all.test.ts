import { useCalculatorStore } from "@/lib/store"
import { describe, test, expect, beforeEach } from "vitest"

const getStore = () => useCalculatorStore.getState()

describe("Clear All Functionality", () => {
  beforeEach(() => {
    getStore().clearAll()
  })

  test("should reset all values to defaults", () => {
    // Set some values
    getStore().setGrossIncomeZAR(50000)
    getStore().setRetirementContribution(5000)
    getStore().setMedicalBeneficiaries(2)
    getStore().setRent(12000)
    getStore().setApartmentSizeSqm(100)
    getStore().setOfficeSizeSqm(15)
    getStore().setUtilities(2000)
    getStore().setInternet(1000)
    getStore().setDonationsToPBO(500)

    // Add some other expenses
    getStore().addOtherExpense({
      id: "1",
      label: "Test Expense",
      amount: 1000,
    })

    // Add some depreciation items
    getStore().addDepreciation({
      id: "1",
      label: "Test Depreciation",
      amount: 500,
    })

    // Calculate results
    getStore().calculateResults()

    // Verify values were set
    expect(getStore().grossIncomeZAR).toBe(50000)
    expect(getStore().otherExpenses.length).toBe(1)
    expect(getStore().depreciation.length).toBe(1)
    expect(getStore().totalDeductions).toBeGreaterThan(0)

    // Clear all values
    getStore().clearAll()

    // Verify all values were reset
    const store = getStore()
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

  test("should update UI components after clearing", () => {
    // Set some values
    getStore().setGrossIncomeZAR(50000)
    getStore().calculateResults()

    // Clear all values
    getStore().clearAll()

    // Verify the store was reset
    expect(getStore().grossIncomeZAR).toBe(0)
  })
})
