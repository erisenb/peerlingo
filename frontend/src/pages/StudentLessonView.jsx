import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../api'

const BLUE = '#2563eb'
const AMBER = '#d97706'

export default function StudentLessonView() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/api/lessons/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setLesson)
      .finally(() => setLoading(false))
  }, [id])

  async function handleComplete() {
    setCompleting(true)
    try {
      const res = await fetch(`${API_BASE}/api/lessons/${id}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setLesson(l => ({ ...l, completed_by_me: true }))
      }
    } finally {
      setCompleting(false)
    }
  }

  async function handleUncomplete() {
    setCompleting(true)
    try {
      const res = await fetch(`${API_BASE}/api/lessons/${id}/complete`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok || res.status === 204) {
        setLesson(l => ({ ...l, completed_by_me: false }))
      }
    } finally {
      setCompleting(false)
    }
  }

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Loading…</div>
  if (!lesson) return <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Lesson not found.</div>

  const vocabList = lesson.vocab_words ? lesson.vocab_words.split(',').map(w => w.trim()).filter(Boolean) : []

  return (
    <div style={{ minHeight: '100vh', background: '#fffbeb' }}>
      <Navbar />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 20px' }}>
        <button
          onClick={() => navigate('/dashboard/student')}
          style={{ background: 'none', border: 'none', color: AMBER, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 20 }}
        >← Back to Lessons</button>

        <div style={{
          background: `linear-gradient(135deg, ${BLUE}, #1d4ed8)`,
          borderRadius: 20, padding: '24px 28px',
          color: '#fff', marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
            Lesson by {lesson.tutor_name}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>{lesson.title}</h1>
          {lesson.description && (
            <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.7 }}>{lesson.description}</p>
          )}
        </div>

        {vocabList.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 900, color: '#1e293b', marginBottom: 12 }}>
              📝 Vocabulary Words
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {vocabList.map(w => (
                <div key={w} style={{
                  background: '#dbeafe', color: BLUE,
                  borderRadius: 12, padding: '8px 18px',
                  fontSize: 16, fontWeight: 800,
                  textTransform: 'capitalize',
                }}>{w}</div>
              ))}
            </div>
          </div>
        )}

        {lesson.content && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 900, color: '#1e293b', marginBottom: 12 }}>
              📖 Lesson
            </h2>
            <div style={{
              fontSize: 15, color: '#334155', lineHeight: 1.9,
              whiteSpace: 'pre-wrap',
            }}>
              {lesson.content}
            </div>
          </div>
        )}

        <div style={{
          background: '#fff', borderRadius: 16, padding: '20px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}>
          {lesson.completed_by_me ? (
            <>
              <div style={{ fontSize: 48, marginBottom: 10 }}>🏅</div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#15803d', marginBottom: 6 }}>
                You finished this lesson!
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>
                Great work! You are learning English!
              </p>
              <button
                onClick={handleUncomplete}
                disabled={completing}
                style={{
                  background: 'none', border: '2px solid #e2e8f0', color: '#64748b',
                  borderRadius: 10, padding: '10px 22px',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >{completing ? 'Updating…' : 'Mark as not done'}</button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✨</div>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>
                Finished reading? Mark this lesson as complete!
              </p>
              <button
                onClick={handleComplete}
                disabled={completing}
                style={{
                  background: AMBER, color: '#fff', border: 'none',
                  borderRadius: 12, padding: '14px 32px',
                  fontSize: 16, fontWeight: 800, cursor: 'pointer',
                  opacity: completing ? 0.7 : 1,
                }}
              >{completing ? 'Saving…' : '✅ I finished this lesson!'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
