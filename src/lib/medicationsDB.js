// Base de médicaments français courants avec catégories, dosages, conseils
export const MEDICATIONS_DB = [
  // ── DOULEUR & FIÈVRE ──
  { name: 'Doliprane', dosage: '500 mg', form: 'comprimé', category: 'douleur', tip: 'Max 3g/jour. Espacer de 4-6h entre les prises.' },
  { name: 'Doliprane', dosage: '1000 mg', form: 'comprimé', category: 'douleur', tip: 'Max 3g/jour. Ne pas associer avec d\'autres médicaments contenant du paracétamol.' },
  { name: 'Efferalgan', dosage: '1000 mg', form: 'comprimé', category: 'douleur', tip: 'Effervescent, à prendre dans un grand verre d\'eau.' },
  { name: 'Dafalgan', dosage: '1000 mg', form: 'comprimé', category: 'douleur' },
  { name: 'Advil', dosage: '400 mg', form: 'comprimé', category: 'douleur', tip: 'Prendre au milieu du repas. Éviter si problèmes gastriques.' },
  { name: 'Nurofen', dosage: '400 mg', form: 'comprimé', category: 'douleur', tip: 'Ne pas dépasser 1200mg/jour. Prendre avec de la nourriture.' },
  { name: 'Aspirine', dosage: '500 mg', form: 'comprimé', category: 'douleur', tip: 'Éviter chez les moins de 16 ans. Ne pas associer avec anticoagulants.' },
  { name: 'Spasfon', dosage: '80 mg', form: 'comprimé', category: 'douleur', tip: 'Antispasmodique. Utile pour douleurs abdominales et menstruelles.' },
  { name: 'Tramadol', dosage: '50 mg', form: 'gélule', category: 'douleur', tip: 'Sur ordonnance. Peut causer somnolence.' },
  { name: 'Lamaline', dosage: '', form: 'gélule', category: 'douleur' },

  // ── ANTI-INFLAMMATOIRES ──
  { name: 'Ibuprofène', dosage: '400 mg', form: 'comprimé', category: 'inflammation', tip: 'Toujours prendre au milieu du repas. Max 3 jours sans avis médical.' },
  { name: 'Kétoprofène', dosage: '100 mg', form: 'gélule', category: 'inflammation', tip: 'Sur ordonnance. Prendre avec nourriture.' },
  { name: 'Voltarène', dosage: '50 mg', form: 'comprimé', category: 'inflammation', tip: 'Anti-inflammatoire puissant. Protéger l\'estomac.' },
  { name: 'Diclofénac', dosage: '50 mg', form: 'comprimé', category: 'inflammation' },

  // ── ANTIBIOTIQUES ──
  { name: 'Amoxicilline', dosage: '500 mg', form: 'gélule', category: 'antibiotique', tip: 'Terminer tout le traitement même si vous vous sentez mieux.' },
  { name: 'Amoxicilline', dosage: '1000 mg', form: 'comprimé', category: 'antibiotique', tip: 'Espacer les prises régulièrement (8h). Finir le traitement.' },
  { name: 'Augmentin', dosage: '1000/125 mg', form: 'comprimé', category: 'antibiotique', tip: 'Prendre en début de repas. Peut causer diarrhée → probiotiques recommandés.' },
  { name: 'Azithromycine', dosage: '250 mg', form: 'comprimé', category: 'antibiotique', tip: 'Traitement court (3-5 jours). 1h avant ou 2h après repas.' },
  { name: 'Ciprofloxacine', dosage: '500 mg', form: 'comprimé', category: 'antibiotique', tip: 'Éviter produits laitiers 2h avant/après. Boire beaucoup d\'eau.' },
  { name: 'Métronidazole', dosage: '500 mg', form: 'comprimé', category: 'antibiotique', tip: 'Pas d\'alcool pendant le traitement et 48h après.' },

  // ── GASTRO ──
  { name: 'Oméprazole', dosage: '20 mg', form: 'gélule', category: 'gastro', tip: 'Prendre 30 min avant le petit déjeuner. Protège l\'estomac.' },
  { name: 'Pantoprazole', dosage: '20 mg', form: 'comprimé', category: 'gastro', tip: 'Protecteur gastrique. À jeun le matin.' },
  { name: 'Gaviscon', dosage: '', form: 'sirop', category: 'gastro', tip: 'Après les repas et au coucher. Forme un gel protecteur.' },
  { name: 'Smecta', dosage: '3 g', form: 'sachet', category: 'gastro', tip: 'Espacer de 2h avec les autres médicaments.' },
  { name: 'Imodium', dosage: '2 mg', form: 'gélule', category: 'gastro', tip: 'Max 4 gélules/jour. Pas si fièvre ou sang dans les selles.' },

  // ── CARDIO / TENSION ──
  { name: 'Amlodipine', dosage: '5 mg', form: 'comprimé', category: 'cardio', tip: 'Prendre à heure fixe. Ne pas arrêter brutalement.' },
  { name: 'Ramipril', dosage: '5 mg', form: 'comprimé', category: 'cardio', tip: 'Contrôler régulièrement la tension.' },
  { name: 'Bisoprolol', dosage: '5 mg', form: 'comprimé', category: 'cardio', tip: 'Bêta-bloquant. Ne jamais arrêter brutalement.' },
  { name: 'Losartan', dosage: '50 mg', form: 'comprimé', category: 'cardio', tip: 'Protège les reins chez les diabétiques.' },
  { name: 'Kardégic', dosage: '75 mg', form: 'sachet', category: 'cardio', tip: 'Antiagrégant plaquettaire. Au milieu du repas.' },
  { name: 'Atorvastatine', dosage: '20 mg', form: 'comprimé', category: 'cardio', tip: 'Prendre le soir. Contrôler le cholestérol régulièrement.' },
  { name: 'Furosémide', dosage: '40 mg', form: 'comprimé', category: 'cardio', tip: 'Diurétique. Prendre le matin. Boire suffisamment.' },

  // ── DIABÈTE ──
  { name: 'Metformine', dosage: '500 mg', form: 'comprimé', category: 'diabete', tip: 'Au milieu ou fin de repas. Peut causer troubles digestifs au début.' },
  { name: 'Metformine', dosage: '1000 mg', form: 'comprimé', category: 'diabete', tip: 'Boire beaucoup d\'eau. Contrôler la glycémie régulièrement.' },
  { name: 'Insuline Lantus', dosage: '', form: 'injection', category: 'diabete', tip: 'Insuline lente. Injecter à heure fixe chaque jour.' },

  // ── THYROÏDE ──
  { name: 'Levothyrox', dosage: '50 µg', form: 'comprimé', category: 'thyroide', tip: 'À jeun, 30 min avant le petit déjeuner. Pas de café ni fer avec.' },
  { name: 'Levothyrox', dosage: '75 µg', form: 'comprimé', category: 'thyroide', tip: 'Espacer de 2h avec calcium et fer.' },
  { name: 'Levothyrox', dosage: '100 µg', form: 'comprimé', category: 'thyroide' },

  // ── ALLERGIE ──
  { name: 'Cétirizine', dosage: '10 mg', form: 'comprimé', category: 'allergie', tip: 'Antihistaminique. Peut causer somnolence légère.' },
  { name: 'Loratadine', dosage: '10 mg', form: 'comprimé', category: 'allergie', tip: 'Non sédatif. 1 par jour.' },
  { name: 'Aerius', dosage: '5 mg', form: 'comprimé', category: 'allergie', tip: 'Sans somnolence.' },

  // ── ANXIÉTÉ / SOMMEIL ──
  { name: 'Lexomil', dosage: '6 mg', form: 'comprimé', category: 'sommeil', tip: 'Benzodiazépine. Traitement court. Risque de dépendance.' },
  { name: 'Xanax', dosage: '0.25 mg', form: 'comprimé', category: 'sommeil', tip: 'Ne pas associer avec alcool. Durée limitée.' },
  { name: 'Stilnox', dosage: '10 mg', form: 'comprimé', category: 'sommeil', tip: 'Juste avant le coucher. Max 4 semaines.' },
  { name: 'Donormyl', dosage: '15 mg', form: 'comprimé', category: 'sommeil', tip: 'En vente libre. 30 min avant le coucher.' },
  { name: 'Mélatonine', dosage: '2 mg', form: 'comprimé', category: 'sommeil', tip: 'Hormone naturelle. 30 min avant le coucher.' },

  // ── ANTIDÉPRESSEURS ──
  { name: 'Sertraline', dosage: '50 mg', form: 'comprimé', category: 'mental', tip: 'Effet après 2-4 semaines. Ne pas arrêter brutalement.' },
  { name: 'Escitalopram', dosage: '10 mg', form: 'comprimé', category: 'mental', tip: 'ISRS. Prendre le matin.' },
  { name: 'Fluoxétine', dosage: '20 mg', form: 'gélule', category: 'mental', tip: 'Le matin. Effet complet après 4-6 semaines.' },

  // ── CONTRACEPTION ──
  { name: 'Leeloo', dosage: '', form: 'comprimé', category: 'contraception', tip: 'Heure fixe. 21 jours + 7 jours d\'arrêt.' },
  { name: 'Optilova', dosage: '', form: 'comprimé', category: 'contraception', tip: 'Pilule combinée. Même heure chaque jour.' },
  { name: 'Cerazette', dosage: '', form: 'comprimé', category: 'contraception', tip: 'Microprogestative. En continu, tolérance 12h de retard.' },
  { name: 'Yaz', dosage: '', form: 'comprimé', category: 'contraception', tip: '24 actifs + 4 placebo. Anti-rétention d\'eau.' },

  // ── ASTHME ──
  { name: 'Ventoline', dosage: '100 µg', form: 'inhalateur', category: 'respiratoire', tip: 'Bronchodilatateur d\'urgence. Max 8 bouffées/jour.' },
  { name: 'Seretide', dosage: '250/25 µg', form: 'inhalateur', category: 'respiratoire', tip: 'Traitement de fond. Ne pas arrêter.' },

  // ── CORTICOÏDES / ORL ──
  { name: 'Prednisone', dosage: '20 mg', form: 'comprimé', category: 'corticoide', tip: 'Le matin avec repas. Diminuer progressivement.' },
  { name: 'Diprosone', dosage: '0.05%', form: 'crème', category: 'corticoide', tip: 'Application locale fine. Pas sur le visage.' },
  { name: 'Aturgyl', dosage: '0.05%', form: 'spray nasal', category: 'orl', tip: 'Décongestionnant. Max 5 jours.' },

  // ═══════════════════════════════════════════
  // COMPLÉMENTS & VITAMINES
  // ═══════════════════════════════════════════
  { name: 'Vitamine D3', dosage: '1000 UI', form: 'comprimé', category: 'vitamine', tip: 'Avec repas gras. Essentielle en hiver.' },
  { name: 'Vitamine D3', dosage: '2000 UI', form: 'gouttes', category: 'vitamine', tip: 'Os et système immunitaire.' },
  { name: 'Vitamine C', dosage: '500 mg', form: 'comprimé', category: 'vitamine', tip: 'Antioxydant. Le matin. Renforce l\'immunité.' },
  { name: 'Vitamine C', dosage: '1000 mg', form: 'comprimé', category: 'vitamine', tip: 'Dose élevée. Peut causer troubles digestifs.' },
  { name: 'Vitamine B12', dosage: '1000 µg', form: 'comprimé', category: 'vitamine', tip: 'Essentielle pour végétariens/végans.' },
  { name: 'Vitamine B Complex', dosage: '', form: 'comprimé', category: 'vitamine', tip: 'Énergie, système nerveux. Le matin.' },
  { name: 'Vitamine K2', dosage: '100 µg', form: 'gélule', category: 'vitamine', tip: 'Synergie avec vitamine D. Santé osseuse.' },
  { name: 'Acide folique (B9)', dosage: '400 µg', form: 'comprimé', category: 'vitamine', tip: 'Essentiel grossesse. Bon pour le cerveau.' },

  // ── MINÉRAUX ──
  { name: 'Magnésium', dosage: '300 mg', form: 'comprimé', category: 'mineral', tip: 'Anti-fatigue, anti-stress, anti-crampes. Le soir.' },
  { name: 'Magnésium Bisglycinate', dosage: '400 mg', form: 'gélule', category: 'mineral', tip: 'Très bien absorbé. Idéal le soir pour le sommeil.' },
  { name: 'Fer (Tardyferon)', dosage: '80 mg', form: 'comprimé', category: 'mineral', tip: 'À jeun avec vitamine C. Pas de thé/café 2h autour.' },
  { name: 'Zinc', dosage: '15 mg', form: 'comprimé', category: 'mineral', tip: 'Immunité, peau, cheveux. Loin des repas.' },
  { name: 'Sélénium', dosage: '200 µg', form: 'comprimé', category: 'mineral', tip: 'Antioxydant. Thyroïde et immunité.' },
  { name: 'Calcium', dosage: '500 mg', form: 'comprimé', category: 'mineral', tip: 'Os et dents. Avec vitamine D. Pas avec le fer.' },
  { name: 'Chrome', dosage: '200 µg', form: 'comprimé', category: 'mineral', tip: 'Régulation du sucre sanguin.' },

  // ── OMÉGA ──
  { name: 'Oméga 3 (EPA/DHA)', dosage: '1000 mg', form: 'gélule', category: 'omega', tip: 'Anti-inflammatoire, cerveau, coeur. Au repas.' },
  { name: 'Huile de Krill', dosage: '500 mg', form: 'gélule', category: 'omega', tip: 'Meilleure absorption que huile de poisson.' },

  // ═══════════════════════════════════════════
  // SPORT & PERFORMANCE
  // ═══════════════════════════════════════════
  { name: 'Whey Protéine', dosage: '30 g', form: 'poudre', category: 'sport', tip: 'Après entraînement. 1.6-2.2g/kg/jour pour sportifs.' },
  { name: 'Whey Isolate', dosage: '30 g', form: 'poudre', category: 'sport', tip: 'Plus pure, moins de lactose.' },
  { name: 'Caséine', dosage: '30 g', form: 'poudre', category: 'sport', tip: 'Protéine lente. Idéale avant le coucher.' },
  { name: 'Protéine Végétale', dosage: '30 g', form: 'poudre', category: 'sport', tip: 'Vegan. Combiner pois + riz pour acides aminés complets.' },
  { name: 'Créatine Monohydrate', dosage: '5 g', form: 'poudre', category: 'sport', tip: 'Force et récupération. 3-5g/jour. Boire beaucoup d\'eau.' },
  { name: 'BCAA', dosage: '5 g', form: 'poudre', category: 'sport', tip: 'Pendant/après entraînement. Utile si entraînement à jeun.' },
  { name: 'Glutamine', dosage: '5 g', form: 'poudre', category: 'sport', tip: 'Récupération musculaire et intestinale.' },
  { name: 'Citrulline', dosage: '6 g', form: 'poudre', category: 'sport', tip: 'Flux sanguin. 30 min avant entraînement.' },
  { name: 'Bêta-Alanine', dosage: '3.2 g', form: 'poudre', category: 'sport', tip: 'Endurance musculaire. Picotements normaux.' },
  { name: 'Caféine', dosage: '200 mg', form: 'comprimé', category: 'sport', tip: 'Pré-entraînement. Pas après 14h.' },
  { name: 'Collagène', dosage: '10 g', form: 'poudre', category: 'sport', tip: 'Articulations, peau, tendons. Avec vitamine C.' },
  { name: 'Glucosamine', dosage: '1500 mg', form: 'comprimé', category: 'sport', tip: 'Protection articulaire. Résultats après 4-6 semaines.' },
  { name: 'Curcuma', dosage: '500 mg', form: 'gélule', category: 'sport', tip: 'Anti-inflammatoire naturel. Avec pipérine (poivre noir).' },

  // ═══════════════════════════════════════════
  // PHYTOTHÉRAPIE
  // ═══════════════════════════════════════════
  { name: 'Ashwagandha', dosage: '600 mg', form: 'gélule', category: 'phyto', tip: 'Adaptogène anti-stress. Le soir. Résultats 2-4 semaines.' },
  { name: 'Rhodiola', dosage: '400 mg', form: 'gélule', category: 'phyto', tip: 'Anti-fatigue, concentration. Le matin à jeun.' },
  { name: 'Spiruline', dosage: '3 g', form: 'comprimé', category: 'phyto', tip: 'Riche en fer et protéines. Commencer petit (1g).' },
  { name: 'Probiotiques', dosage: '10 milliards UFC', form: 'gélule', category: 'phyto', tip: 'Flore intestinale. À jeun le matin. Au frais.' },
  { name: 'Chardon Marie', dosage: '200 mg', form: 'gélule', category: 'phyto', tip: 'Protection hépatique. Avant les repas.' },
  { name: 'Millepertuis', dosage: '300 mg', form: 'gélule', category: 'phyto', tip: 'Dépression légère. ATTENTION: interactions pilule et antidépresseurs.' },
  { name: 'Valériane', dosage: '500 mg', form: 'gélule', category: 'phyto', tip: 'Sommeil et anxiété. 30 min avant coucher.' },
  { name: 'Ginkgo Biloba', dosage: '120 mg', form: 'comprimé', category: 'phyto', tip: 'Mémoire et circulation. Éviter si anticoagulants.' },
  { name: 'Ginseng', dosage: '250 mg', form: 'gélule', category: 'phyto', tip: 'Énergie et vitalité. Le matin. Cure 3 mois max.' },
  { name: 'Maca', dosage: '1500 mg', form: 'comprimé', category: 'phyto', tip: 'Énergie, libido, hormones. Le matin.' },
  { name: 'Euphytose', dosage: '', form: 'comprimé', category: 'phyto', tip: 'Valériane + passiflore + aubépine. Stress et sommeil.' },

  // ── SANTÉ FEMININE ──
  { name: 'Onagre', dosage: '1000 mg', form: 'gélule', category: 'feminin', tip: 'Syndrome prémenstruel, peau sèche. Au repas.' },
  { name: 'Gattilier', dosage: '400 mg', form: 'gélule', category: 'feminin', tip: 'Régule le cycle menstruel. Le matin à jeun.' },
  { name: 'Canneberge', dosage: '500 mg', form: 'gélule', category: 'feminin', tip: 'Prévention infections urinaires. Boire de l\'eau.' },

  // ── HYDRATATION ──
  { name: 'Eau', dosage: '250 ml', form: 'verre', category: 'hydratation', tip: 'Objectif : 1.5 à 2L par jour. Plus si sport ou chaleur.' },
]

export const CATEGORIES = {
  hydratation: { label: 'Hydratation', icon: '💧', color: '#3B82F6' },
  vitamine: { label: 'Vitamines', icon: '🌟', color: '#F59E0B' },
  mineral: { label: 'Minéraux', icon: '⚡', color: '#8B5CF6' },
  omega: { label: 'Oméga', icon: '🐟', color: '#06B6D4' },
  sport: { label: 'Sport', icon: '💪', color: '#EF4444' },
  phyto: { label: 'Phytothérapie', icon: '🌿', color: '#22C55E' },
  feminin: { label: 'Féminin', icon: '🌸', color: '#EC4899' },
  douleur: { label: 'Douleur', icon: '💊', color: '#10B981' },
  inflammation: { label: 'Anti-inflammatoires', icon: '🔥', color: '#F97316' },
  antibiotique: { label: 'Antibiotiques', icon: '🦠', color: '#14B8A6' },
  gastro: { label: 'Gastro', icon: '🫁', color: '#A855F7' },
  cardio: { label: 'Cardio', icon: '❤️', color: '#EF4444' },
  diabete: { label: 'Diabète', icon: '🩸', color: '#F43F5E' },
  thyroide: { label: 'Thyroïde', icon: '🦋', color: '#6366F1' },
  allergie: { label: 'Allergie', icon: '🤧', color: '#F59E0B' },
  sommeil: { label: 'Sommeil', icon: '😴', color: '#7C3AED' },
  mental: { label: 'Mental', icon: '🧠', color: '#6366F1' },
  contraception: { label: 'Contraception', icon: '💜', color: '#D946EF' },
  respiratoire: { label: 'Respiratoire', icon: '🫁', color: '#0EA5E9' },
  corticoide: { label: 'Corticoïdes', icon: '💉', color: '#F97316' },
  orl: { label: 'ORL', icon: '👃', color: '#84CC16' },
}

export function searchMedications(query) {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return MEDICATIONS_DB
    .filter(m => m.name.toLowerCase().includes(q) || m.dosage.toLowerCase().includes(q))
    .slice(0, 10)
}

export function getMedicationsByCategory(category) {
  return MEDICATIONS_DB.filter(m => m.category === category)
}
