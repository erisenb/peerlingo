import { useEffect, useState } from 'react'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { useLanguage } from '../context/LanguageContext'

const API = import.meta.env.VITE_API_BASE || ''

function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1024)
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

// ── Section building blocks ───────────────────────────────────────────────────

function SectionBlock({ icon, title, duration, accentColor = '#008080', children }) {
  return (
    <div style={{
      background: '#fff',
      border: `1px solid rgba(0,128,128,0.1)`,
      borderLeft: `4px solid ${accentColor}`,
      borderRadius: '0 12px 12px 0',
      padding: '18px 20px',
      marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
          {duration && <div style={{ fontSize: 11, color: '#7a9cac', fontWeight: 600, marginTop: 1 }}>{duration}</div>}
        </div>
      </div>
      {children}
    </div>
  )
}

function VocabGrid({ words, isMobile }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 10 }}>
      {words.map((w, i) => (
        <div key={i} style={{ background: 'rgba(160,211,232,0.08)', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#0f2b3d' }}>{w.word}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#FF6F61', letterSpacing: '0.02em' }}>{w.pronunciation}</span>
          </div>
          <div style={{ fontSize: 13, color: '#3d6275', lineHeight: 1.55, marginBottom: 6 }}>{w.definition}</div>
          <div style={{ fontSize: 12, color: '#7a9cac', fontStyle: 'italic', marginBottom: w.visual ? 6 : 0 }}>
            "{w.example_sentence}"
          </div>
          {w.visual && (
            <div style={{ fontSize: 11, color: '#008080', background: 'rgba(0,128,128,0.06)', borderRadius: 6, padding: '3px 8px', display: 'inline-block' }}>
              🖼 {w.visual}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Full structured lesson view ───────────────────────────────────────────────
// Renders the same student-safe lesson_data (sections[]) served by the app's
// session endpoints — tutor-only fields (scripts, adaptive guidance) are
// already stripped server-side, so this is a public preview by construction,
// not by omission here.

const SECTION_ICON = { discussion: '💬', vocabulary: '📚', concept: '✏️', activity: '🎮', reading: '📖', wrap_up: '✅' }
const SECTION_COLOR = { discussion: '#2563eb', vocabulary: '#008080', concept: '#7c3aed', activity: '#FF6F61', reading: '#0f2b3d', wrap_up: '#16a34a' }

function SectionPreview({ section, isMobile }) {
  const hasContent =
    section.words?.length || section.concept || section.explanation || section.examples?.length ||
    section.activity_name || section.instructions || section.passage || section.comprehension_questions?.length ||
    section.review_questions?.length || section.encouragement || section.homework

  return (
    <SectionBlock
      icon={SECTION_ICON[section.kind] || '📌'}
      title={section.label || section.key}
      duration={section.duration_minutes ? `${section.duration_minutes} min` : undefined}
      accentColor={SECTION_COLOR[section.kind] || '#008080'}
    >
      {section.kind === 'vocabulary' && section.words?.length > 0 && (
        <VocabGrid words={section.words} isMobile={isMobile} />
      )}

      {section.kind === 'concept' && (
        <>
          {section.concept && <div style={{ fontSize: 15, fontWeight: 800, color: '#0f2b3d', marginBottom: 8 }}>{section.concept}</div>}
          {section.explanation && <div style={{ fontSize: 13, color: '#7a9cac', lineHeight: 1.6, marginBottom: 12 }}>{section.explanation}</div>}
          {section.examples?.map((ex, i) => (
            <div key={i} style={{ fontSize: 14, color: '#0f2b3d', fontWeight: 600, marginBottom: 4, paddingLeft: 12, borderLeft: '2px solid rgba(124,58,237,0.3)' }}>{ex}</div>
          ))}
        </>
      )}

      {section.kind === 'activity' && (
        <>
          {section.activity_name && <div style={{ fontSize: 15, fontWeight: 800, color: '#0f2b3d', marginBottom: 8 }}>{section.activity_name}</div>}
          {section.instructions && <div style={{ fontSize: 14, color: '#3d6275', lineHeight: 1.65 }}>{section.instructions}</div>}
        </>
      )}

      {section.kind === 'reading' && (
        <>
          {section.passage && (
            <div style={{ fontSize: 14, color: '#0f2b3d', fontStyle: 'italic', lineHeight: 1.75, background: 'rgba(0,128,128,0.04)', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
              {section.passage}
            </div>
          )}
          {section.comprehension_questions?.map((q, i) => (
            <div key={i} style={{ fontSize: 14, color: '#3d6275', marginBottom: 5 }}>• {q.question}</div>
          ))}
        </>
      )}

      {section.kind === 'wrap_up' && (
        <>
          {section.review_questions?.length > 0 && (
            <ol style={{ margin: '0 0 12px', paddingLeft: 20 }}>
              {section.review_questions.map((q, i) => (
                <li key={i} style={{ fontSize: 14, color: '#3d6275', lineHeight: 1.65, marginBottom: 5 }}>{q}</li>
              ))}
            </ol>
          )}
          {section.encouragement && (
            <div style={{ fontSize: 14, color: '#0f2b3d', fontWeight: 600, padding: '10px 13px', background: 'rgba(22,163,74,0.06)', borderRadius: 8, borderLeft: '3px solid #16a34a', marginBottom: 10 }}>
              💚 {section.encouragement}
            </div>
          )}
          {section.homework && (
            <div style={{ fontSize: 14, color: '#3d6275', padding: '10px 13px', background: 'rgba(0,128,128,0.04)', borderRadius: 8 }}>
              <span style={{ fontWeight: 700, color: '#008080' }}>Homework: </span>{section.homework}
            </div>
          )}
        </>
      )}

      {!hasContent && (
        <div style={{ fontSize: 13, color: '#7a9cac', fontStyle: 'italic' }}>
          Led live by the tutor during the session.
        </div>
      )}
    </SectionBlock>
  )
}

function StructuredLesson({ ld, isMobile }) {
  return (
    <div>
      {/* Meta row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {ld.theme && (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#008080', background: 'rgba(0,128,128,0.08)', borderRadius: 20, padding: '4px 12px' }}>
            {ld.theme}
          </span>
        )}
        {ld.duration_minutes && (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#7a9cac', background: 'rgba(0,128,128,0.05)', borderRadius: 20, padding: '4px 12px' }}>
            ⏱ {ld.duration_minutes} min
          </span>
        )}
      </div>

      {/* Learning objectives */}
      {ld.learning_objectives?.length > 0 && (
        <SectionBlock icon="🎯" title="Learning Objectives" accentColor="#008080">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {ld.learning_objectives.map((obj, i) => (
              <li key={i} style={{ fontSize: 14, color: '#3d6275', lineHeight: 1.7, marginBottom: 3 }}>{obj}</li>
            ))}
          </ul>
        </SectionBlock>
      )}

      {ld.sections?.map((section, i) => (
        <SectionPreview key={section.key || i} section={section} isMobile={isMobile} />
      ))}
    </div>
  )
}

// ── Classic lesson view (no lesson_data) ──────────────────────────────────────

function ClassicLesson({ lesson, lang }) {
  const vocab = (() => { try { return JSON.parse(lesson.vocabulary || '[]') } catch { return [] } })()
  const expressions = (() => { try { return JSON.parse(lesson.expressions || '[]') } catch { return [] } })()
  const rawOutline = (lang === 'es' && lesson.outline_es) ? lesson.outline_es : (lesson.outline || '')
  const lines = rawOutline.split('\n')
  const overviewStart = lines.findIndex(l => l.includes('LESSON OVERVIEW'))
  const tutorStart = lines.findIndex(l => l.includes('TUTOR GUIDE'))
  const overviewText = overviewStart !== -1
    ? lines.slice(overviewStart + 1, tutorStart !== -1 ? tutorStart : undefined).join('\n').trim()
    : rawOutline

  return (
    <div>
      {overviewText && (
        <div style={{ fontSize: 14, color: '#3d6275', lineHeight: 1.75, whiteSpace: 'pre-wrap', marginBottom: 20 }}>{overviewText}</div>
      )}
      {vocab.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#008080', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Vocabulary</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
            {vocab.map((v, i) => (
              <div key={i} style={{ padding: '10px 14px', background: 'rgba(160,211,232,0.12)', border: '1px solid rgba(160,211,232,0.3)', borderRadius: 10 }}>
                <span style={{ fontWeight: 700, color: '#0f2b3d', fontSize: 14 }}>{v.word}</span>
                <span style={{ color: '#5a7d8c', fontSize: 13 }}> — </span>
                <span style={{ color: '#3d6275', fontSize: 13 }}>{v.definition}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {expressions.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#008080', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Expressions</div>
          {expressions.map((e, i) => (
            <div key={i} style={{ padding: '10px 14px', background: 'rgba(0,128,128,0.04)', border: '1px solid rgba(0,128,128,0.1)', borderRadius: 10, marginBottom: 8 }}>
              <div style={{ fontWeight: 700, color: '#0f2b3d', fontSize: 14 }}>"{e.expression}"</div>
              <div style={{ color: '#3d6275', fontSize: 13, marginTop: 3 }}>{e.meaning}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Lesson card ───────────────────────────────────────────────────────────────

function LessonCard({ lesson, lang, isMobile }) {
  const [open, setOpen] = useState(false)

  const ld = (() => {
    if (!lesson.lesson_data) return null
    try { return JSON.parse(lesson.lesson_data) } catch { return null }
  })()

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${open ? 'rgba(0,128,128,0.25)' : 'rgba(0,128,128,0.13)'}`,
      borderRadius: 14,
      marginBottom: 10,
      overflow: 'hidden',
      boxShadow: open ? '0 4px 24px rgba(0,128,128,0.1)' : '0 1px 4px rgba(0,128,128,0.05)',
      transition: 'box-shadow 0.2s, border-color 0.2s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: isMobile ? '16px 18px' : '18px 24px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          background: open ? '#008080' : 'rgba(0,128,128,0.1)',
          color: open ? '#fff' : '#008080',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800,
          transition: 'background 0.2s, color 0.2s',
        }}>
          {lesson.lesson_number}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, color: '#0f2b3d' }}>
            {lesson.title}
          </div>
          {ld?.theme && (
            <div style={{ fontSize: 11, color: '#7a9cac', marginTop: 2 }}>{ld.theme}</div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {ld && !isMobile && (
            <span style={{
              fontSize: 10, fontWeight: 800, color: '#fff',
              background: '#FF6F61', borderRadius: 20, padding: '3px 9px',
              letterSpacing: '0.04em',
            }}>
              FULL GUIDE
            </span>
          )}
          <span style={{
            color: '#008080', fontSize: 18,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            display: 'inline-block',
          }}>▾</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid rgba(0,128,128,0.08)', padding: isMobile ? '18px 16px 22px' : '22px 24px 28px' }}>
          {ld
            ? <StructuredLesson ld={ld} isMobile={isMobile} />
            : (
              <>
                <ClassicLesson lesson={lesson} lang={lang} />
                <div style={{ marginTop: 18, padding: '11px 14px', background: 'rgba(0,128,128,0.04)', border: '1px dashed rgba(0,128,128,0.2)', borderRadius: 10, fontSize: 13, color: '#7a9cac', textAlign: 'center' }}>
                  Full tutor guide with script, activities, and teaching notes — coming soon for this lesson.
                </div>
              </>
            )
          }
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CurriculumPage() {
  const { t, lang } = useLanguage()
  const [level, setLevel] = useState('beginner')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const width = useWindowWidth()
  const isMobile = width < 768

  useEffect(() => {
    setLoading(true)
    setError(null)
    setData(null)
    fetch(`${API}/api/curriculum/by-level/${level}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [level])

  return (
    <div style={{ minHeight: '100vh', background: '#F1F8F9', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      <main style={{ flex: 1, maxWidth: 960, margin: '0 auto', padding: isMobile ? '40px 18px 60px' : '60px 32px 80px', width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 52 }}>
          <h1 style={{ fontSize: isMobile ? 32 : 52, fontWeight: 900, color: '#0f2b3d', margin: '0 0 14px', lineHeight: 1.15 }}>
            {lang === 'es' ? 'Currículo de Muestra' : 'Sample Curriculum'}
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 18, color: '#5a7d8c', maxWidth: 580, margin: '0 auto 20px', lineHeight: 1.6 }}>
            {lang === 'es'
              ? 'Cada lección incluye una guía completa para el tutor, vocabulario, actividades y notas de enseñanza.'
              : 'Each lesson includes a complete tutor script, vocabulary cards, conversation prompts, activities, and teaching notes.'}
          </p>
          <div style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: '📋', label: 'Tutor Script' },
              { icon: '📚', label: 'Vocabulary' },
              { icon: '💬', label: 'Conversation Prompts' },
              { icon: '🎮', label: 'Activities' },
              { icon: '📝', label: 'Teaching Notes' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ fontSize: 12, fontWeight: 700, color: '#3d6275', background: '#fff', border: '1px solid rgba(0,128,128,0.2)', borderRadius: 20, padding: '5px 12px' }}>
                {icon} {label}
              </div>
            ))}
          </div>
        </div>

        {/* Level toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? 32 : 44 }}>
          <div style={{ display: 'inline-flex', background: 'rgba(0,128,128,0.06)', borderRadius: 18, padding: 6, border: '1px solid rgba(0,128,128,0.15)', gap: 4 }}>
            {['beginner', 'intermediate', 'advanced'].map(lvl => (
              <button key={lvl} onClick={() => setLevel(lvl)} style={{
                background: level === lvl ? '#FF6F61' : 'transparent',
                color: level === lvl ? '#fff' : '#7a9cac',
                border: 'none', borderRadius: 13,
                padding: isMobile ? '12px 20px' : '15px 36px',
                fontSize: isMobile ? 13 : 15, fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: level === lvl ? '0 4px 20px rgba(255,111,97,0.4)' : 'none',
              }}>
                {t(`curriculum.${lvl}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#7a9cac', fontSize: 16 }}>
            {t('curriculum.loading')}
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#FF6F61', fontSize: 16 }}>
            {t('curriculum.noData')}
          </div>
        )}

        {data && !loading && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: '#0f2b3d', marginBottom: 6 }}>
                {data.curriculum?.title}
              </h2>
              {data.curriculum?.description && (
                <p style={{ color: '#5a7d8c', fontSize: 15, margin: 0, lineHeight: 1.6 }}>
                  {data.curriculum.description}
                </p>
              )}
            </div>
            <div>
              {(data.lessons || []).map(lesson => (
                <LessonCard key={lesson.id} lesson={lesson} lang={lang} isMobile={isMobile} />
              ))}
            </div>
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
