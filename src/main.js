import kaplay from 'kaplay';

// Assets to preload
const ASSETS_TO_LOAD = [
  '/assets/background.png',
  '/assets/logo.png',
  '/assets/mariachi.png'
];

// Preload images
function preloadImages(urls) {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ url, width: img.width, height: img.height });
        img.onerror = () => reject(new Error(`Failed to load ${url}`));
        img.src = url;
      });
    })
  );
}

// Loading screen (only show if slow)
const loadingScreen = document.getElementById('loading-screen');
let loadingTimeout = setTimeout(() => {
  if (loadingScreen) loadingScreen.classList.add('show');
}, 200);

preloadImages(ASSETS_TO_LOAD)
  .then((loadedAssets) => {
    clearTimeout(loadingTimeout);
    if (loadingScreen) loadingScreen.remove();
    initGame(loadedAssets);
  })
  .catch((err) => {
    console.error('Error loading assets:', err);
    clearTimeout(loadingTimeout);
    const textEl = document.getElementById('loading-text');
    if (textEl) {
      textEl.textContent = 'Error. Refresca la página.';
      textEl.style.color = '#ff6432';
    }
    if (loadingScreen) loadingScreen.classList.add('show');
  });

function initGame(preloadedAssets) {
  const k = kaplay({
    width: 480,
    height: 854,
    background: [15, 40, 60],

    // Let KAPLAY handle sizing with letterbox. We focus on high DPI instead of manual scale.
    // Manual fractional scale is a common cause of blur on mobile.
    letterbox: true,

    // Render at higher internal resolution on mobile screens.
    // Cap at 2 to avoid melting GPUs.
    pixelDensity: Math.min(window.devicePixelRatio || 1, 2),

    // Smooth scaling (no retro pixelation)
    crisp: false,

    // Smooth texture sampling for sprites
    texFilter: "linear",

    touchToMouse: true,
    debug: false,
  });

  k.canvas.classList.add('loaded');
  
  // Load all sprites
  k.loadSprite('background', '/assets/background.png');
  k.loadSprite('logo', '/assets/logo.png');
  k.loadSprite('mariachi', '/assets/mariachi.png');

  // Gameplay sprites
  k.loadSprite('tortilla', '/assets/Assets/Tortilla.png');
  k.loadSprite('gasolina', '/assets/Assets/Gasolina.png');
  k.loadSprite('renta', '/assets/Assets/Renta.png');
  k.loadSprite('aguacate', '/assets/Assets/Aguacate.png');
  k.loadSprite('canasta', '/assets/Assets/CanastaBasica.png');

  k.loadSprite('bitcoin', '/assets/PowerUps/Bitcoin.png');
  k.loadSprite('lightning', '/assets/PowerUps/Lightning.png');
  k.loadSprite('bloque', '/assets/PowerUps/Bloque.png');
  k.loadSprite('ahorro', '/assets/PowerUps/Ahorro.png');
  k.loadSprite('nodo', '/assets/PowerUps/Nodo.png');

  k.onLoad(() => {
    createScenes(k, preloadedAssets);
    k.go('menu');
  });
}

function createScenes(k, preloadedAssets) {
  // Get real dimensions
  const bgData = preloadedAssets.find(a => a.url.includes('background'));
  const logoData = preloadedAssets.find(a => a.url.includes('logo'));
  const mariachiData = preloadedAssets.find(a => a.url.includes('mariachi'));

  // ===== MENU SCENE =====
  k.scene('menu', () => {
    k.setGravity(0);

    // Background fallback
    k.add([
      k.rect(480, 854),
      k.color(15, 40, 60),
      k.pos(0, 0),
      k.z(-1),
    ]);

    // Background (pueblito) - cover full screen
    if (bgData) {
      const scaleX = 480 / bgData.width;
      const scaleY = 854 / bgData.height;
      const bgScale = Math.max(scaleX, scaleY);

      k.add([
        k.sprite('background'),
        k.pos(240, 427),
        k.anchor('center'),
        k.scale(bgScale),
        k.z(0),
      ]);
    }

    // Logo - top center
    if (logoData) {
      // Scale logo a bit bigger (80% of screen width)
      const logoScale = (480 * 0.8) / logoData.width;
      
      k.add([
        k.sprite('logo'),
        k.pos(240, 180),
        k.anchor('center'),
        k.scale(logoScale),
        k.z(2),
      ]);
    }

    // JUGAR button
    const btnY = 770;
    const btnH = 70;
    const btnTopY = btnY - btnH / 2;

    // Button styling: shadow + outline + highlight
    const btnW = 260;
    const btnRadius = 16;

    // Shadow
    k.add([
      k.rect(btnW, btnH, { radius: btnRadius }),
      k.pos(240, btnY + 6),
      k.anchor('center'),
      k.color(0, 0, 0),
      k.opacity(0.35),
      k.z(9),
    ]);

    // Main button
    const btn = k.add([
      k.rect(btnW, btnH, { radius: btnRadius }),
      k.pos(240, btnY),
      k.anchor('center'),
      k.color(255, 104, 60),
      k.outline(4, k.rgb(255, 220, 140)),
      k.area(),
      k.z(10),
      'btn',
    ]);

    // Highlight strip
    k.add([
      k.rect(btnW - 18, 18, { radius: 10 }),
      k.pos(240, btnY - 18),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.opacity(0.18),
      k.z(11),
    ]);

    // "Aprende a jugar" secondary button (same style family as JUGAR)
    const helpBtnY = 690;

    k.add([
      k.rect(240, 52, { radius: 16 }),
      k.pos(240, helpBtnY + 6),
      k.anchor('center'),
      k.color(0, 0, 0),
      k.opacity(0.28),
      k.z(8),
    ]);

    const helpBtn = k.add([
      k.rect(240, 52, { radius: 16 }),
      k.pos(240, helpBtnY),
      k.anchor('center'),
      k.color(255, 104, 60),
      k.opacity(0.92),
      k.outline(4, k.rgb(255, 220, 140)),
      k.area(),
      k.z(10),
    ]);

    k.add([
      k.text('APRENDE A JUGAR', { size: 18 }),
      k.pos(240, helpBtnY),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.z(11),
    ]);

    helpBtn.onClick(() => k.go('tutorial'));
    helpBtn.onHover(() => k.setCursor('pointer'));
    helpBtn.onHoverEnd(() => k.setCursor('default'));

    // Mariachi - make him the PROTAGONIST and align him precisely above the button
    if (mariachiData) {
      // Make him bigger
      const mariachiScale = Math.min(
        (480 * 0.82) / mariachiData.width, // ~82% of screen width
        480 / mariachiData.height          // cap height around 480px
      );

      // We want the bottom edge to sit very close to the button.
      // (Slight overlap looks nicer because the mariachi has a "floor" at the bottom.)
      const desiredBottomY = btnTopY + 4;
      const mariachiHeightPx = mariachiData.height * mariachiScale;
      const mariachiY = desiredBottomY - mariachiHeightPx / 2;

      k.add([
        k.sprite('mariachi'),
        k.pos(240, mariachiY),
        k.anchor('center'),
        k.scale(mariachiScale),
        k.z(3),
      ]);
    }

    // Text with subtle shadow
    k.add([
      k.text('JUGAR', { size: 34 }),
      k.pos(242, btnY + 2),
      k.anchor('center'),
      k.color(0, 0, 0),
      k.opacity(0.25),
      k.z(12),
    ]);

    k.add([
      k.text('JUGAR', { size: 34 }),
      k.pos(240, btnY),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.z(13),
    ]);

    btn.onClick(() => k.go('game'));
    btn.onHover(() => {
      btn.color = k.rgb(255, 130, 85);
      k.setCursor('pointer');
    });
    btn.onHoverEnd(() => {
      btn.color = k.rgb(255, 104, 60);
      k.setCursor('default');
    });
  });

  // ===== TUTORIAL SCENE =====
  k.scene('tutorial', () => {
    k.setGravity(0);

    // Background
    if (bgData) {
      const scaleX = 480 / bgData.width;
      const scaleY = 854 / bgData.height;
      const bgScale = Math.max(scaleX, scaleY);

      k.add([
        k.sprite('background'),
        k.pos(240, 427),
        k.anchor('center'),
        k.scale(bgScale),
        k.opacity(0.35),
        k.z(0),
      ]);
    }

    // Backdrop
    k.add([
      k.rect(460, 820, { radius: 18 }),
      k.pos(240, 427),
      k.anchor('center'),
      k.color(10, 18, 28),
      k.opacity(0.78),
      k.z(1),
    ]);

    k.add([
      k.text('APRENDE A JUGAR', { size: 30 }),
      k.pos(240, 90),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.z(2),
    ]);

    let page = 0;
    const pageObjs = [];

    function clearPage() {
      while (pageObjs.length) {
        const o = pageObjs.pop();
        try { k.destroy(o); } catch {}
      }
    }

    function addObj(o) {
      pageObjs.push(o);
      return o;
    }

    function card(title, lines, spriteData) {
      // spriteData: array of {key, label} or just keys
      const items = spriteData.map(s => typeof s === 'string' ? { key: s, label: '' } : s);

      addObj(k.add([
        k.rect(420, 380, { radius: 16 }),
        k.pos(240, 430),
        k.anchor('center'),
        k.color(20, 30, 44),
        k.opacity(0.75),
        k.z(2),
      ]));

      addObj(k.add([
        k.text(title, { size: 22 }),
        k.pos(240, 260),
        k.anchor('center'),
        k.color(255, 255, 255),
        k.z(3),
      ]));

      // Icons in two rows if > 3
      const perRow = items.length > 3 ? 3 : items.length;
      const rows = Math.ceil(items.length / perRow);

      items.forEach((item, i) => {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const startX = 240 - (perRow - 1) * 50;
        const x = startX + col * 100;
        const y = 340 + row * 90;

        addObj(k.add([
          k.sprite(item.key),
          k.pos(x, y),
          k.anchor('center'),
          k.scale(0.08),
          k.z(3),
        ]));

        if (item.label) {
          addObj(k.add([
            k.text(item.label, { size: 13 }),
            k.pos(x, y + 30),
            k.anchor('center'),
            k.color(200, 210, 230),
            k.z(3),
          ]));
        }
      });

      addObj(k.add([
        k.text(lines.join('\n'), { size: 16, width: 380, lineSpacing: 8, align: 'center' }),
        k.pos(240, 340 + rows * 90 + 80),
        k.anchor('center'),
        k.color(230, 240, 255),
        k.z(3),
      ]));

      addObj(k.add([
        k.text(`${page + 1}/3`, { size: 18 }),
        k.pos(240, 640),
        k.anchor('center'),
        k.color(255, 255, 255),
        k.opacity(0.7),
        k.z(3),
      ]));
    }

    function render() {
      clearPage();

      if (page === 0) {
        card('1) INFLACIÓN (CÓRTALA)', [
          '+10 al cortar | -15 + daño si se escapa',
        ], [
          { key: 'tortilla', label: 'Tortillas' },
          { key: 'renta', label: 'Renta' },
          { key: 'gasolina', label: 'Gasolina' },
          { key: 'canasta', label: 'Canasta' },
          { key: 'aguacate', label: 'Aguacates' },
        ]);
      }

      if (page === 1) {
        card('2) POWERUPS', [
          'Corta estos para activarlos',
        ], [
          { key: 'lightning', label: '⚡ x2 pts' },
          { key: 'bloque', label: '🟧 Freeze' },
          { key: 'ahorro', label: '🌱 Limpia' },
          { key: 'nodo', label: '🔷 +Vida' },
        ]);
      }

      if (page === 2) {
        card('3) BITCOIN & AHORRO', [
          'BITCOIN: no lo cortes (+50 si pasa)',
          'AHORRO: +100 y limpia inflación',
        ], [
          { key: 'bitcoin', label: 'Bitcoin' },
          { key: 'ahorro', label: 'Ahorro' },
        ]);
      }
    }

    // Nav buttons (smaller)
    const btnStyle = (x, y, label, onClick) => {
      k.add([
        k.rect(160, 50, { radius: 16 }),
        k.pos(x, y + 6),
        k.anchor('center'),
        k.color(0, 0, 0),
        k.opacity(0.30),
        k.z(9),
      ]);

      const b = k.add([
        k.rect(160, 50, { radius: 16 }),
        k.pos(x, y),
        k.anchor('center'),
        k.color(255, 104, 60),
        k.opacity(0.92),
        k.outline(4, k.rgb(255, 220, 140)),
        k.area(),
        k.z(10),
      ]);

      k.add([
        k.text(label, { size: 20 }),
        k.pos(x, y),
        k.anchor('center'),
        k.color(255, 255, 255),
        k.z(11),
      ]);

      b.onClick(onClick);
      return b;
    };

    btnStyle(130, 760, 'MENÚ', () => k.go('menu'));
    btnStyle(350, 760, 'SIGUIENTE', () => {
      page = (page + 1) % 3;
      render();
    });

    render();
  });

  // ===== GAME OVER SCENE =====
  k.scene('gameover', (data) => {
    const score = data?.score ?? 0;
    const bitcoins = data?.bitcoins ?? 0;
    const pesos = data?.pesos ?? 0;

    k.setGravity(0);

    if (bgData) {
      const scaleX = 480 / bgData.width;
      const scaleY = 854 / bgData.height;
      const bgScale = Math.max(scaleX, scaleY);

      k.add([
        k.sprite('background'),
        k.pos(240, 427),
        k.anchor('center'),
        k.scale(bgScale),
        k.opacity(0.25),
        k.z(0),
      ]);
    }

    k.add([
      k.rect(460, 780, { radius: 18 }),
      k.pos(240, 427),
      k.anchor('center'),
      k.color(10, 18, 28),
      k.opacity(0.82),
      k.z(1),
    ]);

    k.add([
      k.text('GAME OVER', { size: 44 }),
      k.pos(240, 120),
      k.anchor('center'),
      k.color(255, 104, 60),
      k.z(2),
    ]);

    const summary = [
      `Ahorraste $${pesos} pesos`,
      `cortando la inflación`,
      ``,
      `Bitcoin guardados: ${bitcoins}`,
    ].join('\n');

    k.add([
      k.text(summary, { size: 22, width: 420, align: 'center', lineSpacing: 12 }),
      k.pos(240, 260),
      k.anchor('center'),
      k.color(240, 245, 255),
      k.z(2),
    ]);

    const makeBtn = (label, y, onClick, opts = {}) => {
      const w = opts.w ?? 280;
      const h = opts.h ?? 46;
      const radius = 16;

      // Shadow
      k.add([
        k.rect(w, h, { radius }),
        k.pos(240, y + 6),
        k.anchor('center'),
        k.color(0, 0, 0),
        k.opacity(0.32),
        k.z(8),
      ]);

      const b = k.add([
        k.rect(w, h, { radius }),
        k.pos(240, y),
        k.anchor('center'),
        k.color(255, 104, 60),
        k.outline(4, k.rgb(255, 220, 140)),
        k.area(),
        k.z(10),
      ]);

      // Highlight
      k.add([
        k.rect(w - 18, 14, { radius: 10 }),
        k.pos(240, y - 14),
        k.anchor('center'),
        k.color(255, 255, 255),
        k.opacity(0.16),
        k.z(11),
      ]);

      k.add([
        k.text(label, { size: 20 }),
        k.pos(240, y),
        k.anchor('center'),
        k.color(255, 255, 255),
        k.z(12),
      ]);

      b.onClick(onClick);
      b.onHover(() => k.setCursor('pointer'));
      b.onHoverEnd(() => k.setCursor('default'));
      return b;
    };

    // Mobile layout (requested order)
    makeBtn('JUGAR OTRA VEZ', 520, () => k.go('game'));

    makeBtn('COMPARTIR PUNTUACIÓN', 580, () => {
      const gameUrl = 'https://mariachi-vs-inflation.vercel.app';
      const text = encodeURIComponent(
        `Ahorré $${pesos} pesos cortando la inflación. BTC guardados: ${bitcoins}. ¿Cuánto podrás ahorrar? ${gameUrl}`
      );
      const url = `https://twitter.com/intent/tweet?text=${text}`;
      window.open(url, '_blank');
    }, { w: 360 });

    makeBtn('LEADERBOARD', 640, () => {
      // TODO next iteration
    });

    makeBtn('APRENDE SOBRE INFLACIÓN', 700, () => {
      window.open('https://inflacionmexico.com', '_blank');
    }, { w: 360 });

    makeBtn('COMPRA BITCOIN', 760, () => {
      window.open('https://www.aureobitcoin.com/es', '_blank');
    });

    // Styled small "Menú" button
    const menuX = 70;
    const menuY = 60;

    k.add([
      k.rect(110, 36, { radius: 12 }),
      k.pos(menuX, menuY + 4),
      k.anchor('center'),
      k.color(0, 0, 0),
      k.opacity(0.28),
      k.z(20),
    ]);

    const back = k.add([
      k.rect(110, 36, { radius: 12 }),
      k.pos(menuX, menuY),
      k.anchor('center'),
      k.color(255, 104, 60),
      k.opacity(0.92),
      k.outline(3, k.rgb(255, 220, 140)),
      k.area(),
      k.z(21),
    ]);

    k.add([
      k.text('MENÚ', { size: 16 }),
      k.pos(menuX, menuY),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.z(22),
    ]);

    back.onClick(() => k.go('menu'));
    back.onHover(() => k.setCursor('pointer'));
    back.onHoverEnd(() => k.setCursor('default'));
  });

  // ===== GAME SCENE =====
  k.scene('game', () => {
    k.setGravity(0);

    // Background
    if (bgData) {
      const scaleX = 480 / bgData.width;
      const scaleY = 854 / bgData.height;
      const bgScale = Math.max(scaleX, scaleY);

      k.add([
        k.sprite('background'),
        k.pos(240, 427),
        k.anchor('center'),
        k.scale(bgScale),
        k.z(0),
      ]);
    } else {
      k.add([k.rect(480, 854), k.color(15, 40, 60), k.pos(0, 0)]);
    }

    // --- State ---
    let score = 0;
    let bitcoinCounter = 0;
    let bitcoinStreak = 0;

    let hearts = 3;
    let heartDamage = 0; // 0..2 (3rd hit consumes heart)

    let scoreMultiplier = 1;
    let multiplierUntil = 0;

    let slowMotion = false;
    let slowUntil = 0;

    let elapsed = 0;

    // Swipe / combo state
    let swiping = false;
    let lastPos = null;
    let inflationCutsThisSwipe = 0;

    // If you cut 3 BTC, you lose ("paper hands")
    let bitcoinCuts = 0;

    // --- UI ---
    const scoreText = k.add([
      k.text('Score: 0', { size: 22 }),
      k.pos(18, 18),
      k.color(255, 255, 255),
      k.z(100),
    ]);

    const btcText = k.add([
      k.text('BTC: 0', { size: 22 }),
      k.pos(18, 46),
      k.color(255, 220, 140),
      k.z(100),
    ]);

    const heartsText = k.add([
      k.text('❤❤❤  (daño: 0/3)', { size: 22 }),
      k.pos(18, 74),
      k.color(255, 120, 120),
      k.z(100),
    ]);

    // Toast with background for visibility
    const toastBg = k.add([
      k.rect(400, 50, { radius: 12 }),
      k.pos(240, 140),
      k.anchor('center'),
      k.color(0, 0, 0),
      k.opacity(0),
      k.z(119),
    ]);

    const toastText = k.add([
      k.text('', { size: 26 }),
      k.pos(240, 140),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.opacity(0),
      k.z(120),
    ]);

    const toast = {
      _t: 0,
      show(msg, color = k.rgb(255, 255, 255)) {
        toastText.text = msg;
        toastText.color = color;
        toastText.opacity = 1;
        toastBg.opacity = 0.72;
        this._t = 0;
      }
    };

    k.onUpdate(() => {
      if (toastText.opacity > 0) {
        toast._t += k.dt();
        if (toast._t > 1.2) {
          const fade = Math.max(0, toastText.opacity - 2 * k.dt());
          toastText.opacity = fade;
          toastBg.opacity = fade * 0.72;
        }
      }
    });

    function refreshUI() {
      scoreText.text = `Score: ${score}`;
      btcText.text = `BTC: ${bitcoinCounter}`;

      const fullHearts = '❤'.repeat(Math.max(0, hearts));
      const dmg = `${heartDamage}/3`;
      heartsText.text = `${fullHearts}  (daño: ${dmg})`;
    }

    refreshUI();

    // --- Helpers ---
    const INFLATION_SPRITES = ['tortilla', 'gasolina', 'renta', 'aguacate', 'canasta'];
    const POWERUP_SPRITES = ['lightning', 'bloque', 'ahorro', 'nodo'];

    function difficultyMult() {
      const stage = Math.floor(elapsed / 20);
      return Math.pow(1.1, stage);
    }

    function addScore(raw) {
      score += Math.round(raw * scoreMultiplier);
      refreshUI();
    }

    function damageHeart() {
      heartDamage += 1;
      if (heartDamage >= 3) {
        heartDamage = 0;
        hearts -= 1;
      }
      refreshUI();
      if (hearts <= 0) endGame();
    }

    function endGame() {
      const pesos = Math.max(0, score) * 10;
      k.go('gameover', {
        score,
        bitcoins: bitcoinCounter,
        pesos,
      });
    }

    function spawnObject(kind) {
      const x = k.rand(40, 440);
      const y = -60;

      // Start easier, ramp up with time + difficulty
      const warmup = Math.min(1, elapsed / 18);
      const speedBase = (160 + 60 * warmup) * difficultyMult();
      const speedVar = k.rand(-20, 50);
      const speed = speedBase + speedVar;

      const angVel = k.rand(-2.2, 2.2);

      const sprite = kind;

      // Assets were feeling too big on mobile; scale them down substantially.
      // (Previous: ~0.5. Now: ~0.18-0.22 depending on type)
      const scale = (() => {
        // Reduce ~65% from previous sizes
        // +5% bump (was slightly too small)
        if (sprite === 'bitcoin') return 0.068;
        if (sprite === 'lightning' || sprite === 'bloque' || sprite === 'ahorro' || sprite === 'nodo') return 0.068;
        return 0.084; // inflation objects
      })();

      const obj = k.add([
        k.sprite(sprite),
        k.pos(x, y),
        k.anchor('center'),
        k.scale(scale),
        k.rotate(k.rand(-15, 15)),
        k.area(),
        k.z(10),
        'falling',
        { kind: sprite, speed, angVel, sliced: false },
      ]);

      obj.onUpdate(() => {
        const dt = k.dt();
        const slow = slowMotion ? 0.55 : 1;
        obj.pos.y += obj.speed * dt * slow;
        obj.angle += obj.angVel * 60 * dt;

        if (obj.pos.y > 920 && !obj.sliced) {
          obj.sliced = true;
          handleMiss(obj);
          k.destroy(obj);
        }
      });

      return obj;
    }

    function handleMiss(obj) {
      // Inflation misses are punished
      if (INFLATION_SPRITES.includes(obj.kind)) {
        addScore(-15);
        damageHeart();
        return;
      }

      // Bitcoin: reward for NOT cutting
      if (obj.kind === 'bitcoin') {
        addScore(50);
        bitcoinCounter += 1;
        bitcoinStreak += 1;

        if (bitcoinStreak === 3) {
          addScore(100);
          toast.show('HODL! x3', k.rgb(255, 220, 140));
        }
        if (bitcoinStreak === 5) {
          addScore(200);
          toast.show('HODL! x5', k.rgb(255, 220, 140));
        }

        refreshUI();
        return;
      }

      // Powerups: no effect if missed
    }

    function explodeAhorro() {
      // simple "pop" effect
      const fx = k.add([
        k.circle(30),
        k.pos(240, 427),
        k.anchor('center'),
        k.color(120, 255, 160),
        k.opacity(0.35),
        k.z(200),
        { t: 0 },
      ]);
      fx.onUpdate(() => {
        fx.t += k.dt();
        fx.radius += 600 * k.dt();
        fx.opacity = Math.max(0, 0.35 - fx.t * 0.35);
        if (fx.t > 0.6) k.destroy(fx);
      });

      // remove all inflation objects currently on screen
      k.get('falling').forEach((o) => {
        if (o?.kind && INFLATION_SPRITES.includes(o.kind)) {
          k.destroy(o);
        }
      });
    }

    function sliceObject(obj) {
      if (obj.sliced) return;
      obj.sliced = true;

      // Inflation cut
      if (INFLATION_SPRITES.includes(obj.kind)) {
        inflationCutsThisSwipe += 1;
        addScore(10);
        k.destroy(obj);
        return;
      }

      // Bitcoin cut (bad)
      if (obj.kind === 'bitcoin') {
        // Cutting BTC is bad: costs points + health; 3 cuts = instant death
        addScore(-30);
        bitcoinStreak = 0;
        bitcoinCuts += 1;
        damageHeart();

        if (bitcoinCuts >= 3) {
          toast.show('PAPER HANDS! ☠', k.rgb(255, 180, 120));
          endGame();
          k.destroy(obj);
          return;
        }

        toast.show('Vendiste tu Bitcoin! (-vida)', k.rgb(255, 180, 120));
        k.destroy(obj);
        return;
      }

      // Powerups
      if (obj.kind === 'lightning') {
        scoreMultiplier = 2;
        multiplierUntil = elapsed + 3;
        toast.show('DOBLE PUNTOS x2 (3s)', k.rgb(255, 255, 180));
        k.destroy(obj);
        return;
      }

      if (obj.kind === 'bloque') {
        slowMotion = true;
        slowUntil = elapsed + 4;
        toast.show('TIME FREEZE (4s)', k.rgb(200, 220, 255));
        k.destroy(obj);
        return;
      }

      if (obj.kind === 'ahorro') {
        addScore(100);
        explodeAhorro();
        toast.show('AHORRO: LIMPIEZA +100', k.rgb(140, 255, 190));
        k.destroy(obj);
        return;
      }

      if (obj.kind === 'nodo') {
        // Super rare: grants +1 heart (up to 3) and resets current heart damage
        hearts = Math.min(3, hearts + 1);
        heartDamage = 0;
        toast.show('VIDA EXTRA +1', k.rgb(170, 220, 255));
        refreshUI();
        k.destroy(obj);
        return;
      }
    }

    function distPointToSegment(px, py, ax, ay, bx, by) {
      const abx = bx - ax;
      const aby = by - ay;
      const apx = px - ax;
      const apy = py - ay;
      const abLen2 = abx * abx + aby * aby;
      const t = abLen2 === 0 ? 0 : Math.max(0, Math.min(1, (apx * abx + apy * aby) / abLen2));
      const cx = ax + abx * t;
      const cy = ay + aby * t;
      const dx = px - cx;
      const dy = py - cy;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function trySliceBetween(a, b) {
      const sliceRadius = 42;
      const ax = a.x, ay = a.y;
      const bx = b.x, by = b.y;

      k.get('falling').forEach((o) => {
        if (!o?.kind || o.sliced) return;

        const d = distPointToSegment(o.pos.x, o.pos.y, ax, ay, bx, by);
        if (d < sliceRadius) sliceObject(o);
      });
    }

    // --- Input ---
    k.onMouseDown(() => {
      swiping = true;
      lastPos = k.mousePos();
      inflationCutsThisSwipe = 0;
    });

    k.onMouseRelease(() => {
      if (!swiping) return;
      swiping = false;

      // Combo bonus + feedback
      const c = inflationCutsThisSwipe;
      if (c === 2) {
        addScore(20);
        toast.show('COMBO x2 +20', k.rgb(255, 255, 255));
      }
      else if (c === 3) {
        addScore(40);
        toast.show('COMBO x3 +40', k.rgb(255, 255, 255));
      }
      else if (c >= 4) {
        addScore(80);
        toast.show('COMBO x4 +80', k.rgb(255, 255, 255));
      }

      inflationCutsThisSwipe = 0;
      lastPos = null;
    });

    k.onMouseMove(() => {
      if (!swiping) return;
      const p = k.mousePos();

      if (lastPos) {
        // Slice trail: continuous line via interpolation
        const ax = lastPos.x, ay = lastPos.y;
        const bx = p.x, by = p.y;
        const dx = bx - ax;
        const dy = by - ay;
        const len = Math.sqrt(dx * dx + dy * dy);

        if (len > 1) {
          // Interpolate points every 8px to ensure continuity
          const steps = Math.ceil(len / 8);
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const ix = ax + dx * t;
            const iy = ay + dy * t;

            k.add([
              k.circle(6),
              k.pos(ix, iy),
              k.anchor('center'),
              k.color(0, 0, 0),
              k.opacity(0.45),
              k.z(150),
              k.lifespan(0.12, { fade: 0.06 }),
            ]);
          }
        }

        trySliceBetween(lastPos, p);
      }

      lastPos = p;
    });

    // --- Spawning loop ---
    let spawnTimer = 0;

    k.onUpdate(() => {
      const dt = k.dt();
      elapsed += dt;

      // expire powerups
      if (scoreMultiplier !== 1 && elapsed > multiplierUntil) scoreMultiplier = 1;
      if (slowMotion && elapsed > slowUntil) slowMotion = false;

      spawnTimer += dt;

      // Base spawn interval: start slower (less overwhelming), then ramp up
      const warmup = Math.min(1, elapsed / 20);
      const baseInterval = (1.10 - 0.40 * warmup) / difficultyMult();

      while (spawnTimer > baseInterval) {
        spawnTimer -= baseInterval;

        // Weighted spawn
        const r = Math.random();

        // Mostly inflation
        if (r < 0.80) {
          const kind = INFLATION_SPRITES[Math.floor(Math.random() * INFLATION_SPRITES.length)];
          spawnObject(kind);
          continue;
        }

        // Bitcoin (common-ish)
        if (r < 0.94) {
          spawnObject('bitcoin');
          continue;
        }

        // Powerups should be rarer
        // 0.94 - 0.985 => common powerups (lightning/bloque)
        if (r < 0.985) {
          spawnObject(Math.random() < 0.5 ? 'lightning' : 'bloque');
          continue;
        }

        // 0.985 - 0.995 => ahorro (rare)
        if (r < 0.995) {
          spawnObject('ahorro');
          continue;
        }

        // 0.995 - 1.0 => nodo (super super rare)
        spawnObject('nodo');
      }
    });

    // Escape hatch
    k.onKeyPress('escape', () => k.go('menu'));
  });

}

