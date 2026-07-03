import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { API_BASE } from '../api'
import { MINOR_CONSENT_VERSION, MINOR_CONSENT_TEXT_ES } from '../data/minorConsent'

export default function MinorConsent() {
  const { token, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleContinue() {
    if (!accepted) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/minor-consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ version: MINOR_CONSENT_VERSION }),
      })
      if (!res.ok) throw new Error('No se pudo guardar tu aceptación. Intenta de nuevo.')
      await refreshUser()
      navigate('/dashboard/student?tab=mensajes')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '48px 24px 80px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,111,97,0.1)', border: '1px solid rgba(255,111,97,0.3)', borderRadius: 100, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FF6F61', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Paso requerido
              </span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f2b3d', margin: '0 0 10px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Formulario de Consentimiento para Menores de Edad
            </h1>
            <p style={{ fontSize: 15, color: '#7a9cac', lineHeight: 1.6, margin: 0 }}>
              Como tienes entre 14 y 17 años, tú y tu madre, padre o tutor(a) legal deben leer y aceptar este formulario antes de continuar.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 20, padding: '24px 22px', boxShadow: '0 4px 20px rgba(0,128,128,0.1)' }}>
            <div style={{
              height: 360, overflowY: 'auto', background: 'rgba(0,128,128,0.04)',
              border: '1px solid rgba(0,128,128,0.25)', borderRadius: 10, padding: '16px 18px',
              fontSize: 13, lineHeight: 1.6, color: '#3d6275', whiteSpace: 'pre-wrap', marginBottom: 16,
            }}>
              {MINOR_CONSENT_TEXT_ES}
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#0f2b3d', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={e => setAccepted(e.target.checked)}
                style={{ marginTop: 2 }}
              />
              <span>He leído y acepto el Formulario de Consentimiento para Menores de Edad (Versión {MINOR_CONSENT_VERSION}), y confirmo que cuento con la autorización de mi madre, padre o tutor(a) legal para participar en PeerLingo.</span>
            </label>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#dc2626', marginTop: 16 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={!accepted || loading}
              style={{
                width: '100%', marginTop: 20,
                background: (!accepted || loading) ? 'rgba(255,111,97,0.5)' : '#FF6F61',
                color: '#fff', border: 'none', borderRadius: 12, padding: '15px', fontSize: 16, fontWeight: 800,
                cursor: (!accepted || loading) ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(255,111,97,0.35)', transition: 'all 0.15s',
              }}
            >
              {loading ? 'Guardando…' : 'Aceptar y continuar →'}
            </button>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
