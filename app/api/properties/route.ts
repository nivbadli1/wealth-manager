import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { propertySchema } from '@/lib/validations'

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        rentalIncomes: true,
        propertyExpenses: true,
        mortgages: true
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

    // Create the property
    const property = await prisma.property.create({
      data: validatedData
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid property data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
} 