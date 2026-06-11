// ============================================================
// STRATÉGIE V8 — Modélisation des adversaires (enrichie)
// Tracking VPIP/PFR/AF/3bet/Cbet + classification + adaptation continue
// ============================================================

// Base de données d'observation par joueur
var OBSERVATIONS = {};

function getPlayerStats(playerId) {
  if (!OBSERVATIONS[playerId]) {
    OBSERVATIONS[playerId] = {
      // Compteurs bruts
      totalHands: 0,
      preflopActions: 0,
      preflopRaises: 0,
      preflopCalls: 0,
      preflopFolds: 0,
      preflop3bets: 0,         // 3-bets préflop
      preflop4bets: 0,         // 4-bets+
      faced3bet: 0,            // A fait face à un 3-bet
      foldedTo3bet: 0,         // A foldé face à un 3-bet
      flopActions: 0,
      flopBets: 0,
      flopCalls: 0,
      flopFolds: 0,
      flopCbet: 0,             // C-bet au flop (quand PFR)
      flopCbetSuccess: 0,      // C-bet qui a fait folder tout le monde
      turnActions: 0,
      turnBets: 0,
      turnCalls: 0,
      turnFolds: 0,
      riverActions: 0,
      riverBets: 0,
      riverCalls: 0,
      riverFolds: 0,
      totalBets: 0,
      totalCalls: 0,
      totalFolds: 0,
      totalRaises: 0,
      totalActions: 0,
      handsSeen: 0,
      showdownsSeen: 0,
      showdownsWon: 0,
      allIns: 0,
      allInsWon: 0,

      // Historique récent (dernières 20 actions)
      recentActions: [],

      // Showdown hands (mains montrées)
      revealedHands: [],

      // Dernière mise à jour (hand number)
      lastUpdated: 0
    };
  }
  return OBSERVATIONS[playerId];
}

// Appelé depuis game.js après chaque action joueur
function recordAction(playerId, action, amount, phase, isPreflop) {
  const stats = getPlayerStats(playerId);
  stats.totalActions++;

  // Enregistrer dans l'historique récent
  stats.recentActions.push({ action, amount, phase, hand: stats.totalHands || 0 });
  if (stats.recentActions.length > 20) stats.recentActions.shift();

  if (isPreflop) {
    stats.preflopActions++;
    if (action === 'raise') stats.preflopRaises++;
    if (action === 'call') stats.preflopCalls++;
    if (action === 'fold') stats.preflopFolds++;
  }

  if (phase === 'flop') {
    stats.flopActions++;
    if (action === 'raise' || action === 'bet') stats.flopBets++;
    if (action === 'call') stats.flopCalls++;
    if (action === 'fold') stats.flopFolds++;
  }

  if (phase === 'turn') {
    stats.turnActions++;
    if (action === 'raise' || action === 'bet') stats.turnBets++;
    if (action === 'call') stats.turnCalls++;
    if (action === 'fold') stats.turnFolds++;
  }

  if (phase === 'river') {
    stats.riverActions++;
    if (action === 'raise' || action === 'bet') stats.riverBets++;
    if (action === 'call') stats.riverCalls++;
    if (action === 'fold') stats.riverFolds++;
  }

  if (action === 'raise') stats.totalRaises++;
  if (action === 'raise' || action === 'bet') stats.totalBets++;
  if (action === 'call') stats.totalCalls++;
  if (action === 'fold') stats.totalFolds++;
}

// Enregistre qu'un joueur a vu le flop
function recordSawFlop(playerId) {
  const stats = getPlayerStats(playerId);
  stats.handsSeen++;
  stats.totalHands++;
}

// Enregistre un 3-bet
function record3bet(playerId, is3better) {
  const stats = getPlayerStats(playerId);
  if (is3better) {
    stats.preflop3bets++;
  } else {
    stats.faced3bet++;
  }
}

// Enregistre un fold face à un 3-bet
function recordFoldTo3bet(playerId) {
  const stats = getPlayerStats(playerId);
  stats.foldedTo3bet++;
}

// Enregistre un c-bet au flop
function recordCbet(playerId, success) {
  const stats = getPlayerStats(playerId);
  stats.flopCbet++;
  if (success) stats.flopCbetSuccess++;
}

// Enregistre un showdown
function recordShowdown(playerId, won) {
  const stats = getPlayerStats(playerId);
  stats.showdownsSeen++;
  if (won) stats.showdownsWon++;
}

// Enregistre un all-in
function recordAllIn(playerId, won) {
  const stats = getPlayerStats(playerId);
  stats.allIns++;
  if (won) stats.allInsWon++;
}

// Enregistre une main révélée au showdown
function recordRevealedHand(playerId, handDesc, handType) {
  const stats = getPlayerStats(playerId);
  stats.revealedHands.push({
    desc: handDesc,
    type: handType,
    hand: stats.totalHands
  });
  if (stats.revealedHands.length > 10) stats.revealedHands.shift();
}

// Calcule les stats dérivées complètes
function computeStats(stats) {
  // VPIP = % de mains où le joueur met volontairement de l'argent préflop
  const vpip = stats.preflopActions > 0
    ? (stats.preflopRaises + stats.preflopCalls) / stats.preflopActions
    : 0;

  // PFR = % de mains où le joueur relance préflop
  const pfr = stats.preflopActions > 0
    ? stats.preflopRaises / stats.preflopActions
    : 0;

  // 3bet %
  const threeBet = stats.preflopActions > 0
    ? stats.preflop3bets / stats.preflopActions
    : 0;

  // Fold to 3bet %
  const foldTo3bet = stats.faced3bet > 0
    ? stats.foldedTo3bet / stats.faced3bet
    : 0.5;

  // AF (Aggression Factor) = (bets + raises) / calls
  const aggFactor = stats.totalCalls > 0
    ? (stats.totalBets + stats.totalRaises) / stats.totalCalls
    : stats.totalBets + stats.totalRaises > 0 ? 99 : 0.5;

  // Agression frequency = (bets + raises) / (bets + raises + calls + folds)
  const totalDecisions = stats.totalBets + stats.totalRaises + stats.totalCalls + stats.totalFolds;
  const aggFreq = totalDecisions > 0
    ? (stats.totalBets + stats.totalRaises) / totalDecisions
    : 0.5;

  // Fold to flop bet (c-bet ou donk)
  const foldToFlopBet = stats.flopBets + stats.flopCalls + stats.flopFolds > 0
    ? stats.flopFolds / (stats.flopBets + stats.flopCalls + stats.flopFolds)
    : 0.5;

  // Fold to turn bet
  const foldToTurnBet = stats.turnBets + stats.turnCalls + stats.turnFolds > 0
    ? stats.turnFolds / (stats.turnBets + stats.turnCalls + stats.turnFolds)
    : 0.5;

  // Fold to river bet
  const foldToRiverBet = stats.riverBets + stats.riverCalls + stats.riverFolds > 0
    ? stats.riverFolds / (stats.riverBets + stats.riverCalls + stats.riverFolds)
    : 0.5;

  // WTSD (Went To ShowDown)
  const wtsd = stats.handsSeen > 0
    ? stats.showdownsSeen / stats.handsSeen
    : 0;

  // W$SD (Won $ at ShowDown)
  const wsd = stats.showdownsSeen > 0
    ? stats.showdownsWon / stats.showdownsSeen
    : 0;

  return {
    vpip, pfr, threeBet, foldTo3bet,
    aggFactor, aggFreq,
    foldToFlopBet, foldToTurnBet, foldToRiverBet,
    wtsd, wsd
  };
}

// Classification enrichie de l'adversaire
function classifyOpponent(stats) {
  const s = computeStats(stats);

  if (stats.totalActions < 8) return 'unknown';

  const { vpip, pfr, threeBet } = s;

  // Déterminer le style principal
  if (vpip < 0.12 && pfr < 0.08) return 'nit';
  if (vpip < 0.22 && pfr < 0.12) return 'rock';
  if (vpip < 0.28 && pfr >= 0.15) return 'tag';
  if (vpip >= 0.30 && pfr >= 0.18 && vpip - pfr < 0.20) return 'lag';
  if (vpip >= 0.45 && pfr < 0.15) return 'station';
  if (vpip >= 0.40 && pfr >= 0.25 && threeBet >= 0.10) return 'maniac';
  if (vpip >= 0.50 && pfr < 0.08) return 'fish';
  if (vpip >= 0.15 && vpip <= 0.30 && pfr >= 0.10 && Math.abs(vpip - pfr) < 0.15) return 'balanced';
  if (vpip < 0.30 && s.foldToFlopBet > 0.70) return 'weak_tight'; // Joue tight puis fold postflop

  return 'balanced';
}

// Détecte les patterns récents (streaks)
function detectPatterns(stats) {
  const recent = stats.recentActions.slice(-5);
  if (recent.length < 3) return null;

  const actions = recent.map(a => a.action);
  const allRaise = actions.every(a => a === 'raise');
  const allFold = actions.every(a => a === 'fold');

  if (allRaise) return 'heating_up';   // Le joueur est sur une série de relances
  if (allFold) return 'cooling_down';  // Le joueur fold tout
  return null;
}

// ============================================================
// Application du modèle d'adversaire (appelée depuis le pipeline)
// ============================================================
function applyOpponentModel(ctx, player, state) {
  const opponents = state.players.filter(p => p.id !== player.id && !p.folded && p.chips > 0);

  let totalAggression = 0;
  let totalFoldiness = 0;
  let totalVpip = 0;
  let playerTypes = {};
  let classifiedCount = 0;

  for (const opp of opponents) {
    const stats = getPlayerStats(opp.id);
    if (stats.totalActions < 3) continue;

    const s = computeStats(stats);
    const type = classifyOpponent(stats);
    const pattern = detectPatterns(stats);

    totalAggression += s.aggFreq;
    totalFoldiness += s.foldToFlopBet;
    totalVpip += s.vpip;
    classifiedCount++;

    playerTypes[type] = (playerTypes[type] || 0) + 1;

    // Ajustements spécifiques par type
    switch (type) {
      case 'nit':
      case 'rock':
        ctx.adjustedBluffFreq += 0.04;
        ctx.adjustedRaiseThreshold -= 0.02;
        break;
      case 'station':
        ctx.adjustedBluffFreq -= 0.08;
        ctx.adjustedFoldThreshold += 0.02;
        break;
      case 'maniac':
        ctx.adjustedRaiseThreshold += 0.03;
        ctx.adjustedBluffFreq -= 0.03;
        break;
      case 'lag':
        ctx.adjustedFoldThreshold += 0.02;
        break;
      case 'fish':
        ctx.adjustedBluffFreq -= 0.05;
        break;
      case 'weak_tight':
        ctx.adjustedBluffFreq += 0.06;
        ctx.adjustedRaiseThreshold -= 0.03;
        break;
      case 'tag':
      case 'balanced':
        ctx.adjustedBluffFreq -= 0.02; // Plus prudent contre les bons joueurs
        break;
    }

    // Si le joueur est sur un heater (relances récentes)
    if (pattern === 'heating_up') {
      ctx.adjustedFoldThreshold += 0.03;
    }
    if (pattern === 'cooling_down') {
      ctx.adjustedBluffFreq += 0.02;
    }
  }

  // Ajustements globaux basés sur la dynamique de table
  if (classifiedCount >= 2) {
    const avgAggression = totalAggression / classifiedCount;
    const avgFoldiness = totalFoldiness / classifiedCount;

    // Table agressive → serrer le jeu
    if (avgAggression > 0.65) {
      ctx.adjustedFoldThreshold += 0.03;
      ctx.adjustedBluffFreq -= 0.02;
    }

    // Table passive → exploiter
    if (avgFoldiness > 0.55) {
      ctx.adjustedBluffFreq += 0.05;
      ctx.adjustedRaiseThreshold -= 0.03;
    }

    // Table loose → value bet thin
    if (totalVpip / classifiedCount > 0.35) {
      ctx.adjustedRaiseThreshold -= 0.02;
    }
  }

  // Stocker le contexte pour l'adaptation
  ctx.opponentContext = {
    playerTypes,
    classifiedCount,
    totalOpponents: opponents.length
  };

  if (classifiedCount > 0) ctx.debug.push('opp:' + classifiedCount + ' ' + Object.keys(playerTypes).join(','));
}

// Enregistre cette stratégie dans le pipeline
registerStrategy(applyOpponentModel);
