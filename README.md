# FIFA World Cup 2026 — Brisbane Time Wallchart

An interactive, single-page tournament wallchart for the 2026 FIFA World Cup.
Every one of the 104 match kick-offs is shown in **Brisbane time (AEST, UTC+10)**,
the bracket fills itself in as results come in, and live scores are pulled from a
football data API through a serverless proxy.

## What it does

**Board & navigation**
- The whole tournament on one poster: the twelve groups (A–L) flank the left and
  right edges, the knockout bracket fans inward through the Round of 32, Round of
  16, quarter-finals and semi-finals, and the **Final sits dead centre** with the
  third-place play-off beneath it.
- Connector lines trace every path from each Round-of-32 tie to the Final.
- Zoom, pan and fit: scroll to zoom, drag to pan, double-click to reset. The
  board scales to any viewport.

**Times**
- Each match shows its **date (dd/mm)** and **24-hour kick-off** time.
- A **time-zone switcher** flips the whole board between Brisbane, Sydney,
  Melbourne, Adelaide, Darwin and Perth — every time, the countdown and the
  detail panel redraw instantly, and the choice is remembered.
- Kick-offs are colour-dotted by how early they land locally (before 7am /
  7–11am / midday onward).

**Next match day card (centre)**
- Shows the next match day's date and that day's full fixture list, with a
  **live ticking countdown** to the next kick-off.

**Groups**
- Each group card toggles between **Fixtures** and a full **standings Table**
  (P, W, D, L, GF, GA, Pts).
- A "who's through" strip highlights the top two teams — projected while the
  group is in progress, locked once it is mathematically decided.

**Self-filling bracket**
- As groups finish, the placeholder slots (group winners, runners-up and the
  eight best third-placed teams) populate with the real qualified teams, and
  knockout winners cascade forward round by round.

**Live scores**
- Auto-refreshes every 60 seconds. Finished matches show the result; in-play
  matches show a green live badge and the match minute. A status pill reports the
  connection state and last update time. Scores are cached locally so the last
  result survives a refresh. Manual score entry is available as a fallback.

**Match detail**
- Click any match for a panel with the Brisbane kick-off, the **local kick-off at
  the host venue** (ET / CT / PT / Mexico time), the stadium, the host city and
  the result. Click outside or press Esc to close.

**Print**
- A print mode fits the whole board on one landscape A3 sheet with blank boxes
  for writing scores in by hand.

## Tech stack

- **Plain HTML, CSS and vanilla JavaScript** — no framework, no build step. The
  entire interface is one self-contained `index.html`.
- **CSS custom properties** for the design tokens (an ink/navy palette with gold
  and green accents), **OKLCH** colour values, and **CSS Grid / Flexbox** for
  layout.
- **Archivo** and **Saira Condensed** type families (Google Fonts).
- A **CSS-transform zoom/pan stage**: a fixed 2760×1720 canvas scaled to fit.
- An **absolutely-positioned bracket** with kick-off times computed from the
  schedule, and connector lines drawn as a single **inline SVG** path layer.
- A small **serverless function** (Node, native `fetch`) that proxies the
  football-data.org API, keeping the key server-side and sidestepping the API's
  lack of CORS headers — the browser only ever calls the same-origin `/api/scores`.
- **localStorage** for the cached scores and the chosen time zone.

## Architecture

```
Browser (index.html)
  │  fetch every 60s
  ▼
/api/scores  ──►  serverless function  ──►  football-data.org
  (same origin)     (adds API key,            (World Cup matches)
                     hides it from client)
```

The page is fully static and host-agnostic. The serverless layer only attaches
the secret key and bypasses CORS; layout, time conversion, standings, bracket
resolution and rendering all run in the browser.

## Data

- **Fixtures** (dates, kick-off times, venues, groups and bracket structure) are
  embedded in the page as the published schedule, with times stored in AEST.
- **Live scores** come from the **football-data.org** World Cup endpoint, matched
  to the board by three-letter country code (group stage) and by kick-off time
  (knockouts).
- Knockout match-ups display as positional placeholders (group winners,
  runners-up, "winner of match N") until results decide them.

## File structure

```
index.html        The complete wallchart — UI, fixture data, time logic, rendering
image-slot.js     Image placeholder helper (loaded but unused by default)
api/scores.js     Serverless score proxy           (Vercel layout)
  ── or ──
netlify/functions/scores.js + netlify.toml          (Netlify layout)
```

## Time zones

All board times default to **Brisbane / AEST (UTC+10)** and can be switched to any
mainland Australian city. The detail panel also converts each match to its
**host-city local time**. (June–July is Australian winter, so there is no daylight
saving to account for.)

## Attribution

Live match data provided by [football-data.org](https://www.football-data.org).
Fonts by Google Fonts. Built as a static site deployable to any host that supports
serverless functions (Vercel, Netlify, and similar).
