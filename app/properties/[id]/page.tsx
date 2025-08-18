'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Edit, Trash2, MapPin, Calendar, DollarSign, User, FileText, AlertCircle
} from 'lucide-react'

interface Property {
  id: string
  name: string
  address: string
  purchaseDate: string
  purchasePrice: number
  currentValue: number
  propertyType: string
  status: string
  createdAt: string
  updatedAt: string
  RentalIncome: Array<{
    id: string
    amount: number
    date: string
    tenantName?: string
    notes?: string
  }>
  PropertyExpense: Array<{
    id: string
    amount: number
    date: string
    category: string
    description?: string
  }>
  Mortgage: Array<{
    id: string
    bank: string
    currentBalance: number
    monthlyPayment: number
  }>
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

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch property')
        }
        const data = await response.json()
        setProperty(data)
      } catch (error) {
        console.error('Error fetching property:', error)
        setError('שגיאה בטעינת הנכס')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [params.id])

  const handleDelete = async () => {
    // First test - just show an alert to verify onClick works
    alert('Delete button clicked! Property ID: ' + params.id)
    console.log('Delete button clicked for property:', params.id)
    
    if (!confirm('האם אתה בטוח שברצונך למחוק את הנכס?')) {
      console.log('Delete cancelled by user')
      return
    }

    try {
      console.log('Sending delete request for:', params.id)
      const response = await fetch(`/api/properties/${params.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Delete failed:', errorData)
        throw new Error('Failed to delete property')
      }

      const result = await response.json()
      console.log('Delete successful:', result)
      
      alert('הנכס נמחק בהצלחה!')
      router.push('/properties')
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('שגיאה במחיקת הנכס: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white">טוען נכס...</div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-red-400">{error || 'נכס לא נמצא'}</div>
      </div>
    )
  }

  const totalExpenses = property.PropertyExpense.reduce((sum, exp) => sum + exp.amount, 0)
  const totalIncome = property.RentalIncome.reduce((sum, inc) => sum + inc.amount, 0)
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
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2" 
            onClick={handleDelete}
            type="button"
          >
            <Trash2 className="h-4 w-4 ml-2" />
            מחק נכס
          </button>
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
                    <p className="text-white font-medium">{formatDate(new Date(property.purchaseDate))}</p>
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
                  {property.RentalIncome.length > 0 ? property.RentalIncome.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{item.tenantName || 'שכירות'}</p>
                        <p className="text-sm text-slate-400">{formatDate(new Date(item.date))}</p>
                      </div>
                      <p className="text-green-400 font-medium">{formatCurrency(item.amount)}</p>
                    </div>
                  )) : (
                    <p className="text-slate-400">אין הכנסות רשומות</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">הוצאות אחרונות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {property.PropertyExpense.length > 0 ? property.PropertyExpense.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{item.description || item.category}</p>
                        <p className="text-sm text-slate-400">{formatDate(new Date(item.date))}</p>
                      </div>
                      <p className="text-red-400 font-medium">{formatCurrency(item.amount)}</p>
                    </div>
                  )) : (
                    <p className="text-slate-400">אין הוצאות רשומות</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tenant Information */}
          {property.status === 'rented' && property.RentalIncome.length > 0 && (
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">מידע שוכר</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">שם השוכר</p>
                  <p className="text-white font-medium">{property.RentalIncome[0].tenantName || 'לא צוין'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">דמי שכירות</p>
                  <p className="text-white font-medium">{formatCurrency(property.RentalIncome[0].amount)}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mortgage Information */}
          {property.Mortgage.length > 0 && (
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">משכנתא</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.Mortgage.map((mortgage, index) => (
                  <div key={index} className="space-y-2">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">בנק</p>
                      <p className="text-white font-medium">{mortgage.bank}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">יתרת חוב</p>
                      <p className="text-white font-medium">{formatCurrency(mortgage.currentBalance)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">תשלום חודשי</p>
                      <p className="text-white font-medium">{formatCurrency(mortgage.monthlyPayment)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-white">פעולות מהירות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/properties/${params.id}/income/new`}>
                <Button variant="outline" className="w-full btn-secondary">
                  <DollarSign className="h-4 w-4 ml-2" />
                  הוסף הכנסה לנכס
                </Button>
              </Link>
              <Link href={`/properties/${params.id}/expenses/new`}>
                <Button variant="outline" className="w-full btn-secondary">
                  <AlertCircle className="h-4 w-4 ml-2" />
                  הוסף הוצאה לנכס
                </Button>
              </Link>
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