import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { type Link } from '../hooks/useLinks'

interface LinkEditProps {
  link: Link | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, data: { title: string; originalUrl: string; slug: string }) => void
  onDelete: (id: string) => void
  isPending: boolean
  isDeletePending: boolean
  errors: string[]
}

export function LinkEdit({
  link,
  isOpen,
  onOpenChange,
  onSave,
  onDelete,
  isPending,
  isDeletePending,
  errors
}: LinkEditProps) {
  const [editForm, setEditForm] = useState({
    title: '',
    shortCode: '',
    originalUrl: '',
  })

  // Reset form when link changes
  useEffect(() => {
    if (link) {
      setEditForm({
        title: link.title || '',
        shortCode: link.shortCode,
        originalUrl: link.originalUrl
      })
    }
  }, [link])

  const handleSave = () => {
    if (!link) return

    onSave(link.id, {
      title: editForm.title,
      originalUrl: editForm.originalUrl,
      slug: editForm.shortCode
    })
  }

  const handleInputChange = (field: keyof typeof editForm, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditForm({ title: '', shortCode: '', originalUrl: '' })
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" animation="slide">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Error Display */}
          {errors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-800 font-medium mb-2">Please fix the following errors:</div>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Name (optional)
            </label>
            <Input
              id="title"
              placeholder="Enter a name for your link"
              value={editForm.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="originalUrl" className="text-sm font-medium">
              Original URL
            </label>
            <Input
              id="originalUrl"
              placeholder="https://example.com"
              value={editForm.originalUrl}
              onChange={(e) => handleInputChange('originalUrl', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="shortCode" className="text-sm font-medium">
              Slug
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {window.location.origin}/
              </span>
              <Input
                id="shortCode"
                placeholder="custom-slug"
                value={editForm.shortCode}
                onChange={(e) => handleInputChange('shortCode', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={() => link && onDelete(link.id)}
            disabled={isDeletePending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending}
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 