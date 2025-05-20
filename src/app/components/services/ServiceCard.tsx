'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'

interface ServiceCardProps {
  service: {
    id: number
    title: string
    description: string
    video: string
    price: string
  }
  index: number
  onBookNow: () => void
}

export default function ServiceCard({ service, index, onBookNow }: ServiceCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <motion.div
      className="service-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="service-media">
        <video
          ref={videoRef}
          src={service.video}
          loop
          muted
          playsInline
        />
        <div className="service-overlay">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {service.title}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {service.description}
          </motion.p>
          <motion.span
            className="price"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {service.price}
          </motion.span>
          <motion.button
            className="book-now-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBookNow}
          >
            Book Appointment
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}