import React from 'react'
import {
  CQN_LIST, PLAN_NAMES, FISCAL_YEARS, FISCAL_QUARTERS,
  FISCAL_WEEKS, CHANNELS, REGIONS, BUSINESS_PARTNERS,
} from '../data/mockData'

const COUNTRIES_FLAT = ['All','USA','Canada','Mexico','Brazil','UK','Germany','France','Netherlands','India','Japan','Australia','Singapore','China','Argentina','Chile','Colombia']

function Select({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label style={{ fontSize: 9, fontWeight: 600, color: '#3d607a', textTransform: 'uppercase', letterSpacing: '0.08em', paddingLeft: 2 }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="select-dark"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function FilterPanel({ filters, onChange }) {
  const set = key => val => onChange({ ...filters, [key]: val })

  const filterDefs = [
    { key: 'cqn',            label: 'Queue Name',      options: ['All', ...CQN_LIST] },
    { key: 'capacityCode',   label: 'Capacity Code',   options: ['All', 'Internal', 'External', 'Hybrid'] },
    { key: 'planName',       label: 'Plan Name',       options: ['All', ...PLAN_NAMES] },
    { key: 'fiscalYear',     label: 'Fiscal Year',     options: ['All', ...FISCAL_YEARS] },
    { key: 'fiscalQuarter',  label: 'Fiscal Quarter',  options: ['All', ...FISCAL_QUARTERS] },
    { key: 'fiscalWeek',     label: 'Fiscal Week',     options: ['All', ...FISCAL_WEEKS] },
    { key: 'channel',        label: 'Channel',         options: ['All', ...CHANNELS] },
    { key: 'businessPartner',label: 'Partner',         options: ['All', ...BUSINESS_PARTNERS] },
    { key: 'region',         label: 'Region',          options: ['All', ...REGIONS] },
    { key: 'country',        label: 'Country',         options: COUNTRIES_FLAT },
    { key: 'businessOrg',   label: 'Business Org',     options: ['ISG ESG', 'ISG CSG', 'ISG PSG', 'All'] },
    { key: 'dbOsp',         label: 'DB / OSP',         options: ['All', 'DB', 'OSP'] },
  ]

  const activeCount = Object.entries(filters).filter(([k, v]) =>
    v !== 'All' && !(k === 'businessOrg' && v === 'ISG ESG') && !(k === 'dbOsp' && v === 'DB')
  ).length

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0c1929 0%, #0a1522 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '10px 16px 12px',
    }}>
      <div className="flex items-start gap-3">
        {/* Label */}
        <div style={{ paddingTop: 14, flexShrink: 0 }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.6 }}>
              <path d="M2 4h12M4 8h8M6 12h4" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {activeCount > 0 && (
              <span style={{
                background: '#38bdf8', color: '#070f1a', borderRadius: 8,
                fontSize: 9, fontWeight: 700, padding: '1px 5px',
              }}>{activeCount}</span>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 grid grid-cols-6 gap-x-3 gap-y-2">
          {filterDefs.map(f => (
            <Select key={f.key} label={f.label} value={filters[f.key]} options={f.options} onChange={set(f.key)} />
          ))}
        </div>
      </div>
    </div>
  )
}
