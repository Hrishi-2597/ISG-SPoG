import React, { useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import {
  PLAN_NAMES, PLAN_VS_PLAN_BY_FY, PLAN_VS_PLAN_BY_QTR,
  PLAN_VS_PLAN_BY_WEEK, PLAN_VS_PLAN_BY_REGION, PLAN_VS_PLAN_BY_CQN,
  REGIONS,
} from '../data/mockData'

const PLANS = PLAN_NAMES.filter(p => p !== 'Actual')
const COLORS = { plan1: '#4fc3f7', plan2: '#ff8f00', variance: '#ef5350' }

function PlanDropdowns({ planA, planB, onChange }) {
  return (
    <div className="flex gap-2 items-center">
      <div className="flex flex-col gap-0.5">
        <label className="text-[9px] text-blue-300 uppercase">Plan A</label>
        <select value={planA} onChange={e => onChange('planA', e.target.value)}
          className="bg-navy-600 text-white text-xs border border-navy-500 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400">
          {PLANS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-0.5">
        <label className="text-[9px] text-blue-300 uppercase">Plan B</label>
        <select value={planB} onChange={e => onChange('planB', e.target.value)}
          className="bg-navy-600 text-white text-xs border border-navy-500 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400">
          {PLANS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
    </div>
  )
}

function DrillToggle({ value, onChange }) {
  const opts = ['FY', 'Quarter', 'Week']
  return (
    <div className="flex rounded overflow-hidden border border-navy-500 text-xs">
      {opts.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`px-2 py-1 transition-colors ${value === o ? 'bg-blue-600 text-white' : 'bg-navy-700 text-blue-300 hover:bg-navy-600'}`}>
          {o}
        </button>
      ))}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-800 border border-navy-500 rounded p-2 text-xs shadow-xl">
      <p className="font-bold text-blue-300 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value?.toLocaleString()}{p.name?.includes('%') ? '%' : ''}
        </p>
      ))}
    </div>
  )
}

function Visual1({ planA, planB, onPlanChange }) {
  const [drill, setDrill] = useState('FY')
  const data = drill === 'FY' ? PLAN_VS_PLAN_BY_FY
              : drill === 'Quarter' ? PLAN_VS_PLAN_BY_QTR
              : PLAN_VS_PLAN_BY_WEEK

  return (
    <div className="bg-navy-800 rounded-lg p-3 flex flex-col gap-2 flex-1">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-white">Plan Comparison with Variance %</p>
        <PlanDropdowns planA={planA} planB={planB} onChange={onPlanChange} />
      </div>
      <DrillToggle value={drill} onChange={setDrill} />
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3f6e" />
          <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#ef5350', fontSize: 10 }}
            tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
          <ReferenceLine yAxisId="right" y={0} stroke="#555" />
          <Bar yAxisId="left" dataKey="plan1" name={planA} fill={COLORS.plan1} opacity={0.85} radius={[2,2,0,0]} />
          <Bar yAxisId="left" dataKey="plan2" name={planB} fill={COLORS.plan2} opacity={0.85} radius={[2,2,0,0]} />
          <Line yAxisId="right" type="monotone" dataKey="variance" name="Variance %" stroke={COLORS.variance}
            strokeWidth={2} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function Visual2({ planA, planB, onPlanChange }) {
  const [viewMode, setViewMode] = useState('Region')
  const [drill, setDrill] = useState('FY')
  const data = PLAN_VS_PLAN_BY_REGION

  return (
    <div className="bg-navy-800 rounded-lg p-3 flex flex-col gap-2 flex-1">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-white">Region wise Plan Comparison with Variance %</p>
        <div className="flex flex-col gap-1 items-end">
          <PlanDropdowns planA={planA} planB={planB} onChange={onPlanChange} />
          <div className="flex items-center gap-1 text-[10px] text-blue-300">
            <span>Region</span>
            <button onClick={() => setViewMode(v => v === 'Region' ? 'Country' : 'Region')}
              className={`relative inline-flex h-4 w-8 rounded-full transition-colors ${viewMode === 'Country' ? 'bg-blue-500' : 'bg-navy-600'}`}>
              <span className={`inline-block h-3 w-3 m-0.5 rounded-full bg-white transition-transform ${viewMode === 'Country' ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
            <span>Country</span>
          </div>
        </div>
      </div>
      <DrillToggle value={drill} onChange={setDrill} />
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3f6e" />
          <XAxis dataKey="region" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#ef5350', fontSize: 10 }}
            tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
          <ReferenceLine yAxisId="right" y={0} stroke="#555" />
          <Bar yAxisId="left" dataKey="plan1" name={planA} fill={COLORS.plan1} opacity={0.85} radius={[2,2,0,0]} />
          <Bar yAxisId="left" dataKey="plan2" name={planB} fill={COLORS.plan2} opacity={0.85} radius={[2,2,0,0]} />
          <Line yAxisId="right" type="monotone" dataKey="variance" name="Variance %" stroke={COLORS.variance}
            strokeWidth={2} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function Visual3({ planA, planB, onPlanChange }) {
  const [drill, setDrill] = useState('FY')

  return (
    <div className="bg-navy-800 rounded-lg p-3 flex flex-col gap-2 flex-1">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-white">CQN's with Highest Variance %</p>
        <PlanDropdowns planA={planA} planB={planB} onChange={onPlanChange} />
      </div>
      <DrillToggle value={drill} onChange={setDrill} />
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={PLAN_VS_PLAN_BY_CQN} layout="vertical"
          margin={{ top: 5, right: 30, left: 55, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3f6e" />
          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 9 }}
            tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
          <YAxis type="category" dataKey="cqn" tick={{ fill: '#94a3b8', fontSize: 9 }} width={55} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
          <Bar dataKey="plan1" name={planA} fill={COLORS.plan1} opacity={0.85} radius={[0,2,2,0]} />
          <Bar dataKey="plan2" name={planB} fill={COLORS.plan2} opacity={0.85} radius={[0,2,2,0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function Layer1PlanOverPlan() {
  const [plans, setPlans] = useState({ planA: 'Dec Plan', planB: 'Jan Plan' })
  const [open, setOpen] = useState(true)

  const handlePlanChange = (key, val) => setPlans(p => ({ ...p, [key]: val }))

  return (
    <div className="bg-navy-900 rounded-lg overflow-hidden border border-navy-700">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-4 py-2 bg-navy-700 hover:bg-navy-600 transition-colors">
        <div>
          <span className="text-xs font-bold text-white uppercase tracking-wide">Layer 1</span>
          <span className="text-xs text-blue-300 ml-2">— Plan over Plan</span>
        </div>
        <span className="text-blue-300 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="p-3 flex gap-3">
          <Visual1 planA={plans.planA} planB={plans.planB} onPlanChange={handlePlanChange} />
          <Visual2 planA={plans.planA} planB={plans.planB} onPlanChange={handlePlanChange} />
          <Visual3 planA={plans.planA} planB={plans.planB} onPlanChange={handlePlanChange} />
        </div>
      )}
    </div>
  )
}
