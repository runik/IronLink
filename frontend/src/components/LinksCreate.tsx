import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useCreateLink } from '../hooks/useLinks'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function CreateLinkForm() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [urlError, setUrlError] = useState('')
  const [createdLink, setCreatedLink] = useState<{ shortCode: string; originalUrl: string } | null>(null)
  const [copied, setCopied] = useState(false)
  
  const createLink = useCreateLink()

  // URL validation function
  const validateAndFormatUrl = (inputUrl: string): { isValid: boolean; formattedUrl?: string; error?: string } => {
    const trimmedUrl = inputUrl.trim()
    
    if (!trimmedUrl) {
      return { isValid: false, error: 'URL is required' }
    }

    // Check if URL already has protocol
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      try {
        new URL(trimmedUrl)
        return { isValid: true, formattedUrl: trimmedUrl }
      } catch {
        return { isValid: false, error: 'Invalid URL format' }
      }
    }

    // Check if it's a valid domain format (e.g., example.com)
    const domainRegex = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/
    
    if (domainRegex.test(trimmedUrl)) {
      return { isValid: true, formattedUrl: `https://${trimmedUrl}` }
    }
    else{
      return { isValid: false, error: 'Please enter a complete domain (e.g., example.com)' }
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    
    // Clear error when user starts typing
    if (urlError) {
      setUrlError('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateAndFormatUrl(url)
    
    if (!validation.isValid) {
      setUrlError(validation.error || 'Invalid URL')
      return
    }

    const linkData = {
      originalUrl: validation.formattedUrl!,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
    }

    // Proceed with link creation regardless of authentication status
    createLink.mutate(linkData, {
      onSuccess: (data) => {
        // Store the created link data
        setCreatedLink({
          shortCode: data.shortCode,
          originalUrl: data.originalUrl
        })
        // Reset form on success
        setUrl('')
        setTitle('')
        setDescription('')
        setUrlError('')
        setCopied(false)
      }
    })
  }

  const copyToClipboard = async () => {
    if (!createdLink) return
    
    const shortUrl = `${window.location.origin}/${createdLink.shortCode}`
    
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
            
      <div>
        <Label htmlFor="url" className="block mb-1 text-lg font-medium text-foreground">
          Enter your long URL to create a short link
        </Label>
        <Input
          id="url"
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://example.com/very-long-url"
          required
          autoComplete="off"
          variant={urlError || createLink.isError ? "error" : "default"}
          inputSize="lg"
        />
        {urlError && (
          <div className="text-sm text-red-600 mt-1">
            {urlError}
          </div>
        )}
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

      {createLink.isSuccess && createdLink && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800 mb-2">
            Link created successfully!
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-2 bg-white border border-green-300 rounded text-sm font-mono text-green-900">
              {window.location.origin}/{createdLink.shortCode}
            </div>
            <Button
              type="button"
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="text-xs text-green-600 mt-1">
            Redirects to: {createdLink.originalUrl}
          </div>
        </div>
      )}
    </form>
  )
} 