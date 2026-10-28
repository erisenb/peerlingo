import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1758525861882-39151c7a9804?w=1400&q=80'

const TESTIMONIALS = [
  { title: 'Proud of Our Mission', quote: 'When I started PeerLingo, I hoped to connect a handful of students across two countries. Seeing it grow into a community of dedicated tutors and eager learners is what I\'m proudest of, and we\'re only getting started.', name: 'Ethan I.', role: 'Founder & CEO' },
  { title: 'Growing Together',     quote: 'Watching our website bring in new tutors and students every week has been incredibly rewarding. But my favorite part is still my own sessions. Nothing beats seeing my student light up when something finally clicks.', name: 'Divya J.', role: 'Chief Marketing Officer' },
  { title: 'Learning That Sticks', quote: 'The curriculum is so hands on and interactive that every session feels like a conversation, not a lecture. I could see my student improving week after week because the lessons actually work.', name: 'Liam I.', role: 'Tutor' },
  { title: 'Guided Every Step',    quote: 'I\'m only a beginner in Spanish, so I was nervous at first. The tutor guides in every lesson made it easy to teach with confidence. I never felt lost, and neither did my student.', name: 'Isobel A.', role: 'Tutor' },
]

function useWindowWidth() {
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024))
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return width
}

export default function LandingPage() {
  const { user } = useAuth()
  const { t, lang, setLang } = useLanguage()
  const navigate = useNavigate()
  const width = useWindowWidth()
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024

  // Auth redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'tutor') navigate('/tutor')
      else navigate('/student')
    }
  }, [user, navigate])

  const isEs = lang === 'es'
  const accent = '#008080'
  const splitLayout = !isMobile && !isTablet

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", overflowX: 'hidden', background: '#F1F8F9' }}>

      <PublicNav transparent />

      {/* ── Hero ── */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundImage: `url(${HERO_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center center' }} />
        <div style={{ position: 'absolute', inset: 0, background: splitLayout ? 'linear-gradient(to right, rgba(160,211,232,0.96) 0%, rgba(160,211,232,0.88) 28%, rgba(160,211,232,0.45) 54%, rgba(160,211,232,0.04) 100%)' : 'linear-gradient(to bottom, rgba(160,211,232,0.88) 0%, rgba(160,211,232,0.7) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', padding: isMobile ? '100px 24px 64px' : isTablet ? '100px 40px 80px' : '88px 60px 80px' }}>

          {/* Headlines */}
          <div style={{ margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 4 }}>
            {[t('landing.headline1'), t('landing.headline2'), t('landing.headline3')].filter(Boolean).map((line, i) => (
              <span key={i} style={{ fontFamily: "'Trebuchet MS', sans-serif", fontSize: isMobile ? 44 : 'clamp(56px, 8.5vw, 118px)', fontWeight: 900, color: '#000', lineHeight: 1.0, letterSpacing: isMobile ? '-1.5px' : '-3px', display: 'block' }}>
                {line}
              </span>
            ))}
            <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 400, color: '#3d6275', marginTop: isMobile ? 10 : 14, display: 'block', fontStyle: 'italic' }}>
              {lang === 'es' ? 'convirtiéndote en tutor en PeerLingo' : 'by becoming a tutor at PeerLingo'}
            </span>
          </div>

          {/* Sub-content constrained to left column */}
          <div style={{ maxWidth: 540 }}>
            <p style={{ fontSize: isMobile ? 16 : 18, color: '#3d6275', lineHeight: 1.75, margin: '0 0 36px' }}>
              {t('landing.description')}
            </p>

            <div style={{ display: 'flex', gap: isMobile ? 20 : 36, marginBottom: 40, flexWrap: 'wrap' }}>
              {[
                [t('landing.stat1.num'), t('landing.stat1.label')],
                [t('landing.stat2.num'), t('landing.stat2.label')],
                [t('landing.stat3.num'), t('landing.stat3.label')],
              ].map(([num, label]) => (
                <div key={num}>
                  <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 900, color: '#0f2b3d', letterSpacing: '-0.5px' }}>{num}</div>
                  <div style={{ fontSize: 11, color: '#7a9cac', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register?role=tutor')}
                style={{ background: '#FF6F61', color: '#fff', border: 'none', borderRadius: 12, padding: isMobile ? '14px 22px' : '16px 28px', fontSize: isMobile ? 14 : 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 28px rgba(255,111,97,0.4)', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(255,111,97,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,111,97,0.4)' }}
              >{t('landing.cta.volunteer')}</button>

              <button onClick={() => navigate('/register?role=student')}
                style={{ background: 'rgba(0,128,128,0.08)', color: '#008080', border: '2px solid rgba(0,128,128,0.28)', borderRadius: 12, padding: isMobile ? '14px 22px' : '16px 28px', fontSize: isMobile ? 14 : 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(8px)', transition: 'transform 0.15s, background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(0,128,128,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(0,128,128,0.08)' }}
              >{t('landing.cta.student')}</button>
            </div>
          </div>

        </div>
      </section>

      {/* ── Testimonials (English only; Spanish version will get its own content) ── */}
      {!isEs && (
      <section style={{ padding: isMobile ? '64px 24px 56px' : '80px 40px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Heading */}
          <h2 style={{ textAlign: 'center', fontSize: isMobile ? 26 : 34, fontWeight: 900, color: '#0f2b3d', letterSpacing: '-0.5px', margin: '0 0 8px' }}>
            What our tutors are saying
          </h2>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 40 }}>
            <div style={{ display: 'inline-block', width: 48, height: 3, background: accent, borderRadius: 3 }} />
          </div>

          {/* Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: 20,
          }}>
            {TESTIMONIALS.map(card => (
              <div
                key={card.name}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,128,128,0.18)',
                  borderRadius: 16,
                  padding: '28px 24px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  minWidth: 0,
                  boxShadow: '0 4px 20px rgba(0,128,128,0.08)',
                }}
              >
                {/* Title */}
                <div style={{
                  fontSize: 11, fontWeight: 800,
                  color: accent,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}>
                  {card.title}
                </div>

                {/* Quote body */}
                <p style={{ fontSize: 15, color: '#3d6275', lineHeight: 1.7, margin: 0, flex: 1 }}>
                  {card.quote}
                </p>

                {/* Name + role */}
                <div style={{ borderTop: '1px solid rgba(0,128,128,0.12)', paddingTop: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: accent }}>— {card.name}</div>
                  <div style={{ fontSize: 12, color: '#7a9cac', marginTop: 3 }}>{card.role}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      )}

      <PublicFooter />

      {/* Fixed bottom-right language prompt button */}
      <button
        onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
        style={{
          position: 'fixed', bottom: 28, right: 24, zIndex: 1000,
          background: lang === 'en' ? '#008080' : '#FF6F61',
          color: '#fff', border: 'none', borderRadius: 28,
          padding: '24px 36px', fontSize: 26, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          maxWidth: isMobile ? 208 : 256, textAlign: 'center', lineHeight: 1.4,
        }}
      >
        {lang === 'en' ? '¿Estudiante? ¡Presiona aquí!' : 'Tutor? Go here!'}
      </button>
    </div>
  )
}
