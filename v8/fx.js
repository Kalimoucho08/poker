// === FX V7 — Particules, confettis, animations fun ===
const FX = (() => {
  const container = document.body;

  function createParticle(x, y, color, size = 6, life = 800) {
    const el = document.createElement('div');
    el.className = 'fx-particle';
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 120;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed - 30;
    el.style.cssText = `
      position: fixed;
      left: ${x}px; top: ${y}px;
      width: ${size}px; height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 200;
      box-shadow: 0 0 ${size}px ${color};
      transition: all ${life}ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
      opacity: 1;
    `;
    container.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), life + 100);
  }

  function burst(x, y, count = 20, color = '#f0d060') {
    for (let i = 0; i < count; i++) {
      setTimeout(() => createParticle(x, y, color, 3 + Math.random() * 8, 500 + Math.random() * 600), i * 15);
    }
  }

  function confetti(count = 50) {
    const colors = ['#f0d060', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#1abc9c'];
    const w = window.innerWidth;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        const x = Math.random() * w;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 6 + Math.random() * 10;
        el.style.cssText = `
          position: fixed;
          left: ${x}px; top: -20px;
          width: ${size}px; height: ${size * 1.5}px;
          background: ${color};
          pointer-events: none;
          z-index: 200;
          border-radius: 2px;
          animation: fx-fall ${2 + Math.random() * 3}s linear forwards;
          transform: rotate(${Math.random() * 360}deg);
        `;
        container.appendChild(el);
        setTimeout(() => el.remove(), 5000);
      }, i * 30);
    }
  }

  // Éclat de jetons (effet pile de chips qui explose)
  function chipExplosion(x, y, count = 15) {
    const chipColors = [
      'radial-gradient(circle at 35% 35%, #f0d060, #b8860b)',
      'radial-gradient(circle at 35% 35%, #5dade2, #1a5276)',
      'radial-gradient(circle at 35% 35%, #ec7063, #922b21)',
      'radial-gradient(circle at 35% 35%, #58d68d, #1e8449)',
      'radial-gradient(circle at 35% 35%, #af7ac5, #6c3483)',
    ];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        const color = chipColors[Math.floor(Math.random() * chipColors.length)];
        const size = 12 + Math.random() * 8;
        el.style.cssText = `
          position: fixed;
          left: ${x}px; top: ${y}px;
          width: ${size}px; height: ${size}px;
          background: ${color};
          border-radius: 50%;
          pointer-events: none;
          z-index: 200;
          border: 1.5px solid rgba(255,255,255,0.3);
          box-shadow: 0 2px 4px rgba(0,0,0,0.4);
          transition: all ${400 + Math.random() * 500}ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        container.appendChild(el);
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 100;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 40;
        requestAnimationFrame(() => {
          el.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 720}deg)`;
          el.style.opacity = '0';
        });
        setTimeout(() => el.remove(), 1000);
      }, i * 20);
    }
  }

  // Effet de carte qui brille (quand une bonne main est révélée)
  function cardGlow(element) {
    if (!element) return;
    element.style.transition = 'box-shadow 0.3s ease';
    element.style.boxShadow = '0 0 25px rgba(240,208,96,0.9), 0 0 50px rgba(240,208,96,0.4)';
    setTimeout(() => {
      element.style.boxShadow = '';
    }, 2000);
  }

  // Flottement léger des jetons du pot (pulsation)
  function potPulse() {
    const potStack = document.getElementById('pot-stack');
    if (!potStack) return;
    potStack.style.transition = 'transform 0.3s ease';
    potStack.style.transform = 'scale(1.15)';
    setTimeout(() => { potStack.style.transform = 'scale(1)'; }, 300);
  }

  return {
    burst,
    confetti,
    chipExplosion,
    cardGlow,
    potPulse,
    createParticle,
  };
})();
