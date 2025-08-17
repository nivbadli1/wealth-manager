import { Property, RentalIncome, PropertyExpense, Investment, Income, Expense } from '@prisma/client'

// Property calculations
export function calculatePropertyROI(
  property: Property,
  rentalIncomes: RentalIncome[],
  expenses: PropertyExpense[]
): number {
  const totalRentalIncome = rentalIncomes.reduce((sum, income) => sum + income.amount, 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const netIncome = totalRentalIncome - totalExpenses
  
  if (property.purchasePrice === 0) return 0
  return (netIncome / property.purchasePrice) * 100
}

export function calculatePropertyAppreciation(property: Property): number {
  if (property.purchasePrice === 0) return 0
  return ((property.currentValue - property.purchasePrice) / property.purchasePrice) * 100
}

export function calculatePropertyTotalReturn(
  property: Property,
  rentalIncomes: RentalIncome[],
  expenses: PropertyExpense[]
): number {
  const appreciation = calculatePropertyAppreciation(property)
  const rentalROI = calculatePropertyROI(property, rentalIncomes, expenses)
  return appreciation + rentalROI
}

// Investment calculations
export function calculateInvestmentROI(investment: Investment): number {
  if (investment.initialAmount === 0) return 0
  return ((investment.currentValue - investment.initialAmount) / investment.initialAmount) * 100
}

export function calculateAnnualizedReturn(
  initialAmount: number,
  currentValue: number,
  startDate: Date,
  endDate: Date = new Date()
): number {
  const totalReturn = (currentValue - initialAmount) / initialAmount
  const yearsDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  
  if (yearsDiff <= 0) return totalReturn * 100
  return (Math.pow(1 + totalReturn, 1 / yearsDiff) - 1) * 100
}

// Portfolio calculations
export function calculateTotalAssetValue(
  properties: Property[],
  investments: Investment[]
): number {
  const propertiesValue = properties.reduce((sum, property) => sum + property.currentValue, 0)
  const investmentsValue = investments.reduce((sum, investment) => sum + investment.currentValue, 0)
  return propertiesValue + investmentsValue
}

export function calculateNetWorth(
  properties: Property[],
  investments: Investment[],
  totalDebt: number = 0
): number {
  const totalAssets = calculateTotalAssetValue(properties, investments)
  return totalAssets - totalDebt
}

// Cash flow calculations
export function calculateMonthlyNetCashFlow(
  monthlyIncome: Income[],
  monthlyExpenses: Expense[]
): number {
  const totalIncome = monthlyIncome.reduce((sum, income) => sum + income.amount, 0)
  const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  return totalIncome - totalExpenses
}

export function calculateMonthlyCashFlowByCategory(
  incomes: Income[],
  expenses: Expense[]
): {
  incomeByCategory: Record<string, number>
  expensesByCategory: Record<string, number>
} {
  const incomeByCategory: Record<string, number> = {}
  const expensesByCategory: Record<string, number> = {}

  incomes.forEach(income => {
    incomeByCategory[income.category] = (incomeByCategory[income.category] || 0) + income.amount
  })

  expenses.forEach(expense => {
    expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount
  })

  return { incomeByCategory, expensesByCategory }
}

// Mortgage calculations
export function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12
  const numPayments = years * 12
  
  if (monthlyRate === 0) return principal / numPayments
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1)
}

export function calculateMortgageBalance(
  originalAmount: number,
  monthlyPayment: number,
  annualRate: number,
  monthsPaid: number
): number {
  const monthlyRate = annualRate / 100 / 12
  
  if (monthlyRate === 0) return originalAmount - (monthlyPayment * monthsPaid)
  
  const balance = originalAmount * Math.pow(1 + monthlyRate, monthsPaid) - 
                  monthlyPayment * ((Math.pow(1 + monthlyRate, monthsPaid) - 1) / monthlyRate)
  
  return Math.max(0, balance)
}

// Performance metrics
export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate: number = 2 // Default 2% risk-free rate
): number {
  if (returns.length === 0) return 0
  
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  const standardDeviation = Math.sqrt(variance)
  
  if (standardDeviation === 0) return 0
  return (avgReturn - riskFreeRate) / standardDeviation
}

export function calculateMaxDrawdown(values: number[]): number {
  if (values.length === 0) return 0
  
  let maxDrawdown = 0
  let peak = values[0]
  
  values.forEach(value => {
    if (value > peak) peak = value
    const drawdown = (peak - value) / peak * 100
    if (drawdown > maxDrawdown) maxDrawdown = drawdown
  })
  
  return maxDrawdown
}

// Utility functions for date-based calculations
export function getDataForDateRange<T extends { date: Date | string }>(
  data: T[],
  startDate: Date,
  endDate: Date
): T[] {
  return data.filter(item => {
    const itemDate = typeof item.date === 'string' ? new Date(item.date) : item.date
    return itemDate >= startDate && itemDate <= endDate
  })
}

export function groupDataByMonth<T extends { date: Date | string; amount: number }>(
  data: T[]
): Record<string, number> {
  const groupedData: Record<string, number> = {}
  
  data.forEach(item => {
    const date = typeof item.date === 'string' ? new Date(item.date) : item.date
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    groupedData[monthKey] = (groupedData[monthKey] || 0) + item.amount
  })
  
  return groupedData
}

export function calculateCompoundGrowth(
  initialValue: number,
  annualGrowthRate: number,
  years: number
): number {
  return initialValue * Math.pow(1 + annualGrowthRate / 100, years)
}

// Tax calculations (basic Israeli tax brackets)
export function calculateIncomeTax(annualIncome: number): number {
  const taxBrackets = [
    { min: 0, max: 75960, rate: 10 },
    { min: 75960, max: 108840, rate: 14 },
    { min: 108840, max: 174960, rate: 20 },
    { min: 174960, max: 241680, rate: 31 },
    { min: 241680, max: 498360, rate: 35 },
    { min: 498360, max: 663240, rate: 47 },
    { min: 663240, max: Infinity, rate: 50 }
  ]
  
  let tax = 0
  let remainingIncome = annualIncome
  
  for (const bracket of taxBrackets) {
    if (remainingIncome <= 0) break
    
    const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min)
    tax += taxableInThisBracket * (bracket.rate / 100)
    remainingIncome -= taxableInThisBracket
  }
  
  return tax
}