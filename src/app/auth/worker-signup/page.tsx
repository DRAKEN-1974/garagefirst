'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import './WorkerSignup.css'

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  experience: string
  specialization: string
}

export default function WorkerSignup() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    experience: '',
    specialization: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) setError(null)
  }

  const createWorkerProfile = async (userId: string) => {
    const { error } = await supabase
      .from('worker_profiles')
      .insert([
        {
          auth_id: userId,
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          experience: formData.experience,
          specialization: formData.specialization
        }
      ])

    if (error) {
      console.error('Profile creation error:', error)
      throw new Error('Failed to create worker profile')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      // 1. Sign up user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: formData.fullName,
            role: 'worker'
          }
        }
      })

      if (signUpError) {
        throw signUpError
      }

      if (!data.user) {
        throw new Error('Signup failed')
      }

      // 2. Create worker profile
      await createWorkerProfile(data.user.id)

      // 3. Success - redirect
      router.push('/auth/worker-signup-success')
    } catch (err) {
      console.error('Signup error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during signup')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="worker-signup-container">
      <motion.div 
        className="signup-form-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="signup-title">Worker Registration</h2>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min. 6 characters)"
              required
              minLength={6}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience *</label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="select-field"
            >
              <option value="">Select your experience</option>
              <option value="0-1">Less than 1 year</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="specialization">Specialization *</label>
            <select
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="select-field"
            >
              <option value="">Select your specialization</option>
              <option value="mechanic">Mechanic</option>
              <option value="electrician">Auto Electrician</option>
              <option value="body_work">Body Work</option>
              <option value="painting">Painting</option>
              <option value="diagnostics">Diagnostics</option>
            </select>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-state">
                <span className="loading-spinner"></span>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="login-link">
          Already have an account?{' '}
          <Link href="/auth/worker-login">Login here</Link>
        </p>
      </motion.div>
    </div>
  )
}