"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Settings, User, Bell, Shield, Save, 
  Trash2, Database, RefreshCw, Download, Upload
} from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    currency: 'ILS',
    language: 'he',
    theme: 'dark',
    notifications: true,
    autoBackup: true,
    backupFrequency: 'weekly'
  })

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    // In a real app, you would save to database/localStorage
  }

  const handleReset = () => {
    setSettings({
      currency: 'ILS',
      language: 'he',
      theme: 'dark',
      notifications: true,
      autoBackup: true,
      backupFrequency: 'weekly'
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">הגדרות</h1>
          <p className="text-slate-400">הגדר את העדפות המערכת שלך</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              הגדרות כלליות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currency" className="text-slate-300">מטבע</Label>
              <Select value={settings.currency} onValueChange={(value) => setSettings({...settings, currency: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="ILS">שקל ישראלי (₪)</SelectItem>
                  <SelectItem value="USD">דולר אמריקאי ($)</SelectItem>
                  <SelectItem value="EUR">אירו (€)</SelectItem>
                  <SelectItem value="GBP">לירה שטרלינג (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language" className="text-slate-300">שפה</Label>
              <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="he">עברית</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="theme" className="text-slate-300">ערכת נושא</Label>
              <Select value={settings.theme} onValueChange={(value) => setSettings({...settings, theme: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="dark">כהה</SelectItem>
                  <SelectItem value="light">בהיר</SelectItem>
                  <SelectItem value="auto">אוטומטי</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="h-5 w-5" />
              התראות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300">התראות מערכת</Label>
                <p className="text-sm text-slate-400">קבל התראות על עדכונים חשובים</p>
              </div>
              <Button
                variant={settings.notifications ? "default" : "secondary"}
                size="sm"
                onClick={() => setSettings({...settings, notifications: !settings.notifications})}
              >
                {settings.notifications ? 'פעיל' : 'לא פעיל'}
              </Button>
            </div>

            <div>
              <Label htmlFor="backupFrequency" className="text-slate-300">תדירות גיבוי אוטומטי</Label>
              <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({...settings, backupFrequency: value})}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="daily">יומי</SelectItem>
                  <SelectItem value="weekly">שבועי</SelectItem>
                  <SelectItem value="monthly">חודשי</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300">גיבוי אוטומטי</Label>
                <p className="text-sm text-slate-400">גבה נתונים באופן אוטומטי</p>
              </div>
              <Button
                variant={settings.autoBackup ? "default" : "secondary"}
                size="sm"
                onClick={() => setSettings({...settings, autoBackup: !settings.autoBackup})}
              >
                {settings.autoBackup ? 'פעיל' : 'לא פעיל'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5" />
              ניהול נתונים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="btn-secondary">
                <Download className="h-4 w-4 ml-2" />
                ייצא נתונים
              </Button>
              <Button variant="outline" className="btn-secondary">
                <Upload className="h-4 w-4 ml-2" />
                ייבא נתונים
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-600">
              <Button variant="outline" className="btn-secondary w-full">
                <RefreshCw className="h-4 w-4 ml-2" />
                רענן נתונים
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              אבטחה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-slate-300">סיסמה נוכחית</Label>
              <Input
                id="currentPassword"
                type="password"
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="הכנס סיסמה נוכחית"
              />
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-slate-300">סיסמה חדשה</Label>
              <Input
                id="newPassword"
                type="password"
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="הכנס סיסמה חדשה"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-slate-300">אימות סיסמה</Label>
              <Input
                id="confirmPassword"
                type="password"
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="אימות סיסמה חדשה"
              />
            </div>

            <Button className="w-full btn-primary">
              <Shield className="h-4 w-4 ml-2" />
              שנה סיסמה
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            פעולות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">שמור הגדרות</h4>
              <p className="text-sm text-slate-400">שמור את כל השינויים שביצעת</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="btn-secondary"
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                איפוס
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                    שומר...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 ml-2" />
                    שמור הגדרות
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="card border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            אזור מסוכן
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-red-400">מחק את כל הנתונים</h4>
              <p className="text-sm text-slate-400">פעולה זו תמחק את כל הנתונים שלך לצמיתות</p>
            </div>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              מחק נתונים
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 