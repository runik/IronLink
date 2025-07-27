import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useCreateLink } from '../hooks/useLinks'
import { useUser, useLogout } from '../hooks/useAuth'
import { CreateLinkForm } from '../components/CreateLinkForm'

function Index() {
  const createLink = useCreateLink()
  const { data: user } = useUser()
  const logout = useLogout()

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
          
          {user && (
            <div className="mt-4 flex items-center justify-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.name || user.email}
              </span>
              <Button
                onClick={() => logout.mutate()}
                variant="secondary"
                size="sm"
                disabled={logout.isPending}
              >
                {logout.isPending ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          )}
        </div>

        <CreateLinkForm />

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