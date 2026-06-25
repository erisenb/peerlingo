import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { API_BASE } from '../api'

export default function ResetPassword() {
  const { lang } = useLanguage()
  const isEs = lang === 'es'
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError(isEs ? 'Las contraseñas no coinciden.' : 'Passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      setError(isEs ? 'La contraseña debe tener al menos 6 caracteres.' : 'Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Reset failed')
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.3)', borderRadius: 10, padding: '12px 14px', fontSize: 15, color: '#0f2b3d', outline: 'none', boxSizing: 'border-box' }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#3d6275', marginBottom: 7 }

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f2b3d', letterSpacing: '-0.8px', marginBottom: 8 }}>
              {isEs ? 'Nueva contraseña' : 'Create New Password'}
            </h1>
            <p style={{ color: '#7a9cac', fontSize: 14 }}>
              {isEs ? 'Elige una contraseña segura para tu cuenta.' : 'Choose a strong password for your account.'}
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,128,128,0.1)' }}>
            {!token ? (
              <div style={{ textAlign: 'center', color: '#fca5a5' }}>
                <p>{isEs ? 'Enlace de restablecimiento inválido.' : 'Invalid reset link.'}</p>
                <Link to="/forgot-password" style={{ color: '#FF6F61', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                  {isEs ? 'Solicitar nuevo enlace' : 'Request a new link'}
                </Link>
              </div>
            ) : success ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#008080', marginBottom: 12 }}>
                  {isEs ? '¡Contraseña actualizada!' : 'Password updated!'}
                </h2>
                <p style={{ color: '#5a8090', fontSize: 14, marginBottom: 24 }}>
                  {isEs ? 'Tu contraseña ha sido restablecida correctamente.' : 'Your password has been reset successfully.'}
                </p>
                <Link to="/login" style={{ display: 'inline-block', background: '#FF6F61', color: '#fff', borderRadius: 10, padding: '12px 28px', fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
                  {isEs ? 'Iniciar sesión' : 'Sign In'}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>{isEs ? 'Nueva contraseña' : 'New Password'}</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} placeholder="••••••••" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{isEs ? 'Confirmar contraseña' : 'Confirm Password'}</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="••••••••" style={inputStyle} />
                </div>

                {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: 10, fontSize: 13 }}>{error}</div>}

                <button type="submit" disabled={loading} style={{ background: '#FF6F61', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                  {loading ? '…' : (isEs ? 'Guardar nueva contraseña' : 'Save New Password')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  )
}
