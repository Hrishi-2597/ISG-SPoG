import React, { useMemo, useState } from 'react'
import {
  BarChart, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'
import {
  cardData, filterQueues, callVolumeByFY, dbOspVolumeByFY, forecastAccuracyByRegion,
  CQN_VARIANCE_BY_FY, cqnVarianceQueuesByFY,
} from '../data/mockData'

const C = { offered: '#38bdf8', handled: '#34d399', db: '#38bdf8', osp: '#fb923c', actual: '#38bdf8', forecast: '#fb923c', line: '#34d399', grid: 'rgba(255,255,255,0.06)', tick: '#4a6a85' }
// Chart drill-downs are capped and centered so 3-5 categories don't stretch across the
// full dashboard width with huge gaps between bar groups.
const CHART_BOX = { maxWidth: 620, margin: '0 auto' }
const BAR_GAPS = { barCategoryGap: '20%', barGap: 6 }

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

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

function Card({ id, icon, label, sublabel, value, sub, trend, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`card-panel flex-1 min-w-0 text-left flex flex-col${active ? ' active' : ''}`}
      style={{ cursor: 'pointer', padding: 0, minHeight: 84 }}
    >
      <div style={{
        padding: '8px 12px 6px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ fontSize: 14, lineHeight: 1 }}>{icon}</span>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#e6f1ff', lineHeight: 1.2 }}>{label}</p>
          {sublabel && <p style={{ fontSize: 9, color: '#3d607a', marginTop: 1 }}>{sublabel}</p>}
        </div>
      </div>

      <div style={{ padding: '8px 12px 10px', flex: 1 }}>
        <p className="num" style={{ fontSize: 20, fontWeight: 700, color: '#e6f1ff', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {value}
        </p>
        {sub && (
          <p style={{ fontSize: 10, color: '#7fa8cc', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            {trend !== undefined && <StatusPip ok={trend} />}
            {sub}
          </p>
        )}
      </div>

      {active && (
        <div style={{
          height: 2, background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)',
          marginTop: 'auto',
        }} />
      )}
    </button>
  )
}

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', marginBottom: 5 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 11, color: p.color, marginBottom: 2 }}>
          {p.name}: <span style={{ fontWeight: 600 }}>
            {typeof p.value === 'number' && p.value > 100 ? p.value.toLocaleString() : `${p.value}%`}
          </span>
        </p>
      ))}
    </div>
  )
}

function QueueTable({ rows }) {
  return (
    <div style={{ overflowX: 'auto', maxHeight: 220, overflowY: 'auto' }}>
      <table className="w-full" style={{ fontSize: 11, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <th style={{ textAlign: 'left', padding: '4px 12px 4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Queue</th>
            <th style={{ textAlign: 'left', padding: '4px 12px 4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Region</th>
            <th style={{ textAlign: 'right', padding: '4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((q, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '5px 12px 5px 0', fontFamily: 'monospace', fontSize: 10, color: '#7fa8cc' }}>{q.name}</td>
              <td style={{ padding: '5px 12px 5px 0', color: '#3d607a' }}>{q.region}</td>
              <td className="num" style={{ padding: '5px 0', textAlign: 'right', fontWeight: 600,
                color: q.accuracy >= 90 ? '#34d399' : q.accuracy >= 80 ? '#fbbf24' : '#f87171' }}>
                {q.accuracy}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function VolumeByFYChart({ filters }) {
  const data = useMemo(() => callVolumeByFY(filters), [filters])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} {...BAR_GAPS}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar dataKey="offered" name="Offered" fill={C.offered} opacity={0.85} radius={[3,3,0,0]} maxBarSize={54} />
          <Bar dataKey="handled" name="Handled" fill={C.handled} opacity={0.85} radius={[3,3,0,0]} maxBarSize={54} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function DbOspByFYChart({ filters }) {
  const data = useMemo(() => dbOspVolumeByFY(filters), [filters])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} {...BAR_GAPS}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar dataKey="db"  name="DB Offered"  fill={C.db}  opacity={0.85} radius={[3,3,0,0]} maxBarSize={54} />
          <Bar dataKey="osp" name="OSP Offered" fill={C.osp} opacity={0.85} radius={[3,3,0,0]} maxBarSize={54} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function ForecastByRegionChart({ filters }) {
  const data = useMemo(() => forecastAccuracyByRegion(filters), [filters])
  return (
    <div style={CHART_BOX}>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }} {...BAR_GAPS}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="region" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
          <YAxis yAxisId="r" orientation="right" domain={[0,100]} tick={{ fill: C.line, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar yAxisId="l" dataKey="actual"   name="Actual"   fill={C.actual}   opacity={0.85} radius={[3,3,0,0]} maxBarSize={30} />
          <Bar yAxisId="l" dataKey="forecast" name="Forecast" fill={C.forecast} opacity={0.85} radius={[3,3,0,0]} maxBarSize={30} />
          <Line yAxisId="r" type="monotone" dataKey="accuracy" name="Accuracy %" stroke={C.line}
            strokeWidth={2} dot={{ r: 3, fill: C.line, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function VarianceByFYChart({ filters, onSelectYear }) {
  return (
    <div style={CHART_BOX}>
      <p style={{ fontSize: 9.5, color: '#5a8bb0', marginBottom: 6, textAlign: 'center' }}>Click a year to see example queues within the ±10% band</p>
      <ResponsiveContainer width="100%" height={205}>
        <BarChart data={CQN_VARIANCE_BY_FY} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="fy" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => `${v}%`} domain={[0, 60]} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.06)' }} />
          <Bar dataKey="pct" name="Within ±10%" radius={[4,4,0,0]} maxBarSize={90}
            onClick={d => onSelectYear(d.fy)} style={{ cursor: 'pointer' }}>
            {CQN_VARIANCE_BY_FY.map((d, i) => <Cell key={i} fill="#38bdf8" opacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function YearQueueModal({ fy, filters, onClose }) {
  const queues = useMemo(() => cqnVarianceQueuesByFY(filters, fy), [filters, fy])
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(4,9,15,0.7)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="animate-fade-in"
        style={{
          background: '#0c1929', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 10,
          padding: '16px 18px', width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(56,189,248,0.08)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>{fy} — Queues within ±10% variance</h3>
          <button onClick={onClose} style={{ color: '#3d607a', fontSize: 16, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
        <p style={{ fontSize: 10, color: '#5a8bb0', marginBottom: 10 }}>Representative sample from the current filter scope</p>
        {queues.length === 0 ? (
          <p style={{ fontSize: 11, color: '#3d607a', padding: '12px 0' }}>No queues in the current filter scope.</p>
        ) : (
          <table className="w-full" style={{ fontSize: 11, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <th style={{ textAlign: 'left', padding: '4px 12px 4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Queue</th>
                <th style={{ textAlign: 'right', padding: '4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Variance</th>
              </tr>
            </thead>
            <tbody>
              {queues.map((q, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '6px 12px 6px 0', fontFamily: 'monospace', fontSize: 10, color: '#cfe8fb' }}>{q.name}</td>
                  <td className="num" style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600, color: '#34d399' }}>
                    {q.variance > 0 ? '+' : ''}{q.variance}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function DrillDownPanel({ type, filters, rows, onClose }) {
  const [selectedYear, setSelectedYear] = useState(null)
  return (
    <div className="animate-fade-in" style={{
      marginTop: 10,
      background: 'rgba(12,25,41,0.95)',
      border: '1px solid rgba(56,189,248,0.2)',
      borderRadius: 8,
      padding: '12px 14px',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', textAlign: 'center' }}>
          {type === 'queues'   && 'Active Queue Directory'}
          {type === 'volume'   && 'Offered vs Handled — Fiscal Year'}
          {type === 'dbOsp'    && 'DB vs OSP Offered Volume'}
          {type === 'forecast' && 'Regional Forecast Accuracy'}
          {type === 'variance' && 'Year-over-Year Forecast Variance'}
        </h3>
        <button onClick={onClose} style={{ position: 'absolute', right: 0, top: -1, color: '#3d607a', fontSize: 16, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>

      {type === 'queues' && <QueueTable rows={rows} />}
      {type === 'volume' && <VolumeByFYChart filters={filters} />}
      {type === 'dbOsp' && <DbOspByFYChart filters={filters} />}
      {type === 'forecast' && <ForecastByRegionChart filters={filters} />}
      {type === 'variance' && <VarianceByFYChart filters={filters} onSelectYear={setSelectedYear} />}

      {selectedYear && <YearQueueModal fy={selectedYear} filters={filters} onClose={() => setSelectedYear(null)} />}
    </div>
  )
}

export default function MetricCards({ filters }) {
  const [active, setActive] = useState(null)
  const d = useMemo(() => cardData(filters), [filters])
  // Total Queues drill-down matches the card's own portfolio scoping (DB/OSP-agnostic).
  const structuralRows = useMemo(() => filterQueues({ ...filters, dbOsp: 'All' }), [filters])
  const toggle = key => setActive(prev => prev === key ? null : key)

  return (
    <div style={{ padding: '0 16px 12px' }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <Card id="queues"
          icon="⬡" label="Total Queues" sublabel="Active / Inactive"
          value={`${d.totalQueues.active} / ${d.totalQueues.active + d.totalQueues.inactive}`}
          sub={`${d.totalQueues.inactive} inactive queues`}
          onClick={() => toggle('queues')} active={active === 'queues'}
        />
        <Card id="volume"
          icon="📞" label="Call Volume" sublabel="Offered & Handled"
          value={fmt(d.callVolume.offered)}
          sub={`${fmt(d.callVolume.handled)} handled · ${d.callVolume.handlePct}%`}
          trend={d.callVolume.handlePct >= 90}
          onClick={() => toggle('volume')} active={active === 'volume'}
        />
        <Card id="dbOsp"
          icon="⚖" label="DB / OSP Split" sublabel="Offered volume"
          value={`${d.dbOspSplit.db}% / ${d.dbOspSplit.osp}%`}
          sub={`DB ${fmt(d.dbOspSplit.dbVol)}  ·  OSP ${fmt(d.dbOspSplit.ospVol)}`}
          onClick={() => toggle('dbOsp')} active={active === 'dbOsp'}
        />
        <Card id="forecast"
          icon="◎" label="Forecast Accuracy" sublabel=""
          value={`${d.forecastAccuracy.value}%`}
          sub={`Target ${d.forecastAccuracy.target}% · ${d.forecastAccuracy.value >= d.forecastAccuracy.target ? 'On track' : 'Below target'}`}
          trend={d.forecastAccuracy.value >= d.forecastAccuracy.target}
          onClick={() => toggle('forecast')} active={active === 'forecast'}
        />
        <Card id="variance"
          icon="±" label="CQN Variance" sublabel="Within ±10%"
          value={`${d.cqnVariance.pct}%`}
          sub={`${d.cqnVariance.withinRange} of ${d.cqnVariance.total} queues`}
          trend={d.cqnVariance.pct >= 40}
          onClick={() => toggle('variance')} active={active === 'variance'}
        />
      </div>

      {active && <DrillDownPanel type={active} filters={filters} rows={structuralRows} onClose={() => setActive(null)} />}
    </div>
  )
}
