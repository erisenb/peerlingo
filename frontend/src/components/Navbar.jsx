import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import Logo from './Logo'

const TEAL = '#008080'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const roleLabel = user?.role === 'admin' ? '🛠️ Admin' : user?.role === 'tutor' ? '🎓 Tutor' : '⭐ Student'
  const roleColor = user?.role === 'admin' ? '#008080' : user?.role === 'tutor' ? '#008080' : '#FF6F61'

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid rgba(0,128,128,0.2)',
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,128,128,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => navigate('/')}>
        <Logo height={44} />
        <span style={{ fontSize: 18, fontWeight: 900, color: TEAL, fontFamily: 'Pacifico, cursive' }}>Virtual Peers</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {user && (
          <>
            <span style={{
              background: roleColor + '18', color: roleColor,
              borderRadius: 20, padding: '4px 12px',
              fontSize: 12, fontWeight: 800,
            }}>{roleLabel}</span>
            <button
              onClick={() => navigate('/dashboard/profile')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, padding: 0,
              }}
            >
              {user.has_photo ? (
                <img
                  src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/api/users/${user.id}/photo`}
                  alt=""
                  style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${roleColor}` }}
                />
              ) : (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: roleColor + '22', border: `2px solid ${roleColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 900, color: roleColor,
                }}>{user.full_name?.[0]?.toUpperCase()}</div>
              )}
              <span style={{ fontSize: 14, color: '#3d6275', fontWeight: 600 }}>
                {user.full_name}
              </span>
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: 'none', border: '1.5px solid rgba(0,128,128,0.25)',
                borderRadius: 8, padding: '6px 14px',
                fontSize: 13, fontWeight: 700, color: '#3d6275',
                cursor: 'pointer',
              }}
            >{t('nav.signOut')}</button>
          </>
        )}
      </div>
    </nav>
  )
}
