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

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 px-4 pt-4 pb-1">
      <span className="text-[10px] font-bold tracking-[0.15em] uppercase"
        style={{ color: '#38bdf8' }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(56,189,248,0.3), transparent)' }} />
    </div>
  )
}

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  return (
    <div className="min-h-screen" style={{ background: '#070f1a', color: '#e6f1ff' }}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <header style={{
        background: 'linear-gradient(180deg, #0e1e30 0%, #0c1929 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }} className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div style={{
            width: 32, height: 32, borderRadius: 7,
            background: 'linear-gradient(135deg, #1e3f6e 0%, #38bdf8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(56,189,248,0.3)',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="9" width="3" height="5" rx="1" fill="white" opacity="0.7"/>
              <rect x="6.5" y="5" width="3" height="9" rx="1" fill="white" opacity="0.85"/>
              <rect x="11" y="2" width="3" height="12" rx="1" fill="white"/>
              <path d="M3.5 7 L8 4 L12.5 1.5" stroke="rgba(56,189,248,0.8)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: 13, fontWeight: 700, color: '#e6f1ff', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              ISG SPoG
            </h1>
            <p style={{ fontSize: 10, color: '#7fa8cc', marginTop: 1 }}>
              Enterprise Service Group · ESG Forecasting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div style={{ fontSize: 10, color: '#7fa8cc', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#34d399',
              display: 'inline-block', boxShadow: '0 0 6px #34d399',
            }} className="animate-pulse-soft" />
            Live · FY26
          </div>
          <div style={{
            fontSize: 10, fontWeight: 600, color: '#38bdf8',
            background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: 5, padding: '3px 9px',
          }}>
            ISG ESG
          </div>
        </div>
      </header>

      {/* Accent line under header */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, #38bdf8 0%, rgba(56,189,248,0.1) 40%, transparent 70%)' }} />

      {/* ── Filters ──────────────────────────────────────────────── */}
      <FilterPanel filters={filters} onChange={setFilters} />

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      <SectionDivider label="Key Metrics" />
      <MetricCards filters={filters} />

      {/* ── Graph Layers ─────────────────────────────────────────── */}
      <SectionDivider label="Analysis Layers" />
      <div className="px-4 pb-4 flex flex-col gap-3">
        <Layer1PlanOverPlan filters={filters} />
        <Layer2ActualVsPlan filters={filters} />
        <Layer3GeoMap filters={filters} />
      </div>

      <footer style={{
        textAlign: 'center', fontSize: 10, color: '#3d607a',
        padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        ISG SPoG · Enterprise Service Group · © 2026 Aligned Automation Services
      </footer>
    </div>
  )
}
