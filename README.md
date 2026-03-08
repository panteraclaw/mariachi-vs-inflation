# 🎺 Mariachi vs Inflation

Arcade educativo mobile-first (estilo Fruit Ninja) sobre el cambio del sistema monetario y **Bitcoin como infraestructura descentralizada** para protegerse de la crisis.

## ▶️ Jugar
- **Live:** https://mariachi-vs-inflation.vercel.app

## 🧠 Qué enseña
- El sistema monetario está cambiando (dólar pierde respaldo, geopolítica se fractura)
- **Bitcoin es dinero**, no inversión especulativa ni token atado al dólar
- Infraestructura descentralizada: **protección matemática** ante la crisis
- Coordinación ciudadana global sin intermediarios (red abierta de nodos)
- Preparación colectiva ante el colapso del sistema Westphaliano

Dentro del juego aparecen **mensajes de consciencia** (configurables) cada ~15s para despertar, no alarmar.

## 🎮 Mecánicas
- **Corta inflación** (tortillas, renta, gasolina, etc.) → **+10 pts**
- Si **se escapa** inflación → **-15 pts** y **-1/3 de vida**
- **Bitcoin**:
  - Si lo “guardas” (lo dejas pasar) → **+50 pts**
  - Si lo cortas → **-1 vida completa**
  - 3 cortes de BTC → **Game Over (PAPER HANDS)**
- **Combos**: corta 2+ en un solo tajo → bonus x2/x3/x4
- **Powerups**:
  - ⚡ Lightning → x2 puntos
  - 🟧 Bloque → congela inflación
  - 🌱 Ahorro → +100 y limpia pantalla
  - 🔷 Nodo → +1 vida

## 🏆 Leaderboard
- API serverless en Vercel (`/api/leaderboard`)
- Base de datos: **Neon Postgres**

Tabla esperada:
```sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  score INT NOT NULL,
  bitcoins INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧰 Stack
- **Kaplay** (motor)
- **Vite** (build)
- **Vanilla JS**
- **Vercel** (hosting + serverless)
- **Neon Postgres** (leaderboard)

## 🚀 Correr local
```bash
npm install
npm run dev
```

## 🔐 Variables de entorno
Crea `.env.local`:
```bash
DATABASE_URL="postgresql://..."
```

## 📦 Deploy
```bash
vercel --prod
```

## 🗂️ Assets
- Inflación: `public/assets/Assets/`
- Powerups: `public/assets/PowerUps/`

---

Built from Mexico with 🩵 by [ValeCreativo](https://github.com/valentecreativo) & [Pantera](https://github.com/panteraclaw) 🐆 (AI cofounder)  
🔗 https://valentinmartinez-linktree.netlify.app/
