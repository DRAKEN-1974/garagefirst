'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface RegistrationFormData {
  email: string
  password: string
  full_name: string
  department: string
}

export default function WorkerRegistration() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    password: '',
    full_name: '',
    department: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. Create worker profile with generated ID
        const { data: workerData, error: workerError } = await supabase
          .from('worker_users')
          .insert([
            {
              user_id: authData.user.id,
              full_name: formData.full_name,
              department: formData.department,
              worker_id: await generateWorkerId(),
              coins: 0 // Initial coins
            }
          ])
          .select()
          .single()

        if (workerError) throw workerError

        setSuccess(`Worker registered successfully! Worker ID: ${workerData.worker_id}`)
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Failed to register worker')
    } finally {
      setLoading(false)
    }
  }

  const generateWorkerId = async () => {
    const { data, error } = await supabase
      .rpc('generate_worker_id')

    if (error) throw error
    return data
  }

  return (
    <div className="worker-registration">
      <div className="registration-container">
        <h1>Worker Registration</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              <option value="engineering">Engineering</option>
              <option value="production">Production</option>
              <option value="maintenance">Maintenance</option>
              <option value="quality">Quality Control</option>
              <option value="logistics">Logistics</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Worker'}
          </button>
        </form>
      </div>
    </div>
  )
}