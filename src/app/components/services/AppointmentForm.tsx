'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './AppointmentForm.module.css'

interface AppointmentFormProps {
  serviceType: string
  onClose: () => void
  onSuccess: (details: any) => void
}

export default function AppointmentForm({ 
  serviceType, 
  onClose,
  onSuccess 
}: AppointmentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    appointmentDate: '',
    vehicleDetails: '',
    specialRequests: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert([
          {
            user_id: user.id,
            service_type: serviceType,
            appointment_date: new Date(formData.appointmentDate).toISOString(),
            vehicle_details: formData.vehicleDetails,
            special_requests: formData.specialRequests
          }
        ])

      if (appointmentError) throw appointmentError

      onSuccess({
        serviceType,
        appointmentDate: formData.appointmentDate,
        vehicleDetails: formData.vehicleDetails,
        specialRequests: formData.specialRequests
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Book {serviceType}</h2>
      
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="appointmentDate">Preferred Date & Time</label>
        <input
          type="datetime-local"
          id="appointmentDate"
          required
          value={formData.appointmentDate}
          onChange={(e) => setFormData({
            ...formData,
            appointmentDate: e.target.value
          })}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="vehicleDetails">Vehicle Details</label>
        <input
          type="text"
          id="vehicleDetails"
          placeholder="Make, Model, Year"
          required
          value={formData.vehicleDetails}
          onChange={(e) => setFormData({
            ...formData,
            vehicleDetails: e.target.value
          })}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="specialRequests">Special Requests (Optional)</label>
        <textarea
          id="specialRequests"
          placeholder="Any special requirements?"
          value={formData.specialRequests}
          onChange={(e) => setFormData({
            ...formData,
            specialRequests: e.target.value
          })}
        />
      </div>

      <div className={styles.formActions}>
        <button 
          type="button" 
          onClick={onClose}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  )
}