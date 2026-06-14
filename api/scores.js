// Serverless proxy for football-data.org — Vercel format
// -------------------------------------------------------
// Vercel automatically serves this file at the URL /api/scores
// (any file in /api becomes an endpoint). It attaches your API key
// server-side, so the key stays private and the browser CORS block
// is avoided.
//
// SET YOUR KEY (recommended): Vercel dashboard → your project →
//   Settings → Environment Variables → add  FOOTBALL_DATA_KEY = your-key
// The hard-coded fallback lets it work immediately without that step.

const FALLBACK_KEY = "f3fe552977524a968559871dad80a7de";

export default async function handler(req, res) {
  const key = process.env.FOOTBALL_DATA_KEY || FALLBACK_KEY;
  try {
    const r = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches",
      { headers: { "X-Auth-Token": key } }
    );
    const body = await r.text();
    res.setHeader("content-type", "application/json");
    res.setHeader("cache-control", "public, max-age=30");
    res.status(r.status).send(body);
  } catch (err) {
    res.status(502).json({ error: String(err) });
  }
}
