import { useCalculatorStore } from "@/lib/store"
import { describe, beforeEach, test, expect } from "vitest"

const getStore = () => useCalculatorStore.getState()

describe("Other Expenses", () => {
  beforeEach(() => {
    getStore().clearAll()
  })

  test("should add an expense and include in deductions", () => {
    getStore().addOtherExpense({ id: "1", label: "Software", amount: 500 })
    getStore().calculateResults()

    expect(getStore().otherExpenses).toHaveLength(1)
    expect(getStore().otherExpenses[0]).toEqual({ id: "1", label: "Software", amount: 500 })
    expect(getStore().otherTotal).toBe(500)
    expect(getStore().totalDeductions).toBe(500)
  })

  test("should add multiple expenses and sum them", () => {
    getStore().addOtherExpense({ id: "1", label: "Software", amount: 500 })
    getStore().addOtherExpense({ id: "2", label: "Bank Fees", amount: 200 })
    getStore().addOtherExpense({ id: "3", label: "Cleaning", amount: 300 })
    getStore().calculateResults()

    expect(getStore().otherExpenses).toHaveLength(3)
    expect(getStore().otherTotal).toBe(1000)
  })

  test("should remove an expense by id", () => {
    getStore().addOtherExpense({ id: "1", label: "Software", amount: 500 })
    getStore().addOtherExpense({ id: "2", label: "Bank Fees", amount: 200 })
    getStore().removeOtherExpense("1")
    getStore().calculateResults()

    expect(getStore().otherExpenses).toHaveLength(1)
    expect(getStore().otherExpenses[0].label).toBe("Bank Fees")
    expect(getStore().otherTotal).toBe(200)
  })

  test("should reduce taxable income when expenses are added", () => {
    getStore().setGrossIncomeZAR(50000)
    getStore().calculateResults()
    const taxBefore = getStore().annualTax

    getStore().addOtherExpense({ id: "1", label: "Software", amount: 5000 })
    getStore().calculateResults()
    const taxAfter = getStore().annualTax

    expect(taxAfter).toBeLessThan(taxBefore)
    expect(getStore().taxableMonthly).toBe(45000)
  })
})

describe("Depreciation", () => {
  beforeEach(() => {
    getStore().clearAll()
  })

  test("should add a depreciation item and include in deductions", () => {
    getStore().addDepreciation({ id: "1", label: "Laptop", amount: 800 })
    getStore().calculateResults()

    expect(getStore().depreciation).toHaveLength(1)
    expect(getStore().deprTotal).toBe(800)
    expect(getStore().totalDeductions).toBe(800)
  })

  test("should remove a depreciation item by id", () => {
    getStore().addDepreciation({ id: "1", label: "Laptop", amount: 800 })
    getStore().addDepreciation({ id: "2", label: "Desk", amount: 200 })
    getStore().removeDepreciation("1")
    getStore().calculateResults()

    expect(getStore().depreciation).toHaveLength(1)
    expect(getStore().deprTotal).toBe(200)
  })

  test("should combine expenses and depreciation in total deductions", () => {
    getStore().setGrossIncomeZAR(50000)
    getStore().setRetirementContribution(3000)
    getStore().addOtherExpense({ id: "1", label: "Software", amount: 500 })
    getStore().addDepreciation({ id: "1", label: "Laptop", amount: 800 })
    getStore().calculateResults()

    const store = getStore()
    expect(store.totalDeductions).toBe(3000 + 500 + 800) // retirement + expense + depreciation
  })
})

describe("Office Fraction Calculations", () => {
  beforeEach(() => {
    getStore().clearAll()
  })

  test("should calculate office fraction correctly", () => {
    getStore().setApartmentSizeSqm(100)
    getStore().setOfficeSizeSqm(20)
    getStore().calculateResults()

    expect(getStore().officeFrac).toBeCloseTo(0.2, 4)
  })

  test("should handle zero apartment size without division error", () => {
    getStore().setApartmentSizeSqm(0)
    getStore().setOfficeSizeSqm(20)
    getStore().calculateResults()

    expect(getStore().officeFrac).toBe(0)
  })

  test("should apply office fraction to rent and utilities", () => {
    getStore().setRent(10000)
    getStore().setUtilities(2000)
    getStore().setApartmentSizeSqm(100)
    getStore().setOfficeSizeSqm(25)
    getStore().calculateResults()

    expect(getStore().dedRent).toBeCloseTo(2500, 2) // 25% of 10000
    expect(getStore().dedUtilities).toBeCloseTo(500, 2) // 25% of 2000
  })

  test("should deduct full internet without office fraction", () => {
    getStore().setInternet(1500)
    getStore().setApartmentSizeSqm(100)
    getStore().setOfficeSizeSqm(10)
    getStore().calculateResults()

    expect(getStore().dedInternet).toBe(1500) // full amount, no fraction
  })
})

describe("Donations to PBO", () => {
  beforeEach(() => {
    getStore().clearAll()
  })

  test("should include donations in total deductions", () => {
    getStore().setDonationsToPBO(1000)
    getStore().calculateResults()

    expect(getStore().totalDeductions).toBe(1000)
  })
})

describe("Edge Cases", () => {
  beforeEach(() => {
    getStore().clearAll()
  })

  test("should not produce negative taxable income", () => {
    getStore().setGrossIncomeZAR(1000)
    getStore().setRetirementContribution(500)
    getStore().setInternet(500)
    getStore().addOtherExpense({ id: "1", label: "Big Expense", amount: 5000 })
    getStore().calculateResults()

    expect(getStore().taxableMonthly).toBe(0) // clamped to 0
    expect(getStore().annualTax).toBe(0)
    expect(getStore().monthlyPAYE).toBe(0)
  })

  test("should handle zero income", () => {
    getStore().setGrossIncomeZAR(0)
    getStore().calculateResults()

    const store = getStore()
    expect(store.taxableMonthly).toBe(0)
    expect(store.annualTax).toBe(0)
    expect(store.monthlyPAYE).toBe(0)
    expect(store.netMonthly).toBe(0)
    expect(store.effectiveRate).toBe(0)
  })

  test("should handle very high income (top tax bracket)", () => {
    getStore().setGrossIncomeZAR(300000) // 3.6M annually
    getStore().calculateResults()

    const store = getStore()
    expect(store.annualTax).toBeCloseTo(644489 + (3600000 - 1817000) * 0.45, 2)
    expect(store.effectiveRate).toBeGreaterThan(0.35) // should be above 35%
  })
})
