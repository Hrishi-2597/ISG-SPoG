import React from 'react'
import {
  CQN_LIST, PLAN_NAMES, FISCAL_YEARS, FISCAL_QUARTERS,
  FISCAL_WEEKS, CHANNELS, REGIONS, BUSINESS_PARTNERS,
} from '../data/mockData'

const COUNTRIES_FLAT = ['All','USA','Canada','Mexico','Brazil','UK','Germany','France','Netherlands','India','Japan','Australia','Singapore','China','Argentina','Chile','Colombia']

function Select({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <label className="text-[10px] font-semibold text-blue-200 uppercase tracking-wide truncate px-1">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white text-gray-800 text-xs font-medium rounded px-2 py-1.5 border-0 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function FilterPanel({ filters, onChange }) {
  const set = key => val => onChange({ ...filters, [key]: val })

  const filterDefs = [
    { key: 'cqn',            label: 'Combined Queue Name', options: ['All', ...CQN_LIST] },
    { key: 'capacityCode',   label: 'Capacity Code',       options: ['All', 'Internal', 'External', 'Hybrid'] },
    { key: 'planName',       label: 'Plan Name',           options: ['All', ...PLAN_NAMES] },
    { key: 'fiscalYear',     label: 'Fiscal Year',         options: ['All', ...FISCAL_YEARS] },
    { key: 'fiscalQuarter',  label: 'Fiscal Quarter',      options: ['All', ...FISCAL_QUARTERS] },
    { key: 'fiscalWeek',     label: 'Fiscal Week',         options: ['All', ...FISCAL_WEEKS] },
    { key: 'channel',        label: 'Channel',             options: ['All', ...CHANNELS] },
    { key: 'businessPartner',label: 'Business Partner',    options: ['All', ...BUSINESS_PARTNERS] },
    { key: 'region',         label: 'Region',              options: ['All', ...REGIONS] },
    { key: 'country',        label: 'Country',             options: COUNTRIES_FLAT },
    { key: 'businessOrg',   label: 'Business Org',         options: ['ISG ESG', 'ISG CSG', 'ISG PSG', 'All'] },
    { key: 'dbOsp',         label: 'DB/OSP',               options: ['All', 'DB', 'OSP'] },
  ]

  return (
    <div className="bg-navy-700 border-b border-navy-600 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center bg-navy-800 rounded px-2 py-1 mt-5 shrink-0">
          <span className="text-xs font-bold text-blue-300 tracking-widest">Filters</span>
        </div>
        <div className="flex-1 grid grid-cols-6 gap-2">
          {filterDefs.slice(0, 6).map(f => (
            <Select key={f.key} label={f.label} value={filters[f.key]} options={f.options} onChange={set(f.key)} />
          ))}
          {filterDefs.slice(6).map(f => (
            <Select key={f.key} label={f.label} value={filters[f.key]} options={f.options} onChange={set(f.key)} />
          ))}
        </div>
      </div>
    </div>
  )
}
