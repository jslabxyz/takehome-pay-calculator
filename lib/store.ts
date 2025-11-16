/**
 * Enhanced Calculator Store
 * Includes data persistence, scenarios, VAT, provisional tax, and more
 */

"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Expense {
  id: string
  label: string
  amount: number
}

export interface ValidationWarning {
  field: string
  message: string
  severity: 'warning' | 'error' | 'info'
}

export interface TaxBreakdown {
  bracket: number
  from: number
  to: number
  rate: number
  amount: number
}

export interface Scenario {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  data: CalculatorInputs
}

export interface CalculatorInputs {
  // Basic inputs
  grossIncomeZAR: number
  retirementContribution: number
  medicalBeneficiaries: number
  rent: number
  apartmentSizeSqm: number
  officeSizeSqm: number
  utilities: number
  internet: number
  donationsToPBO: number
  otherExpenses: Expense[]
  depreciation: Expense[]

  // VAT settings
  isVATRegistered: boolean
  vatRate: number // Default 15%

  // Settings
  inputMode: 'monthly' | 'annual'
  showCalculationBreakdown: boolean
}

export interface CalculatorState extends CalculatorInputs {
  // Calculated values
  officeFrac: number
  allowedRet: number
  dedRent: number
  dedUtilities: number
  dedInternet: number
  otherTotal: number
  deprTotal: number
  totalDeductions: number
  taxableMonthly: number
  taxableAnnual: number
  annualTax: number
  monthlyTaxPreCredit: number
  medicalCredit: number
  monthlyPAYE: number
  netMonthly: number
  netAnnual: number
  effectiveRate: number

  // Provisional tax calculations
  provisionalTaxFirstPayment: number
  provisionalTaxSecondPayment: number
  provisionalTaxThirdPayment: number

  // VAT calculations
  outputVAT: number
  inputVAT: number
  netVATPayable: number

  // Warnings and validations
  warnings: ValidationWarning[]

  // Tax breakdown for transparency
  taxBreakdown: TaxBreakdown[]

  // Scenarios
  scenarios: Scenario[]
  currentScenarioId: string | null

  // Actions for basic inputs
  setGrossIncomeZAR: (value: number) => void
  setRetirementContribution: (value: number) => void
  setMedicalBeneficiaries: (value: number) => void
  setRent: (value: number) => void
  setApartmentSizeSqm: (value: number) => void
  setOfficeSizeSqm: (value: number) => void
  setUtilities: (value: number) => void
  setInternet: (value: number) => void
  setDonationsToPBO: (value: number) => void
  addOtherExpense: (expense: Expense) => void
  removeOtherExpense: (id: string) => void
  addDepreciation: (item: Expense) => void
  removeDepreciation: (id: string) => void

  // VAT actions
  setVATRegistered: (value: boolean) => void
  setVATRate: (value: number) => void

  // Settings actions
  setInputMode: (mode: 'monthly' | 'annual') => void
  setShowCalculationBreakdown: (show: boolean) => void

  // Scenario actions
  saveScenario: (name: string) => void
  loadScenario: (id: string) => void
  deleteScenario: (id: string) => void
  updateScenarioName: (id: string, name: string) => void

  // Calculation actions
  calculateResults: () => void
  clearAll: () => void
}

// Default input values
const defaultInputs: CalculatorInputs = {
  grossIncomeZAR: 0,
  retirementContribution: 0,
  medicalBeneficiaries: 0,
  rent: 0,
  apartmentSizeSqm: 0,
  officeSizeSqm: 0,
  utilities: 0,
  internet: 0,
  donationsToPBO: 0,
  otherExpenses: [],
  depreciation: [],
  isVATRegistered: false,
  vatRate: 15,
  inputMode: 'monthly',
  showCalculationBreakdown: false,
}

// Default calculated values
const defaultCalculated = {
  officeFrac: 0,
  allowedRet: 0,
  dedRent: 0,
  dedUtilities: 0,
  dedInternet: 0,
  otherTotal: 0,
  deprTotal: 0,
  totalDeductions: 0,
  taxableMonthly: 0,
  taxableAnnual: 0,
  annualTax: 0,
  monthlyTaxPreCredit: 0,
  medicalCredit: 0,
  monthlyPAYE: 0,
  netMonthly: 0,
  netAnnual: 0,
  effectiveRate: 0,
  provisionalTaxFirstPayment: 0,
  provisionalTaxSecondPayment: 0,
  provisionalTaxThirdPayment: 0,
  outputVAT: 0,
  inputVAT: 0,
  netVATPayable: 0,
  warnings: [],
  taxBreakdown: [],
  scenarios: [],
  currentScenarioId: null,
}

/**
 * Calculate tax breakdown by bracket
 */
function calculateTaxBreakdown(taxableAnnual: number): TaxBreakdown[] {
  const brackets: TaxBreakdown[] = []

  // SARS 2025/26 tax brackets
  const taxBrackets = [
    { from: 0, to: 237100, rate: 0.18, base: 0 },
    { from: 237100, to: 370500, rate: 0.26, base: 42678 },
    { from: 370500, to: 512800, rate: 0.31, base: 77362 },
    { from: 512800, to: 673000, rate: 0.36, base: 121475 },
    { from: 673000, to: 857900, rate: 0.39, base: 179147 },
    { from: 857900, to: 1817000, rate: 0.41, base: 251258 },
    { from: 1817000, to: Infinity, rate: 0.45, base: 644489 },
  ]

  let remaining = taxableAnnual

  for (let i = 0; i < taxBrackets.length && remaining > 0; i++) {
    const bracket = taxBrackets[i]
    const bracketSize = bracket.to - bracket.from
    const taxableInBracket = Math.min(remaining, bracketSize)
    const taxInBracket = taxableInBracket * bracket.rate

    if (taxableInBracket > 0) {
      brackets.push({
        bracket: i + 1,
        from: bracket.from,
        to: Math.min(bracket.to, taxableAnnual),
        rate: bracket.rate,
        amount: taxInBracket,
      })
    }

    remaining -= taxableInBracket
  }

  return brackets
}

/**
 * Validate inputs and generate warnings
 */
function validateInputs(state: CalculatorInputs): ValidationWarning[] {
  const warnings: ValidationWarning[] = []

  // Retirement contribution warnings
  const maxRetirementByPercentage = state.grossIncomeZAR * 0.275
  const maxRetirementAnnual = 350000 / 12
  const maxRetirement = Math.min(maxRetirementAnnual, maxRetirementByPercentage)

  if (state.retirementContribution > maxRetirement) {
    warnings.push({
      field: 'retirementContribution',
      message: `Retirement contribution exceeds the deductible limit of ${Math.round(maxRetirement).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}. Only ${Math.round(maxRetirement).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })} will be deducted.`,
      severity: 'warning',
    })
  }

  // Office size validation
  if (state.officeSizeSqm > state.apartmentSizeSqm && state.apartmentSizeSqm > 0) {
    warnings.push({
      field: 'officeSizeSqm',
      message: 'Office size exceeds apartment size. Please check your inputs.',
      severity: 'error',
    })
  }

  // Home office percentage warning
  const officeFrac = state.apartmentSizeSqm > 0 ? state.officeSizeSqm / state.apartmentSizeSqm : 0
  if (officeFrac > 0.5) {
    warnings.push({
      field: 'officeSizeSqm',
      message: 'Office space is more than 50% of your home. SARS may require additional documentation for this claim.',
      severity: 'info',
    })
  }

  // PBO donation limit (10% of taxable income before donations)
  const incomeBeforeDonations = state.grossIncomeZAR
  const maxPBODonation = incomeBeforeDonations * 0.1

  if (state.donationsToPBO > maxPBODonation) {
    warnings.push({
      field: 'donationsToPBO',
      message: `PBO donations may exceed the 10% deductible limit. Maximum deductible: ${Math.round(maxPBODonation).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}`,
      severity: 'warning',
    })
  }

  return warnings
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      // Default values
      ...defaultInputs,
      ...defaultCalculated,

      // Basic input actions
      setGrossIncomeZAR: (value) => {
        set({ grossIncomeZAR: value })
        get().calculateResults()
      },
      setRetirementContribution: (value) => {
        set({ retirementContribution: value })
        get().calculateResults()
      },
      setMedicalBeneficiaries: (value) => {
        set({ medicalBeneficiaries: value })
        get().calculateResults()
      },
      setRent: (value) => {
        set({ rent: value })
        get().calculateResults()
      },
      setApartmentSizeSqm: (value) => {
        set({ apartmentSizeSqm: value })
        get().calculateResults()
      },
      setOfficeSizeSqm: (value) => {
        set({ officeSizeSqm: value })
        get().calculateResults()
      },
      setUtilities: (value) => {
        set({ utilities: value })
        get().calculateResults()
      },
      setInternet: (value) => {
        set({ internet: value })
        get().calculateResults()
      },
      setDonationsToPBO: (value) => {
        set({ donationsToPBO: value })
        get().calculateResults()
      },

      addOtherExpense: (expense) => {
        set((state) => ({
          otherExpenses: [...state.otherExpenses, expense],
        }))
        get().calculateResults()
      },

      removeOtherExpense: (id) => {
        set((state) => ({
          otherExpenses: state.otherExpenses.filter((expense) => expense.id !== id),
        }))
        get().calculateResults()
      },

      addDepreciation: (item) => {
        set((state) => ({
          depreciation: [...state.depreciation, item],
        }))
        get().calculateResults()
      },

      removeDepreciation: (id) => {
        set((state) => ({
          depreciation: state.depreciation.filter((item) => item.id !== id),
        }))
        get().calculateResults()
      },

      // VAT actions
      setVATRegistered: (value) => {
        set({ isVATRegistered: value })
        get().calculateResults()
      },

      setVATRate: (value) => {
        set({ vatRate: value })
        get().calculateResults()
      },

      // Settings actions
      setInputMode: (mode) => {
        set({ inputMode: mode })
      },

      setShowCalculationBreakdown: (show) => {
        set({ showCalculationBreakdown: show })
      },

      // Scenario actions
      saveScenario: (name) => {
        const state = get()
        const scenario: Scenario = {
          id: Date.now().toString(),
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
          data: {
            grossIncomeZAR: state.grossIncomeZAR,
            retirementContribution: state.retirementContribution,
            medicalBeneficiaries: state.medicalBeneficiaries,
            rent: state.rent,
            apartmentSizeSqm: state.apartmentSizeSqm,
            officeSizeSqm: state.officeSizeSqm,
            utilities: state.utilities,
            internet: state.internet,
            donationsToPBO: state.donationsToPBO,
            otherExpenses: state.otherExpenses,
            depreciation: state.depreciation,
            isVATRegistered: state.isVATRegistered,
            vatRate: state.vatRate,
            inputMode: state.inputMode,
            showCalculationBreakdown: state.showCalculationBreakdown,
          },
        }

        set((state) => ({
          scenarios: [...state.scenarios, scenario],
          currentScenarioId: scenario.id,
        }))
      },

      loadScenario: (id) => {
        const state = get()
        const scenario = state.scenarios.find((s) => s.id === id)

        if (scenario) {
          set({
            ...scenario.data,
            currentScenarioId: id,
          })
          get().calculateResults()
        }
      },

      deleteScenario: (id) => {
        set((state) => ({
          scenarios: state.scenarios.filter((s) => s.id !== id),
          currentScenarioId: state.currentScenarioId === id ? null : state.currentScenarioId,
        }))
      },

      updateScenarioName: (id, name) => {
        set((state) => ({
          scenarios: state.scenarios.map((s) =>
            s.id === id ? { ...s, name, updatedAt: new Date() } : s
          ),
        }))
      },

      clearAll: () => {
        set({
          ...defaultInputs,
          ...defaultCalculated,
          currentScenarioId: null,
        })
      },

      // Calculate all results
      calculateResults: () => {
        const state = get()

        // Validate inputs
        const warnings = validateInputs(state)

        // Calculate office fraction
        const officeFrac = state.apartmentSizeSqm > 0 ? state.officeSizeSqm / state.apartmentSizeSqm : 0

        // Calculate allowed retirement contribution
        const maxRetirementByPercentage = state.grossIncomeZAR * 0.275
        const maxRetirementAnnual = 350000 / 12
        const allowedRet = Math.min(state.retirementContribution, Math.min(maxRetirementAnnual, maxRetirementByPercentage))

        // Calculate deductible expenses
        const dedRent = state.rent * officeFrac
        const dedUtilities = state.utilities * officeFrac
        const dedInternet = state.internet

        // Calculate totals
        const otherTotal = state.otherExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        const deprTotal = state.depreciation.reduce((sum, item) => sum + item.amount, 0)

        // Calculate allowed PBO donations (max 10% of taxable income before donations)
        const incomeBeforeDonations = state.grossIncomeZAR - (allowedRet + dedRent + dedUtilities + dedInternet + otherTotal + deprTotal)
        const maxPBODonation = incomeBeforeDonations * 0.1
        const allowedDonations = Math.min(state.donationsToPBO, maxPBODonation)

        // Calculate total deductions
        const totalDeductions = allowedRet + dedRent + dedUtilities + dedInternet + otherTotal + allowedDonations + deprTotal

        // Calculate taxable income
        const taxableMonthly = Math.max(0, state.grossIncomeZAR - totalDeductions)
        const taxableAnnual = taxableMonthly * 12

        // Calculate tax breakdown
        const taxBreakdown = calculateTaxBreakdown(taxableAnnual)
        const annualTax = taxBreakdown.reduce((sum, bracket) => sum + bracket.amount, 0)

        // Calculate monthly tax before credits
        const monthlyTaxPreCredit = annualTax / 12

        // Calculate medical tax credit
        let medicalCredit = 0
        if (state.medicalBeneficiaries === 0) {
          medicalCredit = 0
        } else if (state.medicalBeneficiaries === 1) {
          medicalCredit = 364
        } else if (state.medicalBeneficiaries === 2) {
          medicalCredit = 728
        } else {
          medicalCredit = 728 + 246 * (state.medicalBeneficiaries - 2)
        }

        // Calculate monthly PAYE
        const monthlyPAYE = Math.max(monthlyTaxPreCredit - medicalCredit, 0)

        // Calculate net income
        const netMonthly = state.grossIncomeZAR - monthlyPAYE
        const netAnnual = netMonthly * 12

        // Calculate effective tax rate
        const effectiveRate = state.grossIncomeZAR > 0 ? monthlyPAYE / state.grossIncomeZAR : 0

        // Calculate provisional tax payments
        // First payment: End of August (50% of estimated annual tax)
        const provisionalTaxFirstPayment = annualTax * 0.5
        // Second payment: End of February (Remaining 50% or top-up)
        const provisionalTaxSecondPayment = annualTax * 0.5
        // Third payment (if applicable): Within 7 months of year end
        const provisionalTaxThirdPayment = 0 // Usually 0 unless there's a shortfall

        // Calculate VAT if registered
        let outputVAT = 0
        let inputVAT = 0
        let netVATPayable = 0

        if (state.isVATRegistered) {
          // Output VAT (on income)
          outputVAT = (state.grossIncomeZAR * 12) * (state.vatRate / 100)

          // Input VAT (on expenses)
          const vatableExpenses = dedRent + dedUtilities + dedInternet + otherTotal + deprTotal
          inputVAT = (vatableExpenses * 12) * (state.vatRate / (100 + state.vatRate))

          // Net VAT payable
          netVATPayable = outputVAT - inputVAT
        }

        // Update state with all calculated values
        set({
          officeFrac,
          allowedRet,
          dedRent,
          dedUtilities,
          dedInternet,
          otherTotal,
          deprTotal,
          totalDeductions,
          taxableMonthly,
          taxableAnnual,
          annualTax,
          monthlyTaxPreCredit,
          medicalCredit,
          monthlyPAYE,
          netMonthly,
          netAnnual,
          effectiveRate,
          provisionalTaxFirstPayment,
          provisionalTaxSecondPayment,
          provisionalTaxThirdPayment,
          outputVAT,
          inputVAT,
          netVATPayable,
          warnings,
          taxBreakdown,
        })
      },
    }),
    {
      name: 'calculator-storage',
      partialize: (state) => ({
        grossIncomeZAR: state.grossIncomeZAR,
        retirementContribution: state.retirementContribution,
        medicalBeneficiaries: state.medicalBeneficiaries,
        rent: state.rent,
        apartmentSizeSqm: state.apartmentSizeSqm,
        officeSizeSqm: state.officeSizeSqm,
        utilities: state.utilities,
        internet: state.internet,
        donationsToPBO: state.donationsToPBO,
        otherExpenses: state.otherExpenses,
        depreciation: state.depreciation,
        isVATRegistered: state.isVATRegistered,
        vatRate: state.vatRate,
        inputMode: state.inputMode,
        showCalculationBreakdown: state.showCalculationBreakdown,
        scenarios: state.scenarios,
        currentScenarioId: state.currentScenarioId,
      }),
    }
  )
)
