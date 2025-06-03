"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCalculatorStore } from "@/lib/store"
import { Download, FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import { utils } from "xlsx"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export function ExportOptions() {
  const store = useCalculatorStore()
  const isMobile = useMobile()

  const exportToExcel = async () => {
    // Create workbook
    const wb = utils.book_new()

    // Create main data sheet
    const mainData = [
      ["JS Labs: Geld Calculator"],
      [""],
      ["Basic Inputs", "Value"],
      ["Gross Income (ZAR)", store.grossIncomeZAR],
      ["Retirement Contribution", store.retirementContribution],
      ["Medical Beneficiaries", store.medicalBeneficiaries],
      ["Rent", store.rent],
      ["Apartment Size (sqm)", store.apartmentSizeSqm],
      ["Office Size (sqm)", store.officeSizeSqm],
      ["Utilities", store.utilities],
      ["Internet", store.internet],
      ["Donations to PBO", store.donationsToPBO],
      [""],
      ["Calculated Values", "Value"],
      ["Office Fraction", store.officeFrac],
      ["Allowed Retirement", store.allowedRet],
      ["Deductible Rent", store.dedRent],
      ["Deductible Utilities", store.dedUtilities],
      ["Deductible Internet", store.dedInternet],
      ["Total Deductions", store.totalDeductions],
      ["Taxable Monthly", store.taxableMonthly],
      ["Taxable Annual", store.taxableAnnual],
      ["Annual Tax", store.annualTax],
      ["Monthly Tax Pre-Credit", store.monthlyTaxPreCredit],
      ["Medical Credit", store.medicalCredit],
      ["Monthly PAYE", store.monthlyPAYE],
      ["Net Monthly", store.netMonthly],
      ["Net Annual", store.netAnnual],
      ["Effective Tax Rate", store.effectiveRate],
    ]

    const mainWs = utils.aoa_to_sheet(mainData)
    utils.book_append_sheet(wb, mainWs, "Summary")

    // Create other expenses sheet
    if (store.otherExpenses.length > 0) {
      const expensesData = [
        ["Other Deductible Expenses"],
        [""],
        ["Description", "Amount"],
        ...store.otherExpenses.map((expense) => [expense.label, expense.amount]),
        ["", ""],
        ["Total", store.otherExpenses.reduce((sum, expense) => sum + expense.amount, 0)],
      ]
      const expensesWs = utils.aoa_to_sheet(expensesData)
      utils.book_append_sheet(wb, expensesWs, "Other Expenses")
    }

    // Create depreciation sheet
    if (store.depreciation.length > 0) {
      const depreciationData = [
        ["Wear-and-Tear Depreciation"],
        [""],
        ["Asset Description", "Monthly Amount"],
        ...store.depreciation.map((item) => [item.label, item.amount]),
        ["", ""],
        ["Total", store.depreciation.reduce((sum, item) => sum + item.amount, 0)],
      ]
      const depreciationWs = utils.aoa_to_sheet(depreciationData)
      utils.book_append_sheet(wb, depreciationWs, "Depreciation")
    }

    // Generate Excel file as an array buffer
    const excelBuffer = utils.write(wb, { bookType: "xlsx", type: "array" })

    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

    // Create a download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "geld-calculator.xlsx"

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToPdf = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Set up some constants
    const margin = 50
    const lineHeight = 20
    let y = 800 // Start from top

    // Helper function to add text
    const addText = (text, isBold = false, x = margin) => {
      const selectedFont = isBold ? boldFont : font
      page.drawText(text, {
        x,
        y,
        size: 10,
        font: selectedFont,
        color: rgb(0, 0, 0),
      })
      y -= lineHeight
    }

    // Add title
    addText("JS Labs: Geld Calculator", true)
    addText(`Generated on: ${new Date().toLocaleDateString()}`)
    y -= lineHeight

    // Add summary section
    addText("Summary", true)
    addText(`Gross Income (monthly): ${formatCurrency(store.grossIncomeZAR)}`)
    addText(`Total Deductions: ${formatCurrency(store.totalDeductions)}`)
    addText(`Taxable Income (monthly): ${formatCurrency(store.taxableMonthly)}`)
    addText(`Take-home Pay (monthly): ${formatCurrency(store.netMonthly)}`)
    addText(`Effective Tax Rate: ${formatPercentage(store.effectiveRate)}`)
    y -= lineHeight

    // Add basic inputs section
    addText("Basic Inputs", true)
    addText(`Retirement Contribution: ${formatCurrency(store.retirementContribution)}`)
    addText(`Medical Beneficiaries: ${store.medicalBeneficiaries}`)
    addText(`Rent: ${formatCurrency(store.rent)}`)
    addText(`Apartment Size: ${store.apartmentSizeSqm} sqm`)
    addText(`Office Size: ${store.officeSizeSqm} sqm`)
    addText(`Utilities: ${formatCurrency(store.utilities)}`)
    addText(`Internet: ${formatCurrency(store.internet)}`)
    addText(`Donations to PBO: ${formatCurrency(store.donationsToPBO)}`)
    y -= lineHeight

    // Add other expenses section if any
    if (store.otherExpenses.length > 0) {
      addText("Other Deductible Expenses", true)
      store.otherExpenses.forEach((expense) => {
        addText(`${expense.label}: ${formatCurrency(expense.amount)}`)
      })
      y -= lineHeight
    }

    // Add depreciation section if any
    if (store.depreciation.length > 0) {
      addText("Wear-and-Tear Depreciation", true)
      store.depreciation.forEach((item) => {
        addText(`${item.label}: ${formatCurrency(item.amount)}`)
      })
      y -= lineHeight
    }

    // Add tax calculation details
    addText("Tax Calculation Details", true)
    addText(`Taxable Annual Income: ${formatCurrency(store.taxableAnnual)}`)
    addText(`Annual Tax: ${formatCurrency(store.annualTax)}`)
    addText(`Monthly Tax (before credits): ${formatCurrency(store.monthlyTaxPreCredit)}`)
    addText(`Medical Tax Credit: ${formatCurrency(store.medicalCredit)}`)
    addText(`Monthly PAYE: ${formatCurrency(store.monthlyPAYE)}`)

    // Save the PDF
    const pdfBytes = await pdfDoc.save()

    // Create a blob and download
    const blob = new Blob([pdfBytes], { type: "application/pdf" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "geld-calculator.pdf"
    link.click()
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Export Options</CardTitle>
        <CardDescription>Export your calculation results to Excel or PDF</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 sm:h-5 sm:w-5" />
                Excel Export
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Export all data to an Excel spreadsheet</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
              <Button onClick={exportToExcel} className="w-full gap-2 text-xs sm:text-sm">
                <Download className="h-3 w-3 sm:h-4 sm:w-4" /> Download Excel
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <FilePdf className="h-4 w-4 sm:h-5 sm:w-5" />
                PDF Export
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Export a summary report to PDF</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
              <Button onClick={exportToPdf} className="w-full gap-2 text-xs sm:text-sm">
                <Download className="h-3 w-3 sm:h-4 sm:w-4" /> Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
