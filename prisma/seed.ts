import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.rentalIncome.deleteMany()
  await prisma.propertyExpense.deleteMany()
  await prisma.mortgage.deleteMany()
  await prisma.property.deleteMany()
  await prisma.investment.deleteMany()
  await prisma.income.deleteMany()
  await prisma.expense.deleteMany()

  // Create sample properties
  const property1 = await prisma.property.create({
    data: {
      name: 'דירה בתל אביב',
      address: 'רחוב דיזנגוף 123, תל אביב',
      purchaseDate: new Date('2023-01-15'),
      purchasePrice: 2500000,
      currentValue: 2800000,
      propertyType: 'apartment',
      status: 'rented',
    },
  })

  const property2 = await prisma.property.create({
    data: {
      name: 'בית פרטי בפתח תקווה',
      address: 'רחוב הרצל 45, פתח תקווה',
      purchaseDate: new Date('2022-08-20'),
      purchasePrice: 3200000,
      currentValue: 3500000,
      propertyType: 'house',
      status: 'owner-occupied',
    },
  })

  const property3 = await prisma.property.create({
    data: {
      name: 'חנות מסחרית בירושלים',
      address: 'רחוב יפו 78, ירושלים',
      purchaseDate: new Date('2023-03-10'),
      purchasePrice: 1800000,
      currentValue: 2000000,
      propertyType: 'commercial',
      status: 'rented',
    },
  })

  const property4 = await prisma.property.create({
    data: {
      name: 'דירת גן ברמת גן',
      address: 'רחוב ביאליק 12, רמת גן',
      purchaseDate: new Date('2021-11-05'),
      purchasePrice: 2200000,
      currentValue: 2600000,
      propertyType: 'apartment',
      status: 'vacant',
    },
  })

  // Create rental income records
  await prisma.rentalIncome.createMany({
    data: [
      {
        propertyId: property1.id,
        amount: 8500,
        date: new Date('2024-07-01'),
        notes: 'דמי שכירות יולי 2024',
        tenantName: 'יוסי כהן',
      },
      {
        propertyId: property1.id,
        amount: 8500,
        date: new Date('2024-06-01'),
        notes: 'דמי שכירות יוני 2024',
        tenantName: 'יוסי כהן',
      },
      {
        propertyId: property3.id,
        amount: 12000,
        date: new Date('2024-07-01'),
        notes: 'דמי שכירות יולי 2024',
        tenantName: 'חברת מסחר בע"מ',
      },
      {
        propertyId: property3.id,
        amount: 12000,
        date: new Date('2024-06-01'),
        notes: 'דמי שכירות יוני 2024',
        tenantName: 'חברת מסחר בע"מ',
      },
    ],
  })

  // Create property expenses
  await prisma.propertyExpense.createMany({
    data: [
      {
        propertyId: property1.id,
        amount: 1200,
        date: new Date('2024-07-15'),
        description: 'חשבון חשמל',
        category: 'maintenance',
      },
      {
        propertyId: property1.id,
        amount: 800,
        date: new Date('2024-07-10'),
        description: 'חשבון מים',
        category: 'maintenance',
      },
      {
        propertyId: property3.id,
        amount: 1500,
        date: new Date('2024-07-20'),
        description: 'תחזוקה כללית',
        category: 'maintenance',
      },
      {
        propertyId: property2.id,
        amount: 2500,
        date: new Date('2024-06-15'),
        description: 'ביטוח דירה',
        category: 'insurance',
      },
    ],
  })

  // Create mortgages
  await prisma.mortgage.createMany({
    data: [
      {
        propertyId: property1.id,
        bank: 'בנק הפועלים',
        originalAmount: 2000000,
        currentBalance: 1800000,
        monthlyPayment: 8500,
        interestRate: 3.5,
        startDate: new Date('2023-01-15'),
      },
      {
        propertyId: property2.id,
        bank: 'בנק לאומי',
        originalAmount: 2500000,
        currentBalance: 2200000,
        monthlyPayment: 10200,
        interestRate: 3.2,
        startDate: new Date('2022-08-20'),
      },
    ],
  })

  // Create investments
  await prisma.investment.createMany({
    data: [
      {
        name: 'תיק השקעות מניות',
        type: 'stocks',
        initialAmount: 500000,
        currentValue: 580000,
        date: new Date('2023-05-10'),
        returnRate: 16.0,
      },
      {
        name: 'קרן פנסיה',
        type: 'pension',
        initialAmount: 300000,
        currentValue: 320000,
        date: new Date('2023-08-15'),
        returnRate: 6.7,
      },
      {
        name: 'קרן השתלמות',
        type: 'study_fund',
        initialAmount: 150000,
        currentValue: 165000,
        date: new Date('2022-12-01'),
        returnRate: 10.0,
      },
      {
        name: 'חסכונות בנק',
        type: 'savings',
        initialAmount: 200000,
        currentValue: 210000,
        date: new Date('2024-01-01'),
        returnRate: 5.0,
      },
    ],
  })

  // Create income records
  await prisma.income.createMany({
    data: [
      {
        source: 'משכורת חודשית',
        amount: 15000,
        date: new Date('2024-07-01'),
        description: 'משכורת חודשית',
        category: 'salary',
      },
      {
        source: 'משכורת יוני',
        amount: 15000,
        date: new Date('2024-06-01'),
        description: 'משכורת חודשית',
        category: 'salary',
      },
      {
        source: 'בונוס שנתי',
        amount: 25000,
        date: new Date('2024-05-15'),
        description: 'בונוס שנתי',
        category: 'bonus',
      },
      {
        source: 'דיבידנדים',
        amount: 3500,
        date: new Date('2024-07-15'),
        description: 'דיבידנדים מהשקעות',
        category: 'dividends',
      },
      {
        source: 'עבודה חופשית',
        amount: 8000,
        date: new Date('2024-06-20'),
        description: 'פרויקט קונסלטינג',
        category: 'freelance',
      },
    ],
  })

  // Create expense records
  await prisma.expense.createMany({
    data: [
      {
        amount: 8000,
        date: new Date('2024-07-05'),
        description: 'קניות סופר ומוצרי בית',
        category: 'living',
      },
      {
        amount: 3000,
        date: new Date('2024-07-10'),
        description: 'ביטוח רכב',
        category: 'transportation',
      },
      {
        amount: 1500,
        date: new Date('2024-07-12'),
        description: 'ביקור אצל רופא שיניים',
        category: 'healthcare',
      },
      {
        amount: 2500,
        date: new Date('2024-06-25'),
        description: 'ארוחה במסעדה וקולנוע',
        category: 'entertainment',
      },
      {
        amount: 4500,
        date: new Date('2024-06-15'),
        description: 'חשמל, מים וגז',
        category: 'living',
      },
      {
        amount: 2200,
        date: new Date('2024-06-10'),
        description: 'דלק לרכב',
        category: 'transportation',
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })