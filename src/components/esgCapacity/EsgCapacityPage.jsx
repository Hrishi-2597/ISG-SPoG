import React, { useState } from 'react'
import EsgCapacityFilterPanel from './EsgCapacityFilterPanel'
import EsgCapacityMetricCards from './EsgCapacityMetricCards'
import HeadcountLayer from './HeadcountLayer'
import PlanOverPlanVariationLayer from './PlanOverPlanVariationLayer'
import UtilizationLayer from './UtilizationLayer'
import EsgCapacityGeoMap from './EsgCapacityGeoMap'
import SectionDivider from '../SectionDivider'

const DEFAULT_FILTERS = {
  combinedQueueName: [],
  capacityCode: [],
  planName: [],
  fiscalYear: [],
  fiscalQuarter: [],
  fiscalWeek: [],
  channel: [],
  businessPartner: [],
  region: [],
  subRegion: [],
  dbOsp: 'DB',
}

export default function EsgCapacityPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [granularity, setGranularity] = useState(null)

  return (
    <>
      <EsgCapacityFilterPanel filters={filters} onChange={setFilters} granularity={granularity} onGranularityChange={setGranularity} />

      <SectionDivider label="Key Metrics" />
      <EsgCapacityMetricCards filters={filters} granularity={granularity} />

      <SectionDivider label="Analysis Layers" />
      <div className="px-4 pb-4 flex flex-col gap-3">
        <HeadcountLayer filters={filters} granularity={granularity} />
        <PlanOverPlanVariationLayer filters={filters} granularity={granularity} />
        <UtilizationLayer filters={filters} granularity={granularity} />
        <EsgCapacityGeoMap filters={filters} />
      </div>
    </>
  )
}
