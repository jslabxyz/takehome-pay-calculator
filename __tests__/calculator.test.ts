import { useCalculatorStore } from "@/lib/store"
import { describe, beforeEach, test, expect } from "vitest"

const getStore = () => useCalculatorStore.getState()

// Mock Excel workbook values for comparison
const excelWorkbookValues = {
  // Sample test case from Excel workbook
  testCase1: {
    inputs: {
      grossIncomeZAR: 50000,
      retirementContribution: 5000,
      medicalBeneficiaries: 1,
      rent: 12000,
      apartmentSizeSqm: 100,
      officeSizeSqm: 15,
      utilities: 2000,
      internet: 1000,
      donationsToPBO: 500,
      otherExpenses: [],
      depreciation: [],
    },
    expected: {
      officeFrac: 0.15,
      allowedRet: 5000,
      dedRent: 1800,
      dedUtilities: 300,
      dedInternet: 1000,
      totalDeductions: 8600,
      taxableMonthly: 41400,
      taxableAnnual: 496800,
      annualTax: 116515,
      monthlyTaxPreCredit: 9709.58,
      medicalCredit: 364,
      monthlyPAYE: 9345.58,
      netMonthly: 40654.42,
      effectiveRate: 0.1869,
    },
  },
  // Add more test cases as needed
}

describe("Calculator Engine", () => {
  beforeEach(() => {
    // Reset the store before each test
    const store = getStore()
    store.setGrossIncomeZAR(0)
    store.setRetirementContribution(0)
    store.setMedicalBeneficiaries(0)
    store.setRent(0)
    store.setApartmentSizeSqm(0)
    store.setOfficeSizeSqm(0)
    store.setUtilities(0)
    store.setInternet(0)
    store.setDonationsToPBO(0)
  })

  test("should match Excel workbook calculations for test case 1", () => {
    const testCase = excelWorkbookValues.testCase1

    // Set inputs
    getStore().setGrossIncomeZAR(testCase.inputs.grossIncomeZAR)
    getStore().setRetirementContribution(testCase.inputs.retirementContribution)
    getStore().setMedicalBeneficiaries(testCase.inputs.medicalBeneficiaries)
    getStore().setRent(testCase.inputs.rent)
    getStore().setApartmentSizeSqm(testCase.inputs.apartmentSizeSqm)
    getStore().setOfficeSizeSqm(testCase.inputs.officeSizeSqm)
    getStore().setUtilities(testCase.inputs.utilities)
    getStore().setInternet(testCase.inputs.internet)
    getStore().setDonationsToPBO(testCase.inputs.donationsToPBO)
    getStore().calculateResults()

    // Check results against expected values
    const store = getStore()
    expect(store.officeFrac).toBeCloseTo(testCase.expected.officeFrac, 2)
    expect(store.allowedRet).toBeCloseTo(testCase.expected.allowedRet, 2)
    expect(store.dedRent).toBeCloseTo(testCase.expected.dedRent, 2)
    expect(store.dedUtilities).toBeCloseTo(testCase.expected.dedUtilities, 2)
    expect(store.dedInternet).toBeCloseTo(testCase.expected.dedInternet, 2)
    expect(store.totalDeductions).toBeCloseTo(testCase.expected.totalDeductions, 2)
    expect(store.taxableMonthly).toBeCloseTo(testCase.expected.taxableMonthly, 2)
    expect(store.taxableAnnual).toBeCloseTo(testCase.expected.taxableAnnual, 2)
    expect(store.annualTax).toBeCloseTo(testCase.expected.annualTax, 2)
    expect(store.monthlyTaxPreCredit).toBeCloseTo(testCase.expected.monthlyTaxPreCredit, 2)
    expect(store.medicalCredit).toBeCloseTo(testCase.expected.medicalCredit, 2)
    expect(store.monthlyPAYE).toBeCloseTo(testCase.expected.monthlyPAYE, 2)
    expect(store.netMonthly).toBeCloseTo(testCase.expected.netMonthly, 2)
    expect(store.effectiveRate).toBeCloseTo(testCase.expected.effectiveRate, 4)
  })

  test("should correctly calculate retirement contribution limits", () => {
    // Test case where retirement contribution is below limits
    getStore().setGrossIncomeZAR(50000)
    getStore().setRetirementContribution(5000)
    getStore().calculateResults()
    expect(getStore().allowedRet).toBe(5000)

    // Test case where retirement contribution exceeds 27.5% limit
    getStore().setGrossIncomeZAR(50000)
    getStore().setRetirementContribution(20000) // 40% of gross income
    getStore().calculateResults()
    expect(getStore().allowedRet).toBeCloseTo(13750, 2) // 27.5% of 50000

    // Test case where retirement contribution exceeds annual limit
    getStore().setGrossIncomeZAR(200000)
    getStore().setRetirementContribution(40000) // Below 27.5% but above annual limit
    getStore().calculateResults()
    expect(getStore().allowedRet).toBeCloseTo(350000 / 12, 2) // Annual limit divided by 12
  })

  test("should correctly calculate medical tax credits", () => {
    // Test with 0 beneficiaries
    getStore().setMedicalBeneficiaries(0)
    getStore().calculateResults()
    expect(getStore().medicalCredit).toBe(0)

    // Test with 1 beneficiary
    getStore().setMedicalBeneficiaries(1)
    getStore().calculateResults()
    expect(getStore().medicalCredit).toBe(364)

    // Test with 2 beneficiaries
    getStore().setMedicalBeneficiaries(2)
    getStore().calculateResults()
    expect(getStore().medicalCredit).toBe(728)

    // Test with 3 beneficiaries
    getStore().setMedicalBeneficiaries(3)
    getStore().calculateResults()
    expect(getStore().medicalCredit).toBe(728 + 246)

    // Test with 4 beneficiaries
    getStore().setMedicalBeneficiaries(4)
    getStore().calculateResults()
    expect(getStore().medicalCredit).toBe(728 + 246 * 2)
  })

  test("should correctly calculate tax brackets", () => {
    // Test first bracket (18%)
    getStore().setGrossIncomeZAR(15000) // 180,000 annually
    getStore().calculateResults()
    expect(getStore().annualTax).toBeCloseTo(180000 * 0.18, 2)

    // Test second bracket (26%)
    getStore().setGrossIncomeZAR(25000) // 300,000 annually
    getStore().calculateResults()
    expect(getStore().annualTax).toBeCloseTo(42678 + (300000 - 237100) * 0.26, 2)

    // Test third bracket (31%)
    getStore().setGrossIncomeZAR(35000) // 420,000 annually
    getStore().calculateResults()
    expect(getStore().annualTax).toBeCloseTo(77362 + (420000 - 370500) * 0.31, 2)

    // Test fourth bracket (36%)
    getStore().setGrossIncomeZAR(50000) // 600,000 annually
    getStore().calculateResults()
    expect(getStore().annualTax).toBeCloseTo(121475 + (600000 - 512800) * 0.36, 2)

    // Test fifth bracket (39%)
    getStore().setGrossIncomeZAR(65000) // 780,000 annually
    getStore().calculateResults()
    expect(getStore().annualTax).toBeCloseTo(179147 + (780000 - 673000) * 0.39, 2)

    // Test sixth bracket (41%)
    getStore().setGrossIncomeZAR(100000) // 1,200,000 annually
    getStore().calculateResults()
    expect(getStore().annualTax).toBeCloseTo(251258 + (1200000 - 857900) * 0.41, 2)

    // Test seventh bracket (45%)
    getStore().setGrossIncomeZAR(200000) // 2,400,000 annually
    getStore().calculateResults()
    expect(getStore().annualTax).toBeCloseTo(644489 + (2400000 - 1817000) * 0.45, 2)
  })
})
