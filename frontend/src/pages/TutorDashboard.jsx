import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { API_BASE } from '../api'
import AvailabilityPanel from '../components/AvailabilityPanel'

const BLUE = '#008080'
const LIGHT_BLUE = 'rgba(0,128,128,0.1)'
const PURPLE = '#008080'

// ── Shared helpers ────────────────────────────────────────────────────────────

function isYouTube(url) {
  return url && (url.includes('youtube.com/watch') || url.includes('youtu.be/'))
}
function youtubeEmbed(url) {
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : url
}
function formatDT(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function VocabPills({ words }) {
  if (!words) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
      {words.split(',').map(w => w.trim()).filter(Boolean).map(w => (
        <span key={w} style={{ background: LIGHT_BLUE, color: BLUE, borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{w}</span>
      ))}
    </div>
  )
}

const TYPE_META = {
  homework: { label: 'Homework', color: '#2563eb', bg: '#dbeafe', icon: '📝' },
  practice: { label: 'Practice', color: '#008080', bg: 'rgba(0,128,128,0.1)', icon: '💪' },
  quiz:     { label: 'Quiz',     color: '#FF6F61', bg: 'rgba(255,111,97,0.1)', icon: '❓' },
}

// ── Tab button ────────────────────────────────────────────────────────────────

function Tab({ id, label, active, onClick }) {
  return (
    <button onClick={() => onClick(id)} style={{
      background: 'none', border: 'none', padding: '10px 18px',
      fontWeight: 700, fontSize: 14, cursor: 'pointer',
      color: active ? BLUE : '#6b7280',
      borderBottom: active ? `3px solid ${BLUE}` : '3px solid transparent',
      marginBottom: -2, whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

// ── Curriculum tab ────────────────────────────────────────────────────────────

function CurriculumTab({ token, onSelectForAssign }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/curriculum`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setItems).finally(() => setLoading(false))
  }, [])

  if (loading) return <Placeholder text="Loading curriculum…" />
  if (items.length === 0) return (
    <div style={emptyBox}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
      <p style={{ color: '#6b7280', fontSize: 14 }}>No curriculum items yet. Ask your administrator to add content.</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map(item => (
        <div key={item.id} style={{
          background: '#fff', borderRadius: 16, padding: '20px 22px',
          border: '1px solid rgba(0,128,128,0.18)', boxShadow: '0 2px 12px rgba(0,128,128,0.08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>{item.title}</h3>
              {item.description && <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{item.description}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {item.video_url && <span style={badge('#dbeafe', BLUE)}>🎬 Video</span>}
                {item.has_pdf && (
                  <a href={`${API_BASE}/api/curriculum/${item.id}/pdf`} target="_blank" rel="noreferrer"
                    style={{ ...badge('rgba(0,128,128,0.1)', '#008080'), textDecoration: 'none' }}>📄 Download PDF</a>
                )}
                <span style={badge('#f3f4f6', '#6b7280')}>By {item.admin_name}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              <button onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                style={smallBtn(PURPLE)}>{expanded === item.id ? '▲ Collapse' : '▼ View'}</button>
              <button onClick={() => onSelectForAssign(item)}
                style={smallBtn(BLUE)}>📋 Assign Work</button>
            </div>
          </div>

          {expanded === item.id && (
            <div style={{ marginTop: 16 }}>
              {item.video_url && isYouTube(item.video_url) && (
                <iframe src={youtubeEmbed(item.video_url)} width="100%" height="260"
                  frameBorder="0" allowFullScreen style={{ borderRadius: 10, display: 'block', marginBottom: 14 }} />
              )}
              {item.video_url && !isYouTube(item.video_url) && (
                <a href={item.video_url} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-block', marginBottom: 12, fontSize: 13, color: BLUE, fontWeight: 700 }}>
                  🎬 Watch Video →
                </a>
              )}
              {item.content && (
                <div style={{ background: 'rgba(0,128,128,0.04)', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {item.content}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Assign Work tab ───────────────────────────────────────────────────────────

function AssignModal({ initial, curriculum, students, onSave, onClose, saving }) {
  const [form, setForm] = useState(initial ?? {
    title: '', description: '', type: 'homework',
    due_date: '', student_id: '', curriculum_id: '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={modalBox}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>
          {initial ? 'Edit Assignment' : 'Assign Work'}
        </h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
          Create a homework, practice, or quiz for your student.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Type</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['homework', 'practice', 'quiz'].map(t => {
                const m = TYPE_META[t]
                return (
                  <button key={t} type="button" onClick={() => set('type', t)} style={{
                    flex: 1, padding: '10px 0', borderRadius: 10,
                    border: `2px solid ${form.type === t ? m.color : 'rgba(0,128,128,0.18)'}`,
                    background: form.type === t ? m.bg : '#fff',
                    color: form.type === t ? m.color : '#6b7280',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  }}>{m.icon} {m.label}</button>
                )
              })}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder='e.g. "Practice greetings vocabulary"' style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Instructions</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe what the student should do…"
              rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={labelStyle}>Assign To</label>
            <select value={form.student_id} onChange={e => set('student_id', e.target.value)} style={inputStyle}>
              <option value="" style={{ color: '#111', background: '#fff' }}>All students</option>
              {students.map(s => <option key={s.id} value={s.id} style={{ color: '#111', background: '#fff' }}>{s.full_name} ({s.grade || s.school})</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Due Date (optional)</label>
            <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)}
              style={{ ...inputStyle, width: 'auto' }} />
          </div>

          <div>
            <label style={labelStyle}>Link to Curriculum Item (optional)</label>
            <select value={form.curriculum_id} onChange={e => set('curriculum_id', e.target.value)} style={inputStyle}>
              <option value="" style={{ color: '#111', background: '#fff' }}>None</option>
              {curriculum.map(c => <option key={c.id} value={c.id} style={{ color: '#111', background: '#fff' }}>{c.title}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button onClick={() => onSave({ ...form, student_id: form.student_id ? Number(form.student_id) : null, curriculum_id: form.curriculum_id ? Number(form.curriculum_id) : null })}
            disabled={!form.title.trim() || saving}
            style={{ ...saveBtnStyle(BLUE), opacity: !form.title.trim() || saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AssignTab({ token, prefillCurriculum, onClearPrefill }) {
  const [assignments, setAssignments] = useState([])
  const [curriculum, setCurriculum] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/assignments`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/api/curriculum`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/api/users/students`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([a, c, s]) => { setAssignments(a); setCurriculum(c); setStudents(s) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (prefillCurriculum) setShowModal(true)
  }, [prefillCurriculum])

  async function saveAssignment(form) {
    setSaving(true)
    try {
      await fetch(`${API_BASE}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const res = await fetch(`${API_BASE}/api/assignments`, { headers: { Authorization: `Bearer ${token}` } })
      setAssignments(await res.json())
      setShowModal(false)
      onClearPrefill()
    } finally {
      setSaving(false)
    }
  }

  async function deleteAssignment(id) {
    await fetch(`${API_BASE}/api/assignments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setAssignments(a => a.filter(x => x.id !== id))
  }

  if (loading) return <Placeholder text="Loading…" />

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button onClick={() => { onClearPrefill(); setShowModal(true) }} style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          + Assign Homework / Practice / Quiz
        </button>
      </div>

      {assignments.length === 0 ? (
        <div style={emptyBox}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <p style={{ color: '#6b7280', fontSize: 14 }}>No assignments yet. Assign work after your virtual meetings!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {assignments.map(a => {
            const m = TYPE_META[a.type] || TYPE_META.homework
            return (
              <div key={a.id} style={{
                background: '#fff', borderRadius: 14, padding: '16px 20px',
                border: `2px solid ${m.bg}`, boxShadow: '0 2px 10px rgba(0,128,128,0.07)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span style={badge(m.bg, m.color)}>{m.icon} {m.label}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>{a.title}</span>
                  </div>
                  {a.description && <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{a.description}</p>}
                  <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                    {a.due_date && <span style={{ fontSize: 12, color: '#94a3b8' }}>📅 Due {a.due_date}</span>}
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>
                      {a.student_id
                        ? `→ ${students.find(s => s.id === a.student_id)?.full_name || 'Student'}`
                        : '→ All students'}
                    </span>
                    {a.curriculum_title && <span style={{ fontSize: 12, color: PURPLE }}>📚 {a.curriculum_title}</span>}
                  </div>
                </div>
                <button onClick={() => deleteAssignment(a.id)} style={smallBtn('#dc2626')}>🗑</button>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <AssignModal
          initial={prefillCurriculum ? { title: '', description: '', type: 'homework', due_date: '', student_id: '', curriculum_id: String(prefillCurriculum.id) } : null}
          curriculum={curriculum}
          students={students}
          onSave={saveAssignment}
          onClose={() => { setShowModal(false); onClearPrefill() }}
          saving={saving}
        />
      )}
    </div>
  )
}

// ── Schedule tab ──────────────────────────────────────────────────────────────

function MeetingModal({ students, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    title: '', scheduled_at: '', duration_minutes: 45, meeting_url: '', student_id: '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={modalBox}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>Schedule a Meeting</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Students will see this on their home screen.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Meeting Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder='e.g. "English session — Colors"' style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Student *</label>
            <select value={form.student_id} onChange={e => set('student_id', e.target.value)} style={inputStyle} required>
              <option value="" style={{ color: '#111', background: '#fff' }}>Select student</option>
              {students.map(s => <option key={s.id} value={s.id} style={{ color: '#111', background: '#fff' }}>{s.full_name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date & Time *</label>
            <input type="datetime-local" value={form.scheduled_at} onChange={e => set('scheduled_at', e.target.value)} style={{ ...inputStyle, width: 'auto' }} />
          </div>
          <div>
            <label style={labelStyle}>Duration (minutes)</label>
            <input type="number" min={15} max={120} value={form.duration_minutes}
              onChange={e => set('duration_minutes', Number(e.target.value))} style={{ ...inputStyle, width: 120 }} />
          </div>
          <div>
            <label style={labelStyle}>Meeting Link (optional)</label>
            <input value={form.meeting_url} onChange={e => set('meeting_url', e.target.value)}
              placeholder="https://meet.google.com/..." style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button
            onClick={() => onSave({ ...form, student_id: Number(form.student_id) })}
            disabled={!form.title.trim() || !form.scheduled_at || !form.student_id || saving}
            style={{ ...saveBtnStyle(BLUE), opacity: (!form.title.trim() || !form.scheduled_at || !form.student_id || saving) ? 0.6 : 1 }}>
            {saving ? 'Saving…' : 'Schedule'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ScheduleTab({ token }) {
  const [meetings, setMeetings] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/meetings`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/api/users/students`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([m, s]) => { setMeetings(m); setStudents(s) }).finally(() => setLoading(false))
  }, [])

  async function saveMeeting(form) {
    setSaving(true)
    try {
      await fetch(`${API_BASE}/api/meetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const res = await fetch(`${API_BASE}/api/meetings`, { headers: { Authorization: `Bearer ${token}` } })
      setMeetings(await res.json())
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  async function deleteMeeting(id) {
    await fetch(`${API_BASE}/api/meetings/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setMeetings(m => m.filter(x => x.id !== id))
  }

  const now = new Date()
  const upcoming = meetings.filter(m => new Date(m.scheduled_at) >= now)
  const past = meetings.filter(m => new Date(m.scheduled_at) < now)

  if (loading) return <Placeholder text="Loading…" />

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button onClick={() => setShowModal(true)} style={{ background: '#008080', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          + Schedule Meeting
        </button>
      </div>

      {meetings.length === 0 && (
        <div style={emptyBox}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <p style={{ color: '#6b7280', fontSize: 14 }}>No meetings scheduled yet.</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>Upcoming</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.map(m => <MeetingCard key={m.id} meeting={m} onDelete={deleteMeeting} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#6b7280', marginBottom: 12 }}>Past</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: 0.7 }}>
            {past.map(m => <MeetingCard key={m.id} meeting={m} onDelete={deleteMeeting} />)}
          </div>
        </div>
      )}

      {showModal && (
        <MeetingModal students={students} onSave={saveMeeting} onClose={() => setShowModal(false)} saving={saving} />
      )}

      <AvailabilityPanel isTutor={true} />
    </div>
  )
}

function MeetingCard({ meeting, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '16px 20px',
      border: '1px solid rgba(0,128,128,0.18)', boxShadow: '0 2px 10px rgba(0,128,128,0.07)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
    }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', marginBottom: 3 }}>{meeting.title}</div>
        <div style={{ fontSize: 13, color: '#64748b' }}>
          📅 {formatDT(meeting.scheduled_at)} · {meeting.duration_minutes} min · with {meeting.student_name}
        </div>
        {meeting.meeting_url && (
          <a href={meeting.meeting_url} target="_blank" rel="noreferrer"
            style={{ fontSize: 12, color: '#2563eb', fontWeight: 700 }}>Join Meeting →</a>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {confirming
          ? <>
              <button onClick={() => onDelete(meeting.id)} style={smallBtn('#dc2626')}>Delete</button>
              <button onClick={() => setConfirming(false)} style={smallBtn('#6b7280')}>Cancel</button>
            </>
          : <button onClick={() => setConfirming(true)} style={smallBtn('#dc2626')}>🗑</button>
        }
      </div>
    </div>
  )
}

// ── My Lessons tab (existing tutor lesson content) ────────────────────────────

const STATUS_STYLES = {
  draft:  { bg: '#f3f4f6', color: '#6b7280', label: 'Draft' },
  active: { bg: 'rgba(0,128,128,0.1)', color: '#008080', label: '● Active' },
}

function LessonModal({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState(initial ?? { title: '', description: '', vocab_words: '', content: '', status: 'draft' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={modalBox}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>
          {initial ? 'Edit Lesson' : 'New Lesson'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={labelStyle}>Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder='e.g. "Colors"' style={inputStyle} /></div>
          <div><label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} /></div>
          <div><label style={labelStyle}>Vocabulary Words (comma-separated)</label>
            <input value={form.vocab_words} onChange={e => set('vocab_words', e.target.value)} placeholder="red, blue, green" style={inputStyle} /></div>
          <div><label style={labelStyle}>Lesson Content</label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={5} style={{ ...inputStyle, resize: 'vertical' }} /></div>
          <div>
            <label style={labelStyle}>Status</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['draft', 'active'].map(s => (
                <button key={s} type="button" onClick={() => set('status', s)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 10,
                  border: `2px solid ${form.status === s ? BLUE : 'rgba(0,128,128,0.18)'}`,
                  background: form.status === s ? LIGHT_BLUE : '#fff',
                  color: form.status === s ? BLUE : '#6b7280',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize',
                }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.title.trim() || saving}
            style={{ ...saveBtnStyle(BLUE), opacity: !form.title.trim() || saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : initial ? 'Save Changes' : 'Create Lesson'}
          </button>
        </div>
      </div>
    </div>
  )
}

function MyLessonsTab({ token }) {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/api/lessons`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setLessons).finally(() => setLoading(false))
  }, [])

  async function saveLesson(form) {
    setSaving(true)
    try {
      const url = editing ? `${API_BASE}/api/lessons/${editing.id}` : `${API_BASE}/api/lessons`
      const method = editing ? 'PATCH' : 'POST'
      await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
      const res = await fetch(`${API_BASE}/api/lessons`, { headers: { Authorization: `Bearer ${token}` } })
      setLessons(await res.json())
      setShowModal(false); setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(l) {
    const newStatus = l.status === 'active' ? 'draft' : 'active'
    await fetch(`${API_BASE}/api/lessons/${l.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...l, status: newStatus }) })
    const res = await fetch(`${API_BASE}/api/lessons`, { headers: { Authorization: `Bearer ${token}` } })
    setLessons(await res.json())
  }

  async function deleteLesson(id) {
    await fetch(`${API_BASE}/api/lessons/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setLessons(ls => ls.filter(l => l.id !== id))
  }

  if (loading) return <Placeholder text="Loading lessons…" />

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button onClick={() => { setEditing(null); setShowModal(true) }}
          style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          + New Lesson
        </button>
      </div>

      {lessons.length === 0 ? (
        <div style={emptyBox}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
          <p style={{ color: '#6b7280', fontSize: 14 }}>No lessons yet. Create your first lesson for students to read.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {lessons.map(l => {
            const ss = STATUS_STYLES[l.status] || STATUS_STYLES.draft
            return (
              <div key={l.id} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: `2px solid ${l.status === 'active' ? 'rgba(0,128,128,0.5)' : 'rgba(0,128,128,0.18)'}`, boxShadow: '0 2px 10px rgba(0,128,128,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>{l.title}</span>
                      <span style={{ background: ss.bg, color: ss.color, borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{ss.label}</span>
                    </div>
                    {l.description && <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{l.description}</p>}
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>👩‍🎓 {l.completion_count} completed</span>
                    <VocabPills words={l.vocab_words} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                    <button onClick={() => navigate(`/dashboard/tutor/lesson/${l.id}`)} style={smallBtn(BLUE)}>👁 Details</button>
                    <button onClick={() => { setEditing(l); setShowModal(true) }} style={smallBtn('#6b7280')}>✏️ Edit</button>
                    <button onClick={() => toggleActive(l)} style={smallBtn(l.status === 'active' ? '#6b7280' : '#008080')}>
                      {l.status === 'active' ? '⏸ Deactivate' : '▶ Activate'}
                    </button>
                    <button onClick={() => deleteLesson(l.id)} style={smallBtn('#dc2626')}>🗑 Delete</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <LessonModal initial={editing} onSave={saveLesson} onClose={() => { setShowModal(false); setEditing(null) }} saving={saving} />
      )}
    </div>
  )
}

// ── Assign-lesson modal (just picks a due date) ───────────────────────────────

function DueDateModal({ lesson, studentName, onSave, onClose, saving }) {
  const [dueDate, setDueDate] = useState('')
  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '28px', width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1e293b', marginBottom: 16 }}>Assign Lesson</h2>
        <div style={{ background: 'rgba(0,128,128,0.06)', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{lesson.title}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>For {studentName}</div>
          {lesson.description && (
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>{lesson.description}</div>
          )}
        </div>
        <label style={labelStyle}>Due Date <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
          style={{ ...inputStyle, width: 'auto', display: 'block' }} />
        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button onClick={() => onSave(dueDate || null)} disabled={saving}
            style={{ ...saveBtnStyle(BLUE), opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Assigning…' : 'Assign →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── My Students tab ───────────────────────────────────────────────────────────

function StudentAvatar({ student, size = 52 }) {
  const [err, setErr] = useState(false)
  if (student.has_photo && !err) {
    return (
      <img src={`${API_BASE}/api/users/${student.id}/photo`} alt=""
        onError={() => setErr(true)}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(0,128,128,0.4)', flexShrink: 0 }} />
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'rgba(0,128,128,0.1)', border: '3px solid rgba(0,128,128,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 900, color: '#008080',
    }}>{student.full_name?.[0]?.toUpperCase()}</div>
  )
}

function MyStudentsTab({ token }) {
  const [students, setStudents] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [assigningLesson, setAssigningLesson] = useState(null)
  const [saving, setSaving] = useState(false)
  const [studentCurriculum, setStudentCurriculum] = useState([])
  const [curriculumLoading, setCurriculumLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/users/students`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/api/assignments`,    { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([s, a]) => { setStudents(s); setAssignments(a) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selected) { setStudentCurriculum([]); return }
    setCurriculumLoading(true)
    fetch(`${API_BASE}/api/students/${selected.id}/curriculum`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : []).then(setStudentCurriculum).finally(() => setCurriculumLoading(false))
  }, [selected])

  async function assignLesson(dueDate) {
    setSaving(true)
    try {
      await fetch(`${API_BASE}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: assigningLesson.title,
          description: assigningLesson.description || '',
          type: 'homework',
          due_date: dueDate || null,
          student_id: selected.id,
          curriculum_id: assigningLesson.lesson_id,
        }),
      })
      const res = await fetch(`${API_BASE}/api/assignments`, { headers: { Authorization: `Bearer ${token}` } })
      setAssignments(await res.json())
      setAssigningLesson(null)
    } finally { setSaving(false) }
  }

  async function deleteAssignment(id) {
    await fetch(`${API_BASE}/api/assignments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setAssignments(a => a.filter(x => x.id !== id))
  }

  async function quickAssign(item, type, label) {
    setSaving(true)
    try {
      await fetch(`${API_BASE}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: `${label}: ${item.title}`,
          description: item.description || '',
          type,
          due_date: null,
          student_id: selected.id,
          curriculum_id: null,
        }),
      })
      const res = await fetch(`${API_BASE}/api/assignments`, { headers: { Authorization: `Bearer ${token}` } })
      setAssignments(await res.json())
    } finally { setSaving(false) }
  }

  if (loading) return <Placeholder text="Loading students…" />

  // ── Student list ──────────────────────────────────────────────────────────

  if (!selected) {
    if (students.length === 0) return (
      <div style={emptyBox}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
        <p style={{ color: '#6b7280', fontSize: 14 }}>No students assigned yet. Ask your administrator to pair you with a student.</p>
      </div>
    )
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {students.map(s => (
          <button key={s.id} onClick={() => setSelected(s)} style={{
            background: '#fff', borderRadius: 16, padding: '18px 22px',
            border: '1px solid rgba(0,128,128,0.25)', boxShadow: '0 2px 8px rgba(0,128,128,0.08)',
            display: 'flex', alignItems: 'center', gap: 16,
            cursor: 'pointer', textAlign: 'left', width: '100%',
            transition: 'box-shadow 0.15s, border-color 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,128,128,0.55)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,128,128,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,128,128,0.25)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,128,128,0.08)' }}
          >
            <StudentAvatar student={s} size={54} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>{s.full_name}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                {[s.grade && `Grade ${s.grade}`, s.school, [s.city, s.country].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}
              </div>
              {s.english_level && (
                <span style={{ ...badge('rgba(0,128,128,0.1)', '#008080'), display: 'inline-block', marginTop: 6, fontSize: 11 }}>
                  {s.english_level.charAt(0).toUpperCase() + s.english_level.slice(1)} English
                </span>
              )}
            </div>
            <span style={{ color: BLUE, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>View →</span>
          </button>
        ))}
      </div>
    )
  }

  // ── Student profile ───────────────────────────────────────────────────────

  const studentAssignments = assignments.filter(a => a.student_id === selected.id)
  const assignedByCurriculumId = {}
  studentAssignments.forEach(a => { if (a.curriculum_id) assignedByCurriculumId[a.curriculum_id] = a })
  const nextUnassigned = studentCurriculum.find(item => !assignedByCurriculumId[item.lesson_id])

  return (
    <div>
      <button onClick={() => setSelected(null)} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        color: BLUE, fontWeight: 700, fontSize: 14, marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>← Back to Students</button>

      {/* Profile card */}
      <div style={{
        background: '#fff', borderRadius: 18, padding: '24px 26px',
        border: '1px solid rgba(0,128,128,0.25)', boxShadow: '0 2px 12px rgba(0,128,128,0.08)', marginBottom: 26,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <StudentAvatar student={selected} size={68} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1e293b' }}>{selected.full_name}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
              {[selected.grade && `Grade ${selected.grade}`, selected.school].filter(Boolean).join(' · ')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {selected.english_level && (
                <span style={badge('rgba(0,128,128,0.1)', '#008080')}>
                  {selected.english_level.charAt(0).toUpperCase() + selected.english_level.slice(1)} English
                </span>
              )}
              {selected.preferred_focus && <span style={badge('#f3f4f6', '#374151')}>Focus: {selected.preferred_focus}</span>}
              {(selected.city || selected.country) && (
                <span style={badge('#f0fdf4', '#15803d')}>
                  📍 {[selected.city, selected.country].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
        {selected.goals && (
          <div style={{ marginTop: 18, background: 'rgba(0,128,128,0.05)', borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#008080', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Goals</div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: 0 }}>{selected.goals}</p>
          </div>
        )}
        {selected.bio && (
          <div style={{ marginTop: 12, background: 'rgba(255,111,97,0.06)', borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#FF6F61', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>About</div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: 0 }}>{selected.bio}</p>
          </div>
        )}
        {!selected.goals && !selected.bio && (
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 14, fontStyle: 'italic' }}>
            This student hasn't filled out their profile yet.
          </p>
        )}
      </div>

      {/* Curriculum & assignment status */}
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>Curriculum</h3>
      {curriculumLoading ? (
        <p style={{ color: '#9ca3af', fontSize: 13 }}>Loading…</p>
      ) : studentCurriculum.length === 0 ? (
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px 18px', border: '1.5px dashed #cbd5e1' }}>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>
            No curriculum assigned yet — the admin will assign lessons for this student.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {studentCurriculum.map((item, i) => {
            const rec = assignedByCurriculumId[item.lesson_id]
            const isDone = !!rec
            const isNext = item === nextUnassigned
            const borderColor = isDone ? '#22c55e' : isNext ? '#008080' : 'rgba(0,128,128,0.18)'
            const bg = isDone ? '#f0fdf4' : isNext ? 'rgba(0,128,128,0.04)' : '#fafafa'
            return (
              <div key={item.lesson_id} style={{
                borderRadius: 12, padding: '14px 16px', border: `2px solid ${borderColor}`,
                background: bg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: isDone ? '#22c55e' : isNext ? '#008080' : '#cbd5e1', minWidth: 24 }}>
                      {isDone ? '✅' : isNext ? '→' : `#${i + 1}`}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: isDone ? '#374151' : '#1e293b' }}>{item.title}</span>
                    {isNext && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#008080', background: 'rgba(0,128,128,0.1)', borderRadius: 20, padding: '2px 9px' }}>
                        Next up
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3, marginLeft: 32 }}>
                      {item.description.length > 100 ? item.description.slice(0, 100) + '…' : item.description}
                    </div>
                  )}
                  {isDone && (
                    <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, marginTop: 4, marginLeft: 32 }}>
                      Assigned{rec.due_date ? ` · Due ${rec.due_date}` : ' · No due date set'}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                  {isDone ? (
                    <button onClick={() => deleteAssignment(rec.id)} style={smallBtn('#dc2626')}>↩ Unassign</button>
                  ) : isNext ? (
                    <button onClick={() => setAssigningLesson(item)} style={{
                      background: '#008080', color: '#fff', border: 'none', borderRadius: 8,
                      padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>📅 Assign</button>
                  ) : null}
                  <button onClick={() => quickAssign(item, 'practice', '📇 Flashcards')} disabled={saving} style={smallBtn('#6366f1')}>📇 Flashcards</button>
                  <button onClick={() => quickAssign(item, 'quiz', '🧪 Quiz')} disabled={saving} style={smallBtn('#FF6F61')}>🧪 Quiz</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {assigningLesson && (
        <DueDateModal
          lesson={assigningLesson}
          studentName={selected.full_name}
          onSave={assignLesson}
          onClose={() => setAssigningLesson(null)}
          saving={saving}
        />
      )}
    </div>
  )
}

// ── Messages tab ──────────────────────────────────────────────────────────────

function MessagesTab({ token, user }) {
  const [students, setStudents] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/users/students`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(s => { setStudents(s); if (s.length > 0) setSelectedId(s[0].id) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedId) return
    setMessages([])
    fetchMsgs()
    const iv = setInterval(fetchMsgs, 5000)
    return () => clearInterval(iv)
  }, [selectedId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function fetchMsgs() {
    fetch(`${API_BASE}/api/chat/${selectedId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setMessages).catch(() => {})
  }

  async function send(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || !selectedId || sending) return
    setSending(true)
    setInput('')
    try {
      const res = await fetch(`${API_BASE}/api/chat/${selectedId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: text }),
      })
      if (res.ok) { const msg = await res.json(); setMessages(prev => [...prev, msg]) }
    } finally { setSending(false) }
  }

  if (loading) return <Placeholder text="Loading…" />

  if (students.length === 0) return (
    <div style={emptyBox}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
      <p style={{ color: '#6b7280', fontSize: 14 }}>No students paired yet. Ask your admin to pair you with a student.</p>
    </div>
  )

  const sel = students.find(s => s.id === selectedId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 520 }}>
      {students.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {students.map(s => (
            <button key={s.id} onClick={() => setSelectedId(s.id)} style={{
              background: selectedId === s.id ? BLUE : '#fff',
              color: selectedId === s.id ? '#fff' : '#6b7280',
              border: `2px solid ${selectedId === s.id ? BLUE : 'rgba(0,128,128,0.18)'}`,
              borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>{s.full_name}</button>
          ))}
        </div>
      )}

      {sel && (
        <div style={{ background: LIGHT_BLUE, borderRadius: '14px 14px 0 0', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', border: `2px solid ${BLUE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: BLUE }}>
            {sel.full_name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{sel.full_name}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{sel.school || 'Peru'}</div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,128,128,0.04)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, border: '1px solid rgba(0,128,128,0.18)', borderTop: 'none' }}>
        {messages.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 60 }}>No messages yet. Say hello! 👋</p>
        )}
        {messages.map(m => {
          const isMe = m.sender_id === user.id
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '72%', background: isMe ? BLUE : '#fff',
                color: isMe ? '#fff' : '#1e293b',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '10px 14px', fontSize: 14, lineHeight: 1.5,
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                border: isMe ? 'none' : '1px solid rgba(0,128,128,0.18)',
              }}>
                <div>{m.content}</div>
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>
                  {new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} style={{ display: 'flex', gap: 8, padding: '10px 14px', background: '#fff', borderRadius: '0 0 14px 14px', border: '1px solid rgba(0,128,128,0.18)', borderTop: '1px solid rgba(0,128,128,0.1)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Message ${sel?.full_name || ''}…`}
          style={{ flex: 1, border: '1px solid rgba(0,128,128,0.18)', borderRadius: 10, padding: '9px 13px', fontSize: 14, outline: 'none', fontFamily: "'Times New Roman', Times, serif" }}
        />
        <button type="submit" disabled={!input.trim() || sending} style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: !input.trim() || sending ? 0.6 : 1 }}>
          {sending ? '…' : 'Send →'}
        </button>
      </form>
    </div>
  )
}

// ── Overview tab ──────────────────────────────────────────────────────────────

function OverviewTab({ token }) {
  const [stats, setStats] = useState({ lessons: 0, assignments: 0, meetings: 0, completions: 0 })

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/lessons`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/api/assignments`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/api/meetings`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([lessons, assignments, meetings]) => {
      setStats({
        lessons: lessons.length,
        assignments: assignments.length,
        meetings: meetings.length,
        completions: lessons.reduce((s, l) => s + l.completion_count, 0),
      })
    })
  }, [])

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard icon="📖" label="My Lessons" value={stats.lessons} color={BLUE} />
        <StatCard icon="📋" label="Assignments Given" value={stats.assignments} color="#d97706" />
        <StatCard icon="📅" label="Meetings Scheduled" value={stats.meetings} color="#15803d" />
        <StatCard icon="✅" label="Lesson Completions" value={stats.completions} color={PURPLE} />
      </div>
      <div style={{ background: `linear-gradient(135deg, ${BLUE}, #1d4ed8)`, borderRadius: 16, padding: '24px 28px', color: '#fff' }}>
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>🌎 Your Teaching Flow</div>
        <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.9 }}>
          1. Browse the <strong>Curriculum Library</strong> — lessons your admin prepared with videos and PDFs.<br />
          2. Schedule a virtual <strong>Meeting</strong> with your student in Peru.<br />
          3. After the meeting, <strong>Assign Work</strong> — homework, practice, or a quiz.<br />
          4. Create your own <strong>Lessons</strong> directly for students to read.
        </p>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 12px rgba(0,128,128,0.08)', border: '1px solid rgba(0,128,128,0.18)' }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 24, fontWeight: 900, color }}>{value}</div>
        <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function TutorDashboard() {
  const { user, token } = useAuth()
  const { t } = useLanguage()
  const [tab, setTab] = useState('students')

  return (
    <div style={{ minHeight: '100vh', background: '#F1F8F9', position: 'relative', zIndex: 1 }}>
      <Navbar />
      <div style={{ maxWidth: 940, margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b' }}>
            {t('tutor.welcome')}, {user?.full_name.split(' ')[0]}! 🎓
          </h2>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>
            {user?.school} · PeerLingo Tutor
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 24, borderBottom: '1px solid rgba(0,128,128,0.18)', flexWrap: 'wrap' }}>
          <Tab id="students"   label={`👥 ${t('tutor.tab.students')}`}    active={tab === 'students'}   onClick={setTab} />
          <Tab id="schedule"   label={`📅 ${t('tutor.tab.meetings')}`}    active={tab === 'schedule'}   onClick={setTab} />
          <Tab id="messages"   label={`💬 ${t('tutor.tab.messages')}`}    active={tab === 'messages'}   onClick={setTab} />
          <Tab id="lessons"    label={`📖 ${t('tutor.tab.lessons')}`}     active={tab === 'lessons'}    onClick={setTab} />
          <Tab id="overview"   label="🏠 Overview"                        active={tab === 'overview'}   onClick={setTab} />
        </div>

        {tab === 'students'   && <MyStudentsTab token={token} />}
        {tab === 'schedule'   && <ScheduleTab token={token} />}
        {tab === 'messages'   && <MessagesTab token={token} user={user} />}
        {tab === 'lessons'    && <MyLessonsTab token={token} />}
        {tab === 'overview'   && <OverviewTab token={token} />}
      </div>
    </div>
  )
}

// ── Shared styles ─────────────────────────────────────────────────────────────

function Placeholder({ text }) {
  return <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>{text}</p>
}

const emptyBox = {
  textAlign: 'center', padding: '50px 20px', background: '#fff',
  borderRadius: 16, border: '2px dashed #d1d5db',
}
const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: 20,
}
const modalBox = {
  background: '#fff', borderRadius: 20, padding: '32px 28px',
  width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
  boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
}
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }
const inputStyle = { width: '100%', border: '1px solid rgba(0,128,128,0.18)', borderRadius: 10, padding: '9px 13px', fontSize: 14, outline: 'none', fontFamily: "'Times New Roman', Times, serif" }
const cancelBtnStyle = { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }
const saveBtnStyle = color => ({ background: color, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' })
const smallBtn = color => ({ background: 'none', border: `1.5px solid ${color}`, color, borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' })
const badge = (bg, color) => ({ background: bg, color, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 })
