'use client'

import { useState } from 'react'
import { createClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import './login.css'

// Define the shape of the worker profile data
interface WorkerProfile {
  email: string
  is_admin: boolean
  status: string
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1]
        },
        set(name: string, value: string, options: { [key: string]: any }) {
          document.cookie = `${name}=${value}; path=/; max-age=${options['max-age'] || 0}`
        },
        remove(name: string, options: { [key: string]: any }) {
          document.cookie = `${name}=; path=/; max-age=0`
        },
      },
    }
  )

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw new Error(`Authentication failed: ${signInError.message}`)
      }

      if (!authData.user) {
        throw new Error('No user data returned after authentication')
      }

      // 2. Get worker data from worker_profiles
      const { data: worker, error: workerError } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('email', email)
        .single()

      if (workerError || !worker) {
        throw new Error(workerError ? `Error fetching worker data: ${workerError.message}` : 'Worker profile not found')
      }

      const typedWorker = worker as WorkerProfile

      // 3. Log the login attempt
      const { error: logError } = await supabase.from('login_logs').insert({
        user_email: email,
        status: 'success',
      })

      if (logError) {
        console.error('Failed to log login attempt:', logError.message)
        // Continue even if logging fails
      }

      // 4. Redirect based on role
      if (typedWorker.is_admin) {
        router.push('/admin-dashboard')
      } else if (typedWorker.status === 'approved') {
        router.push('/worker-dashboard')
      } else {
        throw new Error('Account pending approval')
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during login'
      setError(message)

      // Log failed attempt
      const { error: logError } = await supabase.from('login_logs').insert({
        user_email: email,
        status: 'failed',
        error_message: message,
      })

      if (logError) {
        console.error('Failed to log failed login attempt:', logError.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome Back</h1>
        <p>Login to your account</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
