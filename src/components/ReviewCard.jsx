import { FiStar, FiCheckCircle } from 'react-icons/fi'

export default function ReviewCard({ review }) {
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
            <span className="text-gold font-bold text-sm">
              {review.user_name?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-navy dark:text-white text-sm">
                {review.user_name}
              </h4>
              {review.is_verified && (
                <span className="inline-flex items-center space-x-1 text-green-500 text-xs">
                  <FiCheckCircle className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>
        
        {/* Stars */}
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              className={`w-4 h-4 ${
                star <= review.rating
                  ? 'text-gold fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h5 className="font-semibold text-navy dark:text-white mb-2">
          {review.title}
        </h5>
      )}

      {/* Comment */}
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {review.comment}
      </p>
    </div>
  )
}

