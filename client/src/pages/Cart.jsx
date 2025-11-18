import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
        <div className="space-y-4 mb-8">
          {cart.map(item => (
            <div key={item._id} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600 mb-2">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Total: ${getTotalPrice().toFixed(2)}</h3>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={clearCart} 
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              Clear Cart
            </button>
            <Link 
              to="/checkout"
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart