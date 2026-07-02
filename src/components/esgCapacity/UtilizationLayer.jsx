import React, { useMemo, useState } from 'react'
import {
  ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { utilizationByFY, utilizationByQueue, leavesByQueue } from '../../data/esgCapacityData'
import { C, Visual, Tip, CategoryTick } from '../ChartKit'

// Extends the shared Tip with an Aux-code culprit line when utilization missed
// target for that period — the one place on this page where the tooltip needs to
// read a field (auxCulprit/auxImpactPct) that isn't one of the plotted series.
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
      {row.actual < row.target && (
        <p style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--border-subtle)' }}>
          Driven by <span style={{ color: C.behind, fontWeight: 600 }}>{row.auxCulprit}</span> ({row.auxImpactPct > 0 ? '-' : ''}{row.auxImpactPct}pt)
        </p>
      )}
    </div>
  )
}

// Time-axis view — Fiscal Year default, drillable to Quarter/Week via the page-wide
// granularity toggle, same as every other Layer 1/2 time chart on this page.
function Visual1({ filters, granularity }) {
  const data = useMemo(() => utilizationByFY(filters, granularity), [filters, granularity])
  return (
    <Visual title="Actual vs Target Utilization" subtitle="Hover a bar to see which Aux code drove the gap">
      <ResponsiveContainer width="100%" height={222}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<UtilFyTip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar dataKey="actual" name="Actual" fill={C.metric1} opacity={0.85} radius={[3,3,0,0]} maxBarSize={44} />
          <Bar dataKey="target" name="Target" fill={C.metric2} opacity={0.85} radius={[3,3,0,0]} maxBarSize={44} />
        </BarChart>
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
// gap, worst first (see design_choice.md for why this differs from Visual1).
function Visual2({ filters }) {
  const data = useMemo(() => utilizationByQueue(filters), [filters])
  return (
    <Visual title="Queues with Aux Culprit" subtitle="Worst utilization gap first">
      <QueueBarChart
        data={data} actualLabel="Actual %" targetLabel="Target %" actualColor={C.metric1} targetColor={C.metric2}
        tooltipExtra={row => (
          <p style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--border-subtle)' }}>
            Adherence <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{row.adherence}%</span> · Driven by{' '}
            <span style={{ color: C.behind, fontWeight: 600 }}>{row.auxCulprit}</span>
          </p>
        )}
      />
    </Visual>
  )
}

function Visual3({ filters }) {
  const data = useMemo(() => leavesByQueue(filters), [filters])
  return (
    <Visual title="Outage — Actual vs Target Leaves" subtitle="Highest delta, ascending">
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
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Utilization</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>— Aux-driven utilization &amp; outage</span>
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
