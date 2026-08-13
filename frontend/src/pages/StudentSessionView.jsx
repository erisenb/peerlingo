import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PublicNav from '../components/PublicNav'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../api'

const BLUE = '#008080'
const AMBER = '#FF6F61'

export default function StudentSessionView() {
  const { sessionId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastStep, setLastStep] = useState(null)
  const pollRef = useRef(null)

  function fetchSession() {
    return fetch(`${API_BASE}/api/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setSession(data)
        setLastStep(prev => {
          if (prev !== null && data.current_step !== prev) {
            // Step changed — flash the slide
          }
          return data.current_step
        })
      })
      .catch(() => {})
  }

  useEffect(() => {
    if (!token || !sessionId) return
    fetchSession().finally(() => setLoading(false))
    // Poll every 5 seconds so student sees tutor's step changes live
    pollRef.current = setInterval(fetchSession, 5000)
    return () => clearInterval(pollRef.current)
  }, [sessionId, token])

  const lessonData = session?.lesson?.data || {}
  const slides = lessonData.student_slides || []
  const sections = lessonData.sections || []
  const currentStep = session?.current_step ?? 0

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
      Joining session…
    </div>
  )

  if (!session) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 48 }}>😕</div>
      <div style={{ fontSize: 16, color: '#64748b' }}>Session not found.</div>
      <button onClick={() => navigate('/dashboard/student')} style={{
        background: BLUE, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700,
      }}>Back to Dashboard</button>
    </div>
  )

  const lesson = session.lesson
  const isComplete = session.completed

  // Vocabulary from all sections (student-safe — tutor fields already stripped server-side)
  const vocabWords = sections.flatMap(s => s.words || [])
  const currentSection = sections[Math.min(currentStep, sections.length - 1)] || null

  return (
    <div style={{ minHeight: '100vh', background: '#F1F8F9', fontFamily: "'Times New Roman', Times, serif" }}>
      <PublicNav />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            {isComplete ? 'Lesson Complete' : 'Live Session'}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f2b3d', margin: '0 0 6px' }}>
            Lesson {lesson.lesson_number} — {lesson.title}
          </h1>
          {!isComplete && (
            <div style={{ fontSize: 13, color: '#64748b' }}>
              Your tutor is leading this lesson. Follow along here!
            </div>
          )}
        </div>

        {isComplete ? (
          <div style={{ background: '#dcfce7', border: '2px solid #22c55e', borderRadius: 18, padding: '28px', textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#166534', marginBottom: 8 }}>¡Excelente trabajo!</div>
            <div style={{ fontSize: 15, color: '#166534', marginBottom: 20 }}>You completed this lesson. Keep up the great work!</div>
            <button onClick={() => navigate('/dashboard/student')} style={{
              background: '#22c55e', color: '#fff', border: 'none', borderRadius: 12,
              padding: '12px 24px', fontSize: 15, fontWeight: 800, cursor: 'pointer',
            }}>
              Back to Dashboard →
            </button>
          </div>
        ) : null}

        {/* Current slide (driven by tutor's step) */}
        {slides.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', marginBottom: 14 }}>
              Current Slide
            </div>
            <CurrentSlide slide={slides[Math.min(currentStep, slides.length - 1)]} />
          </div>
        )}

        {/* All slides — student can reference all of them */}
        {slides.length > 1 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              All Slides
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {slides.map((slide, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 14, padding: '14px 18px',
                  border: `2px solid ${i === Math.min(currentStep, slides.length - 1) ? BLUE : 'rgba(0,128,128,0.15)'}`,
                  opacity: i > currentStep ? 0.5 : 1,
                  transition: 'border-color 0.3s, opacity 0.3s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>{slide.emoji}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{slide.title}</span>
                    {i === Math.min(currentStep, slides.length - 1) && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, background: 'rgba(0,128,128,0.1)', borderRadius: 20, padding: '2px 8px' }}>
                        Now
                      </span>
                    )}
                  </div>
                  {slide.content?.map((line, j) => (
                    <div key={j} style={{ fontSize: 13, color: '#334155', padding: '3px 8px', marginBottom: 2 }}>{line}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current activity (driven by tutor's step) */}
        {currentSection && (currentSection.passage || currentSection.instructions || currentSection.explanation) && (
          <div style={{ marginBottom: 28, background: '#fff', border: `2px solid ${BLUE}`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              {currentSection.label || 'Activity'}
            </div>
            {currentSection.activity_name && (
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>{currentSection.activity_name}</div>
            )}
            {currentSection.concept && (
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>{currentSection.concept}</div>
            )}
            {currentSection.explanation && (
              <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, marginBottom: 10 }}>{currentSection.explanation}</div>
            )}
            {currentSection.instructions && (
              <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, marginBottom: 10 }}>{currentSection.instructions}</div>
            )}
            {currentSection.examples?.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                {currentSection.examples.map((ex, i) => (
                  <div key={i} style={{ background: 'rgba(0,128,128,0.06)', borderRadius: 8, padding: '7px 12px', marginBottom: 5, fontSize: 13, color: '#0f2b3d' }}>{ex}</div>
                ))}
              </div>
            )}
            {currentSection.passage && (
              <div style={{ background: 'rgba(0,128,128,0.05)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#1e293b', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 10 }}>
                {currentSection.passage}
              </div>
            )}
            {currentSection.comprehension_questions?.map((q, i) => (
              <div key={i} style={{ fontSize: 14, color: '#1e293b', padding: '6px 0' }}>• {q.question}</div>
            ))}
          </div>
        )}

        {/* Vocabulary list */}
        {vocabWords.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Vocabulary
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {vocabWords.map((w, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid rgba(0,128,128,0.18)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#1e293b' }}>{w.word}</span>
                    {w.pronunciation && <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>{w.pronunciation}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#334155', marginBottom: 4 }}>{w.definition}</div>
                  {w.example_sentence && (
                    <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>"{w.example_sentence}"</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning objectives */}
        {lessonData.learning_objectives?.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(0,128,128,0.18)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: BLUE, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Today's Goals
            </div>
            {lessonData.learning_objectives.map((obj, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{obj}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CurrentSlide({ slide }) {
  if (!slide) return null
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(0,128,128,0.06) 0%, rgba(255,111,97,0.04) 100%)',
      border: `3px solid ${BLUE}`,
      borderRadius: 20, padding: '28px 24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 42, marginBottom: 12 }}>{slide.emoji}</div>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#0f2b3d', marginBottom: 16 }}>{slide.title}</div>
      {slide.content?.map((line, i) => (
        <div key={i} style={{
          fontSize: 15, color: '#1e293b', padding: '8px 16px', marginBottom: 6,
          background: '#fff', borderRadius: 10,
          border: '1px solid rgba(0,128,128,0.12)',
        }}>
          {line}
        </div>
      ))}
    </div>
  )
}
