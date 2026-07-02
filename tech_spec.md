# Technical Specification — ISG SPoG ESG Forecasting Dashboard

## Overview
A React application that renders an analytics dashboard for Dell's ISG Enterprise Service Group (ESG), with **two pages** switched via a header toggle: **ESG Forecasting** (call volume plans, actuals vs plan adherence, geographic accuracy distribution) and **HES Forecasting** (ASU/SR/UCR service-unit tracking, built from slides 5–6 of `SPOG_views.pptx`; briefly named "ESG Capacity Planning" before the 2026-07-02 rename). All data is currently mocked — no backend — but every filter on both pages is fully live: each recomputes cards and charts from a shared, filterable fact table (see Data Model below).

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
│   ├── App.jsx                 # Shell: header + page toggle (ESG Forecasting/HES Forecasting) + footer
│   ├── index.css               # Tailwind imports + global scrollbar/select styles
│   ├── components/
│   │   ├── ForecastingPage.jsx # ESG Forecasting page body (filters + cards + 3 layers + RCA/CLCA sidebar)
│   │   ├── SectionDivider.jsx  # Shared "KEY METRICS" / "ANALYSIS LAYERS" section label, used by both pages
│   │   ├── FilterPanel.jsx     # 12 filters in 4 icon-labeled clusters (Scope/Time/People/Geography) + applied-filter chips
│   │   ├── MetricCards.jsx     # 5 KPI cards + drill-down panel
│   │   ├── Layer1PlanOverPlan.jsx  # Plan vs Plan: 3 chart visuals + plan selectors
│   │   ├── Layer2ActualVsPlan.jsx  # Actual vs Plan: 3 chart visuals + stacked bar
│   │   ├── Layer3GeoMap.jsx    # World map with accuracy markers + summary table
│   │   └── hes/                # HES Forecasting page (all new, 2026-07-02; named "capacity/" until the same-day rename)
│   │       ├── HesForecastingPage.jsx  # Page body: filters + cards + 4 layers (no RCA/CLCA sidebar)
│   │       ├── HesFilterPanel.jsx      # 7 filters: LOB / FY-Qtr-Month-Week / Business Partner-Global Grouping
│   │       ├── HesChartKit.jsx         # Shared chart primitives (Visual wrapper, Tip, PlanDropdowns, truncate, etc.)
│   │       ├── HesMetricCards.jsx      # 5 KPI cards + drill-down panel (ASU/SR/CPASU/UCR/UCR-Impacted-SR)
│   │       ├── AsuLayer.jsx            # Layer 01 — Actual vs Plan, Plan-on-Plan, Plan Impact Analysis (region→LOB drill)
│   │       ├── SrLayer.jsx             # Layer 02 — same structure as AsuLayer, SR metric
│   │       ├── AsuSrTrendLayer.jsx     # Layer 03 — ASU/SR+CPASU trend (Region/Country), UCR Impact, UCR Runrate+non-adherent queues
│   │       └── HesGeoMap.jsx           # Layer 04 — choropleth by LOB adherence per region
│   └── data/
│       ├── mockData.js         # ESG Forecasting page's static mock data (CQNs, plans, KPIs, geo) — also exports matchesMulti, REGIONS,
│       │                         regionForCountry, and other primitives hesData.js reuses
│       └── hesData.js          # HES Forecasting page's data model (LOB list, ASU/SR/UCR series, LOB_QUEUES, region-impact deltas)
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
│   └── Visual3           — Diverging horizontal Bar: cqnPlanVariance(filters), green/red Cell by sign
├── Layer2ActualVsPlan(filters) — Collapsible section, always at Fiscal Year granularity
│   ├── Visual1           — ComposedChart: actualVsPlanByFY(filters) + Adherence% line
│   ├── Visual2           — Stacked BarChart: stackedAdherenceByFY(filters), LabelList per segment
│   └── Visual3           — Diverging horizontal Bar: cqnActualVariance(filters), green/red Cell by sign
├── RcaClcaPanel          — Sticky sidebar (position: sticky), full height of the dashboard;
│                            static illustrative RCA/CLCA bullet content, no filters prop
└── Layer3GeoMap(filters) — Collapsible section
    ├── ComposableMap     — react-simple-maps world SVG, choropleth fill (no markers)
    │                        via regionForCountry/subRegionForCountry lookups
    └── Summary table     — geoRegionData(filters) or geoSubRegionRows(filters), by view mode
```

### HesForecastingPage (rendered instead of ForecastingPage when the header toggle is on "HES Forecasting")

```
HesForecastingPage
├── HesFilterPanel        — Controlled: filters state lifted to HesForecastingPage
├── HesMetricCards(filters) — hesCardData(filters) recomputed on every change
│   └── DrillDownModal     — Popup (HesChartKit's Modal), one of TotalQueuesSection/AsuTrendChart/
│                            SrDbOspChart/CpasuChart/CurrentUcrChart; closing it only clears local
│                            `active` state, filters prop is untouched
├── AsuLayer(filters)     — "ASU Trend", collapsible, badge "01"
│   ├── Visual1 "Actuals vs Plan Comparison"  — ComposedChart: asuByFY(filters) + Adherence% line, "Plan Name" dropdown
│   ├── Visual2 "Plan vs Plan Comparison"     — ComposedChart: asuPlanVsPlanByFY(filters) + Variance% line, Plan A/B dropdowns
│   └── Visual3 "Plan Impact"                 — ComposedChart: asuRegionPlans(filters) grouped bars (AMER/APJ/EMEA/Global);
│                                                clicking a region bar renders asuLobImpact(region) as an inline delta list
├── SrLayer(filters)      — "SR Trend", collapsible, badge "02"; same 3-visual structure/names as AsuLayer, SR metric
├── AsuSrTrendLayer(filters) — "ASU/UCR Impact on SR Analysis", collapsible, badge "03"
│   ├── Visual1 "CPASU Trend" — ComposedChart: cpasuByRegion(filters) grouped bars/line by default (one group per
│   │                           IMPACT_REGIONS entry); clicking a region switches to cpasuTrendByRegion(filters, region)
│   │                           at whichever granularity regionTrendGranularity(filters) resolves to (Week > Quarter > Year)
│   ├── Visual2 "UCR Impact on SR" — BarChart: srBotsByFY(filters), humanSR ("SR's") + botsSR ("UCR Handled SR's") stacked,
│   │                                SR Plan as a separate bar; PlanSelect in the corner (cornerControls, unwired)
│   └── Visual3 "UCR Runrate with Target" — ComposedChart: UCR_BY_FY directly (always all 3 FYs, ignores
│                                            Quarter/Week filters); clicking a year's bar opens a Modal listing
│                                            topNonAdherentLobsByYear(filters, year) — top 5 LOBs, not queues
└── HesGeoMap(filters)    — Collapsible, badge "04"; same choropleth mechanism as Layer3GeoMap,
                            colored by geoAdherenceByRegion(filters); no Region/Sub-region toggle

HesRcaClcaPanel — sticky sidebar (position: sticky) alongside the 4 layers above, starting at the
                  "Analysis Layers" divider — same layout as ForecastingPage's RcaClcaPanel, own
                  illustrative content written for this page's ASU/SR/CPASU/UCR metrics
```

---

## State Management

No external state library. All state is local React `useState`:

| Component | State | Type |
|---|---|---|
| `App` | `page` ('forecasting'\|'hes') | String |
| `ForecastingPage` | `filters` | Object (12 filter keys) |
| `MetricCards` | `active` (drill-down) | String or null |
| `Layer1PlanOverPlan` | `plans` (planA/planB, reset by `filters.planName` via `useEffect`), `open` | Object, Boolean |
| `Layer2ActualVsPlan` | `plan` (reset by `filters.planName` via `useEffect`), `open` | String, Boolean |
| `Layer3GeoMap` | `viewMode` (Region/Country), `hovered`, `open` | String, Object, Boolean |
| `HesForecastingPage` | `filters` | Object (7 filter keys) |
| `HesMetricCards` | `active` (which card's modal is open); `TotalQueuesSection`'s `selectedRegion` (donut drill) | String or null, String or null |
| `AsuLayer` / `SrLayer` | `plan`, `plans` (planA/planB), `open`, `selectedRegion` (Visual3 drill state) | String, Object, Boolean, String or null |
| `AsuSrTrendLayer` | `open`; Visual1's `selectedRegion` (CPASU Trend drill); Visual2's `plan`; Visual3's `modalYear` | Boolean, String or null, String, String or null |
| `HesGeoMap` | `open`, `hovered` | Boolean, Object |

`filters` flows down as a prop to `MetricCards`, all three layers, and every Visual sub-component. Each chart/card recomputes its data via `useMemo(() => selectorFn(filters), [filters])`, calling into the selector functions exported from `mockData.js` (see Data Model). No FY/Quarter/Week drill-toggle state exists anymore — those were removed; the top filter bar's Fiscal Year/Quarter/Week filters are the only time control, and charts render at Fiscal Year granularity only.

---

## Data Model (`src/data/mockData.js`)

All 12 filters funnel into a small set of selector functions that take `filters` and return the exact data a chart/card needs. Static exports (all-caps) are the underlying datasets; lowercase functions are the live selectors components actually call.

**Filter value shape:** every filter except `dbOsp` is multi-select — its value is an array (`[]` = no selection = matches everything). `dbOsp` alone stays a plain string (`'DB'|'OSP'|'All'`) since it's a 3-way segmented pill (`FilterPanel.jsx`), not a searchable dropdown (`MultiSelectField.jsx`). `matchesMulti(selected, value)` in `mockData.js` is the shared "is this row in scope" check for array-valued filters.

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
  channel, businessPartner, region, subRegion, l5Manager (each an array via matchesMulti),
  plus dbOsp (single string, 'All' passes through)
effectiveFiscalYears(filters) — Week > Quarter > Year precedence → an array of matching
  FY strings (all 3 if nothing's selected; can span multiple years if the selection does)
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
callVolumeByFY(filters) — {period, offered, handled} per FY, narrowed to effectiveFiscalYears(filters);
  scaled by filterQueues(filters).length/199 off a per-FY baseline (BASE_CALL_VOLUME_BY_FY) that
  sums to the same 285.4K/268.7K totals as cardData's callVolume. Backs the Call Volume drill-down.
dbOspVolumeByFY(filters) — {period, db, osp} per FY: same BASE_CALL_VOLUME_BY_FY.offered baseline,
  split by each in-scope queue's dbOsp tag. Ignores filters.dbOsp itself (unlike callVolumeByFY) —
  every other filter still narrows the candidate queues. Backs the DB/OSP Split drill-down.
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

### Geo Map choropleth (`Layer3GeoMap.jsx`)
```
regionForCountry(name) — exact world-atlas topojson country name → 'NAMER'|'LATAM'|'APJ'|'EMEA'
  (everything not NAMER/LATAM/APJ and not Antarctica/Fr. S. Antarctic Lands defaults to EMEA —
  full-map coverage by elimination, illustrative continental split, not authoritative)
SUB_REGION_ACCURACY — accuracy per each of the 24 real SUB_REGIONS values, static/illustrative
subRegionForCountry(name) — country → one of the 24 sub-region keys, or null if unmapped
  ('Global' and 'Multiple SubRegions' are never mapped — they aren't places)
activeSubRegionKeys(filters) — filters.subRegion if set, else sub-regions whose representative
  country falls in a selected filters.region, else null (= show all)
geoRegionData(filters) / geoSubRegionRows(filters) — table rows for the summary table under the map
```
`Layer3GeoMap.jsx` fills each `<Geography>` by looking up its accuracy via the functions above
(no per-country lat/lng markers). In Sub-region view, a country with no specific sub-region tag
falls back to its parent region's accuracy at 35% opacity — full map coverage, but named
sub-regions still visually stand out at full opacity against the dimmed background.

### Layer 1 Data (Plan over Plan) — always Fiscal Year granularity
```
PLAN_VS_PLAN_BY_FY      — period, plan1, plan2, variance (computed getter) — 3 FYs, static
PLAN_VS_PLAN_BY_REGION  — region, plan1, plan2, variance — 5 regions, static
planOverPlanByFY(filters)     — PLAN_VS_PLAN_BY_FY narrowed to effectiveFiscalYears(filters)
planOverPlanByRegion(filters) — PLAN_VS_PLAN_BY_REGION narrowed to filters.region
cqnPlanVariance(filters, topN=5) — filterQueues({...filters, dbOsp:'All'}) → top-N by |planVariance|,
                                     or exactly the selected queues if filters.cqn is set.
                                     Rendered as a diverging bar (green ahead / red behind zero).
```

### Layer 2 Data (Actual vs Plan) — always Fiscal Year granularity
```
ACTUAL_VS_PLAN_BY_FY   — period, actual, plan, adherence (computed getter) — 3 FYs, static
STACKED_ADHERENCE      — fy, under10, between10and20, between20and30, above30 (% buckets,
                          bucketed by |variance| magnitude, not accuracy tier) — 3 FYs, static
actualVsPlanByFY(filters)      — ACTUAL_VS_PLAN_BY_FY narrowed to effectiveFiscalYears(filters)
stackedAdherenceByFY(filters)  — STACKED_ADHERENCE narrowed to effectiveFiscalYears(filters)
cqnActualVariance(filters, topN=5) — same queue scoping as cqnPlanVariance, ranked by |actual-vs-plan
                                       variance| (also a diverging bar, same green/red convention)
```

### Layer 3 Data (Geo) — see "Geo Map choropleth" above for the country-lookup functions
```
GEO_REGION_DATA — { region, accuracy, label } ×4 regions (NAMER/EMEA/APJ/LATAM — no 'Global' row)
geoRegionData(filters) — GEO_REGION_DATA narrowed to filters.region
```
Selecting Region = "Global" (or a Sub-region with no map presence) returns an empty array; `Layer3GeoMap.jsx` renders an explanatory empty state rather than a blank map.

---

## Data Model (`src/data/hesData.js`)

Same conventions as `mockData.js`: static exports are datasets, lowercase functions are the live selectors components call. Imports `FISCAL_YEARS`, `FISCAL_QUARTERS`, `FISCAL_WEEK_LIST`, `BUSINESS_PARTNERS`, `REGIONS`, `regionForCountry`, and `matchesMulti` from `mockData.js` rather than duplicating them.

### Constants
```
LOB_LIST              — 33 real LOB names (business-supplied verbatim)
GLOBAL_GROUPING_LIST  — ['Consumer', 'Commercial', 'Enterprise'] — inferred, not yet user-confirmed
FISCAL_MONTH_LIST     — FY25M01 ... FY27M12 (36 values, derived from FISCAL_YEARS) — filter only
IMPACT_REGIONS        — ['AMER', 'APJ', 'EMEA', 'Global'] — the 4-region set for Plan Impact
                         (AsuLayer/SrLayer Visual3) and for CPASU Trend's region breakdown
                         (AsuSrTrendLayer Visual1), distinct from the 5-region REGIONS
LOB_QUEUES            — { 'High End Storage': { active: [...71 real names], inactive: [...~150 real names] } }
                         (business-supplied verbatim); other LOBs have no entry yet. Backs
                         HES_ACTIVE_QUEUE_NAMES/HES_ACTIVE_QUEUES below (Total Queues card).
HES_ACTIVE_QUEUE_NAMES / HES_INACTIVE_QUEUE_NAMES — = LOB_QUEUES['High End Storage'].active/.inactive,
                         used as the page-level HES queue roster (not scoped to one LOB) since it's
                         the only real per-queue name data this page has
HES_ACTIVE_QUEUES     — HES_ACTIVE_QUEUE_NAMES.map(name => ({ name, region: inferRegion(name) })) —
                         inferRegion() is imported from mockData.js (newly exported), same
                         APJ/EMEA/LATAM/NAMER-prefix-else-Global logic as the Forecasting page's
                         own queue fact table. Backs the Total Queues card's region donut + table.
```

### LOB fact table
```
LOB_FACTS — LOB_LIST.map(...) → Array<{ lob, businessPartner, globalGrouping }>
  businessPartner/globalGrouping assigned round-robin (list[i % list.length]) — same
  "real names + illustrative structure" convention as ACTIVE_QUEUES in mockData.js
filterLobs(filters) — LOB_FACTS rows matching filters.lob / businessPartner / globalGrouping (matchesMulti)
hesEffectiveFiscalYears(filters) — Week > Month > Quarter > Year precedence
lobScopeRatio(filters) — filterLobs(filters).length / LOB_LIST.length, used to scale FY series
  so a narrower LOB selection produces proportionally smaller ASU/SR numbers
```

### ASU / SR / CPASU
```
ASU_BY_FY, SR_BY_FY               — {period, plan, actual, adherence (getter)} × 3 FYs, static
ASU_PLAN_VS_PLAN_BY_FY, SR_PLAN_VS_PLAN_BY_FY — {period, plan1, plan2, variance (getter)} × 3 FYs, static
asuByFY(filters) / srByFY(filters)                 — narrowed to hesEffectiveFiscalYears, scaled by lobScopeRatio
asuPlanVsPlanByFY(filters) / srPlanVsPlanByFY(filters) — same narrowing + scaling
cpasuByFY(filters) — cpasu = sr.actual / asu.actual per period, rounded to 2 decimals (backs the CPASU card + drill-down)
```

### UCR
```
UCR_BY_FY — {period, target, current, adherence (getter)} × 3 FYs, static (BASE_UCR_TARGET 82/85/88).
  AsuSrTrendLayer Visual3 renders this array directly (not through ucrByFY) so it always shows all 3
  FYs regardless of Quarter/Week filter narrowing.
ucrByFY(filters) — narrowed to hesEffectiveFiscalYears; still used by the Current UCR card's drill-down
ucrImpactedSrByFY(filters) — {period, actualSR, srDeflected} — srDeflected ≈ 8-11% of actualSR, illustrative
srBotsByFY(filters) — {period, humanSR, botsSR (~35% of actual), plan} — rendered as "SR's" / "UCR Handled
  SR's" in AsuSrTrendLayer Visual2 (display names only; data keys unchanged)
srDbOspByFY(filters) — {period, db (~70% of actual), osp} — backs the Service Requests card's drill-down,
  rendered as grouped columns (not stacked)
topNonAdherentLobsByYear(filters, fy, count=5) — {lob, runrate, target} × count, sorted ascending by
  runrate (worst first). Backs the "UCR Runrate with Target" year-click modal (AsuSrTrendLayer Visual3).
  Replaced the old ucrNonAdherentQueues() (queue-level, removed 2026-07-02) now that the drill-down is
  LOB-level.
```

### Region / LOB impact ("Plan Impact" drill-down)
```
ASU_REGION_PLANS, SR_REGION_PLANS — {region, planA, planB} × 4 IMPACT_REGIONS, static
asuRegionPlans(filters) / srRegionPlans(filters) — currently ignore filters (deck shows a fixed region view)
buildLobImpact(base) — per region, computes a delta for all 33 LOBs via
  residue = (i*17 + ri*41) % 131; delta = round(base * 0.10 * (residue-65)/65)
  17 is coprime with the prime modulus 131, so i → i*17 mod 131 is injective over i=0..32 — every
  LOB gets a distinct delta within a region. (Fixed 2026-07-02: the original `(i*7+ri*13)%21` formula
  only produced 3 distinct buckets, so several LOBs showed an identical delta value.)
asuLobImpact(region, count=6) / srLobImpact(region, count=6) — top-N by ascending delta, clicked from
  the region bar in AsuLayer/SrLayer Visual3
```

### CPASU Trend: region breakdown + time-granularity drill (AsuSrTrendLayer Visual1)
```
REGION_SHARE — { AMER: 0.38, EMEA: 0.27, APJ: 0.22, Global: 0.13 } — illustrative share-of-total
  split of the latest FY's aggregate ASU/SR across the 4 IMPACT_REGIONS
cpasuByRegion(filters) — {region, asu, sr, cpasu} × 4, the default (region) view: splits the latest
  in-scope FY's cpasuByFY() snapshot by REGION_SHARE
regionTrendGranularity(filters) — Week > Quarter > Year precedence over the top filter bar's time
  filters → {granularity, periods}; periods are real distinct values (e.g. the selected fiscal weeks),
  not collapsed to years like hesEffectiveFiscalYears
cpasuTrendByRegion(filters, region) — {period, asu, sr, cpasu} × periods.length, the drill-down view once
  a region is clicked: divides each period's year's ASU/SR baseline by periodsPerYear(granularity)
  (52 for Week, 4 for Quarter, 1 for Year), scaled by REGION_SHARE, lobScopeRatio, and a small
  deterministic per-period/region wobble — fully synthetic, no real per-region/quarter/week dataset exists
```

### Geo Map (LOB adherence)
```
lobAdherenceValue(regionIndex, lobIndex) = 65 + ((regionIndex*7 + lobIndex*11) % 30) — illustrative
geoAdherenceByRegion(filters) — averages adherence across filterLobs(filters) (or all 33 LOBs if
  none selected) for each of the 5 REGIONS; consumed by HesGeoMap's choropleth fill
```

### Cards
```
hesCardData(filters) → { totalQueues, asuActuals, srActuals, cpasu, currentUcr }, each the
  latest-FY snapshot (asu[asu.length-1] etc.) off the selector functions above, except totalQueues
  ({ active, inactive } = HES_ACTIVE_QUEUE_NAMES.length/HES_INACTIVE_QUEUE_NAMES.length), which
  ignores filters entirely. asuActuals/srActuals/cpasu additionally carry { period, prevPeriod,
  yoyPct } — yoyPct is the % change vs the prior in-scope FY (null if there isn't one), backing
  each card's "YTD <period>: ... vs <prevPeriod>" sub-message.
```

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
7. `LOB_QUEUES['High End Storage']`'s real active/inactive queue names now back the HES Forecasting Total Queues card, but are treated as the whole page's queue roster rather than scoped to that one LOB — the only real per-queue name data this page has (see `design_choice.md`); revisit if real per-LOB queue lists arrive for the other 32 LOBs
8. `GLOBAL_GROUPING_LIST` (HES Forecasting) is an inference from an older PPT note, not explicitly confirmed by the user — revisit if it turns out to be wrong
9. HES Forecasting's Geo Map has no Region/Sub-region toggle (unlike ESG Forecasting's) since the source deck only specifies a region-level view; ASU/SR region-plan visuals (`asuRegionPlans`/`srRegionPlans`) also don't yet respond to filters, since the deck shows a fixed region view
10. CPASU Trend's region-and-time drill-down (`cpasuTrendByRegion`) is fully synthetic — no real per-region/per-quarter/per-week ASU/SR dataset exists, same mock-data convention as everything else on this page
11. The Plan Name selector on "UCR Impact on SR" (AsuSrTrendLayer Visual2) doesn't yet feed into `srBotsByFY()` — cosmetic for now, same as AsuLayer/SrLayer Visual1's Plan dropdown
12. HES Forecasting's RCA/CLCA sidebar (`HesRcaClcaPanel.jsx`) is static illustrative example content, same as the Forecasting page's `RcaClcaPanel` — not yet connected to a real RCA workflow
