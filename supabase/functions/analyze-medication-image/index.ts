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

  const { imageUrl } = await req.json()

  const SYSTEM_PROMPT = `Tu es un assistant pharmaceutique expert.
Quand on te donne l'image d'une boîte ou d'une notice de médicament,
tu extrais les informations clés et tu les retournes UNIQUEMENT en JSON valide, sans markdown, sans texte autour.

Format de sortie JSON strict :
{
  "name": "Nom commercial du médicament",
  "dosage": "ex: 500 mg, 1000 mg",
  "form": "comprimé | gélule | sirop | patch | injection | autre",
  "how_to_take": "Résumé clair et simple en 2-4 phrases : quand prendre, avec quoi, combien de fois par jour, durée recommandée. Utilise un langage patient, pas médical.",
  "warnings": ["Précaution 1", "Précaution 2"],
  "interactions": ["Médicament ou substance à ne pas combiner 1", "..."],
  "summary": "1 phrase résumé grand public du médicament et son usage principal"
}

Si une information n'est pas lisible sur l'image, mets null pour ce champ.
Ne jamais inventer d'information médicale.`

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
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'url', url: imageUrl }
          },
          {
            type: 'text',
            text: 'Analyse ce médicament et retourne les informations en JSON.'
          }
        ]
      }]
    })
  })

  const aiResponse = await response.json()
  const rawText = aiResponse.content?.[0]?.text || '{}'

  let parsed
  try {
    parsed = JSON.parse(rawText.replace(/```json|```/g, '').trim())
  } catch {
    parsed = { name: null, how_to_take: rawText, summary: null }
  }

  return Response.json(parsed)
})
