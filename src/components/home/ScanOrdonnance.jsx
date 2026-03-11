import { useState, useRef } from 'react'
import { Camera, Upload, Loader2, Check, Clock, FileText, Plus, Minus, AlertTriangle, Calendar } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { addDays, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Modal from '../ui/Modal'
import toast from 'react-hot-toast'

const TIME_PRESETS = {
  1: ['08:00'],
  2: ['08:00', '20:00'],
  3: ['08:00', '14:00', '20:00'],
  4: ['08:00', '12:00', '18:00', '22:00'],
}

// Terms that indicate non-medication content (doctor info, admin, addresses...)
const NOISE_TERMS = [
  'rpps', 'finess', 'médecin', 'medecin', 'docteur', 'dr.',
  'adresse', 'sécurité sociale', 'securite sociale', 'qr code',
  'espace professionnel', 'patient', 'france',
  'scannez', 'délivrance', 'delivrance', 'médical', 'medical',
  'généraliste', 'generaliste', 'spécialiste', 'specialiste',
  'pharmacie', 'infirmier', 'sage-femme', 'sage femme',
  'cabinet', 'clinique', 'hôpital', 'hopital', 'consultation',
  'née le', 'ne le', 'né le', 'monsieur', 'madame', 'mademoiselle',
  'téléphone', 'telephone', 'tel:', 'fax:', 'email', '@',
  'www.', 'http', '.com', '.fr',
  'renouvellement', 'sébastopol', 'sebastopol',
  'boulevard', 'avenue', 'rue ', 'cedex', 'impasse', 'allée',
  'arrondissement', 'code postal',
  'ordonnance', 'prescription', 'date de naissance',
  'numéro', 'numero', 'n°',
  'sécurisée', 'securisee', 'duplicata',
  'medadom', 'doctolib', 'ameli',
]

export default function ScanOrdonnance({ onComplete }) {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState(null)
  const [previewType, setPreviewType] = useState(null)
  const [parsedMeds, setParsedMeds] = useState([])
  const [saving, setSaving] = useState(false)
  const cameraRef = useRef()
  const importRef = useRef()

  async function handleFile(file) {
    if (!file) return

    const isPdf = file.type === 'application/pdf'
    setPreviewType(isPdf ? 'pdf' : 'image')
    setPreview(isPdf ? file.name : URL.createObjectURL(file))
    setScanning(true)
    setProgress(0)
    setParsedMeds([])

    try {
      let text = ''

      if (isPdf) {
        text = await extractTextFromPdf(file)
      } else {
        const { createWorker } = await import('tesseract.js')
        const worker = await createWorker('fra', 1, {
          logger: ({ progress: p }) => setProgress(Math.round(p * 100))
        })
        const result = await worker.recognize(file)
        text = result.data.text
        await worker.terminate()
      }

      console.log('Texte extrait:', text)
      // Debug: show extracted text info
      if (!text || text.trim().length === 0) {
        toast.error('Le PDF ne contient pas de texte extractible. Essayez de le scanner en tant qu\'image.', { duration: 8000 })
        setScanning(false)
        return
      }
      toast(`Texte extrait (${text.trim().length} car.): "${text.trim().substring(0, 120)}..."`, { duration: 12000, icon: '🔍' })

      const meds = parsePrescriptionText(text)

      if (meds.length === 0) {
        toast.error('Aucun médicament détecté. Essayez avec un fichier plus lisible.')
      } else {
        const medsWithDefaults = meds.map((med, i) => ({
          ...med,
          color: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899'][i % 6],
          selected: true,
        }))
        setParsedMeds(medsWithDefaults)
        toast.success(`${meds.length} médicament${meds.length > 1 ? 's' : ''} détecté${meds.length > 1 ? 's' : ''} !`)
      }
    } catch (err) {
      console.error('Scan error:', err)
      toast.error(`Erreur: ${err.message || err}`, { duration: 8000 })
    }

    setScanning(false)
  }

  async function extractTextFromPdf(file) {
    setProgress(10)
    const arrayBuffer = await file.arrayBuffer()

    // Try modern build first (desktop), fallback to legacy (Safari mobile)
    let pdfjsLib
    try {
      pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
      setProgress(20)

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map(item => item.str).join(' ')
        fullText += pageText + '\n'
        setProgress(20 + Math.round((i / pdf.numPages) * 70))
      }
      setProgress(100)
      return fullText
    } catch (modernErr) {
      console.warn('Modern pdfjs-dist failed, trying legacy build:', modernErr)
      setProgress(15)

      try {
        pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
        pdfjsLib.GlobalWorkerOptions.workerSrc = ''
        setProgress(20)

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const pageText = content.items.map(item => item.str).join(' ')
          fullText += pageText + '\n'
          setProgress(20 + Math.round((i / pdf.numPages) * 70))
        }
        setProgress(100)
        return fullText
      } catch (legacyErr) {
        console.error('Legacy pdfjs-dist also failed:', legacyErr)
        throw new Error(`PDF non lisible: ${modernErr.message || modernErr}`)
      }
    }
  }

  // Known medication names database
  const KNOWN_MEDS = [
    'doliprane', 'paracetamol', 'paracétamol', 'efferalgan', 'dafalgan',
    'ibuprofene', 'ibuprofène', 'advil', 'nurofen',
    'amoxicilline', 'augmentin', 'clamoxyl',
    'omeprazole', 'oméprazole', 'inexium', 'gaviscon',
    'metformine', 'glucophage', 'diamicron',
    'levothyrox', 'levothyroxine', 'euthyrox',
    'ramipril', 'triatec', 'amlodipine', 'amlor',
    'atorvastatine', 'tahor', 'crestor', 'rosuvastatine',
    'bisoprolol', 'cardensiel',
    'sertraline', 'zoloft', 'escitalopram', 'seroplex', 'lexapro',
    'alprazolam', 'xanax', 'lexomil', 'bromazepam',
    'ventoline', 'salbutamol', 'seretide', 'symbicort',
    'kardegic', 'aspirine', 'aspégic', 'aspegic',
    'spasfon', 'phloroglucinol',
    'tramadol', 'codeine', 'codéine', 'lamaline',
    'voltarene', 'voltarène', 'diclofenac', 'diclofénac',
    'prednisolone', 'prednisone', 'solupred', 'cortancyl',
    'methotrexate', 'méthotrexate',
    'levocetirizine', 'lévocétirizine', 'xyzall', 'aerius', 'desloratadine',
    'furosemide', 'furosémide', 'lasilix',
    'lovenox', 'enoxaparine', 'xarelto', 'rivaroxaban',
    'lyrica', 'pregabaline', 'prégabaline', 'gabapentine',
    'daflon', 'diosmine',
    'smecta', 'tiorfan', 'imodium', 'loperamide', 'lopéramide',
    'mopral', 'lansoprazole', 'pantoprazole',
    'fluoxetine', 'fluoxétine', 'prozac', 'deroxat', 'paroxetine', 'paroxétine',
    'zopiclone', 'imovane', 'stilnox', 'zolpidem',
    'cetirizine', 'cétirizine', 'zyrtec',
    'clopidogrel', 'plavix',
    'metoprolol', 'métoprolol', 'seloken',
    'aturgyl', 'rhinofluimucil', 'pivalone', 'nasonex',
    'amoxicilline', 'ciprofloxacine', 'azithromycine', 'zithromax',
    'inexium', 'esomeprazole', 'ésoméprazole',
    'donormyl', 'doxylamine', 'melatonine', 'mélatonine',
    'toplexil', 'oxomemazine', 'oxomémazine',
    'maxilase', 'alpha-amylase',
    'biafine', 'flammazine',
    'ixprim', 'izalgi',
    'tahor', 'ezetimibe', 'ézétimibe',
    'triatec', 'coversyl', 'perindopril', 'périndopril',
    'previscan', 'fluindione', 'coumadine', 'warfarine',
    'lévothyrox', 'euthyral',
    'speciafoldine', 'acide folique',
    'uvedose', 'vitamine d', 'cholecalciferol', 'cholécalciférol',
  ]

  function detectForm(text) {
    const t = text.toLowerCase()
    if (/crème|creme|pommade|tube/.test(t)) return 'crème'
    if (/gélule|gelule|caps/.test(t)) return 'gélule'
    if (/pulv|spray|nasal/.test(t)) return 'spray'
    if (/sirop|solution buvable|buvable/.test(t)) return 'sirop'
    if (/injection|inject/.test(t)) return 'injection'
    if (/patch/.test(t)) return 'patch'
    if (/goutte|collyre|gtt/.test(t)) return 'gouttes'
    if (/suppositoire/.test(t)) return 'suppositoire'
    if (/sachet/.test(t)) return 'sachet'
    return 'comprimé'
  }

  function extractMedDetails(context) {
    // Extract dosage
    let dosage = ''
    const dosageMatch =
      context.match(/(\d+[,.]?\d*\s*(?:mg|ml|µg|ui))/i) ||
      context.match(/(\d+[,.]?\d*\s*g)\b/i) ||
      context.match(/(\d+[,.]?\d*\s*%)/i)
    if (dosageMatch) dosage = dosageMatch[1].trim()

    // Frequency
    let timesPerDay = 1
    const freqMatch = context.match(/(\d+)\s*(?:fois\s*par\s*jour|x\s*\/?\s*j(?:our)?)/i)
    if (freqMatch) {
      timesPerDay = Math.min(parseInt(freqMatch[1]), 4)
    } else if (/matin.*soir|soir.*matin/i.test(context)) {
      timesPerDay = 2
    } else if (/matin.*midi.*soir/i.test(context)) {
      timesPerDay = 3
    }
    const times = [...(TIME_PRESETS[timesPerDay] || ['08:00'])]

    // Duration
    let duration = null
    const durationMatch = context.match(/pendant\s+(\d+)\s*jours?/i) ||
      context.match(/(\d+)\s*jours?\s*(?:de\s*traitement)?/i)
    if (durationMatch) {
      const d = parseInt(durationMatch[1])
      if (d >= 2 && d <= 365) duration = d
    }

    // As needed
    const asNeeded = /si\s*(besoin|nécessaire|douleur)/i.test(context)

    // Posology
    let posology = ''
    const posoMatch = context.match(/(\d+\s*(?:fois|x|cp|comp|gel|gél).*?(?:jour|matin|soir|midi|coucher|semaine)[^\n]{0,40})/i)
    if (posoMatch) posology = posoMatch[1].trim()

    return { dosage, form: detectForm(context), times, duration, asNeeded, posology }
  }

  function parsePrescriptionText(text) {
    const fullText = text.replace(/\r\n/g, ' ').replace(/\r/g, ' ').replace(/\n/g, ' ')
    const lower = fullText.toLowerCase()
    const results = []
    const foundNames = new Set()

    // === PASS 1: Scan entire text for known medication names ===
    for (const med of KNOWN_MEDS) {
      const idx = lower.indexOf(med)
      if (idx === -1) continue
      if (foundNames.has(med)) continue

      // Extract context around the match (200 chars around)
      const contextStart = Math.max(0, idx - 60)
      const contextEnd = Math.min(fullText.length, idx + med.length + 140)
      const context = fullText.substring(contextStart, contextEnd)

      const details = extractMedDetails(context)

      const name = med.charAt(0).toUpperCase() + med.slice(1).toLowerCase()
      foundNames.add(med)

      // Skip if a variant of this med is already found (e.g. paracetamol + doliprane)
      const ALIASES = [
        ['doliprane', 'paracetamol', 'paracétamol', 'efferalgan', 'dafalgan'],
        ['ibuprofene', 'ibuprofène', 'advil', 'nurofen'],
        ['omeprazole', 'oméprazole', 'mopral', 'inexium', 'esomeprazole', 'ésoméprazole'],
        ['levothyrox', 'lévothyrox', 'levothyroxine', 'euthyrox', 'euthyral'],
        ['cetirizine', 'cétirizine', 'zyrtec', 'levocetirizine', 'lévocétirizine', 'xyzall'],
        ['metformine', 'glucophage'],
        ['atorvastatine', 'tahor'],
        ['sertraline', 'zoloft'],
        ['escitalopram', 'seroplex'],
        ['alprazolam', 'xanax'],
        ['ventoline', 'salbutamol'],
        ['tramadol', 'ixprim', 'izalgi'],
      ]
      const aliasGroup = ALIASES.find(g => g.includes(med))
      if (aliasGroup && aliasGroup.some(a => a !== med && foundNames.has(a))) continue

      results.push({ name, ...details })
    }

    // === PASS 2: Find medications by dosage patterns (for unknown meds) ===
    const dosageRegex = /([A-ZÀ-ÿ][a-zA-ZÀ-ÿ\-]{2,}(?:\s+[A-ZÀ-ÿ][a-zA-ZÀ-ÿ\-]+)?)\s+(\d+[,.]?\d*\s*(?:mg|ml|µg|ui|g)\b)/gi
    let match
    while ((match = dosageRegex.exec(fullText)) !== null) {
      let candidateName = match[1].trim()
      const candidateDosage = match[2].trim()

      // Skip if name is a noise word
      const candidateLower = candidateName.toLowerCase()
      const isNoise = NOISE_TERMS.some(term => candidateLower.includes(term)) ||
        /^(no|le|la|les|un|une|des|du|au|ce|cette|son|sa|en|pour|par|avec|dans|sur|que|qui|dont)$/i.test(candidateName)
      if (isNoise) continue

      // Skip if already found
      if (foundNames.has(candidateLower)) continue
      if (results.some(r => r.name.toLowerCase() === candidateLower)) continue

      // Get context
      const idx = match.index
      const contextStart = Math.max(0, idx - 30)
      const contextEnd = Math.min(fullText.length, idx + match[0].length + 120)
      const context = fullText.substring(contextStart, contextEnd)

      const details = extractMedDetails(context)
      details.dosage = candidateDosage

      candidateName = candidateName.charAt(0).toUpperCase() + candidateName.slice(1).toLowerCase()
      foundNames.add(candidateLower)

      results.push({ name: candidateName, ...details })
    }

    return results.slice(0, 10)
  }

  function toggleMed(index) {
    setParsedMeds(prev => prev.map((m, i) =>
      i === index ? { ...m, selected: !m.selected } : m
    ))
  }

  function updateMedTime(medIndex, timeIndex, value) {
    setParsedMeds(prev => prev.map((m, i) => {
      if (i !== medIndex) return m
      const newTimes = [...m.times]
      newTimes[timeIndex] = value
      return { ...m, times: newTimes }
    }))
  }

  function addMedTime(medIndex) {
    setParsedMeds(prev => prev.map((m, i) => {
      if (i !== medIndex) return m
      return { ...m, times: [...m.times, '12:00'] }
    }))
  }

  function removeMedTime(medIndex, timeIndex) {
    setParsedMeds(prev => prev.map((m, i) => {
      if (i !== medIndex || m.times.length <= 1) return m
      return { ...m, times: m.times.filter((_, ti) => ti !== timeIndex) }
    }))
  }

  function updateMedName(index, name) {
    setParsedMeds(prev => prev.map((m, i) =>
      i === index ? { ...m, name } : m
    ))
  }

  function updateMedDosage(index, dosage) {
    setParsedMeds(prev => prev.map((m, i) =>
      i === index ? { ...m, dosage } : m
    ))
  }

  async function handleSaveAll() {
    const selectedMeds = parsedMeds.filter(m => m.selected)
    if (selectedMeds.length === 0) {
      toast.error('Sélectionnez au moins un médicament')
      return
    }

    setSaving(true)

    try {
      let totalReminders = 0

      for (const med of selectedMeds) {
        // Build notes with posology and duration info
        let notes = ''
        if (med.posology) notes += `Posologie: ${med.posology}`
        if (med.duration) notes += `\nDurée: ${med.duration} jours (jusqu'au ${format(addDays(new Date(), med.duration), 'dd/MM/yyyy')})`
        if (med.asNeeded) notes += '\nPrise si besoin uniquement'

        const { data: medication, error: medError } = await supabase
          .from('medications')
          .insert({
            user_id: user.id,
            name: med.name,
            dosage: med.dosage,
            form: med.form,
            color: med.color,
            notes: notes.trim() || null,
            is_active: true,
          })
          .select()
          .single()

        if (medError) {
          console.error('Erreur ajout médicament:', medError)
          continue
        }

        // If as-needed, don't create automatic reminders
        if (med.asNeeded) continue

        // Use start_date and end_date for duration control
        const startDate = format(new Date(), 'yyyy-MM-dd')
        const endDate = med.duration
          ? format(addDays(new Date(), med.duration - 1), 'yyyy-MM-dd')
          : null

        for (const time of med.times) {
          await supabase
            .from('reminders')
            .insert({
              user_id: user.id,
              medication_id: medication.id,
              scheduled_time: time,
              days_of_week: [1, 2, 3, 4, 5, 6, 7],
              start_date: startDate,
              end_date: endDate,
              is_active: true,
              alert_minutes: 5,
            })
          totalReminders++
        }
      }

      const medsCount = selectedMeds.length
      toast.success(`${medsCount} médicament${medsCount > 1 ? 's' : ''} + ${totalReminders} rappel${totalReminders > 1 ? 's' : ''} ajoutés !`)
      setShowModal(false)
      setParsedMeds([])
      setPreview(null)
      onComplete?.()
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la sauvegarde')
    }

    setSaving(false)
  }

  function reset() {
    setPreview(null)
    setPreviewType(null)
    setParsedMeds([])
    setScanning(false)
    setProgress(0)
  }

  return (
    <>
      <button
        data-tour-id="scan-ordonnance"
        onClick={() => { reset(); setShowModal(true) }}
        className="w-full flex items-center justify-between bg-bg-card border-2 border-dashed border-brand-green/40 text-white rounded-2xl px-5 py-4 mb-4 hover:border-brand-green hover:bg-bg-card/80 transition group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center group-hover:bg-brand-green/30 transition">
            <Camera className="w-5 h-5 text-brand-green" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">Scanner une ordonnance</p>
            <p className="text-xs text-gray-400 mt-0.5">Ajout auto des médicaments + rappels</p>
          </div>
        </div>
        <span className="text-brand-green text-sm font-semibold">Scanner</span>
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Scanner une ordonnance">
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => { handleFile(e.target.files?.[0]); e.target.value = '' }}
        />
        <input
          ref={importRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={e => { handleFile(e.target.files?.[0]); e.target.value = '' }}
        />

        {!preview && !scanning && (
          <div className="space-y-3">
            <p className="text-gray-400 text-sm mb-4">
              Prenez en photo ou importez votre ordonnance (PDF, JPG, PNG). Les médicaments et rappels seront créés automatiquement.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => cameraRef.current?.click()}
                className="flex flex-col items-center gap-3 bg-bg-primary border-2 border-dashed border-bg-hover rounded-2xl p-6 text-gray-400 hover:border-brand-green hover:text-brand-green transition"
              >
                <Camera className="w-7 h-7" />
                <span className="text-xs font-medium">Prendre en photo</span>
              </button>
              <button
                onClick={() => importRef.current?.click()}
                className="flex flex-col items-center gap-3 bg-bg-primary border-2 border-dashed border-bg-hover rounded-2xl p-6 text-gray-400 hover:border-brand-green hover:text-brand-green transition"
              >
                <Upload className="w-7 h-7" />
                <span className="text-xs font-medium text-center">Importer (PDF, JPG, PNG)</span>
              </button>
            </div>
          </div>
        )}

        {preview && (
          <div className="relative rounded-2xl overflow-hidden border border-bg-hover mb-4">
            {previewType === 'pdf' ? (
              <div className="flex items-center gap-3 p-4 bg-bg-primary">
                <FileText className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-white text-sm font-medium">{preview}</p>
                  <p className="text-gray-400 text-xs">Document PDF</p>
                </div>
              </div>
            ) : (
              <img src={preview} alt="Ordonnance" className="w-full object-cover max-h-40" />
            )}
            {!scanning && parsedMeds.length === 0 && (
              <button
                onClick={reset}
                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full"
              >
                Changer
              </button>
            )}
          </div>
        )}

        {scanning && (
          <div className="bg-bg-primary rounded-2xl p-6 text-center">
            <Loader2 className="w-8 h-8 text-brand-green mx-auto animate-spin mb-3" />
            <p className="text-white text-sm font-semibold">
              {previewType === 'pdf' ? 'Lecture du PDF...' : "Analyse de l'ordonnance..."}
            </p>
            <p className="text-gray-400 text-xs mt-1">{progress}%</p>
            <div className="w-full bg-bg-hover rounded-full h-1.5 mt-3">
              <div
                className="bg-brand-green h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {parsedMeds.length > 0 && !scanning && (
          <div className="space-y-3">
            <p className="text-gray-400 text-sm">
              {parsedMeds.filter(m => m.selected).length} médicament(s) sélectionné(s). Vérifiez et modifiez si besoin.
            </p>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {parsedMeds.map((med, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-3 transition ${
                    med.selected
                      ? 'bg-brand-green/10 border-brand-green/30'
                      : 'bg-bg-primary border-bg-hover opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleMed(i)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition mt-0.5 ${
                        med.selected ? 'bg-brand-green' : 'bg-bg-hover'
                      }`}
                    >
                      {med.selected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      {/* Name + dosage + form */}
                      <input
                        type="text"
                        value={med.name}
                        onChange={e => updateMedName(i, e.target.value)}
                        className="bg-transparent text-white text-sm font-semibold w-full focus:outline-none"
                      />
                      <div className="flex items-center gap-2 mt-0.5">
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={e => updateMedDosage(i, e.target.value)}
                          className="bg-transparent text-gray-400 text-xs w-20 focus:outline-none"
                          placeholder="Dosage"
                        />
                        <span className="text-gray-500 text-xs">·</span>
                        <span className="text-gray-400 text-xs">{med.form}</span>
                      </div>

                      {/* Duration & as-needed badges */}
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {med.duration && (
                          <span className="inline-flex items-center gap-1 text-amber-400 text-[10px] font-semibold bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                            <Calendar className="w-2.5 h-2.5" />
                            {med.duration} jours (jusqu'au {format(addDays(new Date(), med.duration), 'd MMM', { locale: fr })})
                          </span>
                        )}
                        {med.asNeeded && (
                          <span className="inline-flex items-center gap-1 text-blue-400 text-[10px] font-semibold bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Si besoin
                          </span>
                        )}
                        {!med.duration && !med.asNeeded && (
                          <span className="inline-flex items-center gap-1 text-gray-500 text-[10px] bg-gray-500/10 px-2 py-0.5 rounded-full">
                            Tous les jours
                          </span>
                        )}
                      </div>

                      {/* Posology from prescription */}
                      {med.posology && (
                        <p className="text-gray-500 text-[10px] mt-1 italic leading-tight">{med.posology}</p>
                      )}

                      {/* Time slots (hidden for as-needed meds) */}
                      {!med.asNeeded && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {med.times.map((time, ti) => (
                            <div key={ti} className="flex items-center gap-1 bg-bg-primary rounded-lg px-1.5 py-0.5 border border-bg-hover">
                              <Clock className="w-3 h-3 text-brand-green" />
                              <input
                                type="time"
                                value={time}
                                onChange={e => updateMedTime(i, ti, e.target.value)}
                                className="bg-transparent text-white text-xs w-16 focus:outline-none"
                              />
                              {med.times.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeMedTime(i, ti)}
                                  className="text-gray-500 hover:text-red-400 transition"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addMedTime(i)}
                            className="flex items-center gap-1 text-brand-green text-xs hover:text-brand-green-dark transition bg-brand-green/10 rounded-lg px-2 py-1"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {med.asNeeded && (
                        <p className="text-blue-400/70 text-[10px] mt-2">Pas de rappel automatique (prise si besoin)</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={reset}
                className="flex-1 bg-bg-primary hover:bg-bg-hover text-gray-300 font-semibold py-3 rounded-xl transition border border-bg-hover"
              >
                Recommencer
              </button>
              <button
                onClick={handleSaveAll}
                disabled={saving || parsedMeds.filter(m => m.selected).length === 0}
                className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 rounded-xl transition shadow-green disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Tout ajouter
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
