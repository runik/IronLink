import { useLinks, useDeleteLink, useUpdateLink, type Link } from '../hooks/useLinks'
import { useUser } from '../hooks/useAuth'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Edit, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export function LinksList() {
  const { data: links, isLoading, error } = useLinks()
  const deleteLink = useDeleteLink()
  const updateLink = useUpdateLink()
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    shortCode: '',
    originalUrl: '',
  })
  const [editErrors, setEditErrors] = useState<string[]>([])

  

  const handleEditClick = (link: Link) => {
    setEditingLink(link)
    setEditForm({
      title: link.title || '',
      shortCode: link.shortCode,
      originalUrl: link.originalUrl
    })
    setEditErrors([])
  }

  const handleSaveEdit = () => {
    if (!editingLink) return

    updateLink.mutate({
      id: editingLink.id,
      data: {
        title: editForm.title,
        originalUrl: editForm.originalUrl,
        slug: editForm.shortCode
      }
    }, {
      onSuccess: () => {
        setEditingLink(null)
        setEditForm({ title: '', shortCode: '', originalUrl: '' })
        setEditErrors([])
      },
      onError: (error: any) => {
        // Handle server validation errors
        if (error.message && Array.isArray(error.message)) {
          setEditErrors(error.message)
        } else if (error.message) {
          setEditErrors([error.message])
        } else {
          setEditErrors(['An unexpected error occurred'])
        }
      }
    })
  }

  const handleDelete = (linkId: string) => {
    deleteLink.mutate(linkId)
    setEditingLink(null)
    setEditForm({ title: '', shortCode: '', originalUrl: '' })
    setEditErrors([])
  }

  const loadingState = () => {
    return (
      <div className="p-4">Loading links...</div>
    )
  }

  const errorState = () => {
    return (
  <div className="p-4 text-red-600">Error loading links: {error?.message}</div>
    )
  }

  const emptyState = () => {
    return (
      <div className="p-4 text-gray-500">No links found. Create your first link!</div>
    )
  }

  const successState = () => {
    return (
      <div className="space-y-4">
        {links?.map((link: Link) => (
          <div 
            key={link.id} 
            className="group p-4 border-2 border-gray-100 rounded-lg bg-background hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => handleEditClick(link)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  {link.title || link.originalUrl}
                </h3>
                {link.title && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {link.originalUrl}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {window.location.origin}/{link.shortCode}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Clicks: {link.clickCount}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Created: {new Date(link.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditClick(link)
                  }}
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-2 mt-10">
      <div className="space-y-4 p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Links</h2>
        <div className="rounded-lg p-4 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-xl ">

        {isLoading && loadingState()}
        {error && errorState()}
        {!isLoading && !error && (!links || links.length === 0) && emptyState()}
        {!isLoading && !error && links && links.length > 0 && successState()}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingLink} onOpenChange={(open) => {
        if (!open) {
          setEditingLink(null)
          setEditErrors([])
        }
      }}>
        <DialogContent className="sm:max-w-md" animation="slide">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Error Display */}
            {editErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="text-sm text-red-800 font-medium mb-2">Please fix the following errors:</div>
                <ul className="text-sm text-red-700 space-y-1">
                  {editErrors.map((error, index) => (
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
                onChange={(e) => {
                  setEditForm(prev => ({ ...prev, title: e.target.value }))
                  if (editErrors.length > 0) setEditErrors([])
                }}
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
                onChange={(e) => {
                  setEditForm(prev => ({ ...prev, originalUrl: e.target.value }))
                  if (editErrors.length > 0) setEditErrors([])
                }}
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
                  onChange={(e) => {
                    setEditForm(prev => ({ ...prev, shortCode: e.target.value }))
                    if (editErrors.length > 0) setEditErrors([])
                  }}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={() => editingLink && handleDelete(editingLink.id)}
              disabled={deleteLink.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingLink(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={updateLink.isPending}
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 