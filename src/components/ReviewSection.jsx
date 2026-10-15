import { useEffect, useState } from 'react'
import { FiStar } from 'react-icons/fi'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import { getProductReviews, getProductRating, getRatingDistribution } from '../services/reviewService'

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState({ average: 0, total: 0 })
  const [distribution, setDistribution] = useState({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadReviews()
  }, [productId])

  const loadReviews = async () => {
    try {
      const [reviewsData, ratingData, distData] = await Promise.all([
        getProductReviews(productId),
        getProductRating(productId),
        getRatingDistribution(productId)
      ])
      setReviews(reviewsData)
      setRating(ratingData)
      setDistribution(distData)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-navy dark:text-white mb-4">
              Customer Reviews
            </h3>
            <div className="flex items-center justify-center md:justify-start space-x-4">
              <span className="text-5xl font-bold text-navy dark:text-white">
                {rating.average}
              </span>
              <div>
                <div className="flex mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(rating.average)
                          ? 'text-gold fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Based on {rating.total} {rating.total === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 w-3">{star}</span>
                <FiStar className="w-4 h-4 text-gold fill-current" />
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gold h-2 rounded-full transition-all"
                    style={{ width: `${distribution[star]?.percentage || 0}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-10">
                  {distribution[star]?.count || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        <div className="mt-6 pt-6 border-t dark:border-gray-700">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-navy dark:bg-gold text-white dark:text-navy px-6 py-3 rounded-xl font-semibold hover:bg-gold dark:hover:bg-yellow-600 transition-all"
          >
            {showForm ? 'Cancel' : 'Write a Review ⭐'}
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <ReviewForm 
          productId={productId} 
          onReviewSubmitted={() => {
            setShowForm(false)
            loadReviews()
          }}
        />
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading reviews...</div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="text-4xl mb-3">⭐</div>
          <h3 className="text-lg font-semibold text-navy dark:text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  )
}

