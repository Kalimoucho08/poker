// === AUDIO V7 — Synthétiseur procédural (Web Audio API, zéro fichier) ===
const SFX = (() => {
  let ctx = null;
  let masterGain = null;
  let enabled = true;
  let volume = 0.3;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.15, rampDown = true) {
    const c = getCtx();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gainVal, c.currentTime);
    if (rampDown) g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  }

  function playNoise(duration, gainVal = 0.08) {
    const c = getCtx();
    const bufferSize = c.sampleRate * duration;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const source = c.createBufferSource();
    source.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 0.5;
    const g = c.createGain();
    g.gain.setValueAtTime(gainVal, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    source.connect(filter);
    filter.connect(g);
    g.connect(masterGain);
    source.start(c.currentTime);
  }

  function cardShuffle(count = 3) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => playNoise(0.05 + Math.random() * 0.08, 0.06), i * 60);
    }
  }

  function cardDeal() {
    const c = getCtx();
    playNoise(0.12, 0.1);
    setTimeout(() => playTone(800 + Math.random() * 400, 0.08, 'triangle', 0.08), 40);
  }

  function chipSingle() {
    const c = getCtx();
    const freq = 1200 + Math.random() * 600;
    playTone(freq, 0.15, 'sine', 0.12, true);
    // harmonique
    setTimeout(() => playTone(freq * 1.5, 0.1, 'sine', 0.04, true), 20);
  }

  function chipStack(count = 5) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => chipSingle(), i * 60 + Math.random() * 30);
    }
  }

  function chipBet() {
    chipStack(4);
  }

  function actionFold() {
    playTone(300, 0.2, 'sawtooth', 0.08);
    setTimeout(() => playTone(200, 0.25, 'sawtooth', 0.06), 100);
  }

  function actionCheck() {
    playTone(800, 0.08, 'sine', 0.07);
    setTimeout(() => playTone(1000, 0.06, 'sine', 0.05), 50);
  }

  function actionCall() {
    chipStack(3);
    playTone(600, 0.1, 'triangle', 0.06);
  }

  function actionRaise() {
    chipStack(5);
    const c = getCtx();
    playTone(500, 0.1, 'square', 0.06);
    setTimeout(() => playTone(800, 0.12, 'sine', 0.08), 80);
    setTimeout(() => playTone(1200, 0.1, 'sine', 0.05), 150);
  }

  function actionAllIn() {
    const c = getCtx();
    // Crescendo dramatique
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, c.currentTime);
    osc.frequency.linearRampToValueAtTime(600, c.currentTime + 0.4);
    g.gain.setValueAtTime(0.02, c.currentTime);
    g.gain.linearRampToValueAtTime(0.1, c.currentTime + 0.3);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.5);
    // Clink final
    setTimeout(() => {
      chipStack(8);
      playTone(1000, 0.2, 'sine', 0.15);
    }, 350);
  }

  function actionWin() {
    const c = getCtx();
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.08, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.4);
      }, i * 150);
    });
    // Jetons qui pleuvent
    setTimeout(() => chipStack(12), 500);
  }

  function actionLose() {
    const c = getCtx();
    playTone(400, 0.3, 'sawtooth', 0.06);
    setTimeout(() => playTone(300, 0.4, 'sawtooth', 0.05), 150);
    setTimeout(() => playTone(200, 0.5, 'triangle', 0.04), 300);
  }

  function roundStart() {
    cardShuffle(5);
    setTimeout(() => playTone(440, 0.15, 'sine', 0.06), 200);
    setTimeout(() => playTone(660, 0.2, 'sine', 0.06), 350);
  }

  function communityCard() {
    cardDeal();
    playTone(1000, 0.06, 'triangle', 0.04);
  }

  function toggleSound() {
    enabled = !enabled;
    if (masterGain) masterGain.gain.value = enabled ? volume : 0;
    return enabled;
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.value = enabled ? volume : 0;
  }

  // Init au premier clic utilisateur (contourne l'autoplay policy)
  function initOnInteraction() {
    if (!ctx) {
      const handler = () => {
        getCtx();
        document.removeEventListener('click', handler);
        document.removeEventListener('keydown', handler);
      };
      document.addEventListener('click', handler);
      document.addEventListener('keydown', handler);
    }
  }

  initOnInteraction();

  return {
    cardShuffle, cardDeal, chipSingle, chipStack, chipBet,
    actionFold, actionCheck, actionCall, actionRaise, actionAllIn,
    actionWin, actionLose, roundStart, communityCard,
    toggleSound, setVolume, enabled: () => enabled,
    get ctx() { return ctx; }
  };
})();
