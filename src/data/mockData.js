export const CQN_LIST = [
  'ISG-ESG-AMER-01', 'ISG-ESG-AMER-02', 'ISG-ESG-AMER-03',
  'ISG-ESG-EMEA-01', 'ISG-ESG-EMEA-02', 'ISG-ESG-EMEA-03',
  'ISG-ESG-APJ-01',  'ISG-ESG-APJ-02',  'ISG-ESG-APJ-03',
  'ISG-ESG-LATAM-01','ISG-ESG-LATAM-02',
]

export const PLAN_NAMES = ['Actual', 'Dec Plan', 'Jan Plan', 'Apr Plan', 'May Plan']
export const FISCAL_YEARS = ['FY25', 'FY26', 'FY27']
export const FISCAL_QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']
export const FISCAL_WEEKS = Array.from({ length: 13 }, (_, i) => `W${i + 1}`)
export const CHANNELS = ['Voice', 'Chat', 'Email', 'Social']
export const REGIONS = ['AMER', 'EMEA', 'APJ', 'LATAM']
export const COUNTRIES = {
  AMER: ['USA', 'Canada', 'Mexico', 'Brazil'],
  EMEA: ['UK', 'Germany', 'France', 'Netherlands', 'India'],
  APJ:  ['Japan', 'Australia', 'Singapore', 'China'],
  LATAM:['Argentina', 'Chile', 'Colombia'],
}
export const BUSINESS_PARTNERS = ['Partner A', 'Partner B', 'Partner C', 'Partner D']

// ── Cards ────────────────────────────────────────────────────────────────────
export const CARD_DATA = {
  totalQueues:     { active: 42, inactive: 8 },
  callVolume:      { offered: 285400, handled: 268700, handlePct: 94.1 },
  dbOspSplit:      { db: 68, osp: 32, dbVol: 193872, ospVol: 91128 },
  forecastAccuracy:{ value: 87.4, target: 90 },
  cqnVariance:     { withinRange: 31, total: 42, pct: 73.8 },
}

export const ACTIVE_QUEUES = CQN_LIST.map((name, i) => ({
  name, region: REGIONS[Math.floor(i / 3) % 4],
  offered: 20000 + i * 3200, handled: 18800 + i * 3000,
  accuracy: 75 + (i * 7) % 25,
}))

// ── Plan over Plan (Layer 1) ─────────────────────────────────────────────────
const BASE_PLAN = { FY25: 240000, FY26: 268000, FY27: 295000 }

export const PLAN_VS_PLAN_BY_FY = FISCAL_YEARS.map(fy => ({
  period: fy,
  plan1: BASE_PLAN[fy],
  plan2: Math.round(BASE_PLAN[fy] * (0.93 + Math.random() * 0.1)),
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

export const PLAN_VS_PLAN_BY_QTR = ['Q1 FY26','Q2 FY26','Q3 FY26','Q4 FY26'].map((q, i) => ({
  period: q,
  plan1: 58000 + i * 4000,
  plan2: 55000 + i * 4200,
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

export const PLAN_VS_PLAN_BY_WEEK = FISCAL_WEEKS.map((w, i) => ({
  period: w,
  plan1: 4200 + (i % 4) * 200,
  plan2: 4000 + (i % 4) * 210,
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

export const PLAN_VS_PLAN_BY_REGION = REGIONS.map((r, i) => ({
  region: r,
  plan1: [95000, 78000, 62000, 33000][i],
  plan2: [89000, 81000, 58000, 31000][i],
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

export const PLAN_VS_PLAN_BY_CQN = CQN_LIST.slice(0, 8).map((cqn, i) => ({
  cqn: cqn.replace('ISG-ESG-', ''),
  plan1: 22000 + i * 2800,
  plan2: 20500 + i * 3000,
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

// ── Actual vs Plan (Layer 2) ─────────────────────────────────────────────────
export const ACTUAL_VS_PLAN_BY_FY = FISCAL_YEARS.map(fy => ({
  period: fy,
  actual: BASE_PLAN[fy] * (0.88 + Math.random() * 0.08),
  plan:   BASE_PLAN[fy],
  get adherence() { return +((this.actual / this.plan) * 100).toFixed(1) },
})).map(d => ({ ...d, actual: Math.round(d.actual) }))

export const ACTUAL_VS_PLAN_BY_QTR = ['Q1 FY26','Q2 FY26','Q3 FY26','Q4 FY26'].map((q, i) => ({
  period: q,
  actual: Math.round((56000 + i * 3800) * (0.87 + (i % 3) * 0.04)),
  plan:   58000 + i * 4000,
  get adherence() { return +((this.actual / this.plan) * 100).toFixed(1) },
}))

export const ACTUAL_VS_PLAN_BY_WEEK = FISCAL_WEEKS.map((w, i) => ({
  period: w,
  actual: Math.round((4200 + (i % 4) * 200) * (0.85 + (i % 5) * 0.03)),
  plan:   4200 + (i % 4) * 200,
  get adherence() { return +((this.actual / this.plan) * 100).toFixed(1) },
}))

// Stacked bar: adherence buckets per FY
export const STACKED_ADHERENCE = [
  { fy: 'FY25', excellent: 43, good: 36, fair: 9,  poor: 13 },
  { fy: 'FY26', excellent: 25, good: 40, fair: 17, poor: 19 },
  { fy: 'FY27', excellent: 31, good: 29, fair: 25, poor: 15 },
]

export const ACTUAL_VS_PLAN_BY_CQN = CQN_LIST.slice(0, 8).map((cqn, i) => {
  const plan = 22000 + i * 2800
  const actual = Math.round(plan * (0.78 + i * 0.03))
  return {
    cqn: cqn.replace('ISG-ESG-', ''),
    actual, plan,
    variance: +((actual - plan) / plan * 100).toFixed(1),
  }
})

// ── Geo Map (Layer 3) ────────────────────────────────────────────────────────
export const GEO_REGION_DATA = [
  { region: 'AMER',  accuracy: 91, lat: 0,    lng: -95,  label: 'AMER' },
  { region: 'EMEA',  accuracy: 79, lat: 50,   lng: 10,   label: 'EMEA' },
  { region: 'APJ',   accuracy: 85, lat: 25,   lng: 100,  label: 'APJ' },
  { region: 'LATAM', accuracy: 68, lat: -15,  lng: -60,  label: 'LATAM' },
]

export const GEO_COUNTRY_DATA = [
  { country: 'USA',         region: 'AMER',  accuracy: 93, lat: 38,   lng: -97 },
  { country: 'Canada',      region: 'AMER',  accuracy: 88, lat: 57,   lng: -100 },
  { country: 'Mexico',      region: 'AMER',  accuracy: 82, lat: 24,   lng: -102 },
  { country: 'Brazil',      region: 'LATAM', accuracy: 71, lat: -10,  lng: -55 },
  { country: 'UK',          region: 'EMEA',  accuracy: 85, lat: 53,   lng: -2 },
  { country: 'Germany',     region: 'EMEA',  accuracy: 78, lat: 51,   lng: 10 },
  { country: 'France',      region: 'EMEA',  accuracy: 80, lat: 46,   lng: 2 },
  { country: 'India',       region: 'EMEA',  accuracy: 75, lat: 22,   lng: 80 },
  { country: 'Japan',       region: 'APJ',   accuracy: 90, lat: 36,   lng: 138 },
  { country: 'Australia',   region: 'APJ',   accuracy: 87, lat: -27,  lng: 133 },
  { country: 'Singapore',   region: 'APJ',   accuracy: 83, lat: 1.3,  lng: 103.8 },
  { country: 'China',       region: 'APJ',   accuracy: 79, lat: 35,   lng: 105 },
  { country: 'Argentina',   region: 'LATAM', accuracy: 65, lat: -34,  lng: -64 },
  { country: 'Colombia',    region: 'LATAM', accuracy: 70, lat: 4,    lng: -72 },
]
