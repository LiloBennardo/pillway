export function sanitizeText(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/[<>"'`]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 500)
}

export function sanitizeMedName(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/[^a-zA-ZÀ-ÿ0-9\s\-\.]/g, '')
    .trim()
    .slice(0, 100)
}

export function sanitizeDosage(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/[^a-zA-ZÀ-ÿ0-9\s\.\,\/\-µ]/g, '')
    .trim()
    .slice(0, 50)
}

export function sanitizeEmail(str) {
  if (typeof str !== 'string') return ''
  return str.trim().toLowerCase().slice(0, 254)
}
