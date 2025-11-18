import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleAddToCart = () => {
    const success = addToCart(product, user)
    if (!success) {
      navigate('/login')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <Link to={`/products/${product._id}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        <p className="text-sm text-green-600 font-medium mb-4">Stock: {product.stock}</p>
        <button 
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            product.stock === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard