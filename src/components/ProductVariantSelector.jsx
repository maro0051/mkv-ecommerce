import { useState } from 'react'
import { FiCheck } from 'react-icons/fi'

export default function ProductVariantSelector({ variants, selectedVariant, onSelect, productImages = [] }) {
  if (!variants || variants.length === 0) return null

  const groupedVariants = variants.reduce((acc, variant) => {
    if (!acc[variant.name]) {
      acc[variant.name] = []
    }
    acc[variant.name].push(variant)
    return acc
  }, {})

  const colorMap = {
    'black': '#000000', 'white': '#FFFFFF', 'gold': '#D4AF37',
    'silver': '#C0C0C0', 'rose gold': '#E8B4B8', 'navy': '#0F172A',
    'red': '#EF4444', 'blue': '#3B82F6', 'green': '#10B981',
    'purple': '#8B5CF6', 'pink': '#EC4899', 'brown': '#92400E',
    'gray': '#6B7280', 'grey': '#6B7280', 'orange': '#F97316',
    'beige': '#F5F5DC', 'cream': '#FFFDD0', 'burgundy': '#800020',
    'champagne': '#F7E7CE', 'yellow': '#EAB308', 'teal': '#14B8A6',
  }

  const getColorHex = (colorName) => {
    return colorMap[colorName.toLowerCase()] || '#CCCCCC'
  }

  // Find matching image for a color
  const getColorImage = (colorName) => {
    if (!productImages || productImages.length === 0) return null
    const match = productImages.find(
      img => img.color_name?.toLowerCase() === colorName.toLowerCase()
    )
    return match?.image_url || null
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedVariants).map(([variantName, items]) => (
        <div key={variantName}>
          <label className="block text-sm font-semibold text-navy dark:text-white mb-3">
            {variantName}:{' '}
            <span className="text-gold font-bold">{selectedVariant?.value || 'Select'}</span>
          </label>
          
          <div className="flex flex-wrap gap-2">
            {items.map((variant) => {
              const isColor = variantName.toLowerCase().includes('color')
              const isSelected = selectedVariant?.id === variant.id
              const isOutOfStock = variant.stock <= 0 || variant.is_available === false
              const colorImage = isColor ? getColorImage(variant.value) : null

              return (
                <button
                  key={variant.id}
                  onClick={() => !isOutOfStock && onSelect(variant)}
                  disabled={isOutOfStock}
                  className={`
                    relative group transition-all duration-200
                    ${isColor 
                      ? 'w-12 h-12 rounded-full' 
                      : 'px-4 py-2 rounded-xl border-2'
                    }
                    ${isSelected 
                      ? (isColor ? 'ring-2 ring-gold ring-offset-2 scale-110' : 'border-gold bg-gold/10 text-navy dark:text-white') 
                      : (isColor ? 'hover:scale-110' : 'border-gray-200 dark:border-gray-600 hover:border-gold')
                    }
                    ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  title={`${variant.value}${isOutOfStock ? ' (Out of Stock)' : ''}${variant.price_adjustment > 0 ? ` (+$${variant.price_adjustment})` : ''}`}
                >
                  {isColor ? (
                    <>
                      {colorImage ? (
                        <img 
                          src={colorImage} 
                          alt={variant.value}
                          className="w-full h-full rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                          onError={(e) => {
                            // Fallback to solid color
                            e.target.style.display = 'none'
                            e.target.parentElement.style.backgroundColor = getColorHex(variant.value)
                          }}
                        />
                      ) : (
                        <span 
                          className="block w-full h-full rounded-full border-2 border-gray-200 dark:border-gray-600"
                          style={{ backgroundColor: getColorHex(variant.value) }}
                        />
                      )}
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <FiCheck className="w-5 h-5 text-white drop-shadow-lg" />
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm font-medium">{variant.value}</span>
                  )}
                  
                  {isOutOfStock && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

