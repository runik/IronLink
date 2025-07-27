import { useLinks, useDeleteLink, type Link } from '../hooks/useLinks'
import { Button } from './ui/button'
import { Edit, Trash2 } from 'lucide-react'

export function LinksList() {
  const { data: links, isLoading, error } = useLinks()
  const deleteLink = useDeleteLink()

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Links</h2>
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="p-4">Loading links...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Links</h2>
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="p-4 text-red-600">Error loading links: {error.message}</div>
        </div>
      </div>
    )
  }

  if (!links || links.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Links</h2>
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="p-4 text-gray-500">No links found. Create your first link!</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Links</h2>
      <div className="rounded-lg py-4 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {links.map((link: Link) => (
            <div key={link.id} className="group p-4 border-2 border-gray-100 rounded-lg bg-background hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {link.title || 'Untitled Link'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{link.originalUrl}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Short: {window.location.origin}/r/{link.shortCode}
                  </p>
                  <p className="text-xs text-gray-500">
                    Clicks: {link.clicks} • Created: {new Date(link.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    onClick={() => {
                      // TODO: Implement edit functionality
                      console.log('Edit link:', link.id)
                    }}
                    variant="outline"
                    size="sm"
                    className="transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => deleteLink.mutate(link.id)}
                    disabled={deleteLink.isPending}
                    variant="destructive"
                    size="sm"
                    className="transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 