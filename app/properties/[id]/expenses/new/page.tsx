'use client'

import { useState, useEffect, use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, X } from 'lucide-react'

interface Property {
  id: string
  name: string
  address: string
}

export default function AddPropertyExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    description: ''
  })

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`)
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
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/properties/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: id,
          category: formData.category,
          amount: parseFloat(formData.amount),
          date: formData.date,
          description: formData.description,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create expense')
      }

      router.push(`/properties/${id}`)
    } catch (error) {
      console.error('Error creating expense:', error)
      setError('שגיאה ביצירת ההוצאה')
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
          <h1 className="text-3xl font-semibold text-white mb-2">הוסף הוצאה לנכס</h1>
          <p className="text-slate-400">{property.name} - {property.address}</p>
        </div>
        <Link href={`/properties/${id}`}>
          <Button variant="outline" className="btn-secondary">
            <X className="h-4 w-4 ml-2" />
            ביטול
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">פרטי ההוצאה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">קטגוריה *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  required
                >
                  <option value="">בחר קטגוריה</option>
                  <option value="maintenance">תחזוקה</option>
                  <option value="taxes">מיסים</option>
                  <option value="insurance">ביטוח</option>
                  <option value="management">ניהול</option>
                  <option value="utilities">חשמל ומים</option>
                  <option value="repairs">תיקונים</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">סכום *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">תאריך *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-white">תיאור</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="תיאור ההוצאה..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6">
              <Link href={`/properties/${id}`}>
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
                {isSaving ? 'שומר...' : 'שמור הוצאה'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
