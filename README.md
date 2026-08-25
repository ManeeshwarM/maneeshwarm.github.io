# Data Portfolio — Five Interfaces

A component-based React app that renders one shared dataset of data science
projects (`src/data/projects.js`) through five completely different UI
concepts. A launcher screen lets a visitor pick which interface to explore,
and a floating dock (bottom-right) lets them jump between interfaces at any
time without losing their place.

## Interfaces

- **Data Tracks** (`src/themes/spotify`) — Spotify-style dark player. Sidebar
  playlists by skill domain, an album grid of projects, and a bottom player
  bar whose progress bar is a live training-loss animation with a "Lyrics"
  tab showing the model explanation and a code snippet.
- **Mind Map Studio** (`src/themes/nodegraph`) — a pannable, zoomable,
  drag-node canvas showing the pipeline (ingestion → EDA → modeling →
  deployment). Clicking a project node opens a slide-over drawer with a
  training-curve chart, metrics, stack, and code.
- **Data Quest** (`src/themes/gaming`) — Steam-style library. Banner art,
  system requirements (tech stack), and unlocked achievements per project.
- **StreamScience** (`src/themes/stream`) — a live-dashboard aesthetic with a
  simulated live accuracy chart, an auto-scrolling chat log, and
  "channel point" sliders (learning rate / dropout) that visibly change the
  live chart in real time.
- **The Data Atelier** (`src/themes/gallery`) — a light gallery-wall grid.
  Opening a piece drops into an "Inspect Layers" mode with a slider that
  peels the generative artwork back from the finished visual to the raw
  data pipeline underneath.

## Editing your projects

Everything each theme renders — titles, metrics, achievements, code
snippets, chat lines, layer descriptions — comes from one file:

```
src/data/projects.js
```

Add, remove, or edit an entry there and all five interfaces update
automatically.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
```

Requires Node 18+.

## Stack

React 18 + Vite, Tailwind CSS, lucide-react icons, Recharts for the two
charted views (Mind Map Studio's drawer, StreamScience's live chart).
