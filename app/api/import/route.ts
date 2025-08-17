import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { propertySchema, investmentSchema, incomeSchema, expenseSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const importType = formData.get('type') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const fileContent = await file.text()
    let data: unknown

    try {
      if (file.name.endsWith('.json')) {
        data = JSON.parse(fileContent)
      } else if (file.name.endsWith('.csv')) {
        data = parseCSV(fileContent)
      } else {
        return NextResponse.json(
          { error: 'Unsupported file format. Please use JSON or CSV.' },
          { status: 400 }
        )
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid file format or corrupted data' },
        { status: 400 }
      )
    }

    // Validate and import data based on type
    let importResults: ImportResults = { success: 0, errors: 0, details: [] }

    switch (importType) {
      case 'properties':
        importResults = await importProperties(data)
        break
      case 'investments':
        importResults = await importInvestments(data)
        break
      case 'income':
        importResults = await importIncome(data)
        break
      case 'expenses':
        importResults = await importExpenses(data)
        break
      case 'all':
        importResults = await importAllData(data)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid import type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: 'Import completed',
      results: importResults
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to process import' },
      { status: 500 }
    )
  }
}

interface ImportResults {
  success: number;
  errors: number;
  details: Array<{
    type: string;
    name?: string;
    source?: string;
    category?: string;
    status: string;
    error?: string;
  }>;
}

async function importProperties(data: unknown) {
  const results: ImportResults = { success: 0, errors: 0, details: [] }

  for (const item of Array.isArray(data) ? data : [data]) {
    try {
      const validatedData = propertySchema.parse({
        ...item,
        purchaseDate: new Date(item.purchaseDate).toISOString(),
        purchasePrice: parseFloat(item.purchasePrice),
        currentValue: parseFloat(item.currentValue)
      })

      await prisma.property.create({
        data: validatedData
      })

      results.success++
      results.details.push({ type: 'property', name: item.name, status: 'success' })
    } catch (error) {
      results.errors++
      results.details.push({ 
        type: 'property', 
        name: item.name || 'Unknown', 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Validation failed' 
      })
    }
  }

  return results
}

async function importInvestments(data: unknown) {
  const results: ImportResults = { success: 0, errors: 0, details: [] }

  for (const item of Array.isArray(data) ? data : [data]) {
    try {
      const validatedData = investmentSchema.parse({
        ...item,
        date: new Date(item.date).toISOString(),
        initialAmount: parseFloat(item.initialAmount),
        currentValue: parseFloat(item.currentValue),
        returnRate: item.returnRate ? parseFloat(item.returnRate) : undefined
      })

      await prisma.investment.create({
        data: validatedData
      })

      results.success++
      results.details.push({ type: 'investment', name: item.name, status: 'success' })
    } catch (error) {
      results.errors++
      results.details.push({ 
        type: 'investment', 
        name: item.name || 'Unknown', 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Validation failed' 
      })
    }
  }

  return results
}

async function importIncome(data: unknown) {
  const results: ImportResults = { success: 0, errors: 0, details: [] }

  for (const item of Array.isArray(data) ? data : [data]) {
    try {
      const validatedData = incomeSchema.parse({
        ...item,
        date: new Date(item.date).toISOString(),
        amount: parseFloat(item.amount)
      })

      await prisma.income.create({
        data: validatedData
      })

      results.success++
      results.details.push({ type: 'income', source: item.source, status: 'success' })
    } catch (error) {
      results.errors++
      results.details.push({ 
        type: 'income', 
        source: item.source || 'Unknown', 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Validation failed' 
      })
    }
  }

  return results
}

async function importExpenses(data: unknown) {
  const results: ImportResults = { success: 0, errors: 0, details: [] }

  for (const item of Array.isArray(data) ? data : [data]) {
    try {
      const validatedData = expenseSchema.parse({
        ...item,
        date: new Date(item.date).toISOString(),
        amount: parseFloat(item.amount)
      })

      await prisma.expense.create({
        data: validatedData
      })

      results.success++
      results.details.push({ type: 'expense', category: item.category, status: 'success' })
    } catch (error) {
      results.errors++
      results.details.push({ 
        type: 'expense', 
        category: item.category || 'Unknown', 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Validation failed' 
      })
    }
  }

  return results
}

async function importAllData(data: unknown) {
  const results: ImportResults = { success: 0, errors: 0, details: [] }
  const dataObj = data as Record<string, unknown>

  // Import properties
  if (dataObj.properties) {
    const propertyResults = await importProperties(dataObj.properties)
    results.success += propertyResults.success
    results.errors += propertyResults.errors
    results.details.push(...propertyResults.details)
  }

  // Import investments
  if (dataObj.investments) {
    const investmentResults = await importInvestments(dataObj.investments)
    results.success += investmentResults.success
    results.errors += investmentResults.errors
    results.details.push(...investmentResults.details)
  }

  // Import income
  if (dataObj.income) {
    const incomeResults = await importIncome(dataObj.income)
    results.success += incomeResults.success
    results.errors += incomeResults.errors
    results.details.push(...incomeResults.details)
  }

  // Import expenses
  if (dataObj.expenses) {
    const expenseResults = await importExpenses(dataObj.expenses)
    results.success += expenseResults.success
    results.errors += expenseResults.errors
    results.details.push(...expenseResults.details)
  }

  return results
}

function parseCSV(csvContent: string): Record<string, string>[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim())
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row: Record<string, string> = {}
    
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    
    data.push(row)
  }

  return data
} 