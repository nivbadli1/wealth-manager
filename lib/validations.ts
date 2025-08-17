import { z } from 'zod'

// Property validation schema
export const propertySchema = z.object({
  name: z.string().min(1, 'שם הנכס הוא שדה חובה'),
  address: z.string().min(1, 'כתובת הנכס היא שדה חובה'),
  purchaseDate: z.string().min(1, 'תאריך רכישה הוא שדה חובה'),
  purchasePrice: z.number().min(0, 'מחיר רכישה חייב להיות חיובי').max(100000000, 'מחיר רכישה גבוה מדי'),
  currentValue: z.number().min(0, 'שווי נוכחי חייב להיות חיובי').max(100000000, 'שווי נוכחי גבוה מדי'),
  propertyType: z.enum(['apartment', 'house', 'commercial']),
  status: z.enum(['rented', 'vacant', 'owner-occupied']),
})

// Investment validation schema
export const investmentSchema = z.object({
  type: z.enum(['pension', 'study_fund', 'savings', 'stocks', 'bonds', 'etf', 'mutual_fund', 'crypto', 'other']),
  name: z.string().min(1, 'שם ההשקעה הוא שדה חובה'),
  initialAmount: z.number().min(0, 'סכום התחלתי חייב להיות חיובי').max(100000000, 'סכום התחלתי גבוה מדי'),
  currentValue: z.number().min(0, 'שווי נוכחי חייב להיות חיובי').max(100000000, 'שווי נוכחי גבוה מדי'),
  date: z.string().min(1, 'תאריך ההשקעה הוא שדה חובה'),
  returnRate: z.number().min(-100, 'תשואה לא יכולה להיות פחות מ-100%').max(1000, 'תשואה גבוהה מדי').optional(),
})

// Income validation schema
export const incomeSchema = z.object({
  source: z.string().min(1, 'מקור ההכנסה הוא שדה חובה'),
  amount: z.number().min(0.01, 'סכום ההכנסה חייב להיות חיובי').max(10000000, 'סכום ההכנסה גבוה מדי'),
  date: z.string().min(1, 'תאריך ההכנסה הוא שדה חובה'),
  description: z.string().optional(),
  category: z.enum(['salary', 'freelance', 'rental', 'dividends', 'bonus', 'other']),
})

// Expense validation schema
export const expenseSchema = z.object({
  category: z.enum(['living', 'transportation', 'healthcare', 'entertainment', 'education', 'shopping', 'utilities', 'insurance', 'taxes', 'other']),
  amount: z.number().min(0.01, 'סכום ההוצאה חייב להיות חיובי').max(10000000, 'סכום ההוצאה גבוה מדי'),
  date: z.string().min(1, 'תאריך ההוצאה הוא שדה חובה'),
  description: z.string().optional(),
})

// Rental income validation schema
export const rentalIncomeSchema = z.object({
  propertyId: z.string().min(1, 'יש לבחור נכס'),
  amount: z.number().min(0.01, 'סכום השכירות חייב להיות חיובי').max(1000000, 'סכום השכירות גבוה מדי'),
  date: z.string().min(1, 'תאריך קבלת השכירות הוא שדה חובה'),
  tenantName: z.string().optional(),
  notes: z.string().optional(),
})

// Property expense validation schema
export const propertyExpenseSchema = z.object({
  propertyId: z.string().min(1, 'יש לבחור נכס'),
  category: z.enum(['maintenance', 'taxes', 'insurance', 'management', 'utilities', 'repairs']),
  amount: z.number().min(0.01, 'סכום ההוצאה חייב להיות חיובי').max(1000000, 'סכום ההוצאה גבוה מדי'),
  date: z.string().min(1, 'תאריך ההוצאה הוא שדה חובה'),
  description: z.string().optional(),
})

// Mortgage validation schema
export const mortgageSchema = z.object({
  propertyId: z.string().min(1, 'יש לבחור נכס'),
  bank: z.string().min(1, 'שם הבנק הוא שדה חובה'),
  originalAmount: z.number().min(0, 'סכום המשכנתא המקורי חייב להיות חיובי').max(100000000, 'סכום המשכנתא המקורי גבוה מדי'),
  currentBalance: z.number().min(0, 'יתרת המשכנתא הנוכחית חייבת להיות חיובית').max(100000000, 'יתרת המשכנתא הנוכחית גבוהה מדי'),
  monthlyPayment: z.number().min(0, 'התשלום החודשי חייב להיות חיובי').max(1000000, 'התשלום החודשי גבוה מדי'),
  interestRate: z.number().min(0, 'ריבית חייבת להיות חיובית').max(50, 'ריבית גבוהה מדי'),
  startDate: z.string().min(1, 'תאריך תחילת המשכנתא הוא שדה חובה'),
})

// Generic date range schema for reports
export const dateRangeSchema = z.object({
  startDate: z.string().min(1, 'תאריך התחלה הוא שדה חובה'),
  endDate: z.string().min(1, 'תאריך סיום הוא שדה חובה'),
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
  message: 'תאריך סיום חייב להיות אחרי תאריך התחלה',
  path: ['endDate']
})

// Export inferred types
export type PropertyFormData = z.infer<typeof propertySchema>
export type InvestmentFormData = z.infer<typeof investmentSchema>
export type IncomeFormData = z.infer<typeof incomeSchema>
export type ExpenseFormData = z.infer<typeof expenseSchema>
export type RentalIncomeFormData = z.infer<typeof rentalIncomeSchema>
export type PropertyExpenseFormData = z.infer<typeof propertyExpenseSchema>
export type MortgageFormData = z.infer<typeof mortgageSchema>
export type DateRangeFormData = z.infer<typeof dateRangeSchema>