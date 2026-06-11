// === TOURNAMENT V8 — Mode SNG (Sit & Go) ===

// Structure de blinds standard pour un SNG
const DEFAULT_BLIND_STRUCTURE = [
  { level: 1,  sb: 10,  bb: 20,  ante: 0,  label: '10/20' },
  { level: 2,  sb: 15,  bb: 30,  ante: 0,  label: '15/30' },
  { level: 3,  sb: 25,  bb: 50,  ante: 0,  label: '25/50' },
  { level: 4,  sb: 50,  bb: 100, ante: 0,  label: '50/100' },
  { level: 5,  sb: 75,  bb: 150, ante: 0,  label: '75/150' },
  { level: 6,  sb: 100, bb: 200, ante: 0,  label: '100/200' },
  { level: 7,  sb: 150, bb: 300, ante: 25, label: '150/300 (25)' },
  { level: 8,  sb: 200, bb: 400, ante: 50, label: '200/400 (50)' },
  { level: 9,  sb: 300, bb: 600, ante: 75, label: '300/600 (75)' },
  { level: 10, sb: 400, bb: 800, ante: 100, label: '400/800 (100)' },
  { level: 11, sb: 600, bb: 1200, ante: 150, label: '600/1200 (150)' },
  { level: 12, sb: 800, bb: 1600, ante: 200, label: '800/1600 (200)' },
  { level: 13, sb: 1000, bb: 2000, ante: 300, label: '1K/2K (300)' },
  { level: 14, sb: 1500, bb: 3000, ante: 400, label: '1.5K/3K (400)' },
  { level: 15, sb: 2000, bb: 4000, ante: 500, label: '2K/4K (500)' },
];

// Structure de payout standard (% du prize pool) — adaptatif V9
function getPayoutStructure(playerCount) {
  if (playerCount <= 2) return [1.0]; // winner takes all
  if (playerCount <= 3) return [0.65, 0.35];
  if (playerCount <= 5) return [0.60, 0.40];           // 4-5 joueurs : top 2
  if (playerCount <= 6) return [0.50, 0.30, 0.20];      // 6 joueurs : top 3
  if (playerCount <= 8) return [0.48, 0.28, 0.16, 0.08];// 7-8j : top 4
  // 9+ joueurs : top 5+
  return [0.40, 0.25, 0.15, 0.10, 0.06, 0.04];
}

// Vérifie si un montant de payout est valide
function validatePayouts(payouts) {
  const total = payouts.reduce((s, p) => s + p, 0);
  return Math.abs(total - 1.0) < 0.01;
}

function createTournamentState(config = {}) {
  const playerCount = config.playerCount || 9;
  const startingChips = config.startingChips || 1500;
  const blindStructure = config.blindStructure || DEFAULT_BLIND_STRUCTURE;
  const buyIn = config.buyIn || 100;
  const handsPerLevel = config.handsPerLevel || 10; // Nombre de mains par niveau
  const speed = config.speed || 'normal'; // 'turbo' | 'normal' | 'slow'

  // Ajuster la vitesse
  let adjustedHandsPerLevel = handsPerLevel;
  if (speed === 'turbo') adjustedHandsPerLevel = 5;
  else if (speed === 'slow') adjustedHandsPerLevel = 20;

  const payoutPcts = getPayoutStructure(playerCount);
  const prizePool = playerCount * buyIn;
  const payouts = payoutPcts.map(pct => Math.floor(prizePool * pct));

  return {
    // Configuration
    config: { playerCount, startingChips, buyIn, speed, handsPerLevel: adjustedHandsPerLevel },
    blindStructure,
    currentLevel: 0,
    handsInCurrentLevel: 0,
    prizePool,
    payouts,
    payoutPcts,

    // État du tournoi
    phase: 'setup',     // 'setup' | 'running' | 'bubble' | 'itm' | 'complete'
    eliminated: [],     // Joueurs éliminés dans l'ordre [{id, name, position, prize}]
    position: 0,        // Prochaine position d'élimination
    handCount: 0,

    // Classement
    get rankings() {
      // Retourne les joueurs classés par stack décroissant
      return [];
    }
  };
}

// Détermine la phase du tournoi
function determineTournamentPhase(tState, activePlayers, totalPlayers) {
  const remaining = activePlayers.length;
  const placesPaid = Math.max(1, tState.payouts.length);
  const eliminated = tState.eliminated.length;

  if (remaining <= 1) return 'complete';
  if (remaining === placesPaid + 1) return 'bubble';
  if (remaining <= placesPaid) return 'itm';
  if (remaining <= 9 && remaining > placesPaid) return 'final_table';
  return 'running';
}

// Passe au niveau de blinds suivant
function advanceBlindLevel(tState) {
  if (tState.currentLevel < tState.blindStructure.length - 1) {
    tState.currentLevel++;
    tState.handsInCurrentLevel = 0;
    return tState.blindStructure[tState.currentLevel];
  }
  // Niveau max : on y reste
  return tState.blindStructure[tState.currentLevel];
}

// Récupère les blinds actuelles
function getCurrentBlinds(tState) {
  const level = tState.blindStructure[tState.currentLevel];
  return { sb: level.sb, bb: level.bb, ante: level.ante, level: level.level, label: level.label };
}

// Élimine un joueur du tournoi
function eliminatePlayer(tState, player) {
  const position = totalActivePlayers(tState) + 1; // Position = joueurs restants + 1

  let prize = 0;
  const payoutIdx = tState.eliminated.length;
  if (payoutIdx < tState.payouts.length) {
    prize = tState.payouts[payoutIdx];
  }

  tState.eliminated.push({
    id: player.id,
    name: player.name,
    position,
    prize,
    level: tState.currentLevel + 1
  });

  return { position, prize };
}

// Calcule le nombre total de joueurs encore actifs (non éliminés, avec chips > 0)
function totalActivePlayers(tState) {
  // Retourné par l'appelant qui a la liste des joueurs
  return 0;
}

// Calcule le stack moyen
function averageStack(players) {
  const stacks = players.filter(p => p.chips > 0).map(p => p.chips);
  if (stacks.length === 0) return 0;
  return Math.floor(stacks.reduce((a, b) => a + b, 0) / stacks.length);
}

// Calcule le ratio stack/BB d'un joueur
function stackToBBRatio(player, bb) {
  return Math.floor(player.chips / bb);
}

// Calcule M (ratio stack / (SB + BB + antes * joueurs))
function calculateM(player, blinds, playerCount) {
  const total = blinds.sb + blinds.bb + blinds.ante * playerCount;
  if (total <= 0) return 999;
  return Math.floor(player.chips / total);
}

// Détermine la zone de stack
function stackZone(m) {
  if (m <= 5) return 'red';      // Danger immédiat
  if (m <= 10) return 'orange';   // Short stack
  if (m <= 20) return 'yellow';   // Stack moyen
  return 'green';                  // Deep stack
}

// Génère le classement pour l'affichage
function generateRankings(players, tState) {
  const all = [];
  // Joueurs encore en vie
  const active = players.filter(p => p.chips > 0).sort((a, b) => b.chips - a.chips);
  for (const p of active) {
    all.push({ name: p.name, chips: p.chips, position: null, prize: 0, status: 'actif' });
  }
  // Joueurs éliminés
  for (const e of tState.eliminated) {
    all.push({ name: e.name, chips: 0, position: e.position, prize: e.prize, status: 'éliminé' });
  }
  return all;
}

// Résumé textuel du tournoi
function tournamentSummary(tState, players) {
  const blinds = getCurrentBlinds(tState);
  const active = players.filter(p => p.chips > 0);
  const avg = averageStack(players);
  const remaining = active.length;
  const placesPaid = tState.payouts.length;
  const bubble = remaining === placesPaid + 1;

  return {
    level: blinds.level,
    blinds: blinds.label,
    remaining,
    avgStack: avg,
    nextBlinds: tState.currentLevel < tState.blindStructure.length - 1
      ? tState.blindStructure[tState.currentLevel + 1].label
      : 'MAX',
    isBubble: bubble,
    placesPaid,
    prizePool: tState.prizePool
  };
}

// === CIRCUIT MODE V9 ===
function createCircuitState(config = {}) {
  return {
    players: config.players || [],         // [{name, isNPC, npcData, ...}]
    tournaments: [],                        // résultats de chaque tournoi
    currentTournament: 0,
    totalTournaments: config.totalTournaments || 3,
    buyIn: config.buyIn || 100,
    startingChips: config.startingChips || 1500,
    speed: config.speed || 'normal',
    circuitPoints: {},                      // {playerName: totalPoints}
    circuitEarnings: {},                    // {playerName: totalEarnings}
    circuitITMs: {},                        // {playerName: ITM count}
    circuitWins: {},                        // {playerName: win count}
    circuitKO: {},                          // {playerName: knockouts}
  };
}

// Points de classement circuit (style leaderboard)
function awardCircuitPoints(position, playerCount, playerName, circuit) {
  // Plus il y a de joueurs, plus le 1er gagne de points
  const pointsTable = {
    2: [10, 5],
    3: [15, 10, 5],
    4: [20, 14, 10, 5],
    5: [25, 18, 12, 8, 4],
    6: [30, 22, 15, 10, 6, 3],
    7: [35, 26, 18, 12, 8, 5, 2],
    8: [40, 30, 22, 15, 10, 6, 4, 2],
    9: [45, 34, 25, 18, 12, 8, 5, 3, 1],
    10:[50, 38, 28, 20, 14, 10, 6, 4, 2, 1],
  };

  const key = String(playerCount);
  const pts = pointsTable[key] || pointsTable['10'];
  const earned = position <= pts.length ? pts[position - 1] : 0;

  if (!circuit.circuitPoints[playerName]) circuit.circuitPoints[playerName] = 0;
  circuit.circuitPoints[playerName] += earned;
  return earned;
}

// Ajoute les résultats d'un tournoi dans le circuit
function recordCircuitTournament(circuit, tournamentResults) {
  circuit.tournaments.push({
    number: circuit.tournaments.length + 1,
    results: tournamentResults,
  });

  for (const result of tournamentResults) {
    const name = result.name;
    if (!circuit.circuitEarnings[name]) circuit.circuitEarnings[name] = 0;
    if (!circuit.circuitITMs[name]) circuit.circuitITMs[name] = 0;
    if (!circuit.circuitWins[name]) circuit.circuitWins[name] = 0;

    circuit.circuitEarnings[name] += result.prize || 0;
    if (result.prize > 0) circuit.circuitITMs[name]++;
    if (result.position === 1) circuit.circuitWins[name]++;

    // Points
    awardCircuitPoints(result.position, tournamentResults.length, name, circuit);
  }
}

// Génère le classement cumulé du circuit
function getCircuitRankings(circuit) {
  const players = Object.keys(circuit.circuitPoints);
  return players
    .map(name => ({
      name,
      points: circuit.circuitPoints[name] || 0,
      earnings: circuit.circuitEarnings[name] || 0,
      itms: circuit.circuitITMs[name] || 0,
      wins: circuit.circuitWins[name] || 0,
    }))
    .sort((a, b) => b.points - a.points || b.earnings - a.earnings);
}

// Adaptation inter-tournois : ajuste les traits PNJ selon leurs résultats passés
function adaptNPCTraitsForCircuit(player, circuit) {
  if (!circuit || circuit.tournaments.length === 0) return;

  const name = player.name;
  const pts = circuit.circuitPoints[name] || 0;
  const rankings = getCircuitRankings(circuit);
  const rank = rankings.findIndex(r => r.name === name);
  const totalPlayers = rankings.length;
  const percentile = totalPlayers > 1 ? rank / (totalPlayers - 1) : 0.5;

  // Perdant → plus agressif / désespéré
  if (percentile > 0.5) {
    player.npcTraits.aggression = Math.min(1, (player.npcTraits.aggression || 0.5) + 0.05);
    player.npcTraits.adaptability = Math.min(1, (player.npcTraits.adaptability || 0.5) + 0.03);
    player.npcTraits.bluffFreq = Math.min(1, (player.npcTraits.bluffFreq || 0.3) + 0.02);
  }
  // Leader → plus conservateur
  if (percentile < 0.3) {
    player.npcTraits.tightness = Math.min(1, (player.npcTraits.tightness || 0.5) + 0.03);
    player.npcTraits.rationality = Math.min(1, (player.npcTraits.rationality || 0.5) + 0.02);
  }
  // Milieu → stable, léger ajustement
  if (percentile >= 0.3 && percentile <= 0.7) {
    player.npcTraits.adaptability = Math.min(1, (player.npcTraits.adaptability || 0.5) + 0.01);
  }
}
