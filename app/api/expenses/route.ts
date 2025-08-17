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
      amount: parseFloat(body.amount),
      date: new Date(body.date).toISOString()
    })

    // Create the expense
    const expense = await prisma.expense.create({
      data: validatedData
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid expense data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}
