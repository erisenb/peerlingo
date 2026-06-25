import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { API_BASE } from '../api'

export default function Login() {
  const { login } = useAuth()
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleCred, setGoogleCred] = useState(null)
  const [showRoleModal, setShowRoleModal] = useState(false)

  async function handleGoogleSignIn() {
    if (!window.google || !import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      setError(lang === 'es' ? 'Google Sign-In no está configurado.' : 'Google Sign-In is not configured. Set VITE_GOOGLE_CLIENT_ID.')
      return
    }
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false,
    })
    window.google.accounts.id.prompt()
  }

  async function handleGoogleCredential(response) {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential, role: null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Google sign-in failed')
      if (data.needs_role) {
        setGoogleCred(response.credential)
        setShowRoleModal(true)
        setLoading(false)
        return
      }
      finishLogin(data)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  async function completeGoogleWithRole(role) {
    setShowRoleModal(false)
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: googleCred, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Registration failed')
      finishLogin(data)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  function finishLogin(data) {
    localStorage.setItem('vp_token', data.access_token)
    const role = data.user.role
    const studentDest = data.user.survey_completed ? '/dashboard/student' : '/survey'
    window.location.href = role === 'admin' ? '/dashboard/admin' : role === 'tutor' ? '/dashboard/tutor' : studentDest
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      const studentDest = user.survey_completed ? '/dashboard/student' : '/survey'
      navigate(user.role === 'admin' ? '/dashboard/admin' : user.role === 'tutor' ? '/dashboard/tutor' : studentDest)
    } catch (err) {
      setError(err.message || t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  const isEs = lang === 'es'

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      {/* Role-picker modal for new Google users */}
      {showRoleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,43,61,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.18)', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,128,128,0.18)' }}>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>👋</div>
            <h2 style={{ textAlign: 'center', fontWeight: 800, color: '#0f2b3d', marginBottom: 8, fontSize: 20 }}>
              {isEs ? '¿Cuál es tu rol?' : 'What is your role?'}
            </h2>
            <p style={{ textAlign: 'center', color: '#7a9cac', fontSize: 14, marginBottom: 24 }}>
              {isEs ? 'Es tu primera vez. Dinos quién eres.' : "It's your first time here. Tell us who you are."}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => completeGoogleWithRole('tutor')} style={{ padding: '14px 20px', borderRadius: 12, background: 'rgba(255,111,97,0.1)', border: '2px solid rgba(255,111,97,0.4)', color: '#FF6F61', fontWeight: 700, fontSize: 15, cursor: 'pointer', textAlign: 'left' }}>
                🇺🇸 {isEs ? 'Soy voluntario de Nueva Jersey' : "I'm a Volunteer from New Jersey"}
              </button>
              <button onClick={() => completeGoogleWithRole('student')} style={{ padding: '14px 20px', borderRadius: 12, background: 'rgba(0,128,128,0.07)', border: '2px solid rgba(0,128,128,0.25)', color: '#008080', fontWeight: 700, fontSize: 15, cursor: 'pointer', textAlign: 'left' }}>
                🇵🇪 {isEs ? 'Soy estudiante de Perú' : "I'm a Student from Peru"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f2b3d', letterSpacing: '-1px', marginBottom: 8 }}>
              {isEs ? 'Iniciar sesión' : 'Sign In'}
            </h1>
            <p style={{ color: '#7a9cac', fontSize: 15 }}>
              {t('login.subtitle')}
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,128,128,0.1)' }}>

            {/* Social buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              <button onClick={handleGoogleSignIn} style={socialBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                {t('login.googleBtn')}
              </button>
              <button onClick={() => alert(isEs ? 'Apple Sign In próximamente.' : 'Apple Sign In coming soon. Requires Apple Developer account.')} style={socialBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f2b3d"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/></svg>
                {t('login.appleBtn')}
              </button>
              <button onClick={() => alert(isEs ? 'Facebook Login próximamente.' : 'Facebook Login coming soon. Requires Facebook App setup.')} style={socialBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                {t('login.facebookBtn')}
              </button>
            </div>

            <div style={{ position: 'relative', textAlign: 'center', margin: '0 0 20px', borderTop: '1px solid rgba(0,128,128,0.12)' }}>
              <span style={{ position: 'relative', top: -10, background: '#FFFFFF', padding: '0 14px', fontSize: 12, color: '#7a9cac' }}>{t('login.orEmail')}</span>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>{t('login.email')}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t('login.password')}</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={inputStyle} />
                <div style={{ textAlign: 'right', marginTop: 6 }}>
                  <Link to="/forgot-password" style={{ fontSize: 12, color: '#7a9cac', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#008080'}
                    onMouseLeave={e => e.currentTarget.style.color = '#7a9cac'}
                  >{isEs ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}</Link>
                </div>
              </div>

              {error && <div style={errorStyle}>{error}</div>}

              <button type="submit" disabled={loading} style={primaryBtn}>
                {loading ? '…' : t('login.submit')}
              </button>
            </form>

            <div style={{ marginTop: 24, fontSize: 13, color: '#7a9cac', textAlign: 'center' }}>
              <p style={{ marginBottom: 10 }}>{t('login.noAccount')}</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register?role=tutor" style={{ color: '#FF6F61', fontWeight: 700, textDecoration: 'none' }}>🇺🇸 {t('login.volunteer')}</Link>
                <span style={{ color: 'rgba(0,128,128,0.3)' }}>|</span>
                <Link to="/register?role=student" style={{ color: '#008080', fontWeight: 700, textDecoration: 'none' }}>🇵🇪 {t('login.student')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}

const socialBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '12px 16px', background: 'rgba(0,128,128,0.05)', border: '1px solid rgba(0,128,128,0.18)', borderRadius: 10, color: '#0f2b3d', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#3d6275', marginBottom: 7 }
const inputStyle = { width: '100%', background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.3)', borderRadius: 10, padding: '12px 14px', fontSize: 15, color: '#0f2b3d', outline: 'none', boxSizing: 'border-box' }
const errorStyle = { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: 10, fontSize: 13 }
const primaryBtn = { background: '#FF6F61', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: 4 }
