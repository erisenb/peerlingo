import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { API_BASE } from '../api'
import { TUTOR_CONSENT_VERSION, TUTOR_CONSENT_TEXT } from '../data/tutorConsent'

export default function TutorConsent() {
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
      const res = await fetch(`${API_BASE}/api/auth/tutor-consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ version: TUTOR_CONSENT_VERSION }),
      })
      if (!res.ok) throw new Error('Could not save your acceptance. Please try again.')
      await refreshUser()
      navigate('/dashboard/tutor')
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
        <div style={{ width: '100%', maxWidth: 640 }}>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,111,97,0.1)', border: '1px solid rgba(255,111,97,0.3)', borderRadius: 100, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FF6F61', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Required Step
              </span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f2b3d', margin: '0 0 10px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Volunteer Tutor Agreement & Consent Form
            </h1>
            <p style={{ fontSize: 15, color: '#7a9cac', lineHeight: 1.6, margin: 0 }}>
              Please read this agreement carefully. If you are under 18, a parent or legal guardian must read and approve this form with you before you continue.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 20, padding: '24px 22px', boxShadow: '0 4px 20px rgba(0,128,128,0.1)' }}>

            {/* Version badge */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Version {TUTOR_CONSENT_VERSION}</span>
            </div>

            {/* Scrollable text */}
            <div style={{
              height: 400, overflowY: 'auto', background: 'rgba(0,128,128,0.04)',
              border: '1px solid rgba(0,128,128,0.25)', borderRadius: 10, padding: '16px 18px',
              fontSize: 13, lineHeight: 1.7, color: '#3d6275', whiteSpace: 'pre-wrap', marginBottom: 20,
            }}>
              {TUTOR_CONSENT_TEXT}
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#0f2b3d', cursor: 'pointer', marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={e => setAccepted(e.target.checked)}
                style={{ marginTop: 3, flexShrink: 0 }}
              />
              <span>
                I have read and agree to the Volunteer Tutor Agreement & Consent Form (Version {TUTOR_CONSENT_VERSION}).
                If I am under 18, my parent or legal guardian has reviewed this form and authorizes my participation in PeerLingo.
              </span>
            </label>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#dc2626', marginTop: 14 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={!accepted || loading}
              style={{
                width: '100%', marginTop: 20,
                background: (!accepted || loading) ? 'rgba(255,111,97,0.5)' : '#FF6F61',
                color: '#fff', border: 'none', borderRadius: 12, padding: '15px',
                fontSize: 16, fontWeight: 800,
                cursor: (!accepted || loading) ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(255,111,97,0.35)',
              }}
            >
              {loading ? 'Saving…' : 'Accept and Continue →'}
            </button>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
