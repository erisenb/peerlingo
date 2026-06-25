import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

const EN = {
  title: 'Privacy Policy',
  updated: 'Last updated: June 2025',
  sections: [
    {
      heading: 'Information We Collect',
      body: 'We collect the following information when you create an account: name, email address, school affiliation, grade level, and profile information you choose to provide. We also collect session activity logs to facilitate the tutoring program.',
    },
    {
      heading: 'How We Use Your Information',
      body: 'Your information is used to: match students with volunteer tutors, facilitate video sessions and messaging, send session reminders and program updates, and improve the platform. We do NOT use your information for advertising or marketing to third parties.',
    },
    {
      heading: 'Information Sharing',
      body: "We do NOT sell, trade, or share your personal information with third parties for commercial purposes. We will never share your personal information with advertisers or data brokers. Limited sharing occurs only with: (a) Google, if you choose to sign in with Google (subject to Google's Privacy Policy); (b) service providers who help us operate the platform, under strict confidentiality agreements.",
    },
    {
      heading: 'Data Security',
      body: 'We use industry-standard security measures including encrypted HTTPS connections and secure password storage (bcrypt hashing). We make best commercial efforts to protect your personal data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.',
    },
    {
      heading: "Children's Privacy",
      body: "Users under the age of 13 must have parental or guardian consent. We do not knowingly collect personal information from children under 13 without parental consent. If you believe we have collected information from a child under 13 without consent, please contact us immediately and we will delete it.",
    },
    {
      heading: 'Data Retention',
      body: 'We retain your personal data while your account is active. You may request deletion of your account and all associated data at any time by contacting us through the Contact Us page. We will process deletion requests within 30 days.',
    },
    {
      heading: 'Contact',
      body: 'If you have questions about this Privacy Policy or how we handle your data, please reach out through our Contact Us page. We take privacy inquiries seriously and will respond within 24 hours.',
    },
  ],
}

const ES = {
  title: 'Política de Privacidad',
  updated: 'Última actualización: junio de 2025',
  sections: [
    {
      heading: 'Información que recopilamos',
      body: 'Recopilamos la siguiente información al crear una cuenta: nombre, correo electrónico, escuela, grado y la información de perfil que elijas proporcionar. También recopilamos registros de actividad de sesiones para facilitar el programa de tutoría.',
    },
    {
      heading: 'Cómo usamos tu información',
      body: 'Tu información se usa para: emparejar estudiantes con tutores voluntarios, facilitar videollamadas y mensajes, enviar recordatorios de sesiones y actualizaciones del programa, y mejorar la plataforma. NO usamos tu información para publicidad.',
    },
    {
      heading: 'Compartir información',
      body: 'NO vendemos, intercambiamos ni compartimos tu información personal con terceros con fines comerciales. Nunca compartiremos tu información con anunciantes o corredores de datos. El intercambio limitado ocurre solo con: (a) Google, si inicias sesión con Google (sujeto a la Política de privacidad de Google); (b) proveedores de servicios que nos ayudan a operar la plataforma, bajo acuerdos de confidencialidad estrictos.',
    },
    {
      heading: 'Seguridad de datos',
      body: 'Utilizamos medidas de seguridad estándar de la industria, incluidas conexiones HTTPS cifradas y almacenamiento seguro de contraseñas. Hacemos nuestro mejor esfuerzo comercial para proteger tus datos personales. Sin embargo, ningún método de transmisión por Internet es 100% seguro.',
    },
    {
      heading: 'Privacidad de menores',
      body: 'Los usuarios menores de 13 años deben tener el consentimiento de sus padres o tutores. No recopilamos conscientemente información personal de menores de 13 años sin consentimiento parental. Si crees que hemos recopilado información de un menor sin consentimiento, contáctanos de inmediato.',
    },
    {
      heading: 'Retención de datos',
      body: 'Conservamos tus datos personales mientras tu cuenta esté activa. Puedes solicitar la eliminación de tu cuenta y todos los datos asociados en cualquier momento a través de nuestra página de Contacto. Procesaremos las solicitudes de eliminación en un plazo de 30 días.',
    },
    {
      heading: 'Contacto',
      body: 'Si tienes preguntas sobre esta Política de Privacidad, contáctanos a través de nuestra página de Contacto. Tomamos en serio las consultas de privacidad y responderemos en 24 horas.',
    },
  ],
}

export default function PrivacyPolicy() {
  const { lang } = useLanguage()
  const content = lang === 'es' ? ES : EN
  return (
    <div style={{ background: '#F1F8F9', minHeight: '100vh', fontFamily: "'Times New Roman', Times, serif", color: '#0f2b3d', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />
      <div style={{ flex: 1, maxWidth: 780, margin: '0 auto', width: '100%', padding: '60px 24px 80px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0f2b3d', letterSpacing: '-1.5px', marginBottom: 8 }}>{content.title}</h1>
        <p style={{ color: '#7a9cac', fontSize: 13, marginBottom: 40 }}>{content.updated}</p>
        {content.sections.map(s => (
          <div key={s.heading} style={{ marginBottom: 32, background: '#FFFFFF', border: '1px solid rgba(0,128,128,0.12)', borderRadius: 16, padding: '24px 28px', boxShadow: '0 4px 16px rgba(0,128,128,0.07)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#008080', marginBottom: 12 }}>{s.heading}</h2>
            <p style={{ fontSize: 15, color: '#3d6275', lineHeight: 1.8, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>
      <PublicFooter />
    </div>
  )
}
