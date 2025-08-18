'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Save, X } from 'lucide-react'

interface Property {
  id: string
  name: string
  address: string
  purchaseDate: string
  purchasePrice: number
  currentValue: number
  propertyType: string
  status: string
}

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    purchaseDate: '',
    purchasePrice: '',
    currentValue: '',
    propertyType: '',
    status: ''
  })

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch property')
        }
        const data = await response.json()
        setProperty(data)
        
        // Format date for input
        const purchaseDate = new Date(data.purchaseDate).toISOString().split('T')[0]
        
        setFormData({
          name: data.name,
          address: data.address,
          purchaseDate,
          purchasePrice: data.purchasePrice.toString(),
          currentValue: data.currentValue.toString(),
          propertyType: data.propertyType,
          status: data.status
        })
      } catch (error) {
        console.error('Error fetching property:', error)
        setError('שגיאה בטעינת הנכס')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/properties/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          purchasePrice: parseFloat(formData.purchasePrice),
          currentValue: parseFloat(formData.currentValue),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update property')
      }

      router.push(`/properties/${params.id}`)
    } catch (error) {
      console.error('Error updating property:', error)
      setError('שגיאה בעדכון הנכס')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">ערוך נכס</h1>
          <p className="text-slate-400">עדכן את פרטי הנכס</p>
        </div>
        <Link href={`/properties/${params.id}`}>
          <Button variant="outline" className="btn-secondary">
            <X className="h-4 w-4 ml-2" />
            ביטול
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">פרטי הנכס</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">שם הנכס *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType" className="text-white">סוג הנכס *</Label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  required
                >
                  <option value="">בחר סוג נכס</option>
                  <option value="apartment">דירה</option>
                  <option value="house">בית פרטי</option>
                  <option value="commercial">מסחרי</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-white">כתובת *</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseDate" className="text-white">תאריך רכישה *</Label>
                <Input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-white">סטטוס *</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  required
                >
                  <option value="">בחר סטטוס</option>
                  <option value="rented">מושכר</option>
                  <option value="vacant">פנוי</option>
                  <option value="owner-occupied">בבעלות</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchasePrice" className="text-white">מחיר רכישה *</Label>
                <Input
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentValue" className="text-white">שווי נוכחי *</Label>
                <Input
                  id="currentValue"
                  name="currentValue"
                  type="number"
                  value={formData.currentValue}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6">
              <Link href={`/properties/${params.id}`}>
                <Button type="button" variant="outline" className="btn-secondary">
                  <X className="h-4 w-4 ml-2" />
                  ביטול
                </Button>
              </Link>
              <Button 
                type="submit" 
                className="btn-primary"
                disabled={isSaving}
              >
                <Save className="h-4 w-4 ml-2" />
                {isSaving ? 'שומר...' : 'שמור שינויים'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
