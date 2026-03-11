import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useMedications() {
  const { user } = useAuth()
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchMedications()
  }, [user])

  async function fetchMedications() {
    const { data } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    setMedications(data || [])
    setLoading(false)
  }

  async function addMedication(medication) {
    const { data, error } = await supabase
      .from('medications')
      .insert({ ...medication, user_id: user.id })
      .select()
      .single()
    if (!error) setMedications(prev => [data, ...prev])
    return { data, error }
  }

  async function updateMedication(id, updates) {
    const { data, error } = await supabase
      .from('medications')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error) setMedications(prev => prev.map(m => m.id === id ? data : m))
    return { data, error }
  }

  async function deleteMedication(id) {
    await supabase.from('medications').update({ is_active: false }).eq('id', id)
    setMedications(prev => prev.filter(m => m.id !== id))
  }

  return { medications, loading, addMedication, updateMedication, deleteMedication, refetch: fetchMedications }
}
