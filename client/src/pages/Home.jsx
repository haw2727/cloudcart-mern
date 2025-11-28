import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const { products, loading } = useProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            CloudCart
          </h1>
          <p className="text-2xl md:text-3xl mb-4 font-light">
            Your Premium Shopping Destination
          </p>
          <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Discover amazing products with lightning-fast delivery and secure cloud technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              🛍️ Shop Now
            </Link>
            <Link 
              to="/register" 
              className="border-2 border-white text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
            >
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Why Choose CloudCart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast Delivery</h3>
              <p className="text-gray-600">Lightning-fast shipping with real-time tracking for all your orders</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Secure Shopping</h3>
              <p className="text-gray-600">Bank-level security with encrypted payments and data protection</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Premium Quality</h3>
              <p className="text-gray-600">Curated selection of high-quality products from trusted brands</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Handpicked items just for you</p>
          </div>
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-6 text-xl text-gray-600">Loading amazing products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.slice(0, 8).map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link 
                  to="/products" 
                  className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105 shadow-lg"
                >
                  View All Products →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of happy customers and experience the future of online shopping
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-purple-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home