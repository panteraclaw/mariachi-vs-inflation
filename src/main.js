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
  k.loadSprite('background-night', '/assets/background-night.png');
  k.loadSprite('logo', '/assets/logo.png');
  k.loadSprite('mariachi', '/assets/mariachi.png');
  k.loadSprite('github', '/assets/github-logo.svg');

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

  // Helper to get current background sprite
  const getBg = () => settings.nightMode ? 'background-night' : 'background';

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
        k.sprite(getBg()),
        k.pos(240, 427),
        k.anchor('center'),
        k.scale(bgScale),
        k.z(0),
      ]);
    }

    // Night mode toggle button (top-right)
    const nightBtn = k.add([
      k.rect(50, 50, { radius: 25 }),
      k.pos(430, 30),
      k.anchor('center'),
      k.color(100, 100, 120),
      k.outline(2, k.rgb(180, 180, 200)),
      k.area(),
      k.z(100),
    ]);

    k.add([
      k.text(settings.nightMode ? '☀️' : '🌙', { size: 28 }),
      k.pos(430, 30),
      k.anchor('center'),
      k.z(101),
    ]);

    nightBtn.onClick(() => {
      settings.nightMode = !settings.nightMode;
      k.go('menu');
    });
    nightBtn.onHover(() => k.setCursor('pointer'));
    nightBtn.onHoverEnd(() => k.setCursor('default'));

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

    // "Aprende BTC" (small, orange)
    const learnBtn = k.add([
      k.rect(140, 34, { radius: 12 }),
      k.pos(95, 830),
      k.anchor('center'),
      k.color(255, 104, 60),
      k.opacity(0.85),
      k.outline(3, k.rgb(255, 220, 140)),
      k.area(),
      k.z(10),
    ]);

    k.add([
      k.text('Aprende BTC', { size: 14 }),
      k.pos(95, 830),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.opacity(0.95),
      k.z(11),
    ]);

    learnBtn.onClick(() => k.go('learnbtc'));
    learnBtn.onHover(() => k.setCursor('pointer'));
    learnBtn.onHoverEnd(() => k.setCursor('default'));

    // GitHub logo (bottom-right corner)
    const githubBtn = k.add([
      k.sprite('github'),
      k.pos(450, 830),
      k.anchor('center'),
      k.scale(0.35),
      k.area(),
      k.z(10),
    ]);

    githubBtn.onClick(() => {
      window.open('https://github.com/panteraclaw/mariachi-vs-inflation', '_blank');
    });
    githubBtn.onHover(() => k.setCursor('pointer'));
    githubBtn.onHoverEnd(() => k.setCursor('default'));

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
        k.sprite(getBg()),
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

      // Icons in two rows if > 3 (safe when items is empty)
      const perRow = items.length > 3 ? 3 : Math.max(1, items.length);
      const rows = items.length === 0 ? 0 : Math.ceil(items.length / perRow);

      if (items.length > 0) {
        items.forEach((item, i) => {
          const row = Math.floor(i / perRow);
          const col = i % perRow;
          const startX = 240 - (perRow - 1) * 50;
          const x = startX + col * 100;
          const y = 330 + row * 95;

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
              k.pos(x, y + 42),
              k.anchor('center'),
              k.color(200, 210, 230),
              k.z(3),
            ]));
          }
        });
      }

      // Body text sits below icon grid (or near top if no icons)
      const bodyY = items.length === 0 ? 420 : (330 + rows * 95 + 70);
      addObj(k.add([
        k.text(lines.join('\n'), { size: 16, width: 400, lineSpacing: 9, align: 'center' }),
        k.pos(240, bodyY),
        k.anchor('center'),
        k.color(230, 240, 255),
        k.z(3),
      ]));

      addObj(k.add([
        k.text(`${page + 1}/5`, { size: 18 }),
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
        card('OBJETIVO', [
          'Corta la INFLACIÓN para ahorrar pesos',
          'GUARDA / INVIERTE en BITCOIN (no lo cortes)',
          'Sobrevive y haz el mayor score posible',
        ], [
          { key: 'tortilla', label: 'Inflación' },
          { key: 'bitcoin', label: 'Bitcoin' },
        ]);
      }

      if (page === 1) {
        card('INFLACIÓN (NEGATIVOS)', [
          'CORTA: +10 pts',
          'SI SE ESCAPA: -15 pts + 1/3 de vida',
          'COMBO: corta 2+ en un solo tajo',
          '  → x2 +20 | x3 +40 | x4 +80 🔥',
        ], [
          { key: 'tortilla', label: 'Tortillas' },
          { key: 'renta', label: 'Renta' },
          { key: 'gasolina', label: 'Gasolina' },
          { key: 'canasta', label: 'Canasta' },
          { key: 'aguacate', label: 'Aguacate' },
        ]);
      }

      if (page === 2) {
        card('BITCOIN (AHORRA / INVIERTE)', [
          '✅ Si lo dejas pasar: +50 pts (ahorraste en BTC)',
          '❌ Si lo cortas: pierdes 1 VIDA COMPLETA',
          '3 cortes de BTC = Game Over (PAPER HANDS)',
        ], [
          { key: 'bitcoin', label: 'Bitcoin' },
        ]);
      }

      if (page === 3) {
        card('POWERUPS', [
          'Corta estos para activarlos:',
          '⚡ Lightning: x2 puntos (3s)',
          '🟧 Bloque: congela inflación (4s)',
          '🌱 Ahorro: +100 + limpia pantalla',
          '🔷 Nodo: +1 vida (máx 3)',
        ], [
          { key: 'lightning', label: 'x2' },
          { key: 'bloque', label: 'Freeze' },
          { key: 'ahorro', label: '+100' },
          { key: 'nodo', label: '+Vida' },
        ]);
      }

      if (page === 4) {
        card('VIDAS + TIPS', [
          'Tienes 3 vidas: ❤❤❤',
          '• Inflación escapada: -1/3 de vida',
          '• Cortar Bitcoin: -1 vida completa',
          '',
          '💡 Mensajes educativos: aparecen cada 15s',
          '(puedes apagarlos en ⚙ Configuración)',
        ], []);
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

    // Close (X) button - top-right
    const closeShadow = k.add([
      k.rect(52, 52, { radius: 16 }),
      k.pos(440, 86),
      k.anchor('center'),
      k.color(0, 0, 0),
      k.opacity(0.28),
      k.z(9),
    ]);

    const closeBtn = k.add([
      k.rect(52, 52, { radius: 16 }),
      k.pos(440, 80),
      k.anchor('center'),
      k.color(255, 104, 60),
      k.opacity(0.92),
      k.outline(4, k.rgb(255, 220, 140)),
      k.area(),
      k.z(10),
    ]);

    k.add([
      k.text('✕', { size: 28 }),
      k.pos(440, 80),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.z(11),
    ]);

    closeBtn.onClick(() => k.go('menu'));
    closeBtn.onHover(() => k.setCursor('pointer'));
    closeBtn.onHoverEnd(() => k.setCursor('default'));

    // Bottom: back/next
    btnStyle(130, 760, 'VOLVER', () => {
      page = (page - 1 + 5) % 5;
      render();
    });

    btnStyle(350, 760, 'SIGUIENTE', () => {
      page = (page + 1) % 5;
      render();
    });

    render();
  });

  // ===== LEARN BTC SCENE (read tips) =====
  k.scene('learnbtc', () => {
    k.setGravity(0);

    // Background
    if (bgData) {
      const scaleX = 480 / bgData.width;
      const scaleY = 854 / bgData.height;
      const bgScale = Math.max(scaleX, scaleY);

      k.add([
        k.sprite(getBg()),
        k.pos(240, 427),
        k.anchor('center'),
        k.scale(bgScale),
        k.opacity(0.25),
        k.z(0),
      ]);
    }

    k.add([
      k.rect(460, 760, { radius: 18 }),
      k.pos(240, 427),
      k.anchor('center'),
      k.color(10, 20, 30),
      k.opacity(0.85),
      k.z(1),
    ]);

    k.add([
      k.text('APRENDE BTC', { size: 32 }),
      k.pos(240, 150),
      k.anchor('center'),
      k.color(255, 220, 140),
      k.z(2),
    ]);

    k.add([
      k.text('Por qué Bitcoin protege tu ahorro (simple y directo)', { size: 16, width: 420, align: 'center' }),
      k.pos(240, 190),
      k.anchor('center'),
      k.color(230, 240, 255),
      k.opacity(0.85),
      k.z(2),
    ]);

    const learnPages = [
      {
        title: '1) ¿Qué es la inflación?',
        body: [
          'Inflación = los precios suben con el tiempo.',
          'Eso hace que tu dinero compre menos.',
          'Aunque ahorres, tu poder adquisitivo puede caer.',
        ].join('\n\n'),
      },
      {
        title: '2) ¿Qué es Bitcoin?',
        body: [
          'Bitcoin es dinero digital global.',
          'Tiene oferta fija: solo existirán 21M BTC.',
          'Nadie puede “imprimir” más para devaluarlo.',
        ].join('\n\n'),
      },
      {
        title: '3) ¿Por qué es refugio vs inflación?',
        body: [
          'Si algo es escaso y la demanda crece, su valor tiende a sostenerse o subir.',
          'El dinero tradicional (pesos, dólares) suele emitirse más con el tiempo → tu ahorro se diluye.',
          'Bitcoin es escaso por diseño → puede proteger tu ahorro a largo plazo.',
        ].join('\n\n'),
      },
      {
        title: '4) Coordinación ciudadana descentralizada',
        body: [
          'No depende de un banco o gobierno.',
          'Miles de nodos verifican reglas y evitan trampas.',
          'Es una red abierta: cualquiera puede participar y validar.',
        ].join('\n\n'),
      },
      {
        title: '5) En este juego (resumen)',
        body: [
          'Corta INFLACIÓN para ahorrar pesos.',
          'GUARDA/INVIERTE en BTC: déjalo pasar (+50).',
          'Si cortas BTC: pierdes 1 vida completa.',
          'Tip: activa “mensajes educativos” en ⚙ para aprender jugando.',
        ].join('\n\n'),
      },
    ];

    let page = 0;
    const totalPages = learnPages.length;

    const pageTitle = k.add([
      k.text('', { size: 22, width: 420, align: 'center' }),
      k.pos(240, 250),
      k.anchor('center'),
      k.color(255, 220, 140),
      k.z(2),
    ]);

    const pageBody = k.add([
      k.text('', { size: 18, width: 420, lineSpacing: 12, align: 'center' }),
      k.pos(240, 450),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.z(2),
    ]);

    const pageText = k.add([
      k.text('', { size: 16 }),
      k.pos(240, 690),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.opacity(0.7),
      k.z(2),
    ]);

    const render = () => {
      const p = learnPages[page];
      pageTitle.text = p.title;
      pageBody.text = p.body;
      pageText.text = `${page + 1}/${totalPages}`;
    };

    // Small button style
    const smallBtn = (x, y, label, onClick) => {
      const b = k.add([
        k.rect(160, 50, { radius: 16 }),
        k.pos(x, y),
        k.anchor('center'),
        k.color(255, 104, 60),
        k.opacity(0.92),
        k.outline(4, k.rgb(255, 220, 140)),
        k.area(),
        k.z(3),
      ]);

      k.add([
        k.text(label, { size: 20 }),
        k.pos(x, y),
        k.anchor('center'),
        k.color(255, 255, 255),
        k.z(4),
      ]);

      b.onClick(onClick);
      b.onHover(() => k.setCursor('pointer'));
      b.onHoverEnd(() => k.setCursor('default'));
      return b;
    };

    // Close (X)
    const closeBtn = k.add([
      k.rect(52, 52, { radius: 16 }),
      k.pos(440, 80),
      k.anchor('center'),
      k.color(255, 104, 60),
      k.opacity(0.92),
      k.outline(4, k.rgb(255, 220, 140)),
      k.area(),
      k.z(5),
    ]);

    k.add([
      k.text('✕', { size: 28 }),
      k.pos(440, 80),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.z(6),
    ]);

    closeBtn.onClick(() => k.go('menu'));
    closeBtn.onHover(() => k.setCursor('pointer'));
    closeBtn.onHoverEnd(() => k.setCursor('default'));

    smallBtn(130, 760, 'VOLVER', () => {
      page = (page - 1 + totalPages) % totalPages;
      render();
    });

    smallBtn(350, 760, 'SIGUIENTE', () => {
      page = (page + 1) % totalPages;
      render();
    });

    render();
  });

  // ===== GAME OVER SCENE =====
  k.scene('gameover', (data) => {
    const score = data?.score ?? 0;
    const bitcoins = data?.bitcoins ?? 0;

    k.setGravity(0);

    if (bgData) {
      const scaleX = 480 / bgData.width;
      const scaleY = 854 / bgData.height;
      const bgScale = Math.max(scaleX, scaleY);

      k.add([
        k.sprite(getBg()),
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
      `Ahorraste $${score} pesos`,
      `cortando la inflación`,
      ``,
      `Bitcoin guardados: ${bitcoins}`,
    ].join('\n');

    k.add([
      k.text(summary, { size: 22, width: 420, align: 'center', lineSpacing: 12 }),
      k.pos(240, 240),
      k.anchor('center'),
      k.color(240, 245, 255),
      k.z(2),
    ]);

    // Name input section
    k.add([
      k.text('Guarda tu puntuación:', { size: 18 }),
      k.pos(240, 340),
      k.anchor('center'),
      k.color(255, 220, 140),
      k.z(2),
    ]);

    let playerName = '';
    let saved = false;

    // --- Mobile-friendly name input (DOM) ---
    // Remove any previous leftover input
    const prev = document.getElementById('oc-name-input');
    if (prev) prev.remove();

    const nameBox = k.add([
      k.rect(280, 42, { radius: 12 }),
      k.pos(200, 380),
      k.anchor('center'),
      k.color(40, 50, 70),
      k.outline(2, k.rgb(150, 160, 180)),
      k.area(),
      k.z(2),
    ]);

    const nameDisplay = k.add([
      k.text('', { size: 20 }),
      k.pos(200, 380),
      k.anchor('center'),
      k.color(230, 240, 255),
      k.z(3),
    ]);

    const placeholderText = k.add([
      k.text('Toca para escribir...', { size: 18 }),
      k.pos(200, 380),
      k.anchor('center'),
      k.color(120, 130, 150),
      k.opacity(0.7),
      k.z(3),
    ]);

    // Small hint on web
    const typeHint = k.add([
      k.text('⌨ Escribe tu nombre', { size: 14 }),
      k.pos(200, 412),
      k.anchor('center'),
      k.color(255, 220, 140),
      k.opacity(0.0),
      k.z(3),
    ]);

    const domInput = document.createElement('input');
    domInput.id = 'oc-name-input';
    domInput.type = 'text';
    domInput.maxLength = 20;
    domInput.autocapitalize = 'words';
    domInput.autocomplete = 'name';
    domInput.placeholder = 'Tu nombre';

    // Invisible but focusable, positioned over the canvas
    domInput.style.position = 'fixed';
    domInput.style.left = '50%';
    domInput.style.top = '50%';
    domInput.style.transform = 'translate(-50%, -50%)';
    domInput.style.width = '1px';
    domInput.style.height = '1px';
    domInput.style.opacity = '0';
    domInput.style.zIndex = '9999';
    domInput.style.border = '0';
    domInput.style.background = 'transparent';
    domInput.style.color = 'transparent';
    domInput.style.caretColor = 'transparent';

    document.body.appendChild(domInput);

    const syncName = () => {
      playerName = domInput.value.slice(0, 20);
      nameDisplay.text = playerName;
      placeholderText.opacity = playerName.length ? 0 : 0.7;
    };

    domInput.addEventListener('input', () => {
      if (saved) return;
      syncName();
    });

    domInput.addEventListener('focus', () => {
      if (saved) return;
      typeHint.opacity = 0.85;
    });

    domInput.addEventListener('blur', () => {
      typeHint.opacity = 0;
    });

    const focusInput = () => {
      if (saved) return;
      domInput.focus();
      // iOS sometimes needs a tick
      setTimeout(() => domInput.focus(), 20);
    };

    nameBox.onClick(focusInput);
    nameBox.onHover(() => k.setCursor('text'));
    nameBox.onHoverEnd(() => k.setCursor('default'));

    // Try to focus once (helps desktop discoverability)
    setTimeout(() => {
      // Don't steal focus aggressively on mobile; just show hint on desktop
      if (!('ontouchstart' in window)) {
        typeHint.opacity = 0.65;
      }
    }, 300);

    // Save button (floppy disk icon) - positioned to the right of input
    const saveBtn = k.add([
      k.rect(50, 42, { radius: 12 }),
      k.pos(370, 380),
      k.anchor('center'),
      k.color(60, 180, 100),
      k.outline(2, k.rgb(120, 220, 160)),
      k.area(),
      k.z(2),
    ]);

    k.add([
      k.text('💾', { size: 26 }),
      k.pos(370, 380),
      k.anchor('center'),
      k.z(3),
    ]);

    const saveName = () => {
      if (saved || playerName.length === 0) return;
      saved = true;
      
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, score, bitcoins })
      })
        .then(() => {
          nameDisplay.text = '✓ Guardado!';
          nameDisplay.color = k.rgb(120, 220, 160);
          const inp = document.getElementById('oc-name-input');
          if (inp) inp.blur();
        })
        .catch(() => {
          nameDisplay.text = 'Error';
          nameDisplay.color = k.rgb(255, 100, 100);
        });
    };

    saveBtn.onClick(saveName);
    saveBtn.onHover(() => k.setCursor('pointer'));
    saveBtn.onHoverEnd(() => k.setCursor('default'));

    k.onKeyPress('enter', saveName);

    const makeBtn = (label, y, onClick, opts = {}) => {
      const w = opts.w ?? 260;
      const h = opts.h ?? 42;
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

    // Mobile layout (requested order) - smaller buttons, tighter spacing
    makeBtn('JUGAR OTRA VEZ', 470, () => k.go('game'));

    makeBtn('COMPARTIR PUNTUACIÓN', 525, () => {
      const gameUrl = 'https://mariachi-vs-inflation.vercel.app';
      const text = encodeURIComponent(
        `Ahorré $${score} pesos cortando la inflación. BTC guardados: ${bitcoins}. ¿Cuánto podrás ahorrar? ${gameUrl}`
      );
      const url = `https://twitter.com/intent/tweet?text=${text}`;
      window.open(url, '_blank');
    }, { w: 300 });

    makeBtn('LEADERBOARD', 580, () => {
      k.go('leaderboard', { score, bitcoins });
    });

    makeBtn('APRENDE SOBRE INFLACIÓN', 635, () => {
      window.open('https://inflacionmexico.com', '_blank');
    }, { w: 300 });

    makeBtn('COMPRA BITCOIN', 690, () => {
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

  // ===== SETTINGS / SFX =====
  const settings = {
    sfxVolume: 0.3,
    eduMessages: true,
    nightMode: false,
  };

  // WebAudio needs a user gesture to play on mobile (iOS/Android)
  let audioCtx = null;
  let audioUnlocked = false;

  function ensureAudioUnlocked() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state !== 'running') {
        audioCtx.resume();
      }
      audioUnlocked = true;
    } catch {
      // ignore
    }
  }

  // Try to unlock audio on first interaction
  if (typeof window !== 'undefined') {
    const unlockOnce = () => {
      ensureAudioUnlocked();
      window.removeEventListener('pointerdown', unlockOnce);
      window.removeEventListener('touchstart', unlockOnce);
      window.removeEventListener('mousedown', unlockOnce);
      window.removeEventListener('keydown', unlockOnce);
    };
    window.addEventListener('pointerdown', unlockOnce, { passive: true });
    window.addEventListener('touchstart', unlockOnce, { passive: true });
    window.addEventListener('mousedown', unlockOnce, { passive: true });
    window.addEventListener('keydown', unlockOnce);
  }

  function playSFX(type) {
    if (settings.sfxVolume === 0) return;

    ensureAudioUnlocked();
    if (!audioCtx || audioCtx.state !== 'running') return;

    const ctx = audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = settings.sfxVolume;

    if (type === 'slice') {
      // Deep sword whoosh: grave y suave
      osc.type = 'sine';
      osc.frequency.value = 180;
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.11);
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      filter.Q.value = 1;
      
      osc.connect(filter);
      filter.connect(gain);
      
      gain.gain.value = settings.sfxVolume * 0.4;
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.11);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } else if (type === 'btc-error') {
      osc.frequency.value = 200;
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'powerup') {
      osc.frequency.value = 600;
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'combo') {
      osc.frequency.value = 440;
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  }

  const eduTips = [
    // Core
    'BTC: suministro fijo de 21M',
    'Bitcoin es desinflacionario (oferta fija)',
    'Inflación reduce tu poder adquisitivo',
    'Inflación = impuesto invisible',
    'Tu dinero fiat pierde valor con inflación',
    'BTC no puede ser impreso por gobiernos',
    'Descentralización = independencia monetaria',
    'Halving: la emisión se reduce a la mitad',
    'Cada ~4 años: halving de BTC',
    'BTC es oro digital (escaso)',

    // HODL / comportamiento
    'HODL = mantener BTC largo plazo',
    'Vender por miedo = paper hands',
    'Bitcoin premia la paciencia',
    'DCA: comprar poco a poco reduce riesgo',

    // Seguridad / self-custody
    'Not your keys, not your coins',
    'Hardware wallet = custodia propia',
    'Semilla (seed) = acceso a tu wallet',
    'Nunca compartas tu seed phrase',

    // Conceptos
    'Sats: 1 BTC = 100,000,000 sats',
    'Block time: ~10 min por bloque',
    'Minería asegura la red con energía',
    'Nodos validan reglas (nadie manda)',
    'Oferta fija + demanda = presión alcista',

    // México / vida diaria
    'En México, inflación anual suele 4-5%',
    'Precios suben: renta, gasolina, comida',
    'Ahorro en fiat se devalúa con el tiempo',

    // Juego
    'Corta inflación, no cortes BTC',
    'Deja pasar BTC: +50 pts',
    'Cortar BTC: pierdes 1 vida completa',
    'Inflación que se escapa: 1/3 de vida',
    'Powerups ayudan a sobrevivir más',

    // Extra variety
    'Bitcoin es global: internet + claves',
    'Transacciones: verificables y públicas',
    'Comisiones suben cuando hay congestión',
    'Lightning: pagos rápidos y baratos',
    'Escasez programada: nadie la cambia fácil',
    'Fiat: oferta tiende a expandirse',
    'Ahorra en activo escaso, no en deuda',
    'Tiempo > timing: piensa a largo plazo',
    'Volatilidad: precio se mueve, oferta no',
    'Educación financiera = defensa vs inflación',
  ];

  // ===== LEADERBOARD SCENE =====
  k.scene('leaderboard', (data) => {
    const myScore = data?.score;
    const myBitcoins = data?.bitcoins;

    k.setGravity(0);

    if (bgData) {
      const scaleX = 480 / bgData.width;
      const scaleY = 854 / bgData.height;
      const bgScale = Math.max(scaleX, scaleY);

      k.add([
        k.sprite(getBg()),
        k.pos(240, 427),
        k.anchor('center'),
        k.scale(bgScale),
        k.opacity(0.25),
        k.z(0),
      ]);
    }

    k.add([
      k.rect(460, 800, { radius: 18 }),
      k.pos(240, 427),
      k.anchor('center'),
      k.color(10, 18, 28),
      k.opacity(0.85),
      k.z(1),
    ]);

    k.add([
      k.text('LEADERBOARD', { size: 36 }),
      k.pos(240, 100),
      k.anchor('center'),
      k.color(255, 220, 140),
      k.z(2),
    ]);

    const listY = 180;
    k.add([
      k.text('Cargando...', { size: 20 }),
      k.pos(240, listY),
      k.anchor('center'),
      k.color(240, 245, 255),
      k.z(2),
    ]);

    // Fetch leaderboard
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(rows => {
        k.get('*').forEach(o => {
          if (o.text === 'Cargando...') k.destroy(o);
        });

        const lines = rows.slice(0, 10).map((r, i) => 
          `${i+1}. ${r.name}: ${r.score} pts (${r.bitcoins} BTC)`
        ).join('\n');

        k.add([
          k.text(lines || 'Sin registros', { size: 18, width: 420, lineSpacing: 8 }),
          k.pos(240, listY + 200),
          k.anchor('center'),
          k.color(240, 245, 255),
          k.z(2),
        ]);
      })
      .catch(() => {
        k.add([
          k.text('Error al cargar', { size: 20 }),
          k.pos(240, listY + 100),
          k.anchor('center'),
          k.color(255, 100, 100),
          k.z(2),
        ]);
      });

    // Save score section (if coming from game over)
    if (myScore !== undefined) {
      k.add([
        k.text('Guarda tu puntuación:', { size: 22 }),
        k.pos(240, 620),
        k.anchor('center'),
        k.color(255, 255, 255),
        k.z(2),
      ]);

      k.add([
        k.text('(Ingresa tu nombre y presiona Enter)', { size: 16 }),
        k.pos(240, 650),
        k.anchor('center'),
        k.color(200, 210, 230),
        k.z(2),
      ]);

      let playerName = '';
      const nameDisplay = k.add([
        k.text(playerName || '_', { size: 24 }),
        k.pos(240, 690),
        k.anchor('center'),
        k.color(255, 220, 140),
        k.z(2),
      ]);

      k.onCharInput((ch) => {
        if (playerName.length < 20) {
          playerName += ch;
          nameDisplay.text = playerName || '_';
        }
      });

      k.onKeyPress('backspace', () => {
        playerName = playerName.slice(0, -1);
        nameDisplay.text = playerName || '_';
      });

      k.onKeyPress('enter', () => {
        if (playerName.length > 0) {
          fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName, score: myScore, bitcoins: myBitcoins })
          })
            .then(() => k.go('leaderboard'))
            .catch(() => alert('Error al guardar'));
        }
      });
    }

    // Back button
    const backBtn = k.add([
      k.rect(200, 48, { radius: 14 }),
      k.pos(240, 780),
      k.anchor('center'),
      k.color(255, 104, 60),
      k.outline(3, k.rgb(255, 220, 140)),
      k.area(),
      k.z(3),
    ]);

    k.add([
      k.text('VOLVER', { size: 22 }),
      k.pos(240, 780),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.z(4),
    ]);

    backBtn.onClick(() => {
      // If came from gameover (has score), go back to gameover
      if (myScore !== undefined) {
        k.go('gameover', { score: myScore, bitcoins: myBitcoins });
      } else {
        k.go('menu');
      }
    });
    backBtn.onHover(() => k.setCursor('pointer'));
    backBtn.onHoverEnd(() => k.setCursor('default'));
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
        k.sprite(getBg()),
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

    // Health UI: 3 hearts + 3-hit meter (clearer than 9 mini-hearts)
    const heartsText = k.add([
      k.text('❤❤❤', { size: 22 }),
      k.pos(18, 74),
      k.color(255, 120, 120),
      k.z(100),
    ]);

    const heartMeterText = k.add([
      k.text('', { size: 16 }),
      k.pos(18, 98),
      k.color(255, 220, 140),
      k.opacity(0.9),
      k.z(100),
    ]);

    // Pause button (top-right)
    let paused = false;
    const pauseBtn = k.add([
      k.rect(50, 50, { radius: 12 }),
      k.pos(420, 30),
      k.anchor('center'),
      k.color(100, 100, 120),
      k.outline(2, k.rgb(180, 180, 200)),
      k.area(),
      k.z(100),
    ]);
    k.add([
      k.text('⏸', { size: 28 }),
      k.pos(420, 30),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.z(101),
    ]);

    pauseBtn.onClick(() => {
      if (paused) {
        // Already paused, unpause
        paused = false;
        return;
      }

      paused = true;
      const pauseObjs = [];

      const addPause = (obj) => {
        pauseObjs.push(obj);
        return obj;
      };

      const closePause = () => {
        pauseObjs.forEach(o => k.destroy(o));
        paused = false;
      };

      addPause(k.add([
        k.rect(360, 260, { radius: 18 }),
        k.pos(240, 427),
        k.anchor('center'),
        k.color(20, 30, 44),
        k.opacity(0.95),
        k.z(200),
      ]));

      addPause(k.add([
        k.text('PAUSA', { size: 32 }),
        k.pos(240, 340),
        k.anchor('center'),
        k.color(255, 255, 255),
        k.z(201),
      ]));

      const continueBtn = addPause(k.add([
        k.rect(240, 52, { radius: 14 }),
        k.pos(240, 420),
        k.anchor('center'),
        k.color(60, 180, 100),
        k.outline(3, k.rgb(120, 220, 160)),
        k.area(),
        k.z(201),
      ]));
      addPause(k.add([k.text('CONTINUAR', { size: 22 }), k.pos(240, 420), k.anchor('center'), k.color(255, 255, 255), k.z(202)]));

      continueBtn.onClick(closePause);
      continueBtn.onHover(() => k.setCursor('pointer'));
      continueBtn.onHoverEnd(() => k.setCursor('default'));

      const quitBtn = addPause(k.add([
        k.rect(240, 52, { radius: 14 }),
        k.pos(240, 490),
        k.anchor('center'),
        k.color(180, 80, 80),
        k.outline(3, k.rgb(220, 120, 120)),
        k.area(),
        k.z(201),
      ]));
      addPause(k.add([k.text('ABANDONAR', { size: 22 }), k.pos(240, 490), k.anchor('center'), k.color(255, 255, 255), k.z(202)]));

      quitBtn.onClick(() => {
        closePause();
        endGame();
      });
      quitBtn.onHover(() => k.setCursor('pointer'));
      quitBtn.onHoverEnd(() => k.setCursor('default'));
    });
    pauseBtn.onHover(() => k.setCursor('pointer'));
    pauseBtn.onHoverEnd(() => k.setCursor('default'));

    // Settings button (next to pause)
    const settingsBtn = k.add([
      k.rect(50, 50, { radius: 12 }),
      k.pos(360, 30),
      k.anchor('center'),
      k.color(100, 100, 120),
      k.outline(2, k.rgb(180, 180, 200)),
      k.area(),
      k.z(100),
    ]);
    k.add([
      k.text('⚙', { size: 28 }),
      k.pos(360, 30),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.z(101),
    ]);

    settingsBtn.onClick(() => {
      paused = true;
      const overlayObjs = [];

      const addOverlay = (obj) => {
        overlayObjs.push(obj);
        return obj;
      };

      const closeOverlay = () => {
        overlayObjs.forEach(o => k.destroy(o));
        paused = false;
      };

      addOverlay(k.add([
        k.rect(420, 300, { radius: 18 }),
        k.pos(240, 427),
        k.anchor('center'),
        k.color(20, 30, 44),
        k.opacity(0.95),
        k.z(200),
      ]));

      addOverlay(k.add([
        k.text('CONFIGURACIÓN', { size: 24 }),
        k.pos(240, 320),
        k.anchor('center'),
        k.color(255, 255, 255),
        k.z(201),
      ]));

      const volLabel = addOverlay(k.add([
        k.text(`Volumen SFX: ${Math.round(settings.sfxVolume * 100)}%`, { size: 20 }),
        k.pos(240, 380),
        k.anchor('center'),
        k.color(230, 240, 255),
        k.z(201),
      ]));

      const volDown = addOverlay(k.add([
        k.rect(60, 40, { radius: 10 }),
        k.pos(140, 420),
        k.anchor('center'),
        k.color(255, 104, 60),
        k.area(),
        k.z(201),
      ]));
      addOverlay(k.add([k.text('-', { size: 32 }), k.pos(140, 420), k.anchor('center'), k.z(202)]));

      const volUp = addOverlay(k.add([
        k.rect(60, 40, { radius: 10 }),
        k.pos(240, 420),
        k.anchor('center'),
        k.color(255, 104, 60),
        k.area(),
        k.z(201),
      ]));
      addOverlay(k.add([k.text('+', { size: 32 }), k.pos(240, 420), k.anchor('center'), k.z(202)]));

      const muteBtn = addOverlay(k.add([
        k.rect(80, 40, { radius: 10 }),
        k.pos(340, 420),
        k.anchor('center'),
        k.color(120, 120, 140),
        k.area(),
        k.z(201),
      ]));
      addOverlay(k.add([k.text('Mute', { size: 18 }), k.pos(340, 420), k.anchor('center'), k.z(202)]));

      volDown.onClick(() => {
        settings.sfxVolume = Math.max(0, settings.sfxVolume - 0.1);
        volLabel.text = `Volumen SFX: ${Math.round(settings.sfxVolume * 100)}%`;
      });
      volDown.onHover(() => k.setCursor('pointer'));
      volDown.onHoverEnd(() => k.setCursor('default'));

      volUp.onClick(() => {
        settings.sfxVolume = Math.min(1, settings.sfxVolume + 0.1);
        volLabel.text = `Volumen SFX: ${Math.round(settings.sfxVolume * 100)}%`;
      });
      volUp.onHover(() => k.setCursor('pointer'));
      volUp.onHoverEnd(() => k.setCursor('default'));

      muteBtn.onClick(() => {
        settings.sfxVolume = 0;
        volLabel.text = `Volumen SFX: 0%`;
      });
      muteBtn.onHover(() => k.setCursor('pointer'));
      muteBtn.onHoverEnd(() => k.setCursor('default'));

      const eduLabel = addOverlay(k.add([
        k.text(`Mensajes educativos: ${settings.eduMessages ? 'ON' : 'OFF'}`, { size: 20 }),
        k.pos(240, 480),
        k.anchor('center'),
        k.color(230, 240, 255),
        k.z(201),
      ]));

      const toggleEdu = addOverlay(k.add([
        k.rect(100, 40, { radius: 10 }),
        k.pos(240, 520),
        k.anchor('center'),
        k.color(settings.eduMessages ? k.rgb(60, 180, 100) : k.rgb(120, 120, 140)),
        k.area(),
        k.z(201),
      ]));
      addOverlay(k.add([k.text('Toggle', { size: 18 }), k.pos(240, 520), k.anchor('center'), k.z(202)]));

      toggleEdu.onClick(() => {
        settings.eduMessages = !settings.eduMessages;
        eduLabel.text = `Mensajes educativos: ${settings.eduMessages ? 'ON' : 'OFF'}`;
        toggleEdu.color = settings.eduMessages ? k.rgb(60, 180, 100) : k.rgb(120, 120, 140);
      });
      toggleEdu.onHover(() => k.setCursor('pointer'));
      toggleEdu.onHoverEnd(() => k.setCursor('default'));

      const closeBtn = addOverlay(k.add([
        k.rect(120, 44, { radius: 12 }),
        k.pos(240, 580),
        k.anchor('center'),
        k.color(255, 104, 60),
        k.area(),
        k.z(201),
      ]));
      addOverlay(k.add([k.text('VOLVER', { size: 20 }), k.pos(240, 580), k.anchor('center'), k.z(202)]));

      closeBtn.onClick(closeOverlay);
      closeBtn.onHover(() => k.setCursor('pointer'));
      closeBtn.onHoverEnd(() => k.setCursor('default'));
    });
    settingsBtn.onHover(() => k.setCursor('pointer'));
    settingsBtn.onHoverEnd(() => k.setCursor('default'));

    // Educational messages timer
    let eduTimer = 0;

    // Non-repeating educational tips (shuffle bag)
    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    let eduBag = shuffle([...eduTips]);
    let lastEduTip = null;
    const nextEduTip = () => {
      if (eduBag.length === 0) eduBag = shuffle([...eduTips]);
      let tip = eduBag.pop();

      // Avoid immediate repetition when possible
      if (tip === lastEduTip && eduBag.length > 0) {
        const alt = eduBag.pop();
        eduBag.push(tip);
        tip = alt;
      }

      lastEduTip = tip;
      return tip;
    };

    // Toast with background for visibility (larger for edu messages)
    const toastBg = k.add([
      k.rect(440, 70, { radius: 12 }),
      k.pos(240, 140),
      k.anchor('center'),
      k.color(0, 0, 0),
      k.opacity(0),
      k.z(119),
    ]);

    const toastText = k.add([
      k.text('', { size: 22, width: 420 }),
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

      // Hearts
      const fullHearts = '❤'.repeat(Math.max(0, hearts));
      const emptyHearts = '🖤'.repeat(Math.max(0, 3 - hearts));
      heartsText.text = `${fullHearts}${emptyHearts}`;

      // 3-hit meter for current heart (inflation escapes = 1 hit)
      const remaining = Math.max(0, 3 - heartDamage);
      const meter = '▮'.repeat(remaining) + '▯'.repeat(3 - remaining);
      heartMeterText.text = `Resistencia: ${meter}`;
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

    function damageHeartThird() {
      // Used when inflation escapes: 1/3 of a heart
      heartDamage += 1;
      if (heartDamage >= 3) {
        heartDamage = 0;
        hearts -= 1;
      }
      refreshUI();
      if (hearts <= 0) endGame();
    }

    function damageFullHeart() {
      // Used when cutting Bitcoin: lose 1 full heart immediately
      hearts -= 1;
      heartDamage = 0;
      refreshUI();
      if (hearts <= 0) endGame();
    }

    function endGame() {
      k.go('gameover', {
        score: Math.max(0, score),
        bitcoins: bitcoinCounter,
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
        if (paused) return; // Freeze when paused

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

    function missFX(x) {
      // Subtle warning effect from bottom when inflation escapes
      const baseY = 854;
      const burst = 6;

      for (let i = 0; i < burst; i++) {
        const w = k.rand(8, 18);
        const h = k.rand(40, 90);
        const dx = k.rand(-22, 22);
        const c = Math.random() < 0.5 ? k.rgb(255, 120, 80) : k.rgb(255, 220, 140);

        const p = k.add([
          k.rect(w, h, { radius: 4 }),
          k.pos(x + dx, baseY + 20),
          k.anchor('center'),
          k.color(c),
          k.opacity(0.28),
          k.z(140),
          { vy: k.rand(-220, -150), t: 0 },
        ]);

        p.onUpdate(() => {
          p.t += k.dt();
          p.pos.y += p.vy * k.dt();
          p.opacity = Math.max(0, 0.28 - p.t * 0.35);
          if (p.t > 0.8) k.destroy(p);
        });
      }
    }

    function btcFX(x) {
      // Positive effect when you "save/invest" in BTC by letting it pass
      const baseY = 854;
      const burst = 5;

      for (let i = 0; i < burst; i++) {
        const w = k.rand(8, 16);
        const h = k.rand(35, 80);
        const dx = k.rand(-20, 20);
        const c = Math.random() < 0.5 ? k.rgb(90, 220, 140) : k.rgb(120, 255, 190);

        const p = k.add([
          k.rect(w, h, { radius: 4 }),
          k.pos(x + dx, baseY + 20),
          k.anchor('center'),
          k.color(c),
          k.opacity(0.22),
          k.z(140),
          { vy: k.rand(-200, -130), t: 0 },
        ]);

        p.onUpdate(() => {
          p.t += k.dt();
          p.pos.y += p.vy * k.dt();
          p.opacity = Math.max(0, 0.22 - p.t * 0.30);
          if (p.t > 0.8) k.destroy(p);
        });
      }
    }

    function handleMiss(obj) {
      // Inflation misses are punished
      if (INFLATION_SPRITES.includes(obj.kind)) {
        addScore(-15);
        damageHeartThird();
        missFX(obj.pos.x);
        return;
      }

      // Bitcoin: reward for saving/investing (NOT cutting)
      if (obj.kind === 'bitcoin') {
        addScore(50);
        bitcoinCounter += 1;
        bitcoinStreak += 1;
        btcFX(obj.pos.x);

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
        playSFX('slice');
        k.destroy(obj);
        return;
      }

      // Bitcoin cut (bad)
      if (obj.kind === 'bitcoin') {
        // Cutting BTC is bad: costs points + FULL heart; 3 cuts = instant death
        addScore(-30);
        bitcoinStreak = 0;
        bitcoinCuts += 1;
        damageFullHeart();
        playSFX('btc-error');

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
        playSFX('powerup');
        k.destroy(obj);
        return;
      }

      if (obj.kind === 'bloque') {
        slowMotion = true;
        slowUntil = elapsed + 4;
        toast.show('TIME FREEZE (4s)', k.rgb(200, 220, 255));
        playSFX('powerup');
        k.destroy(obj);
        return;
      }

      if (obj.kind === 'ahorro') {
        addScore(100);
        explodeAhorro();
        toast.show('AHORRO: LIMPIEZA +100', k.rgb(140, 255, 190));
        playSFX('powerup');
        k.destroy(obj);
        return;
      }

      if (obj.kind === 'nodo') {
        // Super rare: grants +1 heart (up to 3) and resets current heart damage
        hearts = Math.min(3, hearts + 1);
        heartDamage = 0;
        toast.show('VIDA EXTRA +1', k.rgb(170, 220, 255));
        playSFX('powerup');
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
        toast.show('🔥 COMBO x2 +20', k.rgb(255, 200, 80));
        playSFX('combo');
      }
      else if (c === 3) {
        addScore(40);
        toast.show('🔥🔥 COMBO x3 +40', k.rgb(255, 180, 60));
        playSFX('combo');
      }
      else if (c >= 4) {
        addScore(80);
        toast.show('🔥🔥🔥 COMBO x4 +80', k.rgb(255, 160, 40));
        playSFX('combo');
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
          // Pointy slash: small rotated rectangles
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          const steps = Math.ceil(len / 6);
          
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const ix = ax + dx * t;
            const iy = ay + dy * t;

            k.add([
              k.rect(12, 3, { radius: 1 }),
              k.pos(ix, iy),
              k.anchor('center'),
              k.rotate(angle),
              k.color(0, 0, 0),
              k.opacity(0.5),
              k.z(150),
              k.lifespan(0.10, { fade: 0.05 }),
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
      if (paused) return; // Freeze everything when paused

      const dt = k.dt();
      elapsed += dt;
      eduTimer += dt;

      // Educational messages (more frequent + non-repeating)
      if (settings.eduMessages && eduTimer > 15) {
        eduTimer = 0;
        toast.show(nextEduTip(), k.rgb(255, 220, 140));
      }

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

