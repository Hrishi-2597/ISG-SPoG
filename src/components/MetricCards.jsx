import React, { useState } from 'react'
import { CARD_DATA, ACTIVE_QUEUES } from '../data/mockData'

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n
}

function Card({ title, subtitle, value, sub, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-0 text-left rounded overflow-hidden border transition-all duration-150 ${
        active ? 'border-blue-400 shadow-lg shadow-blue-900/50' : 'border-navy-600 hover:border-blue-500'
      }`}
    >
      <div className="bg-navy-500 px-3 py-1.5">
        <p className="text-[11px] font-bold text-white leading-tight">{title}</p>
        {subtitle && <p className="text-[10px] text-blue-200">{subtitle}</p>}
      </div>
      <div className="bg-navy-700 px-3 py-2">
        <p className="text-lg font-bold text-white">{value}</p>
        {sub && <p className="text-[10px] text-blue-300 mt-0.5">{sub}</p>}
      </div>
    </button>
  )
}

function DrillDownPanel({ type, onClose }) {
  const d = CARD_DATA
  return (
    <div className="mt-2 bg-navy-800 border border-navy-600 rounded-lg p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-blue-300">
          {type === 'queues'    && 'List of Active Queues'}
          {type === 'volume'    && 'Call Volume – Offered & Handled by Queue'}
          {type === 'dbOsp'    && 'DB / OSP Offered Volume Split'}
          {type === 'forecast' && 'Forecast Accuracy by Queue'}
          {type === 'variance' && 'CQNs within ±10% Variance'}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-lg leading-none">×</button>
      </div>

      <div className="overflow-auto max-h-52">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-blue-300 border-b border-navy-600">
              <th className="text-left py-1 pr-3">Queue Name</th>
              <th className="text-left py-1 pr-3">Region</th>
              {type === 'volume'    && <><th className="text-right py-1 pr-3">Offered</th><th className="text-right py-1">Handled</th></>}
              {type === 'dbOsp'    && <><th className="text-right py-1 pr-3">Type</th><th className="text-right py-1">Volume</th></>}
              {type === 'forecast' && <th className="text-right py-1">Accuracy %</th>}
              {type === 'variance' && <th className="text-right py-1">Variance %</th>}
            </tr>
          </thead>
          <tbody>
            {ACTIVE_QUEUES.map((q, i) => (
              <tr key={i} className="border-b border-navy-700 hover:bg-navy-700/50">
                <td className="py-1 pr-3 font-mono text-blue-100">{q.name}</td>
                <td className="py-1 pr-3 text-gray-300">{q.region}</td>
                {type === 'volume' && <><td className="py-1 pr-3 text-right text-green-300">{fmt(q.offered)}</td><td className="py-1 text-right text-blue-300">{fmt(q.handled)}</td></>}
                {type === 'dbOsp' && <><td className="py-1 pr-3 text-right text-blue-300">{i % 3 === 0 ? 'OSP' : 'DB'}</td><td className="py-1 text-right text-gray-200">{fmt(q.offered)}</td></>}
                {type === 'forecast' && <td className={`py-1 text-right font-semibold ${q.accuracy >= 90 ? 'text-green-400' : q.accuracy >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>{q.accuracy}%</td>}
                {type === 'variance' && <td className={`py-1 text-right font-semibold ${Math.abs(q.accuracy - 87) < 10 ? 'text-green-400' : 'text-red-400'}`}>{(q.accuracy - 87).toFixed(1)}%</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function MetricCards() {
  const [active, setActive] = useState(null)
  const d = CARD_DATA

  const toggle = key => setActive(prev => prev === key ? null : key)

  return (
    <div className="px-4 py-3 bg-navy-900 border-b border-navy-700">
      <div className="flex gap-2">
        <div className="flex items-start pt-1 shrink-0">
          <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest writing-vertical">Cards</span>
        </div>
        <div className="flex-1">
          <div className="flex gap-2">
            <Card
              title="Total Queues" subtitle="Active and Inactive"
              value={`${d.totalQueues.active} / ${d.totalQueues.active + d.totalQueues.inactive}`}
              sub={`${d.totalQueues.inactive} inactive`}
              onClick={() => toggle('queues')} active={active === 'queues'}
            />
            <Card
              title="Call Volume" subtitle="Offered & Handled"
              value={fmt(d.callVolume.offered)}
              sub={`Handled: ${fmt(d.callVolume.handled)} (${d.callVolume.handlePct}%)`}
              onClick={() => toggle('volume')} active={active === 'volume'}
            />
            <Card
              title="DB/OSP Offered" subtitle="Volume Split"
              value={`DB ${d.dbOspSplit.db}% / OSP ${d.dbOspSplit.osp}%`}
              sub={`DB: ${fmt(d.dbOspSplit.dbVol)} | OSP: ${fmt(d.dbOspSplit.ospVol)}`}
              onClick={() => toggle('dbOsp')} active={active === 'dbOsp'}
            />
            <Card
              title="Forecast Accuracy" subtitle=""
              value={`${d.forecastAccuracy.value}%`}
              sub={`Target: ${d.forecastAccuracy.target}% · ${d.forecastAccuracy.value >= d.forecastAccuracy.target ? '✓ On track' : '⚠ Below target'}`}
              onClick={() => toggle('forecast')} active={active === 'forecast'}
            />
            <Card
              title="% of CQN within" subtitle="±10 Variance"
              value={`${d.cqnVariance.pct}%`}
              sub={`${d.cqnVariance.withinRange} of ${d.cqnVariance.total} queues`}
              onClick={() => toggle('variance')} active={active === 'variance'}
            />
          </div>

          {active && (
            <DrillDownPanel type={active} onClose={() => setActive(null)} />
          )}
        </div>
      </div>
    </div>
  )
}
