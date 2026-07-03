# Technical Specification — ISG SPoG ESG Forecasting Dashboard

## Overview
A React application that renders an analytics dashboard for Dell's ISG Business, entered through an **"ISG SPoG" landing page** with two tiles — **ESG** and **HES**. Each business section has its own internal Forecasting/Capacity Plan toggle in the header, so there are effectively **4 pages**: **ESG Forecasting** (call volume plans, actuals vs plan adherence, geographic accuracy distribution), **ESG Capacity Plan** (staffing, utilization, attrition, SL%), **HES Forecasting** (ASU/SR/UCR service-unit tracking, built from slides 5–6 of `SPOG_views.pptx`; briefly named "ESG Capacity Planning" before a 2026-07-02 rename), and **HES Capacity Plan** (FTE, attrition, workload distribution incl. a Sankey diagram, SLO). A home button next to the header logo returns to the landing tiles from either business section. All data is currently mocked — no backend — but every filter on every page is fully live: each recomputes cards and charts from a shared, filterable fact table (see Data Model below).

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
│   ├── App.jsx                 # Shell: header + page toggle + theme toggle + footer
│   ├── index.css               # Tailwind imports + theme CSS variables (:root / [data-theme='light']) +
│   │                              global scrollbar/select/card/tooltip/etc. component classes
│   ├── components/
│   │   ├── LandingPage.jsx     # "ISG SPoG" title + ESG/HES tiles — the app's entry point (2026-07-03)
│   │   ├── ForecastingPage.jsx # ESG Forecasting page body (filters + cards + 3 layers + RCA/CLCA sidebar)
│   │   ├── SectionDivider.jsx  # Shared "KEY METRICS" / "ANALYSIS LAYERS" section label, used by every page
│   │   ├── Modal.jsx           # Shared popup modal — used by every page's Key Metrics card drill-downs
│   │   ├── GranularityToggle.jsx # Shared Quarter/Month/Week "View By" pill — page-wide chart-axis setting, used by every filter bar
│   │   ├── ChartKit.jsx        # Shared chart primitives (Visual, Tip, PlanDropdowns, PlanSelect, CategoryTick,
│   │   │                         truncate, BinaryToggle) — promoted from hes/HesChartKit.jsx (2026-07-03) so both
│   │   │                         Capacity pages and both Forecasting pages share one implementation
│   │   ├── FilterPanel.jsx     # 12 filters in 4 icon-labeled clusters (Scope/Time/People/Geography) + applied-filter chips + GranularityToggle
│   │   ├── MetricCards.jsx     # 5 KPI cards, each opening its drill-down in Modal
│   │   ├── Layer1PlanOverPlan.jsx  # Plan vs Plan: 3 chart visuals + plan selectors
│   │   ├── Layer2ActualVsPlan.jsx  # Actual vs Plan: 3 chart visuals + stacked bar
│   │   ├── Layer3GeoMap.jsx    # World map with accuracy markers + summary table
│   │   ├── capacity/
│   │   │   └── PlanOverPlanLayer.jsx # Shared "Plan over Plan Headcount Comparison" layer — takes a
│   │   │                               dataFn(filters, granularity) prop so ESG/HES Capacity Plan both reuse it
│   │   ├── esgCapacity/         # ESG Capacity Plan page (all new, 2026-07-03)
│   │   │   ├── EsgCapacityPage.jsx        # Page body: filters + cards + 4 layers (no RCA/CLCA sidebar)
│   │   │   ├── EsgCapacityFilterPanel.jsx # Scope/Time/People/Geography clusters + DB/OSP pill + GranularityToggle
│   │   │   ├── EsgCapacityMetricCards.jsx # 5 KPI cards (Staffing/Utilization/SL%/Total FTE/Attrition), Modal drill-downs
│   │   │   ├── HeadcountLayer.jsx         # Layer 01 "Headcount and SL%" — staffing summary, attrition, actual-vs-plan+SL%+defaulters
│   │   │   ├── UtilizationLayer.jsx       # Layer 03 "Utilization" — actual-vs-target trend w/ Aux tooltip, per-queue Aux ranking, leaves ranking
│   │   │   └── EsgCapacityGeoMap.jsx      # Layer 04 — dual toggle (Headcount/SL% metric × Region/Country view)
│   │   └── hesCapacity/         # HES Capacity Plan page (all new, 2026-07-03)
│   │       ├── HesCapacityPage.jsx           # Page body: filters (reuses hes/HesFilterPanel.jsx directly) + cards + 4 layers
│   │       ├── HesCapacityMetricCards.jsx    # 5 KPI cards (Total FTE/Attrition/Cases per FTE/Avg Case Time/Global SLO)
│   │       ├── HeadcountAttritionLayer.jsx   # Layer 01 — staffing summary, attrition, actual-vs-plan utilization
│   │       ├── WorkloadDistributionLayer.jsx # Layer 03 — Sankey (CQN tiers→LOB), workload act-vs-plan, ACT trend
│   │       └── HesCapacityGeoMap.jsx         # Layer 04 (mockup labels it "Layer 5", renumbered — see design_choice.md) — SLO by region
│   │   └── hes/                # HES Forecasting page (all new, 2026-07-02; named "capacity/" until the same-day rename)
│   │       ├── HesForecastingPage.jsx  # Page body: filters + cards + 4 layers + RCA/CLCA sidebar
│   │       ├── HesFilterPanel.jsx      # 7 filters: LOB / FY-Qtr-Month-Week / Business Partner-Global Grouping + GranularityToggle;
│   │       │                            reused directly (unmodified) by hesCapacity/HesCapacityPage.jsx — identical field set
│   │       ├── HesChartKit.jsx         # Re-export shim: `export { Modal } from '../Modal'; export * from '../ChartKit'`
│   │       │                            (was the canonical implementation until ChartKit.jsx was promoted, 2026-07-03)
│   │       ├── HesMetricCards.jsx      # 5 KPI cards, each opening its drill-down in Modal (Total Queues/ASU/SR/CPASU/UCR)
│   │       ├── HesRcaClcaPanel.jsx     # Sticky RCA/CLCA sidebar, HES-specific illustrative content
│   │       ├── AsuLayer.jsx            # Layer 01 "ASU Trend" — Actuals vs Plan, Plan vs Plan, Plan Impact (region→LOB drill)
│   │       ├── SrLayer.jsx             # Layer 02 "SR Trend" — same structure as AsuLayer, SR metric
│   │       ├── AsuSrTrendLayer.jsx     # Layer 03 "ASU/UCR Impact on SR Analysis" — CPASU Trend, UCR Impact on SR, UCR Runrate+top-5-LOB modal
│   │       └── HesGeoMap.jsx           # Layer 04 — choropleth by LOB adherence per region
│   └── data/
│       ├── mockData.js         # ESG Forecasting page's static mock data (CQNs, plans, KPIs, geo) — also exports matchesMulti, REGIONS,
│       │                         regionForCountry, CAPACITY_PLAN_NAMES, BUSINESS_ORGS, COUNTRIES/COUNTRY_REGION
│       │                         (2026-07-03), and other primitives hesData.js/esgCapacityData.js/hesCapacityData.js reuse
│       ├── hesData.js          # HES Forecasting page's data model (LOB list, ASU/SR/UCR series, LOB_QUEUES, region-impact deltas)
│       ├── esgCapacityData.js  # ESG Capacity Plan's data model (queue-level HC/utilization/SL/leaves fact table)
│       └── hesCapacityData.js  # HES Capacity Plan's data model (reuses hesData.js's LOB_FACTS/filterLobs directly)
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
│   └── DrillDownModal    — Popup (shared Modal component), toggled by card click; rows scoped to match the
│                            clicked card; closing it only clears local `active` state, filters untouched
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

### App (2026-07-03 restructure): landing tiles + per-business sub-toggle

```
App
├── view state: 'landing' | 'esg' | 'hes' — top-level; no router, same reasoning as the original page toggle
├── esgSubPage / hesSubPage state: 'forecasting' | 'capacity' each, independent — switching business and back
│                                   doesn't reset the other business's last-viewed sub-page
├── <header>
│   ├── HomeButton (only rendered when view is 'esg'|'hes') — onClick sets view back to 'landing'
│   └── PageToggle (only rendered when view is 'esg'|'hes') — options = SUB_PAGES[view], drives esgSubPage/hesSubPage
├── LandingPage(onSelect=setView)          — rendered when view === 'landing'
├── ForecastingPage / EsgCapacityPage      — rendered when view === 'esg', by esgSubPage
└── HesForecastingPage / HesCapacityPage   — rendered when view === 'hes', by hesSubPage
```

### EsgCapacityPage (revised 2026-07-03 — see design_choice.md for the full rationale)

```
EsgCapacityPage
├── EsgCapacityFilterPanel  — Controlled: filters state lifted to EsgCapacityPage; combinedQueueName/
│                              capacityCode/planName(PLAN_NAMES)/fiscalYear/fiscalQuarter/fiscalWeek/
│                              channel/businessPartner/region/subRegion/dbOsp + GranularityToggle
│                              (businessOrg and country were removed; subRegion replaced country)
├── EsgCapacityMetricCards(filters, granularity) — capacityCardData(filters, granularity); 5 cards with
│   │                          YTD/YoY sub-messages (ytdSub helper, same pattern as HesMetricCards.jsx),
│   │                          each a Modal drill-down
│   └── DrillDownModal — StaffingTrendChart / UtilizationTrendChart / SlTrendChart (line-only) / AttritionTrendChart
├── HeadcountLayer(filters, granularity)   — badge "01"
│   ├── Visual1 "Actual vs Plan Variation" (renamed) — ComposedChart: hcStaffingByFY(filters, granularity),
│   │                                                   PlanSelect now offers PLAN_NAMES; line renamed "Variation %"
│   ├── Visual2 "Attrition"          — Region/Sub-region-level default (attritionByDimension), click a bar to
│   │                                   drill into attritionTrendByDimension(filters, key, dimension, granularity);
│   │                                   custom tooltip also shows the raw attritionCount, not just the %
│   └── Visual3 "Headcount Impact on SL" (renamed) — ComposedChart: slTrendByFY(filters, granularity);
│                                                     Region/Country toggle removed; defaulter list below now
│                                                     slDefaulterQueues(filters) — actual>plan AND SL<90
├── PlanOverPlanVariationLayer(filters, granularity) — ESG-specific (no longer the shared component), badge "02"
│   ├── MainChart "Plan over Plan Variation" (renamed) — Region/Sub-region default view (planOverPlanByDimension),
│   │                                                     click a bar to drill into planOverPlanTrendByDimension
│   └── QueueVarianceChart "Queues with Highest Variation" — diverging horizontal bars: planOverPlanQueueVariance(filters),
│                                                             worst |variance| first, value-labeled (same polish as
│                                                             Forecasting's Top Queues by Variance charts)
├── UtilizationLayer(filters, granularity) — renamed "Utilization and Outage Analysis", badge "03"
│   ├── Visual1 "Actual vs Target Utilization"     — time-axis BarChart+Line: utilizationByFY(filters, granularity)
│   │                                                 now includes an Adherence % line; tooltip shows top-3 auxBreakdown
│   ├── Visual2 "Utilization Defaulter Queues" (renamed) — queue-axis horizontal bars: utilizationByQueue(filters),
│   │                                                       each queue's tooltip now lists 2-3 auxes
│   └── Visual3 "Leave Impact — Actual vs Target" (renamed) — queue-axis horizontal bars: leavesByQueue(filters), ascending
└── EsgCapacityGeoMap(filters)              — badge "04"; dual BinaryToggle (Headcount/SL% metric × Region/Sub-region view,
                                               replacing the earlier curated-14-country view)

No RCA/CLCA sidebar — not specified in this page's mockups.
```

### HesCapacityPage

```
HesCapacityPage
├── HesFilterPanel(filters, onChange, granularity, onGranularityChange) — reused directly from hes/HesFilterPanel.jsx,
│                                                                          unmodified (identical field set: LOB/FY-Qtr-
│                                                                          Month-Week/Business Partner/Global Grouping)
├── HesCapacityMetricCards(filters, granularity) — hesCapacityCardData(filters); 5 cards, each a Modal drill-down
│   └── DrillDownModal — FteTrendChart / AttritionTrendChart / CasesPerFteTrendChart (line) /
│                         AvgCaseTimeTrendChart (line) / GlobalSloByRegionChart (bar)
├── HeadcountAttritionLayer(filters, granularity) — badge "01"
│   ├── Visual1 "Actual vs Plan Summary"      — ComposedChart: fteByFY(filters, granularity)
│   ├── Visual2 "Attrition"                    — ComposedChart: hesAttritionByFY(filters, granularity, lens), Region/Country toggle
│   └── Visual3 "Actual vs Plan Utilization"   — ComposedChart: hesUtilByFY(filters, granularity, lens), Region/Country toggle
├── PlanOverPlanLayer(filters, granularity, dataFn=planOverPlanFteByFY) — shared component, badge "02"
├── WorkloadDistributionLayer(filters, granularity) — badge "03"
│   ├── Visual1 "Workload Flow — CQN to LOB"  — recharts Sankey: workloadSankey(filters), custom labeled SankeyNode
│   ├── Visual2 "Workload Act vs Plan"        — BarChart: workloadByFY(filters, granularity)
│   └── Visual3 "ACT Trend — Actual vs Plan"  — LineChart: actHrsByFY(filters, granularity) (rate-preserving expansion)
└── HesCapacityGeoMap(filters)                — badge "04" (mockup calls it "Layer 5", renumbered — see design_choice.md);
                                                 single-metric SLO-by-region choropleth, no metric/view toggle

No RCA/CLCA sidebar — not specified in this page's mockups.
```

---

## Theming (2026-07-02)

CSS custom properties in `src/index.css`, not a second stylesheet or CSS-in-JS. `:root` defines the dark
(default) values; `[data-theme='light']` on `<html>` overrides them. `App.jsx` owns the `theme` state
(`'dark'|'light'`), applies the attribute, and persists the choice to `localStorage` (`isg-spog-theme`) —
set inside the `useState` initializer (not a `useEffect`) so the attribute is applied before first paint,
avoiding a flash of the wrong theme.

```
--bg-page / --bg-panel / --bg-raised / --bg-inset     — 4 background depth levels
--border-subtle / --border-default / --border-strong  — border opacity tiers
--text-primary / --text-secondary / --text-dim / --text-faint / --text-muted — text hierarchy
--accent, --accent-contrast                            — brand accent + its readable-on-fill text color
--accent-dim, --accent-glow                            — low-opacity accent tints
--tooltip-bg, --chart-grid, --select-bg(-hover)         — component-specific tokens
--scrollbar-track/-thumb(-hover), --shadow-card(-hover/-active) — misc
```

Every shared CSS class (`.card-panel`, `.chart-panel`, `.layer-header`, `.select-dark`, `.ms-*`,
`.filter-chip`, `.drill-toggle`/`.drill-btn`, `.chart-tooltip`, `.theme-toggle`, scrollbars, `body`) and
almost every component's inline background/border/text-color style reference these variables instead of
hardcoded hex — see `design_choice.md` for the full file list and the categories left un-themed on
purpose (chart series/data colors, region palettes, the geo accuracy scale, status badges, geo map
canvases). `.select-dark`'s embedded data-URI chevron SVG is the one exception that structurally can't
follow the theme (a baked-in `stroke` inside a `background-image: url("data:image/svg+xml,...")` can't
reference a page-level CSS variable) — it uses a fixed neutral slate that reads acceptably on both.

---

## Global Time-Granularity Toggle (2026-07-02)

`GranularityToggle.jsx` (shared) renders a Quarter/Month/Week pill inside both filter bars. The value lives
in `ForecastingPage`/`HesForecastingPage` state (`granularity`, default `null` — no selection, meaning Fiscal
Year, same convention as every value filter defaulting to "All") alongside `filters`,
and flows down as a plain prop to every chart-rendering component — no context, no separate store, same
pattern as `filters` itself.

Shared math, in `mockData.js` (imported by `hesData.js` where needed):
```
FISCAL_MONTH_LIST                      — FY25M01...FY27M12 (36 values); canonical here now, hesData.js re-exports it
periodsForGranularity(granularity, years) — returns the ordered FISCAL_QUARTERS/FISCAL_MONTH_LIST/FISCAL_WEEK_LIST
                                             slice matching the given years, based on granularity ('Month'|'Week'|else Quarter)
expandToGranularity(fySeries, granularity, rawFields) — for ADDITIVE fields (volumes, counts, dollars):
                                             divides each FY row's listed fields across its sub-periods
                                             (÷4 Quarter, ÷12 Month, ÷52 Week) with a small deterministic
                                             wobble; returns fySeries unchanged if granularity is falsy/'Year'
expandRateToGranularity(fySeries, granularity, rateFields) — for RATE fields (percentages, targets):
                                             keeps each field at the parent FY's magnitude across every
                                             sub-period (wobble only, no division) — dividing a percentage
                                             by a period count would be meaningless
```

Selectors that accept a `granularity` argument (all default to `undefined`/`'Year'` — i.e. unchanged FY
behavior — when omitted, so any caller that doesn't pass one still works):
```
mockData.js:  planOverPlanByFY, actualVsPlanByFY, stackedAdherenceByFY (own bespoke expansion — renormalizes
              % buckets rather than dividing them), callVolumeByFY, dbOspVolumeByFY
hesData.js:   asuByFY, srByFY, asuPlanVsPlanByFY, srPlanVsPlanByFY, cpasuByFY (derives from the above, no
              separate expansion needed), ucrByFY (uses expandRateToGranularity — see design_choice.md for
              the bug this avoided), srBotsByFY, srDbOspByFY (both derive from srByFY, no separate expansion),
              regionTrendGranularity(filters, granularity) / cpasuTrendByRegion(filters, region, granularity)
              — granularity now comes from the global toggle, not inferred from which time filter was selected
```

`topNonAdherentLobsByYear(filters, period, count)` (HES) was generalized to derive its target fiscal year via
`period.slice(0, 4)`, since the "UCR Runrate with Target" chart it backs now renders at whatever granularity
is selected — a clicked bar can carry a quarter/month/week label, not just a bare fiscal year.

Charts whose x-axis isn't time — region (Plan Impact, both Geo Maps), queue (Top Queues by Variance), or
LOB (the LOB donut breakdowns) — don't take a `granularity` argument at all; there's no sub-year view of
"which region," so the toggle doesn't apply to them by design.

---

## State Management

No external state library. All state is local React `useState`:

| Component | State | Type |
|---|---|---|
| `App` | `view` ('landing'\|'esg'\|'hes'); `esgSubPage`/`hesSubPage` ('forecasting'\|'capacity', independent, default 'forecasting'); `theme` ('dark'\|'light', persisted to localStorage) | String, String, String, String |
| `ForecastingPage` | `filters`; `granularity` (null\|'Quarter'\|'Month'\|'Week', default null = Fiscal Year) | Object (12 filter keys), String or null |
| `MetricCards` | `active` (which card's modal is open) | String or null |
| `Layer1PlanOverPlan` | `plans` (planA/planB, reset by `filters.planName` via `useEffect`), `open` | Object, Boolean |
| `Layer2ActualVsPlan` | `plan` (reset by `filters.planName` via `useEffect`), `open` | String, Boolean |
| `Layer3GeoMap` | `viewMode` (Region/Country), `hovered`, `open` | String, Object, Boolean |
| `HesForecastingPage` | `filters`; `granularity` (null\|'Quarter'\|'Month'\|'Week', default null = Fiscal Year) | Object (7 filter keys), String or null |
| `HesMetricCards` | `active` (which card's modal is open); `TotalQueuesSection`'s `selectedRegion` (donut drill) | String or null, String or null |
| `AsuLayer` / `SrLayer` | `plan`, `plans` (planA/planB), `open`, `selectedRegion` (Visual3 drill state) | String, Object, Boolean, String or null |
| `AsuSrTrendLayer` | `open`; Visual1's `selectedRegion` (CPASU Trend drill); Visual2's `plan`; Visual3's `modalPeriod` | Boolean, String or null, String, String or null |
| `HesGeoMap` | `open`, `hovered` | Boolean, Object |
| `EsgCapacityPage` / `HesCapacityPage` | `filters`; `granularity` (same null-default convention) | Object, String or null |
| `EsgCapacityMetricCards` / `HesCapacityMetricCards` | `active` (which card's modal is open) | String or null |
| `PlanOverPlanLayer` (shared) | `open`, `plans` (planA/planB) | Boolean, Object |
| `HeadcountLayer` / `HeadcountAttritionLayer` / `UtilizationLayer` / `WorkloadDistributionLayer` | `open`; per-visual `lens` (Region/Country) where applicable | Boolean, String |
| `EsgCapacityGeoMap` | `open`, `metric` (Headcount/SL%), `viewMode` (Region/Country), `hovered` | Boolean, String, String, Object |
| `HesCapacityGeoMap` | `open`, `hovered` | Boolean, Object |

`filters` flows down as a prop to `MetricCards`, all three layers, and every Visual sub-component. Each chart/card recomputes its data via `useMemo(() => selectorFn(filters), [filters])`, calling into the selector functions exported from `mockData.js` (see Data Model). No FY/Quarter/Week drill-toggle state exists anymore — those were removed; the top filter bar's Fiscal Year/Quarter/Week filters are the only time control, and charts render at Fiscal Year granularity only.

---

## Data Model (`src/data/mockData.js`)

All 12 filters funnel into a small set of selector functions that take `filters` and return the exact data a chart/card needs. Static exports (all-caps) are the underlying datasets; lowercase functions are the live selectors components actually call.

**Filter value shape:** every filter except `dbOsp` is multi-select — its value is an array (`[]` = no selection = matches everything). `dbOsp` alone stays a plain string (`'DB'|'OSP'|'All'`) since it's a 3-way segmented pill (`FilterPanel.jsx`), not a searchable dropdown (`MultiSelectField.jsx`). `matchesMulti(selected, value)` in `mockData.js` is the shared "is this row in scope" check for array-valued filters.

### Constants
```
ACTIVE_QUEUE_NAMES   — 47 real active queue names (business-supplied; updated 2026-07-02, was 199)
INACTIVE_QUEUE_NAMES — 146 real inactive queue names (business-supplied, no UI yet; updated
                        2026-07-02, was 406)
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
                                                   285.4K/268.7K baseline by the filtered-vs-total-
                                                   active-queue ratio (DB/OSP genuinely scopes volume
                                                   here); the ratio's denominator is
                                                   ACTIVE_QUEUES.length, not a hardcoded count, so it
                                                   tracks whatever the active roster currently is
}
```

### Card drill-down selectors (`MetricCards.jsx`)
```
callVolumeByFY(filters) — {period, offered, handled} per FY, narrowed to effectiveFiscalYears(filters);
  scaled by filterQueues(filters).length/ACTIVE_QUEUES.length off a per-FY baseline
  (BASE_CALL_VOLUME_BY_FY) that sums to the same 285.4K/268.7K totals as cardData's callVolume.
  Backs the Call Volume drill-down.
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
UCR_BY_FY — {period, target, current, adherence (getter)} × 3 FYs, static (BASE_UCR_TARGET 82/85/88)
ucrByFY(filters, granularity) — narrowed to hesEffectiveFiscalYears, then expandRateToGranularity'd on
  target/current (see "Global Time-Granularity Toggle" above). Backs both the Current UCR card's
  drill-down and AsuSrTrendLayer Visual3 ("UCR Runrate with Target") — Visual3 used to render UCR_BY_FY
  directly to force always-FY regardless of filters; it now goes through ucrByFY(filters, granularity)
  like everything else, per the 2026-07-02 granularity-toggle change.
srBotsByFY(filters, granularity) — {period, humanSR, botsSR (~35% of actual), plan} — rendered as "SR's" /
  "UCR Handled SR's" in AsuSrTrendLayer Visual2 (display names only; data keys unchanged). Granularity
  flows through via srByFY(filters, granularity) internally; no separate expansion needed here.
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

## Data Model (`src/data/esgCapacityData.js`) — ESG Capacity Plan (2026-07-03, revised 2026-07-03)

Same conventions as `mockData.js`/`hesData.js`. Built from `ACTIVE_QUEUE_NAMES` (the same 47-queue roster ESG Forecasting uses) — every queue gets HC/utilization/SL/leaves fields in addition to Forecasting's existing tags. `subRegion` is read directly off `ACTIVE_QUEUES[i]` (same index, same source array) rather than independently assigned, so a queue's sub-region tag matches on both this page and ESG Forecasting.

```
AUX_CODES         — ['Aux 1' ... 'Aux 9'] — illustrative culprit-code taxonomy for utilization gaps
CAPACITY_QUEUES   — ACTIVE_QUEUE_NAMES.map(...) → Array<{
  name, region, subRegion, businessPartner, channel,
  planHC, actualHC, hcDelta (getter),
  utilTarget, utilActual, utilGap (getter), auxCulprit,
  slTarget, slActual,
  leavesPlan, leavesActual, leavesDelta (getter),
  popPlan1, popPlan2, popVariance (getter) — Plan-over-Plan headcount, distinct from planHC/actualHC
}>
filterCapacityQueues(filters) — narrows CAPACITY_QUEUES by combinedQueueName/capacityCode/channel/
  businessPartner/region/subRegion (matchesMulti) — businessOrg/country dropped 2026-07-03
shareByKey(rows, key) — deterministic {key: share} distribution of a queue set across 'region' or
  'subRegion', backing both the Attrition and Plan over Plan Variation region/sub-region drills
```

```
hcStaffingByFY(filters, granularity)       — {period, actual, plan, adherence} — HeadcountLayer Visual1 ("Actual vs Plan
                                              Variation") + FTE/Staffing card modal
attritionByFY(filters, granularity, lens)  — {period, headcount, attrition} — still backs the Attrition card's own Modal
                                              popup only (unchanged, "pop up view is good"); NOT used by HeadcountLayer
                                              Visual2 anymore, which uses the dimension selectors below instead
attritionByDimension(filters, dimension)   — {key, headcount, attrition, attritionCount} × regions or sub-regions —
  ('Region'|'SubRegion')                     HeadcountLayer Visual2's default view, sized by shareByKey
attritionTrendByDimension(filters, key,    — {period, headcount, attrition, attritionCount} — FY/granularity trend for
  dimension, granularity)                    one clicked region/sub-region key, same drill mechanic as hesData.js's cpasuTrendByRegion
slTrendByFY(filters, granularity)          — {period, actual, plan, slPct} — HeadcountLayer Visual3 ("Headcount Impact
                                              on SL") + SL% card modal
slDefaulterQueues(filters, count=6)        — queues where actualHC > planHC AND slActual < 90, sorted by slActual
                                              ascending (worst SL first) — replaces the old actual>plan-only defaulterQueues
planOverPlanByDimension(filters, dimension) — {key, plan1, plan2, variance} × regions or sub-regions — PlanOverPlanVariationLayer's
                                               MainChart default view, sized by shareByKey
planOverPlanTrendByDimension(filters, key, — {period, plan1, plan2, variance} — FY/granularity trend for one clicked key
  dimension, granularity)
planOverPlanQueueVariance(filters, topN=8)  — {name, plan1, plan2, variance} sorted by |variance| DESCENDING — the
                                               "Queues with Highest Variation" ranked chart, this page's headline visual
utilizationByFY(filters, granularity)      — {period, actual, target, adherence, auxBreakdown, auxCulprit, auxImpactPct} —
                                              auxBreakdown is the top-3 Aux codes by impact (auxCulprit/auxImpactPct kept
                                              for back-compat = auxBreakdown[0]); attached AFTER expansion (by array
                                              index), not passed through expandRateToGranularity, since Aux codes are
                                              categorical/non-numeric fields the expansion helpers don't carry
utilizationByQueue(filters, topN=6)        — queue-axis ranking, sorted by |utilGap| DESCENDING (worst first), each row
                                              now carries `auxes` (3 distinct Aux codes) instead of a single auxCulprit
leavesByQueue(filters, topN=6)             — queue-axis ranking: top-N by |leavesDelta| descending, then re-sorted ascending by
                                              delta for display (see design_choice.md for the bug this fixes)
capacityCardData(filters, granularity)     — {staffing, utilization, sl, totalFte, attrition}, each carrying
                                              {value/actual, period, prevPeriod, yoyPct} — headline value drills with
                                              granularity, yoyPct is always FY-over-FY (same split as hesCardData)
GEO_CAPACITY_BY_REGION / geoCapacityByRegion(filters) — {region, fulfillmentPct, slPct}
GEO_CAPACITY_BY_SUBREGION / geoCapacityBySubRegion(filters, metric) — {subRegion, value} × 24 real SUB_REGIONS values,
  replacing the earlier curated-14-country geoCapacityByCountry/COUNTRY_TO_WORLD_ATLAS_NAME machinery entirely
```

Business logic: Total FTE and Attrition % invert the usual "higher actual is better" framing — an increase YoY is BAD
(red) for both, since overstaffing/rising attrition are the problems being flagged; Utilization %/SL % keep the normal
"growth is good" framing. Plan Name filter options now come from `mockData.js`'s `PLAN_NAMES` (ESG Forecasting's own
list), not a page-specific plan list.

---

## Data Model (`src/data/hesCapacityData.js`) — HES Capacity Plan (2026-07-03)

Reuses `hesData.js`'s `LOB_LIST`, `LOB_FACTS`, `filterLobs`, `hesEffectiveFiscalYears` directly — this page's filter set is identical to HES Forecasting's, so no separate fact table or filter function was built for the base LOB scoping.

```
lobScopeRatio(filters) — filterLobs(filters).length / LOB_FACTS.length (local copy of hesData.js's private helper)
fteByFY(filters, granularity)             — {period, actual, plan, adherence} — Total FTE card + HeadcountAttritionLayer Visual1
hesAttritionByFY(filters, granularity, lens) — {period, headcount, attrition} — Attrition card + HeadcountAttritionLayer Visual2
hesUtilByFY(filters, granularity, lens)   — {period, actual, target, adherence} — HeadcountAttritionLayer Visual3
cpfByFY(filters, granularity)             — {period, actual, plan} — Cases per FTE card (rate-preserving expansion)
actHrsByFY(filters, granularity)          — {period, actual, plan} — Avg Case Time card + WorkloadDistributionLayer Visual3
  (rate-preserving expansion — avg case time is hours-per-case, not a summable volume)
geoSloByRegion() / HES_GEO_SLO_BY_REGION  — {region, slo} × 4 — backs the Global SLO card's region-breakdown modal + HesCapacityGeoMap;
  tuned so exactly 2 of 4 regions sit below the FY27 SLO target, matching the mockup's literal "2 regions at risk" card message
hesCapacityCardData(filters)              — {totalFte, attrition, casesPerFte, avgCaseTime, globalSlo} — latest-FY snapshot,
  globalSlo additionally carries regionsAtRisk (count of HES_GEO_SLO_BY_REGION rows below the latest FY's target)
planOverPlanFteByFY(filters, granularity) — {period, plan1, plan2, variance} — feeds the shared PlanOverPlanLayer
workloadSankey(filters)                   — {nodes, links} recharts Sankey shape: 3 illustrative CQN priority-tier source nodes
  (CQN-Standard/Critical/Enterprise) → 4 real LOB target nodes (Networking/Storage/Server/PowerScale), 12 links,
  each value scaled by lobScopeRatio(filters)
HES_CAPACITY_LOBS                         — LOB_FACTS.map(...) + {region, workloadPlan, workloadActual, actHrsPlan, actHrsActual} —
  per-LOB fact table backing workload/ACT figures (spreads LOB_FACTS's own businessPartner/globalGrouping tags rather than re-deriving them)
workloadByFY(filters, granularity)        — {period, actual, plan} — WorkloadDistributionLayer Visual2
```

Business logic is the mirror image of ESG Capacity's: Total FTE flags `actual < plan` (understaffed) as BAD (red), while Attrition/Cases-per-FTE/Avg-Case-Time flag `actual > plan` (overload) as BAD — both distinct, page-specific conventions honored literally from each page's own mockup rather than forced to match each other.

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
5. No drill-down UI for `INACTIVE_QUEUE_NAMES` (146 real names as of 2026-07-02) — only the count surfaces on the Total Queues card
6. Plan Name filter only pre-selects Plan A on Layer 1/2 — Plan B and the per-visual overrides are unaffected, by design (see `design_choice.md`)
7. `LOB_QUEUES['High End Storage']`'s real active/inactive queue names now back the HES Forecasting Total Queues card, but are treated as the whole page's queue roster rather than scoped to that one LOB — the only real per-queue name data this page has (see `design_choice.md`); revisit if real per-LOB queue lists arrive for the other 32 LOBs
8. `GLOBAL_GROUPING_LIST` (HES Forecasting) is an inference from an older PPT note, not explicitly confirmed by the user — revisit if it turns out to be wrong
9. HES Forecasting's Geo Map has no Region/Sub-region toggle (unlike ESG Forecasting's) since the source deck only specifies a region-level view; ASU/SR region-plan visuals (`asuRegionPlans`/`srRegionPlans`) also don't yet respond to filters, since the deck shows a fixed region view
10. CPASU Trend's region-and-time drill-down (`cpasuTrendByRegion`) is fully synthetic — no real per-region/per-quarter/per-week ASU/SR dataset exists, same mock-data convention as everything else on this page
11. The Plan Name selector on "UCR Impact on SR" (AsuSrTrendLayer Visual2) doesn't yet feed into `srBotsByFY()` — cosmetic for now, same as AsuLayer/SrLayer Visual1's Plan dropdown
12. HES Forecasting's RCA/CLCA sidebar (`HesRcaClcaPanel.jsx`) is static illustrative example content, same as the Forecasting page's `RcaClcaPanel` — not yet connected to a real RCA workflow
13. Neither Capacity Plan page has an RCA/CLCA sidebar — not specified in either page's mockups; revisit if requested
14. HES Capacity's Sankey diagram (`workloadSankey()`) uses an illustrative 3-tier CQN taxonomy as flow sources since this page's filter set has no real per-queue dimension — only the 4 target LOB names are real
15. HES Capacity's Geo Map is single-metric (SLO only, region-only) — the mockup ("Layer 5", renumbered to 04) only specifies a region-level SLO heatmap, unlike ESG Capacity's dual metric/view-toggle map
16. The landing page, Capacity Plan pages, and per-business sub-toggle (2026-07-03) weren't visually clicked through in a rendered browser by the agent — no browser-automation tool available this session; verified via clean production build + Node data smoke tests only
17. ESG Capacity's Region/Sub-region drill (Attrition, Plan over Plan Variation) scales one FY-level baseline by each key's share of in-scope queues (`shareByKey`) — not a real per-region/sub-region historical dataset
18. The 2026-07-03 ESG Capacity revision pass (filters, YTD cards, Attrition/Plan-over-Plan drill, Utilization aux detail, Geo Map sub-region toggle) was verified via an extended Node smoke test + clean build only, same browser-automation gap as item 16
