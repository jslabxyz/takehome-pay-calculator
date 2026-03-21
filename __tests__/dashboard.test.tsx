import { render, screen, cleanup } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { useCalculatorStore } from "@/lib/store"
import { Dashboard } from "@/components/dashboard"
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"

// Mock recharts to avoid SSR rendering issues
vi.mock("recharts", () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div />,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Legend: () => <div />,
}))

// Mock useMobile hook
vi.mock("@/hooks/use-mobile", () => ({
  useMobile: () => false,
}))

const getStore = () => useCalculatorStore.getState()

afterEach(() => {
  cleanup()
})

describe("Dashboard Component", () => {
  beforeEach(() => {
    getStore().clearAll()
  })

  test("renders all metric cards", () => {
    render(<Dashboard />)

    expect(screen.getByText(/Gross Income/)).toBeInTheDocument()
    expect(screen.getByText(/Total Deductions/)).toBeInTheDocument()
    expect(screen.getByText(/Taxable Income/)).toBeInTheDocument()
    expect(screen.getByText(/Take-home Pay/)).toBeInTheDocument()
    expect(screen.getByText(/Effective Tax Rate/)).toBeInTheDocument()
  })

  test("displays zero values when no income is set", () => {
    render(<Dashboard />)

    // Should show R 0,00 for all monetary values (en-ZA locale)
    const zeroValues = screen.getAllByText(/R\s*0,00/)
    expect(zeroValues.length).toBeGreaterThanOrEqual(4)
  })

  test("displays calculated values after income is set", () => {
    getStore().setGrossIncomeZAR(50000)
    getStore().calculateResults()

    render(<Dashboard />)

    // Should show the gross income value (en-ZA formats with spaces: R 50 000,00)
    // Multiple cards may show the same value (gross income = taxable income when no deductions)
    const matchingValues = screen.getAllByText(/50\s*000/)
    expect(matchingValues.length).toBeGreaterThanOrEqual(1)
  })

  test("renders chart containers", () => {
    getStore().setGrossIncomeZAR(50000)
    getStore().calculateResults()

    render(<Dashboard />)

    expect(screen.getByText("Income Breakdown")).toBeInTheDocument()
    expect(screen.getByText("Deduction Breakdown")).toBeInTheDocument()
  })

  test("updates when store values change", () => {
    const { unmount } = render(<Dashboard />)
    unmount()

    // Update store
    getStore().setGrossIncomeZAR(75000)
    getStore().setRetirementContribution(5000)
    getStore().setMedicalBeneficiaries(2)
    getStore().calculateResults()

    // Re-render with new values
    render(<Dashboard />)

    // Should reflect updated values
    expect(screen.getByText(/75\s*000/)).toBeInTheDocument()
  })
})
