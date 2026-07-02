import React, { useState } from 'react'
import HesFilterPanel from '../hes/HesFilterPanel'
import HesCapacityMetricCards from './HesCapacityMetricCards'
import HeadcountAttritionLayer from './HeadcountAttritionLayer'
import PlanOverPlanLayer from '../capacity/PlanOverPlanLayer'
import WorkloadDistributionLayer from './WorkloadDistributionLayer'
import HesCapacityGeoMap from './HesCapacityGeoMap'
import SectionDivider from '../SectionDivider'
import { planOverPlanFteByFY } from '../../data/hesCapacityData'

// Same filter field set as HES Forecasting (LOB / FY-Qtr-Month-Week / Business
// Partner / Global Grouping) — HesFilterPanel is reused directly rather than
// duplicated, since it's a stateless controlled component with no page-specific
// hardcoding.
const DEFAULT_FILTERS = {
  lob: [],
  fiscalYear: [],
  fiscalQuarter: [],
  fiscalMonth: [],
  fiscalWeek: [],
  businessPartner: [],
  globalGrouping: [],
}

export default function HesCapacityPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [granularity, setGranularity] = useState(null)

  return (
    <>
      <HesFilterPanel filters={filters} onChange={setFilters} granularity={granularity} onGranularityChange={setGranularity} />

      <SectionDivider label="Key Metrics" />
      <HesCapacityMetricCards filters={filters} granularity={granularity} />

      <SectionDivider label="Analysis Layers" />
      <div className="px-4 pb-4 flex flex-col gap-3">
        <HeadcountAttritionLayer filters={filters} granularity={granularity} />
        <PlanOverPlanLayer filters={filters} granularity={granularity} dataFn={planOverPlanFteByFY} />
        <WorkloadDistributionLayer filters={filters} granularity={granularity} />
        <HesCapacityGeoMap filters={filters} />
      </div>
    </>
  )
}
