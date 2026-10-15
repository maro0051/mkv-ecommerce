import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { getAllProducts, deleteProduct } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await getAllProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
      toast.success('Product deleted')
      setDeleteConfirm(null)
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy dark:text-white">
            Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your product catalog ({products.length} total)
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center space-x-2 bg-gold text-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price (CAD)</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Featured</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image_url || 'https://placehold.co/40x40'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-navy dark:text-white text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-navy dark:text-white">
                      C${Number(product.price).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold ${
                      (product.stock || 0) <= 5 ? 'text-orange-500' : 'text-green-500'
                    }`}>
                      {product.stock || 0} in stock
                    </span>
                  </td>
                  <td className="p-4">
                    {product.featured ? (
                      <span className="text-green-500 text-xs font-semibold">✓ Featured</span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-navy dark:text-white mb-2">Delete Product</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
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

