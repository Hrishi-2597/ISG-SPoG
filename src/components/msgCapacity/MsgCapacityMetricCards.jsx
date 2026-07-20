import React, { useMemo, useState } from 'react'
import {
  ComposedChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  capacityCardData, hcStaffingByFY, utilizationByFY, slTrendByFY, attritionByFY, cpfByFY,
} from '../../data/msgCapacityData'
import { C, Tip, GraphInsightButton } from '../ChartKit'
import { Modal } from '../Modal'

const CHART_BOX = { maxWidth: 620, margin: '0 auto' }

function StatusPip({ ok }) {
  return (
    <span style={{
      display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
      background: ok ? '#34d399' : '#f87171',
      boxShadow: ok ? '0 0 6px rgba(52,211,153,0.7)' : '0 0 6px rgba(248,113,113,0.7)',
      flexShrink: 0,
    }} />
  )
}

// Changed from a plain <button> to a <div role="button"> (2026-07-10) so the new
// per-card GraphInsightButton — a real nested <button> — doesn't sit inside another
// <button> element; its wrapper stops click propagation so tapping it doesn't also
// toggle the card's own drill-down.
function Card({ icon, label, value, sub, trend, onClick, active, rca, clca }) {
  return (
    <div role="button" tabIndex={0} onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      className={`card-panel flex-1 min-w-0 text-left flex flex-col${active ? ' active' : ''}`}
      style={{ cursor: 'pointer', padding: 0, minHeight: 84, position: 'relative' }}>
      {(rca || clca) && (
        <div style={{ position: 'absolute', top: 6, right: 8, zIndex: 2 }} onClick={e => e.stopPropagation()}>
          <GraphInsightButton rca={rca} clca={clca} />
        </div>
      )}
      <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14, lineHeight: 1 }}>{icon}</span>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{label}</p>
      </div>
      <div style={{ padding: '8px 12px 10px', flex: 1 }}>
        <p className="num" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</p>
        {sub && (
          <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            {trend !== undefined && <StatusPip ok={trend} />}
            {sub}
          </p>
        )}
      </div>
      {active && <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', marginTop: 'auto' }} />}
    </div>
  )
}

function StaffingTrendChart({ filters, granularity }) {
  const data = useMemo(() => hcStaffingByFY(filters, granularity), [filters, granularity])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={210}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.trend, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar yAxisId="l" dataKey="actual" name="Actual HC" fill={C.metric1} opacity={0.85} radius={[3,3,0,0]} maxBarSize={44} />
          <Bar yAxisId="l" dataKey="plan" name="Plan HC" fill={C.metric2} opacity={0.85} radius={[3,3,0,0]} maxBarSize={44} />
          <Line yAxisId="r" type="monotone" dataKey="adherence" name="Staffing %" stroke={C.trend} strokeWidth={2} dot={{ r: 3, fill: C.trend, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function UtilizationTrendChart({ filters, granularity }) {
  const data = useMemo(() => utilizationByFY(filters, granularity), [filters, granularity])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={210}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar dataKey="actual" name="Actual" fill={C.metric1} opacity={0.85} radius={[3,3,0,0]} maxBarSize={44} />
          <Bar dataKey="target" name="Target" fill={C.metric2} opacity={0.85} radius={[3,3,0,0]} maxBarSize={44} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// Line-only, matching the "single metric over time" convention already used for
// CPASU's card popup on TSA Forecasting.
function SlTrendChart({ filters, granularity }) {
  const data = useMemo(() => slTrendByFY(filters, granularity), [filters, granularity])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.trend, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Line type="monotone" dataKey="slPct" name="SL %" stroke={C.trend} strokeWidth={2.5} dot={{ r: 3, fill: C.trend, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Actual vs Plan lines, per the request that the popup "should show cases per FTE
// actual and Plan" — line-only, matching the "single-metric-family over time"
// convention already used for SL%/CPASU's own card popups.
function CasesPerFteTrendChart({ filters, granularity }) {
  const data = useMemo(() => cpfByFY(filters, granularity), [filters, granularity])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Line type="monotone" dataKey="actual" name="Actual" stroke={C.metric1} strokeWidth={2.5} dot={{ r: 3, fill: C.metric1, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="plan" name="Plan" stroke={C.metric2} strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3, fill: C.metric2, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function AttritionTrendChart({ filters, granularity }) {
  const data = useMemo(() => attritionByFY(filters, granularity), [filters, granularity])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={210}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(1)}K` : v} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.behind, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar yAxisId="l" dataKey="headcount" name="Headcount" fill={C.metric1} opacity={0.85} radius={[3,3,0,0]} maxBarSize={44} />
          <Line yAxisId="r" type="monotone" dataKey="attrition" name="Attrition %" stroke={C.behind} strokeWidth={2} dot={{ r: 3, fill: C.behind, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const MODAL_TITLES = {
  staffing: 'Actual vs Planned Headcount',
  utilization: 'Utilization — Actual vs Target',
  sl: 'Service Level % Trend',
  casesPerFte: 'Cases per FTE — Actual vs Plan',
  attrition: 'Headcount & Attrition Trend',
}

// Builds the "YTD <period>: <value> · ▲/▼ X% vs <prevPeriod>" sub-message shared by
// all 5 cards, replacing the earlier static "Target ..."/"Plan ..." line — same
// pattern TsaMetricCards.jsx uses. `lowerIsBetter` flips which direction counts as
// "good" (green): Total FTE and Attrition are worse when they climb YoY (overstaffing/
// rising attrition), so both pass lowerIsBetter=true, unlike Staffing/Utilization/SL
// where growth is the good direction.
function ytdSub(metric, formattedValue, { lowerIsBetter = false } = {}) {
  if (metric.yoyPct === null || metric.yoyPct === undefined) {
    return { text: `YTD ${metric.period}: ${formattedValue} · no prior year in scope`, trend: undefined }
  }
  const up = metric.yoyPct >= 0
  const good = lowerIsBetter ? !up : up
  return { text: `YTD ${metric.period}: ${formattedValue} · ${up ? '▲' : '▼'} ${Math.abs(metric.yoyPct)}% vs ${metric.prevPeriod}`, trend: good }
}

function DrillDownModal({ type, filters, granularity, onClose }) {
  return (
    <Modal title={MODAL_TITLES[type]} onClose={onClose}>
      {type === 'staffing' && <StaffingTrendChart filters={filters} granularity={granularity} />}
      {type === 'utilization' && <UtilizationTrendChart filters={filters} granularity={granularity} />}
      {type === 'sl' && <SlTrendChart filters={filters} granularity={granularity} />}
      {type === 'casesPerFte' && <CasesPerFteTrendChart filters={filters} granularity={granularity} />}
      {type === 'attrition' && <AttritionTrendChart filters={filters} granularity={granularity} />}
    </Modal>
  )
}

export default function MsgCapacityMetricCards({ filters, granularity }) {
  const [active, setActive] = useState(null)
  const d = useMemo(() => capacityCardData(filters, granularity), [filters, granularity])
  const toggle = key => setActive(prev => prev === key ? null : key)

  const staffingYtd = ytdSub(d.staffing, `${d.staffing.value}%`)
  const utilizationYtd = ytdSub(d.utilization, `${d.utilization.actual}%`)
  const slYtd = ytdSub(d.sl, `${d.sl.actual}%`)
  const attritionYtd = ytdSub(d.attrition, `${d.attrition.actual}%`, { lowerIsBetter: true })
  // Cases per FTE shows YTD only, no YoY comparison/trend pip — a deliberate
  // exception to ytdSub's comparison message, per direct request.
  const casesPerFteSub = `YTD ${d.casesPerFte.period}: ${d.casesPerFte.actual}`

  return (
    <div style={{ padding: '0 16px 12px' }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <Card icon="👥" label="Staffing Summary"
          value={`${d.staffing.value}%`}
          sub={staffingYtd.text} trend={staffingYtd.trend}
          onClick={() => toggle('staffing')} active={active === 'staffing'}
          rca="Staffing variation is largest in quarters right after a hiring freeze."
          clca="Smooth headcount ramp-up across quarters instead of a single freeze/unfreeze cycle." />
        <Card icon="📊" label="Utilization %"
          value={`${d.utilization.actual}%`}
          sub={utilizationYtd.text} trend={utilizationYtd.trend}
          onClick={() => toggle('utilization')} active={active === 'utilization'}
          rca="Utilization shortfalls trace back to a handful of recurring Aux codes."
          clca="Add an Aux-code contingency buffer for queues with recurring exposure." />
        <Card icon="🎯" label="SL %"
          value={`${d.sl.actual}%`}
          sub={slYtd.text} trend={slYtd.trend}
          onClick={() => toggle('sl')} active={active === 'sl'}
          rca="SL misses concentrate in queues that are also over headcount plan."
          clca="Prioritize a skill-mix/routing review for those queues over further hiring." />
        <Card icon="📋" label="Cases per FTE"
          value={d.casesPerFte.actual}
          sub={casesPerFteSub}
          onClick={() => toggle('casesPerFte')} active={active === 'casesPerFte'}
          rca="Cases per FTE trending above plan usually means volume growth outpaced the headcount plan."
          clca="Re-baseline the Cases-per-FTE plan using the last two quarters of actuals." />
        <Card icon="↩" label="Attrition %"
          value={`${d.attrition.actual}%`}
          sub={attritionYtd.text} trend={attritionYtd.trend}
          onClick={() => toggle('attrition')} active={active === 'attrition'}
          rca="Attrition is concentrated in regions with the longest backfill lead time."
          clca="Shorten the backfill pipeline for the regions driving attrition." />
      </div>

      {active && <DrillDownModal type={active} filters={filters} granularity={granularity} onClose={() => setActive(null)} />}
    </div>
  )
}
