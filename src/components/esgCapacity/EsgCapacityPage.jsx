import React, { useState } from 'react'
import EsgCapacityFilterPanel from './EsgCapacityFilterPanel'
import EsgCapacityMetricCards from './EsgCapacityMetricCards'
import HeadcountLayer from './HeadcountLayer'
import PlanOverPlanLayer from '../capacity/PlanOverPlanLayer'
import UtilizationLayer from './UtilizationLayer'
import EsgCapacityGeoMap from './EsgCapacityGeoMap'
import SectionDivider from '../SectionDivider'
import { planOverPlanHCByFY } from '../../data/esgCapacityData'

// planName/businessOrg default to a real pre-selected value ('Actual'/'ISG ESG'),
// not "All" like the rest — see EsgCapacityFilterPanel.jsx's defs.defaultValue.
const DEFAULT_FILTERS = {
  combinedQueueName: [],
  capacityCode: [],
  planName: ['Actual'],
  fiscalYear: [],
  fiscalQuarter: [],
  fiscalWeek: [],
  channel: [],
  businessPartner: [],
  businessOrg: ['ISG ESG'],
  region: [],
  country: [],
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
        <PlanOverPlanLayer filters={filters} granularity={granularity} dataFn={planOverPlanHCByFY} />
        <UtilizationLayer filters={filters} granularity={granularity} />
        <EsgCapacityGeoMap filters={filters} />
      </div>
    </>
  )
}
