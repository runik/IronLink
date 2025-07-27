import { useState } from 'react'
import { useLogin, useRegister } from '../hooks/useAuth'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const login = useLogin()
  const register = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLogin) {
      login.mutate(
        { email, password },
        {
          onSuccess: () => {
            onSuccess()
            onClose()
            setEmail('')
            setPassword('')
            setName('')
          },
        }
      )
    } else {
      register.mutate(
        { email, password, name: name.trim() || undefined },
        {
          onSuccess: () => {
            onSuccess()
            onClose()
            setEmail('')
            setPassword('')
            setName('')
          },
        }
      )
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" animation="slide">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? 'Sign In' : 'Create Account'}
          </DialogTitle>
          <DialogDescription>
            {isLogin 
              ? 'Enter your credentials to access your account'
              : 'Create a new account to get started'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex mb-4 border-b">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 ${
              isLogin
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 ${
              !isLogin
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="name">Name (optional)</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={login.isPending || register.isPending}
            className="w-full"
          >
            {login.isPending || register.isPending
              ? 'Processing...'
              : isLogin
              ? 'Sign In'
              : 'Create Account'}
          </Button>

          {(login.isError || register.isError) && (
            <div className="text-sm text-red-600">
              Error: {login.error?.message || register.error?.message || 'Authentication failed'}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
} 