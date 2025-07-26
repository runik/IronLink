import { useState } from 'react'
import { Button } from '../components/ui/button'

function Index() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!originalUrl) {
      setError('Please enter a URL')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to shorten URL')
      }

      const data = await response.json()
      setShortenedUrl(data.shortenedUrl)
    } catch (err) {
      setError('Failed to shorten URL. Please try again.')
      console.error('Error shortening URL:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (shortenedUrl) {
      try {
        await navigator.clipboard.writeText(shortenedUrl)
        // You could add a toast notification here
        alert('URL copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy URL:', err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IronLink</h1>
          <p className="text-gray-600">Shorten your links with ease</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your long URL
            </label>
            <input
              type="url"
              id="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very-long-url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            variant="default"
            size="lg"
            className="w-full"
          >
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </Button>
        </form>

        {shortenedUrl && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-sm font-medium text-green-800 mb-2">Your shortened URL:</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shortenedUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm text-green-900"
              />
              <Button
                onClick={copyToClipboard}
                variant="secondary"
                size="sm"
              >
                Copy
              </Button>
            </div>
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