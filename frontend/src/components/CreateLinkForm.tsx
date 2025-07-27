import { useState } from 'react'
import { useCreateLink } from '../hooks/useLinks'

export function CreateLinkForm() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  const createLink = useCreateLink()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) return

    createLink.mutate({
      originalUrl: url.trim(),
      title: title.trim() || undefined,
      description: description.trim() || undefined,
    }, {
      onSuccess: () => {
        // Reset form on success
        setUrl('')
        setTitle('')
        setDescription('')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-background">
      <h2 className="text-lg font-medium text-foreground">Create New Link</h2>
      
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-foreground mb-1">
          URL *
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
          Title (optional)
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My awesome link"
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of this link"
          rows={3}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <button
        type="submit"
        disabled={createLink.isPending || !url.trim()}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {createLink.isPending ? 'Creating...' : 'Create Link'}
      </button>

      {createLink.isError && (
        <div className="text-sm text-red-600">
          Error: {createLink.error?.message || 'Failed to create link'}
        </div>
      )}

      {createLink.isSuccess && (
        <div className="text-sm text-green-600">
          Link created successfully!
        </div>
      )}
    </form>
  )
} 