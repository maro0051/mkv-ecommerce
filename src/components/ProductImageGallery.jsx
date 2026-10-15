import { useState, useEffect } from 'react'

export default function ProductImageGallery({ images, productImage, selectedColor }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const allImages = images && images.length > 0 ? images : []
  const displayImages = allImages.length > 0 
    ? allImages 
    : [{ image_url: productImage || 'https://placehold.co/600x600', color_name: '', color_hex: '' }]

  // When selectedColor changes, find matching image
  useEffect(() => {
    if (selectedColor && allImages.length > 0) {
      const matchingIndex = allImages.findIndex(
        img => img.color_name?.toLowerCase() === selectedColor.toLowerCase()
      )
      if (matchingIndex >= 0) {
        setSelectedIndex(matchingIndex)
      }
    }
  }, [selectedColor, allImages])

  const currentImage = displayImages[selectedIndex] || displayImages[0]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden relative">
        <img 
          src={currentImage.image_url} 
          alt="Product"
          className="w-full h-80 md:h-96 object-contain transition-all duration-300"
          onError={(e) => { e.target.src = 'https://placehold.co/600x600/f3f4f6/94a3b8?text=No+Image' }} 
        />
        
        {/* Color Indicator */}
        {currentImage.color_name && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span 
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: currentImage.color_hex || '#ccc' }} 
            />
            <span className="text-xs font-medium text-navy dark:text-white">
              {currentImage.color_name}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                selectedIndex === index 
                  ? 'border-gold ring-2 ring-gold/20 scale-105' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 opacity-70 hover:opacity-100'
              }`}
            >
              <img 
                src={image.image_url} 
                alt={`View ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/80x80' }} 
              />
              {image.color_name && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-0.5">
                  <p className="text-[8px] text-white text-center truncate px-1">{image.color_name}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

