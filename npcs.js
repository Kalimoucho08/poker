// === PNJ V8 — 20+ archétypes + mix génétique + adaptation dynamique ===

// --- Traits de personnalité (entre 0 et 1) ---
// tightness : 0=loose, 1=ultra tight (joue peu de mains)
// aggression : 0=passif, 1=hyper agressif
// bluffFreq : 0=jamais bluff, 1=bluff tout le temps
// rationality : 0=émotionnel/chaotique, 1=mathématique/GTO
// adaptability : 0=figé, 1=s'adapte complètement au contexte
// tiltResist : 0=explose au moindre bad beat, 1=imperturbable
// showdownValue : 0=fold facilement, 1=call down jusqu'au bout
// creativity : 0=ABC basique, 1=lignes créatives
// tableAwareness : 0=joue ses cartes, 1=joue les joueurs
// tournamentIQ : 0=pense en cash game, 1=pense en ICM/tournoi

const ARCHETYPES = [
  {
    id: 'nit',
    name: 'Le Nit',
    emoji: '🧊',
    backstory: 'Joue 3 mains par heure. Préfère regarder Netflix.',
    style: 'Tight-Passif Extrême',
    catchphrase: 'Je vais attendre les As... encore.',
    traits: { tightness:0.92, aggression:0.12, bluffFreq:0.03, rationality:0.80, adaptability:0.10, tiltResist:0.90, showdownValue:0.15, creativity:0.05, tableAwareness:0.10, tournamentIQ:0.30 },
    color: '#5dade2'
  },
  {
    id: 'rock',
    name: 'Le Roc',
    emoji: '🪨',
    backstory: 'Joueur ABC solide. Rien de fancy, mais efficace.',
    style: 'Tight-Passif Solide',
    catchphrase: 'ABC poker. Pas besoin de plus.',
    traits: { tightness:0.75, aggression:0.25, bluffFreq:0.10, rationality:0.85, adaptability:0.20, tiltResist:0.85, showdownValue:0.30, creativity:0.10, tableAwareness:0.15, tournamentIQ:0.40 },
    color: '#95a5a6'
  },
  {
    id: 'tag',
    name: 'Le TAG',
    emoji: '🎯',
    backstory: 'Tight-Aggressif standard. Le reg de base.',
    style: 'Tight-Aggressif',
    catchphrase: 'Position, ranges, value bets.',
    traits: { tightness:0.65, aggression:0.55, bluffFreq:0.25, rationality:0.80, adaptability:0.45, tiltResist:0.70, showdownValue:0.35, creativity:0.30, tableAwareness:0.50, tournamentIQ:0.60 },
    color: '#3498db'
  },
  {
    id: 'lag',
    name: 'Le LAG',
    emoji: '🐅',
    backstory: 'Met la pression constante. Table captain.',
    style: 'Loose-Aggressif',
    catchphrase: 'Si tu sens la pression, c\'est moi.',
    traits: { tightness:0.30, aggression:0.80, bluffFreq:0.50, rationality:0.60, adaptability:0.70, tiltResist:0.55, showdownValue:0.20, creativity:0.70, tableAwareness:0.80, tournamentIQ:0.55 },
    color: '#e67e22'
  },
  {
    id: 'maniac',
    name: 'Le Maniac',
    emoji: '🤪',
    backstory: 'Joue toutes les mains. Relance tout le temps. Chaos total.',
    style: 'Maniac',
    catchphrase: 'ALL IN ! Ah non, je rigole. Ou pas.',
    traits: { tightness:0.05, aggression:0.95, bluffFreq:0.75, rationality:0.15, adaptability:0.60, tiltResist:0.90, showdownValue:0.10, creativity:0.50, tableAwareness:0.10, tournamentIQ:0.10 },
    color: '#e74c3c'
  },
  {
    id: 'calling_station',
    name: 'La Station',
    emoji: '📞',
    backstory: 'Call, call, call. Ne fold jamais. "Je voulais voir".',
    style: 'Calling Station',
    catchphrase: 'Je paye, on va bien voir.',
    traits: { tightness:0.15, aggression:0.05, bluffFreq:0.02, rationality:0.20, adaptability:0.05, tiltResist:0.80, showdownValue:0.95, creativity:0.02, tableAwareness:0.05, tournamentIQ:0.05 },
    color: '#f39c12'
  },
  {
    id: 'shark',
    name: 'Le Requin',
    emoji: '🦈',
    backstory: 'Pro du circuit. Lit les âmes. Inexploitable.',
    style: 'Équilibré/Pro',
    catchphrase: 'Le poker, c\'est un jeu de personnes déguisé en jeu de cartes.',
    traits: { tightness:0.55, aggression:0.65, bluffFreq:0.40, rationality:0.90, adaptability:0.85, tiltResist:0.85, showdownValue:0.30, creativity:0.75, tableAwareness:0.95, tournamentIQ:0.90 },
    color: '#8e44ad'
  },
  {
    id: 'fish',
    name: 'Le Poisson',
    emoji: '🐟',
    backstory: 'Joueur du dimanche. S\'amuse avant tout.',
    style: 'Loose-Passif Récréatif',
    catchphrase: 'C\'est quoi déjà la valeur des cartes ?',
    traits: { tightness:0.20, aggression:0.15, bluffFreq:0.10, rationality:0.25, adaptability:0.10, tiltResist:0.50, showdownValue:0.85, creativity:0.15, tableAwareness:0.05, tournamentIQ:0.05 },
    color: '#2ecc71'
  },
  {
    id: 'pro',
    name: 'Le Pro',
    emoji: '📊',
    backstory: 'Grinder online. HUD mental. Range-based.',
    style: 'GTO/Mathématique',
    catchphrase: 'EV+ only. Pas de gambling.',
    traits: { tightness:0.50, aggression:0.60, bluffFreq:0.35, rationality:0.95, adaptability:0.75, tiltResist:0.80, showdownValue:0.25, creativity:0.50, tableAwareness:0.85, tournamentIQ:0.95 },
    color: '#1abc9c'
  },
  {
    id: 'gambler',
    name: 'Le Flambeur',
    emoji: '🎰',
    backstory: 'Ancien joueur de roulette. Vit pour l\'adrénaline.',
    style: 'Gambler',
    catchphrase: 'La chance, ça se provoque !',
    traits: { tightness:0.15, aggression:0.75, bluffFreq:0.65, rationality:0.10, adaptability:0.30, tiltResist:0.30, showdownValue:0.15, creativity:0.40, tableAwareness:0.10, tournamentIQ:0.05 },
    color: '#e91e63'
  },
  {
    id: 'sheriff',
    name: 'Le Shérif',
    emoji: '🤠',
    backstory: '"Je sais que tu bluffes." Call avec hauteur roi.',
    style: 'Hero Caller',
    catchphrase: 'T\'as rien. Je paye.',
    traits: { tightness:0.35, aggression:0.20, bluffFreq:0.05, rationality:0.40, adaptability:0.25, tiltResist:0.60, showdownValue:0.90, creativity:0.10, tableAwareness:0.60, tournamentIQ:0.25 },
    color: '#d4a574'
  },
  {
    id: 'artist',
    name: 'L\'Artiste',
    emoji: '🎨',
    backstory: 'Peintre du feutre. Bluffs créatifs et lignes improbables.',
    style: 'Créatif/Imprévisible',
    catchphrase: 'Les règles sont pour les autres — moi, je peins.',
    traits: { tightness:0.40, aggression:0.70, bluffFreq:0.70, rationality:0.45, adaptability:0.80, tiltResist:0.65, showdownValue:0.20, creativity:0.95, tableAwareness:0.70, tournamentIQ:0.35 },
    color: '#9b59b6'
  },
  {
    id: 'robot',
    name: 'Le Robot',
    emoji: '🤖',
    backstory: 'Joue comme une machine. Zéro émotion. Solver en tête.',
    style: 'GTO Pur',
    catchphrase: 'Calcul optimal. Décision : call.',
    traits: { tightness:0.55, aggression:0.55, bluffFreq:0.33, rationality:0.99, adaptability:0.90, tiltResist:1.00, showdownValue:0.28, creativity:0.20, tableAwareness:0.75, tournamentIQ:0.95 },
    color: '#607d8b'
  },
  {
    id: 'tilter',
    name: 'Le Tilter',
    emoji: '🌋',
    backstory: 'Un bad beat et il explose. Jette ses jetons par les fenêtres.',
    style: 'Tilt Machine',
    catchphrase: 'MAIS IL A PAYÉ AVEC ÇA ???',
    traits: { tightness:0.30, aggression:0.85, bluffFreq:0.55, rationality:0.10, adaptability:0.15, tiltResist:0.05, showdownValue:0.10, creativity:0.10, tableAwareness:0.05, tournamentIQ:0.05 },
    color: '#ff5722'
  },
  {
    id: 'survivor',
    name: 'Le Survivant',
    emoji: '🏕️',
    backstory: 'Spécialiste du short stack. Push/fold parfait.',
    style: 'Short Stack Ninja',
    catchphrase: 'Tant qu\'il y a un jeton, il y a de l\'espoir.',
    traits: { tightness:0.70, aggression:0.75, bluffFreq:0.30, rationality:0.80, adaptability:0.85, tiltResist:0.75, showdownValue:0.15, creativity:0.20, tableAwareness:0.80, tournamentIQ:0.90 },
    color: '#795548'
  },
  {
    id: 'bully',
    name: 'Le Bully',
    emoji: '💪',
    backstory: 'Gros stack qui écrase la table. ICM pressure.',
    style: 'Big Stack Bully',
    catchphrase: 'Ton tapis ? C\'est mon tapis.',
    traits: { tightness:0.25, aggression:0.90, bluffFreq:0.45, rationality:0.65, adaptability:0.75, tiltResist:0.60, showdownValue:0.15, creativity:0.55, tableAwareness:0.85, tournamentIQ:0.70 },
    color: '#4caf50'
  },
  {
    id: 'trapper',
    name: 'Le Trappeur',
    emoji: '🪤',
    backstory: 'Slow play tout. Checke les nuts 3 fois.',
    style: 'Trappeur',
    catchphrase: 'Check... check... check... ah mince, t\'as checké aussi.',
    traits: { tightness:0.60, aggression:0.15, bluffFreq:0.05, rationality:0.55, adaptability:0.30, tiltResist:0.65, showdownValue:0.40, creativity:0.25, tableAwareness:0.30, tournamentIQ:0.30 },
    color: '#7cb342'
  },
  {
    id: 'spewer',
    name: 'Le Spewer',
    emoji: '🌊',
    backstory: 'Balance ses jetons. 3-barrel avec hauteur 8.',
    style: 'Spew Machine',
    catchphrase: 'Relance. Relance. Relance. Oups.',
    traits: { tightness:0.10, aggression:0.90, bluffFreq:0.80, rationality:0.10, adaptability:0.20, tiltResist:0.40, showdownValue:0.05, creativity:0.15, tableAwareness:0.05, tournamentIQ:0.05 },
    color: '#ff9800'
  },
  {
    id: 'adaptative',
    name: 'Le Caméléon',
    emoji: '🦎',
    backstory: 'Change de style selon la table. Insaisissable.',
    style: 'Adaptatif',
    catchphrase: 'Aujourd\'hui tight, demain maniac. Qui sait ?',
    traits: { tightness:0.50, aggression:0.50, bluffFreq:0.30, rationality:0.75, adaptability:0.95, tiltResist:0.70, showdownValue:0.30, creativity:0.65, tableAwareness:0.90, tournamentIQ:0.75 },
    color: '#00bcd4'
  },
  {
    id: 'old_school',
    name: 'Le Vieux Briscard',
    emoji: '👴',
    backstory: '40 ans de poker. A tout vu. "À mon époque..."',
    style: 'Old School',
    catchphrase: 'À mon époque, on jouait au Limit. C\'était du vrai poker.',
    traits: { tightness:0.55, aggression:0.40, bluffFreq:0.15, rationality:0.70, adaptability:0.25, tiltResist:0.80, showdownValue:0.40, creativity:0.20, tableAwareness:0.65, tournamentIQ:0.50 },
    color: '#bcaaa4'
  }
];

// --- Mix génétique ---
// Crée un profil unique en blendant 2-3 archétypes
function blendArchetypes(count = 2, forcedIds = null) {
  const pool = forcedIds
    ? ARCHETYPES.filter(a => forcedIds.includes(a.id))
    : shuffleArray([...ARCHETYPES]).slice(0, count);

  if (pool.length === 0) return { ...ARCHETYPES[0] }; // fallback

  // Pondération décroissante : le 1er a plus de poids
  const weights = pool.map((_, i) => 1 / (i + 1));
  const totalWeight = weights.reduce((s, w) => s + w, 0);

  const blendedTraits = {};
  const traitKeys = Object.keys(pool[0].traits);

  for (const key of traitKeys) {
    let sum = 0;
    for (let i = 0; i < pool.length; i++) {
      sum += pool[i].traits[key] * weights[i];
    }
    blendedTraits[key] = Math.round((sum / totalWeight) * 100) / 100;
  }

  // Petite variation aléatoire (±5%)
  for (const key of traitKeys) {
    const variation = (Math.random() - 0.5) * 0.10;
    blendedTraits[key] = Math.max(0, Math.min(1, blendedTraits[key] + variation));
  }

  // Construire un nom et backstory
  const firstName = pool[0].name.split(' ').slice(1).join(' ') || pool[0].name;
  const secondName = pool.length > 1 ? (pool[1].name.split(' ').slice(1).join(' ') || pool[1].name) : '';
  const blendedName = secondName ? `${firstName}-${secondName}` : firstName;

  // Générer un ID unique
  const blendedId = 'blend_' + pool.map(a => a.id).join('_') + '_' + Math.random().toString(36).slice(2, 6);

  return {
    id: blendedId,
    name: blendedName,
    emoji: pool[0].emoji,
    backstory: `Hybride naturel de ${pool.map(a => a.name).join(' et ')}.`,
    style: `Mix ${pool.map(a => a.style).join(' / ')}`,
    catchphrase: pool[Math.floor(Math.random() * pool.length)].catchphrase,
    traits: blendedTraits,
    color: pool[0].color,
    parents: pool.map(a => a.id),
    isBlend: true
  };
}

// Crée un PNJ avec mix génétique automatique
function createNPCProfile(preferredArchetypes = null) {
  const count = 2 + Math.floor(Math.random() * 2); // 2 ou 3 archétypes
  return blendArchetypes(count, preferredArchetypes);
}

// --- Fonctions de sélection ---
function getArchetypeById(id) {
  return ARCHETYPES.find(a => a.id === id) || ARCHETYPES[0];
}

function getRandomArchetype() {
  return ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)];
}

// --- Adaptation au stade du tournoi ---
// Ajuste les traits selon le ratio stack/BB et la phase du tournoi
function adaptTraitsToTournament(traits, stackBB, tournamentPhase) {
  const adapted = { ...traits };
  const isShort = stackBB < 15;
  const isVeryShort = stackBB < 8;
  const isDeep = stackBB > 50;
  const isBubble = tournamentPhase === 'bubble';
  const isITM = tournamentPhase === 'itm';
  const isFinalTable = tournamentPhase === 'final_table';

  if (isVeryShort) {
    // Push/fold mode
    adapted.tightness = Math.min(1, adapted.tightness + 0.25);
    adapted.aggression = Math.min(1, adapted.aggression + 0.30);
    adapted.bluffFreq = Math.max(0, adapted.bluffFreq - 0.20);
    adapted.showdownValue = Math.max(0, adapted.showdownValue - 0.30);
    adapted.creativity = Math.max(0, adapted.creativity - 0.30);
  } else if (isShort) {
    adapted.tightness = Math.min(1, adapted.tightness + 0.15);
    adapted.aggression = Math.min(1, adapted.aggression + 0.20);
    adapted.bluffFreq = Math.max(0, adapted.bluffFreq - 0.10);
  } else if (isDeep) {
    adapted.tightness = Math.max(0, adapted.tightness - 0.10);
    adapted.creativity = Math.min(1, adapted.creativity + 0.15);
    adapted.bluffFreq = Math.min(1, adapted.bluffFreq + 0.10);
  }

  if (isBubble) {
    // Bulle : les short stacks deviennent très tight (survie), les big stacks agressifs
    if (isShort) {
      adapted.tightness = Math.min(1, adapted.tightness + 0.20);
      adapted.aggression = Math.max(0, adapted.aggression - 0.15);
    } else {
      adapted.aggression = Math.min(1, adapted.aggression + 0.25);
      adapted.bluffFreq = Math.min(1, adapted.bluffFreq + 0.20);
    }
  }

  if (isITM) {
    adapted.aggression = Math.min(1, adapted.aggression + 0.10);
    adapted.tightness = Math.max(0, adapted.tightness - 0.10);
  }

  if (isFinalTable) {
    adapted.tableAwareness = Math.min(1, (adapted.tableAwareness || 0.5) + 0.15);
    adapted.aggression = Math.min(1, adapted.aggression + 0.05);
  }

  // Borner toutes les valeurs
  for (const key of Object.keys(adapted)) {
    adapted[key] = Math.max(0, Math.min(1, adapted[key]));
  }

  return adapted;
}

// --- Mise à jour du tilt en cours de partie ---
function updateTilt(player, event) {
  if (!player._tiltLevel) player._tiltLevel = 0;

  switch (event) {
    case 'bad_beat':
      player._tiltLevel = Math.min(1, player._tiltLevel + 0.20);
      break;
    case 'big_loss':
      player._tiltLevel = Math.min(1, player._tiltLevel + 0.30);
      break;
    case 'win':
      player._tiltLevel = Math.max(0, player._tiltLevel - 0.10);
      break;
    case 'cooler':
      player._tiltLevel = Math.min(1, player._tiltLevel + 0.40);
      break;
    case 'new_hand':
      player._tiltLevel = Math.max(0, player._tiltLevel - 0.05);
      break;
  }

  return player._tiltLevel;
}

// Applique le tilt aux traits
function applyTiltToTraits(traits, tiltLevel) {
  if (tiltLevel <= 0) return traits;
  const t = { ...traits };
  t.tightness = Math.max(0, t.tightness - tiltLevel * 0.5);
  t.aggression = Math.min(1, t.aggression + tiltLevel * 0.5);
  t.bluffFreq = Math.min(1, t.bluffFreq + tiltLevel * 0.4);
  t.rationality = Math.max(0, t.rationality - tiltLevel * 0.6);
  t.showdownValue = Math.min(1, t.showdownValue + tiltLevel * 0.3);
  return t;
}

// Utilitaire
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Exposer les archétypes pour l'UI de setup
const NPC_TEMPLATES = ARCHETYPES;

// --- Force des mains (utilisé par decide.js) ---
function preflopStrength(card1, card2) {
  if (!card1 || !card2) return 0.05;
  const v1 = card1.value;
  const v2 = card2.value;
  const suited = card1.suit === card2.suit;
  const paired = v1 === v2;
  const high = Math.max(v1, v2);
  const low = Math.min(v1, v2);
  const gap = high - low;

  let score = 0;
  score += (high - 2) / 12 * 0.25;
  score += (low - 2) / 12 * 0.15;
  if (paired) score += 0.10 + (high - 2) / 12 * 0.25;
  if (suited) score += 0.06 + (1 - gap / 12) * 0.04;
  if (gap <= 2 && !paired) score += 0.08 - gap * 0.03;
  if (gap <= 4 && !paired) score += 0.03;
  if (high >= 10 && low >= 10) score += 0.10;
  if (high < 7 && !paired && !suited && gap > 3) score -= 0.10;
  return Math.max(0.05, Math.min(0.98, score));
}

function postflopStrength(holeCards, communityCards) {
  if (communityCards.length === 0) return preflopStrength(holeCards[0], holeCards[1]);
  const allCards = [...holeCards, ...communityCards];
  const bestHand = evaluateHand(allCards);
  if (!bestHand) return 0.1;
  const baseScore = bestHand.type / 8;
  const typeMax = bestHand.type * Math.pow(13, 5) + 4 * Math.pow(13, 4) + 4 * Math.pow(13, 3) + 4 * Math.pow(13, 2) + 4 * 13 + 4;
  const typeMin = bestHand.type * Math.pow(13, 5);
  const typeRange = typeMax - typeMin;
  const relativeStrength = typeRange > 0 ? (bestHand.value - typeMin) / typeRange : 0.5;
  const drawBonus = estimateDrawPotential(holeCards, communityCards);
  return baseScore * 0.70 + relativeStrength * 0.15 + drawBonus * 0.15;
}

function estimateDrawPotential(holeCards, communityCards) {
  if (communityCards.length < 3) return 0.3;
  const allSuits = [...holeCards, ...communityCards].map(c => c.suit);
  const allValues = [...holeCards, ...communityCards].map(c => c.value);
  const suitCounts = {};
  for (const s of allSuits) suitCounts[s] = (suitCounts[s] || 0) + 1;
  let maxOuts = 0;
  for (const [suit, count] of Object.entries(suitCounts)) {
    if (count === 4) maxOuts = Math.max(maxOuts, 9);
    else if (count === 3) maxOuts = Math.max(maxOuts, 5);
  }
  const uniqueSorted = [...new Set(allValues)].sort((a, b) => a - b);
  for (let i = 0; i <= uniqueSorted.length - 4; i++) {
    let present = 0;
    for (let j = 0; j < 5; j++) {
      if (uniqueSorted.includes(uniqueSorted[i] - 2 + j)) present++;
    }
    if (present >= 3) maxOuts = Math.max(maxOuts, 8);
    if (present >= 2) maxOuts = Math.max(maxOuts, 4);
  }
  return Math.min(1, maxOuts / 15);
}

// --- Sizing des relances (utilisé par decide.js) ---
function npcRaiseSizing(handStrength, currentBet, minRaise, pot, remainingChips, traits, npcId) {
  const potSize = pot + currentBet;
  const allInTotal = currentBet + remainingChips;
  const t = traits || { aggression: 0.5, creativity: 0.3, bluffFreq: 0.2 };

  // Base : 2x-3x la mise actuelle selon force de la main
  let multiplier = 2.0 + handStrength * (0.5 + t.aggression * 1.5);

  // Touche de folie créative
  if (t.creativity > 0.7 && Math.random() < 0.25) {
    multiplier += Math.random() * 4.0;
  }

  // Gambler / Maniac : chance de tapis
  if (t.bluffFreq > 0.6 && Math.random() < 0.2) {
    return allInTotal;
  }

  // Très aggressif : sizing plus gros
  if (t.aggression > 0.7) {
    multiplier += 1.5;
  }

  // Short stack (< 15 BB) : sizing plus petit ou tapis direct
  const bb = Math.max(currentBet, 1);
  const stackBB = remainingChips / bb;
  if (stackBB < 8) {
    return allInTotal; // push or fold
  }

  // Anciens IDs pour rétrocompatibilité
  if (typeof npcId === 'string') {
    if (npcId.startsWith('le_gambler')) multiplier = 3.0 + Math.random() * 3.0;
    else if (npcId.startsWith('le_requin')) multiplier = 2.5 + handStrength * 1.5;
    else if (npcId.startsWith('le_poisson')) multiplier = 1.0 + Math.random() * 0.5;
  }

  const raiseTotal = Math.max(
    currentBet + minRaise,
    Math.floor(potSize * multiplier / (currentBet > 0 ? currentBet : 1))
  );
  return Math.min(raiseTotal, allInTotal);
}
