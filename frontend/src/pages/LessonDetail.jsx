import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../api'

const BLUE = '#2563eb'

export default function LessonDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/lessons/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/api/lessons/${id}/progress`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([l, p]) => {
      setLesson(l)
      setProgress(p)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Loading…</div>
  if (!lesson) return <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Lesson not found.</div>

  const vocabList = lesson.vocab_words ? lesson.vocab_words.split(',').map(w => w.trim()).filter(Boolean) : []

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px' }}>
        <button
          onClick={() => navigate('/dashboard/tutor')}
          style={{ background: 'none', border: 'none', color: BLUE, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 20 }}
        >← Back to Dashboard</button>

        <div style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1e293b', flex: 1 }}>{lesson.title}</h1>
            <span style={{
              background: lesson.status === 'active' ? '#dcfce7' : '#f3f4f6',
              color: lesson.status === 'active' ? '#15803d' : '#6b7280',
              borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700,
            }}>
              {lesson.status === 'active' ? '● Active' : 'Draft'}
            </span>
          </div>

          {lesson.description && (
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, marginBottom: 20 }}>
              {lesson.description}
            </p>
          )}

          {vocabList.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 10 }}>Vocabulary Words</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {vocabList.map(w => (
                  <span key={w} style={{
                    background: '#dbeafe', color: BLUE,
                    borderRadius: 20, padding: '4px 14px', fontSize: 14, fontWeight: 700,
                  }}>{w}</span>
                ))}
              </div>
            </div>
          )}

          {lesson.content && (
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 10 }}>Lesson Content</h3>
              <div style={{
                background: '#f8fafc', borderRadius: 12, padding: '16px 20px',
                fontSize: 14, color: '#334155', lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
              }}>
                {lesson.content}
              </div>
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1e293b', marginBottom: 16 }}>
            Student Progress — {progress.length} completed
          </h2>

          {progress.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '32px 20px',
              border: '2px dashed #e2e8f0', borderRadius: 14,
              color: '#94a3b8', fontSize: 14,
            }}>
              No students have completed this lesson yet.
              {lesson.status === 'draft' && <><br /><strong>Activate the lesson</strong> so students can see it.</>}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {progress.map(p => (
                <div key={p.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', background: '#f0fdf4', borderRadius: 12,
                  border: '1px solid #bbf7d0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>✅</span>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{p.student_name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>
                    {new Date(p.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
