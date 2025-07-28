import { useState } from 'react'
import { Copy, Check, Plus } from 'lucide-react'
import validator from 'validator'
import { useCreateLink } from '../hooks/useLinks'
import { useUser } from '../hooks/useAuth'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { AuthModal } from './AuthModal'
import { LinksCreateAnimation } from './LinksCreateAnimation'

export function LinksCreate() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [urlError, setUrlError] = useState('')
  const [createdLink, setCreatedLink] = useState<{ shortCode: string; originalUrl: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [isPressing, setIsPressing] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingLinkData, setPendingLinkData] = useState<{ originalUrl: string; title?: string; description?: string } | null>(null)
  
  const createLink = useCreateLink()
  const { data: user } = useUser()

  // URL validation function using validator library
  const validateAndFormatUrl = (inputUrl: string): { isValid: boolean; formattedUrl?: string; error?: string } => {
    let trimmedUrl = inputUrl.trim()
    
    if (!trimmedUrl) {
      return { isValid: false, error: 'URL is required' }
    }

    // Check if URL already has protocol
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      trimmedUrl = `https://${trimmedUrl}`
    }   

    // Use validator library to check if it's a valid URL
    if (!validator.isURL(trimmedUrl, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
      allow_underscores: true,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: false
    })) {
      return { isValid: false, error: 'Please enter a valid URL' }
    }

    return { isValid: true, formattedUrl: trimmedUrl }
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

    // Check if user is authenticated
    if (!user) {
      // Store the link data and show auth modal
      setPendingLinkData(linkData)
      setShowAuthModal(true)
      return
    }

    // User is authenticated, proceed with link creation
    createLinkWithAnimation(linkData)
  }

  const createLinkWithAnimation = (linkData: { originalUrl: string; title?: string; description?: string }) => {
    // Trigger press animation
    setIsPressing(true)

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
        setPendingLinkData(null)
      },
      onError: () => {
        // Reset animation state on error
        setIsPressing(false)
      }
    })
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    
    // If we have pending link data, create the link now
    if (pendingLinkData) {
      createLinkWithAnimation(pendingLinkData)
    }
  }

  const handleAuthCancel = () => {
    setShowAuthModal(false)
    setPendingLinkData(null)
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

  const resetToForm = () => {
    setCreatedLink(null)
    setCopied(false)
    setIsPressing(false)
    setPendingLinkData(null)
    createLink.reset()
  }


  const errorState = () => {
    return (
      <div className="space-y-4 p-4 h-[200px]">      
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800 mb-4">
            Error: {createLink.error?.message || 'Failed to create link'}
          </div>
          <Button
            type="button"
            onClick={resetToForm}
            variant="default"
            size="lg"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const successState = () => {
    return (
      <div className="space-y-4 p-4 relative h-[200px]">      
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800 mb-2">
            Link created successfully!
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={`${window.location.origin}/${createdLink?.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-sm font-mono text-green-900 hover:bg-green-50 cursor-pointer transition-colors duration-200 underline decoration-green-400 decoration-2"
            >
              {window.location.origin}/{createdLink?.shortCode}
            </a>
            <Button
              type="button"
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              {copied ? (
                  <Check className="w-4 h-4 mr-1" />
              ) : (
                  <Copy className="w-4 h-4 mr-1" />
              )}
            </Button>
          </div>
          <div className="text-xs text-green-600 mt-1 mb-4">
            Redirects to: {createdLink?.originalUrl}
          </div>
          <Button
            type="button"
            onClick={resetToForm}
            variant="default"
            size="lg"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Link
          </Button>
        </div>
      </div>
    )
  }

  const formState = () => {
    return (
      <form onSubmit={handleSubmit} className="relative space-y-4 p-4 h-[200px]">
        <div>
          <Label className="block mb-1 text-lg font-medium text-foreground">
            Enter your long URL to create a short link
          </Label>
          <Input
            id="url"
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://example.com/very-long-url"
            // required
            autoComplete="off"
            variant={urlError ? "error" : "default"}
            inputSize="lg"
          />
          
          <div className="text-sm text-red-600 mt-1 min-h-[20px]">
            {urlError}
          </div>

        </div>

        <Button
          type="submit"
          // disabled={createLink.isPending || !url.trim()}
          variant="default"
          size="lg"
          className="w-full"
        >
          {createLink.isPending ? 'Shortening...' : 'Shorten'}
        </Button>
      </form>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <LinksCreateAnimation isPressing={isPressing}>
          <div className="h-[200px]">
            {createLink.isError && errorState()}
            {createLink.isSuccess && successState()}
            {!createLink.isError && !createLink.isSuccess && formState()}
          </div>
        </LinksCreateAnimation>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthCancel}
        onSuccess={handleAuthSuccess}
      />
    </>
  )
} 