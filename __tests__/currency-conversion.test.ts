import { useCalculatorStore } from "@/lib/store"
import { describe, beforeEach, test, expect } from "vitest"

const getStore = () => useCalculatorStore.getState()
const EXCHANGE_RATE = 18.5 // 1 USD = 18.5 ZAR

describe("Currency Conversion Logic", () => {
  beforeEach(() => {
    getStore().clearAll()
  })

  test("should store values in ZAR regardless of input currency", () => {
    // Simulate USD input: $1000 * 18.5 = R18,500
    const usdAmount = 1000
    getStore().setGrossIncomeZAR(usdAmount * EXCHANGE_RATE)
    getStore().calculateResults()

    expect(getStore().grossIncomeZAR).toBe(18500)
  })

  test("should calculate tax on ZAR-converted values", () => {
    // $5000/month = R92,500/month = R1,110,000/year
    const usdIncome = 5000
    getStore().setGrossIncomeZAR(usdIncome * EXCHANGE_RATE)
    getStore().calculateResults()

    const store = getStore()
    expect(store.grossIncomeZAR).toBe(92500)
    expect(store.taxableAnnual).toBe(92500 * 12)
    expect(store.annualTax).toBeGreaterThan(0)
  })

  test("should handle expense conversion from USD to ZAR", () => {
    // $100 expense = R1,850 in store
    const usdExpense = 100
    getStore().addOtherExpense({
      id: "1",
      label: "Cloud Service",
      amount: usdExpense * EXCHANGE_RATE,
    })
    getStore().calculateResults()

    expect(getStore().otherExpenses[0].amount).toBe(1850)
    expect(getStore().otherTotal).toBe(1850)
  })
})

describe("Full Calculation Integration", () => {
  beforeEach(() => {
    getStore().clearAll()
  })

  test("should calculate complete tax scenario correctly", () => {
    // Realistic contractor scenario
    getStore().setGrossIncomeZAR(80000) // R80k/month
    getStore().setRetirementContribution(8000)
    getStore().setMedicalBeneficiaries(3) // self + spouse + 1 child
    getStore().setRent(15000)
    getStore().setApartmentSizeSqm(80)
    getStore().setOfficeSizeSqm(12)
    getStore().setUtilities(3000)
    getStore().setInternet(1200)
    getStore().setDonationsToPBO(500)
    getStore().addOtherExpense({ id: "1", label: "Software", amount: 2000 })
    getStore().addDepreciation({ id: "1", label: "Laptop", amount: 1500 })
    getStore().calculateResults()

    const store = getStore()

    // Verify office fraction
    expect(store.officeFrac).toBeCloseTo(12 / 80, 4) // 0.15

    // Verify deductions
    expect(store.allowedRet).toBe(8000) // within 27.5% limit
    expect(store.dedRent).toBeCloseTo(15000 * 0.15, 2)
    expect(store.dedUtilities).toBeCloseTo(3000 * 0.15, 2)
    expect(store.dedInternet).toBe(1200) // full amount
    expect(store.otherTotal).toBe(2000)
    expect(store.deprTotal).toBe(1500)

    // Verify total deductions
    const expectedDeductions = 8000 + (15000 * 0.15) + (3000 * 0.15) + 1200 + 2000 + 500 + 1500
    expect(store.totalDeductions).toBeCloseTo(expectedDeductions, 2)

    // Verify taxable income
    expect(store.taxableMonthly).toBeCloseTo(80000 - expectedDeductions, 2)
    expect(store.taxableAnnual).toBeCloseTo(store.taxableMonthly * 12, 2)

    // Verify tax is positive and reasonable
    expect(store.annualTax).toBeGreaterThan(0)
    expect(store.monthlyPAYE).toBeGreaterThan(0)
    expect(store.netMonthly).toBeLessThan(80000)
    expect(store.netMonthly).toBeGreaterThan(0)

    // Verify effective rate is reasonable (should be 20-35% for this income)
    expect(store.effectiveRate).toBeGreaterThan(0.15)
    expect(store.effectiveRate).toBeLessThan(0.40)

    // Verify medical credit (3 beneficiaries = 728 + 246)
    expect(store.medicalCredit).toBe(728 + 246)
  })

  test("net monthly + PAYE should equal gross income", () => {
    getStore().setGrossIncomeZAR(60000)
    getStore().calculateResults()

    const store = getStore()
    // netMonthly = grossIncome - monthlyPAYE
    expect(store.netMonthly + store.monthlyPAYE).toBeCloseTo(60000, 2)
  })

  test("effective rate should equal PAYE / gross income", () => {
    getStore().setGrossIncomeZAR(50000)
    getStore().calculateResults()

    const store = getStore()
    expect(store.effectiveRate).toBeCloseTo(store.monthlyPAYE / 50000, 6)
  })
})
