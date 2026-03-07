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
const loadingText = document.getElementById('loading-text');
loadingText.textContent = 'Precargando imágenes...';

// Preload THEN initialize
preloadImages(ASSETS_TO_LOAD)
  .then((loadedAssets) => {
    console.log('✓ All assets preloaded:', loadedAssets);
    loadingText.textContent = '¡Listo! Iniciando juego...';
    
    // Wait for assets to be fully in cache
    setTimeout(() => {
      document.getElementById('loading-screen').remove();
      initGame(loadedAssets);
    }, 300);
  })
  .catch((err) => {
    console.error('❌ Error preloading assets:', err);
    loadingText.textContent = 'Error cargando assets. Refresca la página.';
    loadingText.style.color = '#ff6432';
  });

function initGame(preloadedAssets) {
  console.log('🎮 Initializing game...');
  
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

  // Load sprites (already in cache)
  k.loadSprite('menu-banner', '/assets/menu-banner.jpg');
  
  // Wait a tiny bit for KAPLAY to register sprites
  setTimeout(() => {
    console.log('🎨 Creating scenes...');
    createScenes(k);
    k.go('menu');
    console.log('✓ Game started');
  }, 100);
}

function createScenes(k) {
  // ===== MENU SCENE =====
  k.scene('menu', () => {
    k.setGravity(0);
    console.log('📋 Menu scene loaded');

    // Background fallback
    k.add([
      k.rect(480, 854),
      k.color(15, 40, 60),
      k.pos(0, 0),
      k.z(-1),
    ]);

    // Try to load banner sprite
    const spriteData = k.getSprite('menu-banner');
    console.log('🖼️ Sprite data:', spriteData ? `${spriteData.width}x${spriteData.height}` : 'NOT FOUND');

    if (spriteData && spriteData.width > 0) {
      const scaleX = 480 / spriteData.width;
      const scaleY = 854 / spriteData.height;
      const scale = Math.max(scaleX, scaleY);

      const banner = k.add([
        k.sprite('menu-banner'),
        k.pos(240, 427),
        k.anchor('center'),
        k.scale(scale),
        k.z(0),
      ]);
      
      console.log('✓ Banner displayed at scale:', scale);
    } else {
      console.warn('⚠️ Banner sprite not ready');
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

    btn.onClick(() => {
      console.log('🎮 Going to game scene');
      k.go('game');
    });
    
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

  // ===== GAME SCENE (placeholder) =====
  k.scene('game', () => {
    k.setGravity(400);
    console.log('🎮 Game scene loaded');

    k.add([
      k.rect(480, 854),
      k.color(15, 40, 60),
      k.pos(0, 0),
    ]);

    k.add([
      k.text('GAMEPLAY AQUÍ\n\n(Click para volver al menú)', {
        size: 24,
        align: 'center',
        width: 400,
      }),
      k.pos(240, 427),
      k.anchor('center'),
      k.color(255, 255, 255),
    ]);

    k.onClick(() => {
      console.log('🔙 Going back to menu');
      k.go('menu');
    });
  });
}
