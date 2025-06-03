import { useCalculatorStore } from "@/lib/store"
import { act } from "react-dom/test-utils"
import { describe, beforeEach, test, expect } from "vitest"

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
      annualTax: 116975,
      monthlyTaxPreCredit: 9747.92,
      medicalCredit: 364,
      monthlyPAYE: 9383.92,
      netMonthly: 40616.08,
      effectiveRate: 0.1877,
    },
  },
  // Add more test cases as needed
}

describe("Calculator Engine", () => {
  beforeEach(() => {
    // Reset the store before each test
    const store = useCalculatorStore.getState()
    act(() => {
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
  })

  test("should match Excel workbook calculations for test case 1", () => {
    const store = useCalculatorStore.getState()
    const testCase = excelWorkbookValues.testCase1

    // Set inputs
    act(() => {
      store.setGrossIncomeZAR(testCase.inputs.grossIncomeZAR)
      store.setRetirementContribution(testCase.inputs.retirementContribution)
      store.setMedicalBeneficiaries(testCase.inputs.medicalBeneficiaries)
      store.setRent(testCase.inputs.rent)
      store.setApartmentSizeSqm(testCase.inputs.apartmentSizeSqm)
      store.setOfficeSizeSqm(testCase.inputs.officeSizeSqm)
      store.setUtilities(testCase.inputs.utilities)
      store.setInternet(testCase.inputs.internet)
      store.setDonationsToPBO(testCase.inputs.donationsToPBO)

      // Calculate results
      store.calculateResults()
    })

    // Check results against expected values
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
    const store = useCalculatorStore.getState()

    // Test case where retirement contribution is below limits
    act(() => {
      store.setGrossIncomeZAR(50000)
      store.setRetirementContribution(5000)
      store.calculateResults()
    })
    expect(store.allowedRet).toBe(5000)

    // Test case where retirement contribution exceeds 27.5% limit
    act(() => {
      store.setGrossIncomeZAR(50000)
      store.setRetirementContribution(20000) // 40% of gross income
      store.calculateResults()
    })
    expect(store.allowedRet).toBeCloseTo(13750, 2) // 27.5% of 50000

    // Test case where retirement contribution exceeds annual limit
    act(() => {
      store.setGrossIncomeZAR(200000)
      store.setRetirementContribution(40000) // Below 27.5% but above annual limit
      store.calculateResults()
    })
    expect(store.allowedRet).toBeCloseTo(350000 / 12, 2) // Annual limit divided by 12
  })

  test("should correctly calculate medical tax credits", () => {
    const store = useCalculatorStore.getState()

    // Test with 0 beneficiaries
    act(() => {
      store.setMedicalBeneficiaries(0)
      store.calculateResults()
    })
    expect(store.medicalCredit).toBe(0)

    // Test with 1 beneficiary
    act(() => {
      store.setMedicalBeneficiaries(1)
      store.calculateResults()
    })
    expect(store.medicalCredit).toBe(364)

    // Test with 2 beneficiaries
    act(() => {
      store.setMedicalBeneficiaries(2)
      store.calculateResults()
    })
    expect(store.medicalCredit).toBe(728)

    // Test with 3 beneficiaries
    act(() => {
      store.setMedicalBeneficiaries(3)
      store.calculateResults()
    })
    expect(store.medicalCredit).toBe(728 + 246)

    // Test with 4 beneficiaries
    act(() => {
      store.setMedicalBeneficiaries(4)
      store.calculateResults()
    })
    expect(store.medicalCredit).toBe(728 + 246 * 2)
  })

  test("should correctly calculate tax brackets", () => {
    const store = useCalculatorStore.getState()

    // Test first bracket (18%)
    act(() => {
      store.setGrossIncomeZAR(15000) // 180,000 annually
      store.calculateResults()
    })
    expect(store.annualTax).toBeCloseTo(180000 * 0.18, 2)

    // Test second bracket (26%)
    act(() => {
      store.setGrossIncomeZAR(25000) // 300,000 annually
      store.calculateResults()
    })
    expect(store.annualTax).toBeCloseTo(42678 + (300000 - 237100) * 0.26, 2)

    // Test third bracket (31%)
    act(() => {
      store.setGrossIncomeZAR(35000) // 420,000 annually
      store.calculateResults()
    })
    expect(store.annualTax).toBeCloseTo(77362 + (420000 - 370500) * 0.31, 2)

    // Test fourth bracket (36%)
    act(() => {
      store.setGrossIncomeZAR(50000) // 600,000 annually
      store.calculateResults()
    })
    expect(store.annualTax).toBeCloseTo(121475 + (600000 - 512800) * 0.36, 2)

    // Test fifth bracket (39%)
    act(() => {
      store.setGrossIncomeZAR(65000) // 780,000 annually
      store.calculateResults()
    })
    expect(store.annualTax).toBeCloseTo(179147 + (780000 - 673000) * 0.39, 2)

    // Test sixth bracket (41%)
    act(() => {
      store.setGrossIncomeZAR(100000) // 1,200,000 annually
      store.calculateResults()
    })
    expect(store.annualTax).toBeCloseTo(251258 + (1200000 - 857900) * 0.41, 2)

    // Test seventh bracket (45%)
    act(() => {
      store.setGrossIncomeZAR(200000) // 2,400,000 annually
      store.calculateResults()
    })
    expect(store.annualTax).toBeCloseTo(644489 + (2400000 - 1817000) * 0.45, 2)
  })
})
