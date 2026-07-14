import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authAPI.getMe()
        .then(res => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    localStorage.setItem('token', res.data.data.accessToken)
    localStorage.setItem('refreshToken', res.data.data.refreshToken)
    setUser(res.data.data.user)
    return { ...res.data.data }
  }

  const register = async (data) => {
    const res = await authAPI.register(data)
    localStorage.setItem('token', res.data.data.accessToken)
    localStorage.setItem('refreshToken', res.data.data.refreshToken)
    setUser(res.data.data.user)
    return res.data
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch {
    }
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  const value = { user, loading, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
