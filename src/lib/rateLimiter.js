const LIMITS = {
  'scan_ocr':          { max: 10,  windowMs: 60 * 60 * 1000 },
  'add_medication':    { max: 20,  windowMs: 60 * 60 * 1000 },
  'send_report':       { max: 3,   windowMs: 24 * 60 * 60 * 1000 },
  'auth_attempt':      { max: 5,   windowMs: 15 * 60 * 1000 },
  'update_log_status': { max: 100, windowMs: 60 * 60 * 1000 },
}

export function checkRateLimit(action) {
  const limit = LIMITS[action]
  if (!limit) return { allowed: true }

  const key = `rl_${action}`
  const now = Date.now()
  const stored = JSON.parse(sessionStorage.getItem(key) || '{"count":0,"reset":0}')

  if (now > stored.reset) {
    const newState = { count: 1, reset: now + limit.windowMs }
    sessionStorage.setItem(key, JSON.stringify(newState))
    return { allowed: true, remaining: limit.max - 1 }
  }

  if (stored.count >= limit.max) {
    const waitSecs = Math.ceil((stored.reset - now) / 1000)
    return {
      allowed: false,
      waitSecs,
      message: `Trop de tentatives. Réessayez dans ${waitSecs < 60 ? `${waitSecs}s` : `${Math.ceil(waitSecs / 60)} min`}.`,
    }
  }

  stored.count++
  sessionStorage.setItem(key, JSON.stringify(stored))
  return { allowed: true, remaining: limit.max - stored.count }
}
