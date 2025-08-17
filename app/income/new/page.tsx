"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Save, X } from 'lucide-react'

export default function NewIncomePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: '',
    category: '',
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

    if (!formData.source.trim()) {
      newErrors.source = 'מקור ההכנסה הוא שדה חובה'
    }
    if (!formData.category) {
      newErrors.category = 'קטגוריה היא שדה חובה'
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'סכום חייב להיות גדול מ-0'
    }
    if (!formData.date) {
      newErrors.date = 'תאריך הוא שדה חובה'
    }

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
      const response = await fetch('/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: formData.source,
          amount: formData.amount,
          date: formData.date,
          category: formData.category,
          description: formData.description || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'שגיאה ביצירת ההכנסה')
      }

      // Success - redirect to income page
      router.push('/income')
    } catch (error) {
      console.error('Error creating income:', error)
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
          <h1 className="text-3xl font-semibold text-white mb-2">הוסף הכנסה חדשה</h1>
          <p className="text-slate-400">הוסף הכנסה חדשה למערכת</p>
        </div>
        <Link href="/income">
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
                <CardTitle className="text-white">פרטי ההכנסה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="source" className="text-slate-300">מקור ההכנסה</Label>
                    <Input
                      id="source"
                      value={formData.source}
                      onChange={(e) => handleInputChange('source', e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white placeholder-slate-400 ${errors.source ? 'border-red-500' : ''}`}
                      placeholder="לדוגמה: משכורת חודשית"
                    />
                    {errors.source && <p className="text-red-400 text-sm mt-1">{errors.source}</p>}
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-slate-300">קטגוריה</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className={`bg-slate-700 border-slate-600 text-white ${errors.category ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="salary">משכורת</SelectItem>
                        <SelectItem value="freelance">פרילנס</SelectItem>
                        <SelectItem value="rental">שכירות</SelectItem>
                        <SelectItem value="dividends">דיבידנדים</SelectItem>
                        <SelectItem value="bonus">בונוס</SelectItem>
                        <SelectItem value="other">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount" className="text-slate-300">סכום</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white placeholder-slate-400 ${errors.amount ? 'border-red-500' : ''}`}
                      placeholder="₪"
                    />
                    {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount}</p>}
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
                </div>

                <div>
                  <Label htmlFor="description" className="text-slate-300">תיאור</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="תיאור מפורט של ההכנסה..."
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
                  <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg">
                    <p className="text-red-400 text-sm">{errors.submit}</p>
                  </div>
                )}
                <Button type="submit" disabled={isLoading} className="w-full btn-primary">
                  <Save className="h-4 w-4 ml-2" />
                  {isLoading ? 'שומר...' : 'שמור הכנסה'}
                </Button>
                <Link href="/income">
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
                    <span className="text-sm text-slate-400">פרטי ההכנסה</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">קטגוריה</span>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">תיאור</span>
                    <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
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
                  מלא את כל השדות הנדרשים כדי להוסיף הכנסה חדשה למערכת.
                </p>
                <p className="text-sm text-slate-400">
                  תוכל לערוך את המידע מאוחר יותר מהדף הראשי של ההכנסות.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
} 