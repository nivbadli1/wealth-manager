"use client"

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Download, Upload, Database, FileText, CheckCircle, AlertCircle, 
  Trash2, RefreshCw, HardDrive, Cloud
} from 'lucide-react'

interface ImportResult {
  success: number
  errors: number
  details: Array<{
    type: string
    name?: string
    source?: string
    category?: string
    status: 'success' | 'error'
    error?: string
  }>
}

export default function DataManagementPage() {
  const [importType, setImportType] = useState('all')
  const [exportType, setExportType] = useState('all')
  const [exportFormat, setExportFormat] = useState('json')
  const [importing, setImporting] = useState(false)
  const [importResults, setImportResults] = useState<ImportResult | null>(null)
  const [exporting, setExporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    setImportResults(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', importType)

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setImportResults(result.results)
      } else {
        const error = await response.json()
        alert(`Import failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Import error:', error)
      alert('Import failed. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)

    try {
      const response = await fetch(`/api/export?type=${exportType}&format=${exportFormat}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 
                    `wealth-manager-${exportType}.${exportFormat}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const error = await response.json()
        alert(`Export failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const clearImportResults = () => {
    setImportResults(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2">ניהול נתונים</h1>
          <p className="text-slate-400">ייצוא וייבוא נתונים לגיבוי וניידות</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Section */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="h-5 w-5" />
              ייבוא נתונים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                סוג ייבוא
              </label>
              <Select value={importType} onValueChange={setImportType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">כל הנתונים</SelectItem>
                  <SelectItem value="properties">נכסים בלבד</SelectItem>
                  <SelectItem value="investments">השקעות בלבד</SelectItem>
                  <SelectItem value="income">הכנסות בלבד</SelectItem>
                  <SelectItem value="expenses">הוצאות בלבד</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-400">
                פורמטים נתמכים: JSON, CSV
              </p>
              <Button 
                onClick={triggerFileInput}
                disabled={importing}
                className="w-full btn-secondary"
              >
                {importing ? (
                  <>
                    <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                    מייבא...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 ml-2" />
                    בחר קובץ לייבוא
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                onChange={handleImport}
                className="hidden"
              />
            </div>

            {/* Import Results */}
            {importResults && (
              <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">תוצאות ייבוא</h4>
                  <Button
                    onClick={clearImportResults}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center p-2 bg-green-500/20 rounded-lg">
                    <div className="text-green-400 font-bold">{importResults.success}</div>
                    <div className="text-sm text-slate-300">הוכן בהצלחה</div>
                  </div>
                  <div className="text-center p-2 bg-red-500/20 rounded-lg">
                    <div className="text-red-400 font-bold">{importResults.errors}</div>
                    <div className="text-sm text-slate-300">שגיאות</div>
                  </div>
                </div>

                {importResults.details.length > 0 && (
                  <div className="max-h-40 overflow-y-auto">
                    {importResults.details.map((detail, index) => (
                      <div key={index} className="flex items-center gap-2 py-1">
                        {detail.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-sm text-slate-300">
                          {detail.type}: {detail.name || detail.source || detail.category || 'Unknown'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="h-5 w-5" />
              ייצוא נתונים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                סוג ייצוא
              </label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">כל הנתונים</SelectItem>
                  <SelectItem value="properties">נכסים בלבד</SelectItem>
                  <SelectItem value="investments">השקעות בלבד</SelectItem>
                  <SelectItem value="income">הכנסות בלבד</SelectItem>
                  <SelectItem value="expenses">הוצאות בלבד</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                פורמט ייצוא
              </label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleExport}
              disabled={exporting}
              className="w-full btn-primary"
            >
              {exporting ? (
                <>
                  <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                  מייצא...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 ml-2" />
                  ייצא נתונים
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data Information */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5" />
            מידע על הנתונים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <HardDrive className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">גיבוי נתונים</p>
                  <p className="text-white font-semibold">מומלץ</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">פורמטים נתמכים</p>
                  <p className="text-white font-semibold">JSON, CSV</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Cloud className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">ניידות נתונים</p>
                  <p className="text-white font-semibold">מלאה</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">אימות נתונים</p>
                  <p className="text-white font-semibold">אוטומטי</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="card">
        <CardHeader>
          <CardTitle className="text-white">הוראות שימוש</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">ייבוא נתונים</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• בחר את סוג הנתונים שברצונך לייבא</li>
                <li>• העלה קובץ JSON או CSV</li>
                <li>• המערכת תאמת את הנתונים אוטומטית</li>
                <li>• בדוק את תוצאות הייבוא</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">ייצוא נתונים</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• בחר את סוג הנתונים לייצוא</li>
                <li>• בחר פורמט ייצוא (JSON או CSV)</li>
                <li>• הקובץ יורד אוטומטית</li>
                <li>• שמור את הקובץ במקום בטוח</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 