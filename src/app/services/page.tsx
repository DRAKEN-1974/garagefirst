'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCar, FaTools, FaCalendar, FaClock } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './services.css'

interface BookingForm {
  service: 'car-wash' | 'car-repair';
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  vehicleModel: string;
  message: string;
}

export default function ServicesPage() {
  const [activeService, setActiveService] = useState<'car-wash' | 'car-repair'>('car-wash')
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    service: 'car-wash',
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    vehicleModel: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you'll add the logic to send the booking data to your admin dashboard
    console.log('Booking submitted:', bookingForm)
    // Reset form after submission
    setBookingForm({
      service: activeService,
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      vehicleModel: '',
      message: ''
    })
  }

  return (
    <div className="services-page">
      <Navbar />

      <main className="services-main">
        {/* Services Section */}
        <section className="services-hero">
          <div className="container">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              OUR SERVICES
            </motion.h1>
            <div className="service-tabs">
              <button
                className={`tab ${activeService === 'car-wash' ? 'active' : ''}`}
                onClick={() => {
                  setActiveService('car-wash')
                  setBookingForm(prev => ({ ...prev, service: 'car-wash' }))
                }}
              >
                <FaCar /> Car Wash
              </button>
              <button
                className={`tab ${activeService === 'car-repair' ? 'active' : ''}`}
                onClick={() => {
                  setActiveService('car-repair')
                  setBookingForm(prev => ({ ...prev, service: 'car-repair' }))
                }}
              >
                <FaTools /> Car Repair
              </button>
            </div>

            <div className="service-details">
              {activeService === 'car-wash' ? (
                <motion.div 
                  className="service-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2>Premium Car Wash</h2>
                  <p>Experience the finest car wash service with our expert team and premium cleaning products.</p>
                  <ul className="service-features">
                    <li>Exterior Hand Wash</li>
                    <li>Interior Vacuum & Cleaning</li>
                    <li>Tire & Rim Cleaning</li>
                    <li>Window & Mirror Polish</li>
                  </ul>
                </motion.div>
              ) : (
                <motion.div 
                  className="service-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2>Professional Car Repair</h2>
                  <p>Trust our certified mechanics to diagnose and repair your vehicle with precision.</p>
                  <ul className="service-features">
                    <li>Engine Diagnostics</li>
                    <li>Brake Service</li>
                    <li>Oil Change</li>
                    <li>General Repairs</li>
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section className="booking-section">
          <div className="container">
            <motion.div 
              className="booking-form-container"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2>Book Your Service</h2>
              <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={bookingForm.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={bookingForm.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="vehicleModel">Vehicle Model</label>
                    <input
                      type="text"
                      id="vehicleModel"
                      name="vehicleModel"
                      value={bookingForm.vehicleModel}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={bookingForm.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={bookingForm.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="message">Additional Notes</label>
                  <textarea
                    id="message"
                    name="message"
                    value={bookingForm.message}
                    onChange={handleInputChange}
                    rows={4}
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Book Appointment
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}