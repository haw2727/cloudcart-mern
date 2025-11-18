import axios from 'axios'

const API_URL = '/api'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const orderService = {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  async getOrders() {
    const response = await api.get('/orders')
    return response.data
  },

  async updateOrderStatus(id, status) {
    const response = await api.put(`/orders/${id}/status`, { status })
    return response.data
  },

  async submitPaymentProof(id, formData) {
    const response = await api.put(`/orders/${id}/payment`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}