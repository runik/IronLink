import { useState } from 'react'
import { useUser, useLogout } from '../hooks/useAuth'
import { Button } from './ui/button'
import { AuthModal } from './AuthModal'

export function Header() {
  const { data: user, isLoading: userLoading } = useUser()
  const logout = useLogout()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleLogout = () => {
    logout.mutate()
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
  }

  return (
    <>
      <header className="bg-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">[ Iron Link ]</h1>
            </div>


            <div className="flex items-center space-x-4">
              {userLoading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-white">
                    {user.name || user.email}
                  </span>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    disabled={logout.isPending}
                  >
                    {logout.isPending ? 'Signing out...' : 'Sign Out'}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="default"
                  size="sm"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  )
} 