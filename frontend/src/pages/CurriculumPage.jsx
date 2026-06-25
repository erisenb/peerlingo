import { useEffect, useState } from 'react'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { useLanguage } from '../context/LanguageContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8003'

function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1024)
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

function LessonCard({ lesson, lang, t, index }) {
  const [open, setOpen] = useState(false)
  const isMobile = useWindowWidth() < 768

  const hw = lesson.homework || {}
  const vocab = (() => {
    try { return JSON.parse(hw.vocabulary || '[]') } catch { return [] }
  })()
  const expressions = (() => {
    try { return JSON.parse(hw.expressions || '[]') } catch { return [] }
  })()

  const rawOutline = (lang === 'es' && lesson.outline_es) ? lesson.outline_es : (lesson.outline || '')
  const outlineLines = rawOutline.split('\n')
  const overviewStart = outlineLines.findIndex(l => l.includes('LESSON OVERVIEW'))
  const tutorStart = outlineLines.findIndex(l => l.includes('TUTOR GUIDE'))
  const tutorNoteStart = outlineLines.findIndex(l => l.includes('TUTOR NOTE'))

  const overviewText = overviewStart !== -1
    ? outlineLines.slice(overviewStart + 1, tutorStart !== -1 ? tutorStart : undefined).join('\n').trim()
    : lesson.outline

  const tutorText = tutorStart !== -1
    ? outlineLines.slice(tutorStart + 1, tutorNoteStart !== -1 ? tutorNoteStart : undefined).join('\n').trim()
    : ''

  const tutorNote = tutorNoteStart !== -1
    ? outlineLines.slice(tutorNoteStart).join('\n').replace('TUTOR NOTE:', '').trim()
    : ''

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(0,128,128,0.13)',
      borderRadius: 14,
      marginBottom: 10,
      overflow: 'hidden',
      boxShadow: open ? '0 4px 20px rgba(0,128,128,0.08)' : '0 1px 4px rgba(0,128,128,0.05)',
      transition: 'box-shadow 0.2s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: isMobile ? '16px 18px' : '18px 24px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(0,128,128,0.1)', color: '#008080',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800,
        }}>
          {lesson.lesson_number}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, color: '#0f2b3d' }}>
            {lesson.title}
          </div>
        </div>
        <div style={{ color: '#008080', fontSize: 18, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ▾
        </div>
      </button>

      {open && (
        <div style={{ padding: isMobile ? '0 18px 20px' : '0 24px 24px', borderTop: '1px solid rgba(0,128,128,0.08)' }}>
          {/* Lesson Overview */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#008080', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
              {t('curriculum.lessonOverview')}
            </div>
            <div style={{ fontSize: 14, color: '#3d6275', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
              {overviewText}
            </div>
          </div>

          {/* Tutor Guide */}
          {tutorText && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#008080', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                {t('curriculum.tutorGuide')}
              </div>
              <div style={{ fontSize: 14, color: '#3d6275', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                {tutorText}
              </div>
            </div>
          )}

          {/* Tutor Note */}
          {tutorNote && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(255,111,97,0.06)', borderLeft: '3px solid #FF6F61', borderRadius: '0 8px 8px 0' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#FF6F61' }}>Note: </span>
              <span style={{ fontSize: 13, color: '#3d6275' }}>{tutorNote}</span>
            </div>
          )}

          {/* Vocabulary */}
          {vocab.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#008080', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                {t('curriculum.vocabulary')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 8 }}>
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

          {/* Expressions */}
          {expressions.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#008080', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                {t('curriculum.expressions')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {expressions.map((e, i) => (
                  <div key={i} style={{ padding: '10px 14px', background: 'rgba(0,128,128,0.04)', border: '1px solid rgba(0,128,128,0.1)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 700, color: '#0f2b3d', fontSize: 14, flexShrink: 0 }}>"{e.expression}"</span>
                    <span style={{ color: '#7a9cac', fontSize: 13 }}>→</span>
                    <span style={{ color: '#3d6275', fontSize: 13 }}>{e.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prepare note */}
          <div style={{ marginTop: 20, fontSize: 13, color: '#7a9cac', fontStyle: 'italic' }}>
            {t('curriculum.prepareNote')}
          </div>
        </div>
      )}
    </div>
  )
}

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

      <main style={{ flex: 1, maxWidth: 900, margin: '0 auto', padding: isMobile ? '40px 18px 60px' : '60px 32px 80px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 52 }}>
          <h1 style={{ fontSize: isMobile ? 32 : 52, fontWeight: 900, color: '#0f2b3d', margin: '0 0 14px', lineHeight: 1.15 }}>
            {lang === 'es' ? 'Currículo de Muestra' : 'Sample Curriculum'}
          </h1>
          <p style={{ fontSize: isMobile ? 16 : 19, color: '#5a7d8c', maxWidth: 560, margin: '0 auto', lineHeight: 1.6, fontWeight: 400 }}>
            {lang === 'es'
              ? 'Los estudiantes aprenden vocabulario y frases clave antes de sus sesiones de tutoría guiadas.'
              : 'Students learn vocab and key phrases in advance of their guided tutoring sessions.'}
          </p>
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
                fontSize: isMobile ? 13 : 16, fontWeight: 800,
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
                {data.title}
              </h2>
              {data.description && (
                <p style={{ color: '#5a7d8c', fontSize: 15, margin: 0, lineHeight: 1.6 }}>{data.description}</p>
              )}
            </div>

            <div>
              {(data.lessons || []).map((lesson, i) => (
                <LessonCard key={lesson.id} lesson={lesson} lang={lang} t={t} index={i} />
              ))}
            </div>
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
