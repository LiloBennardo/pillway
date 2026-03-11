import { supabase } from './supabase'

export async function fetchWithAuth(functionName, body = {}) {
  const { data, error } = await supabase.functions.invoke(functionName, { body })
  if (error) throw error
  return data
}
