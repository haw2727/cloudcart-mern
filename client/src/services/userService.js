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

export const userService = {
  async getUsers() {
    const response = await api.get('/users')
    return response.data
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  async toggleAdmin(id, isAdmin) {
    const response = await api.put(`/users/${id}/admin`, { isAdmin })
    return response.data
  }
}