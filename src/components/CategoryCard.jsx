import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/shop?category=${category.name}`}
      className="group relative overflow-hidden rounded-xl shadow-lg block"
    >
      {/* Image */}
      <div className="aspect-w-4 aspect-h-3">
        <img
          src={category.image_url || 'https://via.placeholder.com/400x300'}
          alt={category.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Category'
          }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-2xl font-serif font-bold mb-2">{category.name}</h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{category.description}</p>
        <span className="inline-block bg-gold text-navy px-6 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-600 transition-colors transform group-hover:scale-105">
          View Products
        </span>
      </div>
    </Link>
  )
}

