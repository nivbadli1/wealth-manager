"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { Save, X } from 'lucide-react'

export default function NewExpensePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.category) newErrors.category = 'יש לבחור קטגוריה'
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'יש להזין סכום חיובי'
    if (!formData.date) newErrors.date = 'יש לבחור תאריך'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: formData.category,
          amount: parseFloat(formData.amount),
          date: formData.date,
          description: formData.description || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'שגיאה ביצירת ההוצאה')
      }

      // Success - redirect to expenses page
      router.push('/expenses')
    } catch (error) {
      console.error('Error creating expense:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'אירעה שגיאה לא צפויה' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">הוסף הוצאה חדשה</h1>
          <p className="text-slate-400">הוסף הוצאה חדשה למערכת</p>
        </div>
        <Link href="/expenses">
          <Button variant="outline" className="btn-secondary">
            <X className="h-4 w-4 ml-2" />
            ביטול
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">פרטי ההוצאה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-slate-300">קטגוריה</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className={`bg-slate-700 border-slate-600 text-white ${errors.category ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="living">משק בית</SelectItem>
                        <SelectItem value="transportation">תחבורה</SelectItem>
                        <SelectItem value="healthcare">בריאות</SelectItem>
                        <SelectItem value="entertainment">בילויים</SelectItem>
                        <SelectItem value="education">חינוך</SelectItem>
                        <SelectItem value="shopping">קניות</SelectItem>
                        <SelectItem value="utilities">חשבונות</SelectItem>
                        <SelectItem value="insurance">ביטוח</SelectItem>
                        <SelectItem value="taxes">מיסים</SelectItem>
                        <SelectItem value="other">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                  </div>
                  <div>
                    <Label htmlFor="amount" className="text-slate-300">סכום</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white placeholder-slate-400 ${errors.amount ? 'border-red-500' : ''}`}
                      placeholder="₪"
                    />
                    {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="date" className="text-slate-300">תאריך</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`bg-slate-700 border-slate-600 text-white ${errors.date ? 'border-red-500' : ''}`}
                  />
                  {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
                </div>

                <div>
                  <Label htmlFor="description" className="text-slate-300">תיאור</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="תיאור מפורט של ההוצאה..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Form Actions */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">פעולות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {errors.submit && (
                  <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg">
                    <p className="text-red-400 text-sm">{errors.submit}</p>
                  </div>
                )}
                <Button type="submit" disabled={isLoading} className="w-full btn-primary">
                  <Save className="h-4 w-4 ml-2" />
                  {isLoading ? 'שומר...' : 'שמור הוצאה'}
                </Button>
                <Link href="/expenses">
                  <Button variant="outline" className="w-full btn-secondary">
                    <X className="h-4 w-4 ml-2" />
                    ביטול
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Form Progress */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">התקדמות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">קטגוריה</span>
                    <div className={`w-3 h-3 rounded-full ${formData.category ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">סכום</span>
                    <div className={`w-3 h-3 rounded-full ${formData.amount ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">תאריך</span>
                    <div className={`w-3 h-3 rounded-full ${formData.date ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">תיאור</span>
                    <div className={`w-3 h-3 rounded-full ${formData.description ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">עזרה</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 mb-3">
                  מלא את כל השדות הנדרשים כדי להוסיף הוצאה חדשה למערכת.
                </p>
                <p className="text-sm text-slate-400">
                  תוכל לערוך את המידע מאוחר יותר מהדף הראשי של ההוצאות.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}