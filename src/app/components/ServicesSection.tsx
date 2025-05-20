'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'
import './ServicesSection.css'

export default function ServicesSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const services = [
    {
      title: "Engine Diagnostics",
      description: "Advanced computer diagnostics to identify and resolve engine issues with precision and accuracy.",
      image: "/carwash.jpg",
      icon: "01"
    },
    {
      title: "Premium Service",
      description: "Comprehensive maintenance packages tailored to your vehicle's specific requirements.",
      image: "/engine1.avif",
      icon: "02"
    },
    {
      title: "Expert Repairs",
      description: "Professional repairs using state-of-the-art equipment and genuine manufacturer parts.",
      image: "/section3.webp",
      icon: "03"
    }
  ]


  return (
    <section className="services-section">
      <motion.div 
        className="services-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Header section remains the same */}
        <div className="services-header">
          <motion.h1 
            className="featured-text"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Featured
          </motion.h1>
          <div className="projects-row">
            <motion.div 
              className="video-pill"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <video 
                ref={videoRef}
                onClick={handleVideoClick}
                className="service-video"
                playsInline
                loop
                muted
              >
                <source src="/hero1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {!isVideoPlaying && (
                <div className="video-overlay">
                  <button className="play-button" onClick={handleVideoClick}>
                    ▶
                  </button>
                </div>
              )}
            </motion.div>
            <motion.h2 
              className="projects-text"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              services
            </motion.h2>
          </div>
        </div>

        {/* Updated Services Grid */}
        <motion.div 
          className="services-grid"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={service.title}
              className="service-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
              whileHover={{ y: -10 }}
            >
              <div className="card-image-container">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="card-image"
                />
                <span className="service-number">{service.icon}</span>
              </div>
              <div className="card-content">
                <h3 className="card-title">{service.title}</h3>
                <p className="card-description">{service.description}</p>
                <button className="card-button">
                  Explore Service
                  <span className="button-arrow">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}