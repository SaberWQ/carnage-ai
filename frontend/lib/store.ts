/**
 * Global state management with Zustand
 */
import { create } from "zustand"

interface User {
  id: number
  username: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (username: string, password: string) => {
    const { api } = await import("./api")
    const response = await api.login({ username, password })

    localStorage.setItem("access_token", response.data.access)
    localStorage.setItem("refresh_token", response.data.refresh)

    const profileResponse = await api.getProfile()
    set({ user: profileResponse.data.user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    set({ user: null, isAuthenticated: false })
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true })
  },
}))
