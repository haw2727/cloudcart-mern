import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Header = () => {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            <i className="fas fa-home text-2xl"></i>
            <span>CloudCart</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">🏠 Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">📦 Products</Link>
            {user ? (
              <>
                <Link to="/orders" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">📋 Orders</Link>
                {user.isAdmin && <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">⚙️ Admin</Link>}
              </>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">🔑 Login</Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2 text-gray-700">
                <i className="fas fa-user-circle text-xl"></i>
                <span className="font-medium">Hi, {user.name}</span>
                <button onClick={logout} className="text-red-600 hover:text-red-700 px-2 py-1 rounded font-medium transition-colors">
                  Logout
                </button>
              </div>
            )}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <i className="fas fa-shopping-cart text-xl"></i>
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header