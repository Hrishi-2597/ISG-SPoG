import React from 'react'
import {
  ACTIVE_QUEUE_NAMES, CAPACITY_CODES, CAPACITY_PLAN_NAMES, FISCAL_YEARS, FISCAL_QUARTERS,
  FISCAL_WEEK_LIST, CHANNELS, REGIONS, COUNTRIES, BUSINESS_PARTNERS, BUSINESS_ORGS,
} from '../../data/mockData'
import MultiSelectField from '../MultiSelectField'
import GranularityToggle from '../GranularityToggle'

const ICONS = {
  scope: <path d="M2 3.5h10M2 7h10M2 10.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />,
  time: <><circle cx="7" cy="7" r="5.3" stroke="currentColor" strokeWidth="1.3" /><path d="M7 4.2V7l2.1 1.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></>,
  people: <><circle cx="7" cy="4.8" r="2.3" stroke="currentColor" strokeWidth="1.3" /><path d="M2.3 11.5c0-2.4 2.1-4 4.7-4s4.7 1.6 4.7 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></>,
  geo: <><circle cx="7" cy="7" r="5.3" stroke="currentColor" strokeWidth="1.3" /><path d="M1.7 7h10.6M7 1.7c1.6 1.4 2.5 3.4 2.5 5.3s-.9 3.9-2.5 5.3c-1.6-1.4-2.5-3.4-2.5-5.3S5.4 3.1 7 1.7Z" stroke="currentColor" strokeWidth="1.1" /></>,
}

function ClusterIcon({ name }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
      {ICONS[name]}
    </svg>
  )
}

function Cluster({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flex: '1 1 0' }}>
      <div style={{ paddingBottom: 6 }}><ClusterIcon name={icon} /></div>
      <div className="grid grid-cols-3 gap-x-3 flex-1 min-w-0">{children}</div>
    </div>
  )
}

function ClusterDivider() {
  return <div style={{ width: 1, alignSelf: 'stretch', background: 'linear-gradient(180deg, transparent, rgba(56,189,248,0.18) 30%, rgba(56,189,248,0.18) 70%, transparent)', margin: '0 14px' }} />
}

// Mirrors FilterPanel.jsx's cluster layout exactly (Scope/Time/People/Geography +
// DB/OSP pill), swapping in this page's own field set: Combined Queue Name instead
// of Queue Name, Country + Business Org instead of Sub-region + L5 Manager. The
// GranularityToggle sits at the end of the first row, same placement convention as
// both Forecasting filter bars.
export default function EsgCapacityFilterPanel({ filters, onChange, granularity, onGranularityChange }) {
  const set = key => val => onChange({ ...filters, [key]: val })

  // planName/businessOrg default to a pre-selected value ('Actual'/'ISG ESG'), not
  // "All" like every other filter here — defaultValue lets the chip strip and Clear
  // All tell "still at default" apart from "user actually changed this."
  const defs = {
    combinedQueueName: { label: 'Combined Queue Name', options: ACTIVE_QUEUE_NAMES, mono: true, defaultValue: [] },
    capacityCode:      { label: 'Capacity Code',       options: CAPACITY_CODES, mono: true, defaultValue: [] },
    planName:          { label: 'Plan Name',           options: CAPACITY_PLAN_NAMES, defaultValue: ['Actual'] },
    fiscalYear:        { label: 'Fiscal Year',         options: FISCAL_YEARS, defaultValue: [] },
    fiscalQuarter:     { label: 'Fiscal Quarter',      options: FISCAL_QUARTERS, defaultValue: [] },
    fiscalWeek:        { label: 'Fiscal Week',         options: FISCAL_WEEK_LIST, defaultValue: [] },
    channel:           { label: 'Channel',             options: CHANNELS, defaultValue: [] },
    businessPartner:   { label: 'Business Partner',    options: BUSINESS_PARTNERS, defaultValue: [] },
    businessOrg:       { label: 'Business Org',        options: BUSINESS_ORGS, defaultValue: ['ISG ESG'] },
    region:            { label: 'Region',              options: REGIONS, defaultValue: [] },
    country:           { label: 'Country',             options: COUNTRIES, defaultValue: [] },
  }

  const field = key => (
    <MultiSelectField key={key} label={defs[key].label} options={defs[key].options}
      value={filters[key]} mono={defs[key].mono} onChange={set(key)} />
  )

  const isAtDefault = k => JSON.stringify(filters[k] ?? []) === JSON.stringify(defs[k].defaultValue)
  const activeFilters = Object.keys(defs).filter(k => !isAtDefault(k))
  const clearAll = () => onChange({
    ...Object.fromEntries(Object.keys(defs).map(k => [k, defs[k].defaultValue])),
    dbOsp: 'DB',
  })

  return (
    <div style={{
      background: 'linear-gradient(180deg, var(--bg-panel) 0%, var(--bg-inset) 100%)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '11px 18px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 10 }}>
        <Cluster icon="scope">{field('combinedQueueName')}{field('capacityCode')}{field('planName')}</Cluster>
        <ClusterDivider />
        <Cluster icon="time">{field('fiscalYear')}{field('fiscalQuarter')}{field('fiscalWeek')}</Cluster>
        <ClusterDivider />
        <GranularityToggle value={granularity} onChange={onGranularityChange} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <Cluster icon="people">{field('channel')}{field('businessPartner')}{field('businessOrg')}</Cluster>
        <ClusterDivider />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flex: '1 1 0' }}>
          <div style={{ paddingBottom: 6 }}><ClusterIcon name="geo" /></div>
          <div className="grid grid-cols-3 gap-x-3 flex-1 min-w-0">
            {field('region')}
            {field('country')}
            <div className="flex flex-col gap-1 min-w-0">
              <label style={{ fontSize: 8.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em', paddingLeft: 1 }}>
                DB / OSP
              </label>
              <div className="drill-toggle" style={{ width: 'fit-content' }}>
                {['DB', 'OSP', 'All'].map(o => (
                  <button key={o} onClick={() => set('dbOsp')(o)} className={`drill-btn${filters.dbOsp === o ? ' active' : ''}`}>{o}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {(activeFilters.length > 0 || filters.dbOsp !== 'DB') && (
        <div className="animate-fade-in" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 11, paddingTop: 9, borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: 8.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 2 }}>
            Scoped by
          </span>
          {activeFilters.map(k => (
            <span key={k} className="filter-chip">
              <span style={{ color: 'var(--text-faint)' }}>{defs[k].label}:</span>{' '}
              {filters[k].length === 1 ? filters[k][0] : `${filters[k].length} selected`}
              <button onClick={() => set(k)([])} aria-label={`Clear ${defs[k].label}`}>×</button>
            </span>
          ))}
          {filters.dbOsp !== 'DB' && (
            <span className="filter-chip">
              <span style={{ color: 'var(--text-faint)' }}>DB / OSP:</span> {filters.dbOsp}
              <button onClick={() => set('dbOsp')('DB')} aria-label="Reset DB / OSP">×</button>
            </span>
          )}
          <button onClick={clearAll} style={{
            fontSize: 10, color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer',
            marginLeft: 4, textDecoration: 'underline', textDecorationColor: 'rgba(127,168,204,0.3)',
          }}>
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
