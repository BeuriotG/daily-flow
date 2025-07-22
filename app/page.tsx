'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Dashboard from './_components/dashboard'

export default function Home() {

  const { user, loading } = useAuth()

  const router = useRouter()


  if (loading) {
    return <div>Loading...</div>
  }
  if (!user) {
    router.push('/auth/login')
  }
  if (user && !loading) {
    return (
      <Dashboard />
    )
  }


}

