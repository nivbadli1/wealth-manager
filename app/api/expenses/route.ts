import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { expenseSchema } from '@/lib/validations'

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the input data
    const validatedData = expenseSchema.parse({
      ...body,
      amount: parseFloat(body.amount)
    })

    // Create the expense with proper date conversion
    const expense = await prisma.expense.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date)
      }
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json(
        { error: 'Invalid expense data', details: error },
        { status: 400 }
      )
    }

    // Handle other validation errors
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid expense data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create expense', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
