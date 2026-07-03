export function calcAge(isoDob) {
  if (!isoDob) return null
  const dob = new Date(isoDob)
  if (isNaN(dob.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

export function needsMinorConsent(user) {
  if (!user || user.role !== 'student') return false
  const age = calcAge(user.date_of_birth)
  return age !== null && age >= 14 && age <= 17 && !user.minor_consent_version
}
