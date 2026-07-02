// Mock data + selectors for the ESG Capacity Plan page (Staffing / Utilization /
// SL% / FTE / Attrition). Structurally mirrors mockData.js/hesData.js — multi-select
// filters as arrays, FY-level series narrowed by the most specific time filter and
// expandable to the page-wide Quarter/Month/Week granularity toggle, real queue names
// paired with illustrative numbers — but is its own module since this page has a
// different metric set and its own two new filter dimensions (Country, Business Org).
import {
  FISCAL_YEARS, ACTIVE_QUEUE_NAMES, CAPACITY_CODES, BUSINESS_PARTNERS, CHANNELS, REGIONS,
  COUNTRIES, COUNTRY_REGION, inferRegion, matchesMulti, effectiveFiscalYears,
  expandToGranularity, expandRateToGranularity, regionForCountry,
} from './mockData'

// Real call-center auxiliary/off-productive codes (break, training, meeting, etc.) —
// kept as plain "Aux 1".."Aux 9" labels rather than invented category names, matching
// how the source mockup names them.
export const AUX_CODES = Array.from({ length: 9 }, (_, i) => `Aux ${i + 1}`)

const CAPACITY_FILTER_KEYS = ['combinedQueueName', 'capacityCode', 'channel', 'businessPartner', 'region', 'country']
const CAPACITY_FIELD_BY_KEY = {
  combinedQueueName: 'name', capacityCode: 'capacityCode', channel: 'channel',
  businessPartner: 'businessPartner', region: 'region', country: 'country',
}

// ── Queue fact table ─────────────────────────────────────────────────────────
// Reuses the Forecasting page's real queue names, tagged with capacity-specific
// illustrative numbers (planned/actual headcount, utilization, SL, leaves) —
// same "real names + illustrative structure" convention as ACTIVE_QUEUES.
export const CAPACITY_QUEUES = ACTIVE_QUEUE_NAMES.map((name, i) => {
  const planHC = 8 + (i % 12)
  const actualHC = Math.round(planHC * (0.82 + (i % 13) * 0.02))
  const utilTarget = 80 + (i % 10)
  const utilActual = +(utilTarget * (0.88 + (i % 9) * 0.02)).toFixed(1)
  const slTarget = 80 + (i % 8)
  const slActual = +(slTarget * (0.90 + (i % 11) * 0.015)).toFixed(1)
  const leavesPlan = 2 + (i % 6)
  const leavesActual = Math.round(leavesPlan * (0.7 + (i % 7) * 0.1))
  return {
    name,
    region: inferRegion(name),
    country: COUNTRIES[i % COUNTRIES.length],
    capacityCode: CAPACITY_CODES[i % CAPACITY_CODES.length],
    businessPartner: BUSINESS_PARTNERS[i % BUSINESS_PARTNERS.length],
    channel: CHANNELS[i % CHANNELS.length],
    dbOsp: i % 3 === 0 ? 'OSP' : 'DB',
    planHC, actualHC,
    get hcDelta() { return this.actualHC - this.planHC },
    utilTarget, utilActual,
    get utilGap() { return +(this.utilActual - this.utilTarget).toFixed(1) },
    auxCulprit: AUX_CODES[i % AUX_CODES.length],
    slTarget, slActual,
    leavesPlan, leavesActual,
    get leavesDelta() { return this.leavesActual - this.leavesPlan },
  }
})

export function filterCapacityQueues(filters = {}) {
  return CAPACITY_QUEUES.filter(q => {
    const multiOk = CAPACITY_FILTER_KEYS.every(key => matchesMulti(filters[key], q[CAPACITY_FIELD_BY_KEY[key]]))
    const dbOsp = filters.dbOsp
    return multiOk && (!dbOsp || dbOsp === 'All' || q.dbOsp === dbOsp)
  })
}

function capacityScopeRatio(filters) {
  const total = CAPACITY_QUEUES.length
  return total ? filterCapacityQueues(filters).length / total : 0
}

// ── Headcount (Staffing) ───────────────────────────────────────────────────────
const BASE_HC_PLAN = { FY25: 3150, FY26: 3320, FY27: 3500 }

export const HC_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  plan: BASE_HC_PLAN[fy],
  actual: Math.round(BASE_HC_PLAN[fy] * (0.92 + (i * 5 % 7) / 100)),
  get adherence() { return +((this.actual / this.plan) * 100).toFixed(1) },
}))

export function hcStaffingByFY(filters = {}, granularity) {
  const years = effectiveFiscalYears(filters)
  const ratio = capacityScopeRatio(filters)
  const fyRows = HC_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, plan: Math.round(d.plan * ratio), actual: Math.round(d.actual * ratio) }))
  return expandToGranularity(fyRows, granularity, ['plan', 'actual'])
    .map(d => ({ ...d, adherence: d.plan ? +((d.actual / d.plan) * 100).toFixed(1) : 0 }))
}

// ── Attrition (Layer 1, Visual 2) — headcount + attrition %, Region/Country lens ──
const BASE_ATTRITION_TARGET = { FY25: 8.5, FY26: 8, FY27: 7.5 }

export const ATTRITION_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  headcount: 3000 + ((i * 137) % 1000),
  attrition: +(BASE_ATTRITION_TARGET[fy] * (1.1 + (i * 3 % 9) / 100)).toFixed(1),
}))

// `lens` ('Region'|'Country') is a cosmetic scoping toggle — a small deterministic
// scale factor stands in for a real per-region/per-country attrition dataset, same
// "illustrative structure" convention used everywhere else in the app for a control
// that's real and interactive but not backed by a full new dimension of source data.
export function attritionByFY(filters = {}, granularity, lens = 'Region') {
  const years = effectiveFiscalYears(filters)
  const lensScale = lens === 'Country' ? 0.97 : 1
  const fyRows = ATTRITION_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, headcount: Math.round(d.headcount * lensScale), attrition: d.attrition }))
  const expandedHc = expandToGranularity(fyRows, granularity, ['headcount'])
  const expandedRate = expandRateToGranularity(fyRows, granularity, ['attrition'])
  return expandedHc.map((d, i) => ({ ...d, attrition: expandedRate[i].attrition }))
}

// ── Actual vs Plan trend with SL% (Layer 1, Visual 3) ─────────────────────────
const BASE_SL_TARGET = { FY25: 82, FY26: 84, FY27: 86 }

export const SL_TREND_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  actual: BASE_HC_PLAN[fy] * (0.9 + (i * 4 % 6) / 100),
  plan: BASE_HC_PLAN[fy],
  slPct: +(BASE_SL_TARGET[fy] * (1.0 + (i * 3 % 8) / 100)).toFixed(1),
})).map(d => ({ ...d, actual: Math.round(d.actual) }))

export function slTrendByFY(filters = {}, granularity) {
  const years = effectiveFiscalYears(filters)
  const ratio = capacityScopeRatio(filters)
  const fyRows = SL_TREND_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, actual: Math.round(d.actual * ratio), plan: Math.round(d.plan * ratio), slPct: d.slPct }))
  const expandedVol = expandToGranularity(fyRows, granularity, ['actual', 'plan'])
  const expandedRate = expandRateToGranularity(fyRows, granularity, ['slPct'])
  return expandedVol.map((d, i) => ({ ...d, slPct: expandedRate[i].slPct }))
}

// Queues where actual headcount exceeds plan ("defaulter queues"), ascending by
// how far over plan they are — backs the small list under Layer 1 Visual 3.
export function defaulterQueues(filters = {}, count = 6) {
  return filterCapacityQueues(filters)
    .filter(q => q.hcDelta > 0)
    .sort((a, b) => a.hcDelta - b.hcDelta)
    .slice(0, count)
    .map(q => ({ name: q.name, actual: q.actualHC, plan: q.planHC, delta: q.hcDelta }))
}

// ── Plan over Plan headcount comparison (Layer 2) ─────────────────────────────
const BASE_PLAN_HC = BASE_HC_PLAN.FY27

export const CAPACITY_PLAN_VS_PLAN_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  plan1: BASE_HC_PLAN[fy],
  plan2: Math.round(BASE_HC_PLAN[fy] * (0.95 + (i * 7 % 11) / 100)),
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

export function planOverPlanHCByFY(filters = {}, granularity) {
  const years = effectiveFiscalYears(filters)
  const rows = CAPACITY_PLAN_VS_PLAN_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, plan1: d.plan1, plan2: d.plan2 }))
  return expandToGranularity(rows, granularity, ['plan1', 'plan2'])
    .map(d => ({ ...d, variance: d.plan1 ? +((d.plan2 - d.plan1) / d.plan1 * 100).toFixed(1) : 0 }))
}

// ── Utilization time trend (Layer 3, Visual 1) — Aux culprit added after expansion ─
const BASE_UTIL_TARGET = { FY25: 82, FY26: 84, FY27: 86 }

export const UTIL_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  target: BASE_UTIL_TARGET[fy],
  actual: +(BASE_UTIL_TARGET[fy] * (0.95 + (i * 6 % 10) / 100)).toFixed(1),
}))

export function utilizationByFY(filters = {}, granularity) {
  const years = effectiveFiscalYears(filters)
  const fyRows = UTIL_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, target: d.target, actual: d.actual }))
  const expanded = expandRateToGranularity(fyRows, granularity, ['target', 'actual'])
  // Aux culprit/impact are added per resulting period (not carried through the
  // expansion helper, which only knows about the rate fields it's told to keep) so
  // the tooltip has something to show at every granularity, not just Year.
  return expanded.map((d, i) => ({
    ...d,
    auxCulprit: AUX_CODES[i % AUX_CODES.length],
    auxImpactPct: +(2 + (i * 3) % 6).toFixed(1),
  }))
}

// ── Utilization by queue — "Queues with Aux culprit" (Layer 3, Visual 2) ──────
// Top-N queues by |utilization gap|, worst first — same "top queues" ranking
// convention as the Forecasting page's diverging variance charts.
export function utilizationByQueue(filters = {}, topN = 6) {
  const rows = filterCapacityQueues(filters)
  const hasQueue = filters.combinedQueueName?.length > 0
  const list = hasQueue ? rows : [...rows].sort((a, b) => Math.abs(b.utilGap) - Math.abs(a.utilGap)).slice(0, topN)
  return list.map(q => ({
    name: q.name, actual: q.utilActual, target: q.utilTarget,
    adherence: q.utilTarget ? +((q.utilActual / q.utilTarget) * 100).toFixed(1) : 0,
    auxCulprit: q.auxCulprit,
  }))
}

// ── Outage: Actual vs Target Leaves by queue (Layer 3, Visual 3) ──────────────
// Picks the queues with the biggest |actual-vs-plan leaves| gap first (so the real
// problem queues aren't missed), then displays that shortlist in ascending order
// by delta, per the requested "arranged in ascending order."
export function leavesByQueue(filters = {}, topN = 6) {
  const rows = filterCapacityQueues(filters)
  const hasQueue = filters.combinedQueueName?.length > 0
  const list = hasQueue ? rows : [...rows].sort((a, b) => Math.abs(b.leavesDelta) - Math.abs(a.leavesDelta)).slice(0, topN)
  return list
    .sort((a, b) => a.leavesDelta - b.leavesDelta)
    .map(q => ({ name: q.name, actual: q.leavesActual, target: q.leavesPlan, delta: q.leavesDelta }))
}

// ── Card headlines ─────────────────────────────────────────────────────────
// Latest in-scope fiscal year's snapshot for each of the 5 KPI cards. Staffing/
// Utilization/SL adherence % naturally don't shift with queue-scoping filters
// (both sides of each ratio scale together) — only headcount totals (Total FTE)
// visibly respond, same reasoning as the Forecasting/HES cards' rate metrics.
export function capacityCardData(filters = {}) {
  const hc = hcStaffingByFY(filters)
  const util = UTIL_BY_FY.filter(d => effectiveFiscalYears(filters).includes(d.period))
  const sl = SL_TREND_BY_FY.filter(d => effectiveFiscalYears(filters).includes(d.period))
  const attrition = ATTRITION_BY_FY.filter(d => effectiveFiscalYears(filters).includes(d.period))
  const latestHc = hc[hc.length - 1]
  const latestUtil = util[util.length - 1]
  const latestSl = sl[sl.length - 1]
  const latestAttrition = attrition[attrition.length - 1]
  const latestAttritionTarget = latestAttrition ? BASE_ATTRITION_TARGET[latestAttrition.period] : 0
  return {
    staffing: { value: latestHc?.adherence ?? 0 },
    utilization: { actual: latestUtil?.actual ?? 0, target: latestUtil?.target ?? 0 },
    sl: { actual: latestSl?.slPct ?? 0, target: latestSl ? BASE_SL_TARGET[latestSl.period] : 0 },
    totalFte: { actual: latestHc?.actual ?? 0, plan: latestHc?.plan ?? 0 },
    attrition: { actual: latestAttrition?.attrition ?? 0, target: latestAttritionTarget },
  }
}

// ── Geo Map: headcount fulfillment % / SL% by region, with a curated Country lens ─
// Same choropleth mechanism as Layer3GeoMap/HesGeoMap (region fill, dimmed fallback
// for non-highlighted areas in Country view) but colored by whichever of the two
// capacity metrics the map's own toggle picks, over the curated 14-country list
// rather than the full world-atlas sub-region system.
export const GEO_CAPACITY_BY_REGION = [
  { region: 'NAMER', fulfillmentPct: 96, slPct: 92 },
  { region: 'EMEA', fulfillmentPct: 91, slPct: 81 },
  { region: 'APJ', fulfillmentPct: 94, slPct: 88 },
  { region: 'LATAM', fulfillmentPct: 88, slPct: 76 },
]

const COUNTRY_TO_WORLD_ATLAS_NAME = {
  'United States': 'United States of America', Canada: 'Canada', Brazil: 'Brazil', Mexico: 'Mexico', Argentina: 'Argentina',
  'United Kingdom': 'United Kingdom', Germany: 'Germany', France: 'France', 'South Africa': 'South Africa',
  India: 'India', China: 'China', Japan: 'Japan', Australia: 'Australia', Singapore: 'Singapore',
}
const WORLD_ATLAS_TO_COUNTRY = Object.fromEntries(
  Object.entries(COUNTRY_TO_WORLD_ATLAS_NAME).map(([country, atlasName]) => [atlasName, country])
)

export function geoCapacityByRegion(filters = {}) {
  return GEO_CAPACITY_BY_REGION.filter(d => matchesMulti(filters.region, d.region))
}

// Per-country value nudges the parent region's value deterministically so the 14
// curated countries don't all show identical values within their region.
export function geoCapacityByCountry(filters = {}, metric = 'fulfillmentPct') {
  const active = filters.country?.length ? filters.country : COUNTRIES
  return active.map((country, i) => {
    const region = COUNTRY_REGION[country]
    const base = GEO_CAPACITY_BY_REGION.find(r => r.region === region)?.[metric] ?? 85
    const value = Math.max(0, Math.min(100, base + ((i * 7) % 9) - 4))
    return { country, worldAtlasName: COUNTRY_TO_WORLD_ATLAS_NAME[country], region, value }
  })
}

export { regionForCountry, WORLD_ATLAS_TO_COUNTRY }
