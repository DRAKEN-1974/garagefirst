'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import { FaUserCircle, FaCalendar, FaTools, FaCar, FaSignOutOut } from 'react-icons/fa'
import './worker-dashboard.css'

interface Booking {
  id: string;
  service: 'car-wash' | 'car-repair';
  customer_name: string;
  vehicle_model: string;
  date: string;
  time: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface WorkerProfile {
  full_name: string;
  email: string;
  specialty: string[];
  total_services: number;
}

export default function WorkerDashboard() {
  const [assignments, setAssignments] = useState<Booking[]>([])
  const [profile, setProfile] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchWorkerData()
  }, [])

  const fetchWorkerData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch worker profile
      const { data: workerData } = await supabase
        .from('workers')
        .select('*')
        .eq('email', user.email)
        .single()

      if (workerData) {
        setProfile(workerData)
      }

      // Fetch assigned bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('assigned_worker', user.email)
        .order('date', { ascending: true })

      if (bookings) {
        setAssignments(bookings)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)

      await fetchWorkerData()
    } catch (error) {
      console.error('Error updating status:', error)
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
          <h2>{profile?.full_name}</h2>
          <p>{profile?.email}</p>
        </div>

        <nav className="dashboard-nav">
          <button className="nav-button active">
            <FaCalendar /> Assignments
          </button>
          <button className="nav-button">
            <FaTools /> Services
          </button>
          <button onClick={handleSignOut} className="sign-out-button">
            <FaSignOutOut /> Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Worker Dashboard</h1>
          <div className="stats">
            <div className="stat-card">
              <h3>Today's Tasks</h3>
              <p>{assignments.filter(a => a.date === new Date().toISOString().split('T')[0]).length}</p>
            </div>
            <div className="stat-card">
              <h3>Total Services</h3>
              <p>{profile?.total_services || 0}</p>
            </div>
          </div>
        </header>

        <section className="assignments-section">
          <h2>Current Assignments</h2>
          <div className="assignments-grid">
            {assignments.map((assignment) => (
              <motion.div 
                key={assignment.id}
                className="assignment-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="assignment-header">
                  <FaCar className="service-icon" />
                  <span className={`status-badge ${assignment.status}`}>
                    {assignment.status}
                  </span>
                </div>

                <div className="assignment-details">
                  <h3>{assignment.customer_name}</h3>
                  <p>{assignment.vehicle_model}</p>
                  <p>
                    <FaCalendar /> {new Date(assignment.date).toLocaleDateString()}
                    {' '}{assignment.time}
                  </p>
                </div>

                <div className="assignment-actions">
                  {assignment.status === 'pending' && (
                    <button 
                      onClick={() => updateBookingStatus(assignment.id, 'in-progress')}
                      className="action-button start"
                    >
                      Start Service
                    </button>
                  )}
                  {assignment.status === 'in-progress' && (
                    <button 
                      onClick={() => updateBookingStatus(assignment.id, 'completed')}
                      className="action-button complete"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}