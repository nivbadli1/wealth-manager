import { Property, RentalIncome, PropertyExpense, Mortgage, Investment, Income, Expense } from '@prisma/client'

// Base types from Prisma
export type {
  Property,
  RentalIncome,
  PropertyExpense,
  Mortgage,
  Investment,
  Income,
  Expense
} from '@prisma/client'

// Extended types with relations
export type PropertyWithRelations = Property & {
  rentalIncomes: RentalIncome[];
  propertyExpenses: PropertyExpense[];
  mortgages: Mortgage[];
}

// Form types
export interface PropertyFormData {
  name: string;
  address: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  propertyType: string;
  status: string;
}

export interface IncomeFormData {
  source: string;
  amount: number;
  date: string;
  description?: string;
  category: string;
}

export interface ExpenseFormData {
  category: string;
  amount: number;
  date: string;
  description?: string;
}

export interface InvestmentFormData {
  type: string;
  name: string;
  initialAmount: number;
  currentValue: number;
  date: string;
  returnRate?: number;
}

// Dashboard KPI types
export interface KPIData {
  totalAssets: number;
  totalProperties: number;
  monthlyRentalIncome: number;
  monthlyExpenses: number;
  netWorth: number;
  totalInvestments: number;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  income: number;
  expenses: number;
  profit: number;
}

// Constants
export const PROPERTY_TYPES = [
  { value: "apartment", label: "דירה" },
  { value: "house", label: "בית" }, 
  { value: "commercial", label: "מסחרי" }
] as const;

export const PROPERTY_STATUS = [
  { value: "rented", label: "מושכר" },
  { value: "vacant", label: "פנוי" },
  { value: "owner-occupied", label: "בשימוש עצמי" }
] as const;

export const EXPENSE_CATEGORIES = [
  { value: "maintenance", label: "אחזקה" },
  { value: "taxes", label: "מיסים" },
  { value: "insurance", label: "ביטוח" },
  { value: "management", label: "ניהול" },
  { value: "utilities", label: "חשמל ומים" },
  { value: "repairs", label: "תיקונים" }
] as const;

export const INVESTMENT_TYPES = [
  { value: "pension", label: "קופת גמל" },
  { value: "study_fund", label: "קרן השתלמות" },
  { value: "savings", label: "חיסכון" },
  { value: "stocks", label: "מניות" },
  { value: "bonds", label: "אג״ח" },
  { value: "etf", label: "תעודות סל" }
] as const;

export const INCOME_CATEGORIES = [
  { value: "salary", label: "משכורת" },
  { value: "freelance", label: "פרילנס" },
  { value: "rental", label: "דמי שכירות" },
  { value: "dividends", label: "דיבידנדים" },
  { value: "bonus", label: "בונוס" },
  { value: "other", label: "אחר" }
] as const;

export const LIVING_EXPENSE_CATEGORIES = [
  { value: "living", label: "הוצאות מחיה" },
  { value: "transportation", label: "תחבורה" },
  { value: "healthcare", label: "בריאות" },
  { value: "entertainment", label: "בילויים" },
  { value: "education", label: "חינוך" },
  { value: "shopping", label: "קניות" },
  { value: "utilities", label: "חשמל ומים" },
  { value: "insurance", label: "ביטוח" },
  { value: "taxes", label: "מיסים" },
  { value: "other", label: "אחר" }
] as const;