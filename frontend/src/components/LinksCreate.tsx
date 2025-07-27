import { useState } from 'react'
import { useCreateLink } from '../hooks/useLinks'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function CreateLinkForm() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  const createLink = useCreateLink()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) return

    const linkData = {
      originalUrl: url.trim(),
      title: title.trim() || undefined,
      description: description.trim() || undefined,
    }

    // Proceed with link creation regardless of authentication status
    createLink.mutate(linkData, {
      onSuccess: () => {
        // Reset form on success
        setUrl('')
        setTitle('')
        setDescription('')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg bg-background">
            
      <div>
        <Label htmlFor="url" className="block mb-1 text-lg font-medium text-foreground">
          Enter your long URL to create a short link
        </Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very-long-url"
          required
          autoComplete="off"
          variant={createLink.isError ? "error" : "default"}
          inputSize="lg"
        />
      </div>

      <Button
        type="submit"
        disabled={createLink.isPending || !url.trim()}
        variant="default"
        size="lg"
        className="w-full"
      >
        {createLink.isPending ? 'Creating...' : 'Create Link'}
      </Button>

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