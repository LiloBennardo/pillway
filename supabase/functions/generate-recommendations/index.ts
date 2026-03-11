Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')

  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { medications } = await req.json()

  if (!medications?.length) {
    return Response.json({ recommendations: [] })
  }

  const medList = medications.map((m: any) => `- ${m.name} ${m.dosage || ''}`).join('\n')

  const PROMPT = `Tu es un pharmacien expert.
L'utilisateur prend actuellement ces médicaments :
${medList}

Génère en JSON une liste de recommandations utiles.
Retourne UNIQUEMENT un JSON valide, sans markdown.

Format :
{
  "recommendations": [
    {
      "type": "interaction",
      "severity": "danger",
      "title": "Titre court de l'alerte",
      "body": "Explication claire pour un patient (2-3 phrases max)",
      "medication_ids": []
    }
  ]
}

Types possibles : "interaction" (médicaments incompatibles), "advice" (conseil prise), "warning" (précaution)
Severité : "danger" (urgent), "warning" (attention), "info" (conseil)
Maximum 5 recommandations pertinentes. Ne rien inventer si peu de médicaments.
Langue : français uniquement.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: PROMPT }]
    })
  })

  const aiResponse = await response.json()
  const rawText = aiResponse.content?.[0]?.text || '{"recommendations":[]}'

  let parsed
  try {
    parsed = JSON.parse(rawText.replace(/```json|```/g, '').trim())
  } catch {
    parsed = { recommendations: [] }
  }

  return Response.json(parsed)
})
