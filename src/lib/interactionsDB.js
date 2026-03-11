// Base locale d'interactions médicamenteuses et conseils santé
// Ces données sont éducatives et ne remplacent pas un avis médical

// ── INTERACTIONS MÉDICAMENTEUSES ──
// Clé = nom du médicament (lowercase), valeur = liste d'interactions
export const INTERACTIONS = {
  // Paracétamol
  doliprane: [
    { with: 'alcool', severity: 'danger', message: 'Ne pas associer paracétamol et alcool : risque de toxicité hépatique grave.' },
    { with: 'efferalgan', severity: 'danger', message: 'Ne pas cumuler Doliprane + Efferalgan = double dose de paracétamol. Max 3g/jour total.' },
    { with: 'dafalgan', severity: 'danger', message: 'Doliprane et Dafalgan contiennent tous deux du paracétamol. Ne pas cumuler.' },
    { with: 'lamaline', severity: 'warning', message: 'Lamaline contient du paracétamol. Risque de surdosage si associé au Doliprane.' },
  ],
  efferalgan: [
    { with: 'doliprane', severity: 'danger', message: 'Double dose de paracétamol. Maximum 3g par jour tous produits confondus.' },
    { with: 'dafalgan', severity: 'danger', message: 'Efferalgan et Dafalgan = même molécule. Ne pas cumuler.' },
    { with: 'alcool', severity: 'danger', message: 'Paracétamol + alcool : risque hépatique.' },
  ],

  // Anti-inflammatoires
  ibuprofène: [
    { with: 'aspirine', severity: 'danger', message: 'Ne pas associer 2 AINS. Risque hémorragique et gastrique majoré.' },
    { with: 'advil', severity: 'danger', message: 'Advil = ibuprofène. Ne pas doubler la dose.' },
    { with: 'nurofen', severity: 'danger', message: 'Nurofen = ibuprofène. Même molécule, ne pas cumuler.' },
    { with: 'voltarène', severity: 'danger', message: '2 anti-inflammatoires ensemble = risque gastrique et rénal élevé.' },
    { with: 'kardégic', severity: 'warning', message: 'L\'ibuprofène peut réduire l\'effet antiagrégant du Kardégic.' },
    { with: 'metformine', severity: 'warning', message: 'AINS + Metformine : surveillance rénale recommandée.' },
  ],
  advil: [
    { with: 'ibuprofène', severity: 'danger', message: 'Advil = ibuprofène. Ne pas cumuler.' },
    { with: 'nurofen', severity: 'danger', message: 'Advil et Nurofen contiennent tous deux de l\'ibuprofène.' },
    { with: 'aspirine', severity: 'danger', message: 'Association AINS dangereuse. Risque hémorragique.' },
  ],
  aspirine: [
    { with: 'ibuprofène', severity: 'danger', message: 'Association AINS déconseillée. Risque gastrique et hémorragique.' },
    { with: 'kardégic', severity: 'warning', message: 'Kardégic contient de l\'aspirine. Ne pas cumuler.' },
    { with: 'ginkgo biloba', severity: 'warning', message: 'Ginkgo + Aspirine : risque de saignement augmenté.' },
  ],

  // Antibiotiques
  amoxicilline: [
    { with: 'méthotrexate', severity: 'danger', message: 'Amoxicilline augmente la toxicité du méthotrexate.' },
    { with: 'probiotiques', severity: 'info', message: 'Espacer de 2h. Les probiotiques aident à prévenir la diarrhée sous antibiotique.' },
  ],
  ciprofloxacine: [
    { with: 'fer', severity: 'warning', message: 'Le fer réduit l\'absorption de la ciprofloxacine. Espacer de 2-4h.' },
    { with: 'calcium', severity: 'warning', message: 'Le calcium réduit l\'absorption. Espacer de 2h.' },
    { with: 'magnésium', severity: 'warning', message: 'Le magnésium réduit l\'absorption. Espacer de 2h.' },
    { with: 'zinc', severity: 'warning', message: 'Le zinc réduit l\'absorption. Espacer de 2h.' },
  ],
  métronidazole: [
    { with: 'alcool', severity: 'danger', message: 'Effet antabuse : nausées, vomissements, bouffées de chaleur. Pas d\'alcool pendant le traitement et 48h après.' },
  ],

  // Thyroïde
  levothyrox: [
    { with: 'fer', severity: 'warning', message: 'Le fer réduit l\'absorption du Levothyrox. Espacer de 2-4h.' },
    { with: 'calcium', severity: 'warning', message: 'Le calcium réduit l\'absorption. Espacer de 2h.' },
    { with: 'oméprazole', severity: 'warning', message: 'Les IPP réduisent l\'absorption du Levothyrox. Espacer.' },
    { with: 'magnésium', severity: 'warning', message: 'Le magnésium interfère avec l\'absorption. Espacer de 2-4h.' },
    { with: 'café', severity: 'info', message: 'Attendez 30 min après le Levothyrox avant de boire du café.' },
    { with: 'soja', severity: 'warning', message: 'Le soja peut réduire l\'absorption. Espacer de 4h.' },
  ],

  // Anticoagulants / Cardio
  kardégic: [
    { with: 'ibuprofène', severity: 'warning', message: 'L\'ibuprofène réduit l\'effet du Kardégic et augmente le risque hémorragique.' },
    { with: 'aspirine', severity: 'warning', message: 'Kardégic = aspirine faible dose. Ne pas ajouter d\'aspirine.' },
    { with: 'oméga 3', severity: 'info', message: 'Oméga 3 à haute dose peut renforcer l\'effet antiagrégant. Surveiller.' },
    { with: 'ginkgo biloba', severity: 'warning', message: 'Ginkgo + anticoagulant : risque de saignement augmenté.' },
    { with: 'curcuma', severity: 'warning', message: 'Curcuma a des propriétés anti-coagulantes. Prudence.' },
  ],

  // Statines
  atorvastatine: [
    { with: 'pamplemousse', severity: 'warning', message: 'Le pamplemousse augmente la concentration de statines. Éviter.' },
    { with: 'millepertuis', severity: 'danger', message: 'Le millepertuis réduit fortement l\'efficacité des statines.' },
  ],

  // Médicaments psychiatriques
  sertraline: [
    { with: 'millepertuis', severity: 'danger', message: 'Association ISRS + millepertuis : risque de syndrome sérotoninergique grave.' },
    { with: 'tramadol', severity: 'danger', message: 'Tramadol + ISRS : risque de syndrome sérotoninergique.' },
    { with: 'ibuprofène', severity: 'warning', message: 'AINS + ISRS : risque hémorragique digestif augmenté.' },
  ],
  escitalopram: [
    { with: 'millepertuis', severity: 'danger', message: 'Millepertuis + escitalopram : risque de syndrome sérotoninergique.' },
    { with: 'tramadol', severity: 'danger', message: 'Risque de syndrome sérotoninergique.' },
  ],
  fluoxétine: [
    { with: 'millepertuis', severity: 'danger', message: 'Association dangereuse : syndrome sérotoninergique possible.' },
    { with: 'tramadol', severity: 'danger', message: 'Risque de syndrome sérotoninergique.' },
  ],

  // Sommeil
  lexomil: [
    { with: 'alcool', severity: 'danger', message: 'Benzodiazépine + alcool : dépression respiratoire potentiellement mortelle.' },
    { with: 'stilnox', severity: 'danger', message: 'Ne pas associer deux hypnotiques/sédatifs.' },
    { with: 'tramadol', severity: 'warning', message: 'Double sédation. Risque de somnolence excessive.' },
  ],
  xanax: [
    { with: 'alcool', severity: 'danger', message: 'Xanax + alcool : sédation excessive, dépression respiratoire.' },
    { with: 'tramadol', severity: 'warning', message: 'Sédation majorée.' },
  ],

  // Contraception
  leeloo: [
    { with: 'millepertuis', severity: 'danger', message: 'Le millepertuis réduit l\'efficacité de la pilule contraceptive. Risque de grossesse.' },
    { with: 'amoxicilline', severity: 'info', message: 'Certains antibiotiques peuvent réduire l\'efficacité de la pilule. Utiliser un préservatif pendant le traitement.' },
  ],
  optilova: [
    { with: 'millepertuis', severity: 'danger', message: 'Millepertuis réduit l\'efficacité de la pilule.' },
  ],
  cerazette: [
    { with: 'millepertuis', severity: 'danger', message: 'Millepertuis diminue l\'efficacité de la pilule progestative.' },
  ],
  yaz: [
    { with: 'millepertuis', severity: 'danger', message: 'Le millepertuis réduit l\'efficacité de la pilule.' },
  ],

  // Diabète
  metformine: [
    { with: 'alcool', severity: 'warning', message: 'Alcool + Metformine : risque d\'acidose lactique et d\'hypoglycémie.' },
    { with: 'ibuprofène', severity: 'warning', message: 'AINS peuvent altérer la fonction rénale chez les patients sous Metformine.' },
  ],

  // Compléments
  millepertuis: [
    { with: 'sertraline', severity: 'danger', message: 'Syndrome sérotoninergique : association très dangereuse.' },
    { with: 'escitalopram', severity: 'danger', message: 'Syndrome sérotoninergique : association très dangereuse.' },
    { with: 'fluoxétine', severity: 'danger', message: 'Syndrome sérotoninergique : association très dangereuse.' },
    { with: 'leeloo', severity: 'danger', message: 'Réduit l\'efficacité de la pilule contraceptive.' },
    { with: 'optilova', severity: 'danger', message: 'Réduit l\'efficacité de la pilule contraceptive.' },
    { with: 'cerazette', severity: 'danger', message: 'Réduit l\'efficacité de la pilule contraceptive.' },
    { with: 'atorvastatine', severity: 'danger', message: 'Réduit l\'efficacité des statines.' },
  ],
  'ginkgo biloba': [
    { with: 'aspirine', severity: 'warning', message: 'Risque de saignement accru.' },
    { with: 'kardégic', severity: 'warning', message: 'Risque hémorragique augmenté.' },
    { with: 'ibuprofène', severity: 'warning', message: 'Risque de saignement.' },
  ],

  // Fer
  fer: [
    { with: 'levothyrox', severity: 'warning', message: 'Le fer réduit l\'absorption du Levothyrox. Espacer de 2-4h.' },
    { with: 'ciprofloxacine', severity: 'warning', message: 'Le fer réduit l\'absorption des fluoroquinolones. Espacer de 2-4h.' },
    { with: 'calcium', severity: 'warning', message: 'Fer et calcium se bloquent mutuellement. Prendre à des moments différents.' },
    { with: 'thé', severity: 'info', message: 'Les tanins du thé réduisent l\'absorption du fer. Espacer de 2h.' },
    { with: 'café', severity: 'info', message: 'Le café réduit l\'absorption du fer de 40%. Espacer de 2h.' },
    { with: 'vitamine c', severity: 'info', message: 'La vitamine C améliore l\'absorption du fer. Bonne association !' },
  ],
  'fer (tardyferon)': [
    { with: 'levothyrox', severity: 'warning', message: 'Le fer réduit l\'absorption du Levothyrox. Espacer de 2-4h.' },
    { with: 'calcium', severity: 'warning', message: 'Ne pas prendre en même temps. Espacer de 2h minimum.' },
  ],

  // Sport
  créatine: [
    { with: 'caféine', severity: 'info', message: 'La caféine peut réduire légèrement l\'efficacité de la créatine. Pas dangereux.' },
    { with: 'furosémide', severity: 'warning', message: 'Diurétiques + créatine : risque de déshydratation et surcharge rénale.' },
  ],
  caféine: [
    { with: 'fer', severity: 'info', message: 'La caféine réduit l\'absorption du fer de 40%.' },
    { with: 'levothyrox', severity: 'info', message: 'Attendre 30 min après le Levothyrox.' },
    { with: 'xanax', severity: 'warning', message: 'La caféine peut contrer les effets anxiolytiques du Xanax.' },
    { with: 'mélatonine', severity: 'info', message: 'La caféine perturbe le sommeil. Ne pas prendre de caféine après 14h si mélatonine le soir.' },
  ],

  // Magnésium
  magnésium: [
    { with: 'levothyrox', severity: 'warning', message: 'Espacer de 2-4h. Le magnésium réduit l\'absorption du Levothyrox.' },
    { with: 'ciprofloxacine', severity: 'warning', message: 'Espacer de 2h. Réduit l\'absorption de l\'antibiotique.' },
  ],
  'magnésium bisglycinate': [
    { with: 'levothyrox', severity: 'warning', message: 'Espacer de 2-4h.' },
  ],

  // Curcuma
  curcuma: [
    { with: 'kardégic', severity: 'warning', message: 'Curcuma a des propriétés anticoagulantes. Prudence avec les antiagrégants.' },
    { with: 'aspirine', severity: 'warning', message: 'Double effet anticoagulant possible.' },
  ],
}

// ── CONSEILS PAR PROFIL ──
export const HEALTH_TIPS = {
  sport: [
    { title: 'Hydratation sportive', text: 'Buvez 500ml 2h avant, puis 150-200ml toutes les 15 min pendant l\'effort.' },
    { title: 'Fenêtre anabolique', text: 'Consommez 20-30g de protéines dans les 2h après l\'entraînement pour optimiser la récupération.' },
    { title: 'Créatine', text: 'La créatine est le complément le plus étudié et prouvé. 3-5g/jour en continu, pas besoin de phase de charge.' },
    { title: 'BCAA', text: 'Utiles seulement si vous vous entraînez à jeun. Sinon, un repas protéiné suffit.' },
    { title: 'Sommeil sportif', text: '7-9h de sommeil = meilleure récupération musculaire, plus de testostérone et d\'hormone de croissance.' },
    { title: 'Whey vs Caséine', text: 'Whey après l\'entraînement (absorption rapide), caséine avant le coucher (absorption lente sur 7h).' },
    { title: 'Magnésium sportif', text: 'Le magnésium réduit les crampes et améliore la récupération. 300-400mg le soir.' },
    { title: 'Oméga 3 et inflammation', text: 'Les oméga 3 réduisent l\'inflammation post-entraînement. 1-3g d\'EPA/DHA par jour.' },
  ],
  fatigue: [
    { title: 'Fer et fatigue', text: 'La carence en fer est la 1ère cause de fatigue, surtout chez les femmes. Faites un bilan sanguin (ferritine).' },
    { title: 'Vitamine D', text: 'En France, 80% de la population est carencée en hiver. 1000-2000 UI/jour d\'octobre à avril.' },
    { title: 'Magnésium', text: 'Forme bisglycinate : la mieux absorbée. 300-400mg le soir. Anti-fatigue et anti-stress.' },
    { title: 'Vitamine B12', text: 'Essentielle pour l\'énergie. Déficience fréquente chez les végétariens/végans. Supplémentation 1000µg/jour.' },
    { title: 'Rhodiola', text: 'Plante adaptogène anti-fatigue. 400mg le matin à jeun. Résultats en 1-2 semaines.' },
    { title: 'Sommeil', text: 'Chambres à 18°C, pas d\'écran 1h avant, horaires réguliers. Le sommeil est le premier anti-fatigue.' },
    { title: 'Spiruline', text: 'Riche en fer, protéines, B12. 3-5g/jour. Commencer par 1g et augmenter progressivement.' },
    { title: 'Thyroïde', text: 'Fatigue persistante + prise de poids + frilosité → faites contrôler votre TSH.' },
  ],
  senior: [
    { title: 'Vitamine D3', text: 'Indispensable après 60 ans : 1000-2000 UI/jour pour les os et l\'immunité.' },
    { title: 'Calcium', text: '1200mg/jour (alimentation + supplément). Avec vitamine D pour l\'absorption.' },
    { title: 'Oméga 3', text: 'Protection cardiovasculaire et cognitive. 1g d\'EPA/DHA par jour.' },
    { title: 'Hydratation', text: 'La sensation de soif diminue avec l\'âge. Buvez 1.5L minimum, même sans soif.' },
    { title: 'Protéines', text: '1-1.2g/kg/jour pour préserver la masse musculaire (sarcopénie).' },
    { title: 'Magnésium', text: 'Prévient crampes, fatigue et troubles du rythme cardiaque. 300mg/jour.' },
    { title: 'Ginkgo Biloba', text: 'Favorise la circulation cérébrale. 120mg/jour. Éviter si anticoagulants.' },
    { title: 'Chutes', text: 'Vitamine D + exercice d\'équilibre = -30% de risque de chutes.' },
  ],
  jeune: [
    { title: 'Fer', text: 'Les ados et jeunes femmes sont souvent carencés. Aliments riches en fer : viande rouge, lentilles, épinards.' },
    { title: 'Vitamine D', text: 'Importante pour la croissance osseuse. 1000 UI/jour en hiver.' },
    { title: 'Magnésium', text: 'Stress des examens ? Le magnésium réduit l\'anxiété et améliore la concentration.' },
    { title: 'Sommeil', text: 'Les ados ont besoin de 8-10h de sommeil. Les écrans avant le coucher retardent l\'endormissement de 30 min.' },
    { title: 'Oméga 3 et cerveau', text: 'Le DHA représente 60% des graisses du cerveau. Poissons gras 2x/semaine ou supplément.' },
    { title: 'Probiotiques', text: 'Flore intestinale = 2ème cerveau. Les antibiotiques la détruisent → probiotiques après chaque cure.' },
    { title: 'Zinc', text: 'Acné, immunité faible ? Le zinc aide. 15mg/jour pendant 3 mois.' },
    { title: 'Petit-déjeuner', text: 'Sauter le petit-déj = baisse de concentration de 20% le matin. Protéines + glucides complexes.' },
  ],
  menstruation: [
    { title: 'Fer', text: 'Les règles causent une perte de fer significative. Ferritine < 30 = supplémenter. Fer + vitamine C pour l\'absorption.' },
    { title: 'Magnésium', text: 'Réduit les crampes menstruelles de 40%. 300mg/jour, commencer 3 jours avant les règles.' },
    { title: 'Oméga 3', text: 'Anti-inflammatoire naturel. Réduit les douleurs de règles aussi bien que l\'ibuprofène.' },
    { title: 'Gattilier', text: 'Régule les cycles irréguliers. 400mg le matin à jeun. Résultats en 2-3 cycles.' },
    { title: 'Onagre', text: 'Syndrome prémenstruel (SPM) : 1000mg/jour réduit sensibilité des seins et irritabilité.' },
    { title: 'Pilule et interactions', text: 'Millepertuis, certains antibiotiques et antiépileptiques réduisent l\'efficacité de la pilule.' },
    { title: 'Spasfon', text: 'Antispasmodique sans effet hormonal. 2 comprimés au début des douleurs.' },
    { title: 'Chaleur', text: 'Une bouillotte sur le ventre dilate les vaisseaux et réduit les crampes aussi efficacement qu\'un antidouleur.' },
  ],
  maladie_chronique: [
    { title: 'Observance', text: 'Prendre ses médicaments à heure fixe augmente l\'efficacité de 40%. Utilisez les rappels PillWay.' },
    { title: 'Ne jamais arrêter seul', text: 'L\'arrêt brutal d\'un traitement chronique peut être dangereux (effet rebond, crise).' },
    { title: 'Interactions', text: 'Informez votre médecin et pharmacien de TOUS vos médicaments, y compris compléments et plantes.' },
    { title: 'Bilan sanguin', text: 'Faites les bilans sanguins demandés : surveillance des reins, foie, glycémie selon le traitement.' },
    { title: 'Generiques', text: 'Les génériques ont la même efficacité que l\'original. Seuls les excipients changent.' },
    { title: 'Voyage', text: 'Emportez toujours vos ordonnances en voyage. Gardez les médicaments en cabine (avion).' },
    { title: 'Probiotiques', text: 'Les traitements longs abîment la flore intestinale. Cure de probiotiques 1 mois, 2x/an.' },
    { title: 'Hydratation', text: 'Beaucoup de médicaments nécessitent une bonne hydratation pour être éliminés. Minimum 1.5L/jour.' },
  ],
  complement: [
    { title: 'Qualité', text: 'Choisissez des compléments avec le label "Fabriqué en France" ou norme ISO/GMP.' },
    { title: 'Surdosage', text: 'Plus ≠ mieux. Respectez les doses. Le surdosage de vitamines liposolubles (A, D, E, K) est dangereux.' },
    { title: 'Timing', text: 'Vitamines liposolubles (A, D, E, K, oméga 3) = avec un repas gras. Fer = à jeun avec vit. C.' },
    { title: 'Cures', text: 'Faites des cures de 3 mois puis pause d\'1 mois, sauf vitamine D (en continu en hiver).' },
    { title: 'Le trio essentiel', text: 'Magnésium + Vitamine D + Oméga 3 = la base pour 80% des gens en France.' },
    { title: 'Ashwagandha', text: 'Adaptogène #1 anti-stress. 600mg le soir. Réduit le cortisol de 30%. Éviter si hyperthyroïdie.' },
    { title: 'Probiotiques', text: 'Minimum 10 milliards UFC. À jeun le matin. Conserver au frais.' },
    { title: 'Spiruline', text: 'Super-aliment : 60% protéines, riche en fer, B12, antioxydants. Commencer par 1g/jour.' },
  ],
}

// ── GUIDES SANTÉ PAR CATÉGORIE ──
export const HEALTH_GUIDES = {
  sport: {
    title: 'Sport & Performance',
    icon: '💪',
    color: '#EF4444',
    intro: 'Guide complet pour optimiser vos performances sportives et votre récupération.',
    sections: [
      {
        title: 'Avant l\'entraînement',
        items: [
          'Repas 2-3h avant : glucides complexes + protéines (riz + poulet, pâtes + thon)',
          'Caféine 200mg 30 min avant pour l\'énergie (optionnel)',
          'Citrulline 6g 30 min avant pour la congestion musculaire',
          'Hydratation : 500ml d\'eau 2h avant',
        ]
      },
      {
        title: 'Pendant l\'entraînement',
        items: [
          '150-200ml d\'eau toutes les 15 minutes',
          'Si effort > 1h : boisson glucidique (30-60g glucides/h)',
          'BCAA uniquement si entraînement à jeun',
        ]
      },
      {
        title: 'Après l\'entraînement',
        items: [
          'Whey 25-30g dans les 2h (fenêtre anabolique élargie)',
          'Glucides pour reconstituer le glycogène',
          'Créatine 3-5g (moment de la journée peu important)',
          'Magnésium le soir pour la récupération musculaire',
        ]
      },
      {
        title: 'Suppléments essentiels sportif',
        items: [
          'Créatine monohydrate 5g/j – le complément le plus étudié et prouvé',
          'Protéine (whey/caséine) – 1.6 à 2.2g de protéines/kg/jour',
          'Oméga 3 – anti-inflammatoire naturel, 1-3g EPA/DHA',
          'Vitamine D – testostérone et récupération, 2000 UI/j',
          'Magnésium bisglycinate 400mg – anti-crampes, sommeil',
        ]
      },
    ]
  },
  fatigue: {
    title: 'Combattre la fatigue',
    icon: '⚡',
    color: '#F59E0B',
    intro: 'Identifier et traiter les causes de la fatigue chronique avec les bons compléments.',
    sections: [
      {
        title: 'Les analyses à faire',
        items: [
          'Ferritine (fer) – 1ère cause de fatigue, surtout chez les femmes',
          'Vitamine D – 80% des Français carencés en hiver',
          'TSH – thyroïde, si fatigue + prise de poids + frilosité',
          'Vitamine B12 – surtout si végétarien/végan',
          'Magnésium sanguin (peu fiable) – souvent carencé',
        ]
      },
      {
        title: 'Protocole anti-fatigue',
        items: [
          'Magnésium bisglycinate 300-400mg le soir',
          'Vitamine D3 2000 UI/jour d\'octobre à avril',
          'Fer + Vitamine C si ferritine < 30 ng/mL',
          'B Complex le matin pour l\'énergie',
          'Rhodiola 400mg le matin (adaptogène anti-fatigue)',
        ]
      },
      {
        title: 'Hygiène de vie',
        items: [
          'Sommeil : 7-9h, horaires réguliers, chambre à 18°C',
          'Hydratation : 1.5-2L d\'eau par jour',
          'Exercice : 30 min de marche/jour = +30% d\'énergie en 4 semaines',
          'Limiter écrans 1h avant le coucher (lumière bleue = -30% mélatonine)',
          'Réduire sucres raffinés : pics glycémiques = coups de fatigue',
        ]
      },
    ]
  },
  senior: {
    title: 'Santé des seniors',
    icon: '🏥',
    color: '#6366F1',
    intro: 'Besoins spécifiques après 60 ans : os, muscles, cerveau et système cardiovasculaire.',
    sections: [
      {
        title: 'Compléments essentiels',
        items: [
          'Vitamine D3 1000-2000 UI/jour – os + immunité (chutes -30%)',
          'Calcium 1200mg/jour total (alimentation + supplément)',
          'Oméga 3 1g EPA/DHA – cerveau et cœur',
          'Magnésium 300mg – crampes et rythme cardiaque',
          'Vitamine B12 1000µg – absorption réduite avec l\'âge',
        ]
      },
      {
        title: 'Prévention',
        items: [
          'Exercice d\'équilibre quotidien : prévention des chutes',
          'Protéines 1-1.2g/kg/jour pour lutter contre la sarcopénie',
          'Hydratation : boire sans attendre la soif (sensation diminuée)',
          'Bilan sanguin annuel : glycémie, cholestérol, reins, thyroïde',
          'Vaccination grippe + COVID à jour',
        ]
      },
      {
        title: 'Attention aux médicaments',
        items: [
          'La polymédication augmente les risques d\'interactions',
          'Signaler TOUS les médicaments à votre médecin (y compris compléments)',
          'Fonction rénale diminuée → doses parfois à adapter',
          'Risque de chutes avec certains médicaments (benzodiazépines, antihypertenseurs)',
          'Pilulier ou rappels PillWay pour ne rien oublier',
        ]
      },
    ]
  },
  jeune: {
    title: 'Santé des jeunes',
    icon: '🎓',
    color: '#22C55E',
    intro: 'Énergie, concentration et immunité pour les 15-30 ans.',
    sections: [
      {
        title: 'Besoins spécifiques',
        items: [
          'Fer – carences fréquentes chez les jeunes femmes',
          'Vitamine D 1000 UI/jour en hiver',
          'Oméga 3 – développement cérébral, mémoire, concentration',
          'Zinc 15mg – immunité + acné',
          'Magnésium – stress des examens, sommeil',
        ]
      },
      {
        title: 'Étudiant & concentration',
        items: [
          'Petit-déjeuner = +20% de concentration le matin',
          'Oméga 3 : le DHA = 60% des graisses du cerveau',
          'Rhodiola 400mg : concentration et mémoire',
          'Magnésium le soir : meilleur sommeil → meilleure mémoire',
          'Pause de 5 min toutes les 25 min (technique Pomodoro)',
        ]
      },
      {
        title: 'Bonnes habitudes',
        items: [
          '8-10h de sommeil pour les ados, 7-9h pour les 20+',
          'Sport 3x/semaine : réduit anxiété de 50% et améliore le sommeil',
          'Limiter alcool et tabac : effets décuplés sur un corps en développement',
          'Probiotiques après chaque cure d\'antibiotiques',
          'Écrans la nuit : mode nuit + arrêt 1h avant le coucher',
        ]
      },
    ]
  },
  menstruation: {
    title: 'Cycle féminin',
    icon: '🌸',
    color: '#EC4899',
    intro: 'Soulager les douleurs, réguler le cycle et prévenir les carences liées aux règles.',
    sections: [
      {
        title: 'Douleurs menstruelles',
        items: [
          'Magnésium 300mg/jour – réduit crampes de 40%. Commencer 3 jours avant.',
          'Oméga 3 2g/jour – anti-inflammatoire aussi efficace que l\'ibuprofène',
          'Spasfon 2cp – antispasmodique, pas d\'effet hormonal',
          'Ibuprofène 400mg – si douleur forte, AU REPAS, max 3 jours',
          'Bouillotte chaude sur le ventre – dilate les vaisseaux, soulage les crampes',
        ]
      },
      {
        title: 'Syndrome prémenstruel (SPM)',
        items: [
          'Onagre 1000mg/jour – sensibilité des seins, irritabilité',
          'Magnésium + B6 – rétention d\'eau, sautes d\'humeur',
          'Gattilier 400mg le matin – régule les cycles irréguliers (2-3 cycles)',
          'Réduire sel et sucre en phase lutéale (2ème moitié du cycle)',
          'Exercice doux (yoga, marche) – réduit le SPM de 30%',
        ]
      },
      {
        title: 'Contraception & interactions',
        items: [
          'Millepertuis = INTERDIT avec la pilule (réduit l\'efficacité)',
          'Certains antibiotiques → utiliser un préservatif en plus',
          'Pilule à heure fixe : utilisez les rappels PillWay',
          'Oubli de pilule > 12h (combinée) ou > 3h (progestative) → pilule du lendemain',
          'Arrêt pilule : les cycles peuvent mettre 3-6 mois à se régulariser',
        ]
      },
      {
        title: 'Prévenir les carences',
        items: [
          'Fer : les règles = perte de 15-30mg de fer/cycle. Contrôler la ferritine.',
          'Fer (Tardyferon) + Vitamine C pour l\'absorption',
          'Pas de thé/café 2h autour de la prise de fer',
          'Vitamine B9 (acide folique) si projet de grossesse : commencer 3 mois avant',
        ]
      },
    ]
  },
  maladie_chronique: {
    title: 'Maladies chroniques',
    icon: '🏥',
    color: '#0EA5E9',
    intro: 'Bien vivre avec un traitement au long cours : observance, surveillance et interactions.',
    sections: [
      {
        title: 'Observance du traitement',
        items: [
          'Prendre ses médicaments à heure fixe (+40% d\'efficacité)',
          'Ne JAMAIS arrêter un traitement sans avis médical (effet rebond)',
          'Pilulier ou rappels PillWay pour ne rien oublier',
          'Garder ses ordonnances à jour et accessibles',
          'En voyage : médicaments en cabine, avec ordonnance',
        ]
      },
      {
        title: 'Surveillance',
        items: [
          'Bilan sanguin selon le traitement (reins, foie, glycémie, TSH...)',
          'Signaler tout effet indésirable à votre médecin',
          'Générique = même efficacité, seuls les excipients changent',
          'Consulter avant toute automédication (même paracétamol)',
        ]
      },
      {
        title: 'Compléments utiles',
        items: [
          'Probiotiques : 1 cure de 1 mois, 2 fois par an (flore intestinale)',
          'Vitamine D : souvent carencé sous traitement long',
          'Magnésium : anti-stress, anti-crampes, compatible avec la plupart des traitements',
          'Oméga 3 : anti-inflammatoire doux, bon pour le cœur et le cerveau',
        ]
      },
    ]
  },
  complement: {
    title: 'Compléments alimentaires',
    icon: '🌿',
    color: '#22C55E',
    intro: 'Comment bien choisir, doser et combiner vos compléments alimentaires.',
    sections: [
      {
        title: 'Le trio essentiel',
        items: [
          'Magnésium bisglycinate 300-400mg – le soir, anti-stress, anti-fatigue',
          'Vitamine D3 2000 UI – au repas, d\'octobre à avril (ou toute l\'année)',
          'Oméga 3 (EPA/DHA) 1g – au repas, cerveau + cœur + anti-inflammatoire',
        ]
      },
      {
        title: 'Quand les prendre',
        items: [
          'MATIN à jeun : Rhodiola, probiotiques, fer + vitamine C',
          'MATIN au repas : Vitamines B, vitamine D, oméga 3, spiruline',
          'MIDI au repas : Curcuma, zinc, oméga 3 si 2ème prise',
          'SOIR : Magnésium, ashwagandha, valériane, mélatonine',
        ]
      },
      {
        title: 'Règles d\'or',
        items: [
          'Plus ≠ mieux : respectez les doses recommandées',
          'Cures de 3 mois, puis pause de 1 mois',
          'Vitamines liposolubles (A, D, E, K) avec un repas gras',
          'Fer loin du thé, café, calcium et produits laitiers',
          'Qualité : labels "Fabriqué en France", ISO, GMP',
          'Informez votre médecin de vos compléments',
        ]
      },
      {
        title: 'Les adaptogènes',
        items: [
          'Ashwagandha 600mg – stress, cortisol, sommeil. Le soir.',
          'Rhodiola 400mg – fatigue, concentration. Le matin à jeun.',
          'Ginseng 250mg – énergie, vitalité. Le matin. Cure 3 mois.',
          'Maca 1500mg – énergie, hormones, libido. Le matin.',
          'Ne pas combiner plus de 2 adaptogènes en même temps.',
        ]
      },
    ]
  },
}

/**
 * Vérifie les interactions entre une liste de médicaments
 * @param {Array} userMeds - [{name: 'Doliprane', ...}, ...]
 * @returns {Array} - [{med1, med2, severity, message}]
 */
export function checkInteractions(userMeds) {
  const found = []
  const names = userMeds.map(m => m.name.toLowerCase())

  for (let i = 0; i < names.length; i++) {
    const interactions = INTERACTIONS[names[i]]
    if (!interactions) continue

    for (const inter of interactions) {
      const matchIdx = names.findIndex((n, j) => j !== i && n.includes(inter.with.toLowerCase()))
      if (matchIdx !== -1) {
        // Avoid duplicate pairs
        const key = [names[i], names[matchIdx]].sort().join('|')
        if (!found.some(f => [f.med1, f.med2].sort().join('|') === key && f.message === inter.message)) {
          found.push({
            med1: userMeds[i].name,
            med2: userMeds[matchIdx].name,
            severity: inter.severity,
            message: inter.message,
          })
        }
      }
    }
  }

  // Sort by severity: danger > warning > info
  const severityOrder = { danger: 0, warning: 1, info: 2 }
  found.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
  return found
}

/**
 * Obtient des conseils personnalisés basés sur les médicaments de l'utilisateur
 * @param {Array} userMeds - [{name, category, ...}]
 * @returns {Array} - [{title, text, type}]
 */
export function getPersonalizedTips(userMeds) {
  const tips = []
  const categories = [...new Set(userMeds.map(m => m.category).filter(Boolean))]

  // Tip si le fer est pris avec du café/thé
  if (userMeds.some(m => m.name.toLowerCase().includes('fer'))) {
    tips.push({ title: 'Prise de fer', text: 'Prenez le fer à jeun avec un verre de jus d\'orange (vitamine C). Évitez thé et café 2h autour.', type: 'info' })
  }

  // Tip si levothyrox
  if (userMeds.some(m => m.name.toLowerCase().includes('levothyrox'))) {
    tips.push({ title: 'Levothyrox', text: 'À jeun, 30 min avant le petit-déjeuner. Pas de fer, calcium ou café pendant ce temps.', type: 'info' })
  }

  // Tip si antibiotique
  if (categories.includes('antibiotique')) {
    tips.push({ title: 'Antibiotique en cours', text: 'Terminez le traitement même si vous vous sentez mieux. Pensez aux probiotiques 2h après la prise.', type: 'warning' })
  }

  // Tip si pilule contraceptive
  if (categories.includes('contraception')) {
    tips.push({ title: 'Pilule contraceptive', text: 'Prenez-la à heure fixe. Vérifiez les interactions avec vos autres médicaments (millepertuis, certains antibiotiques).', type: 'warning' })
  }

  // Tip si anti-inflammatoire
  if (categories.includes('inflammation') || userMeds.some(m => ['advil', 'nurofen', 'ibuprofène', 'voltarène'].includes(m.name.toLowerCase()))) {
    tips.push({ title: 'Anti-inflammatoire', text: 'Toujours au milieu du repas. Max 3-5 jours sans avis médical. Protégez votre estomac.', type: 'warning' })
  }

  // Tip si statine
  if (userMeds.some(m => m.name.toLowerCase().includes('atorvastatine') || m.name.toLowerCase().includes('statine'))) {
    tips.push({ title: 'Statine', text: 'Prendre le soir. Éviter le pamplemousse. Faire bilan hépatique régulier.', type: 'info' })
  }

  // Tip si benzodiazépine
  if (userMeds.some(m => ['lexomil', 'xanax'].includes(m.name.toLowerCase()))) {
    tips.push({ title: 'Benzodiazépine', text: 'Traitement temporaire uniquement. Pas d\'alcool. Risque de dépendance si usage prolongé.', type: 'danger' })
  }

  // Tip si sport supplements
  if (categories.includes('sport')) {
    tips.push({ title: 'Compléments sportifs', text: 'Protéines dans les 2h après l\'effort. Créatine à n\'importe quel moment. Buvez beaucoup d\'eau.', type: 'info' })
  }

  return tips
}
