import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../api'
import Logo from '../components/Logo'

const TEST_ACCOUNTS = [
  {
    role: 'admin',
    label: 'Administrator',
    icon: '🛠️',
    color: '#7c3aed',
    bg: '#ede9fe',
    payload: {
      email: 'admin@test.com',
      full_name: 'Alex Rivera',
      password: 'testpass',
      role: 'admin',
      school: 'Virtual Peers HQ',
      grade: null,
    },
    dest: '/dashboard/admin',
  },
  {
    role: 'tutor',
    label: 'Tutor',
    icon: '🎓',
    color: '#2563eb',
    bg: '#dbeafe',
    payload: {
      email: 'tutor@test.com',
      full_name: 'Jamie Chen',
      password: 'testpass',
      role: 'tutor',
      school: 'New Jersey High School',
      grade: '11th Grade',
    },
    dest: '/dashboard/tutor',
  },
  {
    role: 'student',
    label: 'Student',
    icon: '⭐',
    color: '#d97706',
    bg: '#fef3c7',
    payload: {
      email: 'student@test.com',
      full_name: 'Maria Flores',
      password: 'testpass',
      role: 'student',
      school: 'Peru School',
      grade: '4th Grade',
    },
    dest: '/dashboard/student',
  },
]

export default function DevLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState({})       // enter status per role
  const [resetSt, setResetSt] = useState({})     // reset status per role

  async function enter(acct) {
    setStatus(s => ({ ...s, [acct.role]: 'loading' }))
    try {
      const res = await fetch(`${API_BASE}/api/dev/ensure-accounts`, { method: 'POST' })
      if (!res.ok) throw new Error('server')
      const accounts = await res.json()
      const { token, user } = accounts[acct.role]
      await login(token, user)
      navigate(acct.dest)
    } catch (e) {
      const msg = e instanceof TypeError ? 'offline' : 'error'
      setStatus(s => ({ ...s, [acct.role]: msg }))
    }
  }

  async function resetForReg(acct) {
    setResetSt(s => ({ ...s, [acct.role]: 'loading' }))
    try {
      // Ensure the account exists first
      await fetch(`${API_BASE}/api/dev/ensure-accounts`, { method: 'POST' })
      const res = await fetch(`${API_BASE}/api/dev/reset-for-registration?role=${acct.role}`, { method: 'POST' })
      if (!res.ok) throw new Error('server')
      const data = await res.json()
      // Log in as the reset account so the registration flow starts immediately
      await login(data.token, data.user)
      navigate(acct.dest)
    } catch (e) {
      const msg = e instanceof TypeError ? 'offline' : 'error'
      setResetSt(s => ({ ...s, [acct.role]: msg }))
      setTimeout(() => setResetSt(s => ({ ...s, [acct.role]: null })), 3000)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(248,250,255,0.82)',
      position: 'relative',
      zIndex: 1,
      padding: 24,
      gap: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><Logo height={72} /></div>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, color: '#1e293b', fontFamily: 'Pacifico, cursive' }}>Dev Quick Access</h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Jump straight into any role — no credentials needed</p>
      </div>

      {/* ── Enter as existing account ── */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {TEST_ACCOUNTS.map(acct => (
          <button
            key={acct.role}
            onClick={() => enter(acct)}
            disabled={status[acct.role] === 'loading'}
            style={{
              background: acct.bg,
              border: `3px solid ${acct.color}`,
              borderRadius: 20,
              padding: '28px 28px',
              cursor: 'pointer',
              width: 200,
              textAlign: 'center',
              transition: 'transform 0.15s',
              opacity: status[acct.role] === 'loading' ? 0.6 : 1,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={{ fontSize: 44, marginBottom: 10 }}>{acct.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: acct.color, marginBottom: 4 }}>
              {acct.label}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
              {acct.payload.full_name}
            </div>
            <div style={{ fontSize: 11, color: status[acct.role] === 'offline' ? '#dc2626' : acct.color, fontWeight: 700 }}>
              {status[acct.role] === 'loading' ? 'Entering…'
                : status[acct.role] === 'offline' ? 'Start backend first'
                : status[acct.role] === 'error' ? '❌ Error'
                : 'Click to enter →'}
            </div>
          </button>
        ))}
      </div>

      <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
        Creates test accounts automatically if they don't exist yet
      </p>

      {/* ── Registration flow testing ── */}
      <div style={{
        background: '#fff',
        border: '1.5px dashed #cbd5e1',
        borderRadius: 20,
        padding: '24px 32px',
        maxWidth: 560,
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Registration Flow Testing
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20, lineHeight: 1.6 }}>
          Wipes survey + profile data on a test account and logs you in — triggering the full registration experience from scratch.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {TEST_ACCOUNTS.filter(a => a.role !== 'admin').map(acct => {
            const rst = resetSt[acct.role]
            return (
              <button
                key={acct.role}
                onClick={() => resetForReg(acct)}
                disabled={rst === 'loading'}
                style={{
                  background: rst === 'loading' ? '#f1f5f9' : '#fff',
                  border: `2px solid ${acct.color}`,
                  borderRadius: 12,
                  padding: '10px 20px',
                  cursor: rst === 'loading' ? 'not-allowed' : 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  color: rst === 'error' ? '#dc2626' : acct.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  transition: 'all 0.15s',
                  opacity: rst === 'loading' ? 0.6 : 1,
                }}
                onMouseEnter={e => { if (rst !== 'loading') e.currentTarget.style.background = acct.bg }}
                onMouseLeave={e => { if (rst !== 'loading') e.currentTarget.style.background = '#fff' }}
              >
                <span style={{ fontSize: 16 }}>{acct.icon}</span>
                {rst === 'loading' ? 'Resetting…'
                  : rst === 'error' ? '❌ Error — backend running?'
                  : `↺ Reset ${acct.label} & test registration`}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
