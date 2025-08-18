import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { rentalIncomeSchema } from '@/lib/validations'

// POST /api/properties/income - Create a new property rental income
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the input data
    const validatedData = rentalIncomeSchema.parse({
      ...body,
      amount: parseFloat(body.amount)
    })

    // Verify that the property exists
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Create the rental income
    const income = await prisma.rentalIncome.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date)
      }
    })

    return NextResponse.json(income, { status: 201 })
  } catch (error) {
    console.error('Error creating rental income:', error)
    
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json(
        { error: 'Invalid income data', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create income', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
