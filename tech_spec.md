# Technical Specification — ISG SPoG ESG Forecasting Dashboard

## Overview
A single-page React application that renders an analytics dashboard for Dell's ISG Enterprise Service Group (ESG). It covers Forecast Trend data: call volume plans, actuals vs plan adherence, and geographic accuracy distribution. All data is currently mocked — no backend — but the filter bar is fully live: every filter recomputes cards and charts from a shared, filterable queue fact table (see Data Model below).

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| UI Framework | React | 18.3.1 | Component-based rendering |
| Build Tool | Vite | 5.4.2 | Dev server, bundler |
| Styling | Tailwind CSS | 3.4.11 | Utility-first CSS |
| Charts | Recharts | 2.12.7 | Bar, Line, Composed, stacked charts |
| Geo Map | react-simple-maps | 3.0.0 | SVG world map rendering |
| Color Scale | d3-scale | 4.0.2 | Accuracy → color mapping |
| CI/CD | GitHub Actions | — | Auto-build and deploy |
| Hosting | GitHub Pages | — | Static site hosting |
| Deployment Action | peaceiris/actions-gh-pages | v4 | Pushes dist/ to gh-pages branch |

---

## Project Structure

```
SPoG/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: build → push to gh-pages branch
├── src/
│   ├── main.jsx                # React root mount
│   ├── App.jsx                 # Top-level layout: header + filters + cards + layers
│   ├── index.css               # Tailwind imports + global scrollbar/select styles
│   ├── components/
│   │   ├── FilterPanel.jsx     # 12 filters in 4 icon-labeled clusters (Scope/Time/People/Geography) + applied-filter chips
│   │   ├── MetricCards.jsx     # 5 KPI cards + drill-down panel
│   │   ├── Layer1PlanOverPlan.jsx  # Plan vs Plan: 3 chart visuals + plan selectors
│   │   ├── Layer2ActualVsPlan.jsx  # Actual vs Plan: 3 chart visuals + stacked bar
│   │   └── Layer3GeoMap.jsx    # World map with accuracy markers + summary table
│   └── data/
│       └── mockData.js         # All static mock data (CQNs, plans, KPIs, geo)
├── index.html                  # Vite entry HTML
├── vite.config.js              # base: '/ISG-SPoG/' for GitHub Pages paths
├── tailwind.config.js          # Custom navy color palette
├── postcss.config.js
├── package.json                # Scripts: dev / build / predeploy / deploy
└── README.md
```

---

## Component Architecture

```
App
├── <header>              — Page title, org label, live indicator
├── FilterPanel           — Controlled: filters state lifted to App; renders applied-filter chips
├── MetricCards(filters)  — cardData(filters) + filterQueues(filters) recomputed on every change
│   └── DrillDownPanel    — Inline (within MetricCards), toggled by card click; rows scoped to match the clicked card
├── Layer1PlanOverPlan(filters) — Collapsible section, always at Fiscal Year granularity
│   ├── Visual1           — ComposedChart: planOverPlanByFY(filters), plan A/B dropdowns
│   ├── Visual2           — ComposedChart: planOverPlanByRegion(filters), Region x-axis
│   └── Visual3           — Horizontal ComposedChart: cqnPlanVariance(filters)
├── Layer2ActualVsPlan(filters) — Collapsible section, always at Fiscal Year granularity
│   ├── Visual1           — ComposedChart: actualVsPlanByFY(filters) + Adherence% line
│   ├── Visual2           — Stacked BarChart: stackedAdherenceByFY(filters)
│   └── Visual3           — Horizontal ComposedChart: cqnActualVariance(filters) with Cell coloring
└── Layer3GeoMap(filters) — Collapsible section
    ├── ComposableMap     — react-simple-maps world SVG
    ├── Markers           — geoRegionData(filters) or geoCountryData(filters), by view mode
    └── Summary table     — Adherence % with status badges
```

---

## State Management

No external state library. All state is local React `useState`:

| Component | State | Type |
|---|---|---|
| `App` | `filters` | Object (12 filter keys) |
| `MetricCards` | `active` (drill-down) | String or null |
| `Layer1PlanOverPlan` | `plans` (planA/planB, reset by `filters.planName` via `useEffect`), `open` | Object, Boolean |
| `Layer2ActualVsPlan` | `plan` (reset by `filters.planName` via `useEffect`), `open` | String, Boolean |
| `Layer3GeoMap` | `viewMode` (Region/Country), `hovered`, `open` | String, Object, Boolean |

`filters` flows down as a prop to `MetricCards`, all three layers, and every Visual sub-component. Each chart/card recomputes its data via `useMemo(() => selectorFn(filters), [filters])`, calling into the selector functions exported from `mockData.js` (see Data Model). No FY/Quarter/Week drill-toggle state exists anymore — those were removed; the top filter bar's Fiscal Year/Quarter/Week filters are the only time control, and charts render at Fiscal Year granularity only.

---

## Data Model (`src/data/mockData.js`)

All 12 filters funnel into a small set of selector functions that take `filters` and return the exact data a chart/card needs. Static exports (all-caps) are the underlying datasets; lowercase functions are the live selectors components actually call.

### Constants
```
ACTIVE_QUEUE_NAMES   — 199 real active queue names (business-supplied)
INACTIVE_QUEUE_NAMES — 406 real inactive queue names (business-supplied, no UI yet)
CAPACITY_CODES       — ~610 real capacity codes (business-supplied)
PLAN_NAMES           — ['AOP_FY26Q4_AA', 'FY27 Q1 APR Plan', 'FY27 Q2 JUN Plan', 'FY27Q1_AA']
FISCAL_YEARS         — ['FY25', 'FY26', 'FY27']
FISCAL_QUARTERS      — FY25Q1 ... FY27Q4 (12 values, derived from FISCAL_YEARS) — filter only
FISCAL_WEEK_LIST     — FY25W01 ... FY27W52 (156 values, derived from FISCAL_YEARS) — filter only
REGIONS              — ['APJ', 'EMEA', 'Global', 'LATAM', 'NAMER']
SUB_REGIONS          — 24 real sub-region values (business-supplied)
BUSINESS_PARTNERS    — 7 real names (business-supplied)
L5_MANAGERS          — 15 real names (business-supplied)
inferRegion(name)    — regex-based mapping from a real queue name to one of REGIONS or 'Global'
```

### Queue fact table — the shared source of truth
```
ACTIVE_QUEUES — ACTIVE_QUEUE_NAMES.map(...) → Array<{
  name, region, subRegion, capacityCode, businessPartner, l5Manager, channel, dbOsp,
  offered, handled, accuracy, plan1, plan2, planVariance (getter), adherence (getter)
}>
```
Every queue gets `subRegion`/`capacityCode`/`businessPartner`/`l5Manager`/`channel`/`dbOsp` tags assigned deterministically (round-robin, `list[i % list.length]`) — the source lists don't specify a real per-queue mapping, so this is mock data enriched with realistic *structure* so every filter has something genuine to narrow, not a claimed real business relationship. `region` comes from `inferRegion(name)`.

```
filterQueues(filters) — returns ACTIVE_QUEUES rows matching all of: cqn, capacityCode,
  channel, businessPartner, region, subRegion, l5Manager, dbOsp (each 'All' passes through)
effectiveFiscalYear(filters) — Week > Quarter > Year precedence → a single 'FYxx' or 'All'
```

### Cards
```
cardData(filters) → {
  totalQueues, forecastAccuracy, cqnVariance   — from filterQueues({...filters, dbOsp:'All'});
                                                   cqnVariance's "within range" threshold is
                                                   accuracy >= 89 (tight on purpose — lands the
                                                   headline around 40-50%, not the ~75-80% a
                                                   looser threshold would give)
  callVolume, dbOspSplit                        — from filterQueues(filters), scaled off a
                                                   285.4K/268.7K baseline by the filtered/199 ratio
                                                   (DB/OSP genuinely scopes volume here)
}
```

### Card drill-down selectors (`MetricCards.jsx`)
```
callVolumeByFY(filters) — {period, offered, handled} per FY, narrowed to effectiveFiscalYear(filters);
  scaled by filterQueues(filters).length/199 off a per-FY baseline (BASE_CALL_VOLUME_BY_FY) that
  sums to the same 285.4K/268.7K totals as cardData's callVolume. Backs both the Call Volume and
  DB/OSP Split drill-downs — DB/OSP scopes it exactly like the cards above it.
FORECAST_ACCURACY_BY_REGION / forecastAccuracyByRegion(filters) — {region, actual, forecast, accuracy}
  ×5 regions, static, narrowed to filters.region. Backs the Forecast Accuracy drill-down
  (bar: actual/forecast, line: accuracy% on a second axis).
CQN_VARIANCE_BY_FY — {fy, pct} ×3, static, curated to the 40-50% range (illustrative — no
  per-queue-per-year variance dataset exists yet). Backs the CQN Variance drill-down.
cqnVarianceQueuesByFY(filters, fy, count=5) — filterQueues({...filters, dbOsp:'All'}) filtered to
  |planVariance| <= 10, then a `count`-sized slice offset by the FY's index (so each year's
  pop-up shows a different-looking sample of the same real, currently-in-scope queues).
  Powers the modal opened by clicking a year's bar in the CQN Variance drill-down.
```

### Layer 1 Data (Plan over Plan) — always Fiscal Year granularity
```
PLAN_VS_PLAN_BY_FY      — period, plan1, plan2, variance (computed getter) — 3 FYs, static
PLAN_VS_PLAN_BY_REGION  — region, plan1, plan2, variance — 5 regions, static
planOverPlanByFY(filters)     — PLAN_VS_PLAN_BY_FY narrowed to effectiveFiscalYear(filters)
planOverPlanByRegion(filters) — PLAN_VS_PLAN_BY_REGION narrowed to filters.region
cqnPlanVariance(filters, topN=5) — filterQueues({...filters, dbOsp:'All'}) → top-N by |planVariance|,
                                     or the single selected queue if filters.cqn is set
```

### Layer 2 Data (Actual vs Plan) — always Fiscal Year granularity
```
ACTUAL_VS_PLAN_BY_FY   — period, actual, plan, adherence (computed getter) — 3 FYs, static
STACKED_ADHERENCE      — fy, excellent, good, fair, poor (% buckets) — 3 FYs, static
actualVsPlanByFY(filters)      — ACTUAL_VS_PLAN_BY_FY narrowed to effectiveFiscalYear(filters)
stackedAdherenceByFY(filters)  — STACKED_ADHERENCE narrowed to effectiveFiscalYear(filters)
cqnActualVariance(filters, topN=5) — same queue scoping as cqnPlanVariance, ranked by actual-vs-plan shortfall
```

### Layer 3 Data (Geo)
```
GEO_REGION_DATA   — { region, accuracy, lat, lng, label } ×4 regions (NAMER/EMEA/APJ/LATAM — no 'Global' marker)
GEO_COUNTRY_DATA  — { country, region, accuracy, lat, lng } ×14 countries
geoRegionData(filters)  — GEO_REGION_DATA narrowed to filters.region
geoCountryData(filters) — GEO_COUNTRY_DATA narrowed to filters.region
```
Selecting Region = "Global" returns an empty array from both (no lat/lng data at that granularity); `Layer3GeoMap.jsx` renders an explanatory empty state rather than a blank map.

---

## Build & Deployment

### Local build
```bash
npm run build   # → dist/ folder
```
Vite sets `base: '/ISG-SPoG/'` so all asset paths include the repo name prefix.

### CI/CD (`.github/workflows/deploy.yml`)
```
Trigger: push to main OR manual workflow_dispatch
Steps:
  1. checkout
  2. setup-node@v4 (node 20, npm cache)
  3. npm ci
  4. npm run build
  5. peaceiris/actions-gh-pages@v4 → pushes dist/ to gh-pages branch
```

### GitHub Pages config (manual, one-time)
- Settings → Pages → Source: `Deploy from a branch` → Branch: `gh-pages` → `/(root)`

---

## External Dependencies at Runtime

| Resource | URL | Used by |
|---|---|---|
| World GeoJSON | `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json` | Layer3GeoMap |

---

## Known Limitations

1. All 12 filters are live and recompute real charts/cards, but the underlying per-queue tags (capacity code, business partner, sub-region, L5 manager, channel, DB/OSP) are deterministic mock assignments, not real business relationships — no API/database exists to supply the real mapping
2. ~711KB bundle (recharts + react-simple-maps) — consider dynamic imports
3. No authentication, no role-based views
4. No mobile/responsive layout optimisation (designed for 1280px+ screens)
5. No drill-down UI for `INACTIVE_QUEUE_NAMES` (406 real names) — only the count surfaces on the Total Queues card
6. Plan Name filter only pre-selects Plan A on Layer 1/2 — Plan B and the per-visual overrides are unaffected, by design (see `design_choice.md`)
