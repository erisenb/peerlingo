import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../api'
import Logo from '../components/Logo'

const DEMO_ACCOUNTS = [
  {
    email: 'admin@test.com',
    role: 'admin',
    label: 'Administrator',
    icon: '🛠️',
    color: '#7c3aed',
    bg: '#ede9fe',
    name: 'Alex Rivera',
    desc: 'PeerLingo HQ',
    dest: '/dashboard/admin',
  },
  {
    email: 'demo-tutor1@peerlingo.test',
    role: 'tutor',
    label: 'Tutor',
    icon: '🎓',
    color: '#2563eb',
    bg: '#dbeafe',
    name: 'Jamie Chen',
    desc: 'Newark NJ · 11th Grade',
    dest: '/dashboard/tutor',
  },
  {
    email: 'demo-tutor2@peerlingo.test',
    role: 'tutor',
    label: 'Tutor',
    icon: '🎓',
    color: '#2563eb',
    bg: '#dbeafe',
    name: 'Sofia Ramirez',
    desc: 'Summit NJ · 12th Grade',
    dest: '/dashboard/tutor',
  },
  {
    email: 'demo-tutor3@peerlingo.test',
    role: 'tutor',
    label: 'Tutor',
    icon: '🎓',
    color: '#2563eb',
    bg: '#dbeafe',
    name: 'Tyler Brooks',
    desc: 'Westfield NJ · 10th Grade',
    dest: '/dashboard/tutor',
  },
  {
    email: 'demo-student1@peerlingo.test',
    role: 'student',
    label: 'Student',
    icon: '⭐',
    color: '#d97706',
    bg: '#fef3c7',
    name: 'Maria Flores',
    desc: 'Lima, Peru · Beginner',
    dest: '/dashboard/student',
  },
  {
    email: 'demo-student2@peerlingo.test',
    role: 'student',
    label: 'Student',
    icon: '⭐',
    color: '#d97706',
    bg: '#fef3c7',
    name: 'Carlos Mendez',
    desc: 'Bogotá, Colombia · Intermediate',
    dest: '/dashboard/student',
  },
  {
    email: 'demo-student3@peerlingo.test',
    role: 'student',
    label: 'Student',
    icon: '⭐',
    color: '#d97706',
    bg: '#fef3c7',
    name: 'Isabella Torres',
    desc: 'Mexico City · Advanced',
    dest: '/dashboard/student',
  },
]

const adminAcct = DEMO_ACCOUNTS.find(a => a.role === 'admin')
const tutors = DEMO_ACCOUNTS.filter(a => a.role === 'tutor')
const students = DEMO_ACCOUNTS.filter(a => a.role === 'student')

export default function DevLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState({})
  const [resetSt, setResetSt] = useState({})

  async function enter(acct) {
    setStatus(s => ({ ...s, [acct.email]: 'loading' }))
    try {
      const res = await fetch(`${API_BASE}/api/dev/ensure-accounts`, { method: 'POST' })
      if (!res.ok) throw new Error('server')
      const accounts = await res.json()
      const { token, user } = accounts[acct.email]
      await login(token, user)
      localStorage.setItem('vp_demo_email', user.email)
      navigate(acct.dest)
    } catch (e) {
      const msg = e instanceof TypeError ? 'offline' : 'error'
      setStatus(s => ({ ...s, [acct.email]: msg }))
    }
  }

  async function resetForReg(acct) {
    setResetSt(s => ({ ...s, [acct.email]: 'loading' }))
    try {
      await fetch(`${API_BASE}/api/dev/ensure-accounts`, { method: 'POST' })
      const res = await fetch(
        `${API_BASE}/api/dev/reset-for-registration?email=${encodeURIComponent(acct.email)}`,
        { method: 'POST' }
      )
      if (!res.ok) throw new Error('server')
      const data = await res.json()
      await login(data.token, data.user)
      localStorage.setItem('vp_demo_email', acct.email)
      navigate(acct.dest)
    } catch (e) {
      const msg = e instanceof TypeError ? 'offline' : 'error'
      setResetSt(s => ({ ...s, [acct.email]: msg }))
      setTimeout(() => setResetSt(s => ({ ...s, [acct.email]: null })), 3000)
    }
  }

  function AccountCard({ acct }) {
    const st = status[acct.email]
    return (
      <button
        onClick={() => enter(acct)}
        disabled={st === 'loading'}
        style={{
          background: acct.bg,
          border: `3px solid ${acct.color}`,
          borderRadius: 20,
          padding: '22px 18px',
          cursor: st === 'loading' ? 'not-allowed' : 'pointer',
          width: 170,
          textAlign: 'center',
          transition: 'transform 0.15s',
          opacity: st === 'loading' ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (st !== 'loading') e.currentTarget.style.transform = 'translateY(-4px)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
      >
        <div style={{ fontSize: 34, marginBottom: 8 }}>{acct.icon}</div>
        <div style={{ fontSize: 14, fontWeight: 900, color: acct.color, marginBottom: 2 }}>{acct.name}</div>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>{acct.desc}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: st === 'offline' ? '#dc2626' : acct.color }}>
          {st === 'loading' ? 'Entering…'
            : st === 'offline' ? 'Start backend first'
            : st === 'error' ? '❌ Error'
            : 'Enter →'}
        </div>
      </button>
    )
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
      gap: 20,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><Logo height={72} /></div>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, color: '#1e293b', fontFamily: 'Pacifico, cursive' }}>Dev Quick Access</h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Jump straight into any role — profiles auto-reset on logout</p>
      </div>

      {/* Admin */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin</div>
        <AccountCard acct={adminAcct} />
      </div>

      {/* Tutors */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tutors</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {tutors.map(acct => <AccountCard key={acct.email} acct={acct} />)}
        </div>
      </div>

      {/* Students */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Students</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {students.map(acct => <AccountCard key={acct.email} acct={acct} />)}
        </div>
      </div>

      <p style={{ color: '#94a3b8', fontSize: 12, marginTop: -4 }}>
        Creates accounts automatically if they don't exist yet
      </p>

      {/* Registration flow testing */}
      <div style={{
        background: '#fff',
        border: '1.5px dashed #cbd5e1',
        borderRadius: 20,
        padding: '22px 28px',
        maxWidth: 620,
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Registration Flow Testing
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16, lineHeight: 1.6 }}>
          Wipes survey + profile data and logs you in — triggering the full registration experience from scratch.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Tutors', accounts: tutors, color: '#2563eb', bg: '#dbeafe' },
            { label: 'Students', accounts: students, color: '#d97706', bg: '#fef3c7' },
          ].map(({ label, accounts, color, bg }) => (
            <div key={label}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase' }}>{label}</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {accounts.map(acct => {
                  const rst = resetSt[acct.email]
                  return (
                    <button
                      key={acct.email}
                      onClick={() => resetForReg(acct)}
                      disabled={rst === 'loading'}
                      style={{
                        background: rst === 'loading' ? '#f1f5f9' : '#fff',
                        border: `2px solid ${color}`,
                        borderRadius: 10,
                        padding: '8px 14px',
                        cursor: rst === 'loading' ? 'not-allowed' : 'pointer',
                        fontSize: 12,
                        fontWeight: 700,
                        color: rst === 'error' ? '#dc2626' : color,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        transition: 'all 0.15s',
                        opacity: rst === 'loading' ? 0.6 : 1,
                      }}
                      onMouseEnter={e => { if (rst !== 'loading') e.currentTarget.style.background = bg }}
                      onMouseLeave={e => { if (rst !== 'loading') e.currentTarget.style.background = '#fff' }}
                    >
                      {rst === 'loading' ? 'Resetting…'
                        : rst === 'error' ? '❌ Error — backend running?'
                        : `↺ ${acct.name}`}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
