import { useState, useRef } from 'react'
import { Camera, Upload, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import NoticeCard from './NoticeCard'
import toast from 'react-hot-toast'

export default function MedicationImageScanner({ onMedicationFound }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const fileRef = useRef()

  async function handleImage(file) {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setLoading(true)

    try {
      const path = `medication-scans/${user.id}/${Date.now()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from('medications-scans')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('medications-scans')
        .getPublicUrl(path)

      const { data, error } = await supabase.functions.invoke('analyze-medication-image', {
        body: { imageUrl: publicUrl }
      })

      if (error) throw error

      setResult(data)
      onMedicationFound?.(data)
    } catch (err) {
      toast.error("Impossible d'analyser l'image. Réessayez.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => handleImage(e.target.files?.[0])}
      />

      {!preview && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-3 bg-bg-card border-2 border-dashed border-bg-hover rounded-2xl p-6 text-gray-400 hover:border-brand-green hover:text-brand-green transition"
          >
            <Camera className="w-7 h-7" />
            <span className="text-xs font-medium text-center">Photo de la boîte ou notice</span>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-3 bg-bg-card border-2 border-dashed border-bg-hover rounded-2xl p-6 text-gray-400 hover:border-brand-green hover:text-brand-green transition"
          >
            <Upload className="w-7 h-7" />
            <span className="text-xs font-medium text-center">Importer depuis la galerie</span>
          </button>
        </div>
      )}

      {preview && (
        <div className="relative rounded-2xl overflow-hidden border border-bg-hover">
          <img src={preview} alt="Médicament" className="w-full object-cover max-h-52" />
          {!loading && (
            <button
              onClick={() => { setPreview(null); setResult(null) }}
              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full hover:bg-black/80 transition"
            >
              Changer
            </button>
          )}
        </div>
      )}

      {loading && (
        <div className="bg-bg-card rounded-2xl p-6 text-center border border-bg-hover">
          <Loader2 className="w-8 h-8 text-brand-green mx-auto animate-spin mb-3" />
          <p className="text-white text-sm font-semibold">Analyse du médicament...</p>
          <p className="text-gray-400 text-xs mt-1">L'IA lit la notice et prépare le résumé</p>
        </div>
      )}

      {result && !loading && (
        <NoticeCard result={result} onAdd={onMedicationFound} />
      )}
    </div>
  )
}
