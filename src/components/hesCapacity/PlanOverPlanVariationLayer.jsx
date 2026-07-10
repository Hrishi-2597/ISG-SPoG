import React, { useMemo, useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell, LabelList,
} from 'recharts'
import {
  hesPlanOverPlanByDimension, hesPlanOverPlanTrendByDimension, planOverPlanLobVariance,
} from '../../data/hesCapacityData'
import { C, Visual, Tip, BinaryToggle, PillButton, CategoryTick } from '../ChartKit'

// HES-specific counterpart to esgCapacity/PlanOverPlanVariationLayer.jsx — same
// Region/Sub-region click-to-drill + ranked-variance-list structure, but ranking
// LOBs instead of queues (this page has no per-queue dimension), per direct request.
// Built as its own component rather than the shared capacity/PlanOverPlanLayer.jsx
// for the same reason ESG's version was: neither page's new capabilities apply to
// the other.
function MainChart({ filters, granularity }) {
  const [dimension, setDimension] = useState('Region')
  const [selectedKey, setSelectedKey] = useState(null)
  const dimLabel = dimension === 'SubRegion' ? 'Sub-region' : 'Region'
  const dimData = useMemo(() => hesPlanOverPlanByDimension(filters, dimension), [filters, dimension])
  const trendData = useMemo(
    () => (selectedKey ? hesPlanOverPlanTrendByDimension(filters, selectedKey, dimension, granularity) : []),
    [filters, selectedKey, dimension, granularity]
  )
  const handleDimensionChange = val => {
    setDimension(val === 'Sub-region' ? 'SubRegion' : 'Region')
    setSelectedKey(null)
  }

  const data = selectedKey ? trendData : dimData
  const xKey = selectedKey ? 'period' : 'key'
  const handleBarClick = selectedKey ? undefined : (d => setSelectedKey(d.key))

  return (
    <Visual title="Plan over Plan Variation"
      subtitle={selectedKey ? `${selectedKey} — headcount trend` : `Click a ${dimLabel.toLowerCase()} to see its trend`}
      cornerControls={<BinaryToggle leftLabel="Region" rightLabel="Sub-region" value={dimLabel} onChange={handleDimensionChange} />}
      controls={selectedKey && <PillButton onClick={() => setSelectedKey(null)}>← All {dimLabel}s</PillButton>}
      rca="Headcount plan variance is widest for LOBs with the newest onboarding."
      clca="Re-baseline those LOBs' plans using actual ramp data before the next lock.">
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey={xKey} tick={{ fill: C.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.trend, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <ReferenceLine yAxisId="r" y={0} stroke="rgba(255,255,255,0.1)" />
          <Bar yAxisId="l" dataKey="plan1" name="Plan A" fill={C.metric1} opacity={0.8} radius={[3,3,0,0]} maxBarSize={50}
            onClick={handleBarClick} style={{ cursor: selectedKey ? 'default' : 'pointer' }} />
          <Bar yAxisId="l" dataKey="plan2" name="Plan B" fill={C.metric2} opacity={0.8} radius={[3,3,0,0]} maxBarSize={50}
            onClick={handleBarClick} style={{ cursor: selectedKey ? 'default' : 'pointer' }} />
          <Line yAxisId="r" type="monotone" dataKey="variance" name="Variance %" stroke={C.trend}
            strokeWidth={2} dot={{ r: 3, fill: C.trend, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

// Diverging bar per LOB, value-labeled — same polished convention as Forecasting's
// "Top Queues by Variance" charts and ESG Capacity's "Queues with Highest Variation".
function LobVarianceChart({ filters }) {
  const data = useMemo(() => planOverPlanLobVariance(filters, 8), [filters])
  const niceMax = useMemo(() => Math.max(10, Math.ceil(Math.max(1, ...data.map(d => Math.abs(d.variance))) / 5) * 5), [data])
  const domainMax = niceMax * 1.3
  const ticks = [-niceMax, -niceMax / 2, 0, niceMax / 2, niceMax]

  const LobTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const row = payload[0]?.payload
    return (
      <div className="chart-tooltip">
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', marginBottom: 5 }}>{label}</p>
        <p style={{ fontSize: 11, color: C.metric1 }}>Plan A: <span style={{ fontWeight: 600 }}>{row.plan1}</span></p>
        <p style={{ fontSize: 11, color: C.metric2 }}>Plan B: <span style={{ fontWeight: 600 }}>{row.plan2}</span></p>
      </div>
    )
  }

  return (
    <Visual title="LOBs with Highest Variation" subtitle="Plan A vs Plan B, worst variance first"
      rca="A small number of LOBs account for most of the plan-to-plan swing."
      clca="Review these LOBs' plans first — they carry the most headcount risk.">
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} layout="vertical" margin={{ top: 4, right: 34, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} horizontal={false} />
          <XAxis type="number" domain={[-domainMax, domainMax]} ticks={ticks} tick={{ fill: C.tick, fontSize: 9 }} axisLine={false} tickLine={false}
            tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="name" tick={<CategoryTick />} width={150} axisLine={false} tickLine={false} />
          <Tooltip content={<LobTip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <ReferenceLine x={0} stroke="rgba(255,255,255,0.15)" />
          <Bar dataKey="variance" name="Variance %" radius={[3,3,3,3]} maxBarSize={18}>
            {data.map((d, i) => <Cell key={i} fill={d.variance >= 0 ? C.ahead : C.behind} opacity={0.9} />)}
            <LabelList dataKey={d => d.variance >= 0 ? d.variance : undefined} position="right"
              formatter={v => `+${v}%`} style={{ fontSize: 10.5, fontWeight: 700, fill: C.ahead }} />
            <LabelList dataKey={d => d.variance < 0 ? d.variance : undefined} position="left"
              formatter={v => `${v}%`} style={{ fontSize: 10.5, fontWeight: 700, fill: C.behind }} />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

export default function PlanOverPlanVariationLayer({ filters, granularity }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <div className="layer-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#070f1a', background: '#34d399', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.04em' }}>02</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Plan over Plan Variation</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>— headcount plan variance by region &amp; LOB</span>
        </div>
        <span style={{ fontSize: 11, color: '#34d399', transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▲</span>
      </div>
      {open && (
        <div style={{ padding: 12, display: 'flex', gap: 10 }}>
          <MainChart filters={filters} granularity={granularity} />
          <LobVarianceChart filters={filters} />
        </div>
      )}
    </div>
  )
}
