import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import Logo from './Logo'

function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1024)
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

export default function PublicNav({ transparent = false }) {
  const { lang, setLang, t } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const width = useWindowWidth()
  const isMobile = width < 768
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!transparent) return
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [transparent])

  useEffect(() => { if (!isMobile) setMenuOpen(false) }, [isMobile])

  const opaque = !transparent || scrolled || menuOpen

  const navLinks = user?.role === 'student'
    ? [
        { label: t('nav.home'),       to: '/' },
        { label: t('nav.about'),      to: '/about' },
        { label: t('nav.howItWorks'), to: '/how-it-works' },
        { label: t('nav.curriculum'), to: '/curriculum' },
        { label: t('nav.faq'),        to: '/faq' },
        { label: t('nav.contact'),    to: '/contact' },
        { label: t('nav.dashboard'),  to: '/dashboard/student' },
      ]
    : [
        { label: t('nav.home'),        to: '/' },
        { label: t('nav.about'),       to: '/about' },
        { label: t('nav.howItWorks'),  to: '/how-it-works' },
        { label: t('nav.curriculum'),  to: '/curriculum' },
        { label: t('nav.students'),    to: '/students' },
        { label: t('nav.instructors'), to: '/instructors' },
        { label: t('nav.faq'),         to: '/faq' },
        { label: t('nav.contact'),     to: '/contact' },
      ]

  const navStyle = {
    position: transparent ? 'fixed' : 'sticky',
    top: 0, left: 0, right: 0, zIndex: 200,
    padding: isMobile ? '14px 20px' : '0 48px',
    height: isMobile ? 'auto' : 68,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: opaque ? 'rgba(255,255,255,0.97)' : 'transparent',
    backdropFilter: opaque ? 'blur(14px)' : 'none',
    borderBottom: opaque ? '1px solid rgba(0,128,128,0.12)' : 'none',
    transition: 'background 0.35s, border-color 0.35s',
  }

  return (
    <>
      <nav style={navStyle}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}>
          <Logo height={34} />
          <span style={{ color: '#0f2b3d', fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px' }}>Virtual Peers</span>
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {navLinks.map(({ label, to }) => (
              <Link key={to} to={to} style={{ color: '#3d6275', fontSize: 14, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#0f2b3d'}
                onMouseLeave={e => e.currentTarget.style.color = '#3d6275'}
              >{label}</Link>
            ))}
          </div>
        )}

        {!isMobile && (
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, alignItems: 'center' }}>
            <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              style={{ background: 'rgba(0,128,128,0.08)', color: '#008080', border: '1px solid rgba(0,128,128,0.25)', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >{t('nav.langToggle')}</button>
            {user ? (
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button onClick={() => setProfileOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,128,128,0.08)', border: '1px solid rgba(0,128,128,0.25)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#008080', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>
                    {user.full_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f2b3d', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.full_name?.split(' ')[0]}</span>
                  <span style={{ fontSize: 10, color: '#7a9cac' }}>▾</span>
                </button>
                {profileOpen && (
                  <div style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,128,128,0.12)', minWidth: 160, overflow: 'hidden', zIndex: 300 }}>
                    <button onClick={() => { navigate('/dashboard/profile'); setProfileOpen(false) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', fontSize: 14, fontWeight: 500, color: '#0f2b3d', cursor: 'pointer', borderBottom: '1px solid rgba(0,128,128,0.08)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,128,128,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >Profile</button>
                    <button onClick={() => { logout(); setProfileOpen(false); navigate('/') }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', fontSize: 14, fontWeight: 500, color: '#FF6F61', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,111,97,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/login')}
                style={{ background: '#FF6F61', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >Sign In</button>
            )}
          </div>
        )}

        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              style={{ background: 'rgba(0,128,128,0.08)', color: '#008080', border: '1px solid rgba(0,128,128,0.25)', borderRadius: 7, padding: '5px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >{lang === 'en' ? 'ES' : 'EN'}</button>
            <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#0f2b3d', cursor: 'pointer', padding: 4, lineHeight: 0 }}>
              {menuOpen
                ? <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>
                : <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              }
            </button>
          </div>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div style={{ position: 'fixed', top: transparent ? 52 : 64, left: 0, right: 0, zIndex: 199, background: 'rgba(255,255,255,0.99)', backdropFilter: 'blur(14px)', padding: '8px 0 20px', borderBottom: '1px solid rgba(0,128,128,0.12)' }}>
          {navLinks.map(({ label, to }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{ display: 'block', color: '#0f2b3d', fontSize: 16, fontWeight: 500, textDecoration: 'none', padding: '13px 24px', borderBottom: '1px solid rgba(0,128,128,0.08)' }}>{label}</Link>
          ))}
          <div style={{ padding: '16px 24px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {user ? (
              <>
                <button onClick={() => { navigate('/dashboard/profile'); setMenuOpen(false) }} style={{ width: '100%', background: 'rgba(0,128,128,0.08)', color: '#008080', border: '1px solid rgba(0,128,128,0.25)', borderRadius: 10, padding: '11px 8px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Profile</button>
                <button onClick={() => { logout(); setMenuOpen(false); navigate('/') }} style={{ width: '100%', background: 'rgba(255,111,97,0.1)', color: '#FF6F61', border: '1px solid rgba(255,111,97,0.3)', borderRadius: 10, padding: '11px 8px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Log Out</button>
              </>
            ) : (
              <button onClick={() => { navigate('/login'); setMenuOpen(false) }} style={{ width: '100%', background: '#FF6F61', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 8px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Sign In</button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
