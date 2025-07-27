import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useCreateLink } from '../hooks/useLinks'
import { useUser } from '../hooks/useAuth'
import { CreateLinkForm } from '../components/LinksCreate'
import { LinksList } from '../components/LinksList'
import { Header } from '../components/Header'

function Index() {
  const { data: user } = useUser()


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Create Link Form */}
            <CreateLinkForm />

            {/* Links List - Only visible for authenticated users */}
            {user && <LinksList />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index 