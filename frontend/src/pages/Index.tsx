import { useUser } from '../hooks/useAuth'
import { LinksCreate } from '../components/LinksCreate'
import { LinksList } from '../components/LinksList'
import { Header } from '../components/Header'

function Index() {
  const { data: user } = useUser()


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Header />

      <div className="flex-1 flex pt-10 sm:pt-50 justify-center px-4 overflow-x-hidden">
        <div className="max-w-2xl w-full">
            <LinksCreate />
            {user && <LinksList />}
        </div>
      </div>
    </div>
  )
}

export default Index 