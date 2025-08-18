import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { propertySchema } from '@/lib/validations'

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        RentalIncome: true,
        PropertyExpense: true,
        Mortgage: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the input data
    const validatedData = propertySchema.parse({
      ...body,
      purchasePrice: parseFloat(body.purchasePrice),
      currentValue: parseFloat(body.currentValue)
    })

    // Create the property with date conversion
    const property = await prisma.property.create({
      data: {
        ...validatedData,
        purchaseDate: new Date(validatedData.purchaseDate)
      }
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json(
        { error: 'Invalid property data', details: error },
        { status: 400 }
      )
    }

    // Handle other validation errors
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid property data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create property', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 