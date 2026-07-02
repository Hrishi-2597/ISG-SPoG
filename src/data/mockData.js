export const PLAN_NAMES = ['AOP_FY26Q4_AA', 'FY27 Q1 APR Plan', 'FY27 Q2 JUN Plan', 'FY27Q1_AA']
export const FISCAL_YEARS = ['FY25', 'FY26', 'FY27']

// Fiscal Quarter filter options: FY25Q1 ... FY27Q4
export const FISCAL_QUARTERS = FISCAL_YEARS.flatMap(fy => ['Q1', 'Q2', 'Q3', 'Q4'].map(q => `${fy}${q}`))

// Fiscal Week filter options: FY25W01 ... FY27W52
export const FISCAL_WEEK_LIST = FISCAL_YEARS.flatMap(fy =>
  Array.from({ length: 52 }, (_, i) => `${fy}W${String(i + 1).padStart(2, '0')}`)
)

export const CHANNELS = ['Voice', 'Chat', 'Email', 'Social']
export const REGIONS = ['APJ', 'EMEA', 'Global', 'LATAM', 'NAMER']

export const SUB_REGIONS = [
  'Australia', 'Brazil', 'CER', 'China', 'Costa Rica', 'EC', 'Egypt', 'EMEA', 'France',
  'Germany', 'Global', 'India', 'Israel', 'Japan', 'Korea', 'Multiple SubRegions',
  'Nordics', 'Panama', 'ROLA', 'SER', 'South Asia', 'UKI', 'United Kingdom', 'United States',
]

export const L5_MANAGERS = [
  'Banthia, Nishant', 'Brown, Dexter', 'Carey, Geraldine', 'Christmas, James',
  'Copeland, Jessica', 'Creixell, Gustavo', "D'Arcy, Mark", 'Denis Lucey', 'Dexter Brown',
  'Kenneally, Niall', 'Lind, Matt', 'No Assigned L6', 'Punch, Patrick', 'Vega, Cyril',
  'Yap, Diane',
]

export const BUSINESS_PARTNERS = [
  'Bethany Rana', 'Juliano Alves Neres', 'Khim Sun Lau', 'Lucas Serafim', 'Marcy Jelinek',
  'Miguel Galicia', 'StephenRaj  Kumar',
]

export const CAPACITY_CODES = [
  'AM02','AM04','AM05','AM08','AN02','AN03','AO06','AO11','AO14','AP10','AP11','AP12',
  'AP13','AP14','AP15','AP16','AP17','AP18','AP19','AP20','AP21','AP22','AP23','AP24',
  'AP25','AP26','AX01','AZ09','AZ10','AZ11','AZ13','AZ16','BAH1','BL17','BPS1','BR02',
  'BT01','BT02','BT03','BT04','BT05','BT06','BT07','BT08','BT09','BT10','BT11','BT12',
  'BT13','BT14','BW01','BW02','BW03','BX02','BZ10','BZ11','BZ13','BZ14','BZ15','BZ19',
  'BZ20','BZ21','BZ22','BZ24','CC03','CC04','CC05','CC07','CC09','CC10','CC11','CC12',
  'CC13','CC14','CC22','CC23','CC27','CC28','CC29','CCB1','CCB2','CE01','CE02','CE03',
  'CG Comp','CG01','CGEQ','CGGC','CGVE','CGVX','CHEQ','CM01','CM03','CM04','CM05',
  'CSS1','CST4','CST5','CT11','CT12','CT13','CT14','CT15','CT16','CT17','CT18','CT19',
  'CT20','CT23','CT24','CT25','CT26','CT27','CT29','CT30','CT32','CT34','CT35','CT36',
  'CT37','CT38','CT67','CT68','CT69','CT70','CT76','CT91','CT95','CT96','CTA3','CTA4',
  'CTA5','CTA6','CTA7','CTE2','CTE3','CTE4','CTE6','CV01','CV02','CV03','CV04','CV05',
  'CX01','CX02','CX03','CX04','CX05','CZ03','DE07','DE08','DE09','DE10','DE12','DE13',
  'DE17','DE18','DP01','EC03','EC04','EC06','EC07','EC14','EC21','EC30','EC32','EC33',
  'EC34','EC39','EG13','EMC1','EN01','ER02','ES01','ES03','ES06','ES07','FD01','FED4',
  'FED6','FR05','FR06','FR07','FR08','FR09','FR11','FR12','FR13','FR23','FR27','GB01',
  'GB08','GB09','GB10','GB11','GB13','GB14','GB16','GB18','GB19','GB21','GB23','GB29',
  'GB31','GC02','GC04','GC06','GC11','GC12','GC13','GC14','GC16','GC17','GC18','GC19',
  'GC20','GC21','GC22','GC23','GC24','GC25','GCF1','GCTE','GG01','GH01','GH02','GH03',
  'GH04','GH05','GH06','GH07','GH08','GH09','GH10','GH11','GH12','GH13','GH14','GH15',
  'GH16','GH17','GH18','GH19','GH20','GH21','GH22','GH23','GH24','GH25','GM01','GP01',
  'GS01','GS02','GS03','GS04','GS05','GT06','HC06','HC07','HE01','HE02','HE03','HE04',
  'HE06','HE09','HE12','HE16','HE17','HE20','HE22','HE23','HE24','HE25','HE26','HE28',
  'HE29','HE30','HE32','HE36','HE37','HE38','HE39','HE40','HE41','HE42','HE43','HE44',
  'HE47','HE48','HE52','HE53','HE58','HE59','HE61','HE62','HE63','HE64','HE66','HE67',
  'HE68','HE70','HE71','HE72','HE73','HE74','HE78','HE81','HE85','HE93','HE95','HEA2',
  'HEA5','HEA9','HEB0','HEB4','HEB5','HEC5','HEC6','HEC7','HED1','HED2','HED3','HED7',
  'HEE4','HEE5','HEF2','HEF5','HEG3','HEG4','HEG8','HEH4','HEH5','HEH6','HEJ1','HEK8',
  'HEL1','HEL2','HEL3','HEL4','HEL5','HW03','HW06','HWPA','ID06','IM01','IN01','IN14',
  'IN15','IN16','IN19','INCV','INPX','INT1','IS01','IS02','IS03','IS04','IS05','IS11',
  'IS14','IS15','IS19','IS20','IS21','IS23','IS24','IS31','IS32','IS34','IS36','IS37',
  'IS38','IS41','IS42','IS47','IS48','IS50','IS51','IS58','IS59','IS61','IS63','IS64',
  'IS65','IS68','IS69','IS74','IS75','IS77','IS78','IS85','IS86','IS88','IS90','IS91',
  'IS92','IS96','IS98','IT04','IT08','IT10','IU02','IU05','IU06','IU13','IU14','IU16',
  'IU20','IU23','IU23a','IU24','IU29','IU30','IU32','IU33','IU40','IU41','IU43','IU45',
  'IU45a','IU46','IU56','IV01','IV03','JM01','JP11','JP13','JP19','JP22','JP24','JP25',
  'JP26','JP27','JP29','JV01','KR05','KR06','KR11','KR12','KR13','KR14','L2G4','L2G5',
  'LFT1','LOS0','LOS1','LOS2','LOS3','LOS4','LOS5','LS01','MR01','MR02','MR03','MY11',
  'MY13','MY14','MY15','NA01','NALC','NC04','NC14','ND02','ND03','NE02','NE04','NE05',
  'NE06','NE07','NE08','NE09','NE13','NE14','NE20','NE21','NE25','NE27','NE29','NE31',
  'NE33','NE35','NE36','NE38','NE39','NF01','NF02','NF03','NF04','NF05','NF06','NF09',
  'NF10','NF11','NF12','NF13','NF14','NF15','NF16','NF17','NF18','NF19','NF20','NF21',
  'NF22','NF23','NF24','NF25','NF26','NF27','NF28','NF29','NF30','NF31','NF32','NF33',
  'NF34','NF35','NF36','NF37','NF40','NF41','NF42','NF43','NF44','NF45','NF46','NF47',
  'NF48','NF49','NF50','NF53','NF54','NF56','NF57','NF58','PE01','PF01','PG01','PH08',
  'PHSS','PM01','PowerProtect','PP21','PS03','PS10','QCE1','RAH1','RE03','RL02','RL05',
  'RL09','RL10','RL11','RL12','RL14','RL15','RL16','RL18','RL19','RM02','ROEN','RP01',
  'RP02','RP03','RPS1','RR02','RR03','RTC1','SA10','SE02','SM02','SMP1','SMP2','SMP3',
  'SMP4','SMP5','SMP6','SMP7','SMP8','SP04','SP09','SP10','SS03','SW02','SY01','TH04',
  'TH07','THBW','UK03','UK05','UK06','UK07','UNOP','UPP1','VCF1','VCF2','VN02','VN03',
  'VN04','VX01','VX02','VX03','VX04','WM01','WM02','WM03','WM04','WM05','WP01','XE01',
  'XE02',
]

// ── Real queue name lists ─────────────────────────────────────────────────────

// Updated 2026-07-02 with a corrected, business-supplied active roster (47 names,
// down from the prior 199) — replaces the previous list wholesale.
export const ACTIVE_QUEUE_NAMES = [
  'CER Server German', 'CZE Enterprise (BRA)', 'EC Compute CEE RUA', 'EC GRE ProSupp Server (MTP)',
  'EC POL Enterprise (HAL)', 'EC ProSupp Server Turkish (HAL)', 'EC Server Arabic',
  'EMEA Solutions HCI FL', 'EMEA Solutions MS FL', 'ENG ProSupp Dutch Server (CWD)',
  'ENG ProSupp Nordics Server (CWD)', 'Enterprise Pro/Core ID', 'Enterprise Pro/Core TH',
  'Enterprise Pro/Core VN', 'FRA Networking (MTP)', 'France Storage', 'GER Networking (HAL)',
  'German Storage', 'Global Compute English', 'Global Inbound Support Team', 'Global Midrange',
  'Global Networking English', 'Global Powerstore', 'KOR Storage Upsell Korean', 'Korea CNS',
  'LATAM AH Portuguese', 'LATAM AH Spanish', 'LATAM Compute Portuguese', 'LATAM Compute Spanish',
  'LATAM Midrange Portuguese', 'LATAM Midrange Spanish', 'LATAM Networking Portuguese',
  'LATAM Networking Spanish', 'LATAM Top Customers Portuguese', 'LATAM Top Customers Spanish',
  'Networking IND', 'Networking Pro/Core Japan', 'PS One', 'ROE Networking (MULTI)',
  'SER Compute Iberian', 'SER Server French', 'SER Server Italian', 'Server Pro/Core Japan',
  'Server ProSupport IND', 'Server ProSupport Plus Japan', 'Storage IND', 'Storage Pro/Core Japan',
]

// Updated 2026-07-02 with a corrected, business-supplied inactive roster (146
// names, down from the prior 406) — replaces the previous list wholesale. Includes
// 'CCC MidRange Mandarin', moved here from the active list per the same update.
export const INACTIVE_QUEUE_NAMES = [
  'APJ GNCS Hyperconverged Wipro', 'APJ NR-FLS', 'APJ Upsell-Operations Multi',
  'Backup Solution HC US', 'Brazil ESG CTE', 'Brazil Powerstore',
  'Brazil Senior and Master Engineer', 'BRZ HC Server Voice (EL)', 'BRZ HC Storage Voice (EL)',
  'BRZ LC Server Voice (EL)', 'BRZ LC Storage Voice (EL)', 'CCC CNS Cantonese',
  'CCC CNS Mandarin', 'CCC CNS Mandarin Email', 'CCC CNS Mandarin Voice', 'CCC MidRange Mandarin',
  'Compellent Copilot US', 'Compute High Complexity', 'Compute ProSupport Alt Channel',
  'CPS Chat ROLA', 'CTE CCC', 'CTE Enterprise KOR', 'CTE JPN', 'CTE KOR', 'CTE NW IND', 'CTE SA',
  'CTE Server/Networking CCC', 'CTE Server/Networking JPN', 'CTE Storage CCC', 'CTE Storage IND',
  'CTE Storage JPN', 'DSP OEM', 'EC Basic Enterprise (CAS)', 'EC ProSupp Server Arabic (CAS)',
  'EC ProSupp Server CEE (HAL)', 'EC ProSupp Storage', 'EC RUS Enterprise (HAL)',
  'EMEA MODULAR CTE', 'EMEA ProSupport Compellent', 'EMEA ProSupport Powerstore',
  'EMEA ProSupport Powervault', 'EMEA SERVER CTE', 'EMEA Server Upsell English',
  'EMEA Solutions HCI (ENG)', 'EMEA Solutions HCI (FRA)', 'EMEA Solutions HCI (GER)',
  'EMEA Solutions MS (ENG)', 'EMEA Solutions MS (FRA)', 'EMEA Solutions MS (GER)',
  'ENG Modular (CWD)', 'ENG ProSupp Server', 'ENG ProSupp Server 247 (CWD)',
  'ENG ProSupport Plus Server', 'ENG Solutions (CWD)', 'Enterprise Alt-channel JPN',
  'Enterprise ANZ AOH', 'Enterprise Core CCC', 'Enterprise Core/ProSupport MIY',
  'Enterprise Echannel CCC', 'Enterprise Echannel Core/Pro MIY', 'Enterprise Pro/Core PH',
  'Enterprise ProSupport ANZ/SA', 'Enterprise ProSupport KOR', 'Enterprise SA',
  'Enterprise SA Email', 'Enterprise Support Services US', 'Enterprise Triage Queue US',
  'Enterprise TW', 'Federal Server US', 'Federal Support NA', 'FRA Basic Enterprise (CAS)',
  'FRA Modular (MTP)', 'FRA ProSupp Server Alternate', 'FRA ProSupp Storage (MTP)',
  'FRA ProSupport Plus Server (MTP)', 'FRA ProSupport Server (CAS)', 'FRA Solutions (MTP)',
  'GER Enterprise (HAL)', 'GER Modular (HAL)', 'GER ProSupp Server Email (HAL)',
  'GER ProSupp Storage Co Pilot', 'GER Solutions (HAL)', 'HES Global Operations',
  'Honeywell Panama', 'IND VX Rail Storage', 'ITA Basic Enterprise (CAS)',
  'ITA ProSupp Server (MTP)', 'Japan Enterprise SW-NWK', 'Japan Storage ProSupport KAW',
  'KOR Compute Basic Korean', 'KOR Compute Upsell Korean', 'KOR Networking Upsell Korean',
  'MMCLA ESG CTE', 'MMCLA HC Server Voice (PAN)', 'MMCLA LC Server Voice (PAN)',
  'MMCLA Powerstore', 'Modular US', 'NA Compute Pro Support', 'NA CTE Server', 'NA CTE Storage',
  'NA ProSupp Storage eSupport', 'NA Server Basic (BNG)', 'NA Server Basic Chat (BNG)',
  'Networking Basic US', 'Networking CCC', 'Networking Pro Core SA',
  'Networking ProSupport Analysts US', 'Networking ProSupport ANZ', 'Networking ProSupport RTSE US',
  'Networking ProSupport US', 'Networking SPSPE', 'POR ProSupp Server (MTP)',
  'PowerEdge After Hours US', 'PowerEdge Alternate Channel US', 'Powerstore US',
  'Proactive Systems Maintenance ROLA', 'ProSupp EQL (CWD)', 'ProSupp EQL (MTP)',
  'ProSupp Storage 247 (CWD)', 'ProSupp Storage Co Pilot (CWD)', 'ROLA Senior and Master Engineer',
  'RT Linux / Virtualization US', 'RT Microsoft US', 'Server Combined CCC', 'Server Core IND',
  'Server ProSupport ANZ', 'Server ProSupport CCC', 'Server ProSupport Chat US',
  'Server ProSupport Plus CCC', 'Server ProSupport ROLA', 'Skytech Enterprise SA',
  'SPA Basic Enterprise (CAS)', 'SPA ProSupp Server (MTP)', 'SSO Quality Lets Fix It',
  'Storage Echannel CCC', 'Storage ProSupport ANZ', 'Storage ProSupport CCC',
  'Storage ProSupport SA', 'Storage PS MD US', 'Storage ROLA', 'Support Ops ROLA',
  'SWE Client ProSupp (TUR)', 'UKI Networking (CWD)', 'UKI Storage', 'UKISA Basic Enterprise (BGL)',
  'US Federal Support Storage',
]

export function inferRegion(name) {
  if (/^APJ|^HCS APJ|^HCS LATAM|^Korea|^KOR|^ANZ|^MMCLA|^CCC|^Japan|^JP |^BRZ|^Brazil|CTE.*JPN|CTE.*KOR|CTE.*CCC/.test(name)) return 'APJ'
  if (/^LATAM|^ROLA|Portuguese$|Spanish$|Panama/.test(name)) return 'LATAM'
  if (/^EMEA|^ENG |^GER |^German|^FRA |^French|^ITA |^Italian|^SPA |^EC |^CER|^CZE|^ROE|^SWE|Nordics|^UKI|^UKI/.test(name)) return 'EMEA'
  if (/^AMER|^NA |^NAMER|^US |Federal|Modular US|Enterprise.*US|Powerstore US/.test(name)) return 'NAMER'
  return 'Global'
}

// ── Queue fact table ─────────────────────────────────────────────────────────
// Single source of truth for everything queue-level. Every categorical filter
// (Capacity Code, Channel, Business Partner, Region, Sub-region, L5 Manager,
// DB/OSP, Queue Name) narrows this list; cards and CQN-variance charts are
// then recomputed from whatever rows remain.
export const ACTIVE_QUEUES = ACTIVE_QUEUE_NAMES.map((name, i) => {
  const offered = 20000 + i * 320
  // Spans a symmetric ±8% of offered (not capped at 100%) so a healthy minority of
  // queues genuinely run ahead of plan — backlog catch-up, cross-trained overflow
  // handling, etc. — with a magnitude matching the "behind" side, so a top-N-by-|variance|
  // ranking isn't structurally guaranteed to be one-sided.
  const handled = Math.round(offered * (0.92 + (i % 17) * 0.01))
  const plan2   = Math.round(offered * (0.93 + (i % 9) * 0.012))
  return {
    name,
    region: inferRegion(name),
    subRegion: SUB_REGIONS[i % SUB_REGIONS.length],
    capacityCode: CAPACITY_CODES[i % CAPACITY_CODES.length],
    businessPartner: BUSINESS_PARTNERS[i % BUSINESS_PARTNERS.length],
    l5Manager: L5_MANAGERS[i % L5_MANAGERS.length],
    channel: CHANNELS[i % CHANNELS.length],
    dbOsp: i % 3 === 0 ? 'OSP' : 'DB',
    offered,
    handled,
    accuracy: 75 + (i * 7) % 25,
    plan1: offered,
    plan2,
    get planVariance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
    get adherence() { return +((this.handled / this.offered) * 100).toFixed(1) },
  }
})

// Every filter except DB/OSP is multi-select: its value is an array of chosen options,
// or [] meaning "no selection = everything". DB/OSP stays a single string ('DB'|'OSP'|'All')
// since it's a 3-way segmented pill, not a searchable dropdown.
const QUEUE_FILTER_KEYS = ['cqn', 'capacityCode', 'channel', 'businessPartner', 'region', 'subRegion', 'l5Manager']
const QUEUE_FIELD_BY_KEY = { cqn: 'name', capacityCode: 'capacityCode', channel: 'channel', businessPartner: 'businessPartner', region: 'region', subRegion: 'subRegion', l5Manager: 'l5Manager' }

export function filterQueues(filters = {}) {
  return ACTIVE_QUEUES.filter(q => {
    const multiOk = QUEUE_FILTER_KEYS.every(key => {
      const v = filters[key]
      return !v || v.length === 0 || v.includes(q[QUEUE_FIELD_BY_KEY[key]])
    })
    const dbOsp = filters.dbOsp
    return multiOk && (!dbOsp || dbOsp === 'All' || q.dbOsp === dbOsp)
  })
}

// Fiscal Quarter/Week values carry their fiscal year as a prefix (e.g. 'FY26Q2', 'FY26W14').
// The most specific time filter selected (Week > Quarter > Year) determines which fiscal
// year(s) the FY-level charts show — spanning multiple years if the selection does.
export function effectiveFiscalYears(filters = {}) {
  const picked = (filters.fiscalWeek?.length && filters.fiscalWeek)
    || (filters.fiscalQuarter?.length && filters.fiscalQuarter)
    || (filters.fiscalYear?.length && filters.fiscalYear)
  if (!picked) return FISCAL_YEARS
  return FISCAL_YEARS.filter(fy => picked.some(v => v.slice(0, 4) === fy))
}

// A multi-select filter with no selection ([] or undefined) matches everything.
// Exported since other pages' data modules (e.g. hesData.js) reuse this same rule.
export function matchesMulti(selected, value) {
  return !selected || selected.length === 0 || selected.includes(value)
}

// ── Cards ────────────────────────────────────────────────────────────────────
const BASE_CALL_VOLUME = { offered: 285400, handled: 268700 }

export function cardData(filters = {}) {
  // Queue portfolio health (count, accuracy, variance) reflects who's in scope —
  // Queue Name, Region, Capacity Code, etc. — but not DB/OSP: a queue's accuracy
  // doesn't change depending on which slice of its call volume you're looking at.
  const structuralRows = filterQueues({ ...filters, dbOsp: 'All' })
  const total = ACTIVE_QUEUES.length
  const activeCount = structuralRows.length
  const avgAccuracy = activeCount ? +(structuralRows.reduce((s, q) => s + q.accuracy, 0) / activeCount).toFixed(1) : 0
  // "Within variance" band is deliberately tight (accuracy >= 89) so the headline
  // sits in the ~40-50% range that reflects how strict the ±10% target actually is.
  const withinRange = structuralRows.filter(q => q.accuracy >= 89).length

  // Call volume, by contrast, is exactly what DB/OSP is meant to scope.
  const volumeRows = filterQueues(filters)
  const ratio = total ? volumeRows.length / total : 0
  const dbCount = volumeRows.filter(q => q.dbOsp === 'DB').length
  // With zero rows in scope there's no split to report — 0/0, not a misleading 0/100.
  const dbPct = volumeRows.length ? Math.round((dbCount / volumeRows.length) * 100) : 0
  const ospPct = volumeRows.length ? 100 - dbPct : 0
  const offered = Math.round(BASE_CALL_VOLUME.offered * ratio)
  const handled = Math.round(BASE_CALL_VOLUME.handled * ratio)

  return {
    totalQueues: { active: activeCount, inactive: INACTIVE_QUEUE_NAMES.length },
    callVolume: { offered, handled, handlePct: offered ? +((handled / offered) * 100).toFixed(1) : 0 },
    dbOspSplit: { db: dbPct, osp: ospPct, dbVol: Math.round(offered * dbPct / 100), ospVol: Math.round(offered * ospPct / 100) },
    forecastAccuracy: { value: avgAccuracy, target: 90 },
    cqnVariance: { withinRange, total: activeCount, pct: activeCount ? +((withinRange / activeCount) * 100).toFixed(1) : 0 },
  }
}

// Offered/handled baseline split by fiscal year — sums to BASE_CALL_VOLUME's totals.
const BASE_CALL_VOLUME_BY_FY = {
  FY25: { offered: 82000,  handled: 77500 },
  FY26: { offered: 96000,  handled: 90200 },
  FY27: { offered: 107400, handled: 101000 },
}

// Drives the Call Volume card drill-down: Offered vs Handled, by Fiscal Year.
export function callVolumeByFY(filters = {}) {
  const rows = filterQueues(filters)
  const ratio = ACTIVE_QUEUES.length ? rows.length / ACTIVE_QUEUES.length : 0
  const years = effectiveFiscalYears(filters)
  return years.map(year => ({
    period: year,
    offered: Math.round(BASE_CALL_VOLUME_BY_FY[year].offered * ratio),
    handled: Math.round(BASE_CALL_VOLUME_BY_FY[year].handled * ratio),
  }))
}

// Drives the DB/OSP Split card drill-down: DB vs OSP offered volume, by Fiscal Year.
// Deliberately ignores the DB/OSP filter itself (unlike callVolumeByFY) — collapsing to
// one bar when the ambient filter is "DB" would defeat the point of a split chart. Every
// other filter (region, queue, etc.) still narrows the candidate queues.
export function dbOspVolumeByFY(filters = {}) {
  const rows = filterQueues({ ...filters, dbOsp: 'All' })
  const total = ACTIVE_QUEUES.length
  const ratio = total ? rows.length / total : 0
  const dbShare = rows.length ? rows.filter(q => q.dbOsp === 'DB').length / rows.length : 0
  const years = effectiveFiscalYears(filters)
  return years.map(year => {
    const totalOffered = Math.round(BASE_CALL_VOLUME_BY_FY[year].offered * ratio)
    return {
      period: year,
      db: Math.round(totalOffered * dbShare),
      osp: Math.round(totalOffered * (1 - dbShare)),
    }
  })
}

// ── Forecast Accuracy by Region ───────────────────────────────────────────────
const REGION_FORECAST_BASE = { APJ: 58000, EMEA: 78000, Global: 50000, LATAM: 33000, NAMER: 95000 }
const REGION_ACCURACY = { APJ: 85, EMEA: 79, Global: 82, LATAM: 68, NAMER: 91 }

export const FORECAST_ACCURACY_BY_REGION = REGIONS.map(region => {
  const forecast = REGION_FORECAST_BASE[region]
  const accuracy = REGION_ACCURACY[region]
  return { region, forecast, actual: Math.round(forecast * accuracy / 100), accuracy }
})

export function forecastAccuracyByRegion(filters = {}) {
  return FORECAST_ACCURACY_BY_REGION.filter(d => matchesMulti(filters.region, d.region))
}

// ── CQN Forecast Variance ─────────────────────────────────────────────────────
// Year-on-year % of queues landing within the ±10% variance band. Curated to sit in the
// 40-50% range (vs. the ~44% the live queue-accuracy threshold produces at "All" filters) —
// illustrative until fiscal-year-tagged variance data exists per queue.
export const CQN_VARIANCE_BY_FY = [
  { fy: 'FY25', pct: 44 },
  { fy: 'FY26', pct: 48 },
  { fy: 'FY27', pct: 41 },
]

// Clicking a year's column surfaces a handful of real queues (from the current filter
// scope) whose plan-vs-plan variance genuinely falls within ±10% — a representative
// sample, not the full list, until per-queue-per-year variance data is available.
export function cqnVarianceQueuesByFY(filters, fy, count = 5) {
  const rows = filterQueues({ ...filters, dbOsp: 'All' }).filter(q => Math.abs(q.planVariance) <= 10)
  if (!rows.length) return []
  const yearIndex = FISCAL_YEARS.indexOf(fy)
  const offset = (yearIndex >= 0 ? yearIndex : 0) * count
  return Array.from({ length: Math.min(count, rows.length) }, (_, i) =>
    rows[(offset + i) % rows.length]
  ).map(q => ({ name: q.name, variance: q.planVariance }))
}

// ── Plan over Plan (Layer 1) ─────────────────────────────────────────────────
const BASE_PLAN = { FY25: 240000, FY26: 268000, FY27: 295000 }

export const PLAN_VS_PLAN_BY_FY = FISCAL_YEARS.map(fy => ({
  period: fy,
  plan1: BASE_PLAN[fy],
  plan2: Math.round(BASE_PLAN[fy] * (0.93 + Math.random() * 0.1)),
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

// Order matches REGIONS: APJ, EMEA, Global, LATAM, NAMER
export const PLAN_VS_PLAN_BY_REGION = REGIONS.map((r, i) => ({
  region: r,
  plan1: [62000, 78000, 50000, 33000, 95000][i],
  plan2: [58000, 81000, 48000, 31000, 89000][i],
  get variance() { return +((this.plan2 - this.plan1) / this.plan1 * 100).toFixed(1) },
}))

export function planOverPlanByFY(filters = {}) {
  const years = effectiveFiscalYears(filters)
  return PLAN_VS_PLAN_BY_FY.filter(d => years.includes(d.period))
}

export function planOverPlanByRegion(filters = {}) {
  return PLAN_VS_PLAN_BY_REGION.filter(d => matchesMulti(filters.region, d.region))
}

// "CQN Highest Variance": with no queues selected, surfaces the 5 queues with the
// biggest |Plan A vs Plan B| swing out of whatever the other filters leave in scope;
// with specific queues selected, shows exactly those. Like the KPI cards, this is
// queue-portfolio scoping — DB/OSP is excluded so it can't silently empty out a queue
// that simply doesn't route that kind of volume.
export function cqnPlanVariance(filters = {}, topN = 5) {
  const rows = filterQueues({ ...filters, dbOsp: 'All' }).map(q => ({ cqn: q.name, plan1: q.plan1, plan2: q.plan2, variance: q.planVariance }))
  const hasQueue = filters.cqn?.length > 0
  return hasQueue ? rows : [...rows].sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance)).slice(0, topN)
}

// ── Actual vs Plan (Layer 2) ─────────────────────────────────────────────────
export const ACTUAL_VS_PLAN_BY_FY = FISCAL_YEARS.map(fy => ({
  period: fy,
  actual: BASE_PLAN[fy] * (0.88 + Math.random() * 0.08),
  plan:   BASE_PLAN[fy],
  get adherence() { return +((this.actual / this.plan) * 100).toFixed(1) },
})).map(d => ({ ...d, actual: Math.round(d.actual) }))

// Stacked bar: % of the queue population by forecast variance magnitude, per FY.
// Bucketed by |variance|, not accuracy tier — under10 is best (tightest to plan).
export const STACKED_ADHERENCE = [
  { fy: 'FY25', under10: 38, between10and20: 34, between20and30: 16, above30: 12 },
  { fy: 'FY26', under10: 30, between10and20: 33, between20and30: 22, above30: 15 },
  { fy: 'FY27', under10: 42, between10and20: 30, between20and30: 18, above30: 10 },
]

export function actualVsPlanByFY(filters = {}) {
  const years = effectiveFiscalYears(filters)
  return ACTUAL_VS_PLAN_BY_FY.filter(d => years.includes(d.period))
}

export function stackedAdherenceByFY(filters = {}) {
  const years = effectiveFiscalYears(filters)
  return STACKED_ADHERENCE.filter(d => years.includes(d.fy))
}

// "CQN Highest Variance": biggest |actual vs plan| gap first (same ranking logic as
// cqnPlanVariance) — a mix of ahead-of-plan and behind-plan outliers, not just the worst.
export function cqnActualVariance(filters = {}, topN = 5) {
  const rows = filterQueues({ ...filters, dbOsp: 'All' }).map(q => ({
    cqn: q.name, actual: q.handled, plan: q.offered,
    variance: +((q.handled - q.offered) / q.offered * 100).toFixed(1),
  }))
  const hasQueue = filters.cqn?.length > 0
  return hasQueue ? rows : [...rows].sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance)).slice(0, topN)
}

// ── Geo Map (Layer 3) ─────────────────────────────────────────────────────────
// Choropleth, not circle markers: every country on the map gets filled by the
// accuracy of the region or sub-region it belongs to. The country→region and
// country→sub-region groupings below are an illustrative continental/business
// split for a mock dashboard — not authoritative geography or real org data.
export const GEO_REGION_DATA = [
  { region: 'NAMER', accuracy: 91, label: 'NAMER' },
  { region: 'EMEA',  accuracy: 79, label: 'EMEA' },
  { region: 'APJ',   accuracy: 85, label: 'APJ' },
  { region: 'LATAM', accuracy: 68, label: 'LATAM' },
]

export function geoRegionData(filters = {}) {
  return GEO_REGION_DATA.filter(d => matchesMulti(filters.region, d.region))
}

// Country names below match the exact strings used by the world-atlas topojson
// (countries-110m.json) that Layer3GeoMap renders.
const NAMER_COUNTRIES = ['United States of America', 'Canada', 'Mexico', 'Greenland']
const LATAM_COUNTRIES = [
  'Belize', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama',
  'Cuba', 'Jamaica', 'Haiti', 'Dominican Rep.', 'Bahamas', 'Trinidad and Tobago', 'Puerto Rico',
  'Colombia', 'Venezuela', 'Guyana', 'Suriname', 'Ecuador', 'Peru', 'Brazil', 'Bolivia',
  'Paraguay', 'Chile', 'Argentina', 'Uruguay', 'Falkland Is.',
]
const APJ_COUNTRIES = [
  'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Afghanistan',
  'Pakistan', 'India', 'Nepal', 'Bhutan', 'Bangladesh', 'Sri Lanka', 'Myanmar', 'Thailand',
  'Laos', 'Cambodia', 'Vietnam', 'Malaysia', 'Indonesia', 'Brunei', 'Philippines', 'Timor-Leste',
  'Papua New Guinea', 'Solomon Is.', 'Vanuatu', 'New Caledonia', 'Fiji', 'China', 'Mongolia',
  'North Korea', 'South Korea', 'Japan', 'Taiwan', 'Australia', 'New Zealand',
]
const UNMAPPED_GEOGRAPHIES = ['Antarctica', 'Fr. S. Antarctic Lands']

// Everything else on the map (Europe, the Middle East, Africa) is EMEA by elimination.
export function regionForCountry(name) {
  if (UNMAPPED_GEOGRAPHIES.includes(name)) return null
  if (NAMER_COUNTRIES.includes(name)) return 'NAMER'
  if (LATAM_COUNTRIES.includes(name)) return 'LATAM'
  if (APJ_COUNTRIES.includes(name)) return 'APJ'
  return 'EMEA'
}

export const SUB_REGION_ACCURACY = {
  Australia: 88, Brazil: 71, CER: 76, China: 79, 'Costa Rica': 82, EC: 69, Egypt: 74,
  EMEA: 79, France: 80, Germany: 78, Global: 83, India: 75, Israel: 85, Japan: 90,
  Korea: 87, 'Multiple SubRegions': 77, Nordics: 92, Panama: 73, ROLA: 66, SER: 81,
  'South Asia': 70, UKI: 84, 'United Kingdom': 85, 'United States': 93,
}

// Sub-regions that are literally one country each get a direct 1:1 mapping.
const SUB_REGION_LITERAL_COUNTRY = {
  Australia: 'Australia', Brazil: 'Brazil', China: 'China', 'Costa Rica': 'Costa Rica',
  Egypt: 'Egypt', France: 'France', Germany: 'Germany', India: 'India', Israel: 'Israel',
  Japan: 'Japan', Korea: 'South Korea', Panama: 'Panama', 'United Kingdom': 'United Kingdom',
  'United States': 'United States of America',
}

// Everything else is a named grouping of countries — CER/SER/Nordics/ROLA/UKI/EC are all
// real WFM regional shorthand; the country lists here are illustrative, not authoritative.
// "Global" and "Multiple SubRegions" have no map presence (they're not places) — they
// still appear in the summary table below the map.
const SUB_REGION_GROUPS = {
  CER: ['Poland', 'Czechia', 'Slovakia', 'Hungary', 'Austria', 'Slovenia'],
  EC: ['Jamaica', 'Trinidad and Tobago', 'Bahamas', 'Puerto Rico'],
  EMEA: ['Netherlands', 'Belgium', 'Switzerland'],
  Nordics: ['Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland'],
  ROLA: ['Argentina', 'Chile', 'Colombia', 'Peru', 'Ecuador', 'Venezuela', 'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname'],
  SER: ['Italy', 'Spain', 'Portugal', 'Greece'],
  'South Asia': ['Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan'],
  UKI: ['Ireland'], // 'United Kingdom' itself is its own literal sub-region above
}

const COUNTRY_TO_SUB_REGION = {}
for (const [subRegion, country] of Object.entries(SUB_REGION_LITERAL_COUNTRY)) {
  COUNTRY_TO_SUB_REGION[country] = subRegion
}
for (const [subRegion, countries] of Object.entries(SUB_REGION_GROUPS)) {
  for (const country of countries) {
    if (!COUNTRY_TO_SUB_REGION[country]) COUNTRY_TO_SUB_REGION[country] = subRegion
  }
}

export function subRegionForCountry(name) {
  return COUNTRY_TO_SUB_REGION[name] || null
}

// Which sub-region keys should be highlighted, given the current filters —
// null means "show all mappable sub-regions" (no filter narrowing them down).
export function activeSubRegionKeys(filters = {}) {
  if (filters.subRegion?.length) return filters.subRegion
  if (filters.region?.length) {
    return Object.keys(SUB_REGION_ACCURACY).filter(key => {
      const country = SUB_REGION_LITERAL_COUNTRY[key] || SUB_REGION_GROUPS[key]?.[0]
      return country && filters.region.includes(regionForCountry(country))
    })
  }
  return null
}

// Sub-region rows for the summary table under the map — same shape as geoRegionData's
// rows so the table renderer doesn't need to branch on view mode.
export function geoSubRegionRows(filters = {}) {
  const active = activeSubRegionKeys(filters)
  return Object.keys(SUB_REGION_ACCURACY)
    .filter(key => !active || active.includes(key))
    .map(key => ({ region: key, label: key, accuracy: SUB_REGION_ACCURACY[key] }))
}
