import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { API_BASE } from '../api'

export default function ForgotPassword() {
  const { lang } = useLanguage()
  const isEs = lang === 'es'
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
    } catch {
      setError(isEs ? 'Algo salió mal. Inténtalo de nuevo.' : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔑</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f2b3d', letterSpacing: '-0.8px', marginBottom: 8 }}>
              {isEs ? 'Restablecer contraseña' : 'Reset Password'}
            </h1>
            <p style={{ color: '#7a9cac', fontSize: 14, lineHeight: 1.6 }}>
              {isEs
                ? 'Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.'
                : "Enter your email and we'll send you a link to reset your password."}
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,128,128,0.1)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#008080', marginBottom: 12 }}>
                  {isEs ? '¡Revisa tu correo!' : 'Check your inbox!'}
                </h2>
                <p style={{ color: '#5a8090', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                  {isEs
                    ? `Si hay una cuenta asociada con ${email}, recibirás un enlace para restablecer tu contraseña en los próximos minutos.`
                    : `If an account exists for ${email}, you'll receive a password reset link within a few minutes.`}
                </p>
                <Link to="/login" style={{ color: '#FF6F61', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                  ← {isEs ? 'Volver al inicio de sesión' : 'Back to Sign In'}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#3d6275', marginBottom: 7 }}>
                    {isEs ? 'Correo electrónico' : 'Email Address'}
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.3)', borderRadius: 10, padding: '12px 14px', fontSize: 15, color: '#0f2b3d', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: 10, fontSize: 13 }}>{error}</div>}

                <button type="submit" disabled={loading} style={{ background: '#FF6F61', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                  {loading ? '…' : (isEs ? 'Enviar enlace de restablecimiento' : 'Send Reset Link')}
                </button>

                <div style={{ textAlign: 'center', marginTop: 4 }}>
                  <Link to="/login" style={{ fontSize: 13, color: '#7a9cac', textDecoration: 'none' }}>
                    ← {isEs ? 'Volver al inicio de sesión' : 'Back to Sign In'}
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  )
}
