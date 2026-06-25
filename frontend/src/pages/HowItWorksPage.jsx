import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

// ── Swap these for real photos of Peruvian students and NJ mentors ──────────
const IMG = {
  s1: 'https://images.unsplash.com/photo-1529670776782-4de8dbafe29b?w=960&q=85',
  s2: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=960&q=85',
  s3: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=960&q=85',
  m1: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=960&q=85',
  m2: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=960&q=85',
  m3: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=960&q=85',
  m4: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=960&q=85',
}

const STUDENT_STEPS = [
  {
    num: '01',
    tag: 'Paso Uno',
    title: '¡Regístrate y conéctate con tu tutor!',
    body: 'Crea tu cuenta en la plataforma y te emparejaremos con un tutor de Nueva Jersey. Solo necesitas acceso a internet para participar — ¡es completamente gratis!',
    img: IMG.s1,
    accent: '#008080',
  },
  {
    num: '02',
    tag: 'Paso Dos',
    title: 'Tareas y materiales de aprendizaje',
    body: 'Un administrador publica tareas y materiales para guiar cada sesión. Cada lección está diseñada para ayudarte a mejorar tu inglés paso a paso junto a tu tutor.',
    img: IMG.s2,
    accent: '#008080',
  },
  {
    num: '03',
    tag: 'Paso Tres',
    title: 'Conéctate y aprende con tu tutor',
    body: 'Comunícate con tu tutor a través de mensajes privados o reuniones virtuales. ¡Aprende inglés con conversaciones reales y construye una amistad duradera!',
    img: IMG.s3,
    accent: '#FF6F61',
  },
]

const MENTOR_STEPS = [
  {
    num: '01',
    tag: 'Step One',
    title: 'Sign Up & Get Matched With a Student',
    body: "Create your tutor account and we'll pair you with students in Peru who are eager to learn English. Your time and guidance — at any experience level — makes a real difference.",
    img: IMG.m1,
    accent: '#008080',
  },
  {
    num: '02',
    tag: 'Step Two',
    title: 'Follow the Curriculum',
    body: "Assignments and lesson materials are posted by an administrator to guide every session. Everything you need is organized in one place — no lesson planning required on your end.",
    img: IMG.m2,
    accent: '#008080',
  },
  {
    num: '03',
    tag: 'Step Three',
    title: 'Connect With Your Students',
    body: 'Communicate with your students through private messages or virtual meetings. Help them improve their English through real, meaningful conversations — on their schedule.',
    img: IMG.m3,
    accent: '#FF6F61',
  },
  {
    num: '04',
    tag: 'Step Four',
    title: 'Earn Your Community Service Letter',
    body: "After completing your tutoring sessions you'll receive an official signed letter authenticating your community service hours. Share it with your school, include it in your college applications, or add it to your resume.",
    img: IMG.m4,
    accent: '#A0D3E8',
  },
]

function useWindowWidth() {
  const [w, setW] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024))
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

export default function HowItWorksPage() {
  const navigate = useNavigate()
  const { lang, t } = useLanguage()
  const { user } = useAuth()
  const [tab, setTab] = useState('students')
  const width = useWindowWidth()
  const isMobile = width < 768

  // Auto-switch tab based on language
  useEffect(() => {
    if (lang === 'es') setTab('students')
    else setTab('mentors')
  }, [lang])

  const steps = tab === 'students' ? STUDENT_STEPS : MENTOR_STEPS

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>

      <PublicNav />

      {/* ── Page header + tab switcher ── */}
      <section style={{
        paddingTop: isMobile ? 40 : 52,
        paddingBottom: 28,
        paddingLeft: 24,
        paddingRight: 24,
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: isMobile ? 36 : 58,
          fontWeight: 900, color: '#0f2b3d',
          lineHeight: 1.1, letterSpacing: isMobile ? '-1px' : '-2px',
          margin: '0 0 12px',
        }}>
          Simple. Free.<br />
          <span style={{ color: '#008080' }}>Life-Changing.</span>
        </h1>

        <p style={{ color: '#7a9cac', fontSize: isMobile ? 16 : 18, margin: '0 auto 28px', maxWidth: 460 }}>
          {t('hiw.subtitle')}
        </p>

        {/* ── Tab switcher ── */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(0,128,128,0.06)',
          borderRadius: 18,
          padding: 6,
          border: '1px solid rgba(0,128,128,0.15)',
          gap: 4,
        }}>
          {[
            { key: 'students', label: t('hiw.tab.students') },
            { key: 'mentors',  label: t('hiw.tab.mentors') },
          ].map(tab_ => (
            <button
              key={tab_.key}
              onClick={() => setTab(tab_.key)}
              style={{
                background: tab === tab_.key ? '#FF6F61' : 'transparent',
                color: tab === tab_.key ? '#fff' : '#7a9cac',
                border: 'none', borderRadius: 13,
                padding: isMobile ? '12px 22px' : '15px 36px',
                fontSize: isMobile ? 14 : 16, fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: tab === tab_.key ? '0 4px 20px rgba(255,111,97,0.4)' : 'none',
              }}
            >
              {tab_.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Steps ── */}
      <div style={{ flex: 1 }}>
        {steps.map((step, i) => {
          const isEven = i % 2 === 0
          return (
            <section
              key={step.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: isMobile ? '40px 24px' : '52px 80px',
                maxWidth: 1280,
                margin: '0 auto',
                gap: isMobile ? 36 : 72,
                flexDirection: isMobile ? 'column' : (isEven ? 'row' : 'row-reverse'),
                boxSizing: 'border-box',
              }}
            >
              {/* ── Image panel ── */}
              <div style={{ flex: '0 0 48%', maxWidth: isMobile ? '100%' : '48%', width: '100%' }}>
                <div style={{
                  borderRadius: 28,
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '4/3',
                  boxShadow: `0 40px 100px rgba(0,128,128,0.15), 0 0 0 1px rgba(0,128,128,0.1)`,
                }}>
                  <img
                    src={step.img}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Step badge on image */}
                  <div style={{
                    position: 'absolute', top: 20, left: 20,
                    background: step.accent,
                    color: '#fff', fontWeight: 900, fontSize: 13,
                    borderRadius: 8, padding: '7px 16px',
                    letterSpacing: '1.5px', textTransform: 'uppercase',
                  }}>
                    {tab === 'students' ? 'PASO' : 'STEP'} {step.num}
                  </div>
                </div>
              </div>

              {/* ── Text panel ── */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Decorative big number */}
                <div style={{
                  fontSize: isMobile ? 88 : 140,
                  fontWeight: 900,
                  color: step.accent,
                  opacity: 0.12,
                  lineHeight: 1,
                  marginBottom: -16,
                  letterSpacing: '-6px',
                  userSelect: 'none',
                }}>
                  {step.num}
                </div>

                {/* Tag */}
                <div style={{
                  fontSize: 12, fontWeight: 800,
                  color: step.accent,
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  marginBottom: 14,
                }}>
                  {step.tag}
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: isMobile ? 28 : 42,
                  fontWeight: 900,
                  color: '#0f2b3d',
                  lineHeight: 1.15,
                  letterSpacing: isMobile ? '-0.5px' : '-1.2px',
                  margin: '0 0 22px',
                }}>
                  {step.title}
                </h2>

                {/* Body */}
                <p style={{
                  fontSize: isMobile ? 17 : 21,
                  color: '#3d6275',
                  lineHeight: 1.8,
                  margin: 0,
                  maxWidth: 500,
                }}>
                  {step.body}
                </p>

                {/* Accent line */}
                <div style={{
                  width: 56, height: 4,
                  background: step.accent,
                  borderRadius: 4,
                  marginTop: 36,
                  opacity: 0.6,
                }} />
              </div>
            </section>
          )
        })}
      </div>

      {/* ── Bottom CTA — hidden for logged-in students/tutors ── */}
      {!user && (
        <section style={{
          textAlign: 'center',
          padding: isMobile ? '56px 24px 72px' : '72px 40px 88px',
          background: 'linear-gradient(to bottom, transparent, rgba(0,128,128,0.06))',
          borderTop: '1px solid rgba(0,128,128,0.1)',
        }}>
          <h2 style={{
            fontSize: isMobile ? 32 : 48,
            fontWeight: 900, color: '#0f2b3d',
            margin: '0 0 16px',
            letterSpacing: isMobile ? '-1px' : '-1.5px',
          }}>
            {t('hiw.cta.heading')}
          </h2>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
            <button
              onClick={() => navigate('/register?role=tutor')}
              style={{
                background: '#FF6F61', color: '#fff', border: 'none',
                borderRadius: 14, padding: isMobile ? '14px 28px' : '17px 40px',
                fontSize: isMobile ? 15 : 17, fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(255,111,97,0.4)',
              }}
            >
              {t('hiw.cta.mentor')}
            </button>
            <button
              onClick={() => navigate('/register?role=student')}
              style={{
                background: '#FFFFFF', color: '#008080',
                border: '2px solid rgba(0,128,128,0.28)', borderRadius: 14,
                padding: isMobile ? '14px 24px' : '17px 36px',
                fontSize: isMobile ? 15 : 17, fontWeight: 800, cursor: 'pointer',
              }}
            >
              {t('hiw.cta.student')}
            </button>
          </div>
        </section>
      )}

      <PublicFooter />
    </div>
  )
}
