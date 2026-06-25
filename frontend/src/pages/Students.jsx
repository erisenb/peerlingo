import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

// ── Swap for real photos of Peruvian students ────────────────────────────────
const IMGS = [
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=85',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=85',
  'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=900&q=85',
]

const CONTENT = {
  en: {
    pageTitle: 'For Students',
    pageSubtitle: 'Students in Peru connect with volunteer tutors in New Jersey for live English lessons — real conversations, real friendships, completely free.',
    cta: 'Sign Up as a Student',
    cards: [
      {
        heading: 'Learn English',
        body: 'Improve your English with a dedicated tutor from New Jersey through real, live conversations.',
      },
      {
        heading: 'Gain Cultural Perspective',
        body: 'Work with tutors in the 🇺🇸 US who will share their culture, their experiences, and their world with you.',
      },
      {
        heading: 'Easy to Do',
        body: 'Done fully remotely, on your schedule. All you need is internet access.',
      },
    ],
  },
  es: {
    pageTitle: 'Para Estudiantes',
    pageSubtitle: 'Estudiantes en Perú se conectan con tutores voluntarios en Nueva Jersey para lecciones de inglés en vivo — conversaciones reales, amistades reales, completamente gratis.',
    cta: 'Regístrate como Estudiante',
    cards: [
      {
        heading: 'Aprende Inglés',
        body: 'Mejora tu inglés con un tutor dedicado de Nueva Jersey a través de conversaciones reales y en vivo.',
      },
      {
        heading: 'Perspectiva Cultural',
        body: 'Trabaja con tutores de 🇺🇸 EE.UU. que compartirán su cultura, sus experiencias y su mundo contigo.',
      },
      {
        heading: 'Fácil de Hacer',
        body: 'Completamente a distancia, a tu propio ritmo. Solo necesitas acceso a internet.',
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

export default function Students() {
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
            onClick={() => navigate('/register?role=student')}
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
