import { useLanguage } from '../context/LanguageContext'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

const EN = {
  title: 'Terms of Use',
  updated: 'Last updated: June 2025',
  sections: [
    {
      heading: 'User-Generated Content',
      body: 'Virtual Peers is a platform that enables peer-to-peer communication between students and volunteer tutors. We are not responsible for any content posted, shared, or transmitted by users of the platform. Users assume full responsibility for the content they create and share.',
    },
    {
      heading: 'Platform Safety',
      body: 'We make best commercial efforts to maintain a safe and respectful learning environment. This includes community guidelines, reporting tools, and moderation measures. However, we cannot guarantee that the platform will be free from all inappropriate content or conduct. We encourage users to report any violations.',
    },
    {
      heading: 'Appropriate Use',
      body: 'By using Virtual Peers, you agree to use the platform exclusively for educational and tutoring purposes. Harassment, bullying, sharing of inappropriate content, or any conduct that disrupts the learning environment is strictly prohibited and may result in account termination.',
    },
    {
      heading: 'Minors',
      body: "Users under the age of 13 must have parental or guardian consent prior to creating an account. Parents and guardians are encouraged to supervise their children's use of the platform.",
    },
    {
      heading: 'Changes to These Terms',
      body: 'We reserve the right to update these Terms of Use at any time. Continued use of the platform after changes are posted constitutes acceptance of the updated terms. We will make reasonable efforts to notify users of significant changes.',
    },
  ],
}

const ES = {
  title: 'Términos de Uso',
  updated: 'Última actualización: junio de 2025',
  sections: [
    {
      heading: 'Contenido generado por el usuario',
      body: 'Virtual Peers es una plataforma que facilita la comunicación entre estudiantes y tutores voluntarios. No somos responsables del contenido publicado, compartido o transmitido por los usuarios. Los usuarios asumen plena responsabilidad por el contenido que crean y comparten.',
    },
    {
      heading: 'Seguridad en la plataforma',
      body: 'Hacemos nuestro mejor esfuerzo comercial para mantener un entorno de aprendizaje seguro y respetuoso. Esto incluye pautas comunitarias, herramientas de reporte y medidas de moderación. Sin embargo, no podemos garantizar que la plataforma esté libre de todo contenido o conducta inapropiados.',
    },
    {
      heading: 'Uso apropiado',
      body: 'Al usar Virtual Peers, aceptas utilizar la plataforma exclusivamente con fines educativos y de tutoría. El acoso, intimidación, compartir contenido inapropiado o cualquier conducta que perturbe el entorno de aprendizaje está estrictamente prohibida.',
    },
    {
      heading: 'Menores de edad',
      body: 'Los usuarios menores de 13 años deben contar con el consentimiento de sus padres o tutores antes de crear una cuenta. Se alienta a padres y tutores a supervisar el uso de la plataforma por parte de sus hijos.',
    },
    {
      heading: 'Cambios en estos términos',
      body: 'Nos reservamos el derecho de actualizar estos Términos de Uso en cualquier momento. El uso continuado de la plataforma después de publicar los cambios constituye la aceptación de los términos actualizados.',
    },
  ],
}

export default function TermsOfUse() {
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
