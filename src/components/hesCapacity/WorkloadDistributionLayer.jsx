import React, { useMemo, useState } from 'react'
import {
  ComposedChart, LineChart, Sankey, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Rectangle,
} from 'recharts'
import { workloadSankey, actHrsByFY, actHrsDefaulterLobs } from '../../data/hesCapacityData'
import { C, Visual, Tip, BinaryToggle } from '../ChartKit'

// Recharts' default Sankey node renders as a plain unlabeled rect — this custom
// node paints the real LOB/queue name next to it so the diagram is legible without
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

// Toggle switches which real-name set the Sankey flows into: 'LOB' mode routes
// illustrative CQN priority tiers into real HES LOB names; 'CQN' mode routes
// illustrative LOB-priority tiers into real HES queue names (from LOB_QUEUES) — per
// direct request to "utilize some HES LOB's and some HES Queues."
function Visual1({ filters }) {
  const [mode, setMode] = useState('LOB')
  const data = useMemo(() => workloadSankey(filters, mode), [filters, mode])
  return (
    <Visual title="Workload Distribution"
      subtitle={mode === 'LOB' ? 'Illustrative CQN priority tiers routed to real LOBs' : 'Illustrative LOB priority tiers routed to real queues'}
      cornerControls={<BinaryToggle leftLabel="LOB" rightLabel="CQN" value={mode} onChange={setMode} />}>
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

// Shared "top LOBs above target" list — both ACT visuals show it, per direct request.
function DefaulterLobList({ filters }) {
  const defaulters = useMemo(() => actHrsDefaulterLobs(filters, 6), [filters])
  return (
    <>
      <p style={{ fontSize: 9.5, color: 'var(--text-faint)', margin: '6px 0 4px', textAlign: 'center' }}>
        Top LOBs above target ACT
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {defaulters.map((l, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '2px 4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{l.lob}</span>
            <span style={{ fontWeight: 600, color: C.behind }}>
              {l.actual}h <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>vs {l.plan}h plan (+{l.delta}h)</span>
            </span>
          </div>
        ))}
        {defaulters.length === 0 && <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>No LOBs currently above target ACT.</p>}
      </div>
    </>
  )
}

// Renamed from "Workload Act vs Plan" — the original name's "Act" referred to
// Average Case Time all along, not workload volume, so this now plots the same
// actHrsByFY data as Visual3 but as a bar+adherence chart, plus the defaulter list.
function Visual2({ filters, granularity }) {
  const data = useMemo(() => actHrsByFY(filters, granularity), [filters, granularity])
  return (
    <Visual title="Average Case Time Variance">
      <ResponsiveContainer width="100%" height={190}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}h`} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.trend, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar yAxisId="l" dataKey="actual" name="Actual (hrs)" fill={C.metric1} opacity={0.85} radius={[3,3,0,0]} maxBarSize={40} />
          <Bar yAxisId="l" dataKey="plan" name="Plan (hrs)" fill={C.metric2} opacity={0.85} radius={[3,3,0,0]} maxBarSize={40} />
          <Line yAxisId="r" type="monotone" dataKey="adherence" name="Adherence %" stroke={C.trend} strokeWidth={2} dot={{ r: 3, fill: C.trend, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
      <DefaulterLobList filters={filters} />
    </Visual>
  )
}

// Kept as a trend line (vs Visual2's bars) but now carries the same adherence line
// and defaulter list, per "make this graph similar to Average Case Time Variance."
function Visual3({ filters, granularity }) {
  const data = useMemo(() => actHrsByFY(filters, granularity), [filters, granularity])
  return (
    <Visual title="ACT Trend — Actual vs Plan">
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}h`} />
          <YAxis yAxisId="r" orientation="right" tick={{ fill: C.trend, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Line yAxisId="l" type="monotone" dataKey="actual" name="ACT Actual (hrs)" stroke={C.behind} strokeWidth={2.5} dot={{ r: 3, fill: C.behind, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          <Line yAxisId="l" type="monotone" dataKey="plan" name="ACT Plan (hrs)" stroke={C.metric2} strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3, fill: C.metric2, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          <Line yAxisId="r" type="monotone" dataKey="adherence" name="Adherence %" stroke={C.trend} strokeWidth={2} dot={{ r: 3, fill: C.trend, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
      <DefaulterLobList filters={filters} />
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
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>— LOB/queue flow &amp; Average Case Time</span>
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
