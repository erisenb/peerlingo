import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../api'

const BLUE = '#008080'

// ── Shared bits ────────────────────────────────────────────────────────────────

function Callout({ icon, label, color, bg, children }) {
  if (!children) return null
  return (
    <div style={{ background: bg, borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{children}</div>
    </div>
  )
}

function TutorSteps({ steps }) {
  if (!steps?.length) return null
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: BLUE, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
        What To Do
      </div>
      <ol style={{ margin: 0, paddingLeft: 20 }}>
        {steps.map((s, i) => (
          <li key={i} style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.9 }}>{s}</li>
        ))}
      </ol>
    </div>
  )
}

// ── Kind-specific main content ───────────────────────────────────────────────

function PromptCard({ prompt }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(0,128,128,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 10 }}>
      {prompt.say && (
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, textTransform: 'uppercase' }}>Say: </span>
          <span style={{ fontSize: 14, color: '#0f2b3d', fontStyle: 'italic' }}>"{prompt.say}"</span>
        </div>
      )}
      {prompt.expect && (
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>Expect: </span>
          <span style={{ fontSize: 13, color: '#166534' }}>{prompt.expect}</span>
        </div>
      )}
      {prompt.tip && (
        <div style={{ fontSize: 12, color: '#78350f', background: '#fef9c3', borderRadius: 6, padding: '5px 9px', marginTop: 4 }}>
          💡 {prompt.tip}
        </div>
      )}
    </div>
  )
}

function VocabCard({ word }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(0,128,128,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: '#1e293b' }}>{word.word}</span>
        {word.pronunciation && <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>{word.pronunciation}</span>}
      </div>
      <div style={{ fontSize: 13, color: '#334155', marginBottom: 6 }}>{word.definition}</div>
      {word.example_sentence && (
        <div style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic', marginBottom: 8 }}>"{word.example_sentence}"</div>
      )}
      {word.tutor_script && (
        <div style={{ background: '#f0fdf4', borderLeft: '3px solid #22c55e', borderRadius: '0 8px 8px 0', padding: '8px 12px', fontSize: 13, color: '#166534', lineHeight: 1.6 }}>
          {word.tutor_script}
        </div>
      )}
    </div>
  )
}

function SectionMainContent({ section }) {
  switch (section.kind) {
    case 'discussion':
      return (
        <div>
          {section.prompts?.map((p, i) => <PromptCard key={i} prompt={p} />)}
        </div>
      )
    case 'vocabulary':
      return (
        <div>
          {section.words?.map((w, i) => <VocabCard key={i} word={w} />)}
        </div>
      )
    case 'concept':
      return (
        <div>
          {section.concept && (
            <div style={{ fontWeight: 800, fontSize: 15, color: '#1e293b', marginBottom: 8 }}>{section.concept}</div>
          )}
          {section.explanation && (
            <div style={{ fontSize: 14, color: '#334155', marginBottom: 12, lineHeight: 1.7 }}>{section.explanation}</div>
          )}
          {section.examples?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Examples</div>
              {section.examples.map((ex, i) => (
                <div key={i} style={{ background: 'rgba(0,128,128,0.07)', borderRadius: 8, padding: '7px 12px', marginBottom: 6, fontSize: 14, color: '#0f2b3d' }}>
                  {ex}
                </div>
              ))}
            </div>
          )}
          {section.practice_prompt && (
            <div style={{ background: '#fff7ed', borderRadius: 10, padding: '10px 14px', marginBottom: 10, fontSize: 13, color: '#9a3412' }}>
              <strong>Your turn:</strong> {section.practice_prompt}
            </div>
          )}
          {section.tutor_script && (
            <div style={{ background: '#f0fdf4', borderLeft: '3px solid #22c55e', borderRadius: '0 8px 8px 0', padding: '10px 14px', fontSize: 13, color: '#166534', lineHeight: 1.7 }}>
              {section.tutor_script}
            </div>
          )}
        </div>
      )
    case 'activity':
      return (
        <div>
          {section.activity_name && (
            <div style={{ fontWeight: 800, fontSize: 15, color: '#1e293b', marginBottom: 8 }}>🎲 {section.activity_name}</div>
          )}
          {section.instructions && (
            <div style={{ fontSize: 14, color: '#334155', marginBottom: 12, lineHeight: 1.7 }}>{section.instructions}</div>
          )}
          {section.tutor_script && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase' }}>Your Script</div>
              <div style={{ background: '#f0fdf4', borderLeft: '3px solid #22c55e', borderRadius: '0 8px 8px 0', padding: '10px 14px', fontSize: 13, color: '#166534', lineHeight: 1.7 }}>
                {section.tutor_script}
              </div>
            </div>
          )}
          {section.debrief && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase' }}>Debrief</div>
              <div style={{ background: '#f0fdf4', borderLeft: '3px solid #22c55e', borderRadius: '0 8px 8px 0', padding: '10px 14px', fontSize: 13, color: '#166534', lineHeight: 1.7 }}>
                {section.debrief}
              </div>
            </div>
          )}
        </div>
      )
    case 'reading':
      return (
        <div>
          {section.passage && (
            <div style={{ background: '#fff', border: '1.5px solid rgba(0,128,128,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 14, fontSize: 14, color: '#1e293b', lineHeight: 1.8, fontStyle: 'italic' }}>
              {section.passage}
            </div>
          )}
          {section.comprehension_questions?.map((q, i) => (
            <div key={i} style={{ background: 'rgba(0,128,128,0.06)', borderRadius: 8, padding: '10px 14px', marginBottom: 8 }}>
              <div style={{ fontSize: 14, color: '#1e293b', marginBottom: q.model_answer ? 6 : 0 }}>{q.question}</div>
              {q.model_answer && (
                <div style={{ fontSize: 12, color: '#16a34a' }}><strong>Model answer:</strong> {q.model_answer}</div>
              )}
            </div>
          ))}
        </div>
      )
    case 'wrap_up':
      return (
        <div>
          {section.review_questions?.map((q, i) => (
            <div key={i} style={{ background: 'rgba(0,128,128,0.06)', borderRadius: 8, padding: '8px 12px', marginBottom: 6, fontSize: 14, color: '#1e293b' }}>
              {q}
            </div>
          ))}
          {section.encouragement && (
            <div style={{ marginTop: 12, background: '#f0fdf4', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#166534', fontWeight: 600 }}>
              {section.encouragement}
            </div>
          )}
          {section.homework && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' }}>Homework to Assign</div>
              <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#334155' }}>
                {section.homework}
              </div>
            </div>
          )}
        </div>
      )
    default:
      return null
  }
}

function AdaptiveGuidance({ section }) {
  const has = section.listen_for || section.common_mistakes?.length || section.if_struggling || section.if_finishes_early || section.move_on_when
  if (!has) return null
  return (
    <div style={{ marginTop: 18, borderTop: '1.5px dashed rgba(0,128,128,0.25)', paddingTop: 16 }}>
      <Callout icon="👂" label="Listen For" color="#0369a1" bg="#eff6ff">{section.listen_for}</Callout>
      {section.common_mistakes?.length > 0 && (
        <div style={{ background: '#fef2f2', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
            ⚠️ Common Mistakes
          </div>
          {section.common_mistakes.map((m, i) => (
            <div key={i} style={{ fontSize: 13, color: '#334155', marginBottom: 6, lineHeight: 1.6 }}>
              <span style={{ color: '#dc2626' }}>{m.mistake}</span>
              {m.fix && <span> — <span style={{ color: '#166534' }}>{m.fix}</span></span>}
            </div>
          ))}
        </div>
      )}
      <Callout icon="🐢" label="If Struggling" color="#7c3aed" bg="#faf5ff">{section.if_struggling}</Callout>
      <Callout icon="⚡" label="If Finished Early" color="#c2410c" bg="#fff7ed">{section.if_finishes_early}</Callout>
      <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
          ✅ Move On When
        </div>
        <div style={{ fontSize: 13, color: '#166534', lineHeight: 1.6 }}>{section.move_on_when}</div>
      </div>
    </div>
  )
}

function StudentSlidePreview({ slides, currentStep }) {
  const slide = slides?.[Math.min(currentStep, (slides?.length || 1) - 1)]
  if (!slide) return null
  return (
    <div style={{ background: 'rgba(0,128,128,0.04)', border: '1.5px solid rgba(0,128,128,0.2)', borderRadius: 14, padding: '16px 20px' }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: BLUE, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
        Student Screen
      </div>
      <div style={{ fontSize: 22, textAlign: 'center', marginBottom: 8 }}>{slide.emoji}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', textAlign: 'center', marginBottom: 10 }}>{slide.title}</div>
      {slide.content?.map((line, i) => (
        <div key={i} style={{ fontSize: 13, color: '#334155', padding: '4px 8px', borderRadius: 6, background: i % 2 === 0 ? '#fff' : 'transparent', marginBottom: 3 }}>{line}</div>
      ))}
    </div>
  )
}

export default function TutorSessionPage() {
  const { sessionId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [stepping, setStepping] = useState(false)

  useEffect(() => {
    if (!token || !sessionId) return
    fetch(`${API_BASE}/api/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setSession)
      .catch(() => navigate('/dashboard/tutor'))
      .finally(() => setLoading(false))
  }, [sessionId, token])

  const lessonData = session?.lesson?.data || {}
  const sections = lessonData.sections || []
  const studentSlides = lessonData.student_slides || []

  const totalSteps = sections.length
  const stepIndex = session?.current_step ?? 0
  const currentSection = sections[stepIndex] || null

  async function goToStep(newStep) {
    if (!session || stepping) return
    const clamped = Math.max(0, Math.min(totalSteps - 1, newStep))
    setStepping(true)
    try {
      await fetch(`${API_BASE}/api/sessions/${session.id}/step`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_step: clamped }),
      })
      setSession(s => ({ ...s, current_step: clamped }))
    } finally {
      setStepping(false)
    }
  }

  async function handleComplete() {
    if (!session || completing) return
    if (!window.confirm('Mark this lesson as complete and advance the student to the next lesson?')) return
    setCompleting(true)
    try {
      await fetch(`${API_BASE}/api/sessions/${session.id}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      navigate('/dashboard/tutor')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
      Loading session…
    </div>
  )

  if (!session) return null

  const lesson = session.lesson
  const isComplete = session.completed

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: "'Times New Roman', Times, serif" }}>
      <Navbar />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <button onClick={() => navigate('/dashboard/tutor')} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: BLUE, fontWeight: 700, fontSize: 13,
              padding: 0, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5,
            }}>
              ← Back to Dashboard
            </button>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f2b3d', margin: 0, marginBottom: 4 }}>
              Lesson {lesson.lesson_number} — {lesson.title}
            </h1>
            {lessonData.theme && (
              <div style={{ fontSize: 13, color: '#64748b' }}>
                Theme: {lessonData.theme} · {lessonData.duration_minutes} min
              </div>
            )}
          </div>
          {isComplete ? (
            <div style={{ background: '#dcfce7', color: '#166534', borderRadius: 12, padding: '10px 18px', fontWeight: 800, fontSize: 14 }}>
              ✅ Lesson Complete
            </div>
          ) : (
            <button onClick={handleComplete} disabled={completing} style={{
              background: completing ? '#94a3b8' : '#22c55e',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '12px 22px', fontSize: 14, fontWeight: 800, cursor: completing ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(34,197,94,0.3)',
            }}>
              {completing ? 'Completing…' : '✅ Complete Lesson'}
            </button>
          )}
        </div>

        {/* Learning objectives + completion criteria */}
        {(lessonData.learning_objectives?.length > 0 || lessonData.completion_criteria) && (
          <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', marginBottom: 24, border: '1px solid rgba(0,128,128,0.18)' }}>
            {lessonData.learning_objectives?.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: 800, color: BLUE, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  Learning Objectives
                </div>
                {lessonData.learning_objectives.map((obj, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                    <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{obj}</span>
                  </div>
                ))}
              </>
            )}
            {lessonData.completion_criteria && (
              <div style={{ marginTop: lessonData.learning_objectives?.length ? 12 : 0, paddingTop: lessonData.learning_objectives?.length ? 12 : 0, borderTop: lessonData.learning_objectives?.length ? '1px solid rgba(0,128,128,0.12)' : 'none' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                  Lesson Complete When
                </div>
                <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{lessonData.completion_criteria}</div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>

          {/* Main lesson content */}
          <div>
            {/* Step navigation tabs */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(0,128,128,0.18)', marginBottom: 20, overflow: 'hidden' }}>
              <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(0,128,128,0.12)' }}>
                {sections.map((s, i) => (
                  <button key={s.key || i} onClick={() => goToStep(i)} style={{
                    padding: '12px 18px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                    fontWeight: 700, fontSize: 13,
                    background: stepIndex === i ? 'rgba(0,128,128,0.08)' : 'transparent',
                    color: stepIndex === i ? BLUE : '#64748b',
                    borderBottom: stepIndex === i ? `3px solid ${BLUE}` : '3px solid transparent',
                  }}>
                    {stepIndex > i ? '✓ ' : stepIndex === i ? '▶ ' : ''}{s.label || s.key}
                  </button>
                ))}
              </div>

              {/* Current section content */}
              <div style={{ padding: '20px 22px' }}>
                {currentSection ? (
                  <>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>
                      {currentSection.label}
                      {currentSection.duration_minutes != null && (
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', marginLeft: 10 }}>
                          {currentSection.duration_minutes} min
                        </span>
                      )}
                    </div>
                    {currentSection.goal && (
                      <div style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic', marginBottom: 14 }}>
                        Goal: {currentSection.goal}
                      </div>
                    )}
                    <TutorSteps steps={currentSection.tutor_steps} />
                    <SectionMainContent section={currentSection} />
                    <AdaptiveGuidance section={currentSection} />
                  </>
                ) : (
                  <div style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
                    No lesson data available for this section.
                  </div>
                )}
              </div>
            </div>

            {/* Previous / Next buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <button onClick={() => goToStep(stepIndex - 1)} disabled={stepIndex === 0 || stepping} style={{
                background: stepIndex === 0 ? '#f1f5f9' : '#fff',
                color: stepIndex === 0 ? '#cbd5e1' : BLUE,
                border: `2px solid ${stepIndex === 0 ? '#e2e8f0' : 'rgba(0,128,128,0.4)'}`,
                borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700,
                cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
              }}>
                ← Previous
              </button>
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
                Section {stepIndex + 1} of {totalSteps}
              </span>
              {stepIndex < totalSteps - 1 ? (
                <button onClick={() => goToStep(stepIndex + 1)} disabled={stepping} style={{
                  background: BLUE, color: '#fff', border: 'none',
                  borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer',
                }}>
                  Next →
                </button>
              ) : (
                <button onClick={handleComplete} disabled={isComplete || completing} style={{
                  background: isComplete ? '#94a3b8' : '#22c55e', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700,
                  cursor: isComplete || completing ? 'not-allowed' : 'pointer',
                }}>
                  {isComplete ? 'Already Complete' : '✅ Complete Lesson'}
                </button>
              )}
            </div>
          </div>

          {/* Right sidebar: student slide preview + materials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <StudentSlidePreview slides={studentSlides} currentStep={stepIndex} />

            {lesson.slides_url && (
              <a href={lesson.slides_url} target="_blank" rel="noreferrer" style={{
                display: 'block', background: '#fff', border: '1.5px solid rgba(0,128,128,0.25)',
                borderRadius: 12, padding: '12px 16px', textAlign: 'center',
                fontSize: 13, fontWeight: 700, color: BLUE, textDecoration: 'none',
              }}>
                📊 Open Student Slides →
              </a>
            )}

            {lessonData.materials_needed?.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid rgba(0,128,128,0.18)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: BLUE, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  Materials Needed
                </div>
                {lessonData.materials_needed.map((m, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#475569', marginBottom: 5, display: 'flex', gap: 6 }}>
                    <span>•</span><span>{m}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
