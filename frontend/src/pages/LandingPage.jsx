import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1758525861882-39151c7a9804?w=1400&q=80'

const ES_TESTIMONIALS = [
  { title: 'Vida Cambiada',      quote: 'Antes no podía decir ni "hello". Después de tres meses con mi tutor, puedo tener conversaciones completas en inglés. PeerLingo cambió mi vida.', name: 'Lucía M.' },
  { title: 'Cultura Americana',  quote: 'Mi tutor me enseñó cómo funciona la cultura universitaria en EE.UU. — las solicitudes, los clubs, el deporte. ¡Aprendí tanto fuera de las lecciones!', name: 'Diego P.' },
  { title: 'Plataforma Perfecta', quote: 'Pensé que la plataforma iba a ser difícil, pero fue facilísima. Desde el primer día pude ver mis tareas, escribirle a mi tutora y unirme a las reuniones.', name: 'Valentina C.' },
  { title: 'Tutora Increíble',   quote: 'Mi tutora siempre está disponible y se preocupa de verdad por mi progreso. Esta experiencia me dio confianza para hablar inglés con cualquier persona.', name: 'Sebastián V.' },
  { title: 'Sin Subtítulos',     quote: 'Ya entiendo películas y canciones en inglés sin subtítulos. ¡Jamás imaginé que iba a poder hacer eso tan rápido gracias a este programa!', name: 'Gabriela R.' },
  { title: 'Aprender Jugando',   quote: 'Lo que más me gusta es que puedo hacer preguntas sin vergüenza. Mi tutor es súper paciente y hace que aprender sea divertido. Se lo recomiendo a todos.', name: 'Camila T.' },
  { title: 'Ventana al Mundo',   quote: 'No solo mejoré mi inglés — también aprendí sobre la vida cotidiana en Nueva Jersey. Ahora siento que tengo una ventana abierta al mundo.', name: 'Andrés F.' },
]

const EN_TESTIMONIALS = [
  { title: 'New Perspective',    quote: 'Seeing how motivated my student is — with so much less access than I have — completely changed how I see the world. Most perspective-shifting thing I\'ve done.', name: 'Emma L.' },
  { title: 'More Than Hours',    quote: 'I needed community service hours for NHS, but this is the most meaningful thing I\'ve done. You\'re not just logging hours — you\'re changing someone\'s future.', name: 'Tyler R.' },
  { title: 'Unexpected Passion', quote: 'I never thought I\'d love tutoring, but watching my student go from broken sentences to full paragraphs makes me want to keep doing this way beyond any requirement.', name: 'Aiden K.' },
  { title: 'Goes Both Ways',     quote: 'My student taught me as much as I taught him. I learned about Peruvian food, holidays, and family life. I\'m the one who feels enriched — it genuinely goes both ways.', name: 'Sofia W.' },
  { title: 'Found a Calling',    quote: 'This made me realize I actually want to go into education. I signed up to tutor two more students. PeerLingo turned a checkbox into something I genuinely care about.', name: 'Marcus T.' },
  { title: 'Zero Friction',      quote: 'The platform is effortless — log in, check messages, video call. I spent zero time figuring it out and all my time actually tutoring. Couldn\'t be simpler.', name: 'Chloe N.' },
  { title: 'Best Service Ever',  quote: 'Best community service experience by far. You build empathy, patience, and communication skills all at once. My college essays practically wrote themselves afterward.', name: 'Jordan M.' },
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
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const width = useWindowWidth()
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024

  const [testimIdx, setTestimIdx] = useState(0)
  const [animKey, setAnimKey]     = useState(0)
  const autoTimer = useRef(null)

  const carouselCards = lang === 'es' ? ES_TESTIMONIALS : EN_TESTIMONIALS
  const visibleCount  = isMobile ? 1 : 3

  // Reset index when language switches
  useEffect(() => {
    setTestimIdx(0)
    setAnimKey(k => k + 1)
  }, [lang])

  // Mobile: auto-cycle every 4 s; clear on unmount or when isMobile flips off
  useEffect(() => {
    if (!isMobile) return
    autoTimer.current = setInterval(() => {
      setTestimIdx(i => (i + 1) % carouselCards.length)
      setAnimKey(k => k + 1)
    }, 4000)
    return () => clearInterval(autoTimer.current)
  }, [isMobile, lang])

  // Inject carousel fade keyframe once
  useEffect(() => {
    if (document.getElementById('vp-carousel-css')) return
    const el = document.createElement('style')
    el.id = 'vp-carousel-css'
    el.textContent = `@keyframes vp-cfade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`
    document.head.appendChild(el)
  }, [])

  // Auth redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'tutor') navigate('/tutor')
      else navigate('/student')
    }
  }, [user, navigate])

  function goNext() {
    setTestimIdx(i => (i + 1) % carouselCards.length)
    setAnimKey(k => k + 1)
  }
  function goPrev() {
    setTestimIdx(i => (i - 1 + carouselCards.length) % carouselCards.length)
    setAnimKey(k => k + 1)
  }

  const visibleCards = Array.from({ length: visibleCount }, (_, n) =>
    carouselCards[(testimIdx + n) % carouselCards.length]
  )

  const isEs = lang === 'es'
  const accent = '#008080'
  const splitLayout = !isMobile && !isTablet

  // Arrow button style helper
  function arrowBtn(disabled) {
    return {
      width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
      background: 'rgba(0,128,128,0.08)',
      border: '1px solid rgba(0,128,128,0.25)',
      color: disabled ? '#7a9cac' : '#008080',
      fontSize: 20, cursor: disabled ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.15s',
    }
  }

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", overflowX: 'hidden', background: '#F1F8F9' }}>

      <PublicNav transparent />

      {/* ── Hero ── */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundImage: `url(${HERO_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center center' }} />
        <div style={{ position: 'absolute', inset: 0, background: splitLayout ? 'linear-gradient(to right, rgba(160,211,232,0.96) 0%, rgba(160,211,232,0.88) 28%, rgba(160,211,232,0.45) 54%, rgba(160,211,232,0.04) 100%)' : 'linear-gradient(to bottom, rgba(160,211,232,0.88) 0%, rgba(160,211,232,0.7) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', padding: isMobile ? '100px 24px 64px' : isTablet ? '100px 40px 80px' : '88px 60px 80px' }}>

          {/* Badge */}
          <div style={{ marginBottom: isMobile ? 14 : 20 }}>
            <span style={{ fontSize: 13, color: '#3a3a3a', fontWeight: 700, letterSpacing: '0.3px' }}>{t('landing.badge')}</span>
          </div>

          {/* Headlines */}
          <div style={{ margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 4 }}>
            {[t('landing.headline1'), t('landing.headline2')].map((line, i) => {
              const [firstWord, ...rest] = line.split(' ')
              return (
                <div key={i}>
                  <span style={{ fontSize: isMobile ? 22 : 'clamp(24px, 2.8vw, 40px)', fontWeight: 600, color: '#3d6275', lineHeight: 1.2, letterSpacing: '-0.5px', display: 'block' }}>
                    <span style={{ color: '#FF6F61', fontWeight: 900 }}>{firstWord}</span>{rest.length ? ' ' + rest.join(' ') : ''}
                  </span>
                </div>
              )
            })}
            <div style={{ marginTop: isMobile ? 6 : 10 }}>
              <span style={{ fontSize: isMobile ? 44 : 'clamp(56px, 8.5vw, 118px)', fontWeight: 900, color: '#FF6F61', lineHeight: 1.0, letterSpacing: isMobile ? '-1.5px' : '-3px', display: 'block', whiteSpace: 'pre-wrap' }}>{t('landing.headline3')}</span>
              <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 400, color: '#3d6275', marginTop: isMobile ? 8 : 12, display: 'block', fontStyle: 'italic' }}>
                {lang === 'es' ? 'convirtiéndote en tutor en PeerLingo' : 'by becoming a tutor at PeerLingo'}
              </span>
            </div>
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

      {/* ── Testimonials ── */}
      <section style={{ padding: isMobile ? '64px 24px 56px' : '80px 40px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Heading */}
          <h2 style={{ textAlign: 'center', fontSize: isMobile ? 26 : 34, fontWeight: 900, color: '#0f2b3d', letterSpacing: '-0.5px', margin: '0 0 8px' }}>
            {isEs ? 'Lo que dicen nuestros estudiantes' : 'What our tutors are saying'}
          </h2>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 40 }}>
            <div style={{ display: 'inline-block', width: 48, height: 3, background: accent, borderRadius: 3 }} />
          </div>

          {/* Carousel row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 20 }}>

            {/* Left arrow */}
            <button
              onClick={goPrev}
              style={arrowBtn(false)}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,128,128,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,128,128,0.08)'}
              aria-label="Previous"
            >
              ‹
            </button>

            {/* Cards */}
            <div
              key={animKey}
              style={{
                flex: 1,
                display: 'flex',
                gap: 20,
                animation: 'vp-cfade 0.35s ease',
              }}
            >
              {visibleCards.map((card, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
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

                  {/* Name */}
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: accent,
                    borderTop: '1px solid rgba(0,128,128,0.12)',
                    paddingTop: 14,
                  }}>
                    — {card.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={goNext}
              style={arrowBtn(false)}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,128,128,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,128,128,0.08)'}
              aria-label="Next"
            >
              ›
            </button>

          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
            {carouselCards.map((_, i) => (
              <button
                key={i}
                onClick={() => { setTestimIdx(i); setAnimKey(k => k + 1) }}
                style={{
                  width: i === testimIdx ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === testimIdx ? accent : 'rgba(0,128,128,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.25s, background 0.25s',
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
