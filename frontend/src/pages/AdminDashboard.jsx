import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { API_BASE } from '../api'

const PURPLE = '#7c3aed'
const LIGHT_PURPLE = '#ede9fe'

function isYouTube(url) {
  return url && (url.includes('youtube.com/watch') || url.includes('youtu.be/'))
}

function youtubeEmbedUrl(url) {
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : url
}

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

function CurriculumModal({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState(
    initial ?? { title: '', description: '', video_url: '', content: '' }
  )
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, padding: '32px 28px',
        width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', marginBottom: 4 }}>
          {initial ? 'Edit Curriculum Item' : 'New Curriculum Item'}
        </h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>
          Tutors will see this in their Curriculum Library to help them teach students.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Title *">
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder='e.g. "Greetings & Introductions"' style={inputStyle} required />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Brief overview of what this lesson covers…" rows={2}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>
          <Field label="Video URL" hint="Paste a YouTube link or any video URL">
            <input value={form.video_url} onChange={e => set('video_url', e.target.value)}
              placeholder="https://youtube.com/watch?v=..." style={inputStyle} />
          </Field>
          <Field label="Lesson Content / Notes">
            <textarea value={form.content} onChange={e => set('content', e.target.value)}
              placeholder="Write lesson notes, scripts, activity instructions, discussion questions…"
              rows={7} style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>
        </div>

        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 16 }}>
          After saving, you can attach a PDF worksheet from the lesson card.
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button onClick={() => onSave(form)}
            disabled={!form.title.trim() || saving}
            style={{ ...saveBtnStyle, opacity: !form.title.trim() || saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : initial ? 'Save Changes' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CurriculumCard({ item, onEdit, onDelete, token }) {
  const [confirming, setConfirming] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  async function handlePdfUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    await fetch(`${API_BASE}/api/curriculum/${item.id}/pdf`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
    setUploading(false)
    window.location.reload()
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '22px 24px',
      border: '2px solid #e5e7eb',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>{item.title}</h3>

          {item.description && (
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, marginBottom: 8 }}>
              {item.description}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {item.video_url && (
              <span style={badgeStyle('#dbeafe', '#2563eb')}>🎬 Video</span>
            )}
            {item.has_pdf && (
              <a href={`${API_BASE}/api/curriculum/${item.id}/pdf`}
                target="_blank" rel="noreferrer"
                style={{ ...badgeStyle('#dcfce7', '#15803d'), textDecoration: 'none' }}>
                📄 Download PDF
              </a>
            )}
          </div>

          {item.content && (
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              {item.content.length > 160 ? item.content.slice(0, 160) + '…' : item.content}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          <button onClick={() => onEdit(item)} style={smallBtn(PURPLE)}>✏️ Edit</button>
          <button
            onClick={() => fileRef.current.click()}
            disabled={uploading}
            style={smallBtn('#15803d')}
          >{uploading ? 'Uploading…' : item.has_pdf ? '📄 Replace PDF' : '📎 Attach PDF'}</button>
          <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handlePdfUpload} />
          {confirming
            ? <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => onDelete(item.id)} style={smallBtn('#dc2626')}>Delete</button>
                <button onClick={() => setConfirming(false)} style={smallBtn('#6b7280')}>Cancel</button>
              </div>
            : <button onClick={() => setConfirming(true)} style={smallBtn('#dc2626')}>🗑 Delete</button>
          }
        </div>
      </div>

      {item.video_url && isYouTube(item.video_url) && (
        <div style={{ marginTop: 16, borderRadius: 12, overflow: 'hidden' }}>
          <iframe
            src={youtubeEmbedUrl(item.video_url)}
            width="100%" height="240"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ display: 'block' }}
          />
        </div>
      )}
      {item.video_url && !isYouTube(item.video_url) && (
        <a href={item.video_url} target="_blank" rel="noreferrer"
          style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#2563eb', fontWeight: 700 }}>
          🎬 Watch Video →
        </a>
      )}
    </div>
  )
}

function CurriculumTab({ token }) {
  const [curriculum, setCurriculum] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchCurriculum() }, [])

  async function fetchCurriculum() {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/curriculum`, { headers: { Authorization: `Bearer ${token}` } })
      setCurriculum(await res.json())
    } finally {
      setLoading(false)
    }
  }

  async function saveCurriculum(form) {
    setSaving(true)
    try {
      const url = editing ? `${API_BASE}/api/curriculum/${editing.id}` : `${API_BASE}/api/curriculum`
      const method = editing ? 'PATCH' : 'POST'
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      await fetchCurriculum()
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  async function deleteCurriculum(id) {
    await fetch(`${API_BASE}/api/curriculum/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    setCurriculum(c => c.filter(x => x.id !== id))
  }

  function openNew() { setEditing(null); setShowModal(true) }
  function openEdit(item) { setEditing(item); setShowModal(true) }
  function closeModal() { setShowModal(false); setEditing(null) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ background: LIGHT_PURPLE, color: PURPLE, borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
          {curriculum.length} lesson{curriculum.length !== 1 ? 's' : ''}
        </span>
        <button onClick={openNew} style={createBtnStyle}>+ New Curriculum Item</button>
      </div>

      {loading ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Loading…</p>
      ) : curriculum.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: '#fff', borderRadius: 16, border: '2px dashed #ddd6fe',
        }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📚</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#374151', marginBottom: 8 }}>No curriculum yet</h3>
          <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 20 }}>
            Create your first lesson — tutors will see it in their library.
          </p>
          <button onClick={openNew} style={createBtnStyle}>+ Create First Lesson</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {curriculum.map(item => (
            <CurriculumCard key={item.id} item={item} onEdit={openEdit} onDelete={deleteCurriculum} token={token} />
          ))}
        </div>
      )}

      <div style={{
        marginTop: 32, background: `linear-gradient(135deg, ${PURPLE}, #6d28d9)`,
        borderRadius: 16, padding: '22px 28px', color: '#fff',
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>🌎 How Curriculum Works</div>
        <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.8 }}>
          1. Create a lesson with notes, a video link, and a PDF worksheet.<br />
          2. Tutors in New Jersey see the lesson in their Curriculum Library.<br />
          3. They use it to teach their student in Peru during virtual meetings.<br />
          4. After the meeting, they assign homework or quizzes from the lesson.
        </p>
      </div>

      {showModal && (
        <CurriculumModal initial={editing} onSave={saveCurriculum} onClose={closeModal} saving={saving} />
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

// ── Users tab ─────────────────────────────────────────────────────────────────

function UsersTab({ token }) {
  const [tutors, setTutors] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null)

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

  function UserCard({ user: u, roleColor, roleBg }) {
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
        <div>
          {confirmDelete === u.id
            ? <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => deleteUser(u.id)} style={smallBtn('#dc2626')}>Delete</button>
                <button onClick={() => setConfirmDelete(null)} style={smallBtn('#6b7280')}>Cancel</button>
              </div>
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
            {tutors.map(u => <UserCard key={u.id} user={u} roleColor="#2563eb" roleBg="#dbeafe" />)}
          </div>
        </div>
      )}

      {students.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#d97706', marginBottom: 12 }}>⭐ Students</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {students.map(u => <UserCard key={u.id} user={u} roleColor="#d97706" roleBg="#fef3c7" />)}
          </div>
        </div>
      )}

      {tutors.length === 0 && students.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 16, border: '2px dashed #ddd6fe' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <p style={{ color: '#6b7280', fontSize: 14 }}>No users yet. Accounts appear here once people register.</p>
        </div>
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
