import React, { useMemo, useState } from 'react'
import {
  ComposedChart, LineChart, Sankey, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Rectangle,
} from 'recharts'
import { workloadSankey, workloadByFY, actHrsByFY } from '../../data/hesCapacityData'
import { C, Visual, Tip } from '../ChartKit'

// Recharts' default Sankey node renders as a plain unlabeled rect — this custom
// node paints the real CQN/LOB name next to it so the diagram is legible without
// hovering every node, same "read without hovering" bar towards labeled data
// established for the horizontal queue-bar charts elsewhere in this app.
function SankeyNode({ x, y, width, height, index, payload }) {
  const isSource = payload.sourceLinks.length > 0
  return (
    <g>
      <Rectangle x={x} y={y} width={width} height={height} fill={isSource ? C.metric1 : C.metric2} fillOpacity={0.85} />
      <text
        textAnchor={isSource ? 'end' : 'start'}
        x={isSource ? x - 6 : x + width + 6}
        y={y + height / 2}
        dy={4}
        fontSize={10}
        fill="var(--text-secondary)"
      >
        {payload.name}
      </text>
    </g>
  )
}

function SankeyTip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0]?.payload
  if (!p || p.source === undefined) return null
  return (
    <div className="chart-tooltip">
      <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
        {p.source.name} → {p.target.name}: <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{p.value}</span>
      </p>
    </div>
  )
}

function Visual1({ filters }) {
  const data = useMemo(() => workloadSankey(filters), [filters])
  return (
    <Visual title="Workload Flow — CQN to LOB" subtitle="Illustrative CQN priority tiers routed to real LOBs">
      <ResponsiveContainer width="100%" height={260}>
        <Sankey
          data={data}
          node={<SankeyNode />}
          nodePadding={22}
          margin={{ top: 8, right: 90, bottom: 8, left: 90 }}
          link={{ stroke: C.trend, strokeOpacity: 0.35 }}
        >
          <Tooltip content={<SankeyTip />} />
        </Sankey>
      </ResponsiveContainer>
    </Visual>
  )
}

function Visual2({ filters, granularity }) {
  const data = useMemo(() => workloadByFY(filters, granularity), [filters, granularity])
  return (
    <Visual title="Workload Act vs Plan">
      <ResponsiveContainer width="100%" height={222}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar dataKey="actual" name="Actual" fill={C.metric1} opacity={0.85} radius={[3,3,0,0]} maxBarSize={40} />
          <Bar dataKey="plan" name="Plan" fill={C.metric2} opacity={0.85} radius={[3,3,0,0]} maxBarSize={40} />
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

function Visual3({ filters, granularity }) {
  const data = useMemo(() => actHrsByFY(filters, granularity), [filters, granularity])
  return (
    <Visual title="ACT Trend — Actual vs Plan">
      <ResponsiveContainer width="100%" height={222}>
        <LineChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}h`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Line type="monotone" dataKey="actual" name="ACT Actual (hrs)" stroke={C.behind} strokeWidth={2.5} dot={{ r: 3, fill: C.behind, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="plan" name="ACT Plan (hrs)" stroke={C.metric2} strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3, fill: C.metric2, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </Visual>
  )
}

export default function WorkloadDistributionLayer({ filters, granularity }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      <div className="layer-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#070f1a', background: '#fb923c', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.04em' }}>03</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Workload Distribution</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>— CQN/LOB flow, workload &amp; ACT trend</span>
        </div>
        <span style={{ fontSize: 11, color: '#fb923c', transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▲</span>
      </div>
      {open && (
        <div style={{ padding: 12, display: 'flex', gap: 10 }}>
          <Visual1 filters={filters} />
          <Visual2 filters={filters} granularity={granularity} />
          <Visual3 filters={filters} granularity={granularity} />
        </div>
      )}
    </div>
  )
}
