import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useCreateLink } from '../hooks/useLinks'

function Index() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  const createLink = useCreateLink()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!originalUrl) {
      return
    }

    createLink.mutate({
      originalUrl: originalUrl.trim(),
      title: title.trim() || undefined,
      description: description.trim() || undefined,
    }, {
      onSuccess: (data) => {
        // Reset form on success
        setOriginalUrl('')
        setTitle('')
        setDescription('')
      }
    })
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      // You could add a toast notification here
      alert('URL copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  // Get the shortened URL from the created link
  const shortenedUrl = createLink.data 
    ? `${window.location.origin}/r/${createLink.data.shortCode}`
    : ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IronLink</h1>
          <p className="text-gray-600">Shorten your links with ease</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="url" className="block mb-2">
              Enter your long URL *
            </Label>
            <Input
              type="url"
              id="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very-long-url"
              variant={createLink.isError ? "error" : "default"}
              inputSize="lg"
              required
            />
          </div>

          <div>
            <Label htmlFor="title" className="block mb-2">
              Title (optional)
            </Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My awesome link"
              inputSize="default"
            />
          </div>

          <div>
            <Label htmlFor="description" className="block mb-2">
              Description (optional)
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of this link"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {createLink.isError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              Error: {createLink.error?.message || 'Failed to create link'}
            </div>
          )}

          <Button
            type="submit"
            disabled={createLink.isPending || !originalUrl.trim()}
            variant="default"
            size="lg"
            className="w-full"
          >
            {createLink.isPending ? 'Creating...' : 'Shorten URL'}
          </Button>
        </form>

        {shortenedUrl && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <Label className="block text-sm font-medium text-green-800 mb-2">
              Your shortened URL:
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={shortenedUrl}
                readOnly
                variant="success"
                inputSize="default"
                className="flex-1"
              />
              <Button
                onClick={() => copyToClipboard(shortenedUrl)}
                variant="secondary"
                size="sm"
              >
                Copy
              </Button>
            </div>
            
            {createLink.data && (
              <div className="mt-3 text-sm text-green-700">
                <p><strong>Original URL:</strong> {createLink.data.originalUrl}</p>
                {createLink.data.title && (
                  <p><strong>Title:</strong> {createLink.data.title}</p>
                )}
                <p><strong>Clicks:</strong> {createLink.data.clicks}</p>
                <p><strong>Created:</strong> {new Date(createLink.data.createdAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        )}

        {createLink.isSuccess && (
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600 font-medium">
              ✅ Link created successfully!
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Fast, secure, and reliable link shortening
          </p>
        </div>
      </div>
    </div>
  )
}

export default Index 