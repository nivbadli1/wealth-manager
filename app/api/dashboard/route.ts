import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Fetch all properties
    const properties = await prisma.property.findMany({
      include: {
        rentalIncomes: true,
        propertyExpenses: true,
        mortgages: true,
      },
    })

    // Fetch all investments
    const investments = await prisma.investment.findMany()

    // Fetch all income and expenses
    const income = await prisma.income.findMany()
    const expenses = await prisma.expense.findMany()

    // Calculate dashboard metrics
    const totalProperties = properties.length
    const totalPropertiesValue = properties.reduce((sum, property) => sum + property.currentValue, 0)
    const totalInvestmentsValue = investments.reduce((sum, investment) => sum + investment.currentValue, 0)
    const netWorth = totalPropertiesValue + totalInvestmentsValue

    // Calculate monthly rental income
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyRentalIncome = properties.reduce((sum, property) => {
      const propertyRentals = property.rentalIncomes.filter(rental => {
        const rentalDate = new Date(rental.date)
        return rentalDate.getMonth() === currentMonth && rentalDate.getFullYear() === currentYear
      })
      return sum + propertyRentals.reduce((rentalSum, rental) => rentalSum + rental.amount, 0)
    }, 0)

    // Calculate monthly expenses
    const monthlyExpenses = properties.reduce((sum, property) => {
      const propertyExpenses = property.propertyExpenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
      })
      return sum + propertyExpenses.reduce((expenseSum, expense) => expenseSum + expense.amount, 0)
    }, 0)

    // Calculate growth percentages (mock data for now)
    const monthlyGrowth = 12.5
    const propertyGrowth = 8.3
    const investmentGrowth = 15.2

    // Get rented properties count
    const rentedProperties = properties.filter(property => property.status === 'rented').length

    // Prepare chart data
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(currentYear, i, 1)
      const monthRentals = properties.reduce((sum, property) => {
        const propertyRentals = property.rentalIncomes.filter(rental => {
          const rentalDate = new Date(rental.date)
          return rentalDate.getMonth() === i && rentalDate.getFullYear() === currentYear
        })
        return sum + propertyRentals.reduce((rentalSum, rental) => rentalSum + rental.amount, 0)
      }, 0)
      
      const monthExpenses = properties.reduce((sum, property) => {
        const propertyExpenses = property.propertyExpenses.filter(expense => {
          const expenseDate = new Date(expense.date)
          return expenseDate.getMonth() === i && expenseDate.getFullYear() === currentYear
        })
        return sum + propertyExpenses.reduce((expenseSum, expense) => expenseSum + expense.amount, 0)
      }, 0)

      return {
        month: month.toLocaleDateString('he-IL', { month: 'short' }),
        income: monthRentals,
        expenses: monthExpenses,
        profit: monthRentals - monthExpenses,
      }
    })

    // Property type distribution
    const propertyTypeDistribution = properties.reduce((acc, property) => {
      acc[property.propertyType] = (acc[property.propertyType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Property status distribution
    const propertyStatusDistribution = properties.reduce((acc, property) => {
      acc[property.status] = (acc[property.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const dashboardData = {
      kpi: {
        netWorth,
        monthlyRentalIncome,
        totalProperties,
        totalInvestmentsValue,
        monthlyExpenses,
        rentedProperties,
        monthlyGrowth,
        propertyGrowth,
        investmentGrowth,
      },
      charts: {
        monthlyData,
        propertyTypeDistribution,
        propertyStatusDistribution,
      },
      recentActivity: {
        properties: properties.slice(0, 5).map(property => ({
          id: property.id,
          name: property.name,
          type: 'property',
          action: 'updated',
          date: property.updatedAt,
        })),
        income: income.slice(0, 5).map(inc => ({
          id: inc.id,
          name: `הכנסה: ${inc.description}`,
          type: 'income',
          action: 'added',
          date: inc.createdAt,
        })),
        expenses: expenses.slice(0, 5).map(exp => ({
          id: exp.id,
          name: `הוצאה: ${exp.description}`,
          type: 'expense',
          action: 'added',
          date: exp.createdAt,
        })),
      },
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
} 