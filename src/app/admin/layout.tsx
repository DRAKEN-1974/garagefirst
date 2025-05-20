'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      const { data: isAdmin } = await supabase
        .rpc('is_admin', { user_id: session.user.id })

      if (!isAdmin) {
        router.push('/')
        return
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error checking admin status:', error)
      router.push('/auth/login')
    }
  }

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}