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

    // 3-step, image-based tutorial
    const card = (y, title, lines, spriteKeys) => {
      k.add([
        k.rect(420, 190, { radius: 16 }),
        k.pos(240, y),
        k.anchor('center'),
        k.color(20, 30, 44),
        k.opacity(0.75),
        k.z(2),
      ]);

      k.add([
        k.text(title, { size: 22 }),
        k.pos(240, y - 68),
        k.anchor('center'),
        k.color(255, 255, 255),
        k.z(3),
      ]);

      const iconY = y - 22;
      const startX = 240 - (spriteKeys.length - 1) * 55;
      spriteKeys.forEach((key, i) => {
        k.add([
          k.sprite(key),
          k.pos(startX + i * 110, iconY),
          k.anchor('center'),
          k.scale(0.18),
          k.z(3),
        ]);
      });

      k.add([
        k.text(lines.join('\n'), { size: 18, width: 380, lineSpacing: 8, align: 'center' }),
        k.pos(240, y + 58),
        k.anchor('center'),
        k.color(230, 240, 255),
        k.z(3),
      ]);
    };

    card(260, '1) INFLACIÓN (CÓRTALA)', [
      '+10 si la cortas',
      '-15 y daño si se te escapa',
    ], ['tortilla', 'gasolina', 'aguacate']);

    card(470, '2) POWERUPS', [
      '⚡ x2 puntos (3s)',
      '🟧 slow-mo (4s)',
    ], ['lightning', 'bloque']);

    card(680, '3) BITCOIN & AHORRO', [
      'BITCOIN: no lo cortes (+50 si pasa)',
      'AHORRO: +100 y limpia inflación',
    ], ['bitcoin', 'ahorro']);

    // Styled back button (same vibe as JUGAR)
    const backBtnY = 800;
    k.add([
      k.rect(240, 56, { radius: 16 }),
      k.pos(240, backBtnY + 6),
      k.anchor('center'),
      k.color(0, 0, 0),
      k.opacity(0.35),
      k.z(9),
    ]);

    const backBtn = k.add([
      k.rect(240, 56, { radius: 16 }),
      k.pos(240, backBtnY),
      k.anchor('center'),
      k.color(255, 104, 60),
      k.outline(4, k.rgb(255, 220, 140)),
      k.area(),
      k.z(10),
    ]);

    k.add([
      k.text('VOLVER', { size: 24 }),
      k.pos(240, backBtnY),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.z(11),
    ]);

    backBtn.onClick(() => k.go('menu'));
  });

  // ===== GAME OVER SCENE =====
  k.scene('gameover', (data) => {
    const score = data?.score ?? 0;
    const bitcoins = data?.bitcoins ?? 0;
    const years = data?.years ?? 0;
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
      `Sobreviviste ${years} años a la inflación`,
      `Protegiste $${pesos} pesos`,
      `Bitcoin guardados: ${bitcoins}`,
      '',
      `Score: ${score}`,
    ].join('\n');

    k.add([
      k.text(summary, { size: 22, width: 420, align: 'center', lineSpacing: 12 }),
      k.pos(240, 260),
      k.anchor('center'),
      k.color(240, 245, 255),
      k.z(2),
    ]);

    const makeBtn = (label, y, onClick, opts = {}) => {
      const w = opts.w ?? 340;
      const h = opts.h ?? 58;
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
        k.rect(w - 18, 16, { radius: 10 }),
        k.pos(240, y - 16),
        k.anchor('center'),
        k.color(255, 255, 255),
        k.opacity(0.16),
        k.z(11),
      ]);

      k.add([
        k.text(label, { size: 24 }),
        k.pos(240, y),
        k.anchor('center'),
        k.color(255, 255, 255),
        k.z(12),
      ]);

      b.onClick(onClick);
      return b;
    };

    // Clean mobile layout: 2 primary + 3 secondary
    makeBtn('TRY AGAIN', 520, () => k.go('game'));

    makeBtn('COMPRA BITCOIN', 590, () => {
      window.open('https://www.aureobitcoin.com/es', '_blank');
    });

    makeBtn('SHARE SCORE', 660, () => {
      const text = encodeURIComponent(`Sobreviví ${years} años a la inflación y protegí $${pesos}. Score: ${score}. BTC guardados: ${bitcoins}.`);
      const url = `https://twitter.com/intent/tweet?text=${text}`;
      window.open(url, '_blank');
    });

    makeBtn('APRENDE INFLACIÓN', 730, () => {
      window.open('https://inflacionmexico.com', '_blank');
    });

    // Placeholder for next iteration
    // makeBtn('LEADERBOARD', 800, () => {});

    // Tap anywhere top-left to return
    const back = k.add([
      k.text('← MENÚ', { size: 18 }),
      k.pos(20, 20),
      k.color(255, 255, 255),
      k.area(),
      k.z(5),
    ]);
    back.onClick(() => k.go('menu'));
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

    const toast = k.add([
      k.text('', { size: 26 }),
      k.pos(240, 140),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.opacity(0),
      k.z(120),
      {
        show(msg, color = k.rgb(255, 255, 255)) {
          this.text = msg;
          this.color = color;
          this.opacity = 1;
          this._t = 0;
        },
        _t: 0,
      }
    ]);

    k.onUpdate(() => {
      if (toast.opacity > 0) {
        toast._t += k.dt();
        if (toast._t > 1.2) toast.opacity = Math.max(0, toast.opacity - 2 * k.dt());
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
      const years = (elapsed / 10).toFixed(1);
      const pesos = Math.max(0, score) * 10;
      k.go('gameover', {
        score,
        bitcoins: bitcoinCounter,
        years,
        pesos,
      });
    }

    function spawnObject(kind) {
      const x = k.rand(40, 440);
      const y = -60;

      const speedBase = 220 * difficultyMult();
      const speedVar = k.rand(-30, 70);
      const speed = speedBase + speedVar;

      const angVel = k.rand(-2.2, 2.2);

      const sprite = kind;

      // Assets were feeling too big on mobile; scale them down substantially.
      // (Previous: ~0.5. Now: ~0.18-0.22 depending on type)
      const scale = (() => {
        if (sprite === 'bitcoin') return 0.18;
        if (sprite === 'lightning' || sprite === 'bloque' || sprite === 'ahorro' || sprite === 'nodo') return 0.18;
        return 0.22; // inflation objects
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
        addScore(-30);
        bitcoinStreak = 0;
        toast.show('Vendiste tu Bitcoin!', k.rgb(255, 180, 120));
        k.destroy(obj);
        return;
      }

      // Powerups
      if (obj.kind === 'lightning') {
        scoreMultiplier = 2;
        multiplierUntil = elapsed + 3;
        toast.show('x2 PUNTOS!', k.rgb(255, 255, 180));
        k.destroy(obj);
        return;
      }

      if (obj.kind === 'bloque') {
        slowMotion = true;
        slowUntil = elapsed + 4;
        toast.show('SLOW-MO', k.rgb(200, 220, 255));
        k.destroy(obj);
        return;
      }

      if (obj.kind === 'ahorro') {
        addScore(100);
        explodeAhorro();
        toast.show('AHORRO!', k.rgb(140, 255, 190));
        k.destroy(obj);
        return;
      }

      if (obj.kind === 'nodo') {
        // Super rare: grants +1 heart (up to 3) and resets current heart damage
        hearts = Math.min(3, hearts + 1);
        heartDamage = 0;
        toast.show('VIDA EXTRA!', k.rgb(170, 220, 255));
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

      // Combo bonus
      const c = inflationCutsThisSwipe;
      if (c === 2) addScore(20);
      else if (c === 3) addScore(40);
      else if (c >= 4) addScore(80);

      inflationCutsThisSwipe = 0;
      lastPos = null;
    });

    k.onMouseMove(() => {
      if (!swiping) return;
      const p = k.mousePos();
      if (lastPos) trySliceBetween(lastPos, p);
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

      // Base spawn interval, gets faster with difficulty
      const baseInterval = 0.75 / difficultyMult();

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

