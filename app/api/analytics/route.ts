import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '6m'
    
    // Calculate date range based on timeRange
    const now = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '1m':
        startDate.setMonth(now.getMonth() - 1)
        break
      case '3m':
        startDate.setMonth(now.getMonth() - 3)
        break
      case '6m':
        startDate.setMonth(now.getMonth() - 6)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 6)
    }

    // Fetch all data
    const [properties, investments, income, expenses] = await Promise.all([
      prisma.property.findMany({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        include: {
          rentalIncomes: true,
          propertyExpenses: true,
          mortgages: true
        }
      }),
      prisma.investment.findMany({
        where: {
          date: {
            gte: startDate
          }
        }
      }),
      prisma.income.findMany({
        where: {
          date: {
            gte: startDate
          }
        }
      }),
      prisma.expense.findMany({
        where: {
          date: {
            gte: startDate
          }
        }
      })
    ])

    // Calculate summary metrics
    const totalPropertyValue = properties.reduce((sum, prop) => sum + (prop.currentValue || prop.purchasePrice), 0)
    const totalInvestmentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
    const totalAssets = totalPropertyValue + totalInvestmentValue
    
    const totalPropertyMortgage = properties.reduce((sum, prop) => 
      sum + (prop.mortgages.reduce((mortgageSum, mortgage) => mortgageSum + mortgage.currentBalance, 0)), 0)
    const totalDebt = totalPropertyMortgage
    
    const netWorth = totalAssets - totalDebt
    
    // Calculate monthly cash flow
    const monthlyRentalIncome = properties.reduce((sum, prop) => 
      sum + prop.rentalIncomes.reduce((rentalSum, rental) => rentalSum + rental.amount, 0), 0)
    const monthlyIncome = income.reduce((sum, inc) => sum + inc.amount, 0) + monthlyRentalIncome
    const monthlyExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const monthlyCashFlow = monthlyIncome - monthlyExpenses
    
    const debtToEquityRatio = totalAssets > 0 ? totalDebt / totalAssets : 0

    // Prepare income by category
    const incomeByCategory: Record<string, number> = {}
    income.forEach(inc => {
      incomeByCategory[inc.source] = (incomeByCategory[inc.source] || 0) + inc.amount
    })
    incomeByCategory['השכרות'] = monthlyRentalIncome

    // Prepare expenses by category
    const expensesByCategory: Record<string, number> = {}
    expenses.forEach(exp => {
      expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + exp.amount
    })

    // Prepare monthly data
    const monthlyData: Record<string, number> = {}
    const monthlyExpenseData: Record<string, number> = {}
    const monthlyRentalData: Record<string, number> = {}

    // Group income by month
    income.forEach(inc => {
      const monthKey = inc.date.toISOString().substring(0, 7) // YYYY-MM format
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + inc.amount
    })

    // Group expenses by month
    expenses.forEach(exp => {
      const monthKey = exp.date.toISOString().substring(0, 7)
      monthlyExpenseData[monthKey] = (monthlyExpenseData[monthKey] || 0) + exp.amount
    })

    // Add rental income to monthly data
    properties.forEach(prop => {
      prop.rentalIncomes.forEach(rental => {
        const monthKey = rental.date.toISOString().substring(0, 7)
        monthlyRentalData[monthKey] = (monthlyRentalData[monthKey] || 0) + rental.amount
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + rental.amount
      })
    })

    // Prepare performance data
    const propertyPerformance = properties.map(prop => ({
      id: prop.id,
      title: prop.name,
      purchasePrice: prop.purchasePrice,
      currentValue: prop.currentValue || prop.purchasePrice,
      roi: prop.currentValue ? 
        ((prop.currentValue - prop.purchasePrice) / prop.purchasePrice * 100) : 0
    }))

    const investmentPerformance = investments.map(inv => ({
      id: inv.id,
      name: inv.name,
      initialAmount: inv.initialAmount,
      currentValue: inv.currentValue,
      roi: ((inv.currentValue - inv.initialAmount) / inv.initialAmount * 100)
    }))

    const analyticsData = {
      summary: {
        netWorth,
        totalAssets,
        totalDebt,
        monthlyCashFlow,
        debtToEquityRatio
      },
      performance: {
        properties: propertyPerformance,
        investments: investmentPerformance
      },
      cashFlow: {
        incomeByCategory,
        expensesByCategory,
        monthly: {
          income: monthlyData,
          expenses: monthlyExpenseData,
          rental: monthlyRentalData
        }
      },
      allocation: {
        properties: {
          value: totalPropertyValue,
          percentage: totalAssets > 0 ? (totalPropertyValue / totalAssets) * 100 : 0
        },
        investments: {
          value: totalInvestmentValue,
          percentage: totalAssets > 0 ? (totalInvestmentValue / totalAssets) * 100 : 0
        }
      },
      timeRange
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}