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

export const authService = {
  async login(email, password) {
    const response = await api.post('/login', { email, password })
    return response.data
  },

  async register(name, email, password) {
    const response = await api.post('/register', { name, email, password })
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/user')
    return response.data
  }
}