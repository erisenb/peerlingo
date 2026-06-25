import { useLocation, useNavigate } from 'react-router-dom'
import { usePageTransition } from '../context/TransitionContext'

const PAGE_ORDER = ['/', '/about', '/how-it-works', '/students', '/instructors', '/faq', '/contact']

export default function PageArrows() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { setDirection } = usePageTransition()

  const idx = PAGE_ORDER.indexOf(pathname)
  if (idx === -1) return null

  function go(dir) {
    setDirection(dir)
    navigate(dir === 'forward' ? PAGE_ORDER[idx + 1] : PAGE_ORDER[idx - 1])
  }

  const btn = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 150,
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'rgba(0,128,128,0.12)',
    border: '1.5px solid rgba(0,128,128,0.35)',
    color: '#008080',
    fontSize: 26,
    lineHeight: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(6px)',
    transition: 'background 0.15s, border-color 0.15s',
    userSelect: 'none',
    padding: 0,
    boxShadow: '0 2px 12px rgba(0,128,128,0.15)',
  }

  return (
    <>
      {idx > 0 && (
        <button
          onClick={() => go('back')}
          style={{ ...btn, left: 12 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,128,128,0.25)'; e.currentTarget.style.borderColor = 'rgba(0,128,128,0.6)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,128,128,0.12)'; e.currentTarget.style.borderColor = 'rgba(0,128,128,0.35)' }}
          aria-label="Previous page"
        >‹</button>
      )}
      {idx < PAGE_ORDER.length - 1 && (
        <button
          onClick={() => go('forward')}
          style={{ ...btn, right: 12 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,128,128,0.25)'; e.currentTarget.style.borderColor = 'rgba(0,128,128,0.6)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,128,128,0.12)'; e.currentTarget.style.borderColor = 'rgba(0,128,128,0.35)' }}
          aria-label="Next page"
        >›</button>
      )}
    </>
  )
}
