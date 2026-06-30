import React, { useState } from 'react'
import FilterPanel from './components/FilterPanel'
import MetricCards from './components/MetricCards'
import Layer1PlanOverPlan from './components/Layer1PlanOverPlan'
import Layer2ActualVsPlan from './components/Layer2ActualVsPlan'
import Layer3GeoMap from './components/Layer3GeoMap'

const DEFAULT_FILTERS = {
  cqn:            'All',
  capacityCode:   'All',
  planName:       'All',
  fiscalYear:     'All',
  fiscalQuarter:  'All',
  fiscalWeek:     'All',
  channel:        'All',
  businessPartner:'All',
  region:         'All',
  country:        'All',
  businessOrg:    'ISG ESG',
  dbOsp:          'DB',
}

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Page header */}
      <header className="bg-navy-800 border-b border-navy-600 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-xs font-black">S</div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">ISG SPoG</h1>
            <p className="text-[10px] text-blue-300">Enterprise Service Group · ESG Forecasting</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse" />
          Live · FY26 Data
        </div>
      </header>

      {/* Filters */}
      <FilterPanel filters={filters} onChange={setFilters} />

      {/* Cards */}
      <MetricCards filters={filters} />

      {/* Graph Layers */}
      <div className="px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest">Graphs</span>
          <div className="flex-1 h-px bg-navy-700" />
        </div>
        <Layer1PlanOverPlan filters={filters} />
        <Layer2ActualVsPlan filters={filters} />
        <Layer3GeoMap filters={filters} />
      </div>

      <footer className="text-center text-[9px] text-navy-600 py-3 border-t border-navy-800">
        ISG SPoG · Enterprise Service Group Forecasting Dashboard · © 2026 Aligned Automation Services
      </footer>
    </div>
  )
}
