import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { API_BASE } from '../api'

const SA_COUNTRIES = [
  'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia',
  'Ecuador', 'Guyana', 'Paraguay', 'Peru', 'Suriname',
  'Uruguay', 'Venezuela',
]

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

const ENGLISH_LEVELS = [
  { value: 'beginner',     label: 'Beginner 🌱',     desc: 'Just beginning to learn some words' },
  { value: 'intermediate', label: 'Intermediate 📖', desc: 'Can speak slowly with basic sentences' },
  { value: 'advanced',     label: 'Advanced 🎓',     desc: 'Larger vocabulary, studied multiple years' },
]

const FOCUS_OPTIONS = [
  { value: 'english', label: 'Learn English 🗣️' },
  { value: 'culture', label: 'Learn American Culture 🇺🇸' },
  { value: 'both',    label: 'Both ✨' },
]

const GENDER_OPTIONS = [
  { value: 'male',          label: 'Male tutor' },
  { value: 'female',        label: 'Female tutor' },
  { value: 'no_preference', label: 'No preference' },
]

const inputStyle = {
  width: '100%', background: '#fff', border: '1px solid rgba(0,128,128,0.28)',
  borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#0f2b3d',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#3d6275', marginBottom: 6 }
const sectionHeadStyle = { fontSize: 13, fontWeight: 800, color: '#7a9cac', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }

function Avatar({ user, size = 110, onUpload }) {
  const fileRef = useRef()
  const initial = user?.full_name?.[0]?.toUpperCase() || '?'
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      {user?.has_photo ? (
        <img src={`${API_BASE}/api/users/${user.id}/photo`} alt="Profile"
          style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '3px solid #A0D3E8' }} />
      ) : (
        <div style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(0,128,128,0.12)', border: '3px solid #A0D3E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 900, color: '#008080' }}>
          {initial}
        </div>
      )}
      {onUpload && (
        <>
          <button onClick={() => fileRef.current.click()}
            style={{ position: 'absolute', bottom: 3, right: 3, background: '#008080', color: '#fff', border: 'none', borderRadius: '50%', width: 30, height: 30, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            title="Change photo">📷</button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { if (e.target.files[0]) onUpload(e.target.files[0]) }} />
        </>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { user, token, refreshUser } = useAuth()
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const isEs = lang === 'es'
  const isStudent = user?.role === 'student'
  const isTutor = user?.role === 'tutor'

  // Shared editable fields
  const [bio, setBio] = useState(user?.bio || '')
  const [goals, setGoals] = useState(user?.goals || '')
  const [school, setSchool] = useState(user?.school || '')

  // Student-specific editable fields
  const [dob, setDob] = useState(user?.date_of_birth || '')
  const [englishLevel, setEnglishLevel] = useState(user?.english_level || '')
  const [tutorGender, setTutorGender] = useState(user?.preferred_tutor_gender || '')
  const [focus, setFocus] = useState(user?.preferred_focus || '')
  const [country, setCountry] = useState(user?.country || '')
  const [city, setCity] = useState(user?.city || '')

  // Tutor-specific editable fields
  const [tutorCity, setTutorCity] = useState(user?.city || '')
  const [state, setState] = useState(user?.state || '')
  const [grade, setGrade] = useState(user?.grade || '')
  const [spanishLevel, setSpanishLevel] = useState(user?.spanish_level || '')

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Change password state
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState('')

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setSaveError('')
    try {
      const body = {
        bio: bio || null,
        goals: goals || null,
        school: school || null,
      }
      if (isStudent) {
        body.date_of_birth = dob || null
        body.english_level = englishLevel || null
        body.preferred_focus = focus || null
        body.preferred_tutor_gender = tutorGender || null
        body.country = country || null
        body.city = city || null
      }
      if (isTutor) {
        body.city = tutorCity || null
        body.state = state || null
        body.grade = grade || null
        body.spanish_level = spanishLevel || null
      }
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to save')
      await refreshUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setSaveError(isEs ? 'Error al guardar. Intenta de nuevo.' : 'Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword() {
    setPwError('')
    if (newPw.length < 6) {
      setPwError(isEs ? 'La contraseña debe tener al menos 6 caracteres.' : 'New password must be at least 6 characters.')
      return
    }
    if (newPw !== confirmPw) {
      setPwError(isEs ? 'Las contraseñas no coinciden.' : 'Passwords do not match.')
      return
    }
    setPwSaving(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPw, new_password: newPw }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      setPwSaved(true)
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setTimeout(() => setPwSaved(false), 3000)
    } catch (err) {
      setPwError(err.message === 'Current password is incorrect'
        ? (isEs ? 'La contraseña actual es incorrecta.' : 'Current password is incorrect.')
        : (isEs ? 'No se pudo actualizar. Intenta de nuevo.' : 'Could not update password. Please try again.'))
    } finally {
      setPwSaving(false)
    }
  }

  async function handlePhotoUpload(file) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      await fetch(`${API_BASE}/api/auth/profile/photo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      await refreshUser()
    } finally {
      setUploading(false)
    }
  }

  function backPath() {
    if (user?.role === 'admin') return '/dashboard/admin'
    if (user?.role === 'tutor') return '/dashboard/tutor'
    return '/dashboard/student'
  }

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      <div style={{ flex: 1, maxWidth: 620, margin: '0 auto', width: '100%', padding: '36px 24px 80px' }}>

        <button onClick={() => navigate(backPath())}
          style={{ background: 'none', border: 'none', color: '#008080', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 24, padding: 0 }}>
          ← {isEs ? 'Volver al panel' : 'Back to Dashboard'}
        </button>

        {/* Main profile card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', border: '1px solid rgba(0,128,128,0.12)', boxShadow: '0 4px 20px rgba(0,128,128,0.08)' }}>

          {/* Avatar + name */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {uploading ? (
              <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'rgba(0,128,128,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 28 }}>⏳</div>
            ) : (
              <Avatar user={user} size={110} onUpload={handlePhotoUpload} />
            )}
            <p style={{ fontSize: 11, color: '#7a9cac', marginTop: 6, marginBottom: 0 }}>
              {isEs ? 'Clic en 📷 para cambiar foto' : 'Click 📷 to change photo'}
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f2b3d', margin: '14px 0 4px' }}>{user?.full_name}</h2>
            <div style={{ display: 'inline-block', background: 'rgba(255,111,97,0.1)', color: '#FF6F61', borderRadius: 20, padding: '3px 14px', fontSize: 12, fontWeight: 800, textTransform: 'capitalize' }}>
              {user?.role}
            </div>
          </div>

          {/* Read-only: email only */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={sectionHeadStyle}>{isEs ? 'Información de cuenta' : 'Account Info'}</h3>
            <div style={{ background: 'rgba(0,128,128,0.07)', border: '1px solid rgba(0,128,128,0.18)', borderRadius: 10, padding: '10px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#7a9cac', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{isEs ? 'Correo electrónico' : 'Email'}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f2b3d' }}>{user?.email}</div>
            </div>
          </div>

          {/* Editable fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={sectionHeadStyle}>{isEs ? 'Información editable' : 'Edit Profile'}</h3>

            {/* Student fields */}
            {isStudent && (
              <>
                <div>
                  <label style={labelStyle}>{isEs ? 'Fecha de nacimiento' : 'Date of Birth'}</label>
                  <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }} />
                </div>

                <div>
                  <label style={labelStyle}>{isEs ? 'Nivel de inglés' : 'English Level'}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {ENGLISH_LEVELS.map(opt => (
                      <button key={opt.value} type="button" onClick={() => setEnglishLevel(opt.value)}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: englishLevel === opt.value ? 'rgba(0,128,128,0.08)' : '#fff', border: `2px solid ${englishLevel === opt.value ? '#008080' : 'rgba(0,128,128,0.18)'}`, borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: englishLevel === opt.value ? '#008080' : '#0f2b3d' }}>{opt.label}</div>
                          <div style={{ fontSize: 12, color: '#7a9cac' }}>{opt.desc}</div>
                        </div>
                        {englishLevel === opt.value && <span style={{ color: '#008080', fontSize: 16 }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>{isEs ? 'Preferencia de tutor' : 'Tutor Preference'}</label>
                  <select value={tutorGender} onChange={e => setTutorGender(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">{isEs ? '— Selecciona —' : '— Select —'}</option>
                    {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>{isEs ? 'Enfoque preferido' : 'Preferred Focus'}</label>
                  <select value={focus} onChange={e => setFocus(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">{isEs ? '— Selecciona —' : '— Select —'}</option>
                    {FOCUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>{isEs ? 'País' : 'Country'}</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">{isEs ? '— Selecciona —' : '— Select —'}</option>
                    {SA_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>{isEs ? 'Ciudad' : 'City'}</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)}
                    placeholder={isEs ? 'Lima, Cusco…' : 'Lima, Cusco…'}
                    style={inputStyle} />
                </div>
              </>
            )}

            {/* Tutor fields */}
            {isTutor && (
              <>
                <div>
                  <label style={labelStyle}>{isEs ? 'Ciudad' : 'City'}</label>
                  <input type="text" value={tutorCity} onChange={e => setTutorCity(e.target.value)}
                    placeholder="Newark, Hoboken, Trenton…" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{isEs ? 'Estado' : 'State'}</label>
                  <select value={state} onChange={e => setState(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">{isEs ? '— Selecciona —' : '— Select —'}</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>{isEs ? 'Grado' : 'Grade'}</label>
                  <select value={grade} onChange={e => setGrade(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">{isEs ? '— Selecciona —' : '— Select —'}</option>
                    {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>{isEs ? 'Nivel de español' : 'Spanish Level'}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { value: 'beginner',     label: 'Beginner',     icon: '🌱', desc: 'I know very little Spanish.' },
                      { value: 'intermediate', label: 'Intermediate', icon: '📖', desc: 'I can hold a basic conversation.' },
                      { value: 'advanced',     label: 'Advanced',     icon: '🎓', desc: 'I am comfortable in Spanish.' },
                    ].map(opt => (
                      <button key={opt.value} type="button" onClick={() => setSpanishLevel(opt.value)}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: spanishLevel === opt.value ? 'rgba(0,128,128,0.08)' : '#fff', border: `2px solid ${spanishLevel === opt.value ? '#008080' : 'rgba(0,128,128,0.18)'}`, borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                        <span style={{ fontSize: 20 }}>{opt.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: spanishLevel === opt.value ? '#008080' : '#0f2b3d' }}>{opt.label}</div>
                          <div style={{ fontSize: 12, color: '#7a9cac' }}>{opt.desc}</div>
                        </div>
                        {spanishLevel === opt.value && <span style={{ color: '#008080', fontSize: 16 }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Shared fields */}
            <div>
              <label style={labelStyle}>{isEs ? 'Escuela / Colegio' : 'School'}</label>
              <input type="text" value={school} onChange={e => setSchool(e.target.value)}
                placeholder={isStudent
                  ? (isEs ? 'Nombre de tu escuela' : 'Your school name')
                  : (isEs ? 'Tu escuela secundaria en NJ' : 'Your high school in NJ')}
                style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>{isEs ? 'Sobre mí' : 'About Me'}</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                placeholder={isStudent
                  ? (isEs ? 'Me encanta la música y el fútbol…' : 'I love music and soccer…')
                  : (isEs ? 'Soy estudiante de tercer año en NJ…' : "I'm a junior at a NJ high school…")}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div>
              <label style={labelStyle}>{isEs ? 'Mis metas' : 'My Goals'}</label>
              <textarea value={goals} onChange={e => setGoals(e.target.value)} rows={3}
                placeholder={isStudent
                  ? (isEs ? 'Quiero aprender inglés para…' : 'I want to learn English to…')
                  : (isEs ? 'Quiero que mi estudiante…' : 'I want my student to…')}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {saveError && (
              <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>{saveError}</div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
              {saved && <span style={{ fontSize: 13, fontWeight: 700, color: '#008080' }}>✓ {isEs ? '¡Guardado!' : 'Saved!'}</span>}
              <button onClick={handleSave} disabled={saving}
                style={{ background: saving ? 'rgba(255,111,97,0.5)' : '#FF6F61', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 15, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(255,111,97,0.3)' }}>
                {saving ? (isEs ? 'Guardando…' : 'Saving…') : (isEs ? 'Guardar perfil' : 'Save Profile')}
              </button>
            </div>
          </div>
        </div>

        {/* Change Password card — only for email/password accounts (no social login) */}
        {!user?.has_social_login && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px', border: '1px solid rgba(0,128,128,0.12)', boxShadow: '0 4px 20px rgba(0,128,128,0.08)', marginTop: 24 }}>
            <h3 style={sectionHeadStyle}>{isEs ? 'Cambiar contraseña' : 'Change Password'}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>{isEs ? 'Contraseña actual' : 'Current Password'}</label>
                <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                  placeholder="••••••••" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{isEs ? 'Nueva contraseña' : 'New Password'}</label>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                  placeholder="••••••••" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{isEs ? 'Confirmar nueva contraseña' : 'Confirm New Password'}</label>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  placeholder="••••••••" style={inputStyle} />
              </div>

              {pwError && (
                <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>{pwError}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
                {pwSaved && <span style={{ fontSize: 13, fontWeight: 700, color: '#008080' }}>✓ {isEs ? '¡Contraseña actualizada!' : 'Password updated!'}</span>}
                <button onClick={handleChangePassword} disabled={pwSaving || !currentPw || !newPw || !confirmPw}
                  style={{ background: (pwSaving || !currentPw || !newPw || !confirmPw) ? 'rgba(0,128,128,0.4)' : '#008080', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 15, fontWeight: 800, cursor: (pwSaving || !currentPw || !newPw || !confirmPw) ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(0,128,128,0.2)' }}>
                  {pwSaving ? (isEs ? 'Actualizando…' : 'Updating…') : (isEs ? 'Actualizar contraseña' : 'Update Password')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <PublicFooter />
    </div>
  )
}
