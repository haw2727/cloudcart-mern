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

export const productService = {
  async getProducts() {
    const response = await api.get('/products')
    return response.data
  },

  async getProduct(id) {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  async createProduct(product) {
    const response = await api.post('/products', product)
    return response.data
  },

  async updateProduct(id, product) {
    const response = await api.put(`/products/${id}`, product)
    return response.data
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`)
    return response.data
  }
}