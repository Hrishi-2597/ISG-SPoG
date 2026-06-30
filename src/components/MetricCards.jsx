import React, { useState } from 'react'
import { CARD_DATA, ACTIVE_QUEUES } from '../data/mockData'

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
      {/* Card header band */}
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

      {/* Card body */}
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

      {/* Active indicator bottom line */}
      {active && (
        <div style={{
          height: 2, background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)',
          marginTop: 'auto',
        }} />
      )}
    </button>
  )
}

function DrillDownPanel({ type, onClose }) {
  return (
    <div className="animate-fade-in" style={{
      marginTop: 10,
      background: 'rgba(12,25,41,0.95)',
      border: '1px solid rgba(56,189,248,0.2)',
      borderRadius: 8,
      padding: '12px 14px',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, background: '#38bdf8', borderRadius: 2 }} />
          <h3 style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>
            {type === 'queues'   && 'Active Queue List'}
            {type === 'volume'   && 'Call Volume — Offered & Handled'}
            {type === 'dbOsp'   && 'DB / OSP Volume Split'}
            {type === 'forecast' && 'Forecast Accuracy by Queue'}
            {type === 'variance' && 'CQNs within ±10% Variance'}
          </h3>
        </div>
        <button onClick={onClose} style={{ color: '#3d607a', fontSize: 16, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ overflowX: 'auto', maxHeight: 220, overflowY: 'auto' }}>
        <table className="w-full" style={{ fontSize: 11, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <th style={{ textAlign: 'left', padding: '4px 12px 4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Queue</th>
              <th style={{ textAlign: 'left', padding: '4px 12px 4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Region</th>
              {type === 'volume' && <>
                <th style={{ textAlign: 'right', padding: '4px 12px 4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Offered</th>
                <th style={{ textAlign: 'right', padding: '4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Handled</th>
              </>}
              {type === 'dbOsp' && <>
                <th style={{ textAlign: 'right', padding: '4px 12px 4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</th>
                <th style={{ textAlign: 'right', padding: '4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Volume</th>
              </>}
              {type === 'forecast' && <th style={{ textAlign: 'right', padding: '4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Accuracy</th>}
              {type === 'variance' && <th style={{ textAlign: 'right', padding: '4px 0', color: '#3d607a', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Variance</th>}
            </tr>
          </thead>
          <tbody>
            {ACTIVE_QUEUES.map((q, i) => {
              const variance = +(q.accuracy - 87).toFixed(1)
              return (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '5px 12px 5px 0', fontFamily: 'monospace', fontSize: 10, color: '#7fa8cc' }}>{q.name}</td>
                  <td style={{ padding: '5px 12px 5px 0', color: '#3d607a' }}>{q.region}</td>
                  {type === 'volume' && <>
                    <td className="num" style={{ padding: '5px 12px 5px 0', textAlign: 'right', color: '#34d399' }}>{fmt(q.offered)}</td>
                    <td className="num" style={{ padding: '5px 0', textAlign: 'right', color: '#38bdf8' }}>{fmt(q.handled)}</td>
                  </>}
                  {type === 'dbOsp' && <>
                    <td style={{ padding: '5px 12px 5px 0', textAlign: 'right', color: '#7fa8cc' }}>{i % 3 === 0 ? 'OSP' : 'DB'}</td>
                    <td className="num" style={{ padding: '5px 0', textAlign: 'right', color: '#e6f1ff' }}>{fmt(q.offered)}</td>
                  </>}
                  {type === 'forecast' && (
                    <td className="num" style={{ padding: '5px 0', textAlign: 'right', fontWeight: 600,
                      color: q.accuracy >= 90 ? '#34d399' : q.accuracy >= 80 ? '#fbbf24' : '#f87171' }}>
                      {q.accuracy}%
                    </td>
                  )}
                  {type === 'variance' && (
                    <td className="num" style={{ padding: '5px 0', textAlign: 'right', fontWeight: 600,
                      color: Math.abs(variance) <= 10 ? '#34d399' : '#f87171' }}>
                      {variance > 0 ? '+' : ''}{variance}%
                    </td>
                  )}
                </tr>
              )
            })}
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
          trend={d.cqnVariance.pct >= 70}
          onClick={() => toggle('variance')} active={active === 'variance'}
        />
      </div>

      {active && <DrillDownPanel type={active} onClose={() => setActive(null)} />}
    </div>
  )
}
