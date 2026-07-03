// Mock data + selectors for the ESG Capacity Plan page (Staffing / Utilization /
// SL% / FTE / Attrition). Structurally mirrors mockData.js/hesData.js — multi-select
// filters as arrays, FY-level series narrowed by the most specific time filter and
// expandable to the page-wide Quarter/Month/Week granularity toggle, real queue names
// paired with illustrative numbers — but is its own module since this page has a
// different metric set and its own two new filter dimensions (Country, Business Org).
import {
  FISCAL_YEARS, ACTIVE_QUEUE_NAMES, ACTIVE_QUEUES, CAPACITY_CODES, BUSINESS_PARTNERS, CHANNELS,
  REGIONS, SUB_REGIONS, inferRegion, matchesMulti, effectiveFiscalYears,
  expandToGranularity, expandRateToGranularity, regionForCountry, subRegionForCountry,
} from './mockData'

// Real call-center auxiliary/off-productive codes (break, training, meeting, etc.) —
// kept as plain "Aux 1".."Aux 9" labels rather than invented category names, matching
// how the source mockup names them.
export const AUX_CODES = Array.from({ length: 9 }, (_, i) => `Aux ${i + 1}`)

const CAPACITY_FILTER_KEYS = ['combinedQueueName', 'capacityCode', 'channel', 'businessPartner', 'region', 'subRegion']
const CAPACITY_FIELD_BY_KEY = {
  combinedQueueName: 'name', capacityCode: 'capacityCode', channel: 'channel',
  businessPartner: 'businessPartner', region: 'region', subRegion: 'subRegion',
}

// ── Queue fact table ─────────────────────────────────────────────────────────
// Reuses the Forecasting page's real queue names, tagged with capacity-specific
// illustrative numbers (planned/actual headcount, utilization, SL, leaves) —
// same "real names + illustrative structure" convention as ACTIVE_QUEUES. Sub-region
// is read directly off ACTIVE_QUEUES[i] (same name, same index, same source array)
// instead of re-assigned independently, so a given queue carries the identical
// sub-region tag on both this page and ESG Forecasting.
export const CAPACITY_QUEUES = ACTIVE_QUEUE_NAMES.map((name, i) => {
  const planHC = 8 + (i % 12)
  const actualHC = Math.round(planHC * (0.82 + (i % 13) * 0.02))
  const utilTarget = 80 + (i % 10)
  const utilActual = +(utilTarget * (0.88 + (i % 9) * 0.02)).toFixed(1)
  const slTarget = 80 + (i % 8)
  const slActual = +(slTarget * (0.90 + (i % 11) * 0.015)).toFixed(1)
  const leavesPlan = 2 + (i % 6)
  const leavesActual = Math.round(leavesPlan * (0.7 + (i % 7) * 0.1))
  // Plan-over-Plan (Plan A vs Plan B) headcount, distinct from planHC/actualHC above
  // (which compare Plan vs Actual, a different axis) — backs the "queues with highest
  // variation" ranking under the Plan over Plan Variation layer.
  const popPlan1 = planHC
  const popPlan2 = Math.round(popPlan1 * (0.82 + (i % 17) * 0.018))
  return {
    name,
    region: inferRegion(name),
    subRegion: ACTIVE_QUEUES[i]?.subRegion,
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
    popPlan1, popPlan2,
    get popVariance() { return this.popPlan1 ? +((this.popPlan2 - this.popPlan1) / this.popPlan1 * 100).toFixed(1) : 0 },
  }
})

export function filterCapacityQueues(filters = {}) {
  return CAPACITY_QUEUES.filter(q => {
    const multiOk = CAPACITY_FILTER_KEYS.every(key => matchesMulti(filters[key], q[CAPACITY_FIELD_BY_KEY[key]]))
    const dbOsp = filters.dbOsp
    return multiOk && (!dbOsp || dbOsp === 'All' || q.dbOsp === dbOsp)
  })
}

// Deterministic distribution of a queue set across whichever dimension ('region'|
// 'subRegion') is asked for — backs both the Attrition drill's default region/
// sub-region-level view and the Plan over Plan Variation layer's same toggle,
// instead of hand-maintaining a separate hardcoded share table per dimension.
function shareByKey(rows, key) {
  const counts = {}
  rows.forEach(q => { if (q[key] != null) counts[q[key]] = (counts[q[key]] || 0) + 1 })
  const total = rows.length || 1
  return Object.fromEntries(Object.entries(counts).map(([k, c]) => [k, c / total]))
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

// Region/Sub-region default view for HeadcountLayer Visual2 — one row per key
// (region or sub-region), sized by each key's share of the currently in-scope
// queues, at the latest in-scope FY's attrition%. Clicking a row drills into
// attritionTrendByDimension below instead of showing a flat per-key number.
export function attritionByDimension(filters = {}, dimension = 'Region') {
  const key = dimension === 'SubRegion' ? 'subRegion' : 'region'
  const scoped = filterCapacityQueues(filters)
  const rows = scoped.length ? scoped : CAPACITY_QUEUES
  const shares = shareByKey(rows, key)
  const years = effectiveFiscalYears(filters)
  const fyRows = ATTRITION_BY_FY.filter(d => years.includes(d.period))
  const latest = fyRows[fyRows.length - 1] || ATTRITION_BY_FY[ATTRITION_BY_FY.length - 1]
  return Object.entries(shares)
    .map(([k, share], i) => {
      const headcount = Math.round(latest.headcount * share)
      const attrition = +(latest.attrition * (0.9 + ((i * 7) % 13) / 50)).toFixed(1)
      return { key: k, headcount, attrition, attritionCount: Math.round(headcount * attrition / 100) }
    })
    .sort((a, b) => b.headcount - a.headcount)
}

// FY/granularity trend for one clicked region/sub-region key — same "click a region
// to drill into its own time trend" mechanic as hesData.js's cpasuByRegion/
// cpasuTrendByRegion, scaled by that key's share of the currently in-scope queues
// so the drilled trend still respects whatever the top filters/granularity are set to.
export function attritionTrendByDimension(filters = {}, key, dimension = 'Region', granularity) {
  const dimKey = dimension === 'SubRegion' ? 'subRegion' : 'region'
  const scoped = filterCapacityQueues(filters)
  const rows = scoped.length ? scoped : CAPACITY_QUEUES
  const shares = shareByKey(rows, dimKey)
  const share = shares[key] ?? (1 / (Object.keys(shares).length || 1))
  const years = effectiveFiscalYears(filters)
  const fyRows = ATTRITION_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, headcount: Math.round(d.headcount * share), attrition: d.attrition }))
  const expandedHc = expandToGranularity(fyRows, granularity, ['headcount'])
  const expandedRate = expandRateToGranularity(fyRows, granularity, ['attrition'])
  return expandedHc.map((d, i) => ({
    ...d, attrition: expandedRate[i].attrition,
    attritionCount: Math.round(d.headcount * expandedRate[i].attrition / 100),
  }))
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

// Headcount-Impact-on-SL defaulter list (Layer 1, Visual 3): queues that are both
// over their headcount plan AND still missing SL — i.e. extra heads didn't fix the
// service-level problem, which is the actionable signal this list is meant to
// surface (a queue merely over plan with healthy SL isn't a defaulter by this logic).
export function slDefaulterQueues(filters = {}, count = 6) {
  return filterCapacityQueues(filters)
    .filter(q => q.actualHC > q.planHC && q.slActual < 90)
    .sort((a, b) => a.slActual - b.slActual)
    .slice(0, count)
    .map(q => ({ name: q.name, actualHC: q.actualHC, planHC: q.planHC, hcDelta: q.hcDelta, slActual: q.slActual }))
}

// ── Plan over Plan headcount comparison (Layer 2) ─────────────────────────────
// FY-level baseline that planOverPlanByDimension/planOverPlanTrendByDimension below
// scale per region/sub-region share — this page's Plan over Plan Variation layer
// only ever shows the region/sub-region drill, not a flat FY-only chart, so there's
// no standalone planOverPlanByFY selector here (unlike HES Capacity's simpler layer).
export const CAPACITY_PLAN_VS_PLAN_BY_FY = FISCAL_YEARS.map((fy, i) => ({
  period: fy,
  plan1: BASE_HC_PLAN[fy],
  plan2: Math.round(BASE_HC_PLAN[fy] * (0.95 + (i * 7 % 11) / 100)),
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

// Region/Sub-region default view for the Plan over Plan Variation layer — same
// share-weighted mechanic as attritionByDimension, applied to Plan A/B headcount
// instead of attrition.
export function planOverPlanByDimension(filters = {}, dimension = 'Region') {
  const key = dimension === 'SubRegion' ? 'subRegion' : 'region'
  const scoped = filterCapacityQueues(filters)
  const rows = scoped.length ? scoped : CAPACITY_QUEUES
  const shares = shareByKey(rows, key)
  const years = effectiveFiscalYears(filters)
  const fyRows = CAPACITY_PLAN_VS_PLAN_BY_FY.filter(d => years.includes(d.period))
  const latest = fyRows[fyRows.length - 1] || CAPACITY_PLAN_VS_PLAN_BY_FY[CAPACITY_PLAN_VS_PLAN_BY_FY.length - 1]
  return Object.entries(shares)
    .map(([k, share]) => {
      const plan1 = Math.round(latest.plan1 * share)
      const plan2 = Math.round(latest.plan2 * share)
      return { key: k, plan1, plan2, variance: plan1 ? +((plan2 - plan1) / plan1 * 100).toFixed(1) : 0 }
    })
    .sort((a, b) => b.plan1 - a.plan1)
}

// FY/granularity trend for one clicked region/sub-region key, same drill mechanic
// as attritionTrendByDimension.
export function planOverPlanTrendByDimension(filters = {}, key, dimension = 'Region', granularity) {
  const dimKey = dimension === 'SubRegion' ? 'subRegion' : 'region'
  const scoped = filterCapacityQueues(filters)
  const rows = scoped.length ? scoped : CAPACITY_QUEUES
  const shares = shareByKey(rows, dimKey)
  const share = shares[key] ?? (1 / (Object.keys(shares).length || 1))
  const years = effectiveFiscalYears(filters)
  const fyRows = CAPACITY_PLAN_VS_PLAN_BY_FY.filter(d => years.includes(d.period))
    .map(d => ({ period: d.period, plan1: Math.round(d.plan1 * share), plan2: Math.round(d.plan2 * share) }))
  return expandToGranularity(fyRows, granularity, ['plan1', 'plan2'])
    .map(d => ({ ...d, variance: d.plan1 ? +((d.plan2 - d.plan1) / d.plan1 * 100).toFixed(1) : 0 }))
}

// Queues with the highest Plan-over-Plan headcount variation, worst (largest
// |variance|) first — the ranked list under the Plan over Plan Variation layer,
// meant to be the page's headline "what's actually driving plan risk" visual.
export function planOverPlanQueueVariance(filters = {}, topN = 8) {
  const rows = filterCapacityQueues(filters)
  const hasQueue = filters.combinedQueueName?.length > 0
  const list = hasQueue ? rows : rows.slice()
  return list
    .map(q => ({ name: q.name, plan1: q.popPlan1, plan2: q.popPlan2, variance: q.popVariance }))
    .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
    .slice(0, topN)
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
  // Aux breakdown (top 3 contributing codes) and adherence % are added per resulting
  // period (not carried through the expansion helper, which only knows about the rate
  // fields it's told to keep) so the tooltip has something to show at every
  // granularity, not just Year. A gap can genuinely be driven by more than one Aux
  // code, so the tooltip shows the top 3 by impact rather than a single culprit.
  return expanded.map((d, i) => {
    const auxBreakdown = [0, 1, 2]
      .map(k => ({
        code: AUX_CODES[(i + k * 2) % AUX_CODES.length],
        impactPct: +(1.5 + ((i * 5 + k * 7) % 7)).toFixed(1),
      }))
      .sort((a, b) => b.impactPct - a.impactPct)
    return {
      ...d,
      adherence: d.target ? +((d.actual / d.target) * 100).toFixed(1) : 0,
      auxBreakdown,
      auxCulprit: auxBreakdown[0].code,
      auxImpactPct: auxBreakdown[0].impactPct,
    }
  })
}

// ── Utilization by queue — "Utilization Defaulter Queues" (Layer 3, Visual 2) ─
// Top-N queues by |utilization gap|, worst first — same "top queues" ranking
// convention as the Forecasting page's diverging variance charts. Each queue now
// carries its top 3 contributing Aux codes, not just a single culprit.
export function utilizationByQueue(filters = {}, topN = 6) {
  const rows = filterCapacityQueues(filters)
  const hasQueue = filters.combinedQueueName?.length > 0
  const list = hasQueue ? rows : [...rows].sort((a, b) => Math.abs(b.utilGap) - Math.abs(a.utilGap)).slice(0, topN)
  return list.map(q => {
    const ci = AUX_CODES.indexOf(q.auxCulprit)
    const auxes = [q.auxCulprit, AUX_CODES[(ci + 3) % AUX_CODES.length], AUX_CODES[(ci + 6) % AUX_CODES.length]]
    return {
      name: q.name, actual: q.utilActual, target: q.utilTarget,
      adherence: q.utilTarget ? +((q.utilActual / q.utilTarget) * 100).toFixed(1) : 0,
      auxCulprit: q.auxCulprit,
      auxes,
    }
  })
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

// Year-over-year % change between the latest in-scope FY and the one before it;
// null when there's no prior year in scope, same convention as hesData.js's yoyPct.
function yoyPct(curr, prev) {
  if (prev === undefined || prev === null || !prev) return null
  return +(((curr - prev) / prev) * 100).toFixed(1)
}

// ── Card headlines ─────────────────────────────────────────────────────────
// The headline `value`/`actual` for each card drills with the page-wide Quarter/
// Month/Week slicer (granularity); the YTD `period`/`prevPeriod`/`yoyPct` comparison
// is always FY-over-FY regardless of granularity — same split HES Forecasting's
// hesCardData uses, since a granular sub-year YoY comparison has no real baseline
// to compare against (the sub-period numbers are themselves synthesized from the FY
// total). Staffing/Utilization/SL adherence % naturally don't shift with queue-scoping
// filters (both sides of each ratio scale together) — only headcount totals (Total FTE)
// visibly respond, same reasoning as the Forecasting/HES cards' rate metrics.
export function capacityCardData(filters = {}, granularity) {
  const years = effectiveFiscalYears(filters)
  const hcGranular = hcStaffingByFY(filters, granularity)
  const hcFY = hcStaffingByFY(filters)
  const utilFY = UTIL_BY_FY.filter(d => years.includes(d.period))
  const slFY = SL_TREND_BY_FY.filter(d => years.includes(d.period))
  const attritionFY = ATTRITION_BY_FY.filter(d => years.includes(d.period))

  const latestHc = hcGranular[hcGranular.length - 1]
  const latestHcFY = hcFY[hcFY.length - 1]
  const prevHcFY = hcFY[hcFY.length - 2]
  const latestUtil = utilFY[utilFY.length - 1]
  const prevUtil = utilFY[utilFY.length - 2]
  const latestSl = slFY[slFY.length - 1]
  const prevSl = slFY[slFY.length - 2]
  const latestAttrition = attritionFY[attritionFY.length - 1]
  const prevAttrition = attritionFY[attritionFY.length - 2]

  return {
    staffing: {
      value: latestHc?.adherence ?? 0,
      period: latestHcFY?.period, prevPeriod: prevHcFY?.period, yoyPct: yoyPct(latestHcFY?.adherence, prevHcFY?.adherence),
    },
    utilization: {
      actual: latestUtil?.actual ?? 0, target: latestUtil?.target ?? 0,
      period: latestUtil?.period, prevPeriod: prevUtil?.period, yoyPct: yoyPct(latestUtil?.actual, prevUtil?.actual),
    },
    sl: {
      actual: latestSl?.slPct ?? 0, target: latestSl ? BASE_SL_TARGET[latestSl.period] : 0,
      period: latestSl?.period, prevPeriod: prevSl?.period, yoyPct: yoyPct(latestSl?.slPct, prevSl?.slPct),
    },
    totalFte: {
      actual: latestHc?.actual ?? 0, plan: latestHc?.plan ?? 0,
      period: latestHcFY?.period, prevPeriod: prevHcFY?.period, yoyPct: yoyPct(latestHcFY?.actual, prevHcFY?.actual),
    },
    attrition: {
      actual: latestAttrition?.attrition ?? 0, target: latestAttrition ? BASE_ATTRITION_TARGET[latestAttrition.period] : 0,
      period: latestAttrition?.period, prevPeriod: prevAttrition?.period, yoyPct: yoyPct(latestAttrition?.attrition, prevAttrition?.attrition),
    },
  }
}

// ── Geo Map: headcount fulfillment % / SL% by region, with a Sub-region lens ──────
// Same choropleth mechanism as Layer3GeoMap/HesGeoMap (region fill, dimmed fallback
// for non-highlighted areas in Sub-region view) but colored by whichever of the two
// capacity metrics the map's own toggle picks. Sub-region view uses the same real
// 24 SUB_REGIONS values (and subRegionForCountry lookup) as ESG Forecasting's own
// Geo Map, replacing the earlier curated 14-country view entirely.
export const GEO_CAPACITY_BY_REGION = [
  { region: 'NAMER', fulfillmentPct: 96, slPct: 92 },
  { region: 'EMEA', fulfillmentPct: 91, slPct: 81 },
  { region: 'APJ', fulfillmentPct: 94, slPct: 88 },
  { region: 'LATAM', fulfillmentPct: 88, slPct: 76 },
]

export function geoCapacityByRegion(filters = {}) {
  return GEO_CAPACITY_BY_REGION.filter(d => matchesMulti(filters.region, d.region))
}

// Per-sub-region value nudges a rotating region baseline deterministically, same
// "real names + illustrative structure" convention as mockData.js's SUB_REGION_ACCURACY.
export const GEO_CAPACITY_BY_SUBREGION = SUB_REGIONS.map((subRegion, i) => {
  const base = GEO_CAPACITY_BY_REGION[i % GEO_CAPACITY_BY_REGION.length]
  return {
    subRegion,
    fulfillmentPct: Math.max(60, Math.min(100, base.fulfillmentPct + ((i * 7) % 9) - 4)),
    slPct: Math.max(60, Math.min(100, base.slPct + ((i * 5) % 9) - 4)),
  }
})

export function geoCapacityBySubRegion(filters = {}, metric = 'fulfillmentPct') {
  return GEO_CAPACITY_BY_SUBREGION
    .filter(d => matchesMulti(filters.subRegion, d.subRegion))
    .map(d => ({ subRegion: d.subRegion, value: d[metric] }))
}

export { regionForCountry, subRegionForCountry }
