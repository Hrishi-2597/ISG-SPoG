# Prompt Trail — ISG SPoG Project

Chronological log of every user prompt and the corresponding actions taken.

---

## Prompt 1 — 2026-06-30
**Input:** `/model` (set model to Sonnet 4.6 1M context)
**Action:** Model set, no code changes.

---

## Prompt 2 — 2026-06-30
**Input:** `so can you read the ppt in @SPOG_views.pptx and understand it?`

**Action:**
- Located `SPOG_views.pptx` via Glob
- Extracted text from all 16 slides by unzipping the PPTX (ZIP format) and regex-parsing `<a:t>` XML tags via PowerShell
- Parsed and summarized 3 dashboard domains:
  1. Call Center / WFM Analytics (slides 1–9)
  2. Forecast Trend Dashboard (slides 10–13)
  3. Shipment Trend Dashboard (slides 14–16)
- Documented key terminology: CQN, DB/OSP, ASU, SR, UCR, SLO, LOB, FTE, CPASU, AOP

---

## Prompt 3 — 2026-06-30
**Input:** `This is SPoG for ISG Business and particular for Enterprise Service Group(ESG) Forecasting Page and we want to built an interactive UI and also check for GIT credentials.` *(with git init commands and 2 screenshot images)*

**Images provided:** Screenshots of the ESG Forecasting design spec showing filter panel layout, 5 KPI cards, Layer 1 (Plan over Plan) and Layer 2 (Actual vs Plan) graph layouts.

**Action:**
- Checked git credentials: user=`Hrishi-2597`, email=`hrishikesh.yadav@alignedautomation.com`
- Confirmed Node v24 / npm v11 available
- Scaffolded full React + Vite project manually (no create-vite, all files written directly)
- Created project structure:
  ```
  src/
    components/FilterPanel.jsx
    components/MetricCards.jsx
    components/Layer1PlanOverPlan.jsx
    components/Layer2ActualVsPlan.jsx
    components/Layer3GeoMap.jsx
    data/mockData.js
    App.jsx  main.jsx  index.css
  package.json  vite.config.js  tailwind.config.js
  postcss.config.js  index.html  .gitignore
  ```
- Installed dependencies via `npm install`
- Built successfully (`vite build` → 682KB bundle, no errors)
- `git init`, created README.md, committed, set remote to `https://github.com/Hrishi-2597/ISG-SPoG.git`
- Pushed to GitHub (`main` branch)

---

## Prompt 4 — 2026-06-30
**Input:** `when everything is built push to github pages and setup everything deploy it and give the hosted link in the chat`

**Action:**
- Set `vite.config.js` base to `/ISG-SPoG/` for correct asset paths
- Added `predeploy` / `deploy` scripts to `package.json`
- Created `.github/workflows/deploy.yml` using `actions/configure-pages@v4` + `actions/deploy-pages@v4`
- Fixed `Layer3GeoMap.jsx`: removed `ZoomableGroup` (removed in react-simple-maps v3)
- Pushed to GitHub → Actions workflow triggered and completed with `success`
- Verified HTTP 200 at `https://hrishi-2597.github.io/ISG-SPoG/`
- **Issue discovered:** site served raw source `index.html` (with `src="/src/main.jsx"`) — GitHub Pages was still set to "Deploy from branch: main", not GitHub Actions

---

## Prompt 5 — 2026-06-30
**Input:** `The link is not loading on website`

**Action:**
- Diagnosed: `https://hrishi-2597.github.io/ISG-SPoG/` returned raw source `<script src="/src/main.jsx">` instead of compiled assets
- Root cause: GitHub Pages was configured to serve from `main` branch (raw files), not the Actions artifact
- Fix: updated workflow to use `peaceiris/actions-gh-pages@v4` which pushes `dist/` to `gh-pages` branch
- Verified `gh-pages` branch was created with correct built `index.html` (`src="/ISG-SPoG/assets/index-KRutg-Ok.js"`)
- Pages workflow completed with `success`
- Remaining step for user: go to Settings → Pages → Source → `gh-pages` branch

---

## Prompt 6 — 2026-06-30
**Input:** `create a handoff.md, create prompt_trail.md create tech_spec.md, create design_choice.md and keep it updated as each prompt is given keep on updating`

**Action:**
- Created this file (`prompt_trail.md`) and three companion docs
- All 4 files placed in project root (`C:\...\Desktop\SPoG\`)
- Committed to git and pushed

---

---

## Prompt 7 — 2026-06-30
**Input:** `I HAVE added the UI skill and use that to improve the overall UI.`

**Action:**
- Invoked `frontend-design` skill with full dashboard context
- Read all 8 source files (index.css, tailwind.config.js, App.jsx, FilterPanel.jsx, MetricCards.jsx, Layer1, Layer2, Layer3)
- Designed a premium enterprise analytics overhaul. Key decisions:
  - Font: **Space Grotesk** (Google Fonts) — geometric, tabular numerals, technical character
  - Palette: Deeper base `#070f1a`, translucent borders (`rgba(255,255,255,0.07)`), cooler accent `#38bdf8`
  - Signature: **Luminous top-edge card glow** — CSS `::before` gradient line on KPI cards that fans out and glows on hover/active
  - Filter dropdowns: replaced jarring white `bg-white` selects with `.select-dark` (dark bg, accent focus ring)
  - DrillToggle: pill-shaped rounded control replacing rectangular box
  - Layer headers: left `2px` accent border + gradient background + numbered badges `01/02/03`
  - Chart panels: `.chart-panel` inset dark container (`#0a1522`) replacing flat `bg-navy-800`
  - Tooltips: backdrop-blur with accent border
  - Recharts: removed axis lines/tick lines, reduced grid opacity, set `maxBarSize`, `activeDot`
  - Geo map: inner glow on container, `drop-shadow` filter on accuracy markers, glow-dot legend
  - Active filter count badge in filter panel
- Built successfully (687KB, no errors)
- Committed and pushed → GitHub Actions deploying to gh-pages

**Also noted:** User asked to push after every update — will do going forward.

<!-- NEW PROMPTS APPENDED BELOW THIS LINE -->

## Prompt 8 — 2026-07-02
**Input:** `add this repository https://github.com/Hrishi-2597/ISG-SPoG.git and follow the important documents`

**Action:**
- Cloned the repo fresh to `C:\Users\hrishikesh.yadav\ISG-SPoG` (new machine/session, no prior local checkout)
- Read `README.md`, `handoff.md`, `tech_spec.md`, `design_choice.md`, `prompt_trail.md` in full
- Confirmed git remote/branches (`main`, `gh-pages`) and toolchain (Node v24, npm v11)
- Saved the "update these 4 docs + push after every change" convention to persistent memory so it's followed automatically in future sessions on this machine

---

## Prompt 9 — 2026-07-02
**Input:** Large multi-part request for the HES Forecasting page: (1) card drill-downs → popup modals that preserve filters on close; (2) rename ASU/SR Actuals cards, add YTD messages with increase/decrease, change SR popup to a column chart, change CPASU popup to a CPASU-only line chart; (3) rename ASU Layer/SR Layer → ASU Trend/SR Trend and their 3 visuals ("Actuals vs Plan Comparison" with a "Plan Name" dropdown, "Plan vs Plan Comparison", "Plan Impact" with 4 regions AMER/APJ/EMEA/Global); (4) rename "ASU Impact on SR Trend" → "ASU/UCR Impact on SR Analysis", redesign its CPASU Trend visual to show regions by default and drill into a clicked region's trend at the top filter bar's time granularity, rename SR(Human)/SR(Bots) series and add a corner Plan selector on "UCR Impact on SR", and change "UCR Runrate with Target" to a fixed-FY chart with a year-click modal listing the top 5 non-adherent LOBs

**Action:**
- `HesChartKit.jsx`: added a shared `Modal` popup component, a `cornerControls` slot on `Visual`, and a `PillButton` helper
- `hesData.js`: added `yoyPct` to `hesCardData()`'s ASU/SR/CPASU metrics; changed `IMPACT_REGIONS` to `['AMER','APJ','EMEA','Global']`; added `cpasuByRegion`/`regionTrendGranularity`/`cpasuTrendByRegion` for the CPASU Trend redesign; added `topNonAdherentLobsByYear`; removed the now-dead `ucrNonAdherentQueues` (queue-level) and its fallback constant, along with the unused `asuSrTrendByFY`/`asuSrTrendCountries` Region/Country-toggle functions
- `HesMetricCards.jsx`: card drill-downs now open in the new `Modal`; renamed "ASU Actuals"→"Active Service Units" and "SR Actuals"→"Service Requests"; all three of ASU/SR/CPASU show a YTD year-over-year message instead of "Plan X"; SR's DB/OSP popup changed to grouped columns; CPASU's popup changed to a CPASU-only line chart
- `AsuLayer.jsx` / `SrLayer.jsx`: renamed layer headers to "ASU Trend"/"SR Trend" and all 3 visual titles; Plan dropdown relabeled "Plan Name"
- `AsuSrTrendLayer.jsx`: renamed layer header to "ASU/UCR Impact on SR Analysis"; Visual1 ("CPASU Trend") rebuilt with region-default + click-to-drill-into-time-granularity; Visual2 series renamed to "SR's"/"UCR Handled SR's" plus a corner Plan selector; Visual3 now always shows all 3 FYs and opens a modal with the top 5 non-adherent LOBs on year click
- Ran `npm install` (dependencies weren't present in this fresh clone), `npm run build` (clean), and grepped the whole `src/` tree for stale old titles/removed function names — none found
- Started the Vite dev server and confirmed it serves HTTP 200; this session's environment has no browser-automation tool available, so the popups/drill-throughs were verified by a clean production build and code/grep review rather than a live click-through — flagged to the user as a follow-up to verify manually
- Updated `handoff.md`, `tech_spec.md`, `design_choice.md` with the full change set; committed and pushed to `main`

---

## Prompt 10 — 2026-07-02
**Input:** `remove the UCR card from the last and the front add the total queues card similarly we did for ESG Forecasting..I have already given you a list of active and inactive queues for HES.and drilldown should be similar pie chart we did for ESG Forecasting.Also add RCA and RLCA section similarly we did for ESG Forecasting.`

**Action:**
- Removed the "UCR Impacted SR" card (was last) and its `ucrImpactedSrByFY()` selector (dead code)
- Added a "Total Queues" card at the front of the Key Metrics row, worded/styled identically to the Forecasting page's ("Active / Inactive" sublabel, `active / total` value, "N inactive" sub-line)
- Reused `LOB_QUEUES['High End Storage']`'s real 71 active / ~150 inactive queue names as the page-level HES queue roster (new `HES_ACTIVE_QUEUE_NAMES`/`HES_INACTIVE_QUEUE_NAMES`/`HES_ACTIVE_QUEUES` in `hesData.js`) — the only real per-queue name data supplied for this page, so it backs the Total Queues card directly rather than staying scoped to one LOB
- Exported `inferRegion()` from `mockData.js` (was file-local) and reused it to tag each HES active queue with a region
- Built a region-donut-then-table drill-down for the new card, mirroring the Forecasting page's `QueuesByRegionChart`/`QueueTable` (click a slice/legend entry to filter, "Clear" to reset), minus the Accuracy column since that concept doesn't exist for HES queues
- Created `HesRcaClcaPanel.jsx` with HES-specific illustrative RCA/CLCA content (ASU/SR/CPASU/UCR-themed, not a copy of the Forecasting page's queue/call-volume-themed copy) and wired it into `HesForecastingPage.jsx` as a sticky sidebar alongside Layers 1-4, matching `ForecastingPage.jsx`'s exact layout
- Ran `npm run build` (clean) and grepped for stale references to the removed card/selector — none found
- Updated `handoff.md`, `tech_spec.md`, `design_choice.md` with the full change set; committed and pushed to `main`

---

## Prompt 11 — 2026-07-02
**Input:** `When a user clicks on any card, display the detailed view as a popup modal instead of navigating to a new page. The popup should allow users to close it and return to the dashboard without losing their current filter selections - do this for ESG Forecasting as well`

**Action:**
- Extracted the `Modal` component (built for HES Forecasting's cards) out of `HesChartKit.jsx` into a shared `src/components/Modal.jsx`; `HesChartKit.jsx` now re-exports it so no existing HES import needed to change
- `MetricCards.jsx` (ESG Forecasting): renamed `DrillDownPanel` → `DrillDownModal`, wrapped in the shared `Modal`; the nested `YearQueueModal` (CQN Variance year-click drill) needed no changes — it's now a modal nested inside a modal instead of nested inside an inline panel
- This supersedes the Forecasting page's original "Drill-down as inline panel (not modal)" decision, noted in `design_choice.md`
- Ran `npm run build` (clean) and grepped for stale `DrillDownPanel` references — none found
- Updated `handoff.md`, `tech_spec.md`, `design_choice.md` with the change; committed and pushed to `main`

---

## Prompt 12 — 2026-07-02
**Input:** Two lists of real queue names pasted in chat, labeled "Inactive queues list for ESG Forecasting and CCC MidRange Mandarin" and "Active queues for ESG Forecasting - update accordingly"

**Action:**
- Cross-checked both pasted lists against the existing `ACTIVE_QUEUE_NAMES`/`INACTIVE_QUEUE_NAMES` in `mockData.js`: every name in the "active" list was already somewhere in the old active list, every name in the "inactive" list was already somewhere in the old inactive list — confirmed this is a pruned/corrected roster, not new additions
- Replaced `ACTIVE_QUEUE_NAMES` wholesale with the new 47-name list, and `INACTIVE_QUEUE_NAMES` wholesale with the new 146-name list (145 pasted names + `'CCC MidRange Mandarin'`, which the label indicated moved from active to inactive)
- Verified via a small Node script: exact counts (47/146), no duplicates within either list, no overlap between the two lists
- Confirmed no code (only the two array literals) needed to change — `filterQueues`, `callVolumeByFY`, `dbOspVolumeByFY`, `cardData`, and the CQN-variance selectors all read `ACTIVE_QUEUE_NAMES.length`/`ACTIVE_QUEUES.length` dynamically, not a hardcoded `199`
- Sanity-checked `inferRegion()` against the new active names — reasonable region spread (EMEA/Global/APJ/LATAM), no crashes, no `NAMER` entries this time (handled fine by existing empty-region UI states)
- Ran `npm run build` (clean)
- Updated `handoff.md`, `tech_spec.md`, `design_choice.md` — corrected every stale `199`/`406`/`605` count reference, generalized two prose references to the ratio formula that had named the old `199` divisor explicitly so they won't go stale again; committed and pushed to `main`

---

## Prompt 13 — 2026-07-02
**Input:** Screenshot of the HES Forecasting filter bar showing a visible gap between Fiscal Week and Business Partner, with instructions to fill it and to add a light/dark mode toggle for both pages

**Action:**
- Root-caused the gap: `HesFilterPanel.jsx`'s `Cluster` grid div was missing `flex-1 min-w-0` (the Forecasting page's `FilterPanel.jsx` `Cluster` already had it), so the Time cluster's flex-grown width went unclaimed as blank space instead of stretching its 4 dropdown columns. One-line fix.
- Built a full light/dark theme toggle:
  - New CSS custom-property system in `index.css` (`:root` dark defaults, `[data-theme='light']` overrides) covering background depth levels, border tiers, text hierarchy, accent + accent-contrast, tooltip/chart-grid/select tokens, scrollbars, and card shadows
  - Rerouted every shared CSS class (`.card-panel`, `.chart-panel`, `.layer-header`, `.select-dark`, `.ms-*`, `.filter-chip`, `.drill-toggle`/`.drill-btn`, `.chart-tooltip`, scrollbars) to the new variables
  - Added a sun/moon `ThemeToggle` in `App.jsx`'s header, state persisted to `localStorage`, applied via a `data-theme` attribute set in the `useState` initializer to avoid a flash on load
  - Rerouted inline "chrome" colors (backgrounds/borders/text) across `App.jsx`, `SectionDivider.jsx`, `FilterPanel.jsx`/`HesFilterPanel.jsx`, `MultiSelectField.jsx`, `MetricCards.jsx`/`HesMetricCards.jsx`, `Modal.jsx`, `RcaClcaPanel.jsx`/`HesRcaClcaPanel.jsx`, `HesChartKit.jsx`, and all 7 layer/geo-map files
  - Deliberately left chart series/data colors, region palettes, the geo accuracy scale, status badges, and the geo maps' own canvases un-themed (constant across both modes) — see `design_choice.md`
- Ran `npm run build` (clean), grepped the compiled CSS to confirm both `:root` and `[data-theme='light']` blocks survived Tailwind/PostCSS, and grepped the whole component tree to confirm no stray hardcoded chrome colors were left unconverted
- This session's environment has no browser-automation tool, so the toggle wasn't visually clicked through in a rendered browser — flagged to the user as a follow-up to verify manually
- Updated `handoff.md`, `tech_spec.md`, `design_choice.md` with the full change set; committed and pushed to `main`

---

## Prompt 14 — 2026-07-02
**Input:** Add a page-wide Quarter/Month/Week filter for both pages ("in order - Quarter | Month | Week"), with every graph interacting with it, researched and placed well at the top; also rename HES's ASU Layer subtitle from "average service unit" to "Active Service Unit"

**Action:**
- Ran a web search on dashboard time-granularity/date-filter placement conventions before building anything, per the explicit request — findings (page-wide filters belong in the horizontal filter toolbar; granularity toggles sit prominently near other filters) informed placing the new control inside each filter bar rather than the header or a new toolbar row; cited in `design_choice.md`
- Built a shared `GranularityToggle.jsx` (Quarter/Month/Week pill, same `.drill-toggle` styling as the DB/OSP and page toggles) and added it to the top-right of both `FilterPanel.jsx` and `HesFilterPanel.jsx`'s filter-bar rows
- Lifted `granularity` state (default `'Quarter'`) into `ForecastingPage.jsx`/`HesForecastingPage.jsx` alongside `filters`, threaded as a prop into every chart component with a time axis
- Added `FISCAL_MONTH_LIST` (moved to `mockData.js`, `hesData.js` now re-exports it), `periodsForGranularity()`, `expandToGranularity()` (additive fields — volumes/counts, divides across sub-periods with a wobble) and `expandRateToGranularity()` (rate fields — percentages/targets, keeps magnitude constant across sub-periods) to `mockData.js`
- Applied granularity to every period-keyed selector on both pages: ESG's `planOverPlanByFY`, `actualVsPlanByFY`, `stackedAdherenceByFY` (own bespoke bucket-renormalizing expansion, not either generic helper), `callVolumeByFY`, `dbOspVolumeByFY`; HES's `asuByFY`, `srByFY`, `asuPlanVsPlanByFY`, `srPlanVsPlanByFY`, `cpasuByFY`, `ucrByFY`, `srBotsByFY`, `srDbOspByFY`, and `regionTrendGranularity`/`cpasuTrendByRegion` (now driven by the global toggle instead of inferring granularity from which time filter was selected)
- Caught and fixed a real bug during this pass: `ucrByFY` initially used the additive `expandToGranularity` on target/current, which are percentages — dividing an 88% target by 52 weeks would have shown ~1.7% at Week granularity. Fixed by routing rate fields through the new `expandRateToGranularity` instead
- This supersedes two same-day decisions: "UCR Runrate with Target" (fixed to always-FY earlier the same day) and the CPASU Trend region-drill's filter-bar-inferred granularity both now follow the new global toggle, since the request was explicit that every time-axis chart should respond to it
- Generalized `topNonAdherentLobsByYear` to accept any period label (not just a bare fiscal year), deriving the target year via the first 4 characters, since its host chart can now render at quarter/month/week granularity
- Renamed AsuLayer's subtitle from "— average service unit tracking" to "— Active Service Unit tracking"
- Verified with `npm run build` (clean) plus a throwaway Node script exercising every changed selector at Quarter/Month/Week directly (not just via the build) — confirmed correct period counts (12/36/156), additive fields summing back close to their FY totals, rate fields staying in range instead of being divided down, and the generalized LOB-modal function handling non-year period labels
- Updated `handoff.md`, `tech_spec.md`, `design_choice.md` with the full change set; committed and pushed to `main`
