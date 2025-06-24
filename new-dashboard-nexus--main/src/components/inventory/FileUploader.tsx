"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { usePathname } from 'next/navigation'
import { uploadInventoryFile, uploadOrdersFile } from '@/lib/api'

export function FileUploader() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const pathname = usePathname()

  const triggerAnalyticsUpdate = () => {
    window.dispatchEvent(new Event('analyticsUpdated'))
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Reset states
    setError(null)
    setSuccess(null)

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      setError('Please upload an Excel or CSV file (.xlsx, .xls, .csv)')
      return
    }

    try {
      setUploading(true)
      const isOrdersPage = pathname?.includes('/orders')

      if (isOrdersPage) {
        try {
          const result = await uploadOrdersFile(file)
          console.log('Upload result:', result)
          if (result.error) {
            // Handle specific error cases
            if (result.error.includes('No inventory items found')) {
              setError('Please upload inventory data before adding orders.')
            } else if (result.error.includes('part_number') && result.error.includes('not present')) {
              setError('Some part numbers in your orders file do not exist in inventory. Please ensure all parts are added to inventory first.')
            } else {
              setError(result.error)
            }
          } else {
            setSuccess('Successfully uploaded orders')
            // Trigger both orders and analytics updates
            window.dispatchEvent(new Event('ordersUpdated'))
            setTimeout(triggerAnalyticsUpdate, 500)
          }
        } catch {
          setError('Failed to upload orders. Please ensure the file format is correct and try again.')
        }
      } else {
        try {
          const result = await uploadInventoryFile(file)
          console.log('Upload result:', result)
          if (result.error) {
            setError(result.error)
          } else {
            setSuccess('Successfully uploaded inventory items')
            // Trigger both inventory and analytics updates
            window.dispatchEvent(new Event('inventoryUpdated'))
            setTimeout(triggerAnalyticsUpdate, 500)
            // Add helpful message for next steps
            setTimeout(() => {
              setSuccess('Inventory uploaded successfully. You can now upload orders.')
            }, 2000)
          }
        } catch {
          setError('Failed to upload inventory. Please ensure the file format is correct and try again.')
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Upload error details:', err)
    } finally {
      setUploading(false)
    }
  }, [pathname])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-gray-600">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the file here</p>
        ) : (
          <div>
            <p className="text-gray-600">Drag and drop a file here, or click to select</p>
            <p className="text-sm text-gray-500 mt-2">Supported formats: .xlsx, .xls, .csv</p>
            {pathname?.includes('/orders') && (
              <p className="text-sm text-amber-600 mt-2">
                Note: Part numbers in orders must exist in inventory first. Please ensure all parts are added to inventory before uploading orders.
              </p>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
      
      {success && (
        <p className="mt-2 text-sm text-green-500">{success}</p>
      )}
    </div>
  )
}
