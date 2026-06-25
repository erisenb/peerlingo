import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

function useWindowWidth() {
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024))
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return width
}

const CONTENT = {
  en: {
    badge: 'Our Story',
    title: 'About PeerLingo',
    subtitle: 'Two communities. Two shared languages. A story still being written.',
    story: [
      'In the highlands and cities of Peru, there are adolescents who carry extraordinary ambition. They have grown up in underserved communities — places where access to quality education, resources, and economic opportunity is limited not by lack of drive, but by circumstance. And yet they study. They show up. They dream in a language they are still learning.',
      'English, for many of them, is not just a subject. It is a door. A path toward university, toward careers, toward a future that feels possible in a way it did not before. But practicing English takes more than a workbook. It takes conversation. It takes someone on the other side who listens, corrects, encourages, and comes back next week.',
      'PeerLingo was built around a simple idea: somewhere in New Jersey, there is a bilingual student or young adult who has time, warmth, and something real to share. And somewhere in Peru, there is a student who could change the entire trajectory of their life if they had someone to practice with.',
      'We connect those two people. Through live video sessions, guided lesson plans, and genuine human connection, we make the distance between those two worlds feel very small. Tutors volunteer their time and bring their language, their culture, and their presence. Students bring their courage and their hunger to learn.',
      'What happens between them — that is the story we are still writing, one session at a time.',
    ],
    studentHeader: 'For Students',
    mentorHeader: 'For Tutors',
    studentBenefits: [
      { icon: '🗣️', title: 'English From a Real Speaker', body: 'Students practice conversational English with a bilingual American tutor — not a textbook. Real language, real pronunciation, real confidence.' },
      { icon: '🇺🇸', title: 'A Window Into American Culture', body: 'Beyond grammar and vocabulary, students gain insight into American life, customs, and values — context that makes English more meaningful and motivating.' },
      { icon: '🤝', title: 'A Tutor Who Genuinely Cares', body: 'Each student is paired with someone who shows up for them — offering encouragement, consistency, and the message that their future matters to people far beyond their hometown.' },
    ],
    mentorBenefits: [
      { icon: '📋', title: 'Community Service Hours', body: 'Every session counts toward verified community service hours — meaningful credit for high school, college applications, and beyond.' },
      { icon: '🌍', title: 'Real Cultural Perspective', body: 'Connecting one-on-one with a student in Peru offers a depth of cross-cultural understanding that no classroom or local volunteering opportunity can replicate.' },
      { icon: '💡', title: 'Personal Growth That Lasts', body: 'Volunteers consistently describe the experience as transformative — learning as much from their students as they teach, and building friendships that cross borders.' },
    ],
    ctaHeading: 'Ready to be part of the story?',
    ctaSub: 'Whether you\'re a student or a volunteer, your seat at the table is waiting.',
    ctaTutor: 'Join as a Tutor',
    ctaStudent: 'Join as a Student',
  },
  es: {
    badge: 'Nuestra historia',
    title: 'Sobre PeerLingo',
    subtitle: 'Dos comunidades. Dos idiomas compartidos. Una historia que todavía se está escribiendo.',
    story: [
      'En las ciudades y regiones de Perú, hay adolescentes con una ambición extraordinaria. Han crecido en comunidades con recursos limitados — lugares donde el acceso a una educación de calidad y a oportunidades económicas es escaso, no por falta de esfuerzo, sino por sus circunstancias. Aun así estudian. Se presentan. Sueñan en un idioma que todavía están aprendiendo.',
      'El inglés, para muchos de ellos, no es solo una materia. Es una puerta. Un camino hacia la universidad, hacia carreras profesionales, hacia un futuro que se siente posible de una manera en que antes no lo era. Pero practicar inglés requiere más que un libro de trabajo. Requiere conversación. Requiere a alguien al otro lado que escuche, corrija, anime y regrese la semana siguiente.',
      'PeerLingo fue creado alrededor de una idea simple: en algún lugar de Nueva Jersey, hay un estudiante o joven bilingüe que tiene tiempo, calidez y algo real que compartir. Y en algún lugar de Perú, hay un estudiante cuya vida podría cambiar por completo si tuviera a alguien con quien practicar.',
      'Conectamos a esas dos personas. A través de sesiones de video en vivo, planes de lecciones guiadas y una conexión humana genuina, hacemos que la distancia entre esos dos mundos se sienta muy pequeña. Los tutores ofrecen su tiempo y aportan su idioma, su cultura y su presencia. Los estudiantes aportan su valentía y sus ganas de aprender.',
      'Lo que sucede entre ellos — esa es la historia que todavía estamos escribiendo, una sesión a la vez.',
    ],
    studentHeader: 'Para estudiantes',
    mentorHeader: 'Para tutores',
    studentBenefits: [
      { icon: '🗣️', title: 'Inglés con un hablante nativo', body: 'Los estudiantes practican inglés conversacional con un tutor americano bilingüe — no con un libro de texto. Idioma real, pronunciación real, confianza real.' },
      { icon: '🇺🇸', title: 'Una ventana a la cultura americana', body: 'Más allá de la gramática y el vocabulario, los estudiantes conocen la vida, las costumbres y los valores americanos — contexto que hace que el inglés sea más significativo y motivador.' },
      { icon: '🤝', title: 'Un tutor que realmente se preocupa', body: 'Cada estudiante es emparejado con alguien que se compromete con ellos — ofreciendo aliento, consistencia y el mensaje de que su futuro importa para personas mucho más allá de su ciudad natal.' },
    ],
    mentorBenefits: [
      { icon: '📋', title: 'Horas de servicio comunitario', body: 'Cada sesión cuenta como horas de servicio comunitario verificadas — crédito valioso para la preparatoria, solicitudes universitarias y más allá.' },
      { icon: '🌍', title: 'Perspectiva cultural real', body: 'Conectar uno a uno con un estudiante en Perú ofrece una profundidad de comprensión intercultural que ningún salón de clases ni oportunidad de voluntariado local puede replicar.' },
      { icon: '💡', title: 'Crecimiento personal duradero', body: 'Los voluntarios describen constantemente la experiencia como transformadora — aprendiendo tanto de sus estudiantes como lo que enseñan, y construyendo amistades que cruzan fronteras.' },
    ],
    ctaHeading: '¿Listo para ser parte de la historia?',
    ctaSub: 'Ya seas estudiante o voluntario, tu lugar está esperando.',
    ctaTutor: 'Únete como tutor',
    ctaStudent: 'Únete como estudiante',
  },
}

export default function AboutUs() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const { user } = useAuth()
  const width = useWindowWidth()
  const isMobile = width < 768
  const c = CONTENT[lang] || CONTENT.en

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>

      <PublicNav />

      <div style={{ flex: 1, maxWidth: 860, margin: '0 auto', padding: isMobile ? '32px 24px 64px' : '44px 32px 80px', width: '100%' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 48 }}>
          <h1 style={{ fontSize: isMobile ? 34 : 48, fontWeight: 900, color: '#0f2b3d', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
            {c.title}
          </h1>
          <p style={{ fontSize: isMobile ? 16 : 18, color: '#5a8090', lineHeight: 1.7 }}>
            {c.subtitle}
          </p>
        </div>

        {/* ── Story ── */}
        <div style={{
          background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.12)',
          borderRadius: 20, padding: isMobile ? '28px 24px' : '44px 52px',
          marginBottom: isMobile ? 40 : 56,
          lineHeight: 1.85, fontSize: isMobile ? 15 : 16.5, color: '#3d6275',
          boxShadow: '0 4px 20px rgba(0,128,128,0.08)',
        }}>
          {c.story.map((para, i) => (
            <p key={i} style={{ marginBottom: i < c.story.length - 1 ? 22 : 0 }}>{para}</p>
          ))}
        </div>

        {/* ── Benefits ── */}
        {isMobile ? (
          // Mobile: two stacked sections
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <BenefitColumn header={c.studentHeader} flag="🇵🇪" benefits={c.studentBenefits} cardStyle={studentCard} titleColor="#008080" isMobile />
            <BenefitColumn header={c.mentorHeader} flag="🇺🇸" benefits={c.mentorBenefits} cardStyle={mentorCard} titleColor="#008080" isMobile />
          </div>
        ) : (
          // Desktop: flat 2-column grid so paired cards share row height
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Column headers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>🇵🇪</span>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f2b3d', margin: 0 }}>{c.studentHeader}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>🇺🇸</span>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f2b3d', margin: 0 }}>{c.mentorHeader}</h2>
            </div>
            {/* Paired cards — same grid row → same height via align-items: stretch */}
            {c.studentBenefits.map((sb, i) => {
              const mb = c.mentorBenefits[i]
              return [
                <div key={`s${i}`} style={{ ...studentCard, height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{sb.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#008080' }}>{sb.title}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#3d6275', lineHeight: 1.7, margin: 0 }}>{sb.body}</p>
                </div>,
                <div key={`m${i}`} style={{ ...mentorCard, height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{mb.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#008080' }}>{mb.title}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#3d6275', lineHeight: 1.7, margin: 0 }}>{mb.body}</p>
                </div>,
              ]
            })}
          </div>
        )}

        {/* ── CTA — only for logged-out visitors ── */}
        {!user && (
          <div style={{
            marginTop: isMobile ? 48 : 64, textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(255,111,97,0.1), rgba(0,128,128,0.08))',
            border: '1px solid rgba(0,128,128,0.18)',
            borderRadius: 20, padding: isMobile ? '32px 24px' : '44px 40px',
          }}>
            <h3 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, color: '#0f2b3d', marginBottom: 12, letterSpacing: '-0.5px' }}>
              {c.ctaHeading}
            </h3>
            <p style={{ fontSize: 15, color: '#5a8090', marginBottom: 28, lineHeight: 1.6 }}>
              {c.ctaSub}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register?role=tutor')}
                style={{ background: '#FF6F61', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 30px', fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 24px rgba(255,111,97,0.35)', transition: 'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >{c.ctaTutor}</button>
              <button onClick={() => navigate('/register?role=student')}
                style={{ background: '#FFFFFF', color: '#008080', border: '1px solid rgba(0,128,128,0.25)', borderRadius: 12, padding: '14px 30px', fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: 'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >{c.ctaStudent}</button>
            </div>
          </div>
        )}

      </div>

      <PublicFooter />
    </div>
  )
}

function BenefitColumn({ header, flag, benefits, cardStyle, titleColor, isMobile }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 24 }}>{flag}</span>
        <h2 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 800, color: '#0f2b3d', margin: 0 }}>{header}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {benefits.map(b => (
          <div key={b.title} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{b.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: titleColor }}>{b.title}</span>
            </div>
            <p style={{ fontSize: 14, color: '#3d6275', lineHeight: 1.7, margin: 0 }}>{b.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const studentCard = { background: 'rgba(160,211,232,0.2)', border: '1px solid rgba(160,211,232,0.6)', borderRadius: 14, padding: '20px 22px' }
const mentorCard  = { background: 'rgba(0,128,128,0.07)', border: '1px solid rgba(0,128,128,0.2)', borderRadius: 14, padding: '20px 22px' }
