// Script to replace hardcoded strings with t() calls
import { readFileSync, writeFileSync } from 'fs';

const filePath = './src/main.js';
let content = readFileSync(filePath, 'utf8');

// Replacements map: [searchString, replacementString]
const replacements = [
  // Menu
  ["k.text('JUGAR', { size: 34 })", "k.text(t('menu_play'), { size: 34 })"],
  ["k.text('APRENDE A JUGAR', { size: 18 })", "k.text(t('menu_tutorial'), { size: 18 })"],
  ["k.text('Aprende BTC', { size: 14 })", "k.text(t('menu_learn_btc'), { size: 14 })"],
  
  // Tutorial
  ["'OBJETIVO'", "t('tutorial_1_title')"],
  ["'Corta la INFLACIÓN para ahorrar pesos'", "t('tutorial_1_line1')"],
  ["'GUARDA / INVIERTE en BITCOIN (no lo cortes)'", "t('tutorial_1_line2')"],
  ["'Sobrevive y haz el mayor score posible'", "t('tutorial_1_line3')"],
  
  ["'INFLACIÓN (NEGATIVOS)'", "t('tutorial_2_title')"],
  ["'CORTA: +10 pts'", "t('tutorial_2_line1')"],
  ["'SI SE ESCAPA: -15 pts + 1/3 de vida'", "t('tutorial_2_line2')"],
  ["'COMBO: corta 2+ en un solo tajo'", "t('tutorial_2_line3')"],
  ["'  → x2 +20 | x3 +40 | x4 +80 🔥'", "t('tutorial_2_line4')"],
  
  ["'BITCOIN (AHORRA / INVIERTE)'", "t('tutorial_3_title')"],
  ["'✅ Si lo dejas pasar: +50 pts (ahorraste en BTC)'", "t('tutorial_3_line1')"],
  ["'❌ Si lo cortas: pierdes 1 VIDA COMPLETA'", "t('tutorial_3_line2')"],
  ["'3 cortes de BTC = Game Over (PAPER HANDS)'", "t('tutorial_3_line3')"],
  
  ["'POWERUPS'", "t('tutorial_4_title')"],
  ["'Corta estos para activarlos:'", "t('tutorial_4_line1')"],
  ["'⚡ Lightning: x2 puntos (3s)'", "t('tutorial_4_line2')"],
  ["'🟧 Bloque: congela inflación (4s)'", "t('tutorial_4_line3')"],
  ["'🌱 Ahorro: +100 + limpia pantalla'", "t('tutorial_4_line4')"],
  ["'🔷 Nodo: +1 vida (máx 3)'", "t('tutorial_4_line5')"],
  
  ["'VIDAS + TIPS'", "t('tutorial_5_title')"],
  ["'Tienes 3 vidas: ❤❤❤'", "t('tutorial_5_line1')"],
  ["'• Inflación escapada: -1/3 de vida'", "t('tutorial_5_line2')"],
  ["'• Cortar Bitcoin: -1 vida completa'", "t('tutorial_5_line3')"],
  ["'0 vidas = Game Over'", "t('tutorial_5_line4')"],
  ["'💡 Mensajes educativos: aparecen cada 15s'", "t('tutorial_5_line6')"],
  ["'(puedes apagarlos en ⚙ Configuración)'", "t('tutorial_5_line7')"],
  
  ["'SIGUIENTE'", "t('tutorial_next')"],
  ["'VOLVER'", "t('tutorial_back')"],
  
  // Learn BTC
  ["'APRENDE BTC'", "t('learn_btc_title')"],
  ["'Por qué Bitcoin protege tu ahorro (simple y directo)'", "t('learn_btc_subtitle')"],
  
  // Game UI
  ["`Score: ${score}`", "`${t('game_score')}: ${score}`"],
  ["`BTC: ${bitcoinCounter}`", "`${t('game_btc')}: ${bitcoinCounter}`"],
  ["`Resistencia: ${meter}`", "`${t('game_resistance')}: ${meter}`"],
  ["'PAUSA'", "t('game_pause')"],
  ["'CONTINUAR'", "t('game_pause_continue')"],
  ["'ABANDONAR'", "t('game_pause_quit')"],
  
  // Settings
  ["'CONFIGURACIÓN'", "t('settings_title')"],
  ["`Volumen SFX: ${Math.round(settings.sfxVolume * 100)}%`", "`${t('settings_volume')}: ${Math.round(settings.sfxVolume * 100)}%`"],
  ["`Mensajes educativos: ${settings.eduMessages ? 'ON' : 'OFF'}`", "`${t('settings_edu_messages')}: ${settings.eduMessages ? 'ON' : 'OFF'}`"],
  ["'Mute'", "t('settings_mute')"],
  ["'Toggle'", "t('settings_toggle')"],
  
  // Toasts
  ["'🔥 COMBO x2 +20'", "t('toast_combo_x2')"],
  ["'🔥🔥 COMBO x3 +40'", "t('toast_combo_x3')"],
  ["'🔥🔥🔥 COMBO x4 +80'", "t('toast_combo_x4')"],
  ["'DOBLE PUNTOS x2 (3s)'", "t('toast_double_points')"],
  ["'TIME FREEZE (4s)'", "t('toast_time_freeze')"],
  ["'AHORRO: LIMPIEZA +100'", "t('toast_ahorro')"],
  ["'VIDA EXTRA +1'", "t('toast_extra_life')"],
  ["'PAPER HANDS! ☠'", "t('toast_paper_hands')"],
  ["'Vendiste tu Bitcoin! (-vida)'", "t('toast_btc_cut')"],
  ["'HODL! x3'", "t('toast_hodl_x3')"],
  ["'HODL! x5'", "t('toast_hodl_x5')"],
  ["'HODL! x10'", "t('toast_hodl_x10')"],
  
  // Gameover
  ["'GAME OVER'", "t('gameover_title')"],
  ["`Ahorraste $${score} pesos cortando la inflación`", "t('gameover_saved')(score)"],
  ["'BTC guardados'", "t('gameover_btc_saved')"],
  ["'Toca para escribir...'", "t('gameover_input_placeholder')"],
  ["'⌨ Escribe tu nombre'", "t('gameover_input_hint')"],
  ["'✓ Guardado!'", "t('gameover_saved_status')"],
  ["'Error'", "t('gameover_error')"],
  ["'JUGAR OTRA VEZ'", "t('gameover_play_again')"],
  ["'COMPARTIR PUNTUACIÓN'", "t('gameover_share')"],
  ["'LEADERBOARD'", "t('gameover_leaderboard')"],
  ["'APRENDE SOBRE INFLACIÓN'", "t('gameover_learn_inflation')"],
  ["'COMPRA BITCOIN'", "t('gameover_buy_btc')"],
  ["'MENÚ'", "t('gameover_menu')"],
];

// Apply replacements
for (const [search, replace] of replacements) {
  content = content.split(search).join(replace);
}

writeFileSync(filePath, content, 'utf8');
console.log('✅ Translations applied!');
