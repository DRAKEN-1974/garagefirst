'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function WorkerSignupSuccess() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div 
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg 
            className="w-8 h-8 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Registration Successful!
        </h2>

        <p className="text-gray-600 mb-8">
          Your account has been created and is pending approval from the admin. 
          We will notify you via email once your account is approved.
        </p>

        <Link 
          href="/"
          className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  )
}