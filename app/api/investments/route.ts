import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { investmentSchema } from '@/lib/validations'

export async function GET() {
  try {
    const investments = await prisma.investment.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(investments)
  } catch (error) {
    console.error('Error fetching investments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the input data
    const validatedData = investmentSchema.parse({
      ...body,
      initialAmount: parseFloat(body.initialAmount),
      currentValue: parseFloat(body.currentValue),
      returnRate: body.returnRate ? parseFloat(body.returnRate) : undefined,
      date: new Date(body.date).toISOString()
    })

    // Create the investment
    const investment = await prisma.investment.create({
      data: validatedData
    })

    return NextResponse.json(investment, { status: 201 })
  } catch (error) {
    console.error('Error creating investment:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid investment data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create investment' },
      { status: 500 }
    )
  }
}
