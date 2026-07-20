// Mock data + selectors for the TSA Capacity Plan page (Total FTE / Attrition /
// Cases-per-FTE / Avg Case Time / Global SLO). Its filter set (LOB / FY-Qtr-Month-
// Week / Business Partner / Global Grouping) is IDENTICAL to TSA Forecasting's, so
// this page reuses TSA Forecasting's own LOB fact table, filter function, and
// filter-panel component directly rather than duplicating them — only the metrics
// are new.
import {
  LOB_LIST, GLOBAL_GROUPING_LIST, LOB_FACTS, LOB_QUEUES, filterLobs, tsaEffectiveFiscalYears,
} from './tsaData'
import {
  FISCAL_YEARS, REGIONS, SUB_REGIONS, matchesMulti, expandToGranularity, expandRateToGranularity,
} from './mockData'

function lobScopeRatio(filters) {
  const total = LOB_FACTS.length
  return total ? filterLobs(filters).length / total : 0
}

// Deterministic {key: share} distribution of a LOB set across 'region' or
// 'subRegion' — same role as msgCapacityData.js's shareByKey, backing the
// Attrition and Plan over Plan Variation region/sub-region drills below.
function tsaShareByKey(rows, key) {
  const counts = {}
  rows.forEach(l => { if (l[key] != null) counts[l[key]] = (counts[l[key]] || 0) + 1 })
  const total = rows.length || 1
  return Object.fromEntries(Object.entries(counts).map(([k, c]) => [k, c / total]))
}

// In-scope TSA_CAPACITY_LOBS rows for the current filters (lob/businessPartner/
// globalGrouping) — filterLobs(filters) narrows LOB_FACTS, this maps that back onto
// the capacity-specific per-LOB rows so region/sub-region drills stay filter-aware.
function filterCapacityLobs(filters) {
  const inScope = new Set(filterLobs(filters).map(l => l.lob))
  const rows = TSA_CAPACITY_LOBS.filter(l => inScope.has(l.lob))
  return rows.length ? rows : TSA_CAPACITY_LOBS
}

// ── Total FTE ──────────────────────────────────────────────────────────────
const BASE_FTE_PLAN = { FY25: 460, FY26: 500, FY27: 528 }

export const FTE_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  plan: BASE_FTE_PLAN[fy],
  actual: Math.round(BASE_FTE_PLAN[fy] * (0.90 + (i * 3 % 5) / 100)),
  get adherence() { return +((this.actual / this.plan) * 100).toFixed(1) },
}))

export function fteByFY(filters = {}, granularity) {
  const years = tsaEffectiveFiscalYears(filters)
  const fyRows = FTE_BY_FY.filter(d => years.includes(d.period)).map(d => ({ period: d.period, plan: d.plan, actual: d.actual }))
  return expandToGranularity(fyRows, granularity, ['plan', 'actual'])
    .map(d => ({ ...d, adherence: d.plan ? +((d.actual / d.plan) * 100).toFixed(1) : 0 }))
}

// ── Attrition (Layer 1, Visual 2) ──────────────────────────────────────────
const BASE_ATTRITION_BENCH = { FY25: 7.5, FY26: 7.2, FY27: 7.0 }

export const TSA_ATTRITION_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  headcount: 3000 + ((i * 233) % 1200),
  bench: BASE_ATTRITION_BENCH[fy],
  attrition: +(BASE_ATTRITION_BENCH[fy] * (1.1 + (i * 4 % 6) / 100)).toFixed(1),
}))

export function tsaAttritionByFY(filters = {}, granularity, lens = 'Region') {
  const years = tsaEffectiveFiscalYears(filters)
  const lensScale = lens === 'Country' ? 0.97 : 1
  const fyRows = TSA_ATTRITION_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, headcount: Math.round(d.headcount * lensScale), attrition: d.attrition }))
  const expandedHc = expandToGranularity(fyRows, granularity, ['headcount'])
  const expandedRate = expandRateToGranularity(fyRows, granularity, ['attrition'])
  return expandedHc.map((d, i) => ({ ...d, attrition: expandedRate[i].attrition }))
}

// Region/Sub-region default view for HeadcountAttritionLayer Visual2 — one row per
// key, sized by each key's share of currently in-scope LOBs; clicking a key drills
// into tsaAttritionTrendByDimension below. Same mechanic as msgCapacityData.js's
// attritionByDimension, adapted to this page's LOB fact table.
export function tsaAttritionByDimension(filters = {}, dimension = 'Region') {
  const key = dimension === 'SubRegion' ? 'subRegion' : 'region'
  const rows = filterCapacityLobs(filters)
  const shares = tsaShareByKey(rows, key)
  const years = tsaEffectiveFiscalYears(filters)
  const fyRows = TSA_ATTRITION_BY_FY.filter(d => years.includes(d.period))
  const latest = fyRows[fyRows.length - 1] || TSA_ATTRITION_BY_FY[TSA_ATTRITION_BY_FY.length - 1]
  return Object.entries(shares)
    .map(([k, share], i) => {
      const headcount = Math.round(latest.headcount * share)
      const attrition = +(latest.attrition * (0.9 + ((i * 7) % 13) / 50)).toFixed(1)
      return { key: k, headcount, attrition, attritionCount: Math.round(headcount * attrition / 100) }
    })
    .sort((a, b) => b.headcount - a.headcount)
}

// FY/granularity trend for one clicked region/sub-region key, same drill mechanic
// as msgCapacityData.js's attritionTrendByDimension.
export function tsaAttritionTrendByDimension(filters = {}, key, dimension = 'Region', granularity) {
  const dimKey = dimension === 'SubRegion' ? 'subRegion' : 'region'
  const rows = filterCapacityLobs(filters)
  const shares = tsaShareByKey(rows, dimKey)
  const share = shares[key] ?? (1 / (Object.keys(shares).length || 1))
  const years = tsaEffectiveFiscalYears(filters)
  const fyRows = TSA_ATTRITION_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, headcount: Math.round(d.headcount * share), attrition: d.attrition }))
  const expandedHc = expandToGranularity(fyRows, granularity, ['headcount'])
  const expandedRate = expandRateToGranularity(fyRows, granularity, ['attrition'])
  return expandedHc.map((d, i) => ({
    ...d, attrition: expandedRate[i].attrition,
    attritionCount: Math.round(d.headcount * expandedRate[i].attrition / 100),
  }))
}

// ── Actual vs Plan utilization (Layer 1, Visual 3) ─────────────────────────
const BASE_TSA_UTIL_TARGET = { FY25: 80, FY26: 82, FY27: 84 }

export const TSA_UTIL_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  target: BASE_TSA_UTIL_TARGET[fy],
  actual: +(BASE_TSA_UTIL_TARGET[fy] * (0.94 + (i * 5 % 9) / 100)).toFixed(1),
}))

export function tsaUtilByFY(filters = {}, granularity, lens = 'Region') {
  const years = tsaEffectiveFiscalYears(filters)
  const lensScale = lens === 'Country' ? 0.98 : 1
  const fyRows = TSA_UTIL_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, target: d.target, actual: +(d.actual * lensScale).toFixed(1) }))
  return expandRateToGranularity(fyRows, granularity, ['target', 'actual'])
    .map(d => ({ ...d, adherence: d.target ? +((d.actual / d.target) * 100).toFixed(1) : 0 }))
}

// ── Cases per FTE / Avg Case Time (cards only) ─────────────────────────────
const BASE_CPF_PLAN = { FY25: 15.5, FY26: 16.2, FY27: 16.9 }
export const CPF_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy, plan: BASE_CPF_PLAN[fy],
  actual: +(BASE_CPF_PLAN[fy] * (1.1 + (i * 5 % 8) / 100)).toFixed(1),
}))

// Cases per FTE is a rate (cases handled per head), so its trend chart uses the
// rate-preserving expansion, same as actHrsByFY below.
export function cpfByFY(filters = {}, granularity) {
  const years = tsaEffectiveFiscalYears(filters)
  const fyRows = CPF_BY_FY.filter(d => years.includes(d.period)).map(d => ({ period: d.period, actual: d.actual, plan: d.plan }))
  return expandRateToGranularity(fyRows, granularity, ['actual', 'plan'])
}

const BASE_ACT_PLAN = { FY25: 3.6, FY26: 3.8, FY27: 4.0 }
export const ACT_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy, plan: BASE_ACT_PLAN[fy],
  actual: +(BASE_ACT_PLAN[fy] * (1.2 + (i * 4 % 10) / 100)).toFixed(1),
}))

// Avg Case Time is a rate (hours per case), not a summable volume, so its trend
// chart uses the rate-preserving expansion, same reasoning as UCR target/current
// on TSA Forecasting. `adherence` is plan/actual (not actual/target) since this is a
// "lower is better" metric — adherence reads >=100 when actual is at or under plan,
// <100 when it's running long, same directional convention as Cases per FTE's
// "overload" framing on this page's cards.
export function actHrsByFY(filters = {}, granularity) {
  const years = tsaEffectiveFiscalYears(filters)
  const fyRows = ACT_BY_FY.filter(d => years.includes(d.period)).map(d => ({ period: d.period, actual: d.actual, plan: d.plan }))
  return expandRateToGranularity(fyRows, granularity, ['actual', 'plan'])
    .map(d => ({ ...d, adherence: d.actual ? +((d.plan / d.actual) * 100).toFixed(1) : 0 }))
}

// LOBs whose Average Case Time is running above plan (worse — taking longer than
// planned), worst delta first — backs the "top LOBs going above target" list under
// both Workload Distribution ACT visuals.
export function actHrsDefaulterLobs(filters = {}, count = 6) {
  return filterCapacityLobs(filters)
    .filter(l => l.actHrsActual > l.actHrsPlan)
    .map(l => ({ lob: l.lob, actual: l.actHrsActual, plan: l.actHrsPlan, delta: +(l.actHrsActual - l.actHrsPlan).toFixed(1) }))
    .sort((a, b) => b.delta - a.delta)
    .slice(0, count)
}

// ── Global SLO ──────────────────────────────────────────────────────────────
const BASE_SLO_TARGET = { FY25: 93, FY26: 94, FY27: 95 }
export const SLO_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy, target: BASE_SLO_TARGET[fy],
  actual: +(BASE_SLO_TARGET[fy] * (0.96 + (i * 2 % 5) / 100)).toFixed(1),
}))

// Tuned so exactly 2 regions sit below the FY27 SLO target (95) — matching the
// mockup's literal "2 regions at risk" card message.
export const TSA_GEO_SLO_BY_REGION = [
  { region: 'NAMER', slo: 97 },
  { region: 'EMEA', slo: 88 },
  { region: 'APJ', slo: 96 },
  { region: 'LATAM', slo: 79 },
]

export function geoSloByRegion() {
  return TSA_GEO_SLO_BY_REGION
}

// Per-sub-region SLO, worldwide — rotates through the region baselines above with a
// per-sub-region nudge, same "real names + illustrative structure" convention as
// msgCapacityData.js's GEO_CAPACITY_BY_SUBREGION.
export const TSA_GEO_SLO_BY_SUBREGION = SUB_REGIONS.map((subRegion, i) => {
  const base = TSA_GEO_SLO_BY_REGION[i % TSA_GEO_SLO_BY_REGION.length]
  return { subRegion, slo: Math.max(60, Math.min(100, base.slo + ((i * 7) % 9) - 4)) }
})

export function geoSloBySubRegion() {
  return TSA_GEO_SLO_BY_SUBREGION
}

// Year-over-year % change between the latest in-scope FY and the one before it;
// null when there's no prior year in scope, same convention as msgCapacityData.js's yoyPct.
function yoyPct(curr, prev) {
  if (prev === undefined || prev === null || !prev) return null
  return +(((curr - prev) / prev) * 100).toFixed(1)
}

// ── Card headlines ─────────────────────────────────────────────────────────
// Staffing Summary/Attrition/Avg Case Time/SLO % headline values drill with the
// page-wide granularity slicer; each YTD/YoY comparison stays FY-over-FY regardless
// of granularity — same split as msgCapacityData.js's capacityCardData. Cases per
// FTE is unchanged (still a plain Plan-based sub-line, not part of this revision).
export function tsaCapacityCardData(filters = {}, granularity) {
  const years = tsaEffectiveFiscalYears(filters)
  const fteGranular = fteByFY(filters, granularity)
  const fteFY = fteByFY(filters)
  const attritionFY = TSA_ATTRITION_BY_FY.filter(d => years.includes(d.period))
  const cpf = CPF_BY_FY.filter(d => years.includes(d.period))
  const actFY = ACT_BY_FY.filter(d => years.includes(d.period))
  const sloFY = SLO_BY_FY.filter(d => years.includes(d.period))

  const latestFte = fteGranular[fteGranular.length - 1]
  const latestFteFY = fteFY[fteFY.length - 1]
  const prevFteFY = fteFY[fteFY.length - 2]
  const latestAttrition = attritionFY[attritionFY.length - 1]
  const prevAttrition = attritionFY[attritionFY.length - 2]
  const latestCpf = cpf[cpf.length - 1]
  const latestAct = actFY[actFY.length - 1]
  const prevAct = actFY[actFY.length - 2]
  const latestSlo = sloFY[sloFY.length - 1]
  const prevSlo = sloFY[sloFY.length - 2]
  const regionsAtRisk = latestSlo ? TSA_GEO_SLO_BY_REGION.filter(r => r.slo < latestSlo.target).length : 0

  return {
    totalFte: {
      actual: latestFte?.actual ?? 0, plan: latestFte?.plan ?? 0,
      period: latestFteFY?.period, prevPeriod: prevFteFY?.period, yoyPct: yoyPct(latestFteFY?.actual, prevFteFY?.actual),
    },
    attrition: {
      actual: latestAttrition?.attrition ?? 0, bench: latestAttrition?.bench ?? 0,
      period: latestAttrition?.period, prevPeriod: prevAttrition?.period, yoyPct: yoyPct(latestAttrition?.attrition, prevAttrition?.attrition),
    },
    casesPerFte: { actual: latestCpf?.actual ?? 0, plan: latestCpf?.plan ?? 0 },
    avgCaseTime: {
      actual: latestAct?.actual ?? 0, plan: latestAct?.plan ?? 0,
      period: latestAct?.period, prevPeriod: prevAct?.period, yoyPct: yoyPct(latestAct?.actual, prevAct?.actual),
    },
    globalSlo: {
      actual: latestSlo?.actual ?? 0, target: latestSlo?.target ?? 0, regionsAtRisk,
      period: latestSlo?.period, prevPeriod: prevSlo?.period, yoyPct: yoyPct(latestSlo?.actual, prevSlo?.actual),
    },
  }
}

// ── Plan over Plan headcount comparison (Layer 2) ──────────────────────────
export const TSA_CAPACITY_PLAN_VS_PLAN_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  plan1: BASE_FTE_PLAN[fy],
  plan2: Math.round(BASE_FTE_PLAN[fy] * (0.95 + (i * 7 % 11) / 100)),
}))

// Region/Sub-region default view for the TSA Plan over Plan Variation layer — same
// share-weighted mechanic as msgCapacityData.js's planOverPlanByDimension.
export function tsaPlanOverPlanByDimension(filters = {}, dimension = 'Region') {
  const key = dimension === 'SubRegion' ? 'subRegion' : 'region'
  const rows = filterCapacityLobs(filters)
  const shares = tsaShareByKey(rows, key)
  const years = tsaEffectiveFiscalYears(filters)
  const fyRows = TSA_CAPACITY_PLAN_VS_PLAN_BY_FY.filter(d => years.includes(d.period))
  const latest = fyRows[fyRows.length - 1] || TSA_CAPACITY_PLAN_VS_PLAN_BY_FY[TSA_CAPACITY_PLAN_VS_PLAN_BY_FY.length - 1]
  return Object.entries(shares)
    .map(([k, share]) => {
      const plan1 = Math.round(latest.plan1 * share)
      const plan2 = Math.round(latest.plan2 * share)
      return { key: k, plan1, plan2, variance: plan1 ? +((plan2 - plan1) / plan1 * 100).toFixed(1) : 0 }
    })
    .sort((a, b) => b.plan1 - a.plan1)
}

// FY/granularity trend for one clicked region/sub-region key, same drill mechanic
// as msgCapacityData.js's planOverPlanTrendByDimension.
export function tsaPlanOverPlanTrendByDimension(filters = {}, key, dimension = 'Region', granularity) {
  const dimKey = dimension === 'SubRegion' ? 'subRegion' : 'region'
  const rows = filterCapacityLobs(filters)
  const shares = tsaShareByKey(rows, dimKey)
  const share = shares[key] ?? (1 / (Object.keys(shares).length || 1))
  const years = tsaEffectiveFiscalYears(filters)
  const fyRows = TSA_CAPACITY_PLAN_VS_PLAN_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, plan1: Math.round(d.plan1 * share), plan2: Math.round(d.plan2 * share) }))
  return expandToGranularity(fyRows, granularity, ['plan1', 'plan2'])
    .map(d => ({ ...d, variance: d.plan1 ? +((d.plan2 - d.plan1) / d.plan1 * 100).toFixed(1) : 0 }))
}

// LOBs with the highest Plan-over-Plan headcount variation, worst (largest
// |variance|) first — the ranked list under the Plan over Plan Variation layer,
// analogous to msgCapacityData.js's planOverPlanQueueVariance but for LOBs.
export function planOverPlanLobVariance(filters = {}, topN = 8) {
  const rows = filterCapacityLobs(filters)
  return rows
    .map(l => ({ name: l.lob, plan1: l.popPlan1, plan2: l.popPlan2, variance: l.popVariance }))
    .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
    .slice(0, topN)
}

// ── Workload distribution (Layer 3) — per-LOB fact table ───────────────────
// Reuses LOB_FACTS's own businessPartner/globalGrouping tagging so a given LOB
// carries the same tags across both TSA pages, rather than re-deriving them with
// a different index formula.
export const TSA_CAPACITY_LOBS = LOB_FACTS.map((l, i) => {
  const popPlan1 = 8 + (i % 12)
  const popPlan2 = Math.round(popPlan1 * (0.82 + (i % 17) * 0.018))
  return {
    ...l,
    region: REGIONS[i % REGIONS.length],
    subRegion: SUB_REGIONS[i % SUB_REGIONS.length],
    workloadPlan: 500 + (i % 10) * 80,
    workloadActual: Math.round((500 + (i % 10) * 80) * (0.7 + (i % 9) * 0.05)),
    actHrsPlan: 6 + (i % 5),
    actHrsActual: +((6 + (i % 5)) * (0.9 + (i % 7) * 0.05)).toFixed(1),
    // Plan-over-Plan (Plan A vs Plan B) headcount per LOB — backs the "LOBs with
    // highest variation" ranking under the Plan over Plan Variation layer.
    popPlan1, popPlan2,
    get popVariance() { return this.popPlan1 ? +((this.popPlan2 - this.popPlan1) / this.popPlan1 * 100).toFixed(1) : 0 },
  }
})

// Illustrative Sankey, now with two modes (2026-07-03): 'LOB' flows 3 illustrative
// CQN priority tiers into 4 real LOB names; 'CQN' flows 3 illustrative LOB-priority
// tiers into 4 real TSA queue names (pulled from LOB_QUEUES['High End Storage'] —
// the only real per-queue list this page has access to). Neither direction has a
// real per-queue-to-LOB mapping, so both tier label sets stay illustrative while the
// leaf nodes they flow into are always real business names.
const SANKEY_CQN_TIERS = ['CQN-Standard', 'CQN-Critical', 'CQN-Enterprise']
const SANKEY_LOBS = ['Networking', 'Storage', 'Server', 'ScaleVault']
const SANKEY_LOB_TIERS = ['LOB-Storage', 'LOB-Networking', 'LOB-Compute']
// Filtered against the real active-queue list so this stays a genuine subset of
// LOB_QUEUES rather than a hand-typed name that could drift from the source data.
const SANKEY_QUEUES = ['Global Networking', 'Global ApexArray Backline', 'GLOBAL UDX ScaleVault', 'Global RailFlex']
  .filter(name => LOB_QUEUES['High End Storage'].active.includes(name))

export function workloadSankey(filters = {}, mode = 'LOB') {
  const ratio = lobScopeRatio(filters) || 1
  const sources = mode === 'CQN' ? SANKEY_LOB_TIERS : SANKEY_CQN_TIERS
  const targets = mode === 'CQN' ? SANKEY_QUEUES : SANKEY_LOBS
  const nodes = [...sources, ...targets].map(name => ({ name }))
  const links = []
  sources.forEach((src, si) => {
    targets.forEach((tgt, ti) => {
      const value = Math.max(1, Math.round(120 * ratio * (0.4 + ((si * 7 + ti * 11) % 13) / 20)))
      links.push({ source: si, target: sources.length + ti, value })
    })
  })
  return { nodes, links }
}

export { LOB_LIST, GLOBAL_GROUPING_LIST }
