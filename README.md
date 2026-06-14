# FIFA World Cup 2026 — Brisbane Time Wallchart

An interactive, single-page tournament wallchart for the 2026 FIFA World Cup,
with every one of the 104 match kick-offs shown in **Brisbane time (AEST,
UTC+10)** and live scores pulled from a football data API.

## What it does

- Renders the full tournament on one poster-style board: the twelve groups
  (A–L) flank the left and right edges, the knockout bracket fans inward
  through the Round of 32, Round of 16, quarter-finals and semi-finals, and the
  **Final sits dead centre** with the third-place play-off beneath it.
- Shows each match with its **date (dd/mm)** and **24-hour kick-off time** in
  Brisbane time. Brisbane stays on AEST year-round, so there's no daylight-saving
  adjustment to worry about.
- Colour-codes every kick-off by how early it lands locally — before 7am, the
  7–11am window, or midday onward — so you can spot the dawn alarms at a glance.
- Opens a **detail panel** for any match on click: full date, Brisbane kick-off,
  the local kick-off at the host venue (ET / CT / PT / Mexico time), the stadium
  and host city. Clicking outside or pressing Esc collapses it back to the full
  board.
- Pulls **live and final scores** automatically and refreshes them on a timer.
  Finished games show the result; in-play games show a live badge and the match
  minute. A status pill reports the connection state and last update time.
- Supports **manual score entry** as a fallback, and a **print mode** that fits
  the whole board on one landscape A3 sheet with blank boxes for writing scores
  in by hand.
- Includes a drop-in image slot in the centre for a trophy or tournament logo.

## Tech stack

- **Plain HTML, CSS and vanilla JavaScript** — no framework, no build step. The
  entire interface is one self-contained `index.html` file.
- **CSS custom properties** for the design tokens (an ink/navy palette with gold
  and green accents), **OKLCH** colour values for perceptually even shading, and
  **CSS Grid / Flexbox** for layout.
- **Archivo** and **Saira Condensed** type families (loaded from Google Fonts).
- A **CSS-transform zoom/pan stage**: the board is a fixed 2760×1720 canvas that
  scales to fit any viewport, with scroll-to-zoom, drag-to-pan and
  double-click-to-reset.
- An **absolutely-positioned bracket** with kick-off times computed from the
  schedule, and connector lines drawn as a single **inline SVG** path layer.
- A small **serverless function** (Node, using the platform's native `fetch`)
  that proxies the football-data.org API. This keeps the API key server-side and
  works around the API's lack of CORS headers — the browser only ever talks to
  the same-origin endpoint `/api/scores`.
- **localStorage** caching so the last-known scores survive a page refresh even
  if the data source is briefly unavailable.

## Architecture

```
Browser (index.html)
  │  fetch every 60s
  ▼
/api/scores  ──►  serverless function  ──►  football-data.org
  (same origin)     (adds API key,            (World Cup matches)
                     hides it from client)
```

The page is fully static and host-agnostic. The serverless layer exists only to
attach the secret key and bypass CORS; everything else — layout, time
conversion, score matching, rendering — runs in the browser.

## Data

- **Fixtures** (dates, kick-off times, venues, groups and bracket structure) are
  embedded in the page as the published tournament schedule, with times stored in
  AEST.
- **Live scores** come from the **football-data.org** World Cup endpoint and are
  matched to the board by three-letter country code, with a team-name fallback.
- Knockout match-ups display as positional placeholders (group winners,
  runners-up, "winner of match N") until the bracket is decided.

## File structure

```
index.html        The complete wallchart — UI, fixture data, time logic, rendering
image-slot.js     Drag-and-drop image placeholder for the centre trophy slot
api/scores.js     Serverless proxy for the score API   (Vercel layout)
  ── or ──
netlify/functions/scores.js + netlify.toml             (Netlify layout)
```

## Time zones

All board times are **Brisbane / AEST (UTC+10)**. The detail panel additionally
converts each match to its **host-city local time**. For other Australian cities,
subtract 30 minutes for Adelaide and Darwin (ACST) and 2 hours for Perth (AWST).

## Attribution

Live match data provided by [football-data.org](https://www.football-data.org).
Fonts by Google Fonts. Built as a static site deployable to any host that
supports serverless functions (Vercel, Netlify, and similar).
