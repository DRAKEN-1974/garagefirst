'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { FaTools, FaCar, FaUserCog, FaClock } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './about.css'

interface ServiceItem {
  icon: JSX.Element;
  title: string;
  description: string;
}

export default function Page() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98])
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const services: ServiceItem[] = [
    {
      icon: <FaTools className="service-icon" />,
      title: "ADVANCED DIAGNOSTICS",
      description: "State-of-the-art diagnostic equipment for precise problem identification"
    },
    {
      icon: <FaCar className="service-icon" />,
      title: "PERFORMANCE TUNING",
      description: "Expert performance optimization for maximum efficiency"
    },
    {
      icon: <FaUserCog className="service-icon" />,
      title: "PREVENTIVE MAINTENANCE",
      description: "Comprehensive maintenance services by certified technicians"
    },
    {
      icon: <FaClock className="service-icon" />,
      title: "EXPRESS SERVICE",
      description: "Quick and efficient service delivery with minimal wait times"
    }
  ]

  return (
    <div className="page-wrapper">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="hero"
        style={{ opacity, scale }}
      >
        <div className="hero-media">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero-video"
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src="/about1.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            SATISH GARAGE
          </motion.h1>
          <motion.div 
            className="animated-line"
            initial={{ width: 0 }}
            animate={{ width: '120px' }}
            transition={{ duration: 0.8, delay: 0.5 }}
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            EXCELLENCE IN AUTOMOTIVE SERVICE
          </motion.p>
        </div>
      </motion.section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <motion.div 
            className="about-grid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="about-content">
              <h2>OUR LEGACY</h2>
              <div className="section-line"></div>
              <p>
                Since 2024, Satish Garage has been the epitome of automotive excellence.
                Our unwavering commitment to quality and innovation has earned us the
                trust of thousands of satisfied clients.
              </p>
              <div className="stats-grid">
                {[
                  { number: "13+", text: "YEARS OF EXCELLENCE" },
                  { number: "10K+", text: "VEHICLES SERVICED" },
                  { number: "15+", text: "EXPERT TECHNICIANS" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="stat-box"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-text">{stat.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="about-image">
              <Image
                src="/adrien-fu-RMLt7FsuPOo-unsplash.jpg"
                alt="Satish Garage Facility"
                width={600}
                height={400}
                priority
                className="main-image"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <div className="services-content">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2>OUR SERVICES</h2>
              <div className="section-line"></div>
            </motion.div>

            <div className="services-grid">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="service-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  {service.icon}
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}