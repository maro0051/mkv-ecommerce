import { useState, useEffect } from 'react'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

export default function InactivityWarning({ isOpen, onStay, timeLeft }) {
  if (!isOpen) return null

  const seconds = Math.ceil(timeLeft / 1000)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center animate-slide-down">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <h2 className="text-xl font-bold text-navy dark:text-white mb-2">
          Session Expiring!
        </h2>
        
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          You've been inactive for a while.
        </p>
        
        <p className="text-2xl font-bold text-red-500 mb-6">
          {seconds} seconds remaining
        </p>
        
        <div className="space-y-3">
          <button
            onClick={onStay}
            className="w-full flex items-center justify-center space-x-2 bg-gold text-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all"
          >
            <FiRefreshCw className="w-5 h-5" />
            <span>I'm Still Here</span>
          </button>
          
          <p className="text-xs text-gray-400">
            You'll be automatically logged out for security
          </p>
        </div>
      </div>
    </div>
  )
}

