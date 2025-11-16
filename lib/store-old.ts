"use client"

import { create } from "zustand"

export interface Expense {
  id: string
  label: string
  amount: number
}

interface CalculatorState {
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

  // Actions
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
  calculateResults: () => void
  clearAll: () => void // Action to clear all inputs
}

// Default values for the calculator
const defaultValues = {
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
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  // Default values for basic inputs
  ...defaultValues,

  // Actions for updating basic inputs
  setGrossIncomeZAR: (value) => set({ grossIncomeZAR: value }),
  setRetirementContribution: (value) => set({ retirementContribution: value }),
  setMedicalBeneficiaries: (value) => set({ medicalBeneficiaries: value }),
  setRent: (value) => set({ rent: value }),
  setApartmentSizeSqm: (value) => set({ apartmentSizeSqm: value }),
  setOfficeSizeSqm: (value) => set({ officeSizeSqm: value }),
  setUtilities: (value) => set({ utilities: value }),
  setInternet: (value) => set({ internet: value }),
  setDonationsToPBO: (value) => set({ donationsToPBO: value }),

  addOtherExpense: (expense) =>
    set((state) => ({
      otherExpenses: [...state.otherExpenses, expense],
    })),

  removeOtherExpense: (id) =>
    set((state) => ({
      otherExpenses: state.otherExpenses.filter((expense) => expense.id !== id),
    })),

  addDepreciation: (item) =>
    set((state) => ({
      depreciation: [...state.depreciation, item],
    })),

  removeDepreciation: (id) =>
    set((state) => ({
      depreciation: state.depreciation.filter((item) => item.id !== id),
    })),

  // Improved clearAll function to ensure complete reset
  clearAll: () => {
    // Reset to default values in a single state update to prevent partial updates
    set({ ...JSON.parse(JSON.stringify(defaultValues)) })
  },

  // Calculate all results based on inputs
  calculateResults: () => {
    const state = get()

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

    // Calculate totals for other expenses and depreciation
    const otherTotal = state.otherExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const deprTotal = state.depreciation.reduce((sum, item) => sum + item.amount, 0)

    // Calculate total deductions
    const totalDeductions =
      allowedRet + dedRent + dedUtilities + dedInternet + otherTotal + state.donationsToPBO + deprTotal

    // Calculate taxable income
    const taxableMonthly = Math.max(0, state.grossIncomeZAR - totalDeductions)
    const taxableAnnual = taxableMonthly * 12

    // Calculate annual tax using SARS 2025/26 brackets
    let annualTax = 0
    if (taxableAnnual <= 237100) {
      annualTax = taxableAnnual * 0.18
    } else if (taxableAnnual <= 370500) {
      annualTax = 42678 + (taxableAnnual - 237100) * 0.26
    } else if (taxableAnnual <= 512800) {
      annualTax = 77362 + (taxableAnnual - 370500) * 0.31
    } else if (taxableAnnual <= 673000) {
      annualTax = 121475 + (taxableAnnual - 512800) * 0.36
    } else if (taxableAnnual <= 857900) {
      annualTax = 179147 + (taxableAnnual - 673000) * 0.39
    } else if (taxableAnnual <= 1817000) {
      annualTax = 251258 + (taxableAnnual - 857900) * 0.41
    } else {
      annualTax = 644489 + (taxableAnnual - 1817000) * 0.45
    }

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
    })
  },
}))
