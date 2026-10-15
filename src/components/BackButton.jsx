import { Link } from 'react-router-dom'
import { FiArrowLeft, FiChevronLeft } from 'react-icons/fi'

export default function BackButton({ to = '/shop', text = 'Back to Shop', variant = 'default' }) {
  
  const variants = {
    default: {
      container: 'group flex items-center space-x-2 px-4 py-2.5 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg hover:border-gold transition-all duration-300 hover:-translate-y-0.5',
      icon: 'w-4 h-4 text-gray-400 group-hover:text-gold transition-all duration-300 group-hover:-translate-x-1',
      text: 'text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gold transition-colors',
    },
    cute: {
      container: 'group flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-2 border-pink-200 dark:border-pink-800 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hover:-translate-y-1',
      icon: 'w-5 h-5 text-pink-400 group-hover:text-pink-500 transition-all duration-300 group-hover:-translate-x-1.5 group-hover:scale-110',
      text: 'text-sm font-semibold text-pink-600 dark:text-pink-400 group-hover:text-pink-700 dark:group-hover:text-pink-300 transition-colors',
      emoji: '🌸',
    },
    pill: {
      container: 'group flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gold/10 dark:bg-gold/20 border-2 border-gold/30 hover:border-gold shadow-md hover:shadow-lg hover:bg-gold/20 dark:hover:bg-gold/30 transition-all duration-300 hover:-translate-y-0.5',
      icon: 'w-4 h-4 text-gold group-hover:-translate-x-1 transition-all duration-300',
      text: 'text-sm font-medium text-gold transition-colors',
      emoji: '✨',
    },
    minimal: {
      container: 'group flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200',
      icon: 'w-4 h-4 text-gray-400 group-hover:text-gold group-hover:-translate-x-1 transition-all duration-300',
      text: 'text-sm text-gray-500 dark:text-gray-400 group-hover:text-gold transition-colors',
      emoji: '←',
    },
    bubbly: {
      container: 'group flex items-center space-x-2 px-4 py-2.5 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95',
      icon: 'relative',
      iconInner: 'w-4 h-4 text-gray-400 group-hover:text-gold transition-all duration-300 group-hover:-translate-x-1',
      text: 'text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gold transition-colors',
      dots: (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
        </span>
      ),
    },
  }

  const style = variants[variant] || variants.default

  return (
    <Link to={to} className={style.container}>
      <span className={style.icon}>
        {variant === 'bubbly' ? (
          <span className="relative">
            <FiArrowLeft className={style.iconInner} />
            {style.dots}
          </span>
        ) : (
          <FiArrowLeft className={style.icon} />
        )}
      </span>
      
      <span className={style.text}>
        {style.emoji && <span className="mr-1">{style.emoji}</span>}
        {text}
      </span>
    </Link>
  )
}

