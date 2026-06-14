# World Cup 2026 Wallchart — Vercel deployment

A complete, deployable website. Live scores come from football-data.org via a
serverless function, so your API key stays private and the browser CORS block
is avoided.

```
deploy-vercel/
├─ index.html        ← the wallchart
├─ image-slot.js     ← trophy image drop-zone
└─ api/
   └─ scores.js      ← serverless proxy (Vercel auto-serves it at /api/scores)
```

The page calls `/api/scores` every 60s; Vercel maps that to `api/scores.js`
automatically — no config file needed.

────────────────────────────────────────────────────────

## Method A — Vercel CLI (fastest, ~2 min)

1. Install once:           `npm i -g vercel`
2. From inside this folder: `vercel`
   (log in when prompted, accept the defaults)
3. It prints a live URL. To promote to production: `vercel --prod`
4. Recommended: add your key —
   `vercel env add FOOTBALL_DATA_KEY`  then redeploy.

## Method B — GitHub auto-deploy (updates on every push) ★ recommended

This is the "set it and forget it" route — works for Vercel AND Netlify.

1. Create a new repo on github.com (e.g. `worldcup-2026`).
2. Upload the contents of this folder to the repo
   (drag the files into GitHub's web uploader, or use git).
3. **Vercel:**  vercel.com → Add New → Project → Import the repo → Deploy.
   **Netlify:** app.netlify.com → Add new site → Import an existing project →
   pick the repo (use the `deploy/` folder's files for Netlify, which include
   `netlify.toml`).
4. Add the `FOOTBALL_DATA_KEY` environment variable in the dashboard
   (Settings → Environment Variables) and redeploy.
5. From now on, every `git push` redeploys automatically. To update scores,
   edit `index.html` (the `SCORES` object) and push.

────────────────────────────────────────────────────────

## Heads-up about football-data.org

The free tier's World Cup access can be limited. If the status pill (top-right)
shows "WC needs a paid plan", that's their restriction — the board still works
and you can enter scores manually in the `SCORES` object near the top of the
script in `index.html`, e.g.:

```js
SCORES["m104"] = [2, 1];   // the Final  (match number → [home, away])
SCORES["g0"]   = [3, 0];   // opener (group games are g0…g71, in list order)
```

Push (or redeploy) and everyone sees the update.
