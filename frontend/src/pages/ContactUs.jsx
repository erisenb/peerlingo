import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { API_BASE } from '../api'

const MAX_CHARS = 512

const PURPOSES_EN = [
  'Technical Issue',
  'Question About Tutoring',
  'Student Question',
  'General Inquiry',
  'Partnership / Collaboration',
  'Other',
]
const PURPOSES_ES = [
  'Problema técnico',
  'Pregunta sobre tutoría',
  'Pregunta de estudiante',
  'Consulta general',
  'Asociación / Colaboración',
  'Otro',
]

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#3d6275', marginBottom: 8 }
const inputStyle = { width: '100%', background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.3)', borderRadius: 10, padding: '12px 14px', fontSize: 15, color: '#0f2b3d', outline: 'none', boxSizing: 'border-box' }

export default function ContactUs() {
  const { lang, t } = useLanguage()
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [purpose, setPurpose] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const purposes = lang === 'es' ? PURPOSES_ES : PURPOSES_EN

  async function handleSubmit(e) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{1,}$/.test(email)) {
      setError(lang === 'es' ? 'Por favor ingresa un correo electrónico válido.' : 'Please enter a valid email address.')
      return
    }
    if (!purpose) { setError(lang === 'es' ? 'Por favor selecciona un motivo.' : 'Please select a purpose.'); return }
    setError('')
    setLoading(true)
    try {
      await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose, message }),
      })
      setSubmitted(true)
    } catch {
      setError(lang === 'es' ? 'Error al enviar. Inténtalo de nuevo.' : 'Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />
      <div style={{ flex: 1, maxWidth: 640, margin: '0 auto', width: '100%', padding: '60px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0f2b3d', letterSpacing: '-1.5px', marginBottom: 8 }}>{t('contact.title')}</h1>
          <p style={{ color: '#7a9cac', fontSize: 16 }}>{t('contact.subtitle')}</p>
        </div>

        {submitted ? (
          <div style={{ background: 'rgba(0,128,128,0.07)', border: '1px solid rgba(0,128,128,0.2)', borderRadius: 16, padding: '36px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#008080', margin: 0 }}>{t('contact.success')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.12)', borderRadius: 20, padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 20, boxShadow: '0 4px 20px rgba(0,128,128,0.08)' }}>

            <div>
              <label style={labelStyle}>{t('contact.email')}</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>{t('contact.purpose')}</label>
              <select value={purpose} onChange={e => setPurpose(e.target.value)} style={inputStyle}>
                <option value="" style={{ color: '#111', background: '#fff' }}>{lang === 'es' ? '— Selecciona —' : '— Select —'}</option>
                {purposes.map(p => <option key={p} value={p} style={{ color: '#111', background: '#fff' }}>{p}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>{t('contact.message')}</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value.slice(0, MAX_CHARS))}
                placeholder={t('contact.messagePlaceholder')}
                rows={8}
                required
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              />
              <div style={{ textAlign: 'right', fontSize: 12, color: message.length >= MAX_CHARS * 0.9 ? '#f87171' : '#7a9cac', marginTop: 4 }}>
                {MAX_CHARS - message.length} {t('contact.chars')}
              </div>
            </div>

            {error && <p style={{ color: '#f87171', fontSize: 14, margin: 0 }}>{error}</p>}

            <button type="submit" disabled={loading} style={{ background: '#FF6F61', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? '…' : t('contact.submit')}
            </button>
          </form>
        )}
      </div>
      <PublicFooter />
    </div>
  )
}
