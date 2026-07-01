# Project Handoff — ISG SPoG ESG Forecasting Dashboard

## Latest polish pass (2026-07-02)

- Diverging "Top Queue Variance" charts (both layers) now print the exact `+X%`/`-X%` value at the end of each bar via two sign-split `LabelList`s using Recharts' built-in `position="left"`/`"right"` — a hand-computed label position drifted into the bar interior and was unreadable. Axis ticks rounded to clean 5% steps; queue-name truncation now breaks on the last word boundary instead of mid-word.
- Renamed: Layer 1 Visual 1 "Fiscal Year Plan Variance" → **PoP Variation**; Layer 2 Visual 1 "Fiscal Year Adherence" → **Actual vs Plan Variation**.
- RCA & CLCA sidebar now starts at the "Analysis Layers" divider, not "Key Metrics" — the 5 KPI cards span the full page width on their own.
- Forecast Variance Distribution's tooltip now shows queue **counts** per bucket (e.g. "< 10%: 76 queues") instead of repeating the % already printed on the bar — computed from the same DB/OSP-agnostic queue count the Total Queues card uses, so it stays consistent with the rest of the dashboard as filters change.

## Current State (as of 2026-07-01)

### What is this?
A React-based Single Pane of Glass (SPoG) analytics dashboard for Dell's ISG Business — specifically the Enterprise Service Group (ESG) Forecasting Page. It visualizes call-center WFM metrics: plan comparisons, actual vs plan adherence, and geo-based accuracy across regions.

### Live URL
**https://hrishi-2597.github.io/ISG-SPoG/**
> GitHub Pages is configured to serve from the `gh-pages` branch (built artifacts).
> Settings path: https://github.com/Hrishi-2597/ISG-SPoG/settings/pages → Source: `gh-pages` branch / `/(root)`

### Repository
https://github.com/Hrishi-2597/ISG-SPoG
- `main` branch — source code
- `gh-pages` branch — compiled `dist/` output (auto-updated by CI)

---

## How to Run Locally

```bash
npm install
npm run dev
# → http://localhost:5173
```

## How to Deploy

Push any commit to `main` — GitHub Actions (`.github/workflows/deploy.yml`) automatically:
1. Runs `npm ci && npm run build`
2. Pushes `dist/` to `gh-pages` branch via `peaceiris/actions-gh-pages@v4`
3. GitHub Pages serves the updated build within ~60s

---

## What's Built

| Feature | File | Status |
|---|---|---|
| 12-filter panel (Queue Name, Capacity Code, Plan Name, FY, Region, etc.) | `src/components/FilterPanel.jsx` | ✅ Done |
| 5 KPI cards with drill-down tables | `src/components/MetricCards.jsx` | ✅ Done |
| Layer 1: Plan over Plan (3 visuals) | `src/components/Layer1PlanOverPlan.jsx` | ✅ Done |
| Layer 2: Actual vs Plan (3 visuals) | `src/components/Layer2ActualVsPlan.jsx` | ✅ Done |
| Layer 3: Geo Map (world map + table) | `src/components/Layer3GeoMap.jsx` | ✅ Done |
| Real queue/capacity/plan names wired into filters & charts (FY25–FY27, 14 countries) | `src/data/mockData.js` | ✅ Done |
| GitHub Actions CI/CD | `.github/workflows/deploy.yml` | ✅ Done |

---

## Real Data Wired In (as of 2026-07-01)

Queue names, capacity codes, plan names, business partners, sub-regions, and L5 managers are all real values supplied by the business:

| Constant | Count | Used by |
|---|---|---|
| `ACTIVE_QUEUE_NAMES` | 199 | Queue Name filter, feeds the `ACTIVE_QUEUES` fact table |
| `INACTIVE_QUEUE_NAMES` | 406 | Total Queues card total (605 = 199 + 406); not yet drillable |
| `CAPACITY_CODES` | ~610 | Capacity Code filter, tagged onto each active queue |
| `PLAN_NAMES` | 4 (`AOP_FY26Q4_AA`, `FY27 Q1 APR Plan`, `FY27 Q2 JUN Plan`, `FY27Q1_AA`) | Plan Name filter, Layer 1 Plan A/B dropdowns, Layer 2 plan selector |
| `FISCAL_QUARTERS` | 12 (`FY25Q1` ... `FY27Q4`) | Fiscal Quarter filter |
| `FISCAL_WEEK_LIST` | 156 (`FY25W01` ... `FY27W52`) | Fiscal Week filter |
| `BUSINESS_PARTNERS` | 7 real names | Business Partner filter, tagged onto each active queue |
| `REGIONS` | `['APJ','EMEA','Global','LATAM','NAMER']` | Region filter, Layer 1 `PLAN_VS_PLAN_BY_REGION`, Geo Map |
| `SUB_REGIONS` | 24 real values | Sub-region filter, tagged onto each active queue |
| `L5_MANAGERS` | 15 real names | L5 Manager filter, tagged onto each active queue |

Region for each active queue is inferred from its name prefix (`inferRegion()` in `mockData.js`) — APJ/EMEA/LATAM/NAMER/Global — since no explicit region field was supplied with the queue list.

---

## Filters Are Live (as of 2026-07-01)

The filter bar was rebuilt and every filter now actually drives the charts and cards — this used to be UI-only. See `tech_spec.md` → "Data Model" for the full mechanism. Highlights:

- **`ACTIVE_QUEUES` is now a fact table.** Each of the 199 queues carries region, sub-region, capacity code, business partner, L5 manager, channel, and DB/OSP tags (assigned deterministically, round-robin, since the source lists don't specify a real per-queue mapping — mock data enriched with realistic *structure*, not a real business relationship). `filterQueues(filters)` narrows this table by 8 of the 12 filters; every KPI card, the queue drill-down table, and both "CQN Highest Variance" charts are recomputed from whatever rows remain.
- **DB/OSP scopes volume only, not queue portfolio.** Total Queues / Forecast Accuracy / CQN Variance / the CQN-variance charts ignore the DB/OSP toggle (a queue's accuracy doesn't change depending on which slice of its volume you're viewing); Call Volume / DB-OSP Split respect it fully. This split exists so the default `dbOsp: 'DB'` filter doesn't make the headline "Total Queues" count look wrong on first load.
- **Fiscal Year/Quarter/Week collapsed into one time scope.** Whichever is most specific (Week > Quarter > Year) determines the single FY shown; charts are always at FY granularity now (see below).
- **Region filter narrows the Region chart and the Geo Map** (both view modes) to the matching region. Selecting "Global" on the Geo Map shows an explanatory empty state (no lat/lng data at that granularity), not a blank confusing screen.
- **Plan Name filter pre-selects the primary plan (Plan A)** in both Layer 1 and Layer 2 — the per-visual Plan A/B dropdowns still work independently after that, per the original design decision.
- **Capacity Code, Channel, Business Partner, Sub-region, L5 Manager** all narrow the same fact table, so they affect cards, the drill-down table, and the CQN-variance charts together.

### FY/Quarter/Week toggles removed from charts

Layer 1 Visual 1 and Layer 2 Visual 1 used to have their own `FY / Quarter / Week` segmented toggle, duplicating the top filter bar. That control is gone — those charts are now always at Fiscal Year granularity, and the top-bar Fiscal Year/Quarter/Week filters determine which year(s) they show. `PLAN_VS_PLAN_BY_QTR/WEEK` and `ACTUAL_VS_PLAN_BY_QTR/WEEK` were removed from `mockData.js` since nothing renders them anymore. Layer 1 Visual 2 also lost its Region/Country toggle switch — it never actually changed the chart's data source (a pre-existing latent bug), and no per-country plan-over-plan dataset exists to back a real "Country" view.

### Filter bar redesign

The filter bar was restructured away from a flat 12-dropdown grid (which read like a generic BI slicer panel) into 4 icon-labeled clusters — Scope, Time, People, Geography — with a DB/OSP segmented pill instead of a third binary dropdown, and an "applied filters" chip strip that appears under the bar once anything is scoped (each chip removable, plus "Clear all"). Queue Name and Capacity Code render in a monospace face since they're system codes, not names. See `design_choice.md` for the full rationale.

### Filters are searchable multi-selects

All 11 dropdown filters (everything except DB/OSP, which stays the 3-way segmented pill) are now `MultiSelectField` — a button that opens a popover with a search box, "Select all"/"Clear", and a checkbox list; pick any number of values. This matters most for Queue Name (199 options) and Capacity Code (~610), which were unusable to scroll through as a plain `<select>`.

**Every filter's value changed from a string to an array.** `[]` means "no selection = All" (this replaced the old `'All'` sentinel string everywhere except `dbOsp`). `filterQueues()` and every region/FY selector in `mockData.js` now check `array.includes(value)` instead of `value === selected`. If you're adding a new filter or a new selector function, follow that pattern — see `tech_spec.md` → "Data Model".

---

## KPI Card Drill-Downs Rebuilt (as of 2026-07-01)

Each card's pop-up went from a raw table to an actual chart matching what the card measures:

| Card | Drill-down now shows |
|---|---|
| Total Queues | Region breakdown donut chart on top (click a slice, or its legend entry, to filter the table below to just that region's queues; click again, or "Clear", to reset) |
| Call Volume | Bar chart: Offered vs Handled, by Fiscal Year (raw numbers, no %) |
| DB / OSP Split | Bar chart: DB Offered vs OSP Offered, by Fiscal Year — deliberately ignores the ambient DB/OSP filter (showing the split IS the point; collapsing to one bar when the filter is "DB" would defeat it) |
| Forecast Accuracy | Bar+line chart: Actual vs Forecast volume per region (APJ/EMEA/Global/LATAM/NAMER), with a Forecast Accuracy % line on a second axis |
| CQN Variance | Bar chart: % of queues within ±10% variance, year on year (FY25/26/27) — **click a year's bar** to open a pop-up listing 4–5 example queues in that band for the current filter scope |

**CQN Variance headline was recalibrated.** It was reading ~74–80% ("within ±10%"), which felt inflated for how strict that band actually is. The qualifying threshold tightened from `accuracy >= 80` to `accuracy >= 89`, landing the headline at ~40–50% at default filters — a real recomputed number, not a hardcoded one. The year-on-year drill-down (`CQN_VARIANCE_BY_FY` in `mockData.js`) is curated static data in the same 40–50% range, since no per-queue-per-year variance dataset exists yet; the queues shown in the year pop-up are real (pulled from the live filtered fact table), just not year-specific yet.

**The year-click pop-up is an actual modal**, the one deliberate exception to the "no modals" rule established in `design_choice.md` — it's a second level of drill-down nested inside the first, and a floating overlay reads better there than trying to cram another chart inline.

---

## Chart Redesign, Geo Choropleth, RCA/CLCA Sidebar (2026-07-01)

- **Every chart title is now centered at the top of its panel**, and renamed for clarity: "Fiscal Year Plan Variance", "Regional Plan Variance", "Top Queue Variance — Plan A vs Plan B" (Layer 1); "Fiscal Year Adherence", "Forecast Variance Distribution", "Top Queue Variance — Actual vs Plan" (Layer 2); "Global Adherence Heatmap" (Layer 3); plus renamed KPI drill-down titles.
- **Both "CQN Highest Variance" charts are now diverging bar charts** — one bar per queue, extending right (green, ahead of plan) or left (red, behind plan) from zero, instead of two adjacent bars the reader had to compare by eye. Queue names truncate to ~20 chars on the axis (full name still in the tooltip) so long names no longer wrap to two lines and blow out the row spacing.
- **Color roles were tightened**: violet (`#a78bfa`) is now the neutral "trend line" color (Fiscal Year/Regional Plan Variance lines) so it doesn't compete with green/red, which are reserved exclusively for ahead-of-plan/behind-plan semantics on the diverging charts.
- **Forecast Variance Distribution** (renamed from "Adherence Distribution") re-bucketed from accuracy tiers (≥90/80–90/70–80/<70) to variance-magnitude bands (**<10% / 10–20% / 20–30% / >30%**), with a green→blue→amber→red graduated scale and **data labels printed directly on each stacked segment**.
- **Geo Map is a choropleth now, not circle markers.** Countries are filled by their region's (or sub-region's) accuracy color. The "Country" toggle became **"Sub-region"**, showing the real 24 `SUB_REGIONS` values. Country→region/sub-region groupings in `mockData.js` (`regionForCountry`, `subRegionForCountry`) are an illustrative continental/business split, not authoritative geography. In Sub-region view, countries without a specific named sub-region fall back to their parent region's shade at 35% opacity, so named sub-regions visually "pop" against a fully-covered background map instead of leaving most of the world blank.
- **New RCA & CLCA sidebar** — a sticky right-hand column (`RcaClcaPanel.jsx`) running the full height of the dashboard, next to the KPI cards and all three analysis layers. Content is illustrative example findings/actions, clearly labeled as such, until a real RCA workflow is connected.
- **Fixed while verifying:** `cqnActualVariance`'s underlying per-queue `handled` formula previously guaranteed `handled ≤ offered` for every queue, so the "ahead of plan" (green) case in the Layer 2 diverging chart was structurally impossible — no filter combination could ever trigger it. Widened to a symmetric ±8% range and fixed the sort to rank by `|variance|` (it was ranking by raw ascending variance, always surfacing the worst outliers) so the chart now genuinely shows a mix of green and red, matching its own legend.

---

## What's NOT Yet Built (from PPT scope)

These are in the original SPOG_views.pptx but not yet implemented:
- Slides 3–4: Staffing / Headcount dashboard (SL%, FTE, Attrition, Utilization)
- Slides 5–6: ASU / SR / UCR layer
- Slides 7–9: Workload distribution, SLO heatmaps
- Slides 10–13: Full Forecast Trend page (MAPE, Bias%, queue exception table)
- Slides 14–16: Shipment Trend page (Consumer/Commercial/Enterprise)
- AI-generated RCA & CLCA panel (mentioned in PPT)
- Real backend / data connection (currently all mock data)

---

## Known Issues / Pending

1. **GitHub Pages source must be manually set** to `gh-pages` branch after first deploy (one-time step).
2. **Geo map** fetches world GeoJSON from CDN (`cdn.jsdelivr.net/npm/world-atlas@2`) — requires internet at runtime.
3. Queue/capacity/plan **names** are real; volume, accuracy, and variance **numbers** are still mock/static — no API or database connection yet.
4. Chunk size warning (~697KB bundle) — consider code-splitting recharts and react-simple-maps in future.
5. `INACTIVE_QUEUE_NAMES` (406 real names) is defined in `mockData.js` but has no drill-down UI yet — only the count is shown on the Total Queues card.

---

## Git Credentials
- User: `Hrishi-2597`
- Email: `hrishikesh.yadav@alignedautomation.com`
- Remote: `https://github.com/Hrishi-2597/ISG-SPoG.git`
