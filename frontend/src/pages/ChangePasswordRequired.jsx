import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { API_BASE } from '../api'
import { needsMinorConsent } from '../utils/age'

export default function ChangePasswordRequired() {
  const { token, refreshUser } = useAuth()
  const { lang } = useLanguage()
  const isEs = lang === 'es'
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function destFor(user) {
    if (user.role === 'admin') return '/dashboard/admin'
    if (user.role === 'tutor') return !user.survey_completed ? '/tutor-survey' : !user.tutor_consent_version ? '/tutor-consent' : '/dashboard/tutor'
    return !user.survey_completed ? '/survey' : needsMinorConsent(user) ? '/consent' : '/dashboard/student'
  }

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
      const res = await fetch(`${API_BASE}/api/auth/force-change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ new_password: newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Password change failed')
      await refreshUser()
      navigate(destFor(data))
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
              {isEs ? 'Elige una nueva contraseña' : 'Choose a New Password'}
            </h1>
            <p style={{ color: '#7a9cac', fontSize: 14, lineHeight: 1.6 }}>
              {isEs
                ? 'Tu contraseña fue restablecida. Elige una nueva contraseña para continuar.'
                : 'Your password was reset. Choose a new password to continue.'}
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,128,128,0.1)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>{isEs ? 'Nueva contraseña' : 'New Password'}</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} placeholder="••••••••" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{isEs ? 'Confirmar contraseña' : 'Confirm Password'}</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="••••••••" style={inputStyle} />
              </div>

              {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#c0392b', padding: '10px 14px', borderRadius: 10, fontSize: 13 }}>{error}</div>}

              <button type="submit" disabled={loading} style={{ background: '#FF6F61', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                {loading ? '…' : (isEs ? 'Guardar y continuar' : 'Save & Continue')}
              </button>
            </form>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  )
}
