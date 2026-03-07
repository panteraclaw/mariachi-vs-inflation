import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_9R1BToOyYIMk@ep-dark-bird-ad0kt0ko-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function init() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        name VARCHAR(20) NOT NULL,
        score INT NOT NULL,
        bitcoins INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_score ON leaderboard(score DESC)
    `;

    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

init();
