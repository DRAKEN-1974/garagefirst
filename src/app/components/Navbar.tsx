'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import './Navbar.css'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isWorker, setIsWorker] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        setIsAdmin(profile?.role === 'admin')
        setIsWorker(profile?.role === 'worker')
      }
    }

    checkAuthStatus()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setIsAdmin(false)
    setIsWorker(false)
    window.location.href = '/'
  }

  const navItems = [
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Shop', href: '/shop' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''} ${pathname === '/contact' || pathname === '/shop' || pathname === '/services' ? 'inner-page' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <Image
            src="/satishgaragewhite[1].png"
            alt="Sateesh Garage Logo"
            width={150}
            height={50}
            priority
            className="logo-image"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                href={item.href} 
                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
          {isLoggedIn ? (
            <div className="auth-buttons">
              {isAdmin && (
                <Link href="/admin">
                  <motion.button
                    className="admin-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fas fa-cog"></i> Dashboard
                  </motion.button>
                </Link>
              )}
              {isWorker && (
                <Link href="/worker-dashboard">
                  <motion.button
                    className="worker-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fas fa-tools"></i> Worker Dashboard
                  </motion.button>
                </Link>
              )}
              <motion.button
                className="logout-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </motion.button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link href="/auth/login">
                <motion.button 
                  className="login-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-user"></i> Login
                </motion.button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Mobile Menu */}
        <motion.div 
          className="mobile-menu"
          initial={false}
          animate={isMobileMenuOpen ? 'open' : 'closed'}
          variants={{
            open: { opacity: 1, x: 0 },
            closed: { opacity: 0, x: "100%" }
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={item.href} 
                className={`mobile-nav-link ${pathname === item.href ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link href="/admin">
                  <motion.button
                    className="mobile-admin-button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fas fa-cog"></i> Dashboard
                  </motion.button>
                </Link>
              )}
              {isWorker && (
                <Link href="/worker-dashboard">
                  <motion.button
                    className="mobile-worker-button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <i className="fas fa-tools"></i> Worker Dashboard
                  </motion.button>
                </Link>
              )}
              <motion.button
                className="mobile-logout-button"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </motion.button>
            </>
          ) : (
            <Link href="/auth/login">
              <motion.button 
                className="mobile-login-button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-user"></i> Login
              </motion.button>
            </Link>
          )}
        </motion.div>
      </div>
    </motion.nav>
  )
}