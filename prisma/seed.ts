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
        category: 'utilities',
      },
      {
        propertyId: property1.id,
        amount: 800,
        date: new Date('2024-07-10'),
        description: 'חשבון מים',
        category: 'utilities',
      },
      {
        propertyId: property3.id,
        amount: 1500,
        date: new Date('2024-07-20'),
        description: 'תחזוקה כללית',
        category: 'maintenance',
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
        name: 'קרן נאמנות',
        type: 'mutual_fund',
        initialAmount: 300000,
        currentValue: 320000,
        date: new Date('2023-08-15'),
        returnRate: 6.7,
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
        source: 'הכנסה מהשקעות',
        amount: 5000,
        date: new Date('2024-07-15'),
        description: 'הכנסה מהשקעות',
        category: 'investment',
      },
    ],
  })

  // Create expense records
  await prisma.expense.createMany({
    data: [
      {
        amount: 8000,
        date: new Date('2024-07-05'),
        description: 'הוצאות משק בית',
        category: 'household',
      },
      {
        amount: 3000,
        date: new Date('2024-07-10'),
        description: 'ביטוח רכב',
        category: 'insurance',
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