import { supabase } from './supabase'

// Get reviews for a product
export const getProductReviews = async (productId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
  return data || []
}

// Get average rating for a product
export const getProductRating = async (productId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)
    .eq('is_approved', true)

  if (error) {
    console.error('Error fetching rating:', error)
    return { average: 0, total: 0 }
  }

  if (!data || data.length === 0) {
    return { average: 0, total: 0 }
  }

  const total = data.length
  const sum = data.reduce((acc, review) => acc + review.rating, 0)
  const average = (sum / total).toFixed(1)

  return { average: parseFloat(average), total }
}

// Get rating distribution
export const getRatingDistribution = async (productId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)
    .eq('is_approved', true)

  if (error) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const total = data?.length || 0

  data?.forEach(review => {
    distribution[review.rating]++
  })

  // Convert to percentages
  Object.keys(distribution).forEach(key => {
    distribution[key] = {
      count: distribution[key],
      percentage: total > 0 ? ((distribution[key] / total) * 100).toFixed(0) : 0
    }
  })

  return distribution
}

// Submit a review
export const submitReview = async (reviewData) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      product_id: reviewData.product_id,
      user_name: reviewData.user_name,
      user_email: reviewData.user_email,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      is_approved: true // Auto-approve for now
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Get all reviews (admin)
export const getAllReviews = async () => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, products(name, image_url)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Toggle review approval (admin)
export const toggleReviewApproval = async (reviewId, isApproved) => {
  const { data, error } = await supabase
    .from('reviews')
    .update({ is_approved: isApproved })
    .eq('id', reviewId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete review (admin)
export const deleteReview = async (reviewId) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (error) throw error
  return true
}

