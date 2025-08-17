"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { Save, X } from 'lucide-react'

export default function NewInvestmentPage() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    initialAmount: '',
    currentValue: '',
    date: '',
    returnRate: '',
    description: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form data:', formData)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">הוסף השקעה חדשה</h1>
          <p className="text-slate-400">הוסף השקעה פיננסית חדשה למערכת</p>
        </div>
        <Link href="/investments">
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
                <CardTitle className="text-white">פרטי ההשקעה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">שם ההשקעה</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      placeholder="לדוגמה: תיק השקעות מניות"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-slate-300">סוג השקעה</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="בחר סוג השקעה" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="stocks">מניות</SelectItem>
                        <SelectItem value="mutual_fund">קרן נאמנות</SelectItem>
                        <SelectItem value="pension">קופת גמל</SelectItem>
                        <SelectItem value="study_fund">קרן השתלמות</SelectItem>
                        <SelectItem value="savings">חיסכון</SelectItem>
                        <SelectItem value="bonds">אגרות חוב</SelectItem>
                        <SelectItem value="crypto">קריפטו</SelectItem>
                        <SelectItem value="other">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="initialAmount" className="text-slate-300">השקעה ראשונית</Label>
                    <Input
                      id="initialAmount"
                      type="number"
                      value={formData.initialAmount}
                      onChange={(e) => handleInputChange('initialAmount', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      placeholder="₪"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentValue" className="text-slate-300">ערך נוכחי</Label>
                    <Input
                      id="currentValue"
                      type="number"
                      value={formData.currentValue}
                      onChange={(e) => handleInputChange('currentValue', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      placeholder="₪"
                    />
                  </div>
                  <div>
                    <Label htmlFor="returnRate" className="text-slate-300">תשואה שנתית (%)</Label>
                    <Input
                      id="returnRate"
                      type="number"
                      step="0.1"
                      value={formData.returnRate}
                      onChange={(e) => handleInputChange('returnRate', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      placeholder="%"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="date" className="text-slate-300">תאריך התחלה</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-slate-300">תיאור</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="תיאור מפורט של ההשקעה..."
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
                <Button type="submit" className="w-full btn-primary">
                  <Save className="h-4 w-4 ml-2" />
                  שמור השקעה
                </Button>
                <Link href="/investments">
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
                    <span className="text-sm text-slate-400">פרטי ההשקעה</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">ערכים פיננסיים</span>
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
                  מלא את כל השדות הנדרשים כדי להוסיף השקעה חדשה למערכת.
                </p>
                <p className="text-sm text-slate-400">
                  תוכל לערוך את המידע מאוחר יותר מהדף הראשי של ההשקעות.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
} 