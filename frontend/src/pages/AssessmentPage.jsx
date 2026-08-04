import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../api'
import PublicNav from '../components/PublicNav'

const TEAL   = '#008080'
const CORAL  = '#FF6F61'
const BG     = '#F1F8F9'

// ── Question data ─────────────────────────────────────────────────────────────

const COUNTRIES = [
  'Argentina','Bolivia','Chile','Colombia','Costa Rica','Cuba','Ecuador',
  'El Salvador','Guatemala','Honduras','México','Nicaragua','Panamá','Paraguay',
  'Perú','Puerto Rico','República Dominicana','Uruguay','Venezuela','Otro',
]

const VOCAB_QUESTIONS = [
  { key: 'vocab_q1', en: '"dog"',     hint: '🐕', choices: [['a','perro'],['b','gato'],['c','caballo'],['d','pájaro']] },
  { key: 'vocab_q2', en: '"house"',   hint: '🏠', choices: [['a','escuela'],['b','casa'],['c','carro'],['d','libro']] },
  { key: 'vocab_q3', en: '"water"',   hint: '💧', choices: [['a','fuego'],['b','tierra'],['c','agua'],['d','aire']] },
  { key: 'vocab_q4', en: '"teacher"', hint: '👩‍🏫', choices: [['a','doctor'],['b','maestro'],['c','cocinero'],['d','estudiante']] },
  { key: 'vocab_q5', en: '"apple"',   hint: '🍎', choices: [['a','naranja'],['b','uva'],['c','manzana'],['d','banana']] },
  { key: 'vocab_q6', en: '"happy"',   hint: '😊', choices: [['a','triste'],['b','enojado'],['c','cansado'],['d','feliz']] },
]

const READ_BASIC = [
  {
    key: 'read_q1',
    sentence: '"My name is Anna."',
    question_es: '¿Cómo se llama?',
    question_en: 'What is her name?',
    choices: [['a','Maria'],['b','Anna'],['c','Sofia'],['d','Emma']],
  },
  {
    key: 'read_q2',
    sentence: '"I have two brothers."',
    question_es: '¿Cuántos hermanos tiene?',
    question_en: 'How many brothers?',
    choices: [['a','Uno / One'],['b','Dos / Two'],['c','Tres / Three'],['d','Cuatro / Four']],
  },
  {
    key: 'read_q3',
    sentence: '"The dog is sleeping."',
    question_es: '¿Qué está haciendo el perro?',
    question_en: 'What is the dog doing?',
    choices: [['a','Corriendo / Running'],['b','Comiendo / Eating'],['c','Jugando / Playing'],['d','Durmiendo / Sleeping']],
  },
  {
    key: 'read_q4',
    sentence: '"She drinks water every morning."',
    question_es: '¿Qué bebe ella cada mañana?',
    question_en: 'What does she drink every morning?',
    choices: [['a','Jugo / Juice'],['b','Agua / Water'],['c','Leche / Milk'],['d','Café / Coffee']],
  },
]

const PASSAGE = 'Maria lives in Lima, Peru. She is 15 years old and goes to school every day. She likes reading and playing soccer with her friends.'
const PASSAGE_ES = 'María vive en Lima, Perú. Tiene 15 años y va a la escuela todos los días. Le gusta leer y jugar fútbol con sus amigos.'

const READ_COMP = [
  {
    key: 'read_q5',
    question_es: '¿Dónde vive María?',
    question_en: 'Where does Maria live?',
    choices: [['a','México'],['b','Lima, Perú'],['c','Colombia'],['d','Argentina']],
  },
  {
    key: 'read_q6',
    question_es: '¿Cuántos años tiene?',
    question_en: 'How old is she?',
    choices: [['a','12'],['b','13'],['c','14'],['d','15']],
  },
  {
    key: 'read_q7',
    question_es: '¿Qué le gusta hacer?',
    question_en: 'What does she like to do?',
    choices: [['a','Cocinar / Cooking'],['b','Nadar / Swimming'],['c','Leer y fútbol / Reading & soccer'],['d','Bailar / Dancing']],
  },
  {
    key: 'read_q8',
    question_es: '¿Cuándo va a la escuela?',
    question_en: 'When does she go to school?',
    choices: [['a','Los fines de semana / Weekends'],['b','A veces / Sometimes'],['c','Todos los días / Every day'],['d','Nunca / Never']],
  },
]

const GRAMMAR_QUESTIONS = [
  { key: 'gram_q1', sentence: 'I ___ a student.', choices: [['a','am'],['b','is'],['c','are'],['d','be']] },
  { key: 'gram_q2', sentence: 'She ___ soccer every weekend.', choices: [['a','play'],['b','plays'],['c','playing'],['d','played']] },
  { key: 'gram_q3', sentence: 'There ___ two dogs in the park.', choices: [['a','am'],['b','is'],['c','are'],['d','be']] },
  { key: 'gram_q4', sentence: 'What ___ your name?', choices: [['a','am'],['b','is'],['c','are'],['d','be']] },
  { key: 'gram_q5', sentence: 'I ___ English right now.', choices: [['a','learn'],['b','learns'],['c','am learning'],['d','is learning']] },
]

const PLACEMENT_LABELS = {
  'Beginner A':        { emoji: '🌱', color: '#15803d', bg: '#dcfce7', desc_es: 'Estás comenzando tu viaje en inglés. ¡Eso es increíble!', desc_en: "You're just starting your English journey. That's amazing!" },
  'Beginner B':        { emoji: '🌿', color: '#0369a1', bg: '#dbeafe', desc_es: 'Conoces algunas palabras básicas en inglés. ¡Buen trabajo!', desc_en: 'You know some basic English words. Great start!' },
  'Elementary':        { emoji: '📖', color: '#d97706', bg: '#fef3c7', desc_es: 'Puedes entender frases simples en inglés. ¡Sigue así!', desc_en: 'You can understand simple English phrases. Keep it up!' },
  'Pre-Intermediate':  { emoji: '🚀', color: '#7c3aed', bg: '#f5f3ff', desc_es: 'Tienes una buena base en inglés. ¡Casi eres intermedio!', desc_en: 'You have a solid English foundation. Almost intermediate!' },
  'Intermediate':      { emoji: '🌟', color: '#FF6F61', bg: 'rgba(255,111,97,0.1)', desc_es: '¡Tu inglés es impresionante! Puedes comunicarte bien.', desc_en: 'Your English is impressive! You can communicate well.' },
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function ChoiceBtn({ label, value, selected, onSelect }) {
  const active = selected === value
  return (
    <button onClick={() => onSelect(value)} style={{
      width: '100%', textAlign: 'left', padding: '12px 16px',
      borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: active ? 700 : 500,
      border: `2px solid ${active ? TEAL : 'rgba(0,128,128,0.2)'}`,
      background: active ? 'rgba(0,128,128,0.08)' : '#fff',
      color: active ? TEAL : '#374151',
      transition: 'all 0.15s',
    }}>
      <span style={{ display: 'inline-block', width: 22, height: 22, lineHeight: '22px', textAlign: 'center',
        borderRadius: '50%', background: active ? TEAL : 'rgba(0,128,128,0.1)',
        color: active ? '#fff' : '#7a9cac', fontSize: 12, fontWeight: 800, marginRight: 10, flexShrink: 0 }}>
        {value.toUpperCase()}
      </span>
      {label}
    </button>
  )
}

function SectionCard({ children, style }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '28px 28px',
      border: '1px solid rgba(0,128,128,0.15)', boxShadow: '0 4px 20px rgba(0,128,128,0.08)',
      ...style,
    }}>
      {children}
    </div>
  )
}

function SectionTitle({ emoji, title_es, title_en, subtitle_es }) {
  return (
    <div style={{ marginBottom: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 44, marginBottom: 8 }}>{emoji}</div>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f2b3d', margin: '0 0 4px' }}>{title_es}</h2>
      <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 4px' }}>{title_en}</p>
      {subtitle_es && <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{subtitle_es}</p>}
    </div>
  )
}

// ── Section components ────────────────────────────────────────────────────────

function Sec1BasicInfo({ answers, onChange }) {
  const set = (k, v) => onChange({ ...answers, [k]: v })
  const selectStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid rgba(0,128,128,0.25)', background: '#fff',
    fontSize: 14, color: '#374151', outline: 'none',
  }
  const inputStyle = { ...selectStyle }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
          ¿Cómo prefieres que te llamen? / What should we call you?
        </label>
        <input
          type="text" placeholder="Ej: Maria, Sofía…" value={answers.info_name || ''}
          onChange={e => set('info_name', e.target.value)} style={inputStyle}
        />
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
          ¿Cuántos años tienes? / How old are you?
        </label>
        <select value={answers.info_age || ''} onChange={e => set('info_age', e.target.value)} style={selectStyle}>
          <option value="">Selecciona / Select…</option>
          {Array.from({ length: 16 }, (_, i) => i + 10).map(n => (
            <option key={n} value={String(n)}>{n} años / years old</option>
          ))}
          <option value="26+">26+ años</option>
        </select>
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
          ¿De qué país eres? / What country are you from?
        </label>
        <select value={answers.info_country || ''} onChange={e => set('info_country', e.target.value)} style={selectStyle}>
          <option value="">Selecciona / Select…</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 10 }}>
          ¿Has estudiado inglés antes? / Have you studied English before?
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          {[['yes', 'Sí / Yes'], ['no', 'No']].map(([v, label]) => (
            <button key={v} onClick={() => set('info_studied_before', v)} style={{
              flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700,
              border: `2px solid ${answers.info_studied_before === v ? TEAL : 'rgba(0,128,128,0.2)'}`,
              background: answers.info_studied_before === v ? 'rgba(0,128,128,0.08)' : '#fff',
              color: answers.info_studied_before === v ? TEAL : '#6b7280',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {answers.info_studied_before === 'yes' && (
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
            ¿Por cuántos años? / For how many years?
          </label>
          <select value={answers.info_years_studied || ''} onChange={e => set('info_years_studied', e.target.value)} style={selectStyle}>
            <option value="">Selecciona / Select…</option>
            {['Menos de 1 año / Less than 1 year','1 año / 1 year','2 años / 2 years','3 años / 3 years','4+ años / 4+ years'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 10 }}>
          ¿Con qué frecuencia escuchas inglés? / How often do you hear English?
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['never', 'Nunca / Never'],
            ['rarely', 'Raramente / Rarely'],
            ['sometimes', 'A veces / Sometimes'],
            ['often', 'Seguido / Often'],
            ['very_often', 'Muy seguido / Very often'],
          ].map(([v, label]) => (
            <button key={v} onClick={() => set('info_hear_english', v)} style={{
              textAlign: 'left', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              border: `2px solid ${answers.info_hear_english === v ? TEAL : 'rgba(0,128,128,0.15)'}`,
              background: answers.info_hear_english === v ? 'rgba(0,128,128,0.07)' : '#fafafa',
              color: answers.info_hear_english === v ? TEAL : '#374151',
            }}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Sec2Vocab({ answers, onChange }) {
  const set = (k, v) => onChange({ ...answers, [k]: v })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {VOCAB_QUESTIONS.map((q, i) => (
        <div key={q.key}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
            {i + 1}. {q.hint} ¿Qué significa {q.en} en español?
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400, marginLeft: 8 }}>What does {q.en} mean in Spanish?</span>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.choices.map(([v, label]) => (
              <ChoiceBtn key={v} label={label} value={v} selected={answers[q.key]} onSelect={val => set(q.key, val)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Sec3Reading({ answers, onChange }) {
  const set = (k, v) => onChange({ ...answers, [k]: v })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Basic reading */}
      <div>
        <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 16 }}>
          Lee cada oración en inglés y responde la pregunta. / Read each English sentence and answer the question.
        </p>
        {READ_BASIC.map((q, i) => (
          <div key={q.key} style={{ marginBottom: 24 }}>
            <div style={{
              background: 'rgba(0,128,128,0.06)', borderRadius: 12, padding: '12px 16px',
              border: '1px solid rgba(0,128,128,0.15)', marginBottom: 10,
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#0f2b3d' }}>{q.sentence}</span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
              {i + 1}. {q.question_es}
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400, marginLeft: 8 }}>({q.question_en})</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {q.choices.map(([v, label]) => (
                <ChoiceBtn key={v} label={label} value={v} selected={answers[q.key]} onSelect={val => set(q.key, val)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reading comprehension passage */}
      <div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,128,128,0.05), rgba(255,111,97,0.03))',
          borderRadius: 14, padding: '18px 20px',
          border: '1.5px solid rgba(0,128,128,0.18)', marginBottom: 20,
        }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: TEAL, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Lee el párrafo / Read the paragraph</p>
          <p style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.7, margin: '0 0 10px', fontWeight: 600 }}>{PASSAGE}</p>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{PASSAGE_ES}</p>
        </div>
        {READ_COMP.map((q, i) => (
          <div key={q.key} style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
              {READ_BASIC.length + i + 1}. {q.question_es}
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400, marginLeft: 8 }}>({q.question_en})</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {q.choices.map(([v, label]) => (
                <ChoiceBtn key={v} label={label} value={v} selected={answers[q.key]} onSelect={val => set(q.key, val)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Sec4Grammar({ answers, onChange }) {
  const set = (k, v) => onChange({ ...answers, [k]: v })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600, margin: '0 0 4px' }}>
        Completa cada oración con la palabra correcta. / Choose the correct word to complete each sentence.
      </p>
      {GRAMMAR_QUESTIONS.map((q, i) => (
        <div key={q.key}>
          <div style={{
            background: 'rgba(255,111,97,0.06)', borderRadius: 12, padding: '12px 16px',
            border: '1px solid rgba(255,111,97,0.2)', marginBottom: 10,
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{i + 1}. {q.sentence}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {q.choices.map(([v, label]) => (
              <ChoiceBtn key={v} label={label} value={v} selected={answers[q.key]} onSelect={val => set(q.key, val)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Sec5Finish({ answers, onChange }) {
  const set = (k, v) => onChange({ ...answers, [k]: v })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <label style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: 8 }}>
          ✏️ ¿Puedes escribir unas palabras en inglés para presentarte? (Opcional)
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400, display: 'block', marginTop: 2 }}>
            Can you write a few words in English to introduce yourself? (Optional)
          </span>
        </label>
        <textarea
          rows={4}
          placeholder="E.g. Hello! My name is Maria. I am 15 years old…"
          value={answers.speaking_text || ''}
          onChange={e => set('speaking_text', e.target.value)}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 12,
            border: '1.5px solid rgba(0,128,128,0.25)', background: '#fafafa',
            fontSize: 14, lineHeight: 1.6, color: '#374151',
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      <div>
        <label style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: 12 }}>
          💬 ¿Qué tan seguro(a) te sientes hablando inglés? / How confident do you feel speaking English?
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['very', '😄 Muy seguro(a) / Very confident'],
            ['somewhat', '🙂 Algo seguro(a) / Somewhat confident'],
            ['not_very', '😐 No mucho / Not very confident'],
            ['not_at_all', '😟 Para nada / Not at all confident'],
          ].map(([v, label]) => (
            <button key={v} onClick={() => set('confidence', v)} style={{
              textAlign: 'left', padding: '12px 16px', borderRadius: 12, cursor: 'pointer',
              fontSize: 14, fontWeight: answers.confidence === v ? 700 : 500,
              border: `2px solid ${answers.confidence === v ? CORAL : 'rgba(255,111,97,0.2)'}`,
              background: answers.confidence === v ? 'rgba(255,111,97,0.08)' : '#fff',
              color: answers.confidence === v ? CORAL : '#374151',
              transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{
        background: 'rgba(0,128,128,0.06)', borderRadius: 14, padding: '16px 18px',
        border: '1px solid rgba(0,128,128,0.15)',
      }}>
        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
          🎉 <strong>¡Casi terminas!</strong> Al enviar, calcularemos tu nivel de inglés para que tu tutor pueda preparar
          las mejores sesiones para ti. / <em>Almost done! After submitting, we'll calculate your English level so your
          tutor can prepare the best sessions for you.</em>
        </p>
      </div>
    </div>
  )
}

// ── Results screen ────────────────────────────────────────────────────────────

function ResultsScreen({ result, onDone }) {
  const info = PLACEMENT_LABELS[result.placement_level] || PLACEMENT_LABELS['Beginner A']
  const total = result.total_score ?? 0
  const maxScore = 19

  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>{info.emoji}</div>
      <div style={{
        display: 'inline-block', background: info.bg, color: info.color,
        borderRadius: 20, padding: '6px 20px', fontSize: 15, fontWeight: 800, marginBottom: 16,
      }}>
        {result.placement_level}
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f2b3d', margin: '0 0 8px' }}>
        ¡{result.placement_level}!
      </h2>
      <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6, margin: '0 0 24px' }}>
        {info.desc_es}<br />
        <span style={{ fontSize: 13, color: '#94a3b8' }}>{info.desc_en}</span>
      </p>

      {/* Score breakdown */}
      <div style={{
        background: '#fff', borderRadius: 18, padding: '22px 24px',
        border: '1px solid rgba(0,128,128,0.15)', textAlign: 'left', marginBottom: 24,
        boxShadow: '0 4px 16px rgba(0,128,128,0.07)',
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: TEAL, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
          Tus resultados / Your Results
        </h3>

        <ScoreBar label="Vocabulario / Vocabulary" score={result.vocab_score} max={6} color="#16a34a" />
        <ScoreBar label="Lectura / Reading" score={result.reading_score} max={8} color="#0369a1" />
        <ScoreBar label="Gramática / Grammar" score={result.grammar_score} max={5} color="#7c3aed" />

        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Total</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: CORAL }}>{total} / {maxScore}</span>
        </div>
      </div>

      <div style={{ background: 'rgba(0,128,128,0.06)', borderRadius: 14, padding: '14px 18px', marginBottom: 24, textAlign: 'left' }}>
        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
          🎓 Tu tutor verá estos resultados y preparará sesiones especiales para ti.
          <br /><em>Your tutor will see these results and prepare special sessions for you.</em>
        </p>
      </div>

      <button onClick={onDone} style={{
        width: '100%', padding: '14px', borderRadius: 14, border: 'none',
        background: `linear-gradient(135deg, ${TEAL}, #00a0a0)`,
        color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(0,128,128,0.3)',
      }}>
        🏠 Ir a mi tablero / Go to my Dashboard
      </button>
    </div>
  )
}

function ScoreBar({ label, score, max, color }) {
  const pct = Math.round((score ?? 0) / max * 100)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>{score ?? 0}/{max}</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: '#f1f5f9', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 1, emoji: '👋', label_es: 'Info básica', label_en: 'Basic Info' },
  { id: 2, emoji: '📝', label_es: 'Vocabulario', label_en: 'Vocabulary' },
  { id: 3, emoji: '📖', label_es: 'Lectura',     label_en: 'Reading' },
  { id: 4, emoji: '✍️', label_es: 'Gramática',   label_en: 'Grammar' },
  { id: 5, emoji: '💬', label_es: 'Confianza',   label_en: 'Confidence' },
]

function ProgressBar({ current }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>
          Sección {current} de {SECTIONS.length}
        </span>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>
          {Math.round((current - 1) / SECTIONS.length * 100)}% completado
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: '#e5e7eb', overflow: 'hidden' }}>
        <div style={{
          width: `${(current / SECTIONS.length) * 100}%`,
          height: '100%', borderRadius: 999,
          background: `linear-gradient(90deg, ${TEAL}, ${CORAL})`,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {SECTIONS.map(s => (
          <div key={s.id} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', margin: '0 auto 2px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: s.id <= current ? TEAL : '#e5e7eb',
              fontSize: 13,
              boxShadow: s.id === current ? `0 0 0 3px rgba(0,128,128,0.25)` : 'none',
              transition: 'all 0.3s',
            }}>
              {s.id < current ? <span style={{ color: '#fff', fontWeight: 800, fontSize: 11 }}>✓</span>
                : <span>{s.emoji}</span>}
            </div>
            <div style={{ fontSize: 9, color: s.id <= current ? TEAL : '#9ca3af', fontWeight: 700, display: 'none' }}>
              {s.label_es}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Validation ────────────────────────────────────────────────────────────────

function validate(section, answers) {
  if (section === 1) {
    if (!answers.info_name?.trim()) return 'Por favor ingresa tu nombre. / Please enter your name.'
    if (!answers.info_age) return 'Por favor selecciona tu edad. / Please select your age.'
    if (!answers.info_country) return 'Por favor selecciona tu país. / Please select your country.'
    if (!answers.info_studied_before) return 'Por favor responde si has estudiado inglés. / Please answer if you studied English.'
    if (!answers.info_hear_english) return 'Por favor responde con qué frecuencia escuchas inglés. / Please answer how often you hear English.'
  }
  if (section === 2) {
    const missing = VOCAB_QUESTIONS.filter(q => !answers[q.key])
    if (missing.length) return `Por favor responde todas las preguntas de vocabulario. / Please answer all vocabulary questions. (${VOCAB_QUESTIONS.length - missing.length}/${VOCAB_QUESTIONS.length})`
  }
  if (section === 3) {
    const all = [...READ_BASIC, ...READ_COMP]
    const missing = all.filter(q => !answers[q.key])
    if (missing.length) return `Por favor responde todas las preguntas de lectura. / Please answer all reading questions. (${all.length - missing.length}/${all.length})`
  }
  if (section === 4) {
    const missing = GRAMMAR_QUESTIONS.filter(q => !answers[q.key])
    if (missing.length) return `Por favor responde todas las preguntas de gramática. / Please answer all grammar questions. (${GRAMMAR_QUESTIONS.length - missing.length}/${GRAMMAR_QUESTIONS.length})`
  }
  return null
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AssessmentPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState(1)
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  function nextSection() {
    const err = validate(section, answers)
    if (err) { setError(err); return }
    setError('')
    setSection(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function prevSection() {
    setError('')
    setSection(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    if (!answers.confidence) {
      setError('Por favor selecciona tu nivel de confianza. / Please select your confidence level.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/assessment/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Error')
      setResult(data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message || 'Error al enviar. Por favor intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const sec = SECTIONS[section - 1]

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <PublicNav />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* Header */}
        {!result && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f2b3d', margin: '0 0 6px' }}>
              🎓 Evaluación de Inglés
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
              English Placement Assessment · ~15 minutos / minutes
            </p>
          </div>
        )}

        {result ? (
          <SectionCard>
            <ResultsScreen result={result} onDone={() => navigate('/dashboard/student')} />
          </SectionCard>
        ) : (
          <>
            <ProgressBar current={section} />

            <SectionCard>
              {section === 1 && (
                <>
                  <SectionTitle emoji="👋" title_es="Información básica" title_en="Basic Information" subtitle_es="Cuéntanos un poco sobre ti" />
                  <Sec1BasicInfo answers={answers} onChange={setAnswers} />
                </>
              )}
              {section === 2 && (
                <>
                  <SectionTitle emoji="📝" title_es="Vocabulario" title_en="Vocabulary" subtitle_es="Elige la traducción correcta" />
                  <Sec2Vocab answers={answers} onChange={setAnswers} />
                </>
              )}
              {section === 3 && (
                <>
                  <SectionTitle emoji="📖" title_es="Lectura y comprensión" title_en="Reading & Comprehension" subtitle_es="Lee y responde las preguntas" />
                  <Sec3Reading answers={answers} onChange={setAnswers} />
                </>
              )}
              {section === 4 && (
                <>
                  <SectionTitle emoji="✍️" title_es="Gramática" title_en="Grammar" subtitle_es="Completa cada oración" />
                  <Sec4Grammar answers={answers} onChange={setAnswers} />
                </>
              )}
              {section === 5 && (
                <>
                  <SectionTitle emoji="💬" title_es="¡Casi listo!" title_en="Almost Done!" subtitle_es="Cuéntanos cómo te sientes" />
                  <Sec5Finish answers={answers} onChange={setAnswers} />
                </>
              )}

              {error && (
                <div style={{
                  marginTop: 20, padding: '12px 16px', borderRadius: 12,
                  background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.3)',
                  color: '#dc2626', fontSize: 13, fontWeight: 600,
                }}>
                  {error}
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                {section > 1 && (
                  <button onClick={prevSection} style={{
                    flex: 1, padding: '13px', borderRadius: 12, border: `2px solid rgba(0,128,128,0.25)`,
                    background: '#fff', color: TEAL, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  }}>
                    ← Anterior
                  </button>
                )}
                {section < SECTIONS.length ? (
                  <button onClick={nextSection} style={{
                    flex: 2, padding: '13px', borderRadius: 12, border: 'none',
                    background: `linear-gradient(135deg, ${TEAL}, #00a0a0)`,
                    color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,128,128,0.25)',
                  }}>
                    Siguiente → / Next
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={submitting} style={{
                    flex: 2, padding: '13px', borderRadius: 12, border: 'none',
                    background: submitting ? '#94a3b8' : `linear-gradient(135deg, ${CORAL}, #ff9b91)`,
                    color: '#fff', fontSize: 15, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: submitting ? 'none' : '0 4px 16px rgba(255,111,97,0.3)',
                  }}>
                    {submitting ? 'Enviando… / Submitting…' : '🎉 Enviar evaluación / Submit'}
                  </button>
                )}
              </div>
            </SectionCard>
          </>
        )}
      </div>
    </div>
  )
}
