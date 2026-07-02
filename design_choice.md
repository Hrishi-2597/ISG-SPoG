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
**Why:** Boxed dropdowns in a row are the single most recognizable "BI slicer panel" signature. An underline-tab treatment reads as a quiet, integrated control — closer to how a native ops console treats inputs.
**Update (2026-07-01):** The 11 non-DB/OSP filters are no longer native `<select>` elements — see "Searchable multi-select filters" below — but `.ms-field` carries the exact same underline-tab visual treatment, so the look didn't change, only the interaction model underneath it.

### Searchable multi-select filters (2026-07-01)
**Decision:** Built a custom `MultiSelectField` (button + popover: search box, "Select all"/"Clear", checkbox list, native `accent-color` checkboxes) to replace every native `<select>` except the DB/OSP pill.
**Why:** Queue Name (199 options) and Capacity Code (~610) were unusable as plain dropdowns — no way to search, no way to pick more than one. A checkbox-list-with-search is structurally what Power BI's slicer does too, but the mechanism being similar doesn't make it wrong; the execution is what was asked to differ (dark glass panel, accent glow border, underline-tab trigger matching the rest of the bar) rather than the interaction pattern itself, which is the correct tool for "search + multi-select" regardless of what tool popularized it.
**Consequence:** Every filter value became an array (`[]` = no selection = "All") except `dbOsp`, which stayed a single string since the pill is a 3-way exclusive control, not a search-and-multi-select case. `mockData.js`'s `matchesMulti()` helper and `effectiveFiscalYears()` (renamed from the old singular `effectiveFiscalYear`) are the seams where every chart/card selector adapted to array-valued filters.

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

## Chart Redesign, Geo Choropleth, RCA/CLCA Sidebar (2026-07-01)

### Centered chart titles
**Decision:** Every chart panel's title moved from a left-aligned row shared with its controls to its own centered row at the top; controls (plan pickers) moved to a second, also-centered row underneath.
**Why:** Directly requested. A left-aligned title fighting for space with right-aligned dropdowns reads as "the title lost a negotiation with the toolbar" — centering the title on its own line gives it clear top billing and reads as a proper chart heading rather than a form-field label.

### Diverging bar chart instead of two adjacent bars (CQN variance)
**Decision:** Both "CQN Highest Variance" charts (renamed "Top Queue Variance") now render one bar per queue — the variance itself — extending right (green) or left (red) from a zero baseline, instead of two side-by-side bars (Plan A vs Plan B, or Actual vs Plan) the reader had to compare by eye.
**Why:** The two-bars-per-queue version made the reader do the subtraction mentally for every row; a diverging bar shows the answer (the gap) directly, and the color does double duty as both a legend and a "good/bad" signal. This is the single biggest visualization upgrade in this pass — everything else here is refinement, this changed what the chart is actually plotting.
**Follow-up (2026-07-02):** First pass still wasn't reading well — every bar in a given "top-5 by magnitude" pull tends to cluster near the same value (see next entry), so bars looked nearly identical with nothing to visually latch onto. Added a value label at the end of each bar (`+7%`/`-7%`, colored to match) so the exact number is always visible regardless of how similar the bars look, split into two `LabelList`s using Recharts' own `position="left"`/`"right"` (a hand-computed `x`/`width` version drifted the label into the bar interior — Recharts' built-in positioning is more reliable than re-deriving bar geometry). Also rounded the axis domain/ticks to clean 5%-step values instead of whatever odd number the raw max happened to produce, and widened + smartened the queue-name truncation (breaks at the last word boundary instead of mid-word).

### Reserving color semantics: violet for neutral trends, green/red for ahead/behind
**Decision:** The Fiscal Year / Regional Plan Variance line moved from red (`#f87171`) to violet (`#a78bfa`); green/red are now used exclusively on the diverging bar charts to mean ahead-of-plan/behind-plan.
**Why:** A trend line showing "variance %" isn't inherently good or bad by itself (that judgment depends on direction and magnitude together) — coloring it red implied "this is bad" regardless of value. Freeing red for its one true job (behind plan) and giving neutral analytical lines their own color makes the color vocabulary consistent across every chart: if it's red, something is behind; nothing else claims that color.

### Forecast Variance Distribution: re-bucketed by magnitude, not accuracy tier, with data labels
**Decision:** Replaced the ≥90%/80–90%/70–80%/<70% accuracy-tier buckets with <10%/10–20%/20–30%/>30% variance-magnitude buckets, a green→blue→amber→red graduated scale, and a `LabelList` printing each segment's % directly on the bar.
**Why:** Requested directly, and it's a clearer story either way — "how far off plan is this population" (variance magnitude) is a more actionable framing for a forecasting dashboard than "what tier is this population in" (accuracy tier), and printing the value on the segment means a reader doesn't have to eyeball stacked-bar heights against the Y-axis to know a number.

### Geo Map: choropleth instead of circle markers, Sub-region instead of Country
**Decision:** Removed all `<Marker>` circles; every country `<Geography>` is now filled by its region's (or sub-region's) accuracy color directly. The Country/Region toggle became Sub-region/Region, backed by the real 24 `SUB_REGIONS` values instead of a hardcoded 14-country list.
**Why:** Requested directly — "highlight the geography... as green" is a choropleth by definition, and circles sitting on top of an otherwise-flat map don't communicate "this whole area is this color" the way a filled shape does. Sub-region replacing Country also makes the drill-down consistent with the filter bar, which already has a real "Sub-region" filter with real values.

### Illustrative country→region/sub-region mapping, with a dimmed regional fallback in Sub-region view
**Decision:** `regionForCountry()`/`subRegionForCountry()` in `mockData.js` are a hand-built, clearly-labeled-as-illustrative mapping (e.g., "ROLA" → Argentina/Chile/Colombia/Peru/etc.), not authoritative geography or real org data. In Sub-region view, a country with no specific sub-region tag falls back to its parent region's accuracy at 35% opacity, so the whole map is covered but named sub-regions still visually "pop" at full opacity against the dimmed background.
**Why:** Several real sub-region values (ROLA, UKI, CER, SER, Nordics, EC) are groups of countries, not single places, and there's no authoritative per-country mapping in the source data — so a full-coverage choropleth necessarily means inventing *some* grouping. Doing it once, explicitly, and labeling it as illustrative is more honest than leaving large parts of the map uncolored (which reads as "no data" when really it's "no specific sub-region tag") or silently treating a guess as real business data.

### RCA/CLCA as a persistent full-height sidebar, not a new section
**Decision:** `RcaClcaPanel.jsx` sits in a `position: sticky` right-hand column alongside the KPI cards and all three analysis layers, not inside or after any single layer.
**Why:** "On the right side of the dashboard" reads as the whole page, not one section — a sidebar that only sat next to the Geo Map would orphan it from the cards and the other two layers above. Sticky positioning means it stays visible as the (much taller) left column scrolls, which matters for a panel meant to be read alongside whatever chart is currently in view.
**Adjusted (2026-07-02):** Moved to start at the "Analysis Layers" divider instead of "Key Metrics" — the 5 KPI cards now span the full page width on their own row, and the sidebar only runs alongside Layers 1–3. Full-width cards read better than 5 cards squeezed to make room for a sidebar that, at that point, has nothing yet to say about any specific chart the user is looking at.

### Chart titles renamed to match their section's own naming
**Decision:** Layer 1 Visual 1 ("Fiscal Year Plan Variance") → **PoP Variation**; Layer 2 Visual 1 ("Fiscal Year Adherence") → **Actual vs Plan Variation**.
**Why:** Requested directly. Both new names echo their parent layer's own title (Layer 1 = "Plan over Plan" → PoP; Layer 2 = "Actual vs Plan" → Actual vs Plan Variation), which reads as more intentional than a generic "Fiscal Year X" pattern repeated across both layers.

---

## HES Forecasting: New Page via Header Toggle (2026-07-02)

### Page toggle, not a route
**Decision:** `App.jsx` holds a single `page` state ('forecasting'|'hes') and renders `ForecastingPage` or `HesForecastingPage` — no router, no URL change.
**Why:** The app has always been a single internal tool with no need for shareable/bookmarkable URLs per page, and adding React Router for two pages would be new infrastructure for no real benefit. The existing `.drill-toggle`/`.drill-btn` pill pattern already reads as "switch between two views" everywhere else in the app, so reusing it for page-level navigation is more consistent than introducing a new nav pattern.

### ForecastingPage extracted verbatim, not rewritten
**Decision:** The entire pre-existing `App.jsx` body (filters through footer-adjacent content) moved into `ForecastingPage.jsx` unchanged; `App.jsx` became a shell with just the header, toggle, and footer.
**Why:** The Forecasting page was just declared "done" — extracting it verbatim guarantees zero visual or behavioral regression while making room for a second page. Splitting `SectionDivider` out separately (rather than duplicating it into `hes/`) means both pages share one implementation of the "KEY METRICS" / "ANALYSIS LAYERS" label.

### Built directly from confirmed slides, no further data requests mid-build
**Decision:** Once the user said "just build the page over these two slides" (slides 5–6, ASU/SR/UCR), the page was built with reasonable illustrative choices for anything not explicitly supplied (LOB→region-plan mapping, UCR targets, ASU/SR base volumes), rather than pausing again to ask for every missing number.
**Why:** The user explicitly asked to proceed rather than wait — matching the same "real names + illustrative structure" principle already established for the ESG Forecasting page (see below), just applied to a new dataset. Real data supplied mid-build (the 33 LOB names, the HES queue lists) was integrated immediately rather than deferred.

### No RCA/CLCA sidebar on HES Forecasting
**Decision:** `RcaClcaPanel` only renders on the ESG Forecasting page; HES Forecasting's 4 layers run full-width with no sidebar.
**Why:** The sidebar's actual content (RCA/CLCA findings) is ESG-Forecasting-specific illustrative copy tied to that page's metrics — copying it verbatim onto a page about ASU/SR/UCR would be visibly wrong content, and the ASU/SR/UCR slides never showed an equivalent panel. If the user wants an HES-specific RCA/CLCA sidebar later, it should get its own content, not a reused copy.
**Update (2026-07-02):** Requested directly — see "HES-specific RCA/CLCA sidebar content" below. `HesRcaClcaPanel.jsx` now provides that page-specific content, following exactly the plan already laid out in this entry.

### Renamed "ESG Capacity Planning" → "HES Forecasting" (2026-07-02, same day)
**Decision:** Renamed the page label, every component/file/folder (`capacity/` → `hes/`, `CapacityPlanningPage.jsx` → `HesForecastingPage.jsx`, `CapacityFilterPanel.jsx` → `HesFilterPanel.jsx`, `CapacityChartKit.jsx` → `HesChartKit.jsx`, `CapacityMetricCards.jsx` → `HesMetricCards.jsx`, `CapacityGeoMap.jsx` → `HesGeoMap.jsx`, `capacityData.js` → `hesData.js`), and every internal identifier that carried "capacity" in its name (`capacityCardData` → `hesCardData`, `capacityEffectiveFiscalYears` → `hesEffectiveFiscalYears`), via `git mv` to preserve file history.
**Why:** Requested directly. The page is fundamentally about HES (High End Storage) service-unit tracking, not a general capacity-planning concept — "HES Forecasting" names what the page actually is. Renamed identifiers and files along with the label, not just the visible string, so the codebase doesn't end up with a page called "HES Forecasting" built out of files and functions still named "Capacity" — that mismatch would confuse the next person (or agent) who opens the folder. The pre-existing "Capacity Code" filter field on the *ESG Forecasting* page (a real queue attribute, unrelated to this page) was deliberately left untouched — it's a different concept that happens to share a word.

### LOB filter reuses the Queue Name filter's real-data-swap pattern
**Decision:** `ucrNonAdherentQueues(filters)` checks whether the selected LOB has a `LOB_QUEUES` entry (currently only "High End Storage") and swaps to its real active-queue list when so, exactly like `cqnPlanVariance`/`cqnActualVariance` on the Forecasting page swap to genuinely filtered real queues rather than fabricating a new number per filter state.
**Why:** Consistent with the standing principle: when real data exists for a slice of the view, use it exactly; when it doesn't (every other LOB), fall back to a clearly-mock but structurally-consistent substitute rather than inventing fake per-LOB queue names.

### Region/LOB delta formula: coprime multiplier instead of a small modulus
**Decision:** `buildLobImpact()`'s per-LOB delta uses `(i*17 + ri*41) % 131` instead of the original `(i*7 + ri*13) % 21`.
**Why:** Caught during Playwright verification — the original formula's modulus (21) was small enough relative to its multiplier (7, sharing a factor of 7 with 21) that only 3 distinct residues existed, so 6+ different LOBs displayed an identical delta in the "Plan Impact Analysis" drill-down list, which looked obviously fake once several rows in a row read `-2400`. A modulus that's prime (131) paired with a coprime multiplier (17) guarantees every one of the 33 LOBs maps to a distinct residue for a fixed region — still fully deterministic mock data, just varied enough to not visually expose itself as a repeating pattern.

---

## HES Forecasting: Total Queues Card + RCA/CLCA Sidebar (2026-07-02)

### Total Queues card replaces UCR Impacted SR, front of the row
**Decision:** Removed the "UCR Impacted SR" card (previously last) and added a "Total Queues" card at the front of the Key Metrics row, styled and worded identically to the Forecasting page's Total Queues card (`⬡` icon, "Active / Inactive" sublabel, `active / total` value, "N inactive queues" sub-line).
**Why:** Requested directly ("remove the UCR card from the last and the front add the total queues card similarly we did for ESG Forecasting"). Matching the Forecasting page's exact wording/format makes the two pages read as the same product rather than two dashboards with similar-but-different conventions for the same concept.

### `LOB_QUEUES['High End Storage']` reused as the page-level queue roster, not one LOB's sample
**Decision:** `HES_ACTIVE_QUEUE_NAMES`/`HES_INACTIVE_QUEUE_NAMES` (new in `hesData.js`) point at the same real 71 active / ~150 inactive names already in `LOB_QUEUES['High End Storage']`, but the Total Queues card treats them as the whole page's queue count, not filtered to that one LOB.
**Why:** The user said "I have already given you a list of active and inactive queues for HES" — referring to the only real per-queue name lists this page has. Treating them as LOB-scoped (the original framing when they were first added, for the UCR non-adherent-queue drill-down) would leave the Total Queues card with no real numbers to show for the other 32 LOBs; treating them as the page's queue roster uses real, business-supplied data honestly instead of inventing placeholder counts for LOBs with no real queue data. Flagged in `handoff.md`/`tech_spec.md` as a decision to revisit if real per-LOB queue lists arrive later.

### Region tagging via `inferRegion()`, reused rather than re-implemented
**Decision:** Exported `inferRegion()` from `mockData.js` (was file-local) and reused it in `hesData.js` to tag each HES active queue name with a region for the Total Queues donut.
**Why:** The HES queue names follow the exact same prefix convention (`APJ …`, `EMEA …`, `NAMER …`, `LATAM …`, else `Global`) as the Forecasting page's queue names — writing a second, near-identical region-inference function would just be the same regex copy-pasted under a new name.

### Total Queues drill-down: same donut-then-table mechanic, minus the Accuracy column
**Decision:** Mirrored the Forecasting page's `QueuesByRegionChart` + `QueueTable` almost verbatim (click a slice or legend entry to filter the table to that region, "Clear" to reset) but dropped the Accuracy column from the table.
**Why:** Requested directly ("drilldown should be similar pie chart we did for ESG Forecasting"). Accuracy is a forecast-quality concept tied to ESG Forecasting's plan/actual data; HES queues in this list have no equivalent real metric, so showing a column here would mean fabricating a number just to look consistent — Queue + Region is the honest subset of that pattern.

### HES-specific RCA/CLCA sidebar content, not a copy of the Forecasting page's
**Decision:** New `HesRcaClcaPanel.jsx`, wired into `HesForecastingPage.jsx` with the identical sticky-sidebar-next-to-Analysis-Layers layout as `RcaClcaPanel`/`ForecastingPage.jsx`, but with its own illustrative findings written in this page's own vocabulary (ASU/SR/CPASU/UCR/LOB) instead of reusing the Forecasting page's queue/call-volume-themed copy.
**Why:** Requested directly ("add RCA and CLCA section similarly we did for ESG Forecasting") — "similarly" was read as *same mechanism and layout*, not *same words*, consistent with the standing decision already on record in this file ("No RCA/CLCA sidebar on HES Forecasting... If the user wants an HES-specific RCA/CLCA sidebar later, it should get its own content, not a reused copy").

---

## HES Forecasting: Card Modals, Renames, Layer 3 Redesign (2026-07-02)

### Card drill-downs: modal popups, not inline panels (HES Forecasting only)
**Decision:** `HesMetricCards.jsx`'s 5 card drill-downs moved from an inline panel below the cards row to a centered modal (new `Modal` in `HesChartKit.jsx`), closable via backdrop click or ✕.
**Why:** Requested directly — "display the detailed view as a popup modal instead of navigating to a new page... allow users to close it and return to the dashboard without losing their current filter selections." This deliberately diverges from the Forecasting page's "no modals except the CQN Variance year-click" rule (see "Drill-down as inline panel" above) — that rule described an established pattern for *that* page; this request is explicit and scoped to HES Forecasting's cards, so it doesn't retroactively apply elsewhere. Filters live one level up in `HesForecastingPage`, so opening/closing the modal never touches them — closing always returns to the dashboard exactly as filtered.

### YTD message replaces "Plan X · Y% adherence" on ASU/SR/CPASU cards
**Decision:** `hesCardData()` now computes a year-over-year % delta (`yoyPct`) for ASU, SR, and CPASU — latest in-scope FY vs the one before it. The card sub-line reads `YTD <FY>: <value> · ▲/▼ X% vs <prior FY>`, with a colored status pip.
**Why:** Requested directly ("add a YTD message... show increase/decrease as per your wish"). CPASU inverts the color logic (`lowerIsBetter`) since a falling CPASU is the desirable direction, consistent with the card's existing "lower is more efficient" framing — ASU/SR keep growth-is-good coloring. When filters narrow to a single FY there's no prior year to compare, so the message falls back to "no prior year in scope" rather than a misleading 0%.

### SR Actuals popup: grouped columns instead of stacked bar
**Decision:** Removed `stackId` from the DB/OSP bars in the SR Actuals drill-down chart.
**Why:** Requested directly.

### CPASU popup: line-only instead of Composed (bars + line)
**Decision:** Dropped the SR/ASU bars from the CPASU card's popup, leaving a single `LineChart` of CPASU across fiscal years.
**Why:** Requested directly ("show a line chart... showing only the CPASU over years").

### Plan Impact: 4-region set (AMER/APJ/EMEA/Global) replaces the deck's 3-region set
**Decision:** `IMPACT_REGIONS` changed from `['NAMER','EMEA','APJ']` to `['AMER','APJ','EMEA','Global']`.
**Why:** Requested directly for both ASU Layer's and SR Layer's Plan Impact visuals. Reused the same constant for CPASU Trend's region breakdown (below) instead of introducing a second region list — one 4-region set for every region-scoped HES visual is more coherent than two overlapping ones.

### CPASU Trend: regions-by-default, click-to-drill into time granularity
**Decision:** Replaced the Region/Country toggle on "ASU Impact on SR Trend with CPASU" (renamed **CPASU Trend**) with a region-default view — grouped ASU/SR bars + CPASU line, one group per `IMPACT_REGIONS` entry. Clicking a region's bar drills into that region's own trend, rendered at whichever of Week/Quarter/Year is most specific in the top filter bar (`regionTrendGranularity()`), with a "← All Regions" pill to back out.
**Why:** Requested directly — "show the regions as default and when we click any particular region it should show up the year or quarter or week when selected from the filters at the top." No real per-region/per-quarter/per-week dataset exists, so `cpasuTrendByRegion()` synthesizes it deterministically from the same FY baselines used everywhere else on this page (documented as illustrative in `tech_spec.md`) — dividing each FY's baseline across the periods within it, rather than inventing an unrelated dataset or silently ignoring the requested drill.

### UCR Impact on SR: renamed series, added a (cosmetic) Plan selector in the corner
**Decision:** "SR (Human)" → **SR's**, "SR (Bots)" → **UCR Handled SR's**. Added a `PlanSelect` in the visual's top-right corner via a new `cornerControls` slot on `Visual` (`HesChartKit.jsx`), positioned absolutely instead of the usual centered-below-title `controls` row.
**Why:** Both requested directly, including the specific "top right corner" placement — a deliberate one-off exception to the page's usual centered-controls convention (see "Centered chart titles" above) because the request was explicit about the corner rather than a stylistic default. The selector doesn't yet feed into `srBotsByFY()`'s output, matching the existing precedent of AsuLayer/SrLayer Visual1's Plan dropdown, which is also not yet wired to the underlying numbers.

### UCR Runrate with Target: fixed at fiscal-year granularity, top-5-LOB modal replaces the queue list
**Decision:** The chart now always plots `UCR_BY_FY` directly (all 3 fiscal years), ignoring Quarter/Week filter narrowing. The previously always-visible "queues not adhering to target" list is gone; clicking a year's bar opens a modal listing that year's top 5 non-adherent **LOBs** (not queues), via new selector `topNonAdherentLobsByYear()`.
**Why:** Requested directly ("keep it at fiscal year default", "top 5 LOB's not adhering... give a pop-up (design on your convenience)"). Modal-on-bar-click for a "top N" list directly mirrors the CQN Variance year-click modal already established on the Forecasting page — reusing a proven pattern rather than inventing a new one from scratch. Switching from queues to LOBs left `LOB_QUEUES`'s real per-queue data (High End Storage) without a UI consumer for now — see `handoff.md` and `tech_spec.md`'s Known Limitations.

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
