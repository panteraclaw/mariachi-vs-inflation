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

    const btn = k.add([
      k.rect(240, btnH, { radius: 12 }),
      k.pos(240, btnY),
      k.anchor('center'),
      k.color(255, 100, 50),
      k.area(),
      k.z(10),
      'btn',
    ]);

    // Mariachi - make him the PROTAGONIST and align him precisely above the button
    if (mariachiData) {
      // Make him bigger
      const mariachiScale = Math.min(
        (480 * 0.82) / mariachiData.width, // ~82% of screen width
        480 / mariachiData.height          // cap height around 480px
      );

      // We want the bottom edge of the sprite to be 2px above the button top
      const desiredBottomY = btnTopY - 2;
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

    k.add([
      k.text('JUGAR', { size: 32 }),
      k.pos(240, 770),
      k.anchor('center'),
      k.color(255, 255, 255),
      k.z(10),
    ]);

    btn.onClick(() => k.go('game'));
    btn.onHover(() => {
      btn.color = k.rgb(255, 120, 70);
      k.setCursor('pointer');
    });
    btn.onHoverEnd(() => {
      btn.color = k.rgb(255, 100, 50);
      k.setCursor('default');
    });
  });

  // ===== GAME SCENE =====
  k.scene('game', () => {
    k.setGravity(400);

    k.add([
      k.rect(480, 854),
      k.color(15, 40, 60),
      k.pos(0, 0),
    ]);

    k.add([
      k.text('GAMEPLAY AQUÍ\n\n(Click para volver)', {
        size: 24,
        align: 'center',
        width: 400,
      }),
      k.pos(240, 427),
      k.anchor('center'),
      k.color(255, 255, 255),
    ]);

    k.onClick(() => k.go('menu'));
  });
}
