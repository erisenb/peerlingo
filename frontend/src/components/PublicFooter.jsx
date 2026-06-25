import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function PublicFooter() {
  const { t } = useLanguage()
  return (
    <footer style={{
      background: '#008080',
      borderTop: '1px solid rgba(0,128,128,0.3)',
      padding: '28px 48px',
      display: 'flex', flexWrap: 'wrap', gap: 16,
      alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
        © {new Date().getFullYear()} Virtual Peers · {t('footer.tagline')}
      </span>
      <div style={{ display: 'flex', gap: 20 }}>
        <Link to="/terms" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
        >{t('footer.terms')}</Link>
        <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
        >{t('footer.privacy')}</Link>
        <Link to="/contact" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
        >{t('footer.contact')}</Link>
      </div>
    </footer>
  )
}
