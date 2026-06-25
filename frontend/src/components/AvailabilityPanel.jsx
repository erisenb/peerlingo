import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../api'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const WEEKENDS = ['Sat', 'Sun']
const MIN_H    = 15   // 3 PM
const MAX_H    = 23   // 11 PM
const MIN_SPAN = 2

function fmtHour(h) {
  if (h === 12) return '12 PM'
  if (h < 12)  return `${h} AM`
  if (h === 24) return '12 AM'
  return `${h - 12} PM`
}

// Parse "17-21|15-20" → { wd: {s,e}, we: {s,e} }
// Also handles legacy single-block format "17-21"
function parseBlocks(str) {
  const result = { wd: null, we: null }
  if (!str) return result
  const [wdPart, wePart] = str.split('|')
  function parsePart(p) {
    if (!p) return null
    const [a, b] = p.split('-').map(Number)
    if (!isNaN(a) && !isNaN(b) && b - a >= MIN_SPAN) return { s: a, e: b }
    return null
  }
  result.wd = parsePart(wdPart)
  result.we = parsePart(wePart)
  return result
}

// ── Dual-handle range slider ───────────────────────────────────────────────────

function RangeSlider({ start, end, onStart, onEnd, color }) {
  const trackRef = useRef()
  const startRef = useRef(start)
  const endRef   = useRef(end)
  const dragging = useRef(null)
  startRef.current = start
  endRef.current   = end

  function clientToHour(clientX) {
    const rect = trackRef.current.getBoundingClientRect()
    const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round(MIN_H + frac * (MAX_H - MIN_H))
  }

  useEffect(() => {
    function onMove(e) {
      if (!dragging.current) return
      const cx = e.touches ? e.touches[0].clientX : e.clientX
      const h  = clientToHour(cx)
      if (dragging.current === 'start') {
        onStart(Math.max(MIN_H, Math.min(h, endRef.current - MIN_SPAN)))
      } else {
        onEnd(Math.min(MAX_H, Math.max(h, startRef.current + MIN_SPAN)))
      }
    }
    function onUp() { dragging.current = null }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend',  onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend',  onUp)
    }
  }, [onStart, onEnd])

  const sp = ((start - MIN_H) / (MAX_H - MIN_H)) * 100
  const ep = ((end   - MIN_H) / (MAX_H - MIN_H)) * 100

  const handle = (pct) => ({
    position: 'absolute', top: '50%', left: `${pct}%`,
    width: 22, height: 22, borderRadius: '50%',
    background: '#fff', border: `3px solid ${color}`,
    boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
    transform: 'translate(-50%, -50%)',
    cursor: 'grab', zIndex: 2, boxSizing: 'border-box', userSelect: 'none',
  })

  const hours = Array.from({ length: MAX_H - MIN_H + 1 }, (_, i) => MIN_H + i)

  return (
    <div>
      {/* Selected range label */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 20, fontWeight: 900, color, letterSpacing: '-0.3px' }}>
          {fmtHour(start)} – {fmtHour(end)}
        </span>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginLeft: 8 }}>
          ({end - start} {end - start === 1 ? 'hr' : 'hrs'})
        </span>
      </div>

      {/* Track */}
      <div ref={trackRef} style={{ position: 'relative', height: 38, userSelect: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 6, transform: 'translateY(-50%)', background: 'rgba(0,128,128,0.12)', borderRadius: 3 }} />
        <div style={{ position: 'absolute', top: '50%', left: `${sp}%`, width: `${ep - sp}%`, height: 6, transform: 'translateY(-50%)', background: color, borderRadius: 3 }} />
        <div style={handle(sp)}
          onMouseDown={e => { e.preventDefault(); dragging.current = 'start' }}
          onTouchStart={() => { dragging.current = 'start' }} />
        <div style={handle(ep)}
          onMouseDown={e => { e.preventDefault(); dragging.current = 'end' }}
          onTouchStart={() => { dragging.current = 'end' }} />
      </div>

      {/* Tick labels — show every other hour to avoid crowding */}
      <div style={{ position: 'relative', height: 18, marginTop: 2 }}>
        {hours.map(h => {
          const pct = ((h - MIN_H) / (MAX_H - MIN_H)) * 100
          const isActive = h === start || h === end
          const show = isActive || h === MIN_H || h === MAX_H || (h - MIN_H) % 2 === 0
          if (!show) return null
          return (
            <span key={h} style={{
              position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)',
              fontSize: 10, fontWeight: isActive ? 800 : 500,
              color: isActive ? color : '#b0c4ce', whiteSpace: 'nowrap',
            }}>
              {fmtHour(h)}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ── Day group selector ─────────────────────────────────────────────────────────

function DayGroup({ days, selected, onToggle, color, colorBg }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {days.map(d => {
        const on = selected.includes(d)
        return (
          <button key={d} onClick={() => onToggle(d)}
            style={{
              padding: '7px 13px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: on ? colorBg : '#f8fafc',
              border: `2px solid ${on ? color : 'rgba(0,128,128,0.15)'}`,
              color: on ? color : '#6b7280',
              transition: 'all 0.15s',
            }}>
            {d}
          </button>
        )
      })}
    </div>
  )
}

// ── Main panel ─────────────────────────────────────────────────────────────────

export default function AvailabilityPanel({ isTutor = false }) {
  const { user, token, refreshUser } = useAuth()

  const saved = parseBlocks(user?.availability_times)
  const savedDays = user?.availability_days ? user.availability_days.split(',') : []

  const [selDays,   setSelDays]   = useState(savedDays)
  const [wdStart,   setWdStart]   = useState(saved.wd?.s ?? 17)
  const [wdEnd,     setWdEnd]     = useState(saved.wd?.e ?? 21)
  const [weStart,   setWeStart]   = useState(saved.we?.s ?? 15)
  const [weEnd,     setWeEnd]     = useState(saved.we?.e ?? 19)
  const [saving,    setSaving]    = useState(false)
  const [savedOk,   setSavedOk]   = useState(false)
  const [error,     setError]     = useState('')

  const hasWeekday = selDays.some(d => WEEKDAYS.includes(d))
  const hasWeekend = selDays.some(d => WEEKENDS.includes(d))

  function toggleDay(d) {
    setSelDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
    setSavedOk(false)
  }

  async function handleSave() {
    setSaving(true); setSavedOk(false); setError('')
    try {
      const wdBlock = hasWeekday ? `${wdStart}-${wdEnd}` : ''
      const weBlock = hasWeekend ? `${weStart}-${weEnd}` : ''
      const blocks  = hasWeekend ? [`${wdBlock}|${weBlock}`] : (hasWeekday ? [wdBlock] : [])

      const res = await fetch(`${API_BASE}/api/profile/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ days: selDays, blocks }),
      })
      if (!res.ok) throw new Error()
      await refreshUser()
      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 3000)
    } catch {
      setError('Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const color   = isTutor ? '#008080' : '#FF6F61'
  const colorBg = isTutor ? 'rgba(0,128,128,0.1)' : 'rgba(255,111,97,0.1)'

  const sectionHead = {
    fontSize: 11, fontWeight: 800, color: '#3d6275',
    textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10,
  }

  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '24px 22px', border: '1px solid rgba(0,128,128,0.12)', boxShadow: '0 2px 12px rgba(0,128,128,0.07)', marginTop: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 900, color: '#0f2b3d', marginBottom: 4 }}>
        🗓️ Your Availability
      </h3>
      <p style={{ fontSize: 13, color: '#7a9cac', marginBottom: 24, lineHeight: 1.5 }}>
        {isTutor
          ? "Let students know when you're generally free. This helps us find the best match."
          : "Tell us when you're generally free to meet with your tutor."}
      </p>

      {/* ── Weekdays ── */}
      <div style={{ marginBottom: 28, padding: '18px 18px 20px', background: 'rgba(0,128,128,0.03)', borderRadius: 14, border: '1px solid rgba(0,128,128,0.1)' }}>
        <div style={sectionHead}>Weekdays — Mon to Fri</div>
        <DayGroup days={WEEKDAYS} selected={selDays} onToggle={toggleDay} color={color} colorBg={colorBg} />

        {hasWeekday && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7a9cac', marginBottom: 12 }}>Weekday time window</div>
            <RangeSlider
              start={wdStart} end={wdEnd}
              onStart={v => { setWdStart(v); setSavedOk(false) }}
              onEnd={v   => { setWdEnd(v);   setSavedOk(false) }}
              color={color}
            />
          </div>
        )}
      </div>

      {/* ── Weekends ── */}
      <div style={{ marginBottom: 24, padding: '18px 18px 20px', background: 'rgba(255,111,97,0.03)', borderRadius: 14, border: '1px solid rgba(255,111,97,0.12)' }}>
        <div style={{ ...sectionHead, color: '#c05a50' }}>Weekends — Sat & Sun</div>
        <DayGroup days={WEEKENDS} selected={selDays} onToggle={toggleDay} color={color} colorBg={colorBg} />

        {hasWeekend && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7a9cac', marginBottom: 12 }}>Weekend time window</div>
            <RangeSlider
              start={weStart} end={weEnd}
              onStart={v => { setWeStart(v); setSavedOk(false) }}
              onEnd={v   => { setWeEnd(v);   setSavedOk(false) }}
              color={color}
            />
          </div>
        )}
      </div>

      <p style={{ fontSize: 11, color: '#b0c4ce', margin: '0 0 16px', lineHeight: 1.5 }}>
        Drag either handle to set your window. Minimum 2 hours. Select days to show the slider.
      </p>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '8px 12px', fontSize: 13, color: '#dc2626', marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={handleSave} disabled={saving}
          style={{
            background: saving ? 'rgba(0,128,128,0.45)' : color,
            color: '#fff', border: 'none', borderRadius: 12,
            padding: '11px 26px', fontSize: 14, fontWeight: 800,
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: `0 4px 14px ${colorBg}`,
            transition: 'all 0.15s',
          }}>
          {saving ? 'Saving…' : 'Save Availability'}
        </button>
        {savedOk && <span style={{ fontSize: 13, fontWeight: 700, color: '#008080' }}>✓ Saved!</span>}
      </div>
    </div>
  )
}
