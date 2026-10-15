import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import StarRating from './StarRating'
import { submitReview } from '../services/reviewService'
import toast from 'react-hot-toast'

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    rating: 5,
    title: '',
    comment: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.user_name.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (!formData.comment.trim()) {
      toast.error('Please write a review')
      return
    }
    if (formData.comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters')
      return
    }

    setSubmitting(true)
    try {
      await submitReview({
        product_id: productId,
        user_name: formData.user_name,
        user_email: formData.user_email,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment
      })
      
      toast.success('Review submitted! Thank you! ⭐')
      setFormData({ user_name: '', user_email: '', rating: 5, title: '', comment: '' })
      
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (error) {
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-navy dark:text-white mb-6">
        Write a Review
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-navy dark:text-white mb-3">
            Your Rating
          </label>
          <StarRating 
            rating={formData.rating} 
            onRate={(rating) => setFormData({...formData, rating})}
            size="xl"
            interactive={true}
          />
        </div>

        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={formData.user_name}
              onChange={(e) => setFormData({...formData, user_name: e.target.value})}
              required
              placeholder="John D."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.user_email}
              onChange={(e) => setFormData({...formData, user_email: e.target.value})}
              placeholder="john@email.com"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all text-sm"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
            Review Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Summary of your experience"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all text-sm"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
            Your Review *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
            required
            rows="4"
            minLength="10"
            placeholder="Share your experience with this product..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all text-sm resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Minimum 10 characters
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center space-x-2 bg-gold text-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all disabled:opacity-50"
        >
          <FiSend className="w-5 h-5" />
          <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
        </button>
      </form>
    </div>
  )
}

