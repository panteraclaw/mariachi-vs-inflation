import kaplay from 'kaplay';

// Assets to preload
const ASSETS_TO_LOAD = ['/assets/menu-banner.jpg'];

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

// Simple loading (no flash)
const loadingScreen = document.getElementById('loading-screen');

preloadImages(ASSETS_TO_LOAD)
  .then((loadedAssets) => {
    // Remove loading screen instantly
    if (loadingScreen) loadingScreen.remove();
    initGame(loadedAssets);
  })
  .catch((err) => {
    console.error('Error loading assets:', err);
    const textEl = document.getElementById('loading-text');
    if (textEl) {
      textEl.textContent = 'Error. Refresca la página.';
      textEl.style.color = '#ff6432';
    }
  });

function initGame(preloadedAssets) {
  // Get real image dimensions from preload
  const bannerDimensions = preloadedAssets.find(a => a.url.includes('menu-banner'));
  
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
  k.loadSprite('menu-banner', '/assets/menu-banner.jpg');
  
  k.onLoad(() => {
    createScenes(k, bannerDimensions);
    k.go('menu');
  });
}

function createScenes(k, bannerDimensions) {
  // ===== MENU SCENE =====
  k.scene('menu', () => {
    k.setGravity(0);

    // Background
    k.add([
      k.rect(480, 854),
      k.color(15, 40, 60),
      k.pos(0, 0),
      k.z(-1),
    ]);

    // Banner with REAL dimensions
    if (bannerDimensions) {
      const realWidth = bannerDimensions.width;
      const realHeight = bannerDimensions.height;
      
      const scaleX = 480 / realWidth;
      const scaleY = 854 / realHeight;
      const scale = Math.max(scaleX, scaleY);

      k.add([
        k.sprite('menu-banner'),
        k.pos(240, 427),
        k.anchor('center'),
        k.scale(scale),
        k.z(0),
      ]);
      
      console.log(`✓ Banner: ${realWidth}x${realHeight}, scale: ${scale}`);
    }

    // JUGAR button (at bottom, inside banner area)
    const btn = k.add([
      k.rect(240, 70, { radius: 12 }),
      k.pos(240, 770), // Moved up to be inside banner
      k.anchor('center'),
      k.color(255, 100, 50),
      k.area(),
      k.z(10),
      'btn',
    ]);

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
