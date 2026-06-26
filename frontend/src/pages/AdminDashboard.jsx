import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { API_BASE } from '../api'

const PURPLE = '#7c3aed'
const LIGHT_PURPLE = '#ede9fe'

function AdminTab({ id, label, active, onClick }) {
  return (
    <button onClick={() => onClick(id)} style={{
      background: 'none', border: 'none', padding: '10px 20px',
      fontWeight: 700, fontSize: 14, cursor: 'pointer',
      color: active ? PURPLE : '#6b7280',
      borderBottom: active ? `3px solid ${PURPLE}` : '3px solid transparent',
      marginBottom: -2, whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

// ── Curriculum tab — 3-track drill-down ──────────────────────────────────────

const TRACK_META = {
  beginner:     { icon: '🌱', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Beginner' },
  intermediate: { icon: '📈', color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe', label: 'Intermediate' },
  advanced:     { icon: '🚀', color: PURPLE,    bg: LIGHT_PURPLE, border: '#ddd6fe', label: 'Advanced' },
}

function parseLessonSections(outline) {
  const lines = (outline || '').split('\n')
  const oIdx = lines.findIndex(l => l.includes('LESSON OVERVIEW'))
  const tIdx = lines.findIndex(l => l.includes('TUTOR GUIDE'))
  const nIdx = lines.findIndex(l => l.includes('TUTOR NOTE'))
  const overview = oIdx !== -1
    ? lines.slice(oIdx + 1, tIdx !== -1 ? tIdx : undefined).join('\n').trim()
    : (outline || '')
  const guide = tIdx !== -1
    ? lines.slice(tIdx + 1, nIdx !== -1 ? nIdx : undefined).join('\n').trim()
    : ''
  const note = nIdx !== -1
    ? lines.slice(nIdx).join('\n').replace(/^TUTOR NOTE:?\s*/m, '').trim()
    : ''
  return { overview, guide, note }
}

function CurriculumTab({ token }) {
  const [tracks, setTracks] = useState([])
  const [lessons, setLessons] = useState([])
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lessonsLoading, setLessonsLoading] = useState(false)
  const [lessonLoading, setLessonLoading] = useState(false)
  const [view, setView] = useState('tracks') // 'tracks' | 'lessons' | 'lesson'
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', outline: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/curriculum/tracks`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setTracks).finally(() => setLoading(false))
  }, [])

  async function openTrack(track) {
    setSelectedTrack(track)
    setView('lessons')
    setLessonsLoading(true)
    const res = await fetch(`${API_BASE}/api/admin/curriculum/tracks/${track.id}/lessons`, { headers: { Authorization: `Bearer ${token}` } })
    setLessons(await res.json())
    setLessonsLoading(false)
  }

  async function openLesson(summary) {
    setView('lesson')
    setLessonLoading(true)
    setLesson(null)
    setEditMode(false)
    const res = await fetch(`${API_BASE}/api/admin/curriculum/lessons/${summary.id}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setLesson(data)
    setEditForm({ title: data.title, outline: data.outline || '' })
    setLessonLoading(false)
  }

  async function saveLesson() {
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/curriculum/lessons/${lesson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      })
      const updated = await res.json()
      setLesson(updated)
      setEditForm({ title: updated.title, outline: updated.outline || '' })
      setLessons(ls => ls.map(l => l.id === updated.id ? { ...l, title: updated.title } : l))
      setEditMode(false)
    } finally { setSaving(false) }
  }

  // ── Track list ──────────────────────────────────────────────────────────────
  if (view === 'tracks') {
    if (loading) return <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Loading…</p>
    if (tracks.length === 0) return (
      <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 16, border: '2px dashed #ddd6fe' }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>📚</div>
        <p style={{ color: '#6b7280', fontSize: 14 }}>No curriculum tracks found. Run the seed to populate them.</p>
      </div>
    )
    return (
      <div>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
          Three curriculum tracks — click one to view and edit its lessons.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tracks.map(track => {
            const m = TRACK_META[track.level] || TRACK_META.beginner
            return (
              <button key={track.id} onClick={() => openTrack(track)} style={{
                background: m.bg, border: `2px solid ${m.border}`, borderRadius: 18,
                padding: '22px 26px', textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 18,
                transition: 'box-shadow 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 20px ${m.border}`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ fontSize: 40, flexShrink: 0 }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>{track.title}</div>
                  {track.description && (
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                      {track.description.length > 100 ? track.description.slice(0, 100) + '…' : track.description}
                    </div>
                  )}
                  <div style={{ marginTop: 8 }}>
                    <span style={{ background: m.color, color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
                      {track.lesson_count} lesson{track.lesson_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <span style={{ color: m.color, fontWeight: 800, fontSize: 20, flexShrink: 0 }}>→</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Lesson list ─────────────────────────────────────────────────────────────
  if (view === 'lessons') {
    const m = TRACK_META[selectedTrack?.level] || TRACK_META.beginner
    return (
      <div>
        <button onClick={() => setView('tracks')} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          color: m.color, fontWeight: 700, fontSize: 14, marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>← All Tracks</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, padding: '14px 18px', background: m.bg, borderRadius: 14, border: `1.5px solid ${m.border}` }}>
          <span style={{ fontSize: 28 }}>{m.icon}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#1e293b' }}>{selectedTrack?.title}</div>
            <div style={{ fontSize: 12, color: m.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
          </div>
        </div>

        {lessonsLoading ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>Loading lessons…</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lessons.map(l => (
              <div key={l.id} style={{
                background: '#fff', borderRadius: 12, padding: '16px 20px',
                border: `1.5px solid ${m.border}`,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: m.bg, border: `2px solid ${m.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, color: m.color,
                }}>{l.lesson_number}</div>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{l.title}</div>
                <button onClick={() => openLesson(l)} style={{
                  background: m.color, color: '#fff', border: 'none', borderRadius: 8,
                  padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                }}>View Lesson →</button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── Lesson detail ───────────────────────────────────────────────────────────
  const m = TRACK_META[selectedTrack?.level] || TRACK_META.beginner

  if (lessonLoading || !lesson) return (
    <div>
      <button onClick={() => setView('lessons')} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        color: m.color, fontWeight: 700, fontSize: 14, marginBottom: 18,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>← Back to Lessons</button>
      <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>Loading…</p>
    </div>
  )

  const vocab = (() => { try { return JSON.parse(lesson.vocabulary || '[]') } catch { return [] } })()
  const expressions = (() => { try { return JSON.parse(lesson.expressions || '[]') } catch { return [] } })()
  const { overview, guide, note } = parseLessonSections(lesson.outline)

  if (editMode) {
    return (
      <div>
        <button onClick={() => setEditMode(false)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          color: m.color, fontWeight: 700, fontSize: 14, marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>← Cancel Edit</button>

        <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1e293b', marginBottom: 20 }}>
          Edit Lesson #{lesson.lesson_number}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Title</label>
            <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Lesson Outline</label>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
              Use section headers LESSON OVERVIEW, TUTOR GUIDE, and TUTOR NOTE: to structure the content.
            </p>
            <textarea value={editForm.outline} onChange={e => setEditForm(f => ({ ...f, outline: e.target.value }))}
              rows={22} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={() => setEditMode(false)} style={cancelBtnStyle}>Cancel</button>
          <button onClick={saveLesson} disabled={!editForm.title.trim() || saving}
            style={{ ...saveBtnStyle, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => setView('lessons')} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        color: m.color, fontWeight: 700, fontSize: 14, marginBottom: 18,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>← Back to Lessons</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: m.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
            {m.icon} {m.label} · Lesson {lesson.lesson_number}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>{lesson.title}</h2>
        </div>
        <button onClick={() => setEditMode(true)} style={{ ...smallBtn(PURPLE), flexShrink: 0 }}>✏️ Edit</button>
      </div>

      {overview && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#008080', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Lesson Overview</div>
          <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap', background: '#f8fafc', borderRadius: 12, padding: '16px 18px' }}>{overview}</div>
        </div>
      )}

      {guide && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#008080', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Tutor Guide</div>
          <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap', background: '#f8fafc', borderRadius: 12, padding: '16px 18px' }}>{guide}</div>
        </div>
      )}

      {note && (
        <div style={{ marginBottom: 22, padding: '14px 18px', background: 'rgba(255,111,97,0.06)', borderLeft: '3px solid #FF6F61', borderRadius: '0 10px 10px 0' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#FF6F61' }}>Tutor Note: </span>
          <span style={{ fontSize: 13, color: '#374151' }}>{note}</span>
        </div>
      )}

      {vocab.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#008080', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Vocabulary</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
            {vocab.map((v, i) => (
              <div key={i} style={{ padding: '10px 14px', background: 'rgba(160,211,232,0.12)', border: '1px solid rgba(160,211,232,0.3)', borderRadius: 10 }}>
                <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>{v.word}</span>
                <span style={{ color: '#94a3b8', fontSize: 13 }}> — </span>
                <span style={{ color: '#475569', fontSize: 13 }}>{v.definition}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {expressions.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#008080', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Expressions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {expressions.map((e, i) => (
              <div key={i} style={{ padding: '10px 14px', background: 'rgba(0,128,128,0.04)', border: '1px solid rgba(0,128,128,0.1)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 14, flexShrink: 0 }}>"{e.expression}"</span>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>→</span>
                <span style={{ color: '#475569', fontSize: 13 }}>{e.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PairingsTab({ token }) {
  const [pairings, setPairings] = useState([])
  const [tutors, setTutors] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ tutor_id: '', student_id: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/admin/pairings`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/api/users/tutors`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/api/users/students`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([p, t, s]) => { setPairings(p); setTutors(t); setStudents(s) })
      .finally(() => setLoading(false))
  }, [])

  async function savePairing() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/admin/pairings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tutor_id: Number(form.tutor_id), student_id: Number(form.student_id) }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || 'Error creating pairing')
        return
      }
      const newPairing = await res.json()
      setPairings(p => [newPairing, ...p])
      setShowModal(false)
      setForm({ tutor_id: '', student_id: '' })
    } finally {
      setSaving(false)
    }
  }

  async function deletePairing(id) {
    await fetch(`${API_BASE}/api/admin/pairings/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    setPairings(p => p.filter(x => x.id !== id))
  }

  if (loading) return <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Loading…</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ background: LIGHT_PURPLE, color: PURPLE, borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
          {pairings.length} pairing{pairings.length !== 1 ? 's' : ''}
        </span>
        <button onClick={() => setShowModal(true)} style={createBtnStyle}>+ Add Pairing</button>
      </div>

      {pairings.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: '#fff', borderRadius: 16, border: '2px dashed #ddd6fe',
        }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>👥</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#374151', marginBottom: 8 }}>No pairings yet</h3>
          <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 20 }}>
            Assign each tutor to their student so they can see each other's work.
          </p>
          <button onClick={() => setShowModal(true)} style={createBtnStyle}>+ Add First Pairing</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pairings.map(p => (
            <PairingCard key={p.id} pairing={p} onDelete={deletePairing} />
          ))}
        </div>
      )}

      <div style={{
        marginTop: 32, background: `linear-gradient(135deg, ${PURPLE}, #6d28d9)`,
        borderRadius: 16, padding: '22px 28px', color: '#fff',
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>👥 How Pairings Work</div>
        <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.8 }}>
          1. Pair each NJ tutor with one or more Peruvian students.<br />
          2. Tutors only see their own students when scheduling meetings or assigning work.<br />
          3. Students only receive assignments from their paired tutor.<br />
          4. Remove a pairing at any time to reassign students.
        </p>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }}
          onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); setError('') } }}
        >
          <div style={{
            background: '#fff', borderRadius: 20, padding: '32px 28px',
            width: '100%', maxWidth: 440,
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>New Pairing</h2>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>
              Assign a tutor to a student. They'll see each other in their dashboards.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Tutor *">
                <select value={form.tutor_id} onChange={e => setForm(f => ({ ...f, tutor_id: e.target.value }))} style={inputStyle}>
                  <option value="" style={{ color: '#111', background: '#fff' }}>Select tutor…</option>
                  {tutors.map(t => <option key={t.id} value={t.id} style={{ color: '#111', background: '#fff' }}>{t.full_name}{t.school ? ` (${t.school})` : ''}</option>)}
                </select>
              </Field>
              <Field label="Student *">
                <select value={form.student_id} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} style={inputStyle}>
                  <option value="" style={{ color: '#111', background: '#fff' }}>Select student…</option>
                  {students.map(s => <option key={s.id} value={s.id} style={{ color: '#111', background: '#fff' }}>{s.full_name}{s.grade ? ` (Grade ${s.grade})` : ''}</option>)}
                </select>
              </Field>
            </div>

            {error && <p style={{ fontSize: 13, color: '#dc2626', marginTop: 12 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setForm({ tutor_id: '', student_id: '' }); setError('') }}
                style={cancelBtnStyle}>Cancel</button>
              <button onClick={savePairing}
                disabled={!form.tutor_id || !form.student_id || saving}
                style={{ ...saveBtnStyle, opacity: (!form.tutor_id || !form.student_id || saving) ? 0.6 : 1 }}>
                {saving ? 'Saving…' : 'Pair Them'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PairingCard({ pairing, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '16px 20px',
      border: '2px solid #e5e7eb', boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ background: '#dbeafe', borderRadius: 10, padding: '8px 14px', fontSize: 14, fontWeight: 800, color: '#2563eb' }}>
          🎓 {pairing.tutor_name}
        </div>
        <span style={{ fontSize: 20, color: '#9ca3af' }}>→</span>
        <div style={{ background: '#fef3c7', borderRadius: 10, padding: '8px 14px', fontSize: 14, fontWeight: 800, color: '#d97706' }}>
          ⭐ {pairing.student_name}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {confirming
          ? <>
              <button onClick={() => onDelete(pairing.id)} style={smallBtn('#dc2626')}>Remove</button>
              <button onClick={() => setConfirming(false)} style={smallBtn('#6b7280')}>Cancel</button>
            </>
          : <button onClick={() => setConfirming(true)} style={smallBtn('#dc2626')}>🗑 Remove</button>
        }
      </div>
    </div>
  )
}

// ── Curriculum-assignment modal (admin picks lessons for a student) ────────────

function CurriculumAssignModal({ student, token, onClose }) {
  const [tracksWithLessons, setTracksWithLessons] = useState([])
  const [assignedIds, setAssignedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(null)

  useEffect(() => {
    const h = { Authorization: `Bearer ${token}` }
    Promise.all([
      fetch(`${API_BASE}/api/admin/curriculum/tracks`, { headers: h }).then(r => r.json()),
      fetch(`${API_BASE}/api/admin/students/${student.id}/curriculum`, { headers: h }).then(r => r.json()),
    ]).then(async ([tracks, assigned]) => {
      const withLessons = await Promise.all(
        tracks.map(t =>
          fetch(`${API_BASE}/api/admin/curriculum/tracks/${t.id}/lessons`, { headers: h })
            .then(r => r.json()).then(ls => ({ ...t, lessons: ls }))
        )
      )
      setTracksWithLessons(withLessons)
      setAssignedIds(new Set(assigned.map(a => a.lesson_id)))
    }).finally(() => setLoading(false))
  }, [])

  async function toggle(lessonId) {
    setToggling(lessonId)
    try {
      if (assignedIds.has(lessonId)) {
        await fetch(`${API_BASE}/api/admin/students/${student.id}/curriculum/${lessonId}`, {
          method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
        })
        setAssignedIds(s => { const n = new Set(s); n.delete(lessonId); return n })
      } else {
        await fetch(`${API_BASE}/api/admin/students/${student.id}/curriculum`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ lesson_id: lessonId }),
        })
        setAssignedIds(s => new Set([...s, lessonId]))
      }
    } finally { setToggling(null) }
  }

  const totalLessons = tracksWithLessons.reduce((sum, t) => sum + (t.lessons?.length || 0), 0)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '28px', width: '100%', maxWidth: 580, maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <h2 style={{ fontSize: 19, fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>
          📚 Curriculum for {student.full_name}
        </h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
          Select which lessons this student will follow. Their tutor will see these in the student profile.
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>Loading…</p>
        ) : totalLessons === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: 24, fontStyle: 'italic' }}>
            No curriculum lessons found.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {tracksWithLessons.map(track => {
              const tm = TRACK_META[track.level] || TRACK_META.beginner
              if (!track.lessons?.length) return null
              return (
                <div key={track.id}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: tm.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                    {tm.icon} {tm.label}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {track.lessons.map(item => {
                      const assigned = assignedIds.has(item.id)
                      const busy = toggling === item.id
                      return (
                        <div key={item.id} style={{
                          borderRadius: 10, padding: '11px 14px',
                          border: `2px solid ${assigned ? tm.color : '#e5e7eb'}`,
                          background: assigned ? tm.bg : '#fafafa',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: tm.color, minWidth: 20 }}>#{item.lesson_number}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{item.title}</span>
                          </div>
                          <button onClick={() => toggle(item.id)} disabled={busy} style={{
                            background: assigned ? '#dc2626' : tm.color, color: '#fff',
                            border: 'none', borderRadius: 7, padding: '6px 12px',
                            fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            opacity: busy ? 0.6 : 1, flexShrink: 0,
                          }}>
                            {busy ? '…' : assigned ? '✕ Remove' : '+ Add'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <button onClick={onClose} style={cancelBtnStyle}>Done</button>
        </div>
      </div>
    </div>
  )
}

// ── Users tab ─────────────────────────────────────────────────────────────────

function UsersTab({ token }) {
  const [tutors, setTutors] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [curriculumStudent, setCurriculumStudent] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/users/tutors`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/api/users/students`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([t, s]) => { setTutors(t); setStudents(s) }).finally(() => setLoading(false))
  }, [])

  async function deleteUser(id) {
    await fetch(`${API_BASE}/api/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setTutors(ts => ts.filter(u => u.id !== id))
    setStudents(ss => ss.filter(u => u.id !== id))
    setConfirmDelete(null)
  }

  if (loading) return <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Loading…</p>

  function UserCard({ user: u, roleColor, roleBg, isStudent }) {
    return (
      <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '2px solid #e5e7eb', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: roleBg, border: `2px solid ${roleColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: roleColor, flexShrink: 0 }}>
            {u.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>{u.full_name}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              {[u.email, u.grade && `Grade ${u.grade}`, u.school].filter(Boolean).join(' · ')}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {isStudent && (
            <button onClick={() => setCurriculumStudent(u)} style={smallBtn(PURPLE)}>📚 Curriculum</button>
          )}
          {confirmDelete === u.id
            ? <>
                <button onClick={() => deleteUser(u.id)} style={smallBtn('#dc2626')}>Delete</button>
                <button onClick={() => setConfirmDelete(null)} style={smallBtn('#6b7280')}>Cancel</button>
              </>
            : <button onClick={() => setConfirmDelete(u.id)} style={smallBtn('#dc2626')}>🗑 Delete</button>
          }
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <span style={{ background: '#dbeafe', color: '#2563eb', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
          🎓 {tutors.length} tutor{tutors.length !== 1 ? 's' : ''}
        </span>
        <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
          ⭐ {students.length} student{students.length !== 1 ? 's' : ''}
        </span>
      </div>

      {tutors.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#2563eb', marginBottom: 12 }}>🎓 Tutors</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tutors.map(u => <UserCard key={u.id} user={u} roleColor="#2563eb" roleBg="#dbeafe" isStudent={false} />)}
          </div>
        </div>
      )}

      {students.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#d97706', marginBottom: 12 }}>⭐ Students</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {students.map(u => <UserCard key={u.id} user={u} roleColor="#d97706" roleBg="#fef3c7" isStudent={true} />)}
          </div>
        </div>
      )}

      {tutors.length === 0 && students.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 16, border: '2px dashed #ddd6fe' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <p style={{ color: '#6b7280', fontSize: 14 }}>No users yet. Accounts appear here once people register.</p>
        </div>
      )}

      {curriculumStudent && (
        <CurriculumAssignModal
          student={curriculumStudent}
          token={token}
          onClose={() => setCurriculumStudent(null)}
        />
      )}
    </div>
  )
}

// ── Overview tab ──────────────────────────────────────────────────────────────

function AdminStatCard({ icon, label, value, color }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>
      <span style={{ fontSize: 30 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
        <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  )
}

function OverviewTab({ token }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  if (!stats) return <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Loading…</p>

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        <AdminStatCard icon="🎓" label="Tutors"        value={stats.tutors}      color="#2563eb" />
        <AdminStatCard icon="⭐" label="Students"      value={stats.students}    color="#d97706" />
        <AdminStatCard icon="🔗" label="Pairings"      value={stats.pairings}    color={PURPLE} />
        <AdminStatCard icon="📚" label="Curriculum"    value={stats.curriculum}  color="#0891b2" />
        <AdminStatCard icon="📋" label="Assignments"   value={stats.assignments} color="#15803d" />
        <AdminStatCard icon="📅" label="Meetings"      value={stats.meetings}    color="#be185d" />
        <AdminStatCard icon="✅" label="Completions"   value={stats.completions} color="#15803d" />
      </div>

      <div style={{ background: `linear-gradient(135deg, ${PURPLE}, #6d28d9)`, borderRadius: 16, padding: '24px 28px', color: '#fff' }}>
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>🌎 Platform Summary</div>
        <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.9 }}>
          You have <strong>{stats.pairings}</strong> active tutor–student pairing{stats.pairings !== 1 ? 's' : ''} connecting{' '}
          <strong>{stats.tutors}</strong> tutor{stats.tutors !== 1 ? 's' : ''} in New Jersey with{' '}
          <strong>{stats.students}</strong> student{stats.students !== 1 ? 's' : ''} in Peru.<br />
          Students have completed <strong>{stats.completions}</strong> assignment{stats.completions !== 1 ? 's' : ''} so far.
        </p>
      </div>
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const { t } = useLanguage()
  const [tab, setTab] = useState('curriculum')

  return (
    <div style={{ minHeight: '100vh', background: 'rgba(245,243,255,0.88)', position: 'relative', zIndex: 1 }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b' }}>
            {t('admin.title')} 🛠️
          </h2>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>
            {user?.full_name} · Administrator
          </p>
        </div>

        <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '2px solid #ddd6fe', overflowX: 'auto' }}>
          <AdminTab id="curriculum" label={`📚 ${t('admin.tab.curriculum')}`} active={tab === 'curriculum'} onClick={setTab} />
          <AdminTab id="pairings"   label={`👥 ${t('admin.tab.pairings')}`}   active={tab === 'pairings'}   onClick={setTab} />
          <AdminTab id="users"      label={`👤 ${t('admin.tab.users')}`}      active={tab === 'users'}      onClick={setTab} />
          <AdminTab id="overview"   label={`📊 ${t('admin.tab.overview')}`}   active={tab === 'overview'}   onClick={setTab} />
        </div>

        {tab === 'curriculum' && <CurriculumTab token={token} />}
        {tab === 'pairings'   && <PairingsTab token={token} />}
        {tab === 'users'      && <UsersTab token={token} />}
        {tab === 'overview'   && <OverviewTab token={token} />}
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {hint && <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>{hint}</p>}
      {children}
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }
const inputStyle = { width: '100%', border: '2px solid #e5e7eb', borderRadius: 10, padding: '9px 13px', fontSize: 14, outline: 'none', fontFamily: "'Times New Roman', Times, serif", boxSizing: 'border-box' }
const createBtnStyle = { background: PURPLE, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }
const saveBtnStyle = { background: PURPLE, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }
const cancelBtnStyle = { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }
const smallBtn = color => ({ background: 'none', border: `1.5px solid ${color}`, color, borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' })
const badgeStyle = (bg, color) => ({ background: bg, color, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 })
