"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCalculatorStore } from "@/lib/store"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useMobile } from "@/hooks/use-mobile"

export function Dashboard() {
  const {
    grossIncomeZAR,
    totalDeductions,
    taxableMonthly,
    netMonthly,
    effectiveRate,
    monthlyPAYE,
    allowedRet,
    dedRent,
    dedUtilities,
    dedInternet,
  } = useCalculatorStore()

  const isMobile = useMobile()

  // Data for pie chart
  const pieData = [
    { name: "Take-home Pay", value: netMonthly, color: "#10b981" },
    { name: "PAYE", value: monthlyPAYE, color: "#ef4444" },
    { name: "Deductions", value: totalDeductions, color: "#3b82f6" },
  ]

  // Data for column chart
  const columnData = [
    { name: "Retirement", value: allowedRet },
    { name: "Rent", value: dedRent },
    { name: "Utilities", value: dedUtilities },
    { name: "Internet", value: dedInternet },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        <Card>
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium">Gross Income (mth)</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <p className="text-lg md:text-2xl font-bold">{formatCurrency(grossIncomeZAR)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium">Total Deductions (mth)</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <p className="text-lg md:text-2xl font-bold">{formatCurrency(totalDeductions)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium">Taxable Income (mth)</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <p className="text-lg md:text-2xl font-bold">{formatCurrency(taxableMonthly)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium">Take-home Pay (mth)</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <p className="text-lg md:text-2xl font-bold">{formatCurrency(netMonthly)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium">Effective Tax Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <p className="text-lg md:text-2xl font-bold">{formatPercentage(effectiveRate)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-base md:text-lg">Income Breakdown</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? "h-[250px]" : "h-[300px]"}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={isMobile ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    isMobile ? `${(percent * 100).toFixed(0)}%` : `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend
                  layout={isMobile ? "horizontal" : "vertical"}
                  verticalAlign={isMobile ? "bottom" : "middle"}
                  align={isMobile ? "center" : "right"}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-base md:text-lg">Deduction Breakdown</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? "h-[250px]" : "h-[300px]"}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={columnData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis tickFormatter={(value) => `R${value / 1000}k`} tick={{ fontSize: isMobile ? 10 : 12 }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
