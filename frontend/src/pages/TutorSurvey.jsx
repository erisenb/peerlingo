import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { API_BASE } from '../api'

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
]

const GRADE_OPTIONS = [
  '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade',
  'College Freshman', 'College Sophomore', 'College Junior', 'College Senior',
]

const SPANISH_LEVELS = [
  {
    value: 'beginner',
    label: 'Beginner',
    desc: 'I know very little Spanish — a few words or phrases.',
    icon: '🌱',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    desc: 'I can hold a basic conversation and understand simple sentences.',
    icon: '📖',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    desc: 'I am comfortable in Spanish and can communicate fluently.',
    icon: '🎓',
  },
]

export default function TutorSurvey() {
  const { user, token, refreshUser } = useAuth()
  const navigate = useNavigate()

  // Split stored full_name into first / last
  const [fullNameParts] = useState(() => {
    const name = user?.full_name || ''
    const idx  = name.indexOf(' ')
    return idx === -1 ? [name, ''] : [name.slice(0, idx), name.slice(idx + 1)]
  })
  const [firstName, setFirstName] = useState(fullNameParts[0])
  const [lastName,  setLastName]  = useState(fullNameParts[1])
  const [bio, setBio] = useState(user?.bio || '')
  const [city, setCity] = useState(user?.city || '')
  const [state, setState] = useState(user?.state || 'New Jersey')
  const [school, setSchool] = useState(user?.school || '')
  const [grade, setGrade] = useState(user?.grade || '')
  const [spanishLevel, setSpanishLevel] = useState(user?.spanish_level || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/profile/tutor-survey`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          full_name: [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
          bio: bio || null,
          city: city || null,
          state: state || null,
          school: school || null,
          grade: grade || null,
          spanish_level: spanishLevel || null,
        }),
      })
      if (!res.ok) throw new Error('Could not save. Please try again.')
      await refreshUser()
      navigate('/dashboard/tutor')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const lbl = { fontSize: 14, fontWeight: 700, color: '#3d6275', marginBottom: 8, display: 'block' }
  const inp = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(0,128,128,0.28)', background: '#fff', fontSize: 15, color: '#0f2b3d', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '48px 24px 80px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>

          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,128,128,0.1)', border: '1px solid rgba(0,128,128,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#008080', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                One last step
              </span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f2b3d', margin: '0 0 10px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Introduce yourself to your students
            </h1>
            <p style={{ fontSize: 15, color: '#7a9cac', lineHeight: 1.6, margin: 0 }}>
              This helps your students know who they'll be working with. You can update it any time from your profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* First name */}
            <div>
              <label style={lbl}>
                First Name <span style={{ color: '#FF6F61' }}>*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Your first name"
                style={inp}
              />
            </div>

            {/* Last name */}
            <div>
              <label style={lbl}>
                Last Name <span style={{ color: '#FF6F61' }}>*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Your last name"
                style={inp}
              />
            </div>

            {/* Bio */}
            <div>
              <label style={lbl}>About You</label>
              <p style={{ fontSize: 13, color: '#7a9cac', margin: '0 0 8px', lineHeight: 1.5 }}>
                Introduce yourself to your students — your background, teaching style, interests.
              </p>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Hi! I'm a junior at Westfield High School in NJ. I love soccer and music, and I'm really excited to help you practice English…"
                rows={4}
                style={{ ...inp, resize: 'vertical', minHeight: 100 }}
              />
            </div>

            {/* City */}
            <div>
              <label style={lbl}>City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Newark, Hoboken, Trenton…"
                style={inp}
              />
            </div>

            {/* State */}
            <div>
              <label style={lbl}>State</label>
              <select value={state} onChange={e => setState(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* School */}
            <div>
              <label style={lbl}>School (if applicable)</label>
              <input
                type="text"
                value={school}
                onChange={e => setSchool(e.target.value)}
                placeholder="Your high school or college name"
                style={inp}
              />
            </div>

            {/* Grade */}
            <div>
              <label style={lbl}>Grade</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                style={{ ...inp, cursor: 'pointer' }}
              >
                <option value="">— Select your grade —</option>
                {GRADE_OPTIONS.map(g => (
                  <option key={g} value={g} style={{ color: '#111', background: '#fff' }}>{g}</option>
                ))}
              </select>
            </div>

            {/* Spanish level */}
            <div>
              <label style={lbl}>Your level of Spanish</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SPANISH_LEVELS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSpanishLevel(opt.value)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px',
                      background: spanishLevel === opt.value ? 'rgba(0,128,128,0.08)' : '#fff',
                      border: `2px solid ${spanishLevel === opt.value ? '#008080' : 'rgba(0,128,128,0.18)'}`,
                      borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: spanishLevel === opt.value ? '#008080' : '#0f2b3d', marginBottom: 2 }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: 13, color: '#7a9cac', lineHeight: 1.4 }}>
                        {opt.desc}
                      </div>
                    </div>
                    {spanishLevel === opt.value && (
                      <span style={{ marginLeft: 'auto', color: '#008080', fontSize: 18, flexShrink: 0 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#dc2626' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: loading ? 'rgba(0,128,128,0.45)' : '#008080', color: '#fff', border: 'none', borderRadius: 12, padding: '15px', fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(0,128,128,0.3)', transition: 'all 0.15s' }}
            >
              {loading ? 'Saving…' : 'Save & Go to Dashboard →'}
            </button>

          </form>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
