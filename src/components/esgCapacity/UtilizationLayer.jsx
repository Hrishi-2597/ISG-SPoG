import React, { useMemo, useState } from 'react'
import {
  ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { utilizationByFY, utilizationByQueue, leavesByQueue } from '../../data/esgCapacityData'
import { C, Visual, Tip, CategoryTick } from '../ChartKit'

// Extends the shared Tip with the top-3 Aux codes driving the gap (a shortfall can
// genuinely be caused by more than one Aux code, so the tooltip surfaces the top 3
// by impact rather than a single culprit) and an Adherence % line on a second axis.
function UtilFyTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="chart-tooltip">
      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', marginBottom: 5 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 11, color: p.color, marginBottom: 2 }}>
          {p.name}: <span style={{ fontWeight: 600 }}>{p.value}%</span>
        </p>
      ))}
      {row.actual < row.target && row.auxBreakdown?.length > 0 && (
        <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ marginBottom: 2 }}>Driven by:</p>
          {row.auxBreakdown.map((a, i) => (
            <p key={i} style={{ marginLeft: 4 }}>
              <span style={{ color: C.behind, fontWeight: 600 }}>{a.code}</span> (-{a.impactPct}pt)
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// Time-axis view — Fiscal Year default, drillable to Quarter/Week via the page-wide
// granularity toggle, same as every other Layer 1/2 time chart on this page. Now
// carries an Adherence % line on a second axis alongside Actual/Target.
function Visual1({ filters, granularity }) {
  const data = useMemo(() => utilizationByFY(filters, granularity), [filters, granularity])
  return (
    <Visual title="Actual vs Target Utilization" subtitle="Hover a bar to see the Aux codes driving the gap">
      <ResponsiveContainer width="100%" height={222}>
        <ComposedChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.trend, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<UtilFyTip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar yAxisId="l" dataKey="actual" name="Actual" fill={C.metric1} opacity={0.85} radius={[3,3,0,0]} maxBarSize={44} />
          <Bar yAxisId="l" dataKey="target" name="Target" fill={C.metric2} opacity={0.85} radius={[3,3,0,0]} maxBarSize={44} />
          <Line yAxisId="r" type="monotone" dataKey="adherence" name="Adherence %" stroke={C.trend} strokeWidth={2} dot={{ r: 3, fill: C.trend, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

// Shared horizontal-bar shell for the two queue-axis visuals below — same
// "long real queue names read better as horizontal bars" convention as the
// Forecasting page's Top Queues by Variance charts.
function QueueBarChart({ data, actualLabel, targetLabel, actualColor, targetColor, tooltipExtra }) {
  const QueueTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const row = payload[0]?.payload
    return (
      <div className="chart-tooltip">
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', marginBottom: 5 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ fontSize: 11, color: p.color, marginBottom: 2 }}>
            {p.name}: <span style={{ fontWeight: 600 }}>{p.value}</span>
          </p>
        ))}
        {tooltipExtra && row && tooltipExtra(row)}
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke={C.grid} horizontal={false} />
        <XAxis type="number" tick={{ fill: C.tick, fontSize: 9 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={<CategoryTick />} width={140} axisLine={false} tickLine={false} />
        <Tooltip content={<QueueTip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
        <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
        <Bar dataKey="actual" name={actualLabel} fill={actualColor} opacity={0.85} radius={[0,3,3,0]} maxBarSize={16} />
        <Bar dataKey="target" name={targetLabel} fill={targetColor} opacity={0.85} radius={[0,3,3,0]} maxBarSize={16} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Queue-axis view — which specific queues have the worst Aux-driven utilization
// gap, worst first. Each queue now lists 2-3 contributing Aux codes, not one.
function Visual2({ filters }) {
  const data = useMemo(() => utilizationByQueue(filters), [filters])
  return (
    <Visual title="Utilization Defaulter Queues" subtitle="Worst utilization gap first">
      <QueueBarChart
        data={data} actualLabel="Actual %" targetLabel="Target %" actualColor={C.metric1} targetColor={C.metric2}
        tooltipExtra={row => (
          <p style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--border-subtle)' }}>
            Adherence <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{row.adherence}%</span> · Driven by{' '}
            <span style={{ color: C.behind, fontWeight: 600 }}>{row.auxes?.join(', ')}</span>
          </p>
        )}
      />
    </Visual>
  )
}

// Renamed from "Outage — Actual vs Target Leaves" for clarity: this shows which
// queues are burning through more leave than planned, and by how much.
function Visual3({ filters }) {
  const data = useMemo(() => leavesByQueue(filters), [filters])
  return (
    <Visual title="Leave Impact — Actual vs Target" subtitle="Highest delta, ascending">
      <QueueBarChart
        data={data} actualLabel="Actual Leaves" targetLabel="Target Leaves" actualColor={C.behind} targetColor={C.metric2}
        tooltipExtra={row => (
          <p style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--border-subtle)' }}>
            Delta <span style={{ fontWeight: 600, color: row.delta > 0 ? C.behind : C.ahead }}>{row.delta > 0 ? '+' : ''}{row.delta}</span>
          </p>
        )}
      />
    </Visual>
  )
}

export default function UtilizationLayer({ filters, granularity }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <div className="layer-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#070f1a', background: '#fb923c', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.04em' }}>03</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Utilization and Outage Analysis</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>— Aux-driven utilization &amp; leave outage</span>
        </div>
        <span style={{ fontSize: 11, color: '#fb923c', transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▲</span>
      </div>
      {open && (
        <div style={{ padding: 12, display: 'flex', gap: 10 }}>
          <Visual1 filters={filters} granularity={granularity} />
          <Visual2 filters={filters} />
          <Visual3 filters={filters} />
        </div>
      )}
    </div>
  )
}
