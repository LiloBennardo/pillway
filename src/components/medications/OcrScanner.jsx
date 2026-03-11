import { useState, useRef } from 'react'
import { Camera, Upload, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function OcrScanner({ onParsed }) {
  const { user } = useAuth()
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()

  async function handleFile(file) {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setScanning(true)
    setProgress(0)

    try {
      const filename = `ocr/${user.id}/${Date.now()}.jpg`
      await supabase.storage.from('prescriptions').upload(filename, file)
      const { data: { publicUrl } } = supabase.storage.from('prescriptions').getPublicUrl(filename)

      // Dynamic import of tesseract.js for code splitting
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('fra', 1, {
        logger: ({ progress: p }) => setProgress(Math.round(p * 100))
      })
      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      const { data: scan } = await supabase.from('ocr_scans').insert({
        user_id: user.id,
        image_url: publicUrl,
        raw_text: text,
        status: 'processed'
      }).select().single()

      const parsedMeds = parsePrescriptionText(text)
      onParsed?.(parsedMeds, scan)
    } catch (err) {
      console.error('OCR error:', err)
    }

    setScanning(false)
  }

  function parsePrescriptionText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const medPattern = /(\d+\s*mg|\d+\s*ml|\d+\s*g)/i
    return lines
      .filter(line => medPattern.test(line))
      .map(line => ({
        name: line.replace(medPattern, '').trim(),
        dosage: (line.match(medPattern) || [''])[0],
      }))
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />

      {preview && (
        <div className="rounded-2xl overflow-hidden border border-bg-hover">
          <img src={preview} alt="Ordonnance" className="w-full object-cover max-h-48" />
        </div>
      )}

      {scanning ? (
        <div className="bg-bg-card rounded-2xl p-6 text-center">
          <Loader2 className="w-8 h-8 text-brand-green mx-auto animate-spin mb-3" />
          <p className="text-white text-sm font-medium">Analyse en cours... {progress}%</p>
          <div className="w-full bg-bg-hover rounded-full h-1.5 mt-3">
            <div
              className="bg-brand-green h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-2 bg-bg-card border border-bg-hover rounded-2xl p-5 text-gray-300 hover:border-brand-green hover:text-brand-green transition"
          >
            <Camera className="w-6 h-6" />
            <span className="text-xs font-medium">Prendre en photo</span>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-2 bg-bg-card border border-bg-hover rounded-2xl p-5 text-gray-300 hover:border-brand-green hover:text-brand-green transition"
          >
            <Upload className="w-6 h-6" />
            <span className="text-xs font-medium">Importer une image</span>
          </button>
        </div>
      )}
    </div>
  )
}
