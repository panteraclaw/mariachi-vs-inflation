// i18n translations for Mariachi vs Inflation
export const i18n = {
  es: {
    // Menu
    menu_play: 'JUGAR',
    menu_continue: 'CONTINUAR',
    menu_new_game: 'NUEVO JUEGO',
    menu_tutorial: 'APRENDE A JUGAR',
    menu_learn_btc: 'Aprende BTC',
    
    // Tutorial pages
    tutorial_page_indicator: (current, total) => `${current}/${total}`,
    tutorial_next: 'SIGUIENTE',
    tutorial_back: 'VOLVER',
    tutorial_menu: 'MENÚ',
    
    tutorial_0_title: 'CÓMO JUGAR',
    tutorial_0_line1: 'Desliza tu dedo (móvil) o mouse (PC)',
    tutorial_0_line2: 'a través de los objetos para cortarlos',
    tutorial_0_line3: '¡Practica el movimiento de corte!',
    tutorial_0_label_swipe: 'Cortar →',
    
    tutorial_1_title: 'OBJETIVO',
    tutorial_1_line1: 'Corta la INFLACIÓN para ahorrar pesos',
    tutorial_1_line2: 'GUARDA / INVIERTE en BITCOIN (no lo cortes)',
    tutorial_1_line3: 'Sobrevive y haz el mayor score posible',
    tutorial_1_label_inflation: 'Inflación',
    tutorial_1_label_bitcoin: 'Bitcoin',
    
    tutorial_2_title: 'INFLACIÓN (NEGATIVOS)',
    tutorial_2_line1: 'CORTA: +10 pts',
    tutorial_2_line2: 'SI SE ESCAPA: -15 pts + 1/3 de vida',
    tutorial_2_line3: 'COMBO: corta 2+ en un solo tajo',
    tutorial_2_line4: '  → x2 +20 | x3 +40 | x4 +80 🔥',
    tutorial_2_label_tortillas: 'Tortillas',
    tutorial_2_label_renta: 'Renta',
    tutorial_2_label_gasolina: 'Gasolina',
    tutorial_2_label_canasta: 'Canasta',
    tutorial_2_label_aguacate: 'Aguacate',
    
    tutorial_3_title: 'BITCOIN (AHORRA / INVIERTE)',
    tutorial_3_line1: '✅ Si lo dejas pasar: +50 pts (ahorraste en BTC)',
    tutorial_3_line2: '❌ Si lo cortas: pierdes 1 VIDA COMPLETA',
    tutorial_3_line3: '3 cortes de BTC = Game Over (PAPER HANDS)',
    tutorial_3_label_bitcoin: 'Bitcoin',
    
    tutorial_4_title: 'POWERUPS',
    tutorial_4_line1: 'Corta estos para activarlos:',
    tutorial_4_line2: '⚡ Lightning: x2 puntos (3s)',
    tutorial_4_line3: '🟧 Bloque: congela inflación (4s)',
    tutorial_4_line4: '🌱 Ahorro: +100 + limpia pantalla',
    tutorial_4_line5: '🔷 Nodo: +1 vida (máx 3)',
    tutorial_4_label_x2: 'x2',
    tutorial_4_label_freeze: 'Freeze',
    tutorial_4_label_plus100: '+100',
    tutorial_4_label_life: '+Vida',
    
    tutorial_5_title: 'VIDAS + TIPS',
    tutorial_5_line1: 'Tienes 3 vidas: ❤❤❤',
    tutorial_5_line2: '• Inflación escapada: -1/3 de vida',
    tutorial_5_line3: '• Cortar Bitcoin: -1 vida completa',
    tutorial_5_line4: '0 vidas = Game Over',
    tutorial_5_line5: '',
    tutorial_5_line6: '💡 Mensajes educativos: aparecen cada 15s',
    tutorial_5_line7: '(puedes apagarlos en ⚙ Configuración)',
    
    // Learn BTC
    learn_btc_title: 'APRENDE BTC',
    learn_btc_subtitle: 'Arca tecnológica para el cambio monetario',
    
    learn_1_title: '1) El sistema monetario está cambiando',
    learn_1_body: 'El dinero como lo conocemos está en transición.\n\nEl dólar pierde respaldo. La geopolítica se fractura. Los modelos económicos que funcionaron décadas ya no sostienen.\n\nEsto no es teoría. Es lo que vivimos.',
    
    learn_2_title: '2) Por qué necesitamos alternativa',
    learn_2_body: 'El dinero tradicional depende de promesas. Bancos, gobiernos, intermediarios que pueden fallar.\n\nCuando el sistema se agota, ¿dónde va tu trabajo? ¿Dónde guardas décadas de esfuerzo?\n\nLa pregunta ya no es "si" cambia, sino "cómo nos preparamos".',
    
    learn_3_title: '3) Bitcoin como arca tecnológica',
    learn_3_body: 'Bitcoin ES DINERO. No inversión, no token atado al dólar.\n\nEs protección matemática ante la crisis. Funciona sin promesas, solo con código abierto verificable.\n\nNadie lo controla. Todos lo verificamos. Es infraestructura para el cambio monetario que ya comenzó.\n\nNo es especulación. Es preparación.',
    
    learn_4_title: '4) Cómo funciona (red abierta)',
    learn_4_body: 'Miles de nodos verifican transacciones. Nadie da órdenes. Las reglas son código.\n\nNo pides permiso para usar Bitcoin. No depende de un gobierno o corporación.\n\nEs coordinación ciudadana global. Construida por todos, para todos.',
    
    learn_5_title: '5) Invitación a sumarse',
    learn_5_body: 'El arca está abierta. No es tarde. No necesitas ser experto.\n\nEntender esto es el primer paso. Usarlo es el segundo. Enseñarlo es el tercero.\n\nPreparémonos juntos para el cambio que ya comenzó.',
    
    // Game UI
    game_score: 'Score',
    game_btc: 'BTC',
    game_resistance: 'Resistencia',
    game_pause: 'PAUSA',
    game_pause_continue: 'CONTINUAR',
    game_pause_quit: 'ABANDONAR',
    
    // Settings
    settings_title: 'CONFIGURACIÓN',
    settings_volume: 'Volumen SFX',
    settings_edu_messages: 'Mensajes educativos',
    settings_back: 'VOLVER',
    settings_mute: 'Mute',
    settings_toggle: 'Toggle',
    
    // Toasts/Messages
    toast_combo_x2: '🔥 COMBO x2 +20',
    toast_combo_x3: '🔥🔥 COMBO x3 +40',
    toast_combo_x4: '🔥🔥🔥 COMBO x4 +80',
    toast_double_points: 'DOBLE PUNTOS x2 (3s)',
    toast_time_freeze: 'TIME FREEZE (4s)',
    toast_ahorro: 'AHORRO: LIMPIEZA +100',
    toast_extra_life: 'VIDA EXTRA +1',
    toast_paper_hands: 'PAPER HANDS! ☠',
    toast_btc_cut: 'Vendiste tu Bitcoin! (-vida)',
    toast_hodl_x3: 'HODL! x3',
    toast_hodl_x5: 'HODL! x5',
    toast_hodl_x10: 'HODL! x10',
    
    // Gameover
    gameover_title: 'GAME OVER',
    gameover_saved: (amount) => `Ahorraste $${amount} pesos cortando la inflación`,
    gameover_btc_saved: 'BTC guardados',
    gameover_save_prompt: 'Guarda tu puntuación:',
    gameover_input_placeholder: 'Toca para escribir...',
    gameover_input_hint: '⌨ Escribe tu nombre',
    gameover_saved_status: '✓ Guardado!',
    gameover_error: 'Error',
    gameover_play_again: 'JUGAR OTRA VEZ',
    gameover_share: 'COMPARTIR PUNTUACIÓN',
    gameover_leaderboard: 'LEADERBOARD',
    gameover_learn_inflation: 'APRENDE SOBRE INFLACIÓN',
    gameover_buy_btc: 'COMPRA BITCOIN',
    gameover_menu: 'MENÚ',
    
    // Share text
    share_text: (score, btc, url) => `Ahorré $${score} pesos cortando la inflación. BTC guardados: ${btc}. ¿Cuánto podrás ahorrar? ${url}`,
    
    // Leaderboard
    leaderboard_title: 'TOP AHORRADORES',
    leaderboard_rank: 'Rank',
    leaderboard_name: 'Nombre',
    leaderboard_score: 'Score',
    leaderboard_btc: 'BTC',
    leaderboard_back: 'VOLVER',
    leaderboard_your_score: 'Tu score',
    leaderboard_name_prompt: 'Ingresa tu nombre',
    leaderboard_name_hint: '(Ingresa tu nombre y presiona Enter)',
    leaderboard_loading: 'Cargando...',
    leaderboard_error: 'Error al cargar',
  },
  
  en: {
    // Menu
    menu_play: 'PLAY',
    menu_continue: 'CONTINUE',
    menu_new_game: 'NEW GAME',
    menu_tutorial: 'HOW TO PLAY',
    menu_learn_btc: 'Learn BTC',
    
    // Tutorial pages
    tutorial_page_indicator: (current, total) => `${current}/${total}`,
    tutorial_next: 'NEXT',
    tutorial_back: 'BACK',
    tutorial_menu: 'MENU',
    
    tutorial_0_title: 'HOW TO PLAY',
    tutorial_0_line1: 'Swipe your finger (mobile) or mouse (PC)',
    tutorial_0_line2: 'through objects to slice them',
    tutorial_0_line3: 'Practice the slicing motion!',
    tutorial_0_label_swipe: 'Slice →',
    
    tutorial_1_title: 'OBJECTIVE',
    tutorial_1_line1: 'Slash INFLATION to save pesos',
    tutorial_1_line2: 'SAVE / INVEST in BITCOIN (don\'t cut it)',
    tutorial_1_line3: 'Survive and get the highest score',
    tutorial_1_label_inflation: 'Inflation',
    tutorial_1_label_bitcoin: 'Bitcoin',
    
    tutorial_2_title: 'INFLATION (ENEMIES)',
    tutorial_2_line1: 'CUT: +10 pts',
    tutorial_2_line2: 'IF IT ESCAPES: -15 pts + 1/3 life',
    tutorial_2_line3: 'COMBO: cut 2+ in one swipe',
    tutorial_2_line4: '  → x2 +20 | x3 +40 | x4 +80 🔥',
    tutorial_2_label_tortillas: 'Tortillas',
    tutorial_2_label_renta: 'Rent',
    tutorial_2_label_gasolina: 'Gas',
    tutorial_2_label_canasta: 'Groceries',
    tutorial_2_label_aguacate: 'Avocado',
    
    tutorial_3_title: 'BITCOIN (SAVE / INVEST)',
    tutorial_3_line1: '✅ Let it pass: +50 pts (you saved in BTC)',
    tutorial_3_line2: '❌ Cut it: lose 1 FULL LIFE',
    tutorial_3_line3: '3 BTC cuts = Game Over (PAPER HANDS)',
    tutorial_3_label_bitcoin: 'Bitcoin',
    
    tutorial_4_title: 'POWERUPS',
    tutorial_4_line1: 'Cut these to activate:',
    tutorial_4_line2: '⚡ Lightning: x2 points (3s)',
    tutorial_4_line3: '🟧 Block: freeze inflation (4s)',
    tutorial_4_line4: '🌱 Savings: +100 + clear screen',
    tutorial_4_line5: '🔷 Node: +1 life (max 3)',
    tutorial_4_label_x2: 'x2',
    tutorial_4_label_freeze: 'Freeze',
    tutorial_4_label_plus100: '+100',
    tutorial_4_label_life: '+Life',
    
    tutorial_5_title: 'LIVES + TIPS',
    tutorial_5_line1: 'You have 3 lives: ❤❤❤',
    tutorial_5_line2: '• Escaped inflation: -1/3 life',
    tutorial_5_line3: '• Cut Bitcoin: -1 full life',
    tutorial_5_line4: '0 lives = Game Over',
    tutorial_5_line5: '',
    tutorial_5_line6: '💡 Educational tips: appear every 15s',
    tutorial_5_line7: '(toggle in ⚙ Settings)',
    
    // Learn BTC
    learn_btc_title: 'LEARN BTC',
    learn_btc_subtitle: 'Technological ark for monetary transition',
    
    learn_1_title: '1) The monetary system is changing',
    learn_1_body: 'Money as we know it is in transition.\n\nThe dollar loses backing. Geopolitics fractures. Economic models that worked for decades no longer hold.\n\nThis is not theory. This is what we live.',
    
    learn_2_title: '2) Why we need an alternative',
    learn_2_body: 'Traditional money depends on promises. Banks, governments, intermediaries that can fail.\n\nWhen the system exhausts, where does your work go? Where do you keep decades of effort?\n\nThe question is no longer "if" it changes, but "how we prepare".',
    
    learn_3_title: '3) Bitcoin as technological ark',
    learn_3_body: 'Bitcoin IS MONEY. Not investment, not a token tied to the dollar.\n\nIt is mathematical protection against the crisis. It works without promises, only with verifiable open code.\n\nNo one controls it. We all verify it. It is infrastructure for the monetary change that already began.\n\nNot speculation. Preparation.',
    
    learn_4_title: '4) How it works (open network)',
    learn_4_body: 'Thousands of nodes verify transactions. No one gives orders. The rules are code.\n\nYou don\'t ask permission to use Bitcoin. It doesn\'t depend on a government or corporation.\n\nIt is global citizen coordination. Built by all, for all.',
    
    learn_5_title: '5) Invitation to join',
    learn_5_body: 'The ark is open. It is not late. You don\'t need to be an expert.\n\nUnderstanding this is the first step. Using it is the second. Teaching it is the third.\n\nLet us prepare together for the change that already began.',
    
    // Game UI
    game_score: 'Score',
    game_btc: 'BTC',
    game_resistance: 'Resistance',
    game_pause: 'PAUSE',
    game_pause_continue: 'CONTINUE',
    game_pause_quit: 'QUIT',
    
    // Settings
    settings_title: 'SETTINGS',
    settings_volume: 'SFX Volume',
    settings_edu_messages: 'Educational messages',
    settings_back: 'BACK',
    settings_mute: 'Mute',
    settings_toggle: 'Toggle',
    
    // Toasts/Messages
    toast_combo_x2: '🔥 COMBO x2 +20',
    toast_combo_x3: '🔥🔥 COMBO x3 +40',
    toast_combo_x4: '🔥🔥🔥 COMBO x4 +80',
    toast_double_points: 'DOUBLE POINTS x2 (3s)',
    toast_time_freeze: 'TIME FREEZE (4s)',
    toast_ahorro: 'SAVINGS: CLEAR +100',
    toast_extra_life: 'EXTRA LIFE +1',
    toast_paper_hands: 'PAPER HANDS! ☠',
    toast_btc_cut: 'You sold your Bitcoin! (-life)',
    toast_hodl_x3: 'HODL! x3',
    toast_hodl_x5: 'HODL! x5',
    toast_hodl_x10: 'HODL! x10',
    
    // Gameover
    gameover_title: 'GAME OVER',
    gameover_saved: (amount) => `You saved $${amount} pesos cutting inflation`,
    gameover_btc_saved: 'BTC saved',
    gameover_save_prompt: 'Save your score:',
    gameover_input_placeholder: 'Tap to type...',
    gameover_input_hint: '⌨ Type your name',
    gameover_saved_status: '✓ Saved!',
    gameover_error: 'Error',
    gameover_play_again: 'PLAY AGAIN',
    gameover_share: 'SHARE SCORE',
    gameover_leaderboard: 'LEADERBOARD',
    gameover_learn_inflation: 'LEARN ABOUT INFLATION',
    gameover_buy_btc: 'BUY BITCOIN',
    gameover_menu: 'MENU',
    
    // Share text
    share_text: (score, btc, url) => `I saved $${score} pesos cutting inflation. BTC saved: ${btc}. How much can you save? ${url}`,
    
    // Leaderboard
    leaderboard_title: 'TOP SAVERS',
    leaderboard_rank: 'Rank',
    leaderboard_name: 'Name',
    leaderboard_score: 'Score',
    leaderboard_btc: 'BTC',
    leaderboard_back: 'BACK',
    leaderboard_your_score: 'Your score',
    leaderboard_name_prompt: 'Enter your name',
    leaderboard_name_hint: '(Enter your name and press Enter)',
    leaderboard_loading: 'Loading...',
    leaderboard_error: 'Error loading',
  }
};

// Educational tips in both languages
export const eduTips = {
  es: [
    // Consciencia del cambio (15)
    'El dinero está cambiando',
    'El sistema se transforma',
    'Hay alternativa viable',
    'Podemos elegir otro camino',
    'El viejo modelo se agota',
    'Bitcoin existe para esto',
    'La transición ya empezó',
    'No estamos atrapados',
    'Existe otra forma',
    'El cambio es técnico',
    'La red ya funciona',
    'Miles ya eligieron',
    'Esto ya es real',
    'El futuro ya existe',
    'Podemos prepararnos',
    
    // Empoderamiento/Acción (15)
    'Tu valor puede migrar',
    'Protege lo que construiste',
    'El esfuerzo merece refugio',
    'Hay dónde guardar valor',
    'Entender esto libera',
    'La red está abierta',
    'Nadie queda fuera',
    'Todos podemos aprender',
    'El acceso es posible',
    'Tu trabajo puede preservarse',
    'Elige cómo guardar',
    'La opción existe',
    'Podemos construir juntos',
    'Esto nos incluye',
    'Sumarse es válido',
    
    // Cualidad de Bitcoin (10)
    'Oferta limitada por diseño',
    'No se imprime más',
    'Reglas iguales para todos',
    'Sin permiso para usarse',
    'La red verifica todo',
    'Matemática, no promesas',
    'Código abierto, auditable',
    'Nadie lo controla solo',
    'Funciona sin intermediarios',
    'Escasez real, verificable',
    
    // Comunidad/Red (10)
    'Miles de nodos validan',
    'Crece sin pedir permiso',
    'Cada uno elige sumarse',
    'Juntos sostenemos la red',
    'La confianza es distribuida',
    'No depende de uno',
    'Todos verifican, nadie manda',
    'Red global, sin fronteras',
    'Coordinación sin jefes',
    'Somos la infraestructura',
  ],
  en: [
    // Awareness of change (15)
    'Money is changing form',
    'The system is transforming',
    'There is a viable alternative',
    'We can choose another path',
    'The old model is exhausted',
    'Bitcoin exists for this',
    'The transition already started',
    'We are not trapped',
    'Another way exists',
    'The change is technical',
    'The network already works',
    'Thousands already chose',
    'This is already real',
    'The future already exists',
    'We can prepare',
    
    // Empowerment/Action (15)
    'Your value can migrate',
    'Protect what you built',
    'Effort deserves shelter',
    'There is where to store value',
    'Understanding this liberates',
    'The network is open',
    'No one is left out',
    'We can all learn',
    'Access is possible',
    'Your work can be preserved',
    'Choose how to save',
    'The option exists',
    'We can build together',
    'This includes us',
    'Joining is valid',
    
    // Bitcoin qualities (10)
    'Supply limited by design',
    'No more can be printed',
    'Same rules for everyone',
    'Permission-less to use',
    'The network verifies everything',
    'Mathematics, not promises',
    'Open source, auditable',
    'No one controls it alone',
    'Works without intermediaries',
    'Real scarcity, verifiable',
    
    // Community/Network (10)
    'Thousands of nodes validate',
    'Grows without asking permission',
    'Each one chooses to join',
    'Together we sustain the network',
    'Trust is distributed',
    'Does not depend on one',
    'All verify, none command',
    'Global network, no borders',
    'Coordination without bosses',
    'We are the infrastructure',
  ]
};
