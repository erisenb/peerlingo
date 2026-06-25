import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

const CONTENT = {
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about PeerLingo.',
    tab: { students: 'Students', mentors: 'Tutors / Volunteers' },
    students: [
      {
        q: 'Is PeerLingo completely free?',
        a: 'Yes — 100% free for students. There are no fees, no subscriptions, and no hidden costs of any kind.',
      },
      {
        q: 'Do I need to speak English before joining?',
        a: 'Not at all. Beginners are fully welcome. Your tutor will work at your level and help you build confidence step by step.',
      },
      {
        q: 'How will I be matched with a tutor?',
        a: 'Our team reviews your profile, grade level, and availability to find the best match. You\'ll be notified once you\'re paired — usually within a few days.',
      },
      {
        q: 'How often will I meet with my tutor?',
        a: 'Most pairs meet once a week for 45–60 minutes. You and your tutor can agree on a schedule that works for both of you.',
      },
      {
        q: 'What technology do I need?',
        a: 'A smartphone, tablet, or computer with internet access is all you need. Sessions happen via video call through the platform.',
      },
      {
        q: 'Will I have homework between sessions?',
        a: 'Yes — the program administrator posts short practice assignments to help you reinforce what you\'ve learned. They\'re designed to be manageable and meaningful.',
      },
      {
        q: 'What language are sessions taught in?',
        a: 'Sessions are conducted in English, which is the whole point. But your tutor speaks both English and Spanish, so they can step in when you need a little extra help.',
      },
      {
        q: 'What if I\'m not comfortable with my tutor?',
        a: 'Your wellbeing is our priority. Reach out through the Contact page and we\'ll work to find you a better match right away.',
      },
      {
        q: 'Can I join if I\'m not currently in school?',
        a: 'Yes. While many students are in secondary school, the program is open to young adults in Peru who want to improve their English for work or further study.',
      },
    ],
    mentors: [
      {
        q: 'What are the requirements to volunteer?',
        a: 'You should be bilingual in English and Spanish, at least in high school, and have reliable internet access. No formal teaching experience is required — just enthusiasm and consistency.',
      },
      {
        q: 'How much time does volunteering take?',
        a: 'Plan for about 1–2 hours per week: one video session plus a few minutes of preparation. Most volunteers find it easy to fit around school or other activities.',
      },
      {
        q: 'Will I receive community service credit?',
        a: 'Yes. After completing a semester of sessions, you\'ll receive an official signed letter verifying your community service hours, which is accepted by most schools and useful for college applications.',
      },
      {
        q: 'Do I need to plan my own lesson content?',
        a: 'No. An administrator posts assignments and curriculum materials before each session. Your job is to guide conversation and help the student practice — not to plan lessons from scratch.',
      },
      {
        q: 'How am I matched with a student?',
        a: 'The admin team matches you based on your availability, the student\'s grade level, and any preferences you note in your profile.',
      },
      {
        q: 'How do the video sessions work?',
        a: 'You\'ll see your upcoming sessions on your tutor dashboard, each with the student\'s name and a button to start the video call directly through PeerLingo.',
      },
      {
        q: 'Is there any training or orientation?',
        a: 'Yes. Before your first session you\'ll receive an orientation guide and access to materials that explain how to tutor English learners effectively.',
      },
      {
        q: 'What if a student stops showing up?',
        a: 'Let the admin team know through the Contact page. We\'ll follow up with the student and help resolve the situation, or re-match you if needed.',
      },
      {
        q: 'Can I volunteer from outside New Jersey?',
        a: 'Currently the program focuses on connecting NJ volunteers with students in Peru. We hope to expand to other regions in the future — stay tuned.',
      },
    ],
  },
  es: {
    title: 'Preguntas Frecuentes',
    subtitle: 'Todo lo que necesitas saber sobre PeerLingo.',
    tab: { students: 'Estudiantes', mentors: 'Tutores / Voluntarios' },
    students: [
      {
        q: '¿PeerLingo es completamente gratuito?',
        a: 'Sí — 100% gratuito para estudiantes. No hay tarifas, suscripciones ni costos ocultos de ningún tipo.',
      },
      {
        q: '¿Necesito saber inglés antes de unirme?',
        a: 'Para nada. Los principiantes son completamente bienvenidos. Tu tutor trabajará a tu nivel y te ayudará a ganar confianza paso a paso.',
      },
      {
        q: '¿Cómo me asignarán un tutor?',
        a: 'Nuestro equipo revisa tu perfil, grado escolar y disponibilidad para encontrar la mejor pareja. Te notificaremos una vez que estés emparejado, generalmente en pocos días.',
      },
      {
        q: '¿Con qué frecuencia me reuniré con mi tutor?',
        a: 'La mayoría de las parejas se reúnen una vez a la semana durante 45–60 minutos. Tú y tu tutor pueden acordar el horario que mejor funcione para ambos.',
      },
      {
        q: '¿Qué tecnología necesito?',
        a: 'Solo necesitas un teléfono, tableta o computadora con acceso a internet. Las sesiones se realizan por videollamada directamente en la plataforma.',
      },
      {
        q: '¿Tendré tareas entre sesiones?',
        a: 'Sí — el administrador del programa publica tareas cortas de práctica para ayudarte a reforzar lo aprendido. Están diseñadas para ser manejables y significativas.',
      },
      {
        q: '¿En qué idioma se dan las clases?',
        a: 'Las sesiones se realizan en inglés — ese es el objetivo. Pero tu tutor habla inglés y español, así que puede ayudarte cuando lo necesites.',
      },
      {
        q: '¿Qué pasa si no me siento cómodo/a con mi tutor?',
        a: 'Tu bienestar es nuestra prioridad. Contáctanos a través de la página de Contacto y trabajaremos para encontrarte una mejor pareja de inmediato.',
      },
      {
        q: '¿Puedo unirme si no estoy en la escuela actualmente?',
        a: 'Sí. Aunque muchos participantes son estudiantes de secundaria, el programa está abierto a jóvenes adultos en Perú que quieran mejorar su inglés para el trabajo o estudios futuros.',
      },
    ],
    mentors: [
      {
        q: '¿Cuáles son los requisitos para ser voluntario?',
        a: 'Debes ser bilingüe (inglés y español), estar al menos en la preparatoria y tener acceso confiable a internet. No se requiere experiencia docente formal.',
      },
      {
        q: '¿Cuánto tiempo toma ser voluntario?',
        a: 'Planifica alrededor de 1–2 horas a la semana: una sesión de video más algunos minutos de preparación. La mayoría de los voluntarios lo encajan fácilmente con la escuela u otras actividades.',
      },
      {
        q: '¿Recibiré crédito de servicio comunitario?',
        a: 'Sí. Al completar un semestre de sesiones, recibirás una carta oficial firmada que certifica tus horas de servicio comunitario, aceptada por la mayoría de las escuelas y útil para solicitudes universitarias.',
      },
      {
        q: '¿Tengo que planear el contenido de mis lecciones?',
        a: 'No. Un administrador publica tareas y materiales de currículo antes de cada sesión. Tu trabajo es guiar la conversación y ayudar al estudiante a practicar, no planear lecciones desde cero.',
      },
      {
        q: '¿Cómo me asignan un estudiante?',
        a: 'El equipo administrativo te empareja según tu disponibilidad, el nivel escolar del estudiante y las preferencias que indiques en tu perfil.',
      },
      {
        q: '¿Cómo funcionan las sesiones de video?',
        a: 'Verás tus próximas sesiones en tu panel de tutor, cada una con el nombre del estudiante y un botón para iniciar la videollamada directamente en PeerLingo.',
      },
      {
        q: '¿Hay alguna capacitación u orientación?',
        a: 'Sí. Antes de tu primera sesión recibirás una guía de orientación y acceso a materiales que explican cómo ser un tutor efectivo para estudiantes de inglés.',
      },
      {
        q: '¿Qué pasa si un estudiante deja de presentarse?',
        a: 'Avísanos a través de la página de Contacto. Haremos seguimiento con el estudiante y ayudaremos a resolver la situación, o te reasignaremos si es necesario.',
      },
      {
        q: '¿Puedo ser voluntario desde fuera de Nueva Jersey?',
        a: 'Actualmente el programa se enfoca en conectar voluntarios de NJ con estudiantes en Perú. Esperamos expandirnos a otras regiones en el futuro.',
      },
    ],
  },
}

function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1024)
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(0,128,128,0.12)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: '20px 0', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: isOpen ? '#FF6F61' : '#0f2b3d', lineHeight: 1.5, flex: 1, transition: 'color 0.15s' }}>
          {question}
        </span>
        <span style={{
          flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
          background: isOpen ? '#FF6F61' : 'rgba(0,128,128,0.08)',
          border: `1px solid ${isOpen ? '#FF6F61' : 'rgba(0,128,128,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: isOpen ? '#fff' : '#008080',
          transition: 'background 0.15s, transform 0.2s',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          marginTop: 1,
        }}>+</span>
      </button>
      {isOpen && (
        <div style={{ paddingBottom: 20, paddingRight: 40 }}>
          <p style={{ margin: 0, fontSize: 15, color: '#3d6275', lineHeight: 1.75 }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const { lang } = useLanguage()
  const { user } = useAuth()
  const width = useWindowWidth()
  const isMobile = width < 768
  const c = CONTENT[lang] || CONTENT.en

  const [tab, setTab] = useState('students')
  const [openKey, setOpenKey] = useState(null)

  useEffect(() => {
    // Logged-in students always see the student tab; everyone else follows language default
    if (user?.role === 'student') {
      setTab('students')
    } else {
      setTab(lang === 'es' ? 'students' : 'mentors')
    }
    setOpenKey(null)
  }, [lang, user?.role])

  function handleToggle(key) {
    setOpenKey(prev => prev === key ? null : key)
  }

  const items = tab === 'students' ? c.students : c.mentors

  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      <div style={{ flex: 1, maxWidth: 760, margin: '0 auto', width: '100%', padding: isMobile ? '48px 24px 80px' : '72px 32px 100px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 52 }}>
          <h1 style={{ fontSize: isMobile ? 34 : 48, fontWeight: 900, color: '#0f2b3d', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 14 }}>
            {c.title}
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 17, color: '#7a9cac', lineHeight: 1.6 }}>
            {c.subtitle}
          </p>
        </div>

        {/* Tab switcher — identical style to HowItWorksPage */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? 36 : 48 }}>
          <div style={{
            display: 'inline-flex', background: 'rgba(0,128,128,0.06)',
            borderRadius: 18, padding: 6, border: '1px solid rgba(0,128,128,0.15)', gap: 4,
          }}>
            {(['students', 'mentors'] ).map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setOpenKey(null) }}
                style={{
                  background: tab === key ? '#FF6F61' : 'transparent',
                  color: tab === key ? '#fff' : '#7a9cac',
                  border: 'none', borderRadius: 13,
                  padding: isMobile ? '12px 22px' : '14px 36px',
                  fontSize: isMobile ? 14 : 15, fontWeight: 800, cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: tab === key ? '0 4px 20px rgba(255,111,97,0.4)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.tab[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.12)', borderRadius: 20, padding: isMobile ? '0 20px' : '0 36px', boxShadow: '0 4px 20px rgba(0,128,128,0.08)' }}>
          {items.map((item, i) => {
            const key = `${tab}-${i}`
            return (
              <AccordionItem
                key={key}
                question={item.q}
                answer={item.a}
                isOpen={openKey === key}
                onToggle={() => handleToggle(key)}
              />
            )
          })}
        </div>

      </div>

      <PublicFooter />
    </div>
  )
}
