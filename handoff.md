# Project Handoff — ISG SPoG ESG Forecasting Dashboard

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

---

## KPI Card Drill-Downs Rebuilt (as of 2026-07-01)

Each card's pop-up went from a raw table to an actual chart matching what the card measures:

| Card | Drill-down now shows |
|---|---|
| Total Queues | Unchanged — the queue list table |
| Call Volume | Bar chart: Offered vs Handled, by Fiscal Year (raw numbers, no %) |
| DB / OSP Split | Same Offered-vs-Handled-by-FY chart, but scoped by whichever DB/OSP filter is active (so it always matches the card above it) |
| Forecast Accuracy | Bar+line chart: Actual vs Forecast volume per region (APJ/EMEA/Global/LATAM/NAMER), with a Forecast Accuracy % line on a second axis |
| CQN Variance | Bar chart: % of queues within ±10% variance, year on year (FY25/26/27) — **click a year's bar** to open a pop-up listing 4–5 example queues in that band for the current filter scope |

**CQN Variance headline was recalibrated.** It was reading ~74–80% ("within ±10%"), which felt inflated for how strict that band actually is. The qualifying threshold tightened from `accuracy >= 80` to `accuracy >= 89`, landing the headline at ~40–50% at default filters — a real recomputed number, not a hardcoded one. The year-on-year drill-down (`CQN_VARIANCE_BY_FY` in `mockData.js`) is curated static data in the same 40–50% range, since no per-queue-per-year variance dataset exists yet; the queues shown in the year pop-up are real (pulled from the live filtered fact table), just not year-specific yet.

**The year-click pop-up is an actual modal**, the one deliberate exception to the "no modals" rule established in `design_choice.md` — it's a second level of drill-down nested inside the first, and a floating overlay reads better there than trying to cram another chart inline.

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
