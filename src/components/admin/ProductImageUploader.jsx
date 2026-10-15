import { useState, useRef } from 'react'
import { FiUpload, FiX, FiStar, FiMove, FiPlus, FiTrash2, FiImage } from 'react-icons/fi'
import { uploadProductImage } from '../../services/adminService'
import toast from 'react-hot-toast'

const COLOR_OPTIONS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Rose Gold', hex: '#E8B4B8' },
  { name: 'Navy', hex: '#0F172A' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Brown', hex: '#92400E' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Champagne', hex: '#F7E7CE' },
]

export default function ProductImageUploader({ images, onImagesChange }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    try {
      for (const file of files) {
        const imageUrl = await uploadProductImage(file)
        
        const newImage = {
          id: Date.now() + Math.random(),
          image_url: imageUrl,
          color_name: '',
          color_hex: '',
          is_primary: images.length === 0, // First image is primary
          sort_order: images.length
        }
        
        onImagesChange([...images, newImage])
      }
      toast.success(`${files.length} image(s) uploaded! 📸`)
    } catch (error) {
      toast.error(error.message || 'Failed to upload')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const addImageUrl = () => {
    const url = prompt('Paste image URL:')
    if (url && url.trim()) {
      const newImage = {
        id: Date.now() + Math.random(),
        image_url: url.trim(),
        color_name: '',
        color_hex: '',
        is_primary: images.length === 0,
        sort_order: images.length
      }
      onImagesChange([...images, newImage])
    }
  }

  const removeImage = (imageId) => {
    onImagesChange(images.filter(img => img.id !== imageId))
  }

  const updateImageColor = (imageId, colorName, colorHex) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, color_name: colorName, color_hex: colorHex } : img
    ))
  }

  const setPrimary = (imageId) => {
    onImagesChange(images.map(img => ({
      ...img,
      is_primary: img.id === imageId
    })))
  }

  const moveImage = (imageId, direction) => {
    const index = images.findIndex(img => img.id === imageId)
    if (direction === 'up' && index > 0) {
      const newImages = [...images]
      ;[newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]]
      onImagesChange(newImages.map((img, i) => ({ ...img, sort_order: i })))
    } else if (direction === 'down' && index < images.length - 1) {
      const newImages = [...images]
      ;[newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]]
      onImagesChange(newImages.map((img, i) => ({ ...img, sort_order: i })))
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Buttons */}
      <div className="flex gap-3">
        <div className="flex-1">
          <input ref={fileInputRef} type="file" accept="image/*" multiple
            onChange={handleFileUpload} className="hidden" id="multi-image-upload" disabled={uploading} />
          <label htmlFor="multi-image-upload"
            className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              uploading ? 'border-gold bg-gold/5' : 'border-gray-300 dark:border-gray-600 hover:border-gold hover:bg-gold/5'
            }`}>
            {uploading ? (
              <>
                <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm font-semibold text-gold">Uploading...</p>
              </>
            ) : (
              <>
                <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm font-semibold text-navy dark:text-white">Upload Multiple Images</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP • Max 5MB each</p>
              </>
            )}
          </label>
        </div>
        <button type="button" onClick={addImageUrl}
          className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <FiPlus className="w-4 h-4 inline mr-1" /> Add URL
        </button>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
              image.is_primary ? 'border-gold ring-2 ring-gold/20' : 'border-gray-200 dark:border-gray-600'
            }`}>
              <img src={image.image_url} alt={`Product ${index + 1}`}
                className="w-full h-40 object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/200x200/f3f4f6/94a3b8?text=Error' }} />
              
              {/* Primary Badge */}
              {image.is_primary && (
                <div className="absolute top-2 left-2 bg-gold text-navy text-[10px] font-bold px-2 py-1 rounded-full">
                  Primary
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button type="button" onClick={() => setPrimary(image.id)}
                  className="p-2 bg-white rounded-full hover:bg-gold transition-colors" title="Set as primary">
                  <FiStar className="w-4 h-4 text-navy" />
                </button>
                {index > 0 && (
                  <button type="button" onClick={() => moveImage(image.id, 'up')}
                    className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors" title="Move up">
                    <FiMove className="w-4 h-4 text-navy" />
                  </button>
                )}
                {index < images.length - 1 && (
                  <button type="button" onClick={() => moveImage(image.id, 'down')}
                    className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors" title="Move down">
                    <FiMove className="w-4 h-4 text-navy rotate-180" />
                  </button>
                )}
                <button type="button" onClick={() => removeImage(image.id)}
                  className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors" title="Remove">
                  <FiTrash2 className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Color Picker */}
              <div className="p-2 bg-white dark:bg-gray-800">
                <select
                  value={image.color_name}
                  onChange={(e) => {
                    const color = COLOR_OPTIONS.find(c => c.name === e.target.value)
                    updateImageColor(image.id, e.target.value, color?.hex || '')
                  }}
                  className="w-full px-2 py-1.5 text-xs border rounded-lg bg-gray-50 dark:bg-gray-700 text-navy dark:text-white"
                >
                  <option value="">Select color...</option>
                  {COLOR_OPTIONS.map(color => (
                    <option key={color.name} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
                {image.color_hex && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: image.color_hex }} />
                    <span className="text-[10px] text-gray-500">{image.color_name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <FiImage className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No images uploaded yet</p>
          <p className="text-xs text-gray-400">Upload product images to show different colors</p>
        </div>
      )}
    </div>
  )
}

