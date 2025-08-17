import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import {
  Edit, Trash2, MapPin, Calendar, DollarSign, User, FileText, AlertCircle
} from 'lucide-react'

// Mock data for demonstration
const mockProperty = {
  id: '1',
  name: 'דירה בתל אביב',
  address: 'רחוב דיזנגוף 123, תל אביב',
  purchaseDate: new Date('2023-01-15'),
  purchasePrice: 2500000,
  currentValue: 2800000,
  propertyType: 'apartment',
  status: 'rented',
  monthlyRent: 8500,
  tenantName: 'יוסי כהן',
  tenantPhone: '050-1234567',
  tenantEmail: 'yossi@example.com',
  lastMaintenance: new Date('2024-06-15'),
  nextMaintenance: new Date('2024-12-15'),
  description: 'דירה מרווחת עם 3 חדרים, מטבח מאובזר, מרפסת גדולה וחניה. ממוקמת בקומה 5 עם נוף לעיר.',
  features: ['מרפסת', 'חניה', 'מעלית', 'מזגן', 'מטבח מאובזר'],
  documents: [
    { name: 'חוזה שכירות', date: '2024-01-01', type: 'pdf' },
    { name: 'ביטוח נכס', date: '2024-01-01', type: 'pdf' },
    { name: 'תעודת כשירות', date: '2023-12-15', type: 'pdf' },
  ],
  expenses: [
    { month: '2024-07', amount: 1200, type: 'חשמל' },
    { month: '2024-07', amount: 800, type: 'מים' },
    { month: '2024-06', amount: 1500, type: 'תחזוקה' },
  ],
  income: [
    { month: '2024-07', amount: 8500, type: 'שכירות' },
    { month: '2024-06', amount: 8500, type: 'שכירות' },
    { month: '2024-05', amount: 8500, type: 'שכירות' },
  ],
}

const propertyTypeLabels = {
  apartment: 'דירה',
  house: 'בית פרטי',
  commercial: 'מסחרי',
}

const statusLabels = {
  rented: 'מושכר',
  vacant: 'פנוי',
  'owner-occupied': 'בבעלות',
}

const statusColors = {
  rented: 'bg-green-100 text-green-800',
  vacant: 'bg-yellow-100 text-yellow-800',
  'owner-occupied': 'bg-blue-100 text-blue-800',
}

export default function PropertyDetailPage() {
  const property = mockProperty // In real app, fetch by params.id

  const totalExpenses = property.expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalIncome = property.income.reduce((sum, inc) => sum + inc.amount, 0)
  const netIncome = totalIncome - totalExpenses
  const appreciation = ((property.currentValue - property.purchasePrice) / property.purchasePrice * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">{property.name}</h1>
          <p className="text-slate-400 flex items-center">
            <MapPin className="h-4 w-4 ml-2" />
            {property.address}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/properties/${property.id}/edit`}>
            <Button className="btn-primary">
              <Edit className="h-4 w-4 ml-2" />
              ערוך
            </Button>
          </Link>
          <Button variant="outline" className="btn-danger">
            <Trash2 className="h-4 w-4 ml-2" />
            מחק
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Overview */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-white">סקירה כללית</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">סוג הנכס</p>
                    <p className="text-white font-medium">{propertyTypeLabels[property.propertyType as keyof typeof propertyTypeLabels]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">סטטוס</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[property.status as keyof typeof statusColors]}`}>
                      {statusLabels[property.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">תאריך רכישה</p>
                    <p className="text-white font-medium">{formatDate(property.purchaseDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">תיאור</p>
                    <p className="text-white">{property.description}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">מחיר רכישה</p>
                    <p className="text-white font-medium">{formatCurrency(property.purchasePrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">שווי נוכחי</p>
                    <p className="text-white font-medium">{formatCurrency(property.currentValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">הערכת שווי</p>
                    <p className="text-green-400 font-medium">+{appreciation}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">תכונות</p>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-700 rounded-md text-xs text-slate-300">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-white">סיכום פיננסי</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-2">הכנסות חודשיות</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-2">הוצאות חודשיות</p>
                  <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-2">רווח נטו</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(netIncome)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Income & Expenses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">הכנסות אחרונות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {property.income.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{item.type}</p>
                        <p className="text-sm text-slate-400">{item.month}</p>
                      </div>
                      <p className="text-green-400 font-medium">{formatCurrency(item.amount)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">הוצאות אחרונות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {property.expenses.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{item.type}</p>
                        <p className="text-sm text-slate-400">{item.month}</p>
                      </div>
                      <p className="text-red-400 font-medium">{formatCurrency(item.amount)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tenant Information */}
          {property.status === 'rented' && (
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">מידע שוכר</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">שם השוכר</p>
                  <p className="text-white font-medium">{property.tenantName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">טלפון</p>
                  <p className="text-white font-medium">{property.tenantPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">אימייל</p>
                  <p className="text-white font-medium">{property.tenantEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">דמי שכירות</p>
                  <p className="text-white font-medium">{formatCurrency(property.monthlyRent)}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Maintenance */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-white">תחזוקה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">תחזוקה אחרונה</p>
                <p className="text-white font-medium">{formatDate(property.lastMaintenance)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">תחזוקה הבאה</p>
                <p className="text-white font-medium">{formatDate(property.nextMaintenance)}</p>
              </div>
              <Button variant="outline" className="w-full btn-secondary">
                <Calendar className="h-4 w-4 ml-2" />
                תזמן תחזוקה
              </Button>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-white">מסמכים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {property.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-slate-400 ml-2" />
                      <div>
                        <p className="text-white text-sm">{doc.name}</p>
                        <p className="text-slate-400 text-xs">{doc.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full btn-secondary">
                  <FileText className="h-4 w-4 ml-2" />
                  הוסף מסמך
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-white">פעולות מהירות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full btn-secondary">
                <DollarSign className="h-4 w-4 ml-2" />
                הוסף הכנסה
              </Button>
              <Button variant="outline" className="w-full btn-secondary">
                <AlertCircle className="h-4 w-4 ml-2" />
                הוסף הוצאה
              </Button>
              <Button variant="outline" className="w-full btn-secondary">
                <User className="h-4 w-4 ml-2" />
                עדכן שוכר
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 