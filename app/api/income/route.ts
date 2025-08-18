import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { incomeSchema } from '@/lib/validations'

export async function GET() {
  try {
    const income = await prisma.income.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(income)
  } catch (error) {
    console.error('Error fetching income:', error)
    return NextResponse.json(
      { error: 'Failed to fetch income' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the input data
    const validatedData = incomeSchema.parse({
      ...body,
      amount: parseFloat(body.amount)
    })

    // Create the income with proper date conversion
    const income = await prisma.income.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date)
      }
    })

    return NextResponse.json(income, { status: 201 })
  } catch (error) {
    console.error('Error creating income:', error)
    
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json(
        { error: 'Invalid income data', details: error },
        { status: 400 }
      )
    }

    // Handle other validation errors
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid income data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create income', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
