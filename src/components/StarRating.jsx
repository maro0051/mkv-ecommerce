import { FiStar } from 'react-icons/fi'

export default function StarRating({ rating, onRate, size = 'md', interactive = false }) {
  const stars = [1, 2, 3, 4, 5]
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10'
  }

  return (
    <div className="flex items-center space-x-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate && onRate(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          disabled={!interactive}
        >
          <FiStar
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'text-gold fill-current'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

