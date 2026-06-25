import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../api'

export default function AdminLogin() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const form = new URLSearchParams()
      form.append('username', email)
      form.append('password', password)
      const res = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', body: form })
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (data.user.role !== 'admin') {
        setError('Not an administrator account')
        setLoading(false)
        return
      }
      login(data.access_token, data.user)
      navigate('/admin')
    } catch {
      setError('Invalid credentials or not an admin account')
    }
    setLoading(false)
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName, role: 'admin' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Registration failed')
        setLoading(false)
        return
      }
      login(data.access_token, data.user)
      navigate('/admin')
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    background: '#071c0e', border: '1px solid #1a3d24', color: '#f1f5f9',
    fontSize: 15, boxSizing: 'border-box', outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#071c0e', fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        background: '#0e2817', borderRadius: 16, padding: '40px 48px',
        width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
          <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 700, margin: 0 }}>Staff Access</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: '8px 0 0' }}>
            {mode === 'login' ? 'Administrator login' : 'Create admin account'}
          </p>
        </div>

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>Full Name</label>
              <input
                type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={inputStyle}
            />
          </div>

          {error && <div style={{ color: '#f87171', fontSize: 13, textAlign: 'center' }}>{error}</div>}

          <button
            type="submit" disabled={loading}
            style={{
              padding: '12px', borderRadius: 8, border: 'none',
              background: loading ? '#1a3d24' : '#16a34a', color: '#fff',
              fontSize: 15, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
              marginTop: 8,
            }}
          >
            {loading
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
              : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748b' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            style={{ background: 'none', border: 'none', color: '#4ade80', fontWeight: 600, cursor: 'pointer', fontSize: 13, padding: 0 }}
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
