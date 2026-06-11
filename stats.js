// === STATS V9 — Carrière persistante (localStorage) ===
const STATS_KEY = 'poker_v9_career';

function loadCareer() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) { /* ignore */ }
  return { players: {}, totalGames: 0, totalTournaments: 0, totalCircuits: 0 };
}

function saveCareer(career) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(career));
  } catch(e) { /* quota exceeded, ignore */ }
}

function getPlayerCareer(playerName) {
  const career = loadCareer();
  if (!career.players[playerName]) {
    career.players[playerName] = {
      games: 0,
      tournaments: 0,
      circuits: 0,
      wins: 0,           // 1res places
      itms: 0,           // places payées
      earnings: 0,       // gains totaux
      points: 0,         // points circuit
      bestFinish: 999,
      history: [],
      lastSeen: null,
    };
  }
  return career.players[playerName];
}

// Enregistre une partie (cash game)
function recordGameResult(players) {
  const career = loadCareer();
  career.totalGames++;

  const sorted = [...players].filter(p => p.chips > 0).sort((a, b) => b.chips - a.chips);

  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const stats = getPlayerCareer(p.name);
    stats.games++;
    stats.lastSeen = new Date().toISOString();
    if (i === 0) stats.wins++;
    stats.bestFinish = Math.min(stats.bestFinish, i + 1);

    stats.history.push({
      type: 'game',
      date: new Date().toISOString(),
      position: i + 1,
      players: sorted.length,
      chips: p.chips,
    });
    career.players[p.name] = stats;
  }

  saveCareer(career);
}

// Enregistre un tournoi
function recordTournamentResult(tState, players) {
  const career = loadCareer();
  career.totalTournaments++;

  const allPlayers = [...players].sort((a, b) => b.chips - a.chips);

  for (let i = 0; i < allPlayers.length; i++) {
    const p = allPlayers[i];
    const stats = getPlayerCareer(p.name);
    stats.tournaments++;
    stats.lastSeen = new Date().toISOString();
    if (i === 0) stats.wins++;

    const elim = tState.eliminated.find(e => e.name === p.name);
    const prize = elim ? elim.prize : 0;
    if (prize > 0) stats.itms++;
    stats.earnings += prize;
    stats.bestFinish = Math.min(stats.bestFinish, i + 1);

    stats.history.push({
      type: 'tournament',
      date: new Date().toISOString(),
      position: i + 1,
      players: allPlayers.length,
      prize,
      chips: p.chips,
    });
    career.players[p.name] = stats;
  }

  saveCareer(career);
}

// Enregistre un circuit complet
function recordCircuitResult(circuit) {
  const career = loadCareer();
  career.totalCircuits++;

  const rankings = typeof getCircuitRankings === 'function' ? getCircuitRankings(circuit) : [];

  for (const r of rankings) {
    const stats = getPlayerCareer(r.name);
    stats.circuits++;
    stats.points += r.points || 0;
    stats.earnings += r.earnings || 0;
    stats.itms += r.itms || 0;
    if (r.wins > 0) stats.wins += r.wins;
    stats.lastSeen = new Date().toISOString();

    const rank = rankings.indexOf(r);
    stats.bestFinish = Math.min(stats.bestFinish, rank + 1);

    stats.history.push({
      type: 'circuit',
      date: new Date().toISOString(),
      position: rank + 1,
      players: rankings.length,
      tournaments: circuit.totalTournaments,
      points: r.points,
      earnings: r.earnings,
    });
    career.players[r.name] = stats;
  }

  saveCareer(career);
}

// Récupère toutes les carrières triées
function getAllCareers(sortBy = 'earnings') {
  const career = loadCareer();
  return Object.entries(career.players)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0));
}

// Résumé global
function getGlobalStats() {
  const career = loadCareer();
  return {
    totalGames: career.totalGames,
    totalTournaments: career.totalTournaments,
    totalCircuits: career.totalCircuits,
    totalPlayers: Object.keys(career.players).length,
    richest: getAllCareers('earnings')[0]?.name || '—',
    mostWins: getAllCareers('wins')[0]?.name || '—',
  };
}

// Export pour debug
function exportCareerJSON() {
  return JSON.stringify(loadCareer(), null, 2);
}

// Réinitialiser la carrière (avec confirmation)
function resetCareer() {
  if (confirm('Effacer TOUTES les statistiques de carrière ? Cette action est irréversible.')) {
    localStorage.removeItem(STATS_KEY);
    return true;
  }
  return false;
}
