import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { propertyExpenseSchema } from '@/lib/validations'

// POST /api/properties/expenses - Create a new property expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the input data
    const validatedData = propertyExpenseSchema.parse({
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

    // Create the property expense
    const expense = await prisma.propertyExpense.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date)
      }
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Error creating property expense:', error)
    
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json(
        { error: 'Invalid expense data', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create expense', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
