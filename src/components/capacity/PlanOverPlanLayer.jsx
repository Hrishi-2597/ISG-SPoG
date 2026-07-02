import React, { useMemo, useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { CAPACITY_PLAN_NAMES } from '../../data/mockData'
import { C, Visual, Tip, PlanDropdowns } from '../ChartKit'

const PLANS = CAPACITY_PLAN_NAMES.filter(p => p !== 'Actual')

// Shared between ESG Capacity Plan and HES Capacity Plan — both mockups specify the
// exact same layer (one full-width headcount plan-vs-plan chart with Plan A/B
// dropdowns and a variance % line), differing only in which selector supplies the
// numbers. `dataFn(filters, granularity)` is the page-specific data source.
function SoleVisual({ filters, granularity, dataFn, planA, planB, onPlanChange }) {
  const data = useMemo(() => dataFn(filters, granularity), [filters, granularity, dataFn])
  return (
    <Visual title="Plan over Plan Headcount Comparison" controls={<PlanDropdowns planA={planA} planB={planB} onChange={onPlanChange} options={PLANS} />}>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.trend, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <ReferenceLine yAxisId="r" y={0} stroke="rgba(255,255,255,0.1)" />
          <Bar yAxisId="l" dataKey="plan1" name={planA} fill={C.metric1} opacity={0.8} radius={[3,3,0,0]} maxBarSize={50} />
          <Bar yAxisId="l" dataKey="plan2" name={planB} fill={C.metric2} opacity={0.8} radius={[3,3,0,0]} maxBarSize={50} />
          <Line yAxisId="r" type="monotone" dataKey="variance" name="Variance %" stroke={C.trend}
            strokeWidth={2} dot={{ r: 3, fill: C.trend, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

export default function PlanOverPlanLayer({ filters, granularity, dataFn, badge = '02' }) {
  const [open, setOpen] = useState(true)
  const [plans, setPlans] = useState({ planA: PLANS[0], planB: PLANS[1] })
  const handlePlanChange = (key, val) => setPlans(p => ({ ...p, [key]: val }))

  return (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <div className="layer-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#070f1a', background: '#34d399', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.04em' }}>{badge}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Plan over Plan Comparison</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>— headcount plan variance</span>
        </div>
        <span style={{ fontSize: 11, color: '#34d399', transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▲</span>
      </div>
      {open && (
        <div style={{ padding: 12, display: 'flex' }}>
          <SoleVisual filters={filters} granularity={granularity} dataFn={dataFn} planA={plans.planA} planB={plans.planB} onPlanChange={handlePlanChange} />
        </div>
      )}
    </div>
  )
}
