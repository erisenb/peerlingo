import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { API_BASE } from '../api'
import { MINOR_CONSENT_VERSION, MINOR_CONSENT_TEXT_ES } from '../data/minorConsent'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID || ''

const TUTOR_GRADES = ['9th Grade', '10th Grade', '11th Grade', '12th Grade']
const STUDENT_GRADES = ['1ro', '2do', '3ro', '4to', '5to', '6to']

export default function Register() {
  const { register, login } = useAuth()
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const paramRole = searchParams.get('role')
  const lockedRole = paramRole === 'student' ? 'student' : paramRole === 'tutor' ? 'tutor' : null
  const [role, setRole] = useState(lockedRole || 'tutor')
  const [fullName, setFullName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [school, setSchool] = useState('')
  const [grade, setGrade] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedUsername, setGeneratedUsername] = useState(null)
  const [pendingUser, setPendingUser] = useState(null)
  const [consentChecked, setConsentChecked] = useState(false)
  const googleBtnRef = useRef(null)

  const isStudent = role === 'student'
  const isEs = lang === 'es'
  // Primary button is always coral; role switcher uses teal for student, coral for tutor
  const accentColor = '#FF6F61'
  const accentMuted = isStudent ? 'rgba(0,128,128,0.08)' : 'rgba(255,111,97,0.1)'
  const accentBorder = isStudent ? 'rgba(0,128,128,0.3)' : 'rgba(255,111,97,0.4)'
  const accentText = isStudent ? '#008080' : '#FF6F61'

  async function handleSocialTutorResponse(data) {
    if (!data.access_token) { setError('Sign-in failed. Please try again.'); return }
    login(data.access_token, data.user)
    navigate('/tutor-survey')
  }

  async function handleGoogleCredential(credential) {
    setError(''); setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, role: 'tutor' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Google sign-in failed')
      handleSocialTutorResponse(data)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleAppleSignUp() {
    if (!window.AppleID) { setError('Apple Sign In is loading, please try again.'); return }
    setError(''); setLoading(true)
    try {
      const response = await window.AppleID.auth.signIn()
      const identity_token = response.authorization.id_token
      const name = response.user?.name
      const full_name = name ? `${name.firstName || ''} ${name.lastName || ''}`.trim() : undefined
      const res = await fetch(`${API_BASE}/api/auth/apple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity_token, full_name, role: 'tutor' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Apple sign-in failed')
      handleSocialTutorResponse(data)
    } catch (err) {
      if (err.error === 'popup_closed_by_user') return
      setError(err.message || 'Apple sign-in failed')
    } finally { setLoading(false) }
  }

  useEffect(() => {
    if (isStudent || !GOOGLE_CLIENT_ID) return
    function initGoogle() {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp) => handleGoogleCredential(resp.credential),
      })
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline', size: 'large', text: 'signup_with', shape: 'rectangular',
        width: googleBtnRef.current.offsetWidth || 360,
      })
    }
    if (window.google?.accounts?.id) { initGoogle() } else {
      const iv = setInterval(() => { if (window.google?.accounts?.id) { clearInterval(iv); initGoogle() } }, 150)
      return () => clearInterval(iv)
    }
  }, [isStudent])

  useEffect(() => {
    if (isStudent || !APPLE_CLIENT_ID || !window.AppleID) return
    try {
      window.AppleID.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: window.location.origin + '/register',
        usePopup: true,
      })
    } catch {}
  }, [isStudent])

  function generateUsername(first, last) {
    const normalize = s => s
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z]/g, '')
    const f = normalize(first) || 'estudiante'
    const l = normalize(last) || 'peru'
    const suffix = Math.floor(100 + Math.random() * 900)
    return `${f}.${l}${suffix}`
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isStudent) {
        let user, username, lastErr
        for (let attempt = 0; attempt < 6 && !user; attempt++) {
          username = generateUsername(firstName, lastName)
          try {
            user = await register({
              email: username, full_name: `${firstName} ${lastName}`.trim(), password, role,
              school: school || 'Escuela Perú', grade: grade || null, language: 'es',
              minor_consent_version: consentChecked ? MINOR_CONSENT_VERSION : null,
            })
          } catch (err) {
            lastErr = err
            if (!/already registered/i.test(err.message)) throw err
          }
        }
        if (!user) throw lastErr
        setGeneratedUsername(username)
        setPendingUser(user)
      } else {
        const user = await register({
          email, full_name: fullName, password, role,
          school: school || 'NJ High School',
          grade: grade || null,
          language: 'en',
        })
        navigate(user.role === 'tutor' ? '/tutor-survey' : '/survey')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function continueAfterUsername() {
    setGeneratedUsername(null)
    navigate(pendingUser?.role === 'tutor' ? '/dashboard/tutor' : '/survey')
  }

  return (
    <>
    {generatedUsername && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,43,61,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.18)', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,128,128,0.18)', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontWeight: 900, color: '#0f2b3d', marginBottom: 10, fontSize: 21 }}>
            {isEs ? '¡Cuenta creada!' : 'Account created!'}
          </h2>
          <p style={{ color: '#3d6275', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
            {isEs
              ? 'Como no usaste un correo electrónico, te creamos un nombre de usuario. Apúntalo — lo necesitarás para iniciar sesión:'
              : "Since you didn't use an email, we created a username for you. Write it down — you'll need it to sign in:"}
          </p>
          <div style={{ background: 'rgba(0,128,128,0.08)', border: '2px solid rgba(0,128,128,0.3)', borderRadius: 12, padding: '14px 18px', fontSize: 20, fontWeight: 900, color: '#008080', marginBottom: 20, letterSpacing: 0.5 }}>
            {generatedUsername}
          </div>
          <button onClick={continueAfterUsername} style={{ ...primaryBtn, background: '#FF6F61' }}>
            {isEs ? 'Ya lo anoté, continuar' : "I've saved it, continue"}
          </button>
        </div>
      </div>
    )}
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          {/* Role switcher (only if no role in URL) */}
          {!lockedRole && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
              {['tutor', 'student'].map(r => (
                <button key={r} onClick={() => setRole(r)} style={{
                  padding: '9px 22px', borderRadius: 10,
                  border: `2px solid ${r === role ? (r === 'student' ? 'rgba(0,128,128,0.4)' : 'rgba(255,111,97,0.5)') : 'rgba(0,128,128,0.15)'}`,
                  background: r === role ? (r === 'student' ? 'rgba(0,128,128,0.08)' : 'rgba(255,111,97,0.1)') : 'transparent',
                  color: r === role ? (r === 'student' ? '#008080' : '#FF6F61') : '#7a9cac',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}>
                  {r === 'tutor' ? '🇺🇸 Volunteer' : '🇵🇪 Estudiante'}
                </button>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0f2b3d', letterSpacing: '-1px', marginBottom: 8 }}>
              {isStudent
                ? (isEs ? 'Únete como Estudiante' : 'Join as a Student')
                : (isEs ? 'Únete como Voluntario' : 'Join as a Volunteer')}
            </h1>
            <p style={{ color: '#7a9cac', fontSize: 14, lineHeight: 1.5 }}>
              {isStudent
                ? (isEs ? 'Aprende inglés con amigos de Nueva Jersey. Es gratis.' : "Learn English with friends from New Jersey. It's free.")
                : (isEs ? 'Ayuda a estudiantes en Perú a aprender inglés.' : 'Help students in Peru learn English and earn community service hours.')}
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,128,128,0.1)' }}>

            {/* Social sign-up buttons (tutors only) */}
            {!isStudent && (GOOGLE_CLIENT_ID || APPLE_CLIENT_ID) && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                  {GOOGLE_CLIENT_ID && (
                    <div ref={googleBtnRef} style={{ width: '100%', minHeight: 44 }} />
                  )}
                  {APPLE_CLIENT_ID && (
                    <button onClick={handleAppleSignUp} disabled={loading} style={socialBtn}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="#0f2b3d"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/></svg>
                      {isEs ? 'Regístrate con Apple' : 'Sign up with Apple'}
                    </button>
                  )}
                </div>

                <div style={{ position: 'relative', textAlign: 'center', margin: '0 0 20px', borderTop: '1px solid rgba(0,128,128,0.12)' }}>
                  <span style={{ position: 'relative', top: -10, background: '#FFFFFF', padding: '0 14px', fontSize: 12, color: '#7a9cac' }}>{isEs ? 'o con tu correo' : 'or with email'}</span>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {isStudent ? (
                <>
                  <div>
                    <label style={labelStyle}>{isEs ? 'Nombre' : 'First Name'}</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder={isEs ? 'Tu nombre' : 'Your first name'} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>{isEs ? 'Apellido' : 'Last Name'}</label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} required placeholder={isEs ? 'Tu apellido' : 'Your last name'} style={inputStyle} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Your full name" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" style={inputStyle} />
                  </div>
                </>
              )}
              <div>
                <label style={labelStyle}>{isStudent && isEs ? 'Contraseña' : 'Password'} <span style={{ fontWeight: 400, color: '#7a9cac' }}>({isEs ? 'mín. 6 caracteres' : 'min. 6 chars'})</span></label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" style={inputStyle} />
              </div>
              {!isStudent && (
                <div>
                  <label style={labelStyle}>School</label>
                  <input value={school} onChange={e => setSchool(e.target.value)} placeholder="Your high school in NJ" style={inputStyle} />
                </div>
              )}
              {!isStudent && (
                <div>
                  <label style={labelStyle}>Grade</label>
                  <select value={grade} onChange={e => setGrade(e.target.value)} style={inputStyle}>
                    <option value="" style={{ color: '#111', background: '#fff' }}>— Select your grade —</option>
                    {TUTOR_GRADES.map(g => <option key={g} value={g} style={{ color: '#111', background: '#fff' }}>{g}</option>)}
                  </select>
                </div>
              )}

              {isStudent && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#3d6275', marginBottom: 6 }}>
                    {isEs ? 'Formulario de Consentimiento (Versión 1.0)' : 'Consent Form (Version 1.0)'}
                  </div>
                  <div style={{
                    height: 180, overflowY: 'auto', background: 'rgba(0,128,128,0.04)',
                    border: '1px solid rgba(0,128,128,0.25)', borderRadius: 10, padding: '10px 12px',
                    fontSize: 11, lineHeight: 1.6, color: '#3d6275', whiteSpace: 'pre-wrap', marginBottom: 10,
                  }}>
                    {MINOR_CONSENT_TEXT_ES}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#0f2b3d', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={e => setConsentChecked(e.target.checked)}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <span>
                      {isEs
                        ? 'He leído y acepto este Formulario de Consentimiento (Versión 1.0) junto con mi madre, padre o tutor(a) legal.'
                        : 'I have read and accept this Consent Form (Version 1.0) with my parent or legal guardian.'}
                    </span>
                  </label>
                </div>
              )}

              {error && <div style={errorStyle}>{error}</div>}

              <button type="submit" disabled={loading || (isStudent && !consentChecked)} style={{ ...primaryBtn, background: (isStudent && !consentChecked) ? 'rgba(255,111,97,0.5)' : accentColor, cursor: (isStudent && !consentChecked) ? 'not-allowed' : 'pointer' }}>
                {loading ? '…' : isStudent ? (isEs ? 'Crear mi cuenta' : 'Create Account') : (isEs ? 'Crear cuenta de voluntario' : 'Create Volunteer Account')}
              </button>
            </form>

            <p style={{ marginTop: 20, fontSize: 13, color: '#7a9cac', textAlign: 'center' }}>
              {isEs ? '¿Ya tienes una cuenta? ' : 'Already have an account? '}
              <Link to="/login" style={{ color: '#FF6F61', fontWeight: 700, textDecoration: 'none' }}>
                {isEs ? 'Iniciar sesión' : 'Sign In'}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
    </>
  )
}

const socialBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '12px 16px', background: 'rgba(0,128,128,0.05)', border: '1px solid rgba(0,128,128,0.18)', borderRadius: 10, color: '#0f2b3d', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#3d6275', marginBottom: 7 }
const inputStyle = { width: '100%', background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.3)', borderRadius: 10, padding: '12px 14px', fontSize: 15, color: '#0f2b3d', outline: 'none', boxSizing: 'border-box' }
const errorStyle = { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: 10, fontSize: 13 }
const primaryBtn = { color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: 4 }
