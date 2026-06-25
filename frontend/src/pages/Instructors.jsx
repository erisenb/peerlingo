import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

// ── Swap for real photos of NJ volunteer mentors ─────────────────────────────
const IMGS = [
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&q=85',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=85',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=85',
]

const CONTENT = {
  en: {
    pageTitle: 'Become a Tutor',
    pageSubtitle: 'Make a difference from your own home. Volunteer tutors from New Jersey help students in Peru build real English skills — and earn something meaningful in return.',
    cta: 'Sign Up as a Tutor',
    cards: [
      {
        heading: 'Community Service Hours',
        body: 'Officially signed hours for school, college applications, and your resume.',
      },
      {
        heading: 'Make An Impact',
        body: 'Share your culture and your knowledge with students from 🇵🇪 Peru who are eager to learn.',
      },
      {
        heading: 'Easy to Achieve',
        body: 'Guided lessons, done fully remotely, on your schedule.',
      },
    ],
  },
  es: {
    pageTitle: 'Conviértete en Tutor',
    pageSubtitle: 'Genera un impacto real desde tu propio hogar. Los tutores voluntarios de Nueva Jersey ayudan a estudiantes en Perú a desarrollar habilidades reales en inglés.',
    cta: 'Regístrate como Tutor',
    cards: [
      {
        heading: 'Horas de Servicio Comunitario',
        body: 'Horas oficialmente firmadas para tu escuela, solicitudes universitarias y currículum.',
      },
      {
        heading: 'Crea un Impacto',
        body: 'Comparte tu cultura y conocimiento con estudiantes de 🇵🇪 Perú que desean aprender.',
      },
      {
        heading: 'Fácil de Lograr',
        body: 'Lecciones guiadas, completamente a distancia, a tu propio ritmo.',
      },
    ],
  },
}

function useWindowWidth() {
  const [w, setW] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024))
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

export default function Instructors() {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const width = useWindowWidth()
  const isMobile = width < 768
  const c = CONTENT[lang] ?? CONTENT.en

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      <main style={{ flex: 1, padding: isMobile ? '56px 24px 80px' : '72px 48px 96px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        {/* Page heading */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 64 }}>
          <h1 style={{ fontSize: isMobile ? 36 : 52, fontWeight: 900, color: '#0f2b3d', letterSpacing: '-1.5px', margin: '0 0 16px' }}>
            {c.pageTitle}
          </h1>
          <p style={{ fontSize: isMobile ? 16 : 18, color: '#5a8090', lineHeight: 1.75, maxWidth: 600, margin: '0 auto' }}>
            {c.pageSubtitle}
          </p>
        </div>

        {/* 3-card grid */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 40 : 32,
          alignItems: isMobile ? 'stretch' : 'flex-start',
        }}>
          {c.cards.map((card, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

              {/* Image */}
              <div style={{
                borderRadius: 20,
                overflow: 'hidden',
                aspectRatio: '4/3',
                boxShadow: '0 24px 64px rgba(0,128,128,0.15)',
                marginBottom: 24,
                flexShrink: 0,
              }}>
                <img
                  src={IMGS[i]}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* Text */}
              <h2 style={{
                fontSize: isMobile ? 22 : 26,
                fontWeight: 900,
                color: '#0f2b3d',
                letterSpacing: '-0.5px',
                margin: '0 0 10px',
                lineHeight: 1.2,
              }}>
                {card.heading}
              </h2>
              <p style={{
                fontSize: isMobile ? 15 : 16,
                color: '#5a8090',
                lineHeight: 1.65,
                margin: 0,
              }}>
                {card.body}
              </p>

            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: isMobile ? 56 : 72 }}>
          <button
            onClick={() => navigate('/register?role=tutor')}
            style={{
              background: '#FF6F61', color: '#fff', border: 'none',
              borderRadius: 14, padding: isMobile ? '14px 32px' : '17px 44px',
              fontSize: isMobile ? 15 : 17, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 8px 28px rgba(255,111,97,0.4)',
            }}
          >
            {c.cta}
          </button>
        </div>

      </main>

      <PublicFooter />
    </div>
  )
}
