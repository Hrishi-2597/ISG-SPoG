# Design Choices — ISG SPoG ESG Forecasting Dashboard

A record of every significant design decision made, with the reasoning behind it.

---

## Visual Design

### Color Palette — Dark Navy Theme
**Decision:** Custom navy palette (`navy-900` → `navy-400`) with `#4fc3f7` accent.
```
navy-900: #0d1b2a  ← page background
navy-800: #112240  ← panel/section background
navy-700: #1a3456  ← filter bar, layer headers
navy-600: #1e3f6e  ← card bodies, chart backgrounds
navy-500: #2a5298  ← card headers
accent:   #4fc3f7  ← highlights, actuals bars, line charts
```
**Why:** Matches the dark navy theme shown in the PPT screenshots. Dark backgrounds reduce eye strain in ops-center environments and make colored chart data pop clearly.

### Typography
**Decision:** `'Segoe UI', system-ui, sans-serif` — no custom font loaded.
**Why:** Avoids a network request, matches Windows/Dell corporate environments, and renders crisply at small sizes (10–12px labels in chart axes).

### Text Size Strategy
- Filter labels: 10px uppercase tracking-wide
- Card titles: 11px bold
- Chart axis ticks: 9–10px
- Section headers: 12px bold uppercase
**Why:** Dense dashboard — space is at a premium. Labels need to be readable but not compete with chart data.

---

## Layout

### Three-column graph layout (all 3 visuals side by side)
**Decision:** Each graph layer renders its 3 visuals in a `flex gap-3` row.
**Why:** Directly mirrors the PPT design spec which shows Visual 1, 2, 3 side-by-side. Maximises horizontal screen real estate for comparison.

### Collapsible layers (accordion)
**Decision:** Each layer (1/2/3) has a clickable header that toggles content visibility.
**Why:** Lets users focus on one layer at a time. All 3 open simultaneously would be ~1200px tall and require constant scrolling.

### Filter panel — 2 rows × 6 columns (superseded 2026-07-01)
**Decision:** 12 filters laid out in a `grid-cols-6` grid inside the filter bar.
**Why:** Exactly matches the PPT screenshot layout (6 filters per row). Keeps the filter panel compact (two rows) so it doesn't eat into chart space.
**Update:** Replaced by the clustered filter bar below — the flat 6-per-row grid read as a generic BI slicer panel, which is exactly what the redesign was asked to move away from.

### Left-side section labels ("Cards", "Graphs")
**Decision:** Removed the vertical text labels from the PPT spec — not included in the UI.
**Why:** They were design-annotation labels in the spec document (for explaining the mockup to stakeholders), not actual UI elements. Including them would look odd in a real app.

---

## Component Decisions

### Filters lifted to App.jsx
**Decision:** `filters` state lives in `App`, passed down as props.
**Why:** All 3 layers + cards need to respond to the same filter state. Lifting to the nearest common ancestor avoids prop drilling through multiple layers and makes filter-to-data wiring straightforward when real data is connected.

### Drill-down as inline panel (not modal)
**Decision:** Clicking a KPI card opens a panel directly below the cards row, not a modal overlay.
**Why:** Modals interrupt workflow. An inline panel lets the user see both the card value and the detail table simultaneously without losing context of other cards.
**One deliberate exception (2026-07-01):** Clicking a year's bar inside the CQN Variance drill-down opens an actual modal (backdrop + centered card) listing that year's example queues. This is a second level of drill nested inside the first — by the time you're two levels deep, "context of the other cards" isn't the thing you're trying to preserve; a floating overlay reads more clearly than squeezing another chart into an already-open panel.

### Drill toggle (FY / Quarter / Week) as segmented control (removed 2026-07-01)
**Decision:** Three-button segmented control per visual instead of a dropdown.
**Why:** Users switch frequently between fiscal granularities. One-click toggle is faster than open-select-close. The options are fixed (only 3), so a segmented control is appropriate.
**Update:** Removed once the top filter bar gained real Fiscal Year/Quarter/Week filters — having both a top-level time filter and a per-chart time toggle was a duplicate control surface. Layer 1/2 Visual 1 now always render at Fiscal Year granularity; the top filters (whichever is most specific) pick which year shows. The `.drill-toggle`/`.drill-btn` CSS classes weren't deleted — they're reused for the new DB/OSP segmented pill in the filter bar.

### Plan A / Plan B as separate dropdowns per visual
**Decision:** Each visual in Layer 1 has its own Plan A / Plan B selector.
**Why:** PPT spec explicitly states "2 dropdowns at the top right of each graph to select two different plans." Independent per-visual allows comparing different plan pairs across visuals simultaneously.

### Layer 2 Visual 2 — stacked bar (not grouped)
**Decision:** Stacked 100% bar chart showing adherence buckets (Excellent/Good/Fair/Poor) per fiscal year.
**Why:** The PPT screenshot shows a stacked percentage chart (FY25/26/27 with % breakdowns like 43%/36%/9%/13%). Stacked format communicates the distribution of queues across performance tiers, which grouped bars would obscure.

### CQN chart orientation — horizontal bars
**Decision:** Visual 3 in both Layer 1 and Layer 2 uses a horizontal (layout="vertical") bar chart.
**Why:** Real queue names (e.g. `EMEA DPD AVAMAR`, `NAMER DPD DataDomain`) are long strings — they fit naturally on the Y axis. Vertical bars with queue names on the X axis would require angled labels and wasted space. YAxis width was widened to 130px (from the original CQN-code-era 58–60px) once real names replaced short placeholder codes.

---

## Chart Library

### Recharts (not Chart.js or Victory)
**Decision:** Recharts v2.12.
**Why:**
- Native React component model (no imperative canvas API)
- `ComposedChart` natively supports bars + lines on dual Y-axes — exactly what Plan vs Variance and Actual vs Adherence require
- Good TypeScript support, active maintenance
- Lighter than Victory, more customisable than nivo for this use case

### react-simple-maps (not Leaflet or Mapbox)
**Decision:** react-simple-maps v3 with world-atlas topojson from CDN.
**Why:**
- Pure SVG — no tile server, no API key, no map token required
- Lightweight and renders within the React tree
- `ComposableMap` + `Geographies` + `Marker` pattern is straightforward for dropping accuracy indicators on regions/countries
- Leaflet would add ~150KB and requires a separate CSS file + imperative setup

### Dual Y-axis on all ComposedCharts
**Decision:** Left Y-axis = volume (call counts), Right Y-axis = percentage (variance/adherence).
**Why:** Volume values (20K–300K) and percentage values (−10% to +10%) are on completely different scales. A single Y-axis would flatten the line into near-zero.

---

## Accuracy Color Scale (Geo Map)

| Range | Color | Label |
|---|---|---|
| ≥ 90% | `#2e7d32` (dark green) | Excellent |
| 80–90% | `#1976d2` (blue) | Good |
| 70–80% | `#e65100` (orange) | Fair |
| < 70% | `#b71c1c` (dark red) | Critical |

**Why:** Traffic-light metaphor extended to 4 bands. Green/blue/orange/red maps intuitively to performance tiers. Blue for "Good" (not yellow) avoids green/yellow/red colorblindness issues (deuteranopia).

---

## CI/CD Design

### peaceiris/actions-gh-pages over actions/deploy-pages
**Decision:** Switched from `actions/configure-pages + actions/deploy-pages@v4` to `peaceiris/actions-gh-pages@v4`.
**Why:**
- `actions/deploy-pages` requires GitHub Pages to be set to "GitHub Actions" as source — this is a manual repo setting that isn't auto-applied when Pages was already configured to deploy from a branch
- `peaceiris/actions-gh-pages` pushes the `dist/` output to a `gh-pages` branch, which works with the classic "Deploy from branch" Pages setup
- More predictable — the `gh-pages` branch is visible in the repo, easy to inspect and debug

### vite base = '/ISG-SPoG/'
**Decision:** Set `base: '/ISG-SPoG/'` in `vite.config.js`.
**Why:** GitHub Pages serves project sites (non-org/non-custom-domain) under `/<repo-name>/`. Without this base, all asset paths (`/assets/index.js`) resolve to the root domain and return 404.

---

---

## UI Overhaul (2026-06-30) — Changes Applied

### Font: Space Grotesk
**Decision:** Replaced `Segoe UI, system-ui` with Space Grotesk (Google Fonts, 300–700 weight range).
**Why:** Segoe UI is a neutral system font with no personality. Space Grotesk is geometric and slightly technical — it signals "data tool" without feeling cold. `font-variant-numeric: tabular-nums` applied globally so all numbers in tables and cards align in columns.

### Signature Element: Luminous Card Top-Edge Glow
**Decision:** CSS `::before` pseudo-element on every KPI card — a `linear-gradient(90deg, transparent, #38bdf8, transparent)` line at the top that fans out (left/right bounds expand) and increases opacity on hover; full-width with box-shadow glow when active.
**Why:** Operations dashboards need to communicate "this data is live". The glow treatment makes cards feel like illuminated data panels without adding animation overhead. It's the one memorable thing in the design — everything else is quiet.

### Filter Dropdowns: Dark `.select-dark`
**Decision:** Removed `bg-white text-gray-800` from filter selects. Created `.select-dark` CSS class: `background: #0c1929`, accent-colored SVG chevron, translucent border, focus ring.
**Why:** White dropdowns in a dark dashboard are a visual scream. This was the single biggest regression in the original design.

### Layer Headers: Accent Left-Border + Numbered Badges
**Decision:** Each layer has a `2px solid #38bdf8` left border, horizontal gradient background, and a colored number badge (`01` in accent blue, `02` in teal-green, `03` in orange).
**Why:** The original `Layer 1 / Layer 2 / Layer 3` labels had no visual weight. The numbered badge creates hierarchy and lets the eye navigate to sections quickly. Three different badge colors distinguish the layers at a glance.

### Chart Panels: `.chart-panel` Dark Inset
**Decision:** Chart visual containers now use `background: #0a1522` (darker than the layer surface) with `border: 1px solid rgba(255,255,255,0.06)`.
**Why:** Creates visible depth — the layer container → chart panel → chart itself has three distinct tonal levels. Charts no longer float on flat surfaces.

### Pill DrillToggle
**Decision:** FY/Quarter/Week segmented control changed from rectangular box buttons to a pill container with rounded buttons. Active state: `background: #38bdf8; color: #070f1a`.
**Why:** The rectangle toggle had no roundness and looked like a table row. The pill form is a standard pattern for mutually-exclusive quick filters and reads as interactive at a glance.

### Recharts Axis Cleanup
**Decision:** Removed `axisLine` and `tickLine` from all XAxis/YAxis. Reduced CartesianGrid to `rgba(255,255,255,0.05)` strokeDasharray `2 4`. Added `maxBarSize` cap on all bars.
**Why:** Axis lines double-draw the chart border and add visual noise. With a dark background, tick marks alone are sufficient for reference. Capping bar size prevents bars from becoming wall-to-wall at low data counts.

### Tooltip: Backdrop Blur + Accent Border
**Decision:** `.chart-tooltip` uses `backdrop-filter: blur(8px)`, `background: rgba(12,25,41,0.96)`, `border: 1px solid rgba(56,189,248,0.25)`.
**Why:** Glassmorphism on the tooltip keeps it legible without completely blocking the chart behind it. The accent border connects it visually to the hovered data point.

### Geo Map Marker Glow
**Decision:** SVG `filter: drop-shadow(0 0 6px <color>)` on each accuracy circle, with glow intensity matching the accuracy color (green/blue/orange/red).
**Why:** Plain colored circles on a dark map are hard to find at small sizes. The drop-shadow creates a halo that draws the eye to marker locations without requiring larger circles.

---

## Filter Bar Redesign & Live Filtering (2026-07-01)

### Clustered filter bar, not a flat dropdown grid
**Decision:** Regrouped the 12 filters into 4 icon-labeled clusters — Scope (Queue Name, Capacity Code, Plan Name), Time (Fiscal Year/Quarter/Week), People (Channel, Business Partner, L5 Manager), Geography (Region, Sub-region, DB/OSP) — with a thin accent-gradient divider between the two clusters on each row, and a small inline icon (stack / clock / person / globe) per cluster instead of one generic filter icon for the whole bar.
**Why:** The brief explicitly asked for something that doesn't read as generic BI slicers. A wall of 12 identical dropdown boxes is exactly that; grouping by what the filter actually answers (what/when/who/where) gives the bar real structure instead of decoration, and the icons let the eye chunk the bar without reading every label.

### Underline-tab select styling instead of bordered boxes
**Decision:** `.select-dark` dropped its full border/box background for a nearly-transparent field with a bottom accent underline that only lights up on hover/focus (`border-bottom` from `rgba(255,255,255,0.09)` to `#38bdf8`), plus a softer custom chevron.
**Why:** Boxed dropdowns in a row are the single most recognizable "BI slicer panel" signature. An underline-tab treatment reads as a quiet, integrated control — closer to how a native ops console treats inputs — while keeping the exact same interaction model (still a native `<select>`, no custom listbox to maintain).

### Monospace font for Queue Name & Capacity Code values
**Decision:** Those two fields render in a system monospace stack; every other filter stays in Space Grotesk.
**Why:** They're literal system codes (`AM02`, `EMEA DPD AVAMAR`), not prose — the drill-down table already used monospace for queue names (see Layer 3 CQN tables). Extending that convention to the filter itself makes "this is a code" legible at a glance, and costs no extra font request since it's a system stack, not a webfont.

### DB/OSP as a segmented pill, not a third binary dropdown
**Decision:** Reused the existing `.drill-toggle`/`.drill-btn` pill pattern (freed up once the per-chart FY/Quarter/Week toggle was removed) for DB/OSP/All.
**Why:** It's a 3-option exclusive choice — a dropdown for that is more clicks than it needs to be, and the pill pattern was already proven elsewhere in the app. Reusing it is more coherent than inventing a second toggle style.

### Applied-filter chip strip (the signature element)
**Decision:** Once any filter is off "All", a "Scoped by" strip appears below the filter bar — one glowing chip per active filter (`Label: Value ×`), plus "Clear all". Uses the same accent-glow language as the KPI cards' top-edge signature (glow intensifies on hover).
**Why:** This is the one thing a Power BI-style slicer panel doesn't have: a persistent, at-a-glance answer to "what is this view currently scoped to?" Real ops dashboards (Datadog, Grafana) surface active scope as removable tags for exactly this reason — it turns 12 independent dropdowns into one coherent "current view" statement, and it doubles as the fastest way to back out of a filter without hunting for which dropdown you changed.

### Live filtering via a queue fact table, not per-chart special cases
**Decision:** `ACTIVE_QUEUES` became a fact table — every queue carries region, sub-region, capacity code, business partner, L5 manager, channel, and DB/OSP tags. `filterQueues(filters)` is the single function every card and CQN-variance chart calls; `cardData(filters)`, `cqnPlanVariance(filters)`, `cqnActualVariance(filters)` all sit on top of it.
**Why:** The brief asked for every filter to visibly affect the graphs. Faking that per-chart with unrelated random scaling would look plausible but be dishonest math. A shared fact table means every filter's effect is a real re-aggregation (a real count, a real average, a real top-N) — slower to build than a fudge factor, but the numbers on screen are always literally true given the mock tags.

### DB/OSP scopes volume, not queue-portfolio membership
**Decision:** Total Queues / Forecast Accuracy / CQN Variance / both CQN-variance charts filter on 7 of the 8 queue dimensions but explicitly ignore DB/OSP; Call Volume / DB-OSP Split respect it.
**Why:** The app's default filter state has always been `dbOsp: 'DB'` (pre-existing, not new). Once filtering became real, that default was silently shrinking "Total Queues" from 199 to ~132 on first load — a queue's existence and accuracy don't depend on which slice of its call volume you're viewing, so that default shouldn't touch portfolio-level metrics. Caught by screenshotting the live app during verification, not by inspection.

---

## What Was Deliberately NOT Done

| Thing skipped | Reason |
|---|---|
| Redux / Zustand for state | Overkill for current scope; local useState is sufficient |
| TypeScript | Not requested; JS keeps iteration fast |
| Unit tests | Not requested at this stage |
| Backend API | Out of scope — placeholder for real data integration |
| Mobile responsive layout | Dashboard is designed for ops-center / desktop screens (1280px+) |
| Code splitting | Bundle size (~711KB) is acceptable for internal tool; can be optimised later |
| Custom font | Avoided extra network request; Segoe UI is already on Windows machines |
