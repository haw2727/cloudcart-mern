import { useState, useEffect, useCallback } from 'react'
import { useProducts } from '../hooks/useProducts'
import { productService } from '../services/productService'
import { userService } from '../services/userService'
import { orderService } from '../services/orderService'
import { getServerUrl } from '../utils/config'

const Admin = () => {
  const { products, refetch } = useProducts()
  const [activeTab, setActiveTab] = useState('products')
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, formData)
        setEditingProduct(null)
      } else {
        await productService.createProduct(formData)
      }
      setFormData({ name: '', description: '', price: '', category: '', stock: '', image: '' })
      setShowForm(false)
      refetch()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image
    })
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
    setFormData({ name: '', description: '', price: '', category: '', stock: '', image: '' })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id)
        refetch()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const fetchUsers = useCallback(async () => {
    try {
      const data = await userService.getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderService.getOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'orders') {
      fetchOrders()
    }
  }, [activeTab, fetchUsers, fetchOrders])

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id)
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const handleToggleAdmin = async (id, isAdmin) => {
    try {
      await userService.toggleAdmin(id, !isAdmin)
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status)
      fetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('products')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'products' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Products
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'users' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Users
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Orders
            </button>
          </nav>
        </div>

        {activeTab === 'products' && (
          <div>
            <div className="mb-6">
              <button 
                onClick={() => showForm ? handleCancel() : setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {showForm ? 'Cancel' : 'Add Product'}
              </button>
            </div>

            {showForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Price"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button 
                    type="submit"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Products</h2>
              {products.map(product => (
                <div key={product._id} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-gray-600">{product.description}</p>
                    <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                      <span>${product.price}</span>
                      <span>Category: {product.category}</span>
                      <span>Stock: {product.stock}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Users</h2>
            {users.map(user => (
              <div key={user._id} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      user.isAdmin 
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
                    <p className="text-gray-600">Customer: {order.user?.name} ({order.user?.email})</p>
                    <p className="text-gray-600">Total: ${order.total}</p>
                    <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    {order.paymentProof && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-blue-600">Payment Proof:</p>
                        <a href={`${getServerUrl()}${order.paymentProof}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">View Receipt</a>
                        <p className="text-sm text-gray-600">Transaction: {order.transactionNumber}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'paid' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.product?.name || 'Product'} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {order.shippingAddress && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold mb-2">Shipping Address:</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin