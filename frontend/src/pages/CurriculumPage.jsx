import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { useLanguage } from '../context/LanguageContext'
import { LESSON_GUIDE } from '../data/lessonGuide'

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

// ── Course structure ──────────────────────────────────────────────────────────
// Mirrors the unified Foundational English course (backend/vp_lessons_foundational.py).
// Cambridge milestones match CAMBRIDGE_BENCHMARK_DUE_AFTER_LESSON in router.py.

const PHASES = [
  {
    from: 1, to: 2, color: '#008080',
    title: { en: 'Getting Started', es: 'Primeros Pasos' },
    desc: {
      en: 'Feelings and the verb "to be": I am, I feel, she is, they are. These are the building blocks every later lesson reuses.',
      es: 'Emociones y el verbo "to be": I am, I feel, she is, they are. Son la base que usan todas las lecciones siguientes.',
    },
  },
  {
    from: 3, to: 8, color: '#2563eb',
    title: { en: 'Picture Vocabulary & Careful Reading', es: 'Vocabulario con Imágenes y Lectura Atenta' },
    desc: {
      en: 'Animals, everyday objects, colors, clothes, plurals, prepositions and spelling, plus the true/false and yes/no picture reading used on the Cambridge test.',
      es: 'Animales, objetos cotidianos, colores, ropa, plurales, preposiciones y ortografía, además de la lectura de imágenes con verdadero/falso y sí/no que usa el examen de Cambridge.',
    },
  },
  {
    from: 9, to: 15, color: '#7c3aed',
    title: { en: 'Sentences, Questions & Stories', es: 'Oraciones, Preguntas e Historias' },
    desc: {
      en: 'Family and body parts, actions in the present continuous, question words, numbers and food, factual reading and picture stories, finishing with full Volume 2 preparation.',
      es: 'Familia y partes del cuerpo, acciones en presente continuo, palabras interrogativas, números y comida, lectura de datos e historias con imágenes, terminando con la preparación completa para el Volumen 2.',
    },
  },
  {
    from: 16, to: 20, color: '#FF6F61',
    title: { en: 'Past, Future & Real Conversation', es: 'Pasado, Futuro y Conversación Real' },
    desc: {
      en: 'The past tense, going to and will, connecting ideas with and, but, because and so, longer reading, and a final unscripted conversation that uses the whole course.',
      es: 'El pasado, going to y will, conectar ideas con and, but, because y so, lecturas más largas y una conversación final libre que usa todo el curso.',
    },
  },
]

const MILESTONES = {
  2: {
    title: { en: 'Cambridge Pre A1 Starters: Volume 1', es: 'Cambridge Pre A1 Starters: Volumen 1' },
    desc: {
      en: 'Baseline test. Students take the official Reading & Writing sample paper so their tutor knows exactly where they are starting.',
      es: 'Examen inicial. El estudiante hace el examen oficial de muestra de Reading & Writing para que su tutor sepa exactamente desde dónde empieza.',
    },
  },
  15: {
    title: { en: 'Cambridge Pre A1 Starters: Volume 2', es: 'Cambridge Pre A1 Starters: Volumen 2' },
    desc: {
      en: 'Final benchmark. A second official sample paper, compared with Volume 1 to measure real, verified progress.',
      es: 'Evaluación final. Un segundo examen oficial de muestra que se compara con el Volumen 1 para medir el progreso real y verificado.',
    },
  },
}

const FEATURES = [
  {
    icon: '🧭',
    title: { en: 'Step-by-step tutor guide', es: 'Guía paso a paso para el tutor' },
    desc: {
      en: 'Every section tells the tutor what to say, what to listen for and when to move on. No teaching experience or fluent Spanish needed.',
      es: 'Cada sección le dice al tutor qué decir, qué escuchar y cuándo avanzar. No necesita experiencia enseñando ni hablar español con fluidez.',
    },
  },
  {
    icon: '🎯',
    title: { en: 'Adapts to every student', es: 'Se adapta a cada estudiante' },
    desc: {
      en: 'Built-in plans for students who are struggling and for those who finish early, so one course works at every starting level.',
      es: 'Incluye planes para estudiantes con dificultades y para los que terminan rápido, así un solo curso funciona para todos los niveles.',
    },
  },
  {
    icon: '🖼️',
    title: { en: 'Student slides', es: 'Diapositivas para el estudiante' },
    desc: {
      en: 'Simple, visual slides students follow along with during the video session.',
      es: 'Diapositivas simples y visuales que el estudiante sigue durante la videollamada.',
    },
  },
  {
    icon: '🃏',
    title: { en: 'Homework & flashcards', es: 'Tareas y tarjetas de estudio' },
    desc: {
      en: 'Every lesson ends with homework, and its vocabulary becomes English/Spanish flashcards students can study anytime.',
      es: 'Cada lección termina con una tarea, y su vocabulario se convierte en tarjetas inglés/español para estudiar cuando quieran.',
    },
  },
]

// ── Lesson preview building blocks ────────────────────────────────────────────
// Renders the same student-safe lesson_data (sections[]) served by the app's
// session endpoints. Tutor-only fields (scripts, adaptive guidance) are
// already stripped server-side, so this is a public preview by construction,
// not by omission here.

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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#0f2b3d' }}>{w.word}</span>
            {w.pronunciation && <span style={{ fontSize: 11, fontWeight: 700, color: '#FF6F61', letterSpacing: '0.02em' }}>{w.pronunciation}</span>}
          </div>
          {w.definition && <div style={{ fontSize: 13, color: '#3d6275', lineHeight: 1.55, marginBottom: 6 }}>{w.definition}</div>}
          {w.example_sentence && (
            <div style={{ fontSize: 12, color: '#7a9cac', fontStyle: 'italic' }}>"{w.example_sentence}"</div>
          )}
        </div>
      ))}
    </div>
  )
}

// Durations are estimates, so show them rounded to the nearest 5 minutes.
function approxMinutes(min) {
  return `~${Math.max(5, Math.round(min / 5) * 5)} min`
}

const SECTION_ICON = { discussion: '💬', vocabulary: '📚', concept: '✏️', activity: '🎮', reading: '📖', wrap_up: '✅' }
const SECTION_COLOR = { discussion: '#2563eb', vocabulary: '#008080', concept: '#7c3aed', activity: '#FF6F61', reading: '#0f2b3d', wrap_up: '#16a34a' }

function SectionPreview({ section, isMobile, isEs }) {
  const hasContent =
    section.words?.length || section.concept || section.explanation || section.examples?.length ||
    section.activity_name || section.instructions || section.passage || section.comprehension_questions?.length ||
    section.review_questions?.length || section.encouragement || section.homework

  return (
    <SectionBlock
      icon={SECTION_ICON[section.kind] || '📌'}
      title={section.label || section.key}
      duration={section.duration_minutes ? approxMinutes(section.duration_minutes) : undefined}
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
              <span style={{ fontWeight: 700, color: '#008080' }}>{isEs ? 'Tarea: ' : 'Homework: '}</span>{section.homework}
            </div>
          )}
        </>
      )}

      {!hasContent && (
        <div style={{ fontSize: 13, color: '#7a9cac', fontStyle: 'italic' }}>
          {isEs ? 'El tutor guía esta parte en vivo durante la sesión.' : 'Led live by the tutor during the session.'}
        </div>
      )}
    </SectionBlock>
  )
}

function LessonPreview({ ld, isMobile, isEs }) {
  return (
    <div>
      {ld.learning_objectives?.length > 0 && (
        <SectionBlock icon="🎯" title={isEs ? 'Objetivos de aprendizaje' : 'Learning Objectives'} accentColor="#008080">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {ld.learning_objectives.map((obj, i) => (
              <li key={i} style={{ fontSize: 14, color: '#3d6275', lineHeight: 1.7, marginBottom: 3 }}>{obj}</li>
            ))}
          </ul>
        </SectionBlock>
      )}
      {ld.sections?.map((section, i) => (
        <SectionPreview key={section.key || i} section={section} isMobile={isMobile} isEs={isEs} />
      ))}
    </div>
  )
}

// ── Lesson card ───────────────────────────────────────────────────────────────

function LessonCard({ lesson, color, isMobile, isEs }) {
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
        onClick={() => ld && setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: isMobile ? '14px 16px' : '16px 22px',
          cursor: ld ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 14,
          fontFamily: 'inherit',
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: open ? color : 'rgba(0,128,128,0.08)',
          color: open ? '#fff' : color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800,
          transition: 'background 0.2s, color 0.2s',
        }}>
          {lesson.lesson_number}
        </div>

        <div style={{ flex: 1, minWidth: 0, fontSize: isMobile ? 15 : 16, fontWeight: 700, color: '#0f2b3d' }}>
          {lesson.title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {ld?.duration_minutes && !isMobile && (
            <span style={{ fontSize: 12, fontWeight: 700, color: '#7a9cac' }}>{approxMinutes(ld.duration_minutes)}</span>
          )}
          {ld && (
            <span style={{
              color: '#008080', fontSize: 18,
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
              display: 'inline-block',
            }}>▾</span>
          )}
        </div>
      </button>

      {open && ld && (
        <div style={{ borderTop: '1px solid rgba(0,128,128,0.08)', padding: isMobile ? '18px 14px 20px' : '22px 24px 26px' }}>
          <LessonPreview ld={ld} isMobile={isMobile} isEs={isEs} />
        </div>
      )}
    </div>
  )
}

function MilestoneCard({ milestone, isEs }) {
  return (
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start',
      background: 'rgba(255,111,97,0.07)', border: '1px dashed rgba(255,111,97,0.5)',
      borderRadius: 14, padding: '14px 18px', margin: '4px 0 14px',
    }}>
      <span style={{ fontSize: 22, lineHeight: 1.2 }}>📝</span>
      <div>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#0f2b3d', marginBottom: 3 }}>
          {isEs ? milestone.title.es : milestone.title.en}
        </div>
        <div style={{ fontSize: 13, color: '#3d6275', lineHeight: 1.6 }}>
          {isEs ? milestone.desc.es : milestone.desc.en}
        </div>
      </div>
    </div>
  )
}

// ── All 20 lessons at a glance ─────────────────────────────────────────────────
// A poster-style map of the whole course: what each lesson contains and how a
// tutor can flex it for a student who is strong or weak at its main skill.

function phaseColor(n) {
  return PHASES.find(p => n >= p.from && n <= p.to)?.color || '#008080'
}

function AdviceRow({ icon, label, text, tint, accent }) {
  return (
    <div style={{ background: tint, borderRadius: 8, padding: '8px 10px' }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 12.5, color: '#3d6275', lineHeight: 1.5 }}>{text}</div>
    </div>
  )
}

function GuideCard({ item, isEs }) {
  const color = phaseColor(item.n)
  const t = obj => (isEs ? obj.es : obj.en)
  const skill = t(item.skill).toLowerCase()
  return (
    <div style={{
      background: '#fff', borderRadius: 14, borderTop: `5px solid ${color}`,
      boxShadow: '0 2px 10px rgba(15,43,61,0.07)', padding: '14px 14px 16px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', background: color, color: '#fff', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900,
        }}>
          {item.n}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t(item.skill)}</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#0f2b3d', lineHeight: 1.25 }}>{t(item.title)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {t(item.contains).map(c => (
          <span key={c} style={{ fontSize: 11.5, fontWeight: 600, color: '#0f2b3d', background: 'rgba(0,128,128,0.07)', borderRadius: 999, padding: '3px 9px' }}>
            {c}
          </span>
        ))}
      </div>

      <AdviceRow
        icon="💪"
        label={isEs ? `Fuerte en ${skill}` : `Strong at ${skill}`}
        text={t(item.strong)}
        tint="rgba(22,163,74,0.07)"
        accent="#15803d"
      />
      <AdviceRow
        icon="🌱"
        label={isEs ? `Necesita apoyo en ${skill}` : `Needs support with ${skill}`}
        text={t(item.weak)}
        tint="rgba(255,111,97,0.08)"
        accent="#c2410c"
      />

      {item.milestone && (
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#c2410c', borderTop: '1px dashed rgba(255,111,97,0.5)', paddingTop: 8, marginTop: 'auto' }}>
          📝 {t(item.milestone)}
        </div>
      )}
    </div>
  )
}

function LessonGuideGraphic({ width, isEs }) {
  const cols = width < 640 ? 1 : width < 960 ? 2 : 3
  const isMobile = width < 768
  return (
    <section
      aria-label={isEs ? 'Guía de las lecciones 1 a 20' : 'Lessons 1 to 20 tutor guide'}
      style={{
        background: 'linear-gradient(160deg, #0f2b3d 0%, #0d4a54 55%, #008080 100%)',
        borderRadius: 22, padding: isMobile ? '26px 14px 18px' : '38px 30px 30px',
        marginBottom: isMobile ? 40 : 56, boxShadow: '0 12px 40px rgba(15,43,61,0.18)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 18 : 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#FF6F61', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>
          {isEs ? 'Guía rápida para tutores' : 'Tutor quick guide'}
        </div>
        <h2 style={{ fontSize: isMobile ? 24 : 34, fontWeight: 900, color: '#fff', margin: '0 0 10px', lineHeight: 1.2 }}>
          {isEs ? 'Las 20 lecciones de un vistazo' : 'All 20 lessons at a glance'}
        </h2>
        <p style={{ fontSize: isMobile ? 14 : 15, color: 'rgba(255,255,255,0.8)', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
          {isEs
            ? 'Qué contiene cada lección y cómo adaptarla: avanza más rápido con un estudiante fuerte en la habilidad principal, o simplifica para uno que necesita apoyo.'
            : "What each lesson contains, and how to flex it: stretch a student who's strong at the lesson's main skill, or simplify for one who needs support."}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 16px', marginTop: 14 }}>
          {PHASES.map(p => (
            <span key={p.from} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: p.color, border: '1px solid rgba(255,255,255,0.5)' }} />
              {isEs ? p.title.es : p.title.en}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 12 }}>
        {LESSON_GUIDE.map(item => <GuideCard key={item.n} item={item} isEs={isEs} />)}
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CurriculumPage() {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const [lessons, setLessons] = useState(null)
  const [error, setError] = useState(false)
  const width = useWindowWidth()
  const isMobile = width < 768
  const isEs = lang === 'es'

  useEffect(() => {
    fetch(`${API}/api/curriculum/by-level/foundational`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => setLessons(d.lessons || []))
      .catch(() => setError(true))
  }, [])

  const stats = [
    ['20', isEs ? 'lecciones' : 'lessons'],
    ['30–40', isEs ? 'minutos por sesión' : 'minutes per session'],
    ['2', isEs ? 'exámenes Cambridge' : 'Cambridge benchmarks'],
    ['1', isEs ? 'curso para todos' : 'course for everyone'],
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F1F8F9', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      <main style={{ flex: 1, maxWidth: 960, margin: '0 auto', padding: isMobile ? '40px 16px 60px' : '60px 32px 80px', width: '100%', boxSizing: 'border-box' }}>

        <LessonGuideGraphic width={width} isEs={isEs} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 44 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#FF6F61', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 10 }}>
            {isEs ? 'Nuestro currículo' : 'Our curriculum'}
          </div>
          <h1 style={{ fontSize: isMobile ? 32 : 50, fontWeight: 900, color: '#0f2b3d', margin: '0 0 14px', lineHeight: 1.15 }}>
            Foundational English
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 18, color: '#5a7d8c', maxWidth: 640, margin: '0 auto', lineHeight: 1.65 }}>
            {isEs
              ? 'Un solo curso de 20 lecciones que todos los estudiantes siguen en orden. Cada lección reutiliza lo aprendido antes, y el curso prepara al estudiante para el examen Cambridge English Pre A1 Starters.'
              : 'One 20-lesson course that every student follows in order. Each lesson builds on the ones before it, and the whole course prepares students for the Cambridge English Pre A1 Starters exam.'}
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12,
          marginBottom: isMobile ? 40 : 56,
        }}>
          {stats.map(([num, label]) => (
            <div key={label} style={{ background: '#fff', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 14, padding: '18px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 900, color: '#008080' }}>{num}</div>
              <div style={{ fontSize: 11, color: '#7a9cac', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* What every lesson includes */}
        <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#0f2b3d', margin: '0 0 18px', textAlign: 'center' }}>
          {isEs ? 'Lo que incluye cada lección' : 'What every lesson includes'}
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 14,
          marginBottom: isMobile ? 44 : 60,
        }}>
          {FEATURES.map(f => (
            <div key={f.title.en} style={{ background: '#fff', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 14 }}>
              <span style={{ fontSize: 24, lineHeight: 1.2 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f2b3d', marginBottom: 4 }}>{isEs ? f.title.es : f.title.en}</div>
                <div style={{ fontSize: 14, color: '#3d6275', lineHeight: 1.6 }}>{isEs ? f.desc.es : f.desc.en}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Course map */}
        <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#0f2b3d', margin: '0 0 6px', textAlign: 'center' }}>
          {isEs ? 'Las 20 lecciones' : 'The 20 lessons'}
        </h2>
        <p style={{ fontSize: 14, color: '#7a9cac', textAlign: 'center', margin: '0 0 28px' }}>
          {isEs ? 'Toca una lección para ver su vista previa.' : 'Tap any lesson to preview it.'}
        </p>

        {error && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#FF6F61', fontSize: 16 }}>
            {isEs ? 'No se pudieron cargar las lecciones. Inténtalo de nuevo más tarde.' : 'Lessons couldn\'t be loaded. Please try again later.'}
          </div>
        )}

        {!lessons && !error && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#7a9cac', fontSize: 16 }}>
            {isEs ? 'Cargando lecciones…' : 'Loading lessons…'}
          </div>
        )}

        {lessons && PHASES.map((phase, pi) => {
          const phaseLessons = lessons.filter(l => l.lesson_number >= phase.from && l.lesson_number <= phase.to)
          if (!phaseLessons.length) return null
          return (
            <section key={pi} style={{ marginBottom: isMobile ? 32 : 40 }}>
              <div style={{ borderLeft: `4px solid ${phase.color}`, paddingLeft: 14, marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: phase.color, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  {isEs ? `Lecciones ${phase.from}–${phase.to}` : `Lessons ${phase.from}–${phase.to}`}
                </div>
                <h3 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 900, color: '#0f2b3d', margin: '4px 0 6px' }}>
                  {isEs ? phase.title.es : phase.title.en}
                </h3>
                <p style={{ fontSize: 14, color: '#5a7d8c', lineHeight: 1.6, margin: 0 }}>
                  {isEs ? phase.desc.es : phase.desc.en}
                </p>
              </div>
              {phaseLessons.map(lesson => (
                <div key={lesson.id}>
                  <LessonCard lesson={lesson} color={phase.color} isMobile={isMobile} isEs={isEs} />
                  {MILESTONES[lesson.lesson_number] && (
                    <MilestoneCard milestone={MILESTONES[lesson.lesson_number]} isEs={isEs} />
                  )}
                </div>
              ))}
            </section>
          )
        })}

        {/* Call to action */}
        <div style={{ textAlign: 'center', background: '#fff', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 18, padding: isMobile ? '28px 18px' : '36px 32px', marginTop: 12 }}>
          <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, color: '#0f2b3d', margin: '0 0 8px' }}>
            {isEs ? '¿Listo para empezar?' : 'Ready to get started?'}
          </h2>
          <p style={{ fontSize: 15, color: '#5a7d8c', margin: '0 0 20px', lineHeight: 1.6 }}>
            {isEs
              ? 'Inscríbete como estudiante y empieza la Lección 1 con tu tutor.'
              : 'Tutors teach straight from these guides. Sign up and start with Lesson 1.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isEs && (
              <button onClick={() => navigate('/register?role=tutor')}
                style={{ background: '#FF6F61', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 24px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                Become a tutor
              </button>
            )}
            <button onClick={() => navigate('/register?role=student')}
              style={{ background: isEs ? '#FF6F61' : 'rgba(0,128,128,0.08)', color: isEs ? '#fff' : '#008080', border: isEs ? 'none' : '2px solid rgba(0,128,128,0.28)', borderRadius: 12, padding: '14px 24px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
              {isEs ? 'Inscríbete como estudiante' : 'Join as a student'}
            </button>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
