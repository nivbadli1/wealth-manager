export type Language = 'he' | 'en'
export type Currency = 'ILS' | 'USD'

export const translations = {
  // Navigation & Layout
  dashboard: { he: 'דשבורד', en: 'Dashboard' },
  properties: { he: 'נכסים', en: 'Properties' },
  investments: { he: 'השקעות', en: 'Investments' },
  income: { he: 'הכנסות', en: 'Income' },
  expenses: { he: 'הוצאות', en: 'Expenses' },
  reports: { he: 'דוחות וניתוח', en: 'Reports & Analysis' },
  dataManagement: { he: 'ניהול נתונים', en: 'Data Management' },
  settings: { he: 'הגדרות', en: 'Settings' },
  user: { he: 'משתמש', en: 'User' },
  
  // Property types
  apartment: { he: 'דירה', en: 'Apartment' },
  house: { he: 'בית פרטי', en: 'House' },
  commercial: { he: 'מסחרי', en: 'Commercial' },
  
  // Property status
  rented: { he: 'מושכר', en: 'Rented' },
  vacant: { he: 'פנוי', en: 'Vacant' },
  owned: { he: 'בבעלות', en: 'Owned' },
  
  // Actions
  new: { he: 'חדש', en: 'New' },
  edit: { he: 'עריכה', en: 'Edit' },
  add: { he: 'הוסף', en: 'Add' },
  addProperty: { he: 'הוסף נכס', en: 'Add Property' },
  addIncome: { he: 'הוסף הכנסה', en: 'Add Income' },
  addExpense: { he: 'הוסף הוצאה', en: 'Add Expense' },
  addInvestment: { he: 'הוסף השקעה', en: 'Add Investment' },
  
  // Dashboard
  financialDashboard: { he: 'דשבורד נתונים פיננסיים', en: 'Financial Dashboard' },
  overallView: { he: 'מבט כולל על הנכסים, ההכנסות וההשקעות שלך', en: 'Overall view of your properties, income, and investments' },
  monthlyIncome: { he: 'הכנסה חודשית', en: 'Monthly Income' },
  monthlyRentalIncome: { he: 'הכנסות שכירות חודשיות', en: 'Monthly rental income' },
  totalAssets: { he: 'סך הנכסים', en: 'Total Assets' },
  totalNetWorth: { he: 'שווי נטו כולל', en: 'Total net worth' },
  totalProperties: { he: 'נכסים', en: 'Properties' },
  propertiesOwned: { he: 'מספר נכסים בבעלות', en: 'Number of properties owned' },
  totalInvestments: { he: 'השקעות', en: 'Investments' },
  totalInvestmentsValue: { he: 'סך ההשקעות הפיננסיות', en: 'Total financial investments' },
  
  // Charts
  monthlyIncomeExpenses: { he: 'הכנסות והוצאות חודשיות', en: 'Monthly Income & Expenses' },
  propertyTypeDistribution: { he: 'התפלגות סוגי נכסים', en: 'Property Type Distribution' },
  propertyStatus: { he: 'סטטוס נכסים', en: 'Property Status' },
  
  // Quick Actions
  quickActions: { he: 'פעולות מהירות', en: 'Quick Actions' },
  addNewProperty: { he: 'הוסף נכס חדש', en: 'Add New Property' },
  addNewPropertyDesc: { he: 'הוסף נכס נדל״ן חדש למערכת', en: 'Add a new real estate property to the system' },
  addIncomeDesc: { he: 'תעד הכנסה חדשה', en: 'Record new income' },
  addExpenseDesc: { he: 'תעד הוצאה חדשה', en: 'Record new expense' },
  
  // Navigation breadcrumbs
  propertyDetails: { he: 'פרטי נכס', en: 'Property Details' },
  incomeDetails: { he: 'פרטי הכנסה', en: 'Income Details' },
  expenseDetails: { he: 'פרטי הוצאה', en: 'Expense Details' },
  details: { he: 'פרטים', en: 'Details' },
  
  // Sidebar sub-items
  allProperties: { he: 'כל הנכסים', en: 'All Properties' },
  allInvestments: { he: 'כל ההשקעות', en: 'All Investments' },
  allIncome: { he: 'כל ההכנסות', en: 'All Income' },
  allExpenses: { he: 'כל ההוצאות', en: 'All Expenses' },
  
  // Status messages
  loadingData: { he: 'טוען נתונים...', en: 'Loading data...' },
  dataError: { he: 'שגיאה בטעינת הנתונים', en: 'Error loading data' },
  noDataAvailable: { he: 'אין נתונים זמינים', en: 'No data available' },
  
  // Wealth Management
  wealthManagement: { he: 'ניהול עושר', en: 'Wealth Management' },
  personalWealthManagement: { he: 'מערכת ניהול עושר אישי', en: 'Personal Wealth Management System' },
  professionalSystemDesc: { he: 'מערכת מקצועית לניהול נכסים, השקעות והכנסות', en: 'Professional system for managing assets, investments and income' },
  
  // Additional translations (if needed in the future)
} as const

export type TranslationKey = keyof typeof translations

export function getTranslation(key: TranslationKey, language: Language): string {
  return translations[key][language]
}

export function getLanguageDirection(language: Language): 'ltr' | 'rtl' {
  return language === 'he' ? 'rtl' : 'ltr'
}

export function getLanguageLocale(language: Language): string {
  return language === 'he' ? 'he-IL' : 'en-US'
}
