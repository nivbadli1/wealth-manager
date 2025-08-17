"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import {
  PlusCircle, Search, Filter, Edit, Trash2, Eye, Building2, MapPin, DollarSign, Calendar, Loader2
} from 'lucide-react'

// Mock data for demonstration
const mockProperties = [
  {
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
    lastMaintenance: new Date('2024-06-15'),
  },
  {
    id: '2',
    name: 'בית פרטי בפתח תקווה',
    address: 'רחוב הרצל 45, פתח תקווה',
    purchaseDate: new Date('2022-08-20'),
    purchasePrice: 3200000,
    currentValue: 3500000,
    propertyType: 'house',
    status: 'owner-occupied',
    monthlyRent: 0,
    tenantName: null,
    lastMaintenance: new Date('2024-05-10'),
  },
  {
    id: '3',
    name: 'חנות מסחרית בירושלים',
    address: 'רחוב יפו 78, ירושלים',
    purchaseDate: new Date('2023-03-10'),
    purchasePrice: 1800000,
    currentValue: 2000000,
    propertyType: 'commercial',
    status: 'rented',
    monthlyRent: 12000,
    tenantName: 'חברת מסחר בע"מ',
    lastMaintenance: new Date('2024-07-01'),
  },
  {
    id: '4',
    name: 'דירת גן ברמת גן',
    address: 'רחוב ביאליק 12, רמת גן',
    purchaseDate: new Date('2021-11-05'),
    purchasePrice: 2200000,
    currentValue: 2600000,
    propertyType: 'apartment',
    status: 'vacant',
    monthlyRent: 0,
    tenantName: null,
    lastMaintenance: new Date('2024-04-20'),
  },
]

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

export default function PropertiesPage() {
  const [properties] = useState([]) // eslint-disable-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
      setError('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-white">טוען נכסים...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={fetchProperties} className="btn-primary">
            נסה שוב
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">ניהול נכסים</h1>
          <p className="text-slate-400">ניהול נכסי הנדל״ן שלך</p>
        </div>
        <Link href="/properties/new">
          <Button className="btn-primary">
            <PlusCircle className="h-4 w-4 ml-2" />
            הוסף נכס חדש
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">סך הנכסים</p>
                <p className="text-2xl font-bold text-white">{mockProperties.length}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">שווי כולל</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(mockProperties.reduce((sum, p) => sum + p.currentValue, 0))}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">הכנסה חודשית</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(mockProperties.reduce((sum, p) => sum + p.monthlyRent, 0))}
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">נכסים מושכרים</p>
                <p className="text-2xl font-bold text-white">
                  {mockProperties.filter(p => p.status === 'rented').length}
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-white">כל הנכסים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="חיפוש נכסים..."
                className="pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <Button variant="outline" className="btn-secondary">
              <Filter className="h-4 w-4 ml-2" />
              סינון
            </Button>
          </div>

          {/* Properties Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">שם הנכס</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">כתובת</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">סוג</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">סטטוס</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">שווי נוכחי</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">דמי שכירות</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {mockProperties.map((property) => (
                  <tr key={property.id} className="border-b border-slate-600 hover:bg-slate-700/50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-white">{property.name}</p>
                        <p className="text-sm text-slate-400">{formatDate(property.purchaseDate)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-slate-400 ml-2" />
                        <span className="text-slate-300">{property.address}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-300">{propertyTypeLabels[property.propertyType]}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[property.status]}`}>
                        {statusLabels[property.status]}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">{formatCurrency(property.currentValue)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">
                        {property.monthlyRent > 0 ? formatCurrency(property.monthlyRent) : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/properties/${property.id}`}>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/properties/${property.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 