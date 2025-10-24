/**
 * API client for Carnage AI backend
 */
import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000/api"

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        })

        localStorage.setItem("access_token", response.data.access)
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// API methods
export const api = {
  // Auth
  register: (data: { username: string; email: string; password: string }) => apiClient.post("/auth/register/", data),

  login: (data: { username: string; password: string }) => apiClient.post("/auth/login/", data),

  getProfile: () => apiClient.get("/auth/profile/"),

  // Models
  getModels: () => apiClient.get("/models/"),

  getModel: (id: number) => apiClient.get(`/models/${id}/`),

  trainModel: (data: {
    name: string
    layers: number[]
    activation: string
    learning_rate: number
    epochs: number
    X: number[][]
    y: number[][]
  }) => apiClient.post("/models/train/", data),

  predict: (data: { model_id: number; X: number[][] }) => apiClient.post("/models/predict/", data),

  deleteModel: (id: number) => apiClient.delete(`/models/${id}/`),
}
