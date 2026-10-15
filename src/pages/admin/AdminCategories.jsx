import { useEffect, useState, useRef } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiUpload, FiImage } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { getAllCategories, createCategory, updateCategory, deleteCategory, uploadProductImage } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getAllCategories()
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    setSaving(true)
    console.log('Saving category:', formData)

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData)
        toast.success('Category updated! ✅')
      } else {
        await createCategory(formData)
        toast.success('Category created! 🎉')
      }
      
      resetForm()
      loadCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error(error.message || 'Failed to save category. Check permissions.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name || '',
      description: category.description || '',
      image_url: category.image_url || ''
    })
    setImagePreview(category.image_url || null)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id)
      setCategories(prev => prev.filter(c => c.id !== id))
      toast.success('Category deleted')
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const imageUrl = await uploadProductImage(file)
      setFormData(prev => ({ ...prev, image_url: imageUrl }))
      toast.success('Image uploaded! 📸')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload image')
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }))
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingCategory(null)
    setImagePreview(null)
    setFormData({ name: '', description: '', image_url: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy dark:text-white">
            Categories
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage product categories ({categories.length} total)
          </p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="inline-flex items-center space-x-2 bg-gold text-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-navy dark:text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button 
                type="button"
                onClick={resetForm} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g., Perfumes"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  placeholder="Brief description of this category"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                />
              </div>

              {/* Image Section */}
              <div>
                <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                  Category Image
                </label>
                
                {/* Image Preview */}
                {(imagePreview || formData.image_url) && (
                  <div className="relative rounded-xl overflow-hidden mb-3 border-2 border-gray-200 dark:border-gray-600">
                    <img
                      src={imagePreview || formData.image_url}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x200/f3f4f6/94a3b8?text=No+Image'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="category-image-upload"
                  disabled={uploading}
                />
                
                <label
                  htmlFor="category-image-upload"
                  className={`flex items-center justify-center space-x-2 w-full p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    uploading
                      ? 'border-gold bg-gold/5'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gold hover:bg-gold/5'
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gold font-medium">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload image
                      </span>
                    </>
                  )}
                </label>

                {/* OR URL Input */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white dark:bg-gray-800 text-gray-400">OR</span>
                  </div>
                </div>

                <div className="relative">
                  <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gold text-navy px-4 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-5 h-5" />
                      <span>{editingCategory ? 'Update' : 'Create'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 group hover:shadow-xl transition-all">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                <img
                  src={category.image_url || 'https://placehold.co/400x200/f3f4f6/94a3b8?text=Category'}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    title="Edit category"
                  >
                    <FiEdit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(category.id)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete category"
                  >
                    <FiTrash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-navy dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {category.description || 'No description'}
                </p>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPlus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-navy dark:text-white mb-2">No Categories Yet</h3>
              <p className="text-gray-500 mb-4">Create your first category to organize your products</p>
              <button
                onClick={() => {
                  resetForm()
                  setShowForm(true)
                }}
                className="inline-flex items-center space-x-2 bg-gold text-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all"
              >
                <FiPlus className="w-5 h-5" />
                <span>Add Category</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-navy dark:text-white mb-2">Delete Category</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure? Products in this category will not be deleted but may need reassignment.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

