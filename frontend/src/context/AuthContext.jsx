import { createContext, useContext, useEffect, useState } from 'react'
import { API_BASE } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('vp_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(data => setUser(data))
      .catch(() => {
        localStorage.removeItem('vp_token')
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  async function login(emailOrToken, passwordOrUser) {
    // Overload: login(token, userObj) — used by AdminLogin after manual fetch
    if (passwordOrUser && typeof passwordOrUser === 'object') {
      localStorage.setItem('vp_token', emailOrToken)
      setToken(emailOrToken)
      setUser(passwordOrUser)
      return passwordOrUser
    }
    const form = new URLSearchParams({ username: emailOrToken, password: passwordOrUser })
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Login failed')
    }
    const data = await res.json()
    localStorage.setItem('vp_token', data.access_token)
    setToken(data.access_token)
    setUser(data.user)
    return data.user
  }

  async function register(payload) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Registration failed')
    }
    const data = await res.json()
    localStorage.setItem('vp_token', data.access_token)
    setToken(data.access_token)
    setUser(data.user)
    return data.user
  }

  async function refreshUser() {
    if (!token) return
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setUser(await res.json())
  }

  function logout() {
    localStorage.removeItem('vp_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
