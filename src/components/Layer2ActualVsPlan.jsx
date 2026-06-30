import React, { useState } from 'react'
import {
  ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'
import {
  PLAN_NAMES, ACTUAL_VS_PLAN_BY_FY, ACTUAL_VS_PLAN_BY_QTR,
  ACTUAL_VS_PLAN_BY_WEEK, STACKED_ADHERENCE, ACTUAL_VS_PLAN_BY_CQN,
} from '../data/mockData'

const PLANS = PLAN_NAMES.filter(p => p !== 'Actual')
const C = { actual: '#38bdf8', plan: '#fb923c', line: '#34d399', grid: 'rgba(255,255,255,0.05)', tick: '#4a6a85' }
const STACK = { excellent: '#059669', good: '#1d4ed8', fair: '#d97706', poor: '#dc2626' }

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

function DrillToggle({ value, onChange }) {
  return (
    <div className="drill-toggle">
      {['FY', 'Quarter', 'Week'].map(o => (
        <button key={o} onClick={() => onChange(o)} className={`drill-btn${value === o ? ' active' : ''}`}>{o}</button>
      ))}
    </div>
  )
}

function Visual({ title, children, controls }) {
  return (
    <div className="chart-panel flex-1 min-w-0 flex flex-col gap-2">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#e6f1ff', lineHeight: 1.3 }}>{title}</p>
        {controls}
      </div>
      {children}
    </div>
  )
}

function PlanSelect({ value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <label style={{ fontSize: 9, color: '#3d607a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Plan</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="select-dark">
        {PLANS.map(p => <option key={p}>{p}</option>)}
      </select>
    </div>
  )
}

function Visual1({ selectedPlan, onPlanChange }) {
  const [drill, setDrill] = useState('FY')
  const data = drill === 'FY' ? ACTUAL_VS_PLAN_BY_FY : drill === 'Quarter' ? ACTUAL_VS_PLAN_BY_QTR : ACTUAL_VS_PLAN_BY_WEEK
  return (
    <Visual title="Actual vs Plan — Adherence %" controls={<PlanSelect value={selectedPlan} onChange={onPlanChange} />}>
      <DrillToggle value={drill} onChange={setDrill} />
      <ResponsiveContainer width="100%" height={210}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="period" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <YAxis yAxisId="r" orientation="right" domain={[60,110]} tick={{ fill: C.line, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => `${v}%`} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <ReferenceLine yAxisId="r" y={100} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 3" />
          <Bar yAxisId="l" dataKey="actual" name="Actuals" fill={C.actual} opacity={0.8} radius={[3,3,0,0]} maxBarSize={40} />
          <Bar yAxisId="l" dataKey="plan"   name="Plan"    fill={C.plan}   opacity={0.8} radius={[3,3,0,0]} maxBarSize={40} />
          <Line yAxisId="r" type="monotone" dataKey="adherence" name="Adherence %"
            stroke={C.line} strokeWidth={2} dot={{ r: 3, fill: C.line, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

function Visual2({ selectedPlan, onPlanChange }) {
  return (
    <Visual title="Adherence Distribution by Fiscal Year" controls={<PlanSelect value={selectedPlan} onChange={onPlanChange} />}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 2 }}>
        {Object.entries(STACK).map(([k, c]) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#7fa8cc' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />
            {k === 'excellent' ? '≥90%' : k === 'good' ? '80–90%' : k === 'fair' ? '70–80%' : '<70%'}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={195}>
        <BarChart data={STACKED_ADHERENCE} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} />
          <XAxis dataKey="fy" tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.tick, fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => `${v}%`} domain={[0,100]} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Bar dataKey="excellent" name="Excellent ≥90%" stackId="a" fill={STACK.excellent} />
          <Bar dataKey="good"      name="Good 80-90%"    stackId="a" fill={STACK.good} />
          <Bar dataKey="fair"      name="Fair 70-80%"    stackId="a" fill={STACK.fair} />
          <Bar dataKey="poor"      name="Poor <70%"      stackId="a" fill={STACK.poor} radius={[3,3,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </Visual>
  )
}

function Visual3() {
  const sorted = [...ACTUAL_VS_PLAN_BY_CQN].sort((a, b) => a.variance - b.variance)
  return (
    <Visual title="CQN Highest Variance">
      <div style={{ height: 8 }} />
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={sorted} layout="vertical" margin={{ top: 0, right: 32, left: 60, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.grid} horizontal={false} />
          <XAxis type="number" tick={{ fill: C.tick, fontSize: 9 }} axisLine={false} tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <YAxis type="category" dataKey="cqn" tick={{ fill: C.tick, fontSize: 9 }} width={60} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(56,189,248,0.04)' }} />
          <Legend wrapperStyle={{ fontSize: 10, color: C.tick, paddingTop: 4 }} />
          <Bar dataKey="actual" name="Actuals" radius={[0,3,3,0]} maxBarSize={13}>
            {sorted.map((e, i) => <Cell key={i} fill={e.variance < -5 ? '#f87171' : C.actual} opacity={0.85} />)}
          </Bar>
          <Bar dataKey="plan" name="Plan" fill={C.plan} opacity={0.65} radius={[0,3,3,0]} maxBarSize={13} />
        </ComposedChart>
      </ResponsiveContainer>
    </Visual>
  )
}

export default function Layer2ActualVsPlan() {
  const [open, setOpen] = useState(true)
  const [plan, setPlan] = useState('Jan Plan')

  return (
    <div style={{ background: '#0c1929', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
      <div className="layer-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, color: '#070f1a', background: '#34d399',
            borderRadius: 4, padding: '2px 7px', letterSpacing: '0.04em',
          }}>02</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#e6f1ff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Actual vs Plan
          </span>
          <span style={{ fontSize: 10, color: '#3d607a' }}>— adherence tracking</span>
        </div>
        <span style={{ fontSize: 11, color: '#34d399', transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▲</span>
      </div>
      {open && (
        <div style={{ padding: 12, display: 'flex', gap: 10 }}>
          <Visual1 selectedPlan={plan} onPlanChange={setPlan} />
          <Visual2 selectedPlan={plan} onPlanChange={setPlan} />
          <Visual3 />
        </div>
      )}
    </div>
  )
}
