import { useLinks, useDeleteLink, useUpdateLink, type Link } from '../hooks/useLinks'
import { Button } from './ui/button'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { LinkEdit } from './LinkEdit'

export function LinksList() {
  const { data: links, isLoading, error } = useLinks()
  const deleteLink = useDeleteLink()
  const updateLink = useUpdateLink()
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [editErrors, setEditErrors] = useState<string[]>([])

  const handleEditClick = (link: Link) => {
    setEditingLink(link)
    setEditErrors([])
  }

  const handleSaveEdit = (id: string, data: { title: string; originalUrl: string; slug: string }) => {
    updateLink.mutate({
      id,
      data
    }, {
      onSuccess: () => {
        setEditingLink(null)
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
                  {window.location.origin}/{link.slug}
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
      <LinkEdit
        link={editingLink}
        isOpen={!!editingLink}
        onOpenChange={(open) => {
          if (!open) {
            setEditingLink(null)
            setEditErrors([])
          }
        }}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
        isPending={updateLink.isPending}
        isDeletePending={deleteLink.isPending}
        errors={editErrors}
      />
    </div>
  )
} 