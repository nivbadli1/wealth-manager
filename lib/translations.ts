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
  
  // Properties page
  propertyManagement: { he: 'ניהול נכסים', en: 'Property Management' },
  manageAllProperties: { he: 'ניהול כל הנכסים שלך', en: 'Manage all your properties' },
  totalValue: { he: 'שווי כולל', en: 'Total Value' },
  rentedProperties: { he: 'נכסים מושכרים', en: 'Rented Properties' },
  searchProperties: { he: 'חיפוש נכסים לפי שם או כתובת...', en: 'Search properties by name or address...' },
  filter: { he: 'סינון', en: 'Filter' },
  clear: { he: 'נקה', en: 'Clear' },
  clearAll: { he: 'נקה הכל', en: 'Clear All' },
  applyFilter: { he: 'החל סינון', en: 'Apply Filter' },
  advancedFilter: { he: 'סינון מתקדם', en: 'Advanced Filter' },
  showing: { he: 'מציג', en: 'Showing' },
  of: { he: 'מתוך', en: 'of' },
  propertyType: { he: 'סוג נכס', en: 'Property Type' },
  status: { he: 'סטטוס', en: 'Status' },
  purchaseDate: { he: 'תאריך רכישה', en: 'Purchase Date' },
  currentValue: { he: 'שווי נוכחי', en: 'Current Value' },
  purchasePrice: { he: 'מחיר רכישה', en: 'Purchase Price' },
  fromDate: { he: 'מתאריך', en: 'From Date' },
  toDate: { he: 'עד תאריך', en: 'To Date' },
  minimum: { he: 'מינימום', en: 'Minimum' },
  maximum: { he: 'מקסימום', en: 'Maximum' },
  all: { he: 'הכל', en: 'All' },
  
  // Table headers
  name: { he: 'שם הנכס', en: 'Property Name' },
  address: { he: 'כתובת', en: 'Address' },
  type: { he: 'סוג', en: 'Type' },
  value: { he: 'שווי נוכחי', en: 'Current Value' },
  rent: { he: 'דמי שכירות', en: 'Rent' },
  actions: { he: 'פעולות', en: 'Actions' },
  
  // Empty states
  noProperties: { he: 'אין נכסים להצגה', en: 'No properties to display' },
  noPropertiesMatch: { he: 'לא נמצאו נכסים המתאימים לקריטריונים', en: 'No properties match the criteria' },
  addFirstProperty: { he: 'הוסף נכס ראשון', en: 'Add First Property' },
  clearFilters: { he: 'נקה סינון', en: 'Clear Filters' },
  
  // Loading and errors
  loadingProperties: { he: 'טוען נכסים...', en: 'Loading properties...' },
  errorLoadingProperties: { he: 'שגיאה בטעינת הנכסים', en: 'Error loading properties' },
  tryAgain: { he: 'נסה שוב', en: 'Try Again' },
  
  // Delete confirmation
  deleteConfirm: { he: 'האם אתה בטוח שברצונך למחוק את הנכס', en: 'Are you sure you want to delete the property' },
  deleteSuccess: { he: 'הנכס נמחק בהצלחה!', en: 'Property deleted successfully!' },
  deleteError: { he: 'שגיאה במחיקת הנכס', en: 'Error deleting property' },
  
  // Investments page
  investmentManagement: { he: 'ניהול השקעות', en: 'Investment Management' },
  manageAllInvestments: { he: 'ניהול כל ההשקעות שלך', en: 'Manage all your investments' },
  searchInvestments: { he: 'חיפוש השקעות לפי שם או סוג...', en: 'Search investments by name or type...' },
  investmentType: { he: 'סוג השקעה', en: 'Investment Type' },
  investmentDate: { he: 'תאריך השקעה', en: 'Investment Date' },
  initialAmount: { he: 'השקעה ראשונית', en: 'Initial Amount' },
  noInvestments: { he: 'אין השקעות להצגה', en: 'No investments to display' },
  noInvestmentsMatch: { he: 'לא נמצאו השקעות המתאימות לקריטריונים', en: 'No investments match the criteria' },
  addFirstInvestment: { he: 'הוסף השקעה ראשונה', en: 'Add First Investment' },
  loadingInvestments: { he: 'טוען השקעות...', en: 'Loading investments...' },
  
  // Investment types
  stocks: { he: 'מניות', en: 'Stocks' },
  mutualFund: { he: 'קרן נאמנות', en: 'Mutual Fund' },
  pension: { he: 'קופת גמל', en: 'Pension' },
  studyFund: { he: 'קרן השתלמות', en: 'Study Fund' },
  savings: { he: 'חיסכון', en: 'Savings' },
  bonds: { he: 'אגרות חוב', en: 'Bonds' },
  crypto: { he: 'קריפטו', en: 'Crypto' },
  other: { he: 'אחר', en: 'Other' },
  
  // Income page
  incomeManagement: { he: 'ניהול הכנסות', en: 'Income Management' },
  manageAllIncome: { he: 'ניהול כל ההכנסות שלך', en: 'Manage all your income' },
  searchIncome: { he: 'חיפוש הכנסות לפי מקור, תיאור או קטגוריה...', en: 'Search income by source, description or category...' },
  totalIncome: { he: 'סך הכנסות', en: 'Total Income' },
  records: { he: 'מספר רשומות', en: 'Number of Records' },
  source: { he: 'מקור', en: 'Source' },
  category: { he: 'קטגוריה', en: 'Category' },
  amount: { he: 'סכום', en: 'Amount' },
  date: { he: 'תאריך', en: 'Date' },
  description: { he: 'תיאור', en: 'Description' },
  noIncome: { he: 'אין הכנסות להצגה', en: 'No income to display' },
  noIncomeMatch: { he: 'לא נמצאו הכנסות המתאימות לקריטריונים', en: 'No income matches the criteria' },
  addFirstIncome: { he: 'הוסף הכנסה ראשונה', en: 'Add First Income' },
  
  // Income categories
  salary: { he: 'משכורת', en: 'Salary' },
  investment: { he: 'השקעות', en: 'Investment' },
  freelance: { he: 'פרילנס', en: 'Freelance' },
  rental: { he: 'שכירות', en: 'Rental' },
  dividends: { he: 'דיבידנדים', en: 'Dividends' },
  
  // Expenses page
  expenseManagement: { he: 'ניהול הוצאות', en: 'Expense Management' },
  manageAllExpenses: { he: 'ניהול כל ההוצאות שלך', en: 'Manage all your expenses' },
  searchExpenses: { he: 'חיפוש הוצאות לפי קטגוריה או תיאור...', en: 'Search expenses by category or description...' },
  totalExpenses: { he: 'סך הוצאות', en: 'Total Expenses' },
  monthlyExpenses: { he: 'הוצאות חודשיות', en: 'Monthly Expenses' },
  noExpenses: { he: 'אין הוצאות להצגה', en: 'No expenses to display' },
  noExpensesMatch: { he: 'לא נמצאו הוצאות המתאימות לקריטריונים', en: 'No expenses match the criteria' },
  addFirstExpense: { he: 'הוסף הוצאה ראשונה', en: 'Add First Expense' },
  
  // Expense categories
  living: { he: 'משק בית', en: 'Living' },
  transportation: { he: 'תחבורה', en: 'Transportation' },
  healthcare: { he: 'בריאות', en: 'Healthcare' },
  entertainment: { he: 'בילויים', en: 'Entertainment' },
  education: { he: 'חינוך', en: 'Education' },
  shopping: { he: 'קניות', en: 'Shopping' },
  utilities: { he: 'חשבונות', en: 'Utilities' },
  insurance: { he: 'ביטוח', en: 'Insurance' },
  taxes: { he: 'מיסים', en: 'Taxes' },
  
  // Common actions
  view: { he: 'צפה', en: 'View' },
  delete: { he: 'מחק', en: 'Delete' },
  
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
