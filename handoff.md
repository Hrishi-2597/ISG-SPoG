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

Queue names, capacity codes, and plan names are now real values supplied by the business (volume/accuracy numbers per queue are still mocked, since no backend exists yet):

| Constant | Count | Used by |
|---|---|---|
| `ACTIVE_QUEUE_NAMES` | 199 | Queue Name filter, Total Queues drill-down, `ACTIVE_QUEUES` |
| `INACTIVE_QUEUE_NAMES` | 406 | Total Queues card total (605 = 199 + 406); not yet drillable |
| `CAPACITY_CODES` | ~610 | Capacity Code filter |
| `PLAN_NAMES` | 4 (`AOP_FY26Q4_AA`, `FY27 Q1 APR Plan`, `FY27 Q2 JUN Plan`, `FY27Q1_AA`) | Plan Name filter, Layer 1 Plan A/B dropdowns, Layer 2 plan selector |
| `VARIANCE_SAMPLE` | 5 real queue names | "CQN Highest Variance" charts in Layer 1 & 2 |
| `FISCAL_QUARTERS` | 12 (`FY25Q1` ... `FY27Q4`) | Fiscal Quarter filter |
| `FISCAL_WEEK_LIST` | 156 (`FY25W01` ... `FY27W52`) | Fiscal Week filter (chart drill toggle still uses the short `FISCAL_WEEKS` = W1–W13) |
| `BUSINESS_PARTNERS` | 7 real names | Business Partner filter (renamed from "Partner") |
| `REGIONS` | `['APJ','EMEA','Global','LATAM','NAMER']` | Region filter, Layer 1 `PLAN_VS_PLAN_BY_REGION` |
| `SUB_REGIONS` | 24 real values | Sub-region filter (renamed from "Country"; no longer a hardcoded list in `FilterPanel.jsx`) |
| `L5_MANAGERS` | 15 real names | L5 Manager filter (replaces the old "Business Org" filter) |

Region for each active queue is inferred from its name prefix (`inferRegion()` in `mockData.js`) — APJ/EMEA/LATAM/AMER/Global — since no explicit region field was supplied with the queue list.

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
