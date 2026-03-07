import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const sql = neon(process.env.DATABASE_URL);

  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT name, score, bitcoins, created_at 
        FROM leaderboard 
        ORDER BY score DESC 
        LIMIT 50
      `;
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, score, bitcoins } = await req.json();
      if (!name || typeof score !== 'number' || typeof bitcoins !== 'number') {
        return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
      }

      await sql`
        INSERT INTO leaderboard (name, score, bitcoins) 
        VALUES (${name.substring(0, 20)}, ${score}, ${bitcoins})
      `;

      return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
