import { createContext, useContext, useEffect, useState } from 'react'
import translations from '../i18n'

const LanguageContext = createContext(null)

const SOUTH_CENTRAL_AMERICA = new Set([
  'MX','GT','BZ','HN','SV','NI','CR','PA',
  'CO','VE','GY','SR','EC','PE','BO','BR','PY','UY','AR','CL',
  'CU','JM','HT','DO','PR','TT','BB','LC','VC','GD','KN','AG','DM',
])

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('vp_lang') || null)

  useEffect(() => {
    if (lang !== null) return
    // No saved preference — detect from IP
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const detected = SOUTH_CENTRAL_AMERICA.has(data.country_code) ? 'es' : 'en'
        setLangState(detected)
        // Don't write to localStorage yet — let the user's explicit toggle persist it
      })
      .catch(() => setLangState('en'))
  }, [])

  function setLang(newLang) {
    if (newLang !== 'en' && newLang !== 'es') return
    localStorage.setItem('vp_lang', newLang)
    setLangState(newLang)
  }

  function t(key, vars = {}) {
    const currentLang = lang || 'en'
    const dict = translations[currentLang] || translations['en']
    let str = dict[key] ?? translations['en'][key] ?? key
    Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, v) })
    return str
  }

  return (
    <LanguageContext.Provider value={{ lang: lang || 'en', setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
