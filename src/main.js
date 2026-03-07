import kaplay from 'kaplay';

// Assets to preload
const ASSETS_TO_LOAD = [
  '/assets/menu-banner.jpg'
];

// Preload images with native JavaScript (guarantees they load)
function preloadImages(urls) {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log(`✓ Asset loaded: ${url}`);
          resolve({ url, width: img.width, height: img.height });
        };
        img.onerror = () => {
          console.error(`✗ Failed to load: ${url}`);
          reject(new Error(`Failed to load ${url}`));
        };
        img.src = url;
      });
    })
  );
}

// Update loading text
const loadingText = document.getElementById('loading-text');
loadingText.textContent = 'Precargando imágenes...';

// Preload ALL assets BEFORE initializing game
preloadImages(ASSETS_TO_LOAD)
  .then((loadedAssets) => {
    console.log('✓ All assets preloaded successfully:', loadedAssets);
    loadingText.textContent = '¡Listo! Iniciando juego...';
    
    // Wait 500ms to ensure images are in cache
    setTimeout(() => {
      document.getElementById('loading-screen').remove();
      initGame();
    }, 500);
  })
  .catch((err) => {
    console.error('Error preloading assets:', err);
    loadingText.textContent = 'Error cargando assets. Refresca la página.';
    loadingText.style.color = '#ff6432';
  });

function initGame() {
  // Initialize KAPLAY
  const k = kaplay({
    width: 480,
    height: 854,
    background: [15, 40, 60],
    scale: Math.min(
      window.innerWidth / 480,
      window.innerHeight / 854
    ),
    letterbox: true,
    crisp: true,
    touchToMouse: true,
    debug: false,
  });

  // Show canvas
  k.canvas.classList.add('loaded');

  // Load sprites (images are already in browser cache)
  k.loadSprite('menu-banner', '/assets/menu-banner.jpg');

  // MENU SCENE
  k.scene('menu', () => {
    k.setGravity(0);

    // Background fallback
    k.add([
      k.rect(480, 854),
      k.color(15, 40, 60),
      k.pos(0, 0),
      k.z(-1),
    ]);

    // Menu banner (full screen)
    const banner = k.add([
      k.sprite('menu-banner'),
      k.pos(240, 427),
      k.anchor('center'),
      k.z(0),
    ]);

    // Scale to cover screen
    const scaleX = 480 / banner.width;
    const scaleY = 854 / banner.height;
    banner.scale = Math.max(scaleX, scaleY);

    console.log('✓ Banner displayed:', banner.width, 'x', banner.height, 'scale:', banner.scale);

    // JUGAR button
    const btn = k.add([
      k.rect(240, 70, { radius: 12 }),
      k.pos(240, 754),
      k.anchor('center'),
      k.color(255, 100, 50),
      k.area(),
      k.z(10),
      'btn',
    ]);

    k.add([
      k.text('JUGAR', { size: 32 }),
      k.pos(240, 754),
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

    k.onClick(() => k.go('game'));
  });

  // GAME SCENE (placeholder for now)
  k.scene('game', () => {
    k.setGravity(400);

    k.add([
      k.rect(480, 854),
      k.color(15, 40, 60),
      k.pos(0, 0),
    ]);

    k.add([
      k.text('GAMEPLAY\n(click para volver)', { size: 24, align: 'center' }),
      k.pos(240, 427),
      k.anchor('center'),
      k.color(255, 255, 255),
    ]);

    k.onClick(() => k.go('menu'));
  });

  // Start game
  k.go('menu');
}
