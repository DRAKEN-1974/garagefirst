'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import { 
  FaUserCircle, FaUsers, FaCalendar, FaCar, 
  FaCheckCircle, FaTimesCircle, FaSignOutOut 
} from 'react-icons/fa'
import './dashboard.css'

interface Booking {
  id: string;
  service: 'car-wash' | 'car-repair';
  customer_name: string;
  vehicle_model: string;
  date: string;
  time: string;
  status: 'pending' | 'in-progress' | 'completed';
  assigned_worker?: string;
}

interface Worker {
  id: string;
  email: string;
  full_name: string;
  status: 'pending' | 'approved' | 'rejected';
  specialty: string[];
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'workers'>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true })

      if (bookingsData) {
        setBookings(bookingsData)
      }

      // Fetch workers
      const { data: workersData } = await supabase
        .from('workers')
        .select('*')
        .neq('is_admin', true)

      if (workersData) {
        setWorkers(workersData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const assignWorker = async (bookingId: string, workerEmail: string) => {
    try {
      await supabase
        .from('bookings')
        .update({ assigned_worker: workerEmail })
        .eq('id', bookingId)

      await fetchDashboardData()
    } catch (error) {
      console.error('Error assigning worker:', error)
    }
  }

  const updateWorkerStatus = async (workerId: string, status: 'approved' | 'rejected') => {
    try {
      await supabase
        .from('workers')
        .update({ status })
        .eq('id', workerId)

      await fetchDashboardData()
    } catch (error) {
      console.error('Error updating worker status:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="profile-section">
          <FaUserCircle className="profile-icon" />
          <h2>Admin Dashboard</h2>
        </div>

        <nav className="dashboard-nav">
          <button 
            className={`nav-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <FaCalendar /> Bookings
          </button>
          <button 
            className={`nav-button ${activeTab === 'workers' ? 'active' : ''}`}
            onClick={() => setActiveTab('workers')}
          >
            <FaUsers /> Workers
          </button>
          <button onClick={handleSignOut} className="sign-out-button">
            <FaSignOutOut /> Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'bookings' ? (
          <section className="bookings-section">
            <h2>Service Bookings</h2>
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <motion.div 
                  key={booking.id}
                  className="booking-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="booking-header">
                    <FaCar className="service-icon" />
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-details">
                    <h3>{booking.customer_name}</h3>
                    <p>{booking.vehicle_model}</p>
                    <p>
                      <FaCalendar /> {new Date(booking.date).toLocaleDateString()}
                      {' '}{booking.time}
                    </p>
                  </div>

                  {!booking.assigned_worker && (
                    <div className="booking-actions">
                      <select 
                        onChange={(e) => assignWorker(booking.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Assign Worker</option>
                        {workers
                          .filter(w => w.status === 'approved')
                          .map(worker => (
                            <option key={worker.id} value={worker.email}>
                              {worker.full_name}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        ) : (
          <section className="workers-section">
            <h2>Worker Management</h2>
            <div className="workers-grid">
              {workers.map((worker) => (
                <motion.div 
                  key={worker.id}
                  className="worker-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="worker-header">
                    <FaUserCircle className="worker-icon" />
                    <span className={`status-badge ${worker.status}`}>
                      {worker.status}
                    </span>
                  </div>

                  <div className="worker-details">
                    <h3>{worker.full_name}</h3>
                    <p>{worker.email}</p>
                    <div className="specialty-tags">
                      {worker.specialty.map((spec, index) => (
                        <span key={index} className="specialty-tag">{spec}</span>
                      ))}
                    </div>
                  </div>

                  {worker.status === 'pending' && (
                    <div className="worker-actions">
                      <button 
                        onClick={() => updateWorkerStatus(worker.id, 'approved')}
                        className="action-button approve"
                      >
                        <FaCheckCircle /> Approve
                      </button>
                      <button 
                        onClick={() => updateWorkerStatus(worker.id, 'rejected')}
                        className="action-button reject"
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}