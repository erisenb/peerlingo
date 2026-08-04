import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { API_BASE } from '../api'
import { needsMinorConsent } from '../utils/age'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID || ''

export default function Login() {
  const { login } = useAuth()
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const googleBtnRef = useRef(null)

  function tutorDest(user) {
    if (!user.survey_completed) return '/tutor-survey'
    if (!user.tutor_consent_version) return '/tutor-consent'
    return '/dashboard/tutor'
  }

  function navigateUser(user) {
    const studentDest = !user.survey_completed ? '/survey' : needsMinorConsent(user) ? '/consent' : '/dashboard/student'
    navigate(user.role === 'admin' ? '/dashboard/admin' : user.role === 'tutor' ? tutorDest(user) : studentDest)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      navigateUser(user)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSocialResponse(data) {
    if (!data.access_token) { setError('Sign-in failed. Please try again.'); return }
    const { login: loginFn } = { login }
    // Store token + user via AuthContext overload
    login(data.access_token, data.user)
    navigateUser(data.user)
  }

  async function handleGoogleCredential(credential) {
    setError(''); setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Google sign-in failed')
      if (data.needs_role) { setError('No PeerLingo account found with this Google account. Please register first.'); return }
      handleSocialResponse(data)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleAppleSignIn() {
    if (!window.AppleID) { setError('Apple Sign In is loading, please try again in a moment.'); return }
    setError(''); setLoading(true)
    try {
      const response = await window.AppleID.auth.signIn()
      const identity_token = response.authorization.id_token
      const name = response.user?.name
      const full_name = name ? `${name.firstName || ''} ${name.lastName || ''}`.trim() : undefined
      const res = await fetch(`${API_BASE}/api/auth/apple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity_token, full_name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Apple sign-in failed')
      if (data.needs_role) { setError('No PeerLingo account found with this Apple ID. Please register first.'); return }
      handleSocialResponse(data)
    } catch (err) {
      if (err.error === 'popup_closed_by_user') return
      setError(err.message || 'Apple sign-in failed')
    } finally { setLoading(false) }
  }

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    function initGoogle() {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp) => handleGoogleCredential(resp.credential),
      })
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline', size: 'large', text: 'signin_with', shape: 'rectangular',
        width: googleBtnRef.current.offsetWidth || 360,
      })
    }
    if (window.google?.accounts?.id) { initGoogle() } else {
      const iv = setInterval(() => { if (window.google?.accounts?.id) { clearInterval(iv); initGoogle() } }, 150)
      return () => clearInterval(iv)
    }
  }, [])

  useEffect(() => {
    if (!APPLE_CLIENT_ID || !window.AppleID) return
    try {
      window.AppleID.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: window.location.origin + '/login',
        usePopup: true,
      })
    } catch {}
  }, [])

  const isEs = lang === 'es'

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

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

            {/* Social buttons — tutors use Google/Apple; students use username+password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {GOOGLE_CLIENT_ID && (
                <div ref={googleBtnRef} style={{ width: '100%', minHeight: 44 }} />
              )}
              {APPLE_CLIENT_ID && (
                <button onClick={handleAppleSignIn} disabled={loading} style={socialBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f2b3d"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/></svg>
                  {t('login.appleBtn')}
                </button>
              )}
              {!GOOGLE_CLIENT_ID && !APPLE_CLIENT_ID && null}
            </div>

            {(GOOGLE_CLIENT_ID || APPLE_CLIENT_ID) && (
              <div style={{ position: 'relative', textAlign: 'center', margin: '0 0 20px', borderTop: '1px solid rgba(0,128,128,0.12)' }}>
                <span style={{ position: 'relative', top: -10, background: '#FFFFFF', padding: '0 14px', fontSize: 12, color: '#7a9cac' }}>{t('login.orEmail')}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>{t('login.email')}</label>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} required placeholder={isEs ? 'Ej: maria.perez123' : 'your@email.com or username'} style={inputStyle} />
                {isEs && (
                  <p style={{ fontSize: 11, color: '#7a9cac', margin: '5px 0 0', lineHeight: 1.4 }}>
                    Tu nombre de usuario te fue dado cuando creaste tu cuenta.
                  </p>
                )}
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
const errorStyle = { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', color: '#c0392b', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600 }
const primaryBtn = { background: '#FF6F61', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: 4 }
