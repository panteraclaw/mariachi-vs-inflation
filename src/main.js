import kaplay from 'kaplay';

// Assets to preload
const ASSETS_TO_LOAD = ['/assets/menu-banner.jpg'];

// Preload images with native JavaScript
function preloadImages(urls) {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log(`✓ Asset loaded: ${url} (${img.width}x${img.height})`);
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

// Loading screen
const loadingText = document.getElementById('loading-screen');
if (loadingText) {
  loadingText.querySelector('#loading-text').textContent = 'Precargando imágenes...';
}

// Preload THEN initialize
preloadImages(ASSETS_TO_LOAD)
  .then((loadedAssets) => {
    console.log('✓ All assets preloaded:', loadedAssets);
    const textEl = document.getElementById('loading-text');
    if (textEl) textEl.textContent = '¡Listo! Iniciando juego...';
    
    setTimeout(() => {
      const screen = document.getElementById('loading-screen');
      if (screen) screen.remove();
      initGame(loadedAssets);
    }, 300);
  })
  .catch((err) => {
    console.error('❌ Error preloading assets:', err);
    const textEl = document.getElementById('loading-text');
    if (textEl) {
      textEl.textContent = 'Error cargando assets. Refresca la página.';
      textEl.style.color = '#ff6432';
    }
  });

function initGame(preloadedAssets) {
  console.log('🎮 Initializing KAPLAY...');
  
  const k = kaplay({
    width: 480,
    height: 854,
    background: [15, 40, 60],
    scale: Math.min(window.innerWidth / 480, window.innerHeight / 854),
    letterbox: true,
    crisp: true,
    touchToMouse: true,
    debug: false,
  });

  k.canvas.classList.add('loaded');

  // Load sprites
  console.log('📦 Loading sprites into KAPLAY...');
  k.loadSprite('menu-banner', '/assets/menu-banner.jpg');
  
  // CRITICAL: Wait for KAPLAY to finish loading sprites
  k.onLoad(() => {
    console.log('✓ KAPLAY finished loading all sprites');
    createScenes(k);
    k.go('menu');
    console.log('✓ Game started');
  });
}

function createScenes(k) {
  // ===== MENU SCENE =====
  k.scene('menu', () => {
    k.setGravity(0);
    console.log('📋 Menu scene started');

    // Background fallback
    k.add([
      k.rect(480, 854),
      k.color(15, 40, 60),
      k.pos(0, 0),
      k.z(-1),
    ]);

    // Banner sprite (GUARANTEED to be loaded now)
    const spriteData = k.getSprite('menu-banner');
    console.log('🖼️ Sprite data:', spriteData);

    if (spriteData && spriteData.width > 0) {
      const scaleX = 480 / spriteData.width;
      const scaleY = 854 / spriteData.height;
      const scale = Math.max(scaleX, scaleY);

      k.add([
        k.sprite('menu-banner'),
        k.pos(240, 427),
        k.anchor('center'),
        k.scale(scale),
        k.z(0),
      ]);
      
      console.log('✓ Banner displayed (scale:', scale, ')');
    } else {
      console.error('❌ Banner sprite STILL not ready after onLoad');
    }

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
