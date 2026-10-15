import { useEffect, useState } from 'react'
import { FiStar, FiCheck, FiX, FiTrash2 } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { getAllReviews, toggleReviewApproval, deleteReview } from '../../services/reviewService'
import toast from 'react-hot-toast'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const data = await getAllReviews()
      setReviews(data)
    } catch (error) {
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleApproval = async (reviewId, currentStatus) => {
    try {
      await toggleReviewApproval(reviewId, !currentStatus)
      toast.success(currentStatus ? 'Review hidden' : 'Review approved')
      loadReviews()
    } catch (error) {
      toast.error('Failed to update review')
    }
  }

  const handleDelete = async (reviewId) => {
    if (!confirm('Delete this review?')) return
    try {
      await deleteReview(reviewId)
      toast.success('Review deleted')
      loadReviews()
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-navy dark:text-white">Reviews</h1>
        <p className="text-gray-500">Manage product reviews ({reviews.length} total)</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {reviews.map(review => (
                <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="p-4 text-sm font-medium text-navy dark:text-white">
                    {review.products?.name || 'Product'}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {review.user_name}
                  </td>
                  <td className="p-4">
                    <div className="flex">
                      {[1,2,3,4,5].map(star => (
                        <FiStar key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-gold fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      review.is_approved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {review.is_approved ? 'Approved' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleToggleApproval(review.id, review.is_approved)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        {review.is_approved ? <FiX className="w-4 h-4 text-red-500" /> : <FiCheck className="w-4 h-4 text-green-500" />}
                      </button>
                      <button onClick={() => handleDelete(review.id)}
                        className="p-2 hover:bg-red-50 rounded-lg">
                        <FiTrash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

