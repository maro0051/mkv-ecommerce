export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700" />
        
        {/* Spinning ring */}
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-gold animate-spin" />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-gold rounded-full animate-pulse" />
        </div>
      </div>
      
      <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm font-medium animate-pulse">
        Loading...
      </p>
    </div>
  )
}

