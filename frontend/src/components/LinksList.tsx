import { useLinks, useDeleteLink, type Link } from '../hooks/useLinks'

export function LinksList() {
  const { data: links, isLoading, error } = useLinks()
  const deleteLink = useDeleteLink()

  if (isLoading) {
    return <div className="p-4">Loading links...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600">Error loading links: {error.message}</div>
  }

  if (!links || links.length === 0) {
    return <div className="p-4 text-gray-500">No links found. Create your first link!</div>
  }

  return (
    <div className="space-y-4">
      {links.map((link: Link) => (
        <div key={link.id} className="p-4 border rounded-lg bg-background">
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
            <button
              onClick={() => deleteLink.mutate(link.id)}
              disabled={deleteLink.isPending}
              className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 disabled:opacity-50"
            >
              {deleteLink.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
} 