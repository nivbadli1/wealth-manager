import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { timeRange, format } = await request.json()
    
    // Calculate date range
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

    // Fetch comprehensive data
    const [properties, investments, income, expenses] = await Promise.all([
      prisma.property.findMany({
        include: {
          rentalIncomes: {
            where: {
              date: {
                gte: startDate
              }
            }
          },
          propertyExpenses: {
            where: {
              date: {
                gte: startDate
              }
            }
          },
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

    // Calculate summary
    const totalPropertyValue = properties.reduce((sum, prop) => sum + (prop.currentValue || prop.purchasePrice), 0)
    const totalInvestmentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
    const totalAssets = totalPropertyValue + totalInvestmentValue
    const totalDebt = properties.reduce((sum, prop) => sum + prop.mortgages.reduce((ms, m) => ms + m.currentBalance, 0), 0)
    const netWorth = totalAssets - totalDebt
    
    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0) + 
      properties.reduce((sum, prop) => sum + prop.rentalIncomes.reduce((rs, r) => rs + r.amount, 0), 0)
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const netCashFlow = totalIncome - totalExpenses

    const reportData = {
      reportInfo: {
        generatedAt: new Date().toISOString(),
        timeRange,
        period: `${startDate.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`
      },
      summary: {
        netWorth,
        totalAssets,
        totalDebt,
        totalIncome,
        totalExpenses,
        netCashFlow,
        debtToEquityRatio: totalAssets > 0 ? totalDebt / totalAssets : 0
      },
      properties: properties.map(prop => ({
        id: prop.id,
        name: prop.name,
        type: prop.propertyType,
        address: prop.address,
        purchasePrice: prop.purchasePrice,
        currentValue: prop.currentValue,
        purchaseDate: prop.purchaseDate.toISOString(),
        status: prop.status,
        rentalIncomes: prop.rentalIncomes.map(rental => ({
          amount: rental.amount,
          date: rental.date.toISOString(),
          tenantName: rental.tenantName
        })),
        expenses: prop.propertyExpenses.map(expense => ({
          amount: expense.amount,
          category: expense.category,
          date: expense.date.toISOString(),
          description: expense.description
        })),
        mortgages: prop.mortgages.map(mortgage => ({
          bank: mortgage.bank,
          originalAmount: mortgage.originalAmount,
          currentBalance: mortgage.currentBalance,
          interestRate: mortgage.interestRate,
          monthlyPayment: mortgage.monthlyPayment
        }))
      })),
      investments: investments.map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type,
        initialAmount: inv.initialAmount,
        currentValue: inv.currentValue,
        date: inv.date.toISOString(),
        returnRate: inv.returnRate
      })),
      income: income.map(inc => ({
        id: inc.id,
        source: inc.source,
        amount: inc.amount,
        date: inc.date.toISOString(),
        description: inc.description
      })),
      expenses: expenses.map(exp => ({
        id: exp.id,
        category: exp.category,
        amount: exp.amount,
        date: exp.date.toISOString(),
        description: exp.description
      }))
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvContent = generateCSV(reportData)
      
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="financial-report-${timeRange}-${now.toISOString().split('T')[0]}.csv"`
        }
      })
    } else {
      // Return JSON format
      const jsonContent = JSON.stringify(reportData, null, 2)
      
      return new NextResponse(jsonContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="financial-report-${timeRange}-${now.toISOString().split('T')[0]}.json"`
        }
      })
    }

  } catch (error) {
    console.error('Export API error:', error)
    return NextResponse.json(
      { error: 'Failed to export report' },
      { status: 500 }
    )
  }
}

interface ReportData {
  reportInfo: {
    generatedAt: string;
    timeRange: string;
    period: string;
  };
  summary: {
    netWorth: number;
    totalAssets: number;
    totalDebt: number;
    totalIncome: number;
    totalExpenses: number;
    netCashFlow: number;
    debtToEquityRatio: number;
  };
  properties: Array<{
    name: string;
    type: string;
    address: string;
    purchasePrice: number;
    currentValue: number;
    purchaseDate: string;
    status: string;
  }>;
  investments: Array<{
    name: string;
    type: string;
    initialAmount: number;
    currentValue: number;
    date: string;
    returnRate: number | null;
  }>;
  income: Array<{
    source: string;
    amount: number;
    date: string;
    description: string | null;
  }>;
  expenses: Array<{
    category: string;
    amount: number;
    date: string;
    description: string | null;
  }>;
}

function generateCSV(data: ReportData): string {
  const lines: string[] = []
  
  // Add header
  lines.push('Financial Report')
  lines.push(`Generated: ${data.reportInfo.generatedAt}`)
  lines.push(`Period: ${data.reportInfo.period}`)
  lines.push('')
  
  // Summary section
  lines.push('SUMMARY')
  lines.push('Metric,Value')
  lines.push(`Net Worth,${data.summary.netWorth}`)
  lines.push(`Total Assets,${data.summary.totalAssets}`)
  lines.push(`Total Debt,${data.summary.totalDebt}`)
  lines.push(`Total Income,${data.summary.totalIncome}`)
  lines.push(`Total Expenses,${data.summary.totalExpenses}`)
  lines.push(`Net Cash Flow,${data.summary.netCashFlow}`)
  lines.push(`Debt to Equity Ratio,${data.summary.debtToEquityRatio}`)
  lines.push('')
  
  // Properties section
  lines.push('PROPERTIES')
  lines.push('Name,Type,Address,Purchase Price,Current Value,Purchase Date,Status')
  data.properties.forEach((prop) => {
    lines.push(`"${prop.name}","${prop.type}","${prop.address}",${prop.purchasePrice},${prop.currentValue},"${prop.purchaseDate}","${prop.status}"`)
  })
  lines.push('')
  
  // Investments section
  lines.push('INVESTMENTS')
  lines.push('Name,Type,Initial Amount,Current Value,Date,Return Rate')
  data.investments.forEach((inv) => {
    lines.push(`"${inv.name}","${inv.type}",${inv.initialAmount},${inv.currentValue},"${inv.date}",${inv.returnRate}`)
  })
  lines.push('')
  
  // Income section
  lines.push('INCOME')
  lines.push('Source,Amount,Date,Description')
  data.income.forEach((inc) => {
    lines.push(`"${inc.source}",${inc.amount},"${inc.date}","${inc.description || ''}"`)
  })
  lines.push('')
  
  // Expenses section
  lines.push('EXPENSES')
  lines.push('Category,Amount,Date,Description')
  data.expenses.forEach((exp) => {
    lines.push(`"${exp.category}",${exp.amount},"${exp.date}","${exp.description || ''}"`)
  })
  
  return lines.join('\n')
}