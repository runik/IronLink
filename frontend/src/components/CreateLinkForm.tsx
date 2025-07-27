import { useState } from 'react'
import { useCreateLink } from '../hooks/useLinks'
import { useUser } from '../hooks/useAuth'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { AuthModal } from './AuthModal'

export function CreateLinkForm() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingLinkData, setPendingLinkData] = useState<{
    originalUrl: string
    title?: string
    description?: string
  } | null>(null)
  
  const createLink = useCreateLink()
  const { data: user, isLoading: userLoading } = useUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) return

    const linkData = {
      originalUrl: url.trim(),
      title: title.trim() || undefined,
      description: description.trim() || undefined,
    }

    // Check if user is authenticated
    if (!user && !userLoading) {
      // Store the link data and show auth modal
      setPendingLinkData(linkData)
      setShowAuthModal(true)
      return
    }

    // User is authenticated, proceed with link creation
    createLink.mutate(linkData, {
      onSuccess: () => {
        // Reset form on success
        setUrl('')
        setTitle('')
        setDescription('')
      }
    })
  }

  const handleAuthSuccess = () => {
    // User has successfully authenticated, create the pending link
    if (pendingLinkData) {
      createLink.mutate(pendingLinkData, {
        onSuccess: () => {
          // Reset form on success
          setUrl('')
          setTitle('')
          setDescription('')
          setPendingLinkData(null)
        }
      })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-background">
        <h2 className="text-lg font-medium text-foreground">Create New Link</h2>
        
      <div>
        <Label htmlFor="url" className="block mb-1">
          Enter your long URL
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

    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      onSuccess={handleAuthSuccess}
    />
    </>
  )
} 