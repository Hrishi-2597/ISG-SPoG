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
const STACK_COLORS = { excellent: '#2e7d32', good: '#1565c0', fair: '#e65100', poor: '#b71c1c' }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-800 border border-navy-500 rounded p-2 text-xs shadow-xl">
      <p className="font-bold text-blue-300 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value > 100
            ? p.value.toLocaleString()
            : `${p.value}%`}
        </p>
      ))}
    </div>
  )
}

function DrillToggle({ value, onChange }) {
  return (
    <div className="flex rounded overflow-hidden border border-navy-500 text-xs">
      {['FY', 'Quarter', 'Week'].map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`px-2 py-1 transition-colors ${value === o ? 'bg-blue-600 text-white' : 'bg-navy-700 text-blue-300 hover:bg-navy-600'}`}>
          {o}
        </button>
      ))}
    </div>
  )
}

function Visual1({ selectedPlan, onPlanChange }) {
  const [drill, setDrill] = useState('FY')
  const data = drill === 'FY' ? ACTUAL_VS_PLAN_BY_FY
              : drill === 'Quarter' ? ACTUAL_VS_PLAN_BY_QTR
              : ACTUAL_VS_PLAN_BY_WEEK

  return (
    <div className="bg-navy-800 rounded-lg p-3 flex flex-col gap-2 flex-1">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-white">Actual vs Plan with Adherence %</p>
        <div className="flex flex-col gap-0.5">
          <label className="text-[9px] text-blue-300 uppercase">Plan</label>
          <select value={selectedPlan} onChange={e => onPlanChange(e.target.value)}
            className="bg-navy-600 text-white text-xs border border-navy-500 rounded px-2 py-1 focus:outline-none">
            {PLANS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <DrillToggle value={drill} onChange={setDrill} />
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3f6e" />
          <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#4fc3f7', fontSize: 10 }}
            domain={[60, 110]} tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
          <ReferenceLine yAxisId="right" y={100} stroke="#555" strokeDasharray="4 2" />
          <Bar yAxisId="left" dataKey="actual" name="Actuals" fill="#4fc3f7" opacity={0.85} radius={[2,2,0,0]} />
          <Bar yAxisId="left" dataKey="plan"   name="Plan"    fill="#ff8f00" opacity={0.85} radius={[2,2,0,0]} />
          <Line yAxisId="right" type="monotone" dataKey="adherence" name="Adherence %"
            stroke="#a5d6a7" strokeWidth={2} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function Visual2({ selectedPlan, onPlanChange }) {
  return (
    <div className="bg-navy-800 rounded-lg p-3 flex flex-col gap-2 flex-1">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-white">Region Wise Plan Comparison with Variance %</p>
        <div className="flex flex-col gap-0.5">
          <label className="text-[9px] text-blue-300 uppercase">Plan</label>
          <select value={selectedPlan} onChange={e => onPlanChange(e.target.value)}
            className="bg-navy-600 text-white text-xs border border-navy-500 rounded px-2 py-1 focus:outline-none">
            {PLANS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-2 text-[9px]">
          {Object.entries(STACK_COLORS).map(([k, c]) => (
            <span key={k} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: c }} />
              <span className="text-gray-300 capitalize">{k} {k==='excellent'?'≥90%':k==='good'?'80-90%':k==='fair'?'70-80%':'<70%'}</span>
            </span>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={185}>
        <BarChart data={STACKED_ADHERENCE} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3f6e" />
          <XAxis dataKey="fy" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="excellent" name="Excellent ≥90%" stackId="a" fill={STACK_COLORS.excellent} />
          <Bar dataKey="good"      name="Good 80-90%"    stackId="a" fill={STACK_COLORS.good} />
          <Bar dataKey="fair"      name="Fair 70-80%"    stackId="a" fill={STACK_COLORS.fair} />
          <Bar dataKey="poor"      name="Poor <70%"      stackId="a" fill={STACK_COLORS.poor} radius={[2,2,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function Visual3() {
  const sorted = [...ACTUAL_VS_PLAN_BY_CQN].sort((a, b) => a.variance - b.variance)
  return (
    <div className="bg-navy-800 rounded-lg p-3 flex flex-col gap-2 flex-1">
      <p className="text-xs font-bold text-white">CQN's with Highest Variance %</p>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={sorted} layout="vertical"
          margin={{ top: 5, right: 30, left: 58, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3f6e" />
          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 9 }}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <YAxis type="category" dataKey="cqn" tick={{ fill: '#94a3b8', fontSize: 9 }} width={58} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
          <Bar dataKey="actual" name="Actuals" fill="#4fc3f7" opacity={0.85} radius={[0,2,2,0]}>
            {sorted.map((e, i) => <Cell key={i} fill={e.variance < -5 ? '#ef5350' : '#4fc3f7'} />)}
          </Bar>
          <Bar dataKey="plan" name="Plan" fill="#ff8f00" opacity={0.7} radius={[0,2,2,0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function Layer2ActualVsPlan() {
  const [open, setOpen] = useState(true)
  const [plan, setPlan] = useState('Jan Plan')

  return (
    <div className="bg-navy-900 rounded-lg overflow-hidden border border-navy-700">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-4 py-2 bg-navy-700 hover:bg-navy-600 transition-colors">
        <div>
          <span className="text-xs font-bold text-white uppercase tracking-wide">Layer 2</span>
          <span className="text-xs text-blue-300 ml-2">— Actual vs Plan</span>
        </div>
        <span className="text-blue-300 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="p-3 flex gap-3">
          <Visual1 selectedPlan={plan} onPlanChange={setPlan} />
          <Visual2 selectedPlan={plan} onPlanChange={setPlan} />
          <Visual3 />
        </div>
      )}
    </div>
  )
}
