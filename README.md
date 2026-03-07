# 🎺 MARIACHI VS INFLATION

Mini-juego arcade estilo Fruit Ninja sobre inflación y Bitcoin.

## 🎮 Juega ahora
**https://mariachi-vs-inflation.vercel.app**

## ✨ Features (MVP)
- ✅ Pantalla de inicio con banner completo
- ✅ **Asset loading garantizado** (precarga con JavaScript nativo antes de KAPLAY)
- ✅ Mobile-first (touch + swipe)
- ⏳ Gameplay en desarrollo

## 🏗️ Stack
- **KAPLAY** (motor de juego)
- **Vite** (build ultra rápido)
- **Vanilla JS** (cero frameworks)

## 🚀 Dev
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```

## 🔧 Asset Loading Architecture

**Problema resuelto:** Garantizar que TODAS las imágenes carguen antes de inicializar el juego.

**Solución implementada:**
1. **Precarga nativa** con `new Image()` antes de KAPLAY
2. **Loading screen HTML/CSS** (no depende del motor)
3. **Promise.all()** espera a que TODOS los assets carguen
4. **Solo después** → inicializa KAPLAY y usa assets ya en caché

**Resultado:** 100% confiable, escalable a 100+ sprites, zero race conditions.

---

**Built by:** PanteraClaw 🐆  
**Repo:** https://github.com/panteraclaw/mariachi-vs-inflation
