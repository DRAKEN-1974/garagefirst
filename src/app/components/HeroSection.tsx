'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import './HeroSection.css'

export default function HeroSection() {
  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  return (
    <section className="hero-section">
      {/* Decorative Elements */}
      <div className="hero-decoration">
        <div className="circle-1"></div>
        <div className="circle-2"></div>
        <div className="line-pattern"></div>
      </div>

      <motion.div 
        className="hero-content"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        <div className="hero-text">
          <motion.span 
            className="hero-label"
            variants={fadeInUp}
          >
            PREMIUM AUTO SERVICE
          </motion.span>

          <motion.h1 
            className="hero-headline"
            variants={fadeInUp}
          >
            Elevating Auto Care
            <span className="hero-headline-accent">to an Art Form</span>
          </motion.h1>

          <motion.p 
            className="hero-description"
            variants={fadeInUp}
          >
            Where precision meets passion. Experience automotive service redefined 
            through expert craftsmanship and cutting-edge technology.
          </motion.p>

          <motion.div 
            className="hero-cta"
            variants={fadeInUp}
          >
            <button className="btn-primary">
              Schedule Service
            </button>
            <button className="btn-secondary">
              Explore Services
            </button>
          </motion.div>

          <motion.div 
            className="hero-stats"
            variants={fadeInUp}
          >
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Vehicles Serviced</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.2,
            ease: [0.25, 0.1, 0.25, 1.0]
          }}
        >
          <Image
            src="/carreapirhero.jpg"
            alt="Premium Auto Service Facility"
            fill
            priority
            className="image-cover"
          />
          <div className="image-overlay"></div>
        </motion.div>
      </motion.div>
    </section>
  )
}