// Mock data + selectors for the HES Capacity Plan page (Total FTE / Attrition /
// Cases-per-FTE / Avg Case Time / Global SLO). Its filter set (LOB / FY-Qtr-Month-
// Week / Business Partner / Global Grouping) is IDENTICAL to HES Forecasting's, so
// this page reuses HES Forecasting's own LOB fact table, filter function, and
// filter-panel component directly rather than duplicating them — only the metrics
// are new.
import {
  LOB_LIST, GLOBAL_GROUPING_LIST, LOB_FACTS, filterLobs, hesEffectiveFiscalYears,
} from './hesData'
import {
  FISCAL_YEARS, REGIONS, matchesMulti, expandToGranularity, expandRateToGranularity,
} from './mockData'

function lobScopeRatio(filters) {
  const total = LOB_FACTS.length
  return total ? filterLobs(filters).length / total : 0
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
  const years = hesEffectiveFiscalYears(filters)
  const fyRows = FTE_BY_FY.filter(d => years.includes(d.period)).map(d => ({ period: d.period, plan: d.plan, actual: d.actual }))
  return expandToGranularity(fyRows, granularity, ['plan', 'actual'])
    .map(d => ({ ...d, adherence: d.plan ? +((d.actual / d.plan) * 100).toFixed(1) : 0 }))
}

// ── Attrition (Layer 1, Visual 2) ──────────────────────────────────────────
const BASE_ATTRITION_BENCH = { FY25: 7.5, FY26: 7.2, FY27: 7.0 }

export const HES_ATTRITION_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  headcount: 3000 + ((i * 233) % 1200),
  bench: BASE_ATTRITION_BENCH[fy],
  attrition: +(BASE_ATTRITION_BENCH[fy] * (1.1 + (i * 4 % 6) / 100)).toFixed(1),
}))

export function hesAttritionByFY(filters = {}, granularity, lens = 'Region') {
  const years = hesEffectiveFiscalYears(filters)
  const lensScale = lens === 'Country' ? 0.97 : 1
  const fyRows = HES_ATTRITION_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, headcount: Math.round(d.headcount * lensScale), attrition: d.attrition }))
  const expandedHc = expandToGranularity(fyRows, granularity, ['headcount'])
  const expandedRate = expandRateToGranularity(fyRows, granularity, ['attrition'])
  return expandedHc.map((d, i) => ({ ...d, attrition: expandedRate[i].attrition }))
}

// ── Actual vs Plan utilization (Layer 1, Visual 3) ─────────────────────────
const BASE_HES_UTIL_TARGET = { FY25: 80, FY26: 82, FY27: 84 }

export const HES_UTIL_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  target: BASE_HES_UTIL_TARGET[fy],
  actual: +(BASE_HES_UTIL_TARGET[fy] * (0.94 + (i * 5 % 9) / 100)).toFixed(1),
}))

export function hesUtilByFY(filters = {}, granularity, lens = 'Region') {
  const years = hesEffectiveFiscalYears(filters)
  const lensScale = lens === 'Country' ? 0.98 : 1
  const fyRows = HES_UTIL_BY_FY.filter(d => years.includes(d.period))
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
  const years = hesEffectiveFiscalYears(filters)
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
// on HES Forecasting.
export function actHrsByFY(filters = {}, granularity) {
  const years = hesEffectiveFiscalYears(filters)
  const fyRows = ACT_BY_FY.filter(d => years.includes(d.period)).map(d => ({ period: d.period, actual: d.actual, plan: d.plan }))
  return expandRateToGranularity(fyRows, granularity, ['actual', 'plan'])
}

// ── Global SLO ──────────────────────────────────────────────────────────────
const BASE_SLO_TARGET = { FY25: 93, FY26: 94, FY27: 95 }
export const SLO_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy, target: BASE_SLO_TARGET[fy],
  actual: +(BASE_SLO_TARGET[fy] * (0.96 + (i * 2 % 5) / 100)).toFixed(1),
}))

// Tuned so exactly 2 regions sit below the FY27 SLO target (95) — matching the
// mockup's literal "2 regions at risk" card message.
export const HES_GEO_SLO_BY_REGION = [
  { region: 'NAMER', slo: 97 },
  { region: 'EMEA', slo: 88 },
  { region: 'APJ', slo: 96 },
  { region: 'LATAM', slo: 79 },
]

export function geoSloByRegion() {
  return HES_GEO_SLO_BY_REGION
}

// ── Card headlines ─────────────────────────────────────────────────────────
export function hesCapacityCardData(filters = {}) {
  const years = hesEffectiveFiscalYears(filters)
  const fte = fteByFY(filters)
  const attrition = HES_ATTRITION_BY_FY.filter(d => years.includes(d.period))
  const cpf = CPF_BY_FY.filter(d => years.includes(d.period))
  const act = ACT_BY_FY.filter(d => years.includes(d.period))
  const slo = SLO_BY_FY.filter(d => years.includes(d.period))
  const latestFte = fte[fte.length - 1]
  const latestAttrition = attrition[attrition.length - 1]
  const latestCpf = cpf[cpf.length - 1]
  const latestAct = act[act.length - 1]
  const latestSlo = slo[slo.length - 1]
  const regionsAtRisk = latestSlo ? HES_GEO_SLO_BY_REGION.filter(r => r.slo < latestSlo.target).length : 0
  return {
    totalFte: { actual: latestFte?.actual ?? 0, plan: latestFte?.plan ?? 0 },
    attrition: { actual: latestAttrition?.attrition ?? 0, bench: latestAttrition?.bench ?? 0 },
    casesPerFte: { actual: latestCpf?.actual ?? 0, plan: latestCpf?.plan ?? 0 },
    avgCaseTime: { actual: latestAct?.actual ?? 0, plan: latestAct?.plan ?? 0 },
    globalSlo: { actual: latestSlo?.actual ?? 0, target: latestSlo?.target ?? 0, regionsAtRisk },
  }
}

// ── Plan over Plan headcount comparison (Layer 2) ──────────────────────────
export const HES_CAPACITY_PLAN_VS_PLAN_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  plan1: BASE_FTE_PLAN[fy],
  plan2: Math.round(BASE_FTE_PLAN[fy] * (0.95 + (i * 7 % 11) / 100)),
}))

export function planOverPlanFteByFY(filters = {}, granularity) {
  const years = hesEffectiveFiscalYears(filters)
  const rows = HES_CAPACITY_PLAN_VS_PLAN_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, plan1: d.plan1, plan2: d.plan2 }))
  return expandToGranularity(rows, granularity, ['plan1', 'plan2'])
    .map(d => ({ ...d, variance: d.plan1 ? +((d.plan2 - d.plan1) / d.plan1 * 100).toFixed(1) : 0 }))
}

// ── Workload distribution (Layer 3) — per-LOB fact table ───────────────────
// Reuses LOB_FACTS's own businessPartner/globalGrouping tagging so a given LOB
// carries the same tags across both HES pages, rather than re-deriving them with
// a different index formula.
export const HES_CAPACITY_LOBS = LOB_FACTS.map((l, i) => ({
  ...l,
  region: REGIONS[i % REGIONS.length],
  workloadPlan: 500 + (i % 10) * 80,
  workloadActual: Math.round((500 + (i % 10) * 80) * (0.7 + (i % 9) * 0.05)),
  actHrsPlan: 6 + (i % 5),
  actHrsActual: +((6 + (i % 5)) * (0.9 + (i % 7) * 0.05)).toFixed(1),
}))

// Illustrative Sankey: 3 CQN priority tiers flowing into 4 real LOBs. HES Capacity's
// filter set has no per-queue (CQN) dimension of its own, so the tier labels are a
// fixed small taxonomy rather than real per-queue data — the 4 target LOBs are real
// names from LOB_LIST.
const SANKEY_CQNS = ['CQN-Standard', 'CQN-Critical', 'CQN-Enterprise']
const SANKEY_LOBS = ['Networking', 'Storage', 'Server', 'PowerScale']

export function workloadSankey(filters = {}) {
  const ratio = lobScopeRatio(filters) || 1
  const nodes = [...SANKEY_CQNS, ...SANKEY_LOBS].map(name => ({ name }))
  const links = []
  SANKEY_CQNS.forEach((cqn, ci) => {
    SANKEY_LOBS.forEach((lob, li) => {
      const value = Math.max(1, Math.round(120 * ratio * (0.4 + ((ci * 7 + li * 11) % 13) / 20)))
      links.push({ source: ci, target: SANKEY_CQNS.length + li, value })
    })
  })
  return { nodes, links }
}

const BASE_WORKLOAD = { FY25: 2200, FY26: 2500, FY27: 2750 }
export const WORKLOAD_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  plan: BASE_WORKLOAD[fy],
  actual: Math.round(BASE_WORKLOAD[fy] * (0.85 + (i * 6 % 12) / 100)),
}))

export function workloadByFY(filters = {}, granularity) {
  const years = hesEffectiveFiscalYears(filters)
  const ratio = lobScopeRatio(filters)
  const fyRows = WORKLOAD_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, actual: Math.round(d.actual * ratio), plan: Math.round(d.plan * ratio) }))
  return expandToGranularity(fyRows, granularity, ['actual', 'plan'])
}

export { LOB_LIST, GLOBAL_GROUPING_LIST }
