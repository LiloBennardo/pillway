const REQUIRED_ENV_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
]

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(
    key => !import.meta.env[key]
  )
  if (missing.length > 0) {
    throw new Error(`Variables d'environnement manquantes : ${missing.join(', ')}`)
  }
  try { new URL(import.meta.env.VITE_SUPABASE_URL) }
  catch { throw new Error('VITE_SUPABASE_URL invalide') }
}
