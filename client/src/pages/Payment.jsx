import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { orderService } from '../services/orderService'

const Payment = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [receiptFile, setReceiptFile] = useState(null)
  const [transactionNumber, setTransactionNumber] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const orders = await orderService.getOrders()
      const currentOrder = orders.find(o => o._id === orderId)
      setOrder(currentOrder)
    } catch (error) {
      console.error('Error fetching order:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      if (receiptFile) formData.append('receipt', receiptFile)
      formData.append('transactionNumber', transactionNumber)
      
      await orderService.submitPaymentProof(orderId, formData)
      alert('Payment proof submitted! Admin will verify and update your order status.')
      navigate('/orders')
    } catch (error) {
      alert('Error submitting payment: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <p><strong>Order ID:</strong> #{order._id.slice(-6)}</p>
            <p><strong>Total Amount:</strong> ${order.total}</p>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Items:</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm mb-1">
                <span>{item.product?.name || 'Product'} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Payment Instructions</h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Bank Transfer Details:</h3>
            <p className="text-blue-700">Bank: CloudCart Bank</p>
            <p className="text-blue-700">Account: 1234567890</p>
            <p className="text-blue-700">Amount: ${order.total}</p>
          </div>
          <p className="text-gray-600 text-sm">
            Please transfer the exact amount and upload your receipt or enter transaction number below.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Submit Payment Proof</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt/Proof Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceiptFile(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {receiptFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {receiptFile.name}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Number
              </label>
              <input
                type="text"
                placeholder="TXN123456789"
                value={transactionNumber}
                onChange={(e) => setTransactionNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-semibold"
            >
              {loading ? 'Submitting...' : 'Submit Payment Proof'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Payment