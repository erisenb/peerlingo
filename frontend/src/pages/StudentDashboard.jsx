import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PublicNav from '../components/PublicNav'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { API_BASE } from '../api'
import AvailabilityPanel from '../components/AvailabilityPanel'

const AMBER  = '#FF6F61'
const BLUE   = '#008080'
const GREEN  = '#008080'
const PURPLE = '#008080'

// ── Video helpers ─────────────────────────────────────────────────────────────

function isYouTube(url) {
  return url && (url.includes('youtube.com/watch') || url.includes('youtu.be/'))
}
function youtubeEmbed(url) {
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : url
}

// ── Spanish helpers ───────────────────────────────────────────────────────────

const TIPO_ES = {
  homework: { label: 'Tarea',        icon: '📝', color: BLUE,   bg: 'rgba(0,128,128,0.1)' },
  practice: { label: 'Práctica',     icon: '💪', color: GREEN,  bg: 'rgba(0,128,128,0.1)' },
  quiz:     { label: 'Cuestionario', icon: '❓', color: AMBER,  bg: 'rgba(255,111,97,0.1)' },
}

function formatFechaES(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatHoraES(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function timeUntil(iso) {
  const diff = new Date(iso) - new Date()
  if (diff < 0) return null
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(h / 24)
  if (d > 0) return `en ${d} día${d !== 1 ? 's' : ''}`
  if (h > 0) return `en ${h} hora${h !== 1 ? 's' : ''}`
  const m = Math.floor(diff / 60000)
  return m > 0 ? `en ${m} min` : '¡ahora!'
}

// ── Tab button ────────────────────────────────────────────────────────────────

function Tab({ id, label, active, onClick, badge }) {
  return (
    <button onClick={() => onClick(id)} style={{
      background: 'none', border: 'none', padding: '10px 18px',
      fontWeight: 700, fontSize: 14, cursor: 'pointer',
      color: active ? AMBER : '#6b7280',
      borderBottom: active ? `3px solid ${AMBER}` : '3px solid transparent',
      marginBottom: -2, whiteSpace: 'nowrap', position: 'relative',
    }}>
      {label}
      {badge > 0 && (
        <span style={{
          position: 'absolute', top: 6, right: 4,
          background: '#ef4444', color: '#fff',
          borderRadius: '50%', width: 16, height: 16,
          fontSize: 10, fontWeight: 900,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{badge}</span>
      )}
    </button>
  )
}

// ── Tutor card ────────────────────────────────────────────────────────────────

function TutorCard({ token }) {
  const [tutor, setTutor] = useState(null)
  const [imgErr, setImgErr] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/api/users/my-tutor`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null).then(setTutor).catch(() => {})
  }, [])

  if (!tutor) return null

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 900, color: '#1e293b', marginBottom: 12 }}>🎓 Tu tutor</h3>
      <div style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', border: '1px solid rgba(0,128,128,0.18)', boxShadow: '0 2px 12px rgba(0,128,128,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: tutor.bio || tutor.goals ? 14 : 0 }}>
          {tutor.has_photo && !imgErr ? (
            <img src={`${API_BASE}/api/users/${tutor.id}/photo`} alt="" onError={() => setImgErr(true)}
              style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563eb', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,128,128,0.1)', border: '3px solid #2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#008080', flexShrink: 0 }}>
              {tutor.full_name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>{tutor.full_name}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{tutor.school || 'New Jersey'}</div>
          </div>
        </div>
        {tutor.bio && (
          <div style={{ background: 'rgba(0,128,128,0.06)', borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: BLUE, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Sobre tu tutor</div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>{tutor.bio}</p>
          </div>
        )}
        {tutor.goals && (
          <div style={{ background: 'rgba(0,128,128,0.05)', borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: GREEN, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Sus metas</div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>{tutor.goals}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Inicio (Home) tab ─────────────────────────────────────────────────────────

function InicioTab({ user, meetings, assignments, onTabChange, token }) {
  const { t } = useLanguage()
  const [flashcardLesson, setFlashcardLesson] = useState(null)
  const now = new Date()
  const upcomingMeetings = meetings
    .filter(m => {
      const end = new Date(new Date(m.scheduled_at).getTime() + m.duration_minutes * 60000)
      return end >= now
    })
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))

  const nextMeeting = upcomingMeetings[0] || null

  const pendingAssignments = assignments.filter(a => !a.completed_by_me)
  const firstName = user?.full_name?.split(' ')[0] || 'Estudiante'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Greeting */}
      <div style={{
        background: `linear-gradient(135deg, ${AMBER}, #ff9b91)`,
        borderRadius: 24, padding: '28px 28px',
        color: '#fff', textAlign: 'center',
      }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>⭐</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{t('student.welcome')}, {firstName}!</h2>
        <p style={{ fontSize: 15, opacity: 0.95 }}>PeerLingo 🌐</p>
        {user?.grade && (
          <span style={{ display: 'inline-block', marginTop: 10, background: 'rgba(255,255,255,0.25)', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
            {user.grade}
          </span>
        )}
      </div>

      {/* Próxima reunión */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 900, color: '#1e293b', marginBottom: 12 }}>📅 Tu próxima reunión</h3>
        {nextMeeting ? (
          <div style={{
            background: '#fff', borderRadius: 16, padding: '20px 22px',
            border: `2px solid rgba(255,111,97,0.45)`,
            boxShadow: '0 4px 16px rgba(217,119,6,0.1)',
          }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#1e293b', marginBottom: 6 }}>{nextMeeting.title}</div>
            <div style={{ fontSize: 14, color: '#475569', marginBottom: 4 }}>
              📆 {formatFechaES(nextMeeting.scheduled_at)}
            </div>
            <div style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>
              🕐 {formatHoraES(nextMeeting.scheduled_at)} · {nextMeeting.duration_minutes} minutos
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Con: <strong>{nextMeeting.tutor_name}</strong></span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {timeUntil(nextMeeting.scheduled_at) && (
                  <span style={{ background: 'rgba(255,111,97,0.1)', color: AMBER, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                    {timeUntil(nextMeeting.scheduled_at)}
                  </span>
                )}
                {nextMeeting.meeting_url && (
                  <a href={nextMeeting.meeting_url} target="_blank" rel="noreferrer" style={{
                    background: GREEN, color: '#fff', borderRadius: 10, padding: '8px 16px',
                    fontSize: 13, fontWeight: 800, textDecoration: 'none',
                  }}>Unirse →</a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px', border: '2px dashed #e5e7eb', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            No hay reuniones programadas todavía.
          </div>
        )}
      </div>

      {/* Horario de la semana */}
      {upcomingMeetings.length > 1 && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 900, color: '#1e293b', marginBottom: 12 }}>📋 Tu horario</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {upcomingMeetings.slice(0, 5).map(m => (
              <div key={m.id} style={{
                background: '#fff', borderRadius: 12, padding: '12px 16px',
                border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{formatFechaES(m.scheduled_at)} · {formatHoraES(m.scheduled_at)}</div>
                </div>
                {m.meeting_url && (
                  <a href={m.meeting_url} target="_blank" rel="noreferrer"
                    style={{ fontSize: 12, color: BLUE, fontWeight: 700, textDecoration: 'none' }}>Unirse →</a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tutor card */}
      <TutorCard token={token} />

      {/* Tareas pendientes preview */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 900, color: '#1e293b' }}>📝 Tareas pendientes</h3>
          {pendingAssignments.length > 0 && (
            <button onClick={() => onTabChange('tareas')} style={{ background: 'none', border: 'none', color: AMBER, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Ver todas →
            </button>
          )}
        </div>
        {pendingAssignments.length === 0 ? (
          <div style={{ background: 'rgba(0,128,128,0.05)', borderRadius: 14, padding: '16px 20px', border: '2px solid #bbf7d0', textAlign: 'center', fontSize: 14, color: GREEN, fontWeight: 700 }}>
            🎉 ¡No tienes tareas pendientes!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pendingAssignments.slice(0, 3).map(a => {
              const tp = TIPO_ES[a.type] || TIPO_ES.homework
              return (
                <div key={a.id} style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', border: `1px solid ${tp.bg}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: a.vp_lesson_id ? 10 : 0 }}>
                    <div>
                      <span style={{ background: tp.bg, color: tp.color, borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700, marginRight: 8 }}>{tp.icon} {tp.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{a.title}</span>
                    </div>
                    {a.due_date && <span style={{ fontSize: 12, color: '#94a3b8' }}>Vence: {a.due_date}</span>}
                  </div>
                  {a.vp_lesson_id && (
                    <button
                      onClick={() => setFlashcardLesson(a.vp_lesson_id)}
                      style={{
                        width: '100%', background: 'linear-gradient(135deg, #FF6F61, #ff9b91)',
                        color: '#fff', border: 'none', borderRadius: 10, padding: '9px 14px',
                        fontSize: 13, fontWeight: 800, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}>
                      📇 Ver y Estudiar Flashcards
                    </button>
                  )}
                </div>
              )
            })}
            {pendingAssignments.length > 3 && (
              <button onClick={() => onTabChange('tareas')} style={{ background: 'none', border: 'none', color: AMBER, fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
                + {pendingAssignments.length - 3} tareas más →
              </button>
            )}
          </div>
        )}
      </div>
      {flashcardLesson && (
        <FlashcardStudyModal lessonId={flashcardLesson} token={token} onClose={() => setFlashcardLesson(null)} />
      )}
    </div>
  )
}

// ── Assignment detail modal ───────────────────────────────────────────────────

function FlashcardStudyModal({ lessonId, token, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/curriculum/lessons/${lessonId}/flashcards`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setData)
      .catch(() => setError('No se pudieron cargar las tarjetas.'))
      .finally(() => setLoading(false))
  }, [lessonId])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1100, padding: 20,
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '28px 24px',
        width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#1e293b', margin: 0 }}>
            📇 {data ? data.lesson_title : 'Flashcards'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}>×</button>
        </div>
        {loading && <p style={{ color: '#9ca3af', textAlign: 'center', padding: 30 }}>Cargando tarjetas…</p>}
        {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
        {data && (
          <FlashcardDeck vocab={data.vocabulary} expressions={data.expressions} />
        )}
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: '#008080', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

function AssignmentDetailModal({ assignment, token, onClose, onComplete, onUncomplete }) {
  const [curriculum, setCurriculum] = useState(null)
  const [showFlashcards, setShowFlashcards] = useState(false)
  const t = TIPO_ES[assignment.type] || TIPO_ES.homework

  useEffect(() => {
    if (assignment.curriculum_id) {
      fetch(`${API_BASE}/api/curriculum/${assignment.curriculum_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.ok ? r.json() : null).then(setCurriculum).catch(() => {})
    }
  }, [assignment.curriculum_id])

  return (
    <>
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20,
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '28px 24px',
        width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <span style={{ background: t.bg, color: t.color, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>
              {t.icon} {t.label}
            </span>
            {assignment.completed_by_me && (
              <span style={{ marginLeft: 8, background: 'rgba(0,128,128,0.1)', color: GREEN, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>✅ Hecho</span>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}>×</button>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', marginBottom: 10 }}>{assignment.title}</h2>

        {assignment.description && (
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 14 }}>{assignment.description}</p>
        )}

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          {assignment.due_date && (
            <span style={{ fontSize: 13, color: '#94a3b8' }}>📅 Vence el {assignment.due_date}</span>
          )}
          <span style={{ fontSize: 13, color: '#64748b' }}>De: {assignment.tutor_name}</span>
        </div>

        {curriculum && (
          <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: PURPLE, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              📚 {curriculum.title}
            </div>

            {curriculum.video_url && isYouTube(curriculum.video_url) && (
              <iframe
                src={youtubeEmbed(curriculum.video_url)}
                width="100%" height="240"
                frameBorder="0" allowFullScreen
                style={{ borderRadius: 12, display: 'block', marginBottom: 14 }}
              />
            )}
            {curriculum.video_url && !isYouTube(curriculum.video_url) && (
              <a href={curriculum.video_url} target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', marginBottom: 14, fontSize: 13, color: BLUE, fontWeight: 700, textDecoration: 'none' }}>
                🎬 Ver video →
              </a>
            )}

            {curriculum.content && (
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: 12 }}>
                {curriculum.content}
              </div>
            )}

            {curriculum.has_pdf && (
              <a href={`${API_BASE}/api/curriculum/${curriculum.id}/pdf`} target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,128,128,0.1)', color: GREEN, borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                📄 Descargar PDF
              </a>
            )}
          </div>
        )}

        {assignment.vp_lesson_id && (
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => setShowFlashcards(true)}
              style={{
                width: '100%', background: 'linear-gradient(135deg, #FF6F61, #ff9b91)',
                color: '#fff', border: 'none', borderRadius: 12, padding: '13px 18px',
                fontSize: 15, fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              📇 Ver y Estudiar Flashcards
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ background: 'rgba(0,128,128,0.08)', color: '#374151', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Cerrar
          </button>
          {assignment.completed_by_me ? (
            <button onClick={() => { onUncomplete(assignment.id); onClose() }} style={{ background: 'none', border: '2px solid #94a3b8', color: '#94a3b8', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Deshacer
            </button>
          ) : (
            <button onClick={() => { onComplete(assignment.id); onClose() }} style={{ background: AMBER, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
              ✅ Marcar como hecho
            </button>
          )}
        </div>
      </div>
    </div>
    {showFlashcards && (
      <FlashcardStudyModal
        lessonId={assignment.vp_lesson_id}
        token={token}
        onClose={() => setShowFlashcards(false)}
      />
    )}
    </>
  )
}

// ── Tareas (Assignments) tab ──────────────────────────────────────────────────

function TareasTab({ token, assignments, onComplete, onUncomplete }) {
  const [filter, setFilter] = useState('pendientes')
  const [selected, setSelected] = useState(null)

  const shown = assignments.filter(a =>
    filter === 'completadas' ? a.completed_by_me : !a.completed_by_me
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[['pendientes', 'Pendientes'], ['completadas', 'Completadas']].map(([v, label]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            background: filter === v ? AMBER : '#fff',
            color: filter === v ? '#fff' : '#6b7280',
            border: `2px solid ${filter === v ? AMBER : 'rgba(0,128,128,0.18)'}`,
            borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: '#fff', borderRadius: 16, border: '2px dashed rgba(255,111,97,0.45)' }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>{filter === 'completadas' ? '🏅' : '🎉'}</div>
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            {filter === 'completadas' ? 'Todavía no has completado tareas.' : '¡No tienes tareas pendientes!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {shown.map(a => {
            const t = TIPO_ES[a.type] || TIPO_ES.homework
            return (
              <div key={a.id} style={{
                background: '#fff', borderRadius: 16, padding: '20px 22px',
                border: `2px solid ${a.completed_by_me ? 'rgba(0,128,128,0.3)' : t.bg}`,
                boxShadow: '0 2px 12px rgba(0,128,128,0.08)',
                cursor: 'pointer',
              }} onClick={() => setSelected(a)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ background: t.bg, color: t.color, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                        {t.icon} {t.label}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>{a.title}</span>
                      {a.completed_by_me && (
                        <span style={{ background: 'rgba(0,128,128,0.1)', color: GREEN, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>✅ Hecho</span>
                      )}
                    </div>
                    {a.description && (
                      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, marginBottom: 6 }}>{a.description}</p>
                    )}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {a.due_date && (
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>📅 Vence el {a.due_date}</span>
                      )}
                      {a.curriculum_title && (
                        <span style={{ fontSize: 12, color: PURPLE }}>📚 {a.curriculum_title}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: AMBER, fontWeight: 700 }}>Ver detalles →</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <AssignmentDetailModal
          assignment={selected}
          token={token}
          onClose={() => setSelected(null)}
          onComplete={id => { onComplete(id); setSelected(prev => prev ? { ...prev, completed_by_me: true } : prev) }}
          onUncomplete={id => { onUncomplete(id); setSelected(prev => prev ? { ...prev, completed_by_me: false } : prev) }}
        />
      )}
    </div>
  )
}

// ── Lecciones (Curriculum) tab ────────────────────────────────────────────────

const STATUS_CONFIG = {
  completed:        { label: '✅ Completada',       color: '#008080', bg: 'rgba(0,128,128,0.1)',   border: 'rgba(0,128,128,0.3)',   icon: '🏅' },
  scheduled:        { label: '📅 Programada',        color: '#0369a1', bg: 'rgba(3,105,161,0.08)', border: 'rgba(3,105,161,0.25)',  icon: '📅' },
  to_be_scheduled:  { label: '🕐 Por programar',     color: '#6b7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)', icon: '📖' },
}

function LessonModal({ lesson, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#7a9cac', background: 'rgba(0,128,128,0.08)', borderRadius: 20, padding: '3px 12px' }}>
              Lección {lesson.lesson_number}
            </span>
            {(() => { const s = STATUS_CONFIG[lesson.status]; return (
              <span style={{ fontSize: 12, fontWeight: 700, color: s.color, background: s.bg, borderRadius: 20, padding: '3px 10px', border: `1px solid ${s.border}` }}>{s.label}</span>
            )})()}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}>×</button>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f2b3d', marginBottom: 8 }}>{lesson.title}</h2>
        {lesson.description && (
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, marginBottom: 16 }}>{lesson.description}</p>
        )}
        {lesson.content && (
          <div style={{ background: '#F1F8F9', borderRadius: 12, padding: '16px 18px', fontSize: 14, color: '#334155', lineHeight: 1.9, whiteSpace: 'pre-wrap', border: '1px solid rgba(0,128,128,0.12)' }}>
            {lesson.content}
          </div>
        )}
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: '#008080', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

function LeccionesTab({ token }) {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/curriculum/my-lessons`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : []).then(setLessons).finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Cargando…</p>

  if (lessons.length === 0) return (
    <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: 16, border: '2px dashed rgba(255,111,97,0.45)' }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>📭</div>
      <p style={{ color: '#6b7280', fontSize: 14 }}>Tu plan de lecciones aparecerá aquí después de completar el registro.</p>
    </div>
  )

  const completed = lessons.filter(l => l.status === 'completed').length
  const scheduled = lessons.filter(l => l.status === 'scheduled').length

  return (
    <div>
      {/* Progress summary */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 110, background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(0,128,128,0.18)', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#008080' }}>{completed}</div>
          <div style={{ fontSize: 12, color: '#7a9cac', fontWeight: 700 }}>Completadas</div>
        </div>
        <div style={{ flex: 1, minWidth: 110, background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(3,105,161,0.18)', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#0369a1' }}>{scheduled}</div>
          <div style={{ fontSize: 12, color: '#7a9cac', fontWeight: 700 }}>Programadas</div>
        </div>
        <div style={{ flex: 1, minWidth: 110, background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(107,114,128,0.18)', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#6b7280' }}>{lessons.length - completed - scheduled}</div>
          <div style={{ fontSize: 12, color: '#7a9cac', fontWeight: 700 }}>Por programar</div>
        </div>
      </div>

      {/* Lesson list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lessons.map(l => {
          const s = STATUS_CONFIG[l.status]
          return (
            <div key={l.id}
              onClick={() => setSelected(l)}
              style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: `2px solid ${s.border}`, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,128,128,0.06)', display: 'flex', alignItems: 'center', gap: 14, transition: 'transform 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.bg, border: `2px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#7a9cac' }}>Lección {l.lesson_number}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0f2b3d' }}>{l.title}</span>
                </div>
                {l.description && <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.4 }}>{l.description}</p>}
              </div>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, borderRadius: 20, padding: '3px 10px', border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Ver lección →</span>
              </div>
            </div>
          )
        })}
      </div>

      {selected && <LessonModal lesson={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ── Mensajes (Chat) tab ───────────────────────────────────────────────────────

function ChatThread({ token, user, contact, subtitle }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetchMsgs()
    const iv = setInterval(fetchMsgs, 5000)
    return () => clearInterval(iv)
  }, [contact.id])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function fetchMsgs() {
    fetch(`${API_BASE}/api/chat/${contact.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setMessages).catch(() => {})
  }

  async function send(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')
    try {
      const res = await fetch(`${API_BASE}/api/chat/${contact.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: text }),
      })
      if (res.ok) { const msg = await res.json(); setMessages(prev => [...prev, msg]) }
    } finally { setSending(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 520 }}>
      <div style={{ background: 'rgba(255,111,97,0.1)', borderRadius: '14px 14px 0 0', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', border: `2px solid ${AMBER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: AMBER }}>
          {contact.full_name[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{contact.full_name}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>{subtitle}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, border: '1px solid rgba(0,128,128,0.18)', borderTop: 'none' }}>
        {messages.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 60 }}>
            Ningún mensaje todavía.
          </p>
        )}
        {messages.map(m => {
          const isMe = m.sender_id === user.id
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '72%', background: isMe ? AMBER : '#fff',
                color: isMe ? '#fff' : '#1e293b',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '10px 14px', fontSize: 14, lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                border: isMe ? 'none' : '1px solid #e5e7eb',
              }}>
                <div>{m.content}</div>
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>
                  {new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} style={{ display: 'flex', gap: 8, padding: '10px 14px', background: '#fff', borderRadius: '0 0 14px 14px', border: '1px solid rgba(0,128,128,0.18)', borderTop: '1px solid #f1f5f9' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Escribe a ${contact.full_name}…`}
          style={{ flex: 1, border: '1px solid rgba(0,128,128,0.18)', borderRadius: 10, padding: '9px 13px', fontSize: 14, outline: 'none', fontFamily: "'Times New Roman', Times, serif" }}
        />
        <button type="submit" disabled={!input.trim() || sending} style={{ background: AMBER, color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: !input.trim() || sending ? 0.6 : 1 }}>
          {sending ? '…' : 'Enviar →'}
        </button>
      </form>
    </div>
  )
}

function MensajesTab({ token, user }) {
  const [admin, setAdmin] = useState(null)
  const [tutor, setTutor] = useState(null)
  const [previews, setPreviews] = useState({})
  const [activeThread, setActiveThread] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/users/site-admin`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null),
      fetch(`${API_BASE}/api/users/my-tutor`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null),
    ]).then(([a, t]) => {
      setAdmin(a)
      setTutor(t)
      const contacts = [a, t].filter(Boolean)
      Promise.all(
        contacts.map(c =>
          fetch(`${API_BASE}/api/chat/${c.id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : [])
            .then(msgs => ({ id: c.id, last: msgs[msgs.length - 1] || null }))
            .catch(() => ({ id: c.id, last: null }))
        )
      ).then(results => {
        const p = {}
        results.forEach(r => { p[r.id] = r.last })
        setPreviews(p)
      })
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Cargando…</p>
  if (!admin) return <p style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>No se pudo cargar los mensajes.</p>

  const threads = [
    { key: 'admin', contact: admin, subtitle: 'Fundador · PeerLingo' },
    ...(tutor ? [{ key: 'tutor', contact: tutor, subtitle: `${tutor.school || 'New Jersey'} · Tu tutor` }] : []),
  ]

  if (activeThread) {
    const active = threads.find(t => t.key === activeThread)
    return (
      <div>
        <button onClick={() => setActiveThread(null)} style={{
          background: 'none', border: 'none', color: AMBER, fontWeight: 700,
          fontSize: 15, cursor: 'pointer', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 4, padding: 0,
        }}>
          ‹ Mensajes
        </button>
        <ChatThread key={active.key} token={token} user={user} contact={active.contact} subtitle={active.subtitle} />
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', marginBottom: 16 }}>Mensajes</h2>
      <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 16, border: '1px solid rgba(0,128,128,0.18)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,128,128,0.07)' }}>
        {threads.map((t, i) => {
          const last = previews[t.contact.id]
          const isMe = last?.sender_id === user.id
          const preview = last ? `${isMe ? 'Tú: ' : ''}${last.content}` : 'Sin mensajes todavía'
          const time = last
            ? new Date(last.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
            : ''
          return (
            <button
              key={t.key}
              onClick={() => setActiveThread(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px', background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                borderTop: i > 0 ? '1px solid rgba(0,128,128,0.08)' : 'none',
              }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(255,111,97,0.12)', border: `2px solid ${AMBER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 900, color: AMBER,
              }}>
                {t.contact.full_name[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>{t.contact.full_name}</span>
                  {time && <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0, marginLeft: 8 }}>{time}</span>}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 2 }}>{t.subtitle}</div>
                <div style={{ fontSize: 13, color: last ? '#475569' : '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {preview}
                </div>
              </div>
              <span style={{ color: '#d1d5db', fontSize: 20, flexShrink: 0 }}>›</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Horario (Schedule) tab ────────────────────────────────────────────────────

const MES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIA_ES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

function _icalFmt(d) {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}
function googleCalUrl(m) {
  const start = new Date(m.scheduled_at)
  const end = new Date(start.getTime() + m.duration_minutes * 60000)
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: m.title,
    dates: `${_icalFmt(start)}/${_icalFmt(end)}`,
    details: [m.notes, m.meeting_url].filter(Boolean).join('\n'),
    location: m.meeting_url || '',
  })
  return `https://calendar.google.com/calendar/render?${p}`
}
function appleCalUrl(m) {
  const start = new Date(m.scheduled_at)
  const end = new Date(start.getTime() + m.duration_minutes * 60000)
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PeerLingo//EN',
    'BEGIN:VEVENT',
    `DTSTART:${_icalFmt(start)}`,
    `DTEND:${_icalFmt(end)}`,
    `SUMMARY:${m.title}`,
    m.notes ? `DESCRIPTION:${m.notes}` : null,
    m.meeting_url ? `LOCATION:${m.meeting_url}` : null,
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')
  return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`
}

function HorarioTab({ meetings }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const year  = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const byDay = {}
  meetings.forEach(m => {
    const d = new Date(m.scheduled_at)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const k = d.getDate();
      (byDay[k] = byDay[k] || []).push(m)
    }
  })

  const isThisMonth = today.getFullYear() === year && today.getMonth() === month

  const cells = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const upcomingThisMonth = meetings
    .filter(m => {
      const d = new Date(m.scheduled_at)
      return d.getFullYear() === year && d.getMonth() === month && d >= today
    })
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Calendar card */}
      <div style={{ background: '#fff', borderRadius: 20, padding: '24px 20px', border: '1px solid rgba(0,128,128,0.12)', boxShadow: '0 2px 12px rgba(0,128,128,0.07)' }}>

        {/* Month nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))}
            style={{ background: 'rgba(0,128,128,0.08)', border: '1px solid rgba(0,128,128,0.2)', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', fontSize: 16, color: '#008080', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ‹
          </button>
          <span style={{ fontSize: 17, fontWeight: 900, color: '#0f2b3d' }}>{MES_ES[month]} {year}</span>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))}
            style={{ background: 'rgba(0,128,128,0.08)', border: '1px solid rgba(0,128,128,0.2)', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', fontSize: 16, color: '#008080', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ›
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 4 }}>
          {DIA_ES.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#94a3b8', padding: '4px 0', letterSpacing: '0.3px' }}>{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const sessions = byDay[day] || []
            const isToday = isThisMonth && day === today.getDate()
            return (
              <div key={i} style={{
                minHeight: 54,
                background: isToday ? 'rgba(255,111,97,0.08)' : sessions.length ? 'rgba(0,128,128,0.04)' : '#fafafa',
                border: `1px solid ${isToday ? 'rgba(255,111,97,0.4)' : sessions.length ? 'rgba(0,128,128,0.25)' : 'rgba(0,128,128,0.08)'}`,
                borderRadius: 8,
                padding: '4px 3px',
              }}>
                <div style={{ fontSize: 12, fontWeight: isToday ? 900 : 500, color: isToday ? '#FF6F61' : '#374151', textAlign: 'center', marginBottom: 2 }}>{day}</div>
                {sessions.map(m => (
                  <div key={m.id} style={{ background: '#008080', borderRadius: 3, padding: '1px 3px', fontSize: 9, color: '#fff', fontWeight: 700, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.5 }}>
                    {new Date(m.scheduled_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming meetings feed — all future sessions */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 900, color: '#1e293b', marginBottom: 12 }}>
          📅 Mis Reuniones
        </h3>
        {(() => {
          const upcoming = meetings
            .filter(m => {
              const end = new Date(new Date(m.scheduled_at).getTime() + m.duration_minutes * 60000)
              return end >= now
            })
            .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))

          if (upcoming.length === 0) return (
            <div style={{ background: '#fff', borderRadius: 14, padding: '36px 20px', border: '2px dashed rgba(0,128,128,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
              <p style={{ color: '#64748b', fontSize: 15, fontWeight: 700, margin: 0 }}>No hay reuniones programadas</p>
              <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 6 }}>Tu tutor programará la próxima sesión contigo pronto.</p>
            </div>
          )

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcoming.map(m => {
                const dt = new Date(m.scheduled_at)
                const msUntil = dt - now
                const msAfterStart = now - dt
                const canJoin = m.meeting_url && msUntil <= 15 * 60 * 1000 && msAfterStart < m.duration_minutes * 60 * 1000
                const startingSoon = msUntil > 0 && msUntil <= 15 * 60 * 1000

                return (
                  <div key={m.id} style={{
                    background: '#fff', borderRadius: 16, padding: '18px 20px',
                    border: startingSoon ? '2px solid #16a34a' : '1px solid rgba(0,128,128,0.18)',
                    boxShadow: startingSoon ? '0 0 0 4px rgba(22,163,74,0.1)' : '0 2px 8px rgba(0,128,128,0.06)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      {/* Date badge */}
                      <div style={{ background: 'rgba(0,128,128,0.08)', border: '2px solid rgba(0,128,128,0.2)', borderRadius: 12, padding: '8px 10px', textAlign: 'center', flexShrink: 0, minWidth: 48 }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#008080', lineHeight: 1 }}>{dt.getDate()}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#7a9cac', textTransform: 'uppercase', marginTop: 2 }}>{MES_ES[dt.getMonth()].slice(0, 3)}</div>
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#0f2b3d', marginBottom: 4 }}>{m.title}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginBottom: m.notes ? 6 : 0 }}>
                          🕐 {dt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          {' · '}{m.duration_minutes} min
                          {m.tutor_name && <span> · Con <strong>{m.tutor_name}</strong></span>}
                        </div>
                        {m.notes && (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, background: 'rgba(0,128,128,0.05)', borderRadius: 8, padding: '6px 10px' }}>
                            <span style={{ fontSize: 12 }}>📖</span>
                            <span style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>{m.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add to calendar buttons */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                      <a href={googleCalUrl(m)} target="_blank" rel="noreferrer" style={{
                        flex: 1, padding: '9px 10px', background: '#4285f4',
                        color: '#fff', borderRadius: 9, fontSize: 12, fontWeight: 700,
                        textDecoration: 'none', textAlign: 'center',
                      }}>📅 Google Calendar</a>
                      <a href={appleCalUrl(m)} download={`${m.title}.ics`} style={{
                        flex: 1, padding: '9px 10px', background: '#1c1c1e',
                        color: '#fff', borderRadius: 9, fontSize: 12, fontWeight: 700,
                        textDecoration: 'none', textAlign: 'center',
                      }}>🍎 Apple Calendar</a>
                    </div>

                    {/* Join button — appears 15 min before start, disappears after session ends */}
                    {canJoin && (
                      <a href={m.meeting_url} target="_blank" rel="noreferrer" style={{
                        display: 'block', marginTop: 14,
                        background: '#16a34a', color: '#fff',
                        borderRadius: 12, padding: '12px 0',
                        fontSize: 14, fontWeight: 800, textDecoration: 'none',
                        textAlign: 'center', letterSpacing: '0.3px',
                      }}>
                        🎥 Join Meeting
                      </a>
                    )}
                    {startingSoon && !canJoin && (
                      <div style={{ marginTop: 10, fontSize: 12, color: '#16a34a', fontWeight: 700, textAlign: 'center' }}>
                        ● Starting in {Math.ceil(msUntil / 60000)} min
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })()}
      </div>

      <AvailabilityPanel isTutor={false} />
    </div>
  )
}

// ── Flashcard & Quiz helpers ──────────────────────────────────────────────────

function FlashcardDeck({ vocab, expressions }) {
  const cards = [
    ...vocab.map(v => ({
      front: v.word,
      back_word: v.word_es || null,
      back_def: v.definition_es || v.definition,
      label: 'Palabra',
    })),
    ...expressions.map(e => ({
      front: `"${e.expression}"`,
      back_word: null,
      back_def: e.meaning_es || e.meaning,
      label: 'Expresión',
    })),
  ]
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (cards.length === 0) return null

  const card = cards[idx]
  function go(dir) { setIdx(i => (i + dir + cards.length) % cards.length); setFlipped(false) }

  return (
    <div>
      <h4 style={{ fontSize: 13, fontWeight: 800, color: '#FF6F61', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>
        📇 Flashcards — toca para voltear
      </h4>
      <div onClick={() => setFlipped(f => !f)} style={{ perspective: '1000px', cursor: 'pointer', marginBottom: 12 }}>
        <div style={{
          position: 'relative', width: '100%', height: 180,
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.4s ease',
        }}>
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #FF6F61, #ff9b91)',
            borderRadius: 14, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '16px 20px',
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{card.label} — English</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', textAlign: 'center', lineHeight: 1.4 }}>{card.front}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 10 }}>Toca para ver en español →</div>
          </div>
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#fff', border: '2px solid #FF6F61',
            borderRadius: 14, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '16px 20px', gap: 6,
          }}>
            <div style={{ fontSize: 11, color: '#FF6F61', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>En Español</div>
            {card.back_word && (
              <div style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', textAlign: 'center' }}>{card.back_word}</div>
            )}
            <div style={{ fontSize: 13, fontWeight: 500, color: '#475569', textAlign: 'center', lineHeight: 1.5 }}>{card.back_def}</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => go(-1)} style={{ background: 'rgba(255,111,97,0.1)', border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', color: '#FF6F61', fontWeight: 700, fontSize: 13 }}>‹ Anterior</button>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{idx + 1} / {cards.length}</span>
        <button onClick={() => go(1)} style={{ background: 'rgba(255,111,97,0.1)', border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', color: '#FF6F61', fontWeight: 700, fontSize: 13 }}>Siguiente ›</button>
      </div>
    </div>
  )
}

function buildQuestion(vocab, expressions) {
  const all = [
    ...vocab.map(v => ({ term: v.word, def: v.definition })),
    ...expressions.map(e => ({ term: e.expression, def: e.meaning })),
  ]
  if (all.length < 2) return null
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  const correct = shuffled[0]
  const options = [correct.def, ...shuffled.slice(1, 4).map(x => x.def)].sort(() => Math.random() - 0.5)
  return { term: correct.term, answer: correct.def, options }
}

function LessonQuiz({ vocab, expressions }) {
  const [q, setQ] = useState(() => buildQuestion(vocab, expressions))
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  if (!q) return null

  const isCorrect = selected === q.answer

  function next() { setQ(buildQuestion(vocab, expressions)); setSelected(null); setSubmitted(false) }

  return (
    <div>
      <h4 style={{ fontSize: 13, fontWeight: 800, color: '#008080', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>
        🧪 Quiz rápido
      </h4>
      <div style={{ background: '#f8fafc', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(0,128,128,0.15)' }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '0 0 14px' }}>
          ¿Qué significa <em style={{ fontStyle: 'normal', color: '#FF6F61' }}>"{q.term}"</em>?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {q.options.map((opt, i) => {
            let bg = '#fff', border = '1.5px solid rgba(0,128,128,0.2)', color = '#374151', fw = 500
            if (submitted) {
              if (opt === q.answer) { bg = '#dcfce7'; border = '1.5px solid #22c55e'; color = '#166534'; fw = 700 }
              else if (opt === selected) { bg = '#fee2e2'; border = '1.5px solid #ef4444'; color = '#991b1b' }
            } else if (opt === selected) {
              bg = 'rgba(0,128,128,0.08)'; border = '1.5px solid #008080'; color = '#008080'
            }
            return (
              <button key={i} onClick={() => !submitted && setSelected(opt)} style={{
                background: bg, border, borderRadius: 10, padding: '10px 14px',
                fontSize: 13, color, fontWeight: fw, textAlign: 'left',
                cursor: submitted ? 'default' : 'pointer',
              }}>{opt}</button>
            )
          })}
        </div>
        {!submitted ? (
          <button onClick={() => selected && setSubmitted(true)} disabled={!selected} style={{
            background: selected ? AMBER : '#e5e7eb', color: selected ? '#fff' : '#94a3b8',
            border: 'none', borderRadius: 10, padding: '9px 18px',
            fontSize: 13, fontWeight: 700, cursor: selected ? 'pointer' : 'not-allowed',
          }}>Verificar →</button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: isCorrect ? '#16a34a' : '#dc2626' }}>
              {isCorrect ? '✅ ¡Correcto!' : `❌ Era: "${q.answer}"`}
            </span>
            <button onClick={next} style={{ background: '#008080', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Currículo tab ─────────────────────────────────────────────────────────────

function CurriculoTab({ token }) {
  const [data, setData] = useState(null)
  const [loadingC, setLoadingC] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [advancing, setAdvancing] = useState(false)
  const { lang } = useLanguage()

  useEffect(() => {
    fetch(`${API_BASE}/api/curriculum/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setData).finally(() => setLoadingC(false))
  }, [])

  async function handleAdvance() {
    setAdvancing(true)
    try {
      const r = await fetch(`${API_BASE}/api/curriculum/advance`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      })
      const d = await r.json()
      setData(prev => ({ ...prev, current_lesson_number: d.current_lesson_number }))
      setExpanded(null)
    } finally { setAdvancing(false) }
  }

  if (loadingC) return <p style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Cargando currículo…</p>
  if (!data?.enrolled) return (
    <div style={{ textAlign: 'center', padding: '48px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
      <p style={{ color: '#94a3b8', fontSize: 15 }}>Completa tu encuesta para recibir tu currículo personalizado.</p>
    </div>
  )

  const { curriculum, current_lesson_number, lessons } = data
  const total = lessons.length
  const pct = Math.round((current_lesson_number - 1) / total * 100)
  const LEVEL_BADGE = { beginner: { label: 'Principiante 🌱', bg: '#dcfce7', color: '#166534' }, intermediate: { label: 'Intermedio 📖', bg: '#dbeafe', color: '#1e40af' }, advanced: { label: 'Avanzado 🎓', bg: '#fdf4ff', color: '#7e22ce' } }
  const badge = LEVEL_BADGE[curriculum.level] || LEVEL_BADGE.beginner

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header card */}
      <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', border: '1px solid rgba(0,128,128,0.12)', boxShadow: '0 4px 16px rgba(0,128,128,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'inline-block', background: badge.bg, color: badge.color, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 800, marginBottom: 8 }}>{badge.label}</div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f2b3d', margin: 0 }}>{curriculum.title}</h2>
            {curriculum.description && <p style={{ fontSize: 13, color: '#64748b', margin: '6px 0 0', lineHeight: 1.5 }}>{curriculum.description}</p>}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#FF6F61', lineHeight: 1 }}>{current_lesson_number}<span style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8' }}>/{total}</span></div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>lección actual</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ background: '#f1f5f9', borderRadius: 999, height: 8, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#FF6F61,#ff9b91)', borderRadius: 999, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>{pct}% completado</div>
      </div>

      {/* Lesson list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {lessons.map(lesson => {
          const isCurrent = lesson.lesson_number === current_lesson_number
          const isDone = lesson.lesson_number < current_lesson_number
          const isOpen = expanded === lesson.lesson_number
          const vocab = lesson.vocabulary ? JSON.parse(lesson.vocabulary) : []
          const exprs = lesson.expressions ? JSON.parse(lesson.expressions) : []

          return (
            <div key={lesson.id} style={{ background: '#fff', borderRadius: 16, border: `2px solid ${isCurrent ? '#FF6F61' : isDone ? 'rgba(0,128,128,0.25)' : 'rgba(0,128,128,0.1)'}`, overflow: 'hidden', transition: 'border-color 0.2s', boxShadow: isCurrent ? '0 4px 16px rgba(255,111,97,0.15)' : 'none' }}>
              {/* Lesson header row */}
              <button onClick={() => setExpanded(isOpen ? null : lesson.lesson_number)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: isCurrent ? '#FF6F61' : isDone ? '#008080' : 'rgba(0,128,128,0.08)', color: isCurrent || isDone ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, flexShrink: 0 }}>
                  {isDone ? '✓' : lesson.lesson_number}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: isCurrent ? '#FF6F61' : isDone ? '#008080' : '#6b7280', lineHeight: 1.3 }}>{lesson.title}</div>
                  {isCurrent && <div style={{ fontSize: 11, color: '#FF6F61', fontWeight: 700, marginTop: 2 }}>← Lección actual</div>}
                </div>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ borderTop: '1px solid rgba(0,128,128,0.1)', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Outline */}
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: '#008080', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>📋 Guía de la lección</h4>
                    <pre style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 16px', fontSize: 13, lineHeight: 1.7, color: '#374151', whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0, border: '1px solid rgba(0,128,128,0.1)' }}>{(lang === 'es' && lesson.outline_es) ? lesson.outline_es : lesson.outline}</pre>
                  </div>

                  {/* Homework — vocabulary */}
                  {vocab.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: '#008080', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>📚 Vocabulario — estudia antes de la sesión</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 8 }}>
                        {vocab.map((v, i) => (
                          <div key={i} style={{ background: 'rgba(0,128,128,0.05)', border: '1px solid rgba(0,128,128,0.15)', borderRadius: 10, padding: '10px 14px' }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f2b3d' }}>{v.word}</div>
                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2, lineHeight: 1.4 }}>{v.definition}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Homework — expressions */}
                  {exprs.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: '#FF6F61', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>💬 Expresiones — practica estas frases</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {exprs.map((e, i) => (
                          <div key={i} style={{ background: 'rgba(255,111,97,0.05)', border: '1px solid rgba(255,111,97,0.2)', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 12 }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#FF6F61', minWidth: 0, flexShrink: 0, maxWidth: '40%' }}>&ldquo;{e.expression}&rdquo;</div>
                            <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{e.meaning}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prepare questions reminder */}
                  <div style={{ background: 'rgba(255,111,97,0.06)', border: '1px solid rgba(255,111,97,0.2)', borderRadius: 12, padding: '14px 18px' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#FF6F61', marginBottom: 4 }}>✏️ Tu tarea</div>
                    <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.5 }}>Estudia el vocabulario y las expresiones de arriba. Prepara <strong>3 preguntas</strong> para hacerle a tu tutor sobre este tema durante la sesión.</p>
                  </div>

                  {/* Flashcards */}
                  {(vocab.length > 0 || exprs.length > 0) && (
                    <div style={{ borderTop: '1px solid rgba(0,128,128,0.1)', paddingTop: 20 }}>
                      <FlashcardDeck vocab={vocab} expressions={exprs} />
                    </div>
                  )}

                  {/* Quiz */}
                  {(vocab.length + exprs.length) >= 2 && (
                    <div style={{ borderTop: '1px solid rgba(0,128,128,0.1)', paddingTop: 20 }}>
                      <LessonQuiz vocab={vocab} expressions={exprs} />
                    </div>
                  )}

                  {/* Advance button — only on current lesson */}
                  {isCurrent && current_lesson_number < total && (
                    <button onClick={handleAdvance} disabled={advancing}
                      style={{ alignSelf: 'flex-end', background: advancing ? 'rgba(0,128,128,0.4)' : '#008080', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 24px', fontSize: 14, fontWeight: 800, cursor: advancing ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(0,128,128,0.25)' }}>
                      {advancing ? 'Actualizando…' : 'Marcar como completada → Siguiente lección'}
                    </button>
                  )}
                  {isCurrent && current_lesson_number === total && (
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#008080' }}>¡Has completado todo el currículo!</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const { user, token } = useAuth()
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(() => searchParams.get('tab') || 'inicio')
  const [meetings, setMeetings] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/meetings`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE}/api/assignments`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([m, a]) => { setMeetings(m); setAssignments(a) }).finally(() => setLoading(false))
  }, [])

  async function handleComplete(assignmentId) {
    await fetch(`${API_BASE}/api/assignments/${assignmentId}/complete`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` },
    })
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, completed_by_me: true } : a))
  }

  async function handleUncomplete(assignmentId) {
    await fetch(`${API_BASE}/api/assignments/${assignmentId}/complete`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, completed_by_me: false } : a))
  }

  const pendingCount = assignments.filter(a => !a.completed_by_me).length

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F1F8F9', position: 'relative', zIndex: 1 }}>
      <PublicNav />
      <p style={{ color: '#9ca3af', textAlign: 'center', padding: 60 }}>Cargando…</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F1F8F9', position: 'relative', zIndex: 1 }}>
      <PublicNav />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 24, borderBottom: '2px solid #fde68a' }}>
          <Tab id="inicio"    label="🏠 Inicio"                           active={tab === 'inicio'}    onClick={setTab} />
          <Tab id="tareas"    label={`📝 ${t('student.tab.tasks')}`}    active={tab === 'tareas'}    onClick={setTab} badge={pendingCount} />
          <Tab id="horario"   label="📅 Horario"                          active={tab === 'horario'}   onClick={setTab} />
          <Tab id="mensajes"  label={`💬 ${t('student.tab.messages')}`} active={tab === 'mensajes'}  onClick={setTab} />
          <Tab id="lecciones" label={`📖 ${t('student.tab.lessons')}`}  active={tab === 'lecciones'} onClick={setTab} />
        </div>

        {tab === 'inicio'    && <InicioTab user={user} meetings={meetings} assignments={assignments} onTabChange={setTab} token={token} />}
        {tab === 'tareas'    && <TareasTab token={token} assignments={assignments} onComplete={handleComplete} onUncomplete={handleUncomplete} />}
        {tab === 'horario'   && <HorarioTab meetings={meetings} />}
        {tab === 'mensajes'  && <MensajesTab token={token} user={user} />}
        {tab === 'lecciones' && <LeccionesTab token={token} />}
      </div>
    </div>
  )
}
