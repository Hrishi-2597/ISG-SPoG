import React, { useMemo, useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { CAPACITY_PLAN_NAMES } from '../../data/mockData'
import { hcStaffingByFY, attritionByFY, slTrendByFY, defaulterQueues } from '../../data/esgCapacityData'
import { C, Visual, Tip, PlanSelect, BinaryToggle } from '../ChartKit'

const PLANS = CAPACITY_PLAN_NAMES.filter(p => p !== 'Actual')

function Visual1({ filters, granularity, selectedPlan, onPlanChange }) {
  const data = useMemo(() => hcStaffingByFY(filters, granularity), [filters, granularity])
  return (
    <Visual title="Actual vs Planned HC Staffing Summary" controls={<PlanSelect label="Plan" value={selectedPlan} onChange={onPlanChange} options={PLANS} />}>
      <ResponsiveContainer width="100%" height={222}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.trend, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar yAxisId="l" dataKey="actual" name="Actual HC" fill={C.metric1} opacity={0.8} radius={[3,3,0,0]} maxBarSize={40} />
          <Bar yAxisId="l" dataKey="plan" name="Plan HC" fill={C.metric2} opacity={0.8} radius={[3,3,0,0]} maxBarSize={40} />
          <Line yAxisId="r" type="monotone" dataKey="adherence" name="Staffing %" stroke={C.trend} strokeWidth={2} dot={{ r: 3, fill: C.trend, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

function Visual2({ filters, granularity }) {
  const [lens, setLens] = useState('Region')
  const data = useMemo(() => attritionByFY(filters, granularity, lens), [filters, granularity, lens])
  return (
    <Visual title="Attrition" cornerControls={<BinaryToggle leftLabel="Region" rightLabel="Country" value={lens} onChange={setLens} />}>
      <ResponsiveContainer width="100%" height={222}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(1)}K` : v} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.behind, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar yAxisId="l" dataKey="headcount" name="Headcount" fill={C.metric1} opacity={0.8} radius={[3,3,0,0]} maxBarSize={40} />
          <Line yAxisId="r" type="monotone" dataKey="attrition" name="Attrition %" stroke={C.behind} strokeWidth={2} dot={{ r: 3, fill: C.behind, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

function Visual3({ filters, granularity }) {
  const [lens, setLens] = useState('Region')
  const data = useMemo(() => slTrendByFY(filters, granularity), [filters, granularity])
  const defaulters = useMemo(() => defaulterQueues(filters), [filters])
  return (
    <Visual title="Actual vs Plan Trend with SL%" cornerControls={<BinaryToggle leftLabel="Region" rightLabel="Country" value={lens} onChange={setLens} />}>
      <ResponsiveContainer width="100%" height={175}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(1)}K` : v} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.trend, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar yAxisId="l" dataKey="actual" name="Actual" fill={C.metric1} opacity={0.8} radius={[3,3,0,0]} maxBarSize={36} />
          <Bar yAxisId="l" dataKey="plan" name="Plan" fill={C.metric2} opacity={0.8} radius={[3,3,0,0]} maxBarSize={36} />
          <Line yAxisId="r" type="monotone" dataKey="slPct" name="SL %" stroke={C.trend} strokeWidth={2} dot={{ r: 3, fill: C.trend, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
      <p style={{ fontSize: 9.5, color: 'var(--text-faint)', margin: '6px 0 4px', textAlign: 'center' }}>Defaulter queues — actual over plan, ascending</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {defaulters.map((q, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '2px 4px' }}>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 9.5 }}>{q.name}</span>
            <span style={{ fontWeight: 600, color: C.behind }}>{q.actual} <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>vs {q.plan} plan (+{q.delta})</span></span>
          </div>
        ))}
        {defaulters.length === 0 && <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>No queues currently over plan.</p>}
      </div>
    </Visual>
  )
}

export default function HeadcountLayer({ filters, granularity }) {
  const [open, setOpen] = useState(true)
  const [plan, setPlan] = useState(PLANS[0])

  return (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <div className="layer-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#070f1a', background: '#38bdf8', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.04em' }}>01</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Headcount and SL%</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>— staffing, attrition &amp; service level</span>
        </div>
        <span style={{ fontSize: 11, color: '#38bdf8', transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▲</span>
      </div>
      {open && (
        <div style={{ padding: 12, display: 'flex', gap: 10 }}>
          <Visual1 filters={filters} granularity={granularity} selectedPlan={plan} onPlanChange={setPlan} />
          <Visual2 filters={filters} granularity={granularity} />
          <Visual3 filters={filters} granularity={granularity} />
        </div>
      )}
    </div>
  )
}
