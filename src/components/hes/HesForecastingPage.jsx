import React, { useState } from 'react'
import HesFilterPanel from './HesFilterPanel'
import HesMetricCards from './HesMetricCards'
import AsuLayer from './AsuLayer'
import SrLayer from './SrLayer'
import AsuSrTrendLayer from './AsuSrTrendLayer'
import HesGeoMap from './HesGeoMap'
import HesRcaClcaPanel from './HesRcaClcaPanel'
import SectionDivider from '../SectionDivider'

// Every filter is multi-select: [] means "no selection = All" — same convention as
// the Forecasting page's filters.
const DEFAULT_FILTERS = {
  lob: [],
  fiscalYear: [],
  fiscalQuarter: [],
  fiscalMonth: [],
  fiscalWeek: [],
  businessPartner: [],
  globalGrouping: [],
}

export default function HesForecastingPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  // Page-wide "view by" granularity — Quarter/Month/Week — separate from the value
  // filters above: it changes what axis every time-series chart renders at, not
  // which rows are in scope. See design_choice.md for why it isn't one of the
  // MultiSelectField filters.
  const [granularity, setGranularity] = useState('Quarter')

  return (
    <>
      <HesFilterPanel filters={filters} onChange={setFilters} granularity={granularity} onGranularityChange={setGranularity} />

      <SectionDivider label="Key Metrics" />
      <HesMetricCards filters={filters} granularity={granularity} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingRight: 16 }}>
        <div className="flex-1 min-w-0">
          <SectionDivider label="Analysis Layers" />
          <div className="px-4 pb-4 flex flex-col gap-3">
            <AsuLayer filters={filters} granularity={granularity} />
            <SrLayer filters={filters} granularity={granularity} />
            <AsuSrTrendLayer filters={filters} granularity={granularity} />
            <HesGeoMap filters={filters} />
          </div>
        </div>

        <div style={{ width: 300, flexShrink: 0, position: 'sticky', top: 14, marginTop: 14 }}>
          <HesRcaClcaPanel />
        </div>
      </div>
    </>
  )
}
