import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { API_BASE } from '../api'

const ENGLISH_LEVELS = [
  {
    value: 'beginner',
    label: 'Beginner',        labelEs: 'Principiante',
    desc:  'Just beginning to learn some words',
    descEs:'Apenas comenzando a aprender algunas palabras',
    icon: '🌱',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',    labelEs: 'Intermedio',
    desc:  'Able to speak slowly with very basic sentences',
    descEs:'Puedo hablar despacio con oraciones muy básicas',
    icon: '📖',
  },
  {
    value: 'advanced',
    label: 'Advanced',        labelEs: 'Avanzado',
    desc:  'Larger vocabulary, already studied for multiple years',
    descEs:'Vocabulario amplio, llevo varios años estudiando',
    icon: '🎓',
  },
]

const FOCUS_OPTIONS = [
  { value: 'english',  label: 'Learn English',           labelEs: 'Aprender inglés',             icon: '🗣️' },
  { value: 'culture',  label: 'Learn American Culture',  labelEs: 'Conocer la cultura americana', icon: '🇺🇸' },
  { value: 'both',     label: 'Both',                    labelEs: 'Ambos',                        icon: '✨' },
]

const GENDER_OPTIONS = [
  { value: 'male',           label: 'Male tutor',   labelEs: 'Tutor hombre'    },
  { value: 'female',         label: 'Female tutor', labelEs: 'Tutora mujer'    },
  { value: 'no_preference',  label: 'No preference',labelEs: 'Sin preferencia' },
]

const SA_COUNTRIES = [
  'Argentina','Bolivia','Brazil','Chile','Colombia',
  'Ecuador','Guyana','Paraguay','Peru','Suriname',
  'Uruguay','Venezuela',
]

// ── Date helpers (DD/MM/YYYY ↔ ISO YYYY-MM-DD) ────────────────────────────────

function isoToDmy(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return ''
  return `${d}/${m}/${y}`
}

function dmyToIso(str) {
  if (!str) return null
  const parts = str.split('/')
  if (parts.length !== 3) return null
  const [d, m, y] = parts
  if (d.length < 1 || m.length < 1 || y.length !== 4) return null
  return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`
}

function isValidDmy(str) {
  if (!str) return false
  const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!match) return false
  const d = parseInt(match[1],10), mo = parseInt(match[2],10), y = parseInt(match[3],10)
  const today = new Date()
  return mo >= 1 && mo <= 12 && d >= 1 && d <= 31 && y >= 1900 && y <= today.getFullYear()
}

// ─────────────────────────────────────────────────────────────────────────────

export default function StudentSurvey() {
  const { user, token, refreshUser } = useAuth()
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const isEs = lang === 'es'

  const hiddenDateRef = useRef()

  // Split stored full_name into first / last for the form fields
  const [fullNameParts] = useState(() => {
    const name = user?.full_name || ''
    const idx  = name.indexOf(' ')
    return idx === -1 ? [name, ''] : [name.slice(0, idx), name.slice(idx + 1)]
  })
  const [firstName,        setFirstName]        = useState(fullNameParts[0])
  const [lastName,         setLastName]         = useState(fullNameParts[1])
  const [dob,              setDob]              = useState(isoToDmy(user?.date_of_birth) || '')
  const [country,          setCountry]          = useState(user?.country || 'Peru')
  const [city,             setCity]             = useState(user?.city || '')
  const [school,           setSchool]           = useState(user?.school || '')
  const [level,            setLevel]            = useState(user?.english_level || '')
  const [goals,            setGoals]            = useState(user?.goals || '')
  const [focus,            setFocus]            = useState(user?.preferred_focus || 'both')
  const [tutorGender,      setTutorGender]      = useState(user?.preferred_tutor_gender || 'no_preference')
  const [phone,            setPhone]            = useState(user?.phone || '')
  const [receiveReminders, setReceiveReminders] = useState(
    user?.receive_reminders === false ? false : true
  )
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      setError(isEs
        ? 'Por favor ingresa tu nombre y apellido.'
        : 'Please enter your first and last name.')
      return
    }
    if (!level) {
      setError(isEs
        ? 'Por favor selecciona tu nivel de inglés para continuar.'
        : 'Please select your English level to continue.')
      return
    }
    if (!dob || !isValidDmy(dob)) {
      setError(isEs
        ? 'Por favor ingresa tu fecha de nacimiento en formato DD/MM/AAAA.'
        : 'Please enter your date of birth in DD/MM/YYYY format.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/profile/survey`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          full_name:             [firstName.trim(), lastName.trim()].filter(Boolean).join(' '),
          date_of_birth:         dmyToIso(dob),
          country:               country  || null,
          city:                  city     || null,
          school:                school   || null,
          english_level:         level    || null,
          goals:                 goals    || null,
          preferred_focus:       focus    || null,
          preferred_tutor_gender:tutorGender || null,
          phone:                 phone    || null,
          receive_reminders:     receiveReminders,
        }),
      })
      if (!res.ok) throw new Error(isEs ? 'No se pudo guardar. Intenta de nuevo.' : 'Could not save. Please try again.')
      await refreshUser()
      navigate('/dashboard/student?tab=mensajes')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const label = () => ({ fontSize: 14, fontWeight: 700, color: '#3d6275', marginBottom: 8, display: 'block' })
  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1px solid rgba(0,128,128,0.28)', background: '#fff',
    fontSize: 15, color: '#0f2b3d', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  }

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '48px 24px 80px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,111,97,0.1)', border: '1px solid rgba(255,111,97,0.3)', borderRadius: 100, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FF6F61', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {isEs ? 'Paso final' : 'One last step'}
              </span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f2b3d', margin: '0 0 10px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              {isEs ? 'Cuéntanos un poco sobre ti' : 'Tell us a little about yourself'}
            </h1>
            <p style={{ fontSize: 15, color: '#7a9cac', lineHeight: 1.6, margin: 0 }}>
              {isEs
                ? 'Por favor proporciona información básica para asegurarnos de asignarte el tutor correcto.'
                : 'Please provide some basic info to ensure we assign the right tutor.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* First name */}
            <div>
              <label style={label()}>
                {isEs ? 'Nombre' : 'First Name'}
                <span style={{ color: '#FF6F61', marginLeft: 4 }}>*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder={isEs ? 'Tu nombre' : 'Your first name'}
                style={inputStyle}
              />
            </div>

            {/* Last name */}
            <div>
              <label style={label()}>
                {isEs ? 'Apellido' : 'Last Name'}
                <span style={{ color: '#FF6F61', marginLeft: 4 }}>*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder={isEs ? 'Tu apellido' : 'Your last name'}
                style={inputStyle}
              />
            </div>

            {/* Date of birth — required, DD/MM/YYYY */}
            <div>
              <label style={label()}>
                {isEs ? 'Fecha de nacimiento' : 'Date of Birth'}
                <span style={{ color: '#FF6F61', marginLeft: 4 }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  placeholder={isEs ? 'DD/MM/AAAA' : 'DD/MM/YYYY'}
                  maxLength={10}
                  style={{ ...inputStyle, paddingRight: 40 }}
                />
                {/* Hidden native date picker — opened by the calendar icon */}
                <input
                  ref={hiddenDateRef}
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={dmyToIso(dob) || ''}
                  onChange={e => setDob(isoToDmy(e.target.value))}
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, top: 0, right: 40 }}
                  tabIndex={-1}
                />
                <span
                  onClick={() => hiddenDateRef.current?.showPicker?.() || hiddenDateRef.current?.click()}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, cursor: 'pointer', userSelect: 'none' }}
                >📅</span>
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 5 }}>
                {isEs ? 'Formato: DD/MM/AAAA — por ejemplo, 15/03/2008' : 'Format: DD/MM/YYYY — e.g. 15/03/2008'}
              </div>
            </div>

            {/* Country */}
            <div>
              <label style={label()}>{isEs ? 'País' : 'Country'}</label>
              <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {SA_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* City */}
            <div>
              <label style={label()}>{isEs ? 'Ciudad' : 'City'}</label>
              <input
                type="text" value={city} onChange={e => setCity(e.target.value)}
                placeholder="Lima, Cusco, Arequipa…"
                style={inputStyle}
              />
            </div>

            {/* School */}
            <div>
              <label style={label()}>{isEs ? 'Escuela / Colegio (si tienes)' : 'School (if applicable)'}</label>
              <input
                type="text" value={school} onChange={e => setSchool(e.target.value)}
                placeholder={isEs ? 'Nombre de tu escuela o colegio' : 'Your school name'}
                style={inputStyle}
              />
            </div>

            {/* English level — required */}
            <div>
              <label style={label()}>
                {isEs ? '¿Cuál es tu nivel de inglés actual?' : 'What is your current level of English?'}
                <span style={{ color: '#FF6F61', marginLeft: 4 }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ENGLISH_LEVELS.map(opt => (
                  <button
                    key={opt.value} type="button" onClick={() => setLevel(opt.value)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px',
                      background: level === opt.value ? 'rgba(0,128,128,0.08)' : '#fff',
                      border: `2px solid ${level === opt.value ? '#008080' : 'rgba(0,128,128,0.18)'}`,
                      borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: level === opt.value ? '#008080' : '#0f2b3d', marginBottom: 2 }}>
                        {isEs ? opt.labelEs : opt.label}
                      </div>
                      <div style={{ fontSize: 13, color: '#7a9cac', lineHeight: 1.4 }}>
                        {isEs ? opt.descEs : opt.desc}
                      </div>
                    </div>
                    {level === opt.value && (
                      <span style={{ marginLeft: 'auto', color: '#008080', fontSize: 18, flexShrink: 0 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <label style={label()}>
                {isEs ? '¿Cuáles son tus metas?' : 'What are your goals?'}
              </label>
              <textarea
                value={goals} onChange={e => setGoals(e.target.value)}
                placeholder={isEs
                  ? 'Convertirme en guía turístico, maestra, niñera, empresaria...'
                  : 'Become a tour guide, a teacher, a nanny, a business owner...'}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
              />
            </div>

            {/* Preferred focus — default: both */}
            <div>
              <label style={label()}>
                {isEs ? '¿En qué prefieres enfocarte?' : 'What is your preferred focus?'}
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {FOCUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value} type="button" onClick={() => setFocus(opt.value)}
                    style={{
                      flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: 6, padding: '14px 12px',
                      background: focus === opt.value ? 'rgba(255,111,97,0.1)' : '#fff',
                      border: `2px solid ${focus === opt.value ? '#FF6F61' : 'rgba(0,128,128,0.18)'}`,
                      borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{opt.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: focus === opt.value ? '#FF6F61' : '#3d6275', textAlign: 'center', lineHeight: 1.3 }}>
                      {isEs ? opt.labelEs : opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tutor gender preference — default: no_preference */}
            <div>
              <label style={label()}>
                {isEs ? '¿Prefieres un tutor hombre o mujer?' : 'Do you prefer a male or female tutor?'}
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {GENDER_OPTIONS.map(opt => (
                  <button
                    key={opt.value} type="button" onClick={() => setTutorGender(opt.value)}
                    style={{
                      flex: 1, padding: '12px 8px',
                      background: tutorGender === opt.value ? 'rgba(0,128,128,0.08)' : '#fff',
                      border: `2px solid ${tutorGender === opt.value ? '#008080' : 'rgba(0,128,128,0.18)'}`,
                      borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                      color: tutorGender === opt.value ? '#008080' : '#3d6275',
                      transition: 'all 0.15s',
                    }}
                  >
                    {isEs ? opt.labelEs : opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone number — optional */}
            <div>
              <label style={label()}>
                {isEs ? 'Número de teléfono (opcional)' : 'Phone Number (optional)'}
              </label>
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder={isEs ? 'Ej: +51 999 123 456' : 'e.g. +51 999 123 456'}
                style={inputStyle}
              />
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 7,
                marginTop: 8, padding: '8px 12px',
                background: 'rgba(0,128,128,0.05)', borderRadius: 8,
                border: '1px solid rgba(0,128,128,0.12)',
              }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🔒</span>
                <p style={{ fontSize: 12, color: '#5a8090', margin: 0, lineHeight: 1.5 }}>
                  {isEs
                    ? 'Tu número de teléfono nunca será compartido con tutores ni con otros miembros. Solo se utiliza para enviarte recordatorios.'
                    : 'Your phone number is never shared with tutors or other members. It is only used to send you reminders.'}
                </p>
              </div>
            </div>

            {/* Reminder preference */}
            <div style={{
              padding: '16px 18px', background: '#fff',
              border: '1.5px solid rgba(0,128,128,0.2)', borderRadius: 12,
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                <div style={{ position: 'relative', flexShrink: 0, marginTop: 1 }}>
                  <input
                    type="checkbox"
                    checked={receiveReminders}
                    onChange={e => setReceiveReminders(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#008080', cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f2b3d', marginBottom: 3 }}>
                    {isEs
                      ? 'Recibir recordatorios y notificaciones'
                      : 'Receive reminders and notifications'}
                  </div>
                  <div style={{ fontSize: 13, color: '#7a9cac', lineHeight: 1.5 }}>
                    {isEs
                      ? 'Avísame sobre mis próximas sesiones de tutoría y cuando mi tutor me envíe un mensaje.'
                      : 'Notify me about upcoming tutoring sessions and when my tutor sends me a message.'}
                  </div>
                </div>
              </label>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#dc2626' }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? 'rgba(255,111,97,0.5)' : '#FF6F61', color: '#fff', border: 'none', borderRadius: 12, padding: '15px', fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(255,111,97,0.35)', transition: 'all 0.15s' }}
            >
              {loading ? (isEs ? 'Guardando…' : 'Saving…') : (isEs ? 'Guardar y continuar →' : 'Save & Continue →')}
            </button>

          </form>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
