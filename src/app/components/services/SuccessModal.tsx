'use client'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import styles from './SuccessModal.module.css'

interface SuccessModalProps {
  booking: {
    serviceType: string
    appointmentDate: Date
    vehicleDetails: string
    specialRequests?: string
  }
  onClose: () => void
}

export default function SuccessModal({ booking, onClose }: SuccessModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <motion.div 
        className={styles.modalContent}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className={styles.successIcon}>✓</div>
        <h2>Booking Confirmed!</h2>
        <div className={styles.bookingDetails}>
          <div className={styles.detail}>
            <span>Service:</span>
            <span>{booking.serviceType}</span>
          </div>
          <div className={styles.detail}>
            <span>Date & Time:</span>
            <span>{format(new Date(booking.appointmentDate), 'PPpp')}</span>
          </div>
          <div className={styles.detail}>
            <span>Vehicle:</span>
            <span>{booking.vehicleDetails}</span>
          </div>
          {booking.specialRequests && (
            <div className={styles.detail}>
              <span>Special Requests:</span>
              <span>{booking.specialRequests}</span>
            </div>
          )}
        </div>
        <p className={styles.note}>
          You will receive a confirmation email shortly with these details.
        </p>
        <button 
          className={styles.closeButton}
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </div>
  )
}