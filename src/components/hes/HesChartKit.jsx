import React from 'react'

// Same color-role convention established on the Forecasting page: blue/orange compare
// two neutral quantities, violet is a neutral trend line, green/red mean ahead/behind.
export const C = {
  metric1: '#38bdf8', metric2: '#fb923c', trend: '#a78bfa',
  ahead: '#34d399', behind: '#f87171',
  grid: 'rgba(255,255,255,0.05)', tick: '#4a6a85',
}

export function Visual({ title, subtitle, children, controls, cornerControls }) {
  return (
    <div className="chart-panel flex-1 min-w-0 flex flex-col gap-2" style={{ position: 'relative' }}>
      {cornerControls && <div style={{ position: 'absolute', top: 10, right: 12, zIndex: 2 }}>{cornerControls}</div>}
      <p style={{ fontSize: 12, fontWeight: 700, color: '#e6f1ff', textAlign: 'center' }}>{title}</p>
      {subtitle && <p style={{ fontSize: 9.5, color: '#5a8bb0', textAlign: 'center' }}>{subtitle}</p>}
      {controls && <div style={{ display: 'flex', justifyContent: 'center' }}>{controls}</div>}
      {children}
    </div>
  )
}

// Popup modal: backdrop click or the ✕ closes it. Filters live one level up (in
// HesForecastingPage), so opening/closing this never touches filter state — the
// dashboard underneath is exactly as the user left it.
export function Modal({ title, onClose, children, width = 640 }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(4,10,18,0.72)', backdropFilter: 'blur(3px)', padding: 20,
      }}
    >
      <div
        className="animate-fade-in"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0c1929', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 12,
          padding: '16px 18px 14px', width: '100%', maxWidth: width, maxHeight: '85vh', overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 0 30px rgba(56,189,248,0.08)',
        }}
      >
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8', textAlign: 'center' }}>{title}</h3>
          <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', right: 0, top: -3, color: '#5a8bb0', fontSize: 18, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function PillButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 10, fontWeight: 600, color: '#38bdf8', background: 'rgba(56,189,248,0.08)',
      border: '1px solid rgba(56,189,248,0.25)', borderRadius: 14, padding: '3px 11px', cursor: 'pointer',
    }}>
      {children}
    </button>
  )
}

export const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', marginBottom: 5 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 11, color: p.color, marginBottom: 2 }}>
          {p.name}: <span style={{ fontWeight: 600 }}>
            {typeof p.value === 'number' && p.value > 99 ? p.value.toLocaleString() : p.value}
          </span>
        </p>
      ))}
    </div>
  )
}

export function truncate(str, n) {
  if (str.length <= n) return str
  const cut = str.slice(0, n)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > n * 0.55 ? cut.slice(0, lastSpace) : cut) + '…'
}

export function CategoryTick({ x, y, payload }) {
  return (
    <text x={x} y={y} dy={3} textAnchor="end" fontSize={9.5} fill="#cfe8fb">{truncate(String(payload.value), 22)}</text>
  )
}

export function PlanDropdowns({ planA, planB, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      {[['planA', planA, 'A'], ['planB', planB, 'B']].map(([key, val, lbl]) => (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: 9, color: '#3d607a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Plan {lbl}
          </label>
          <select value={val} onChange={e => onChange(key, e.target.value)} className="select-dark">
            {options.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      ))}
    </div>
  )
}

export function PlanSelect({ value, onChange, options, label = 'Plan' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <label style={{ fontSize: 9, color: '#3d607a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="select-dark">
        {options.map(p => <option key={p}>{p}</option>)}
      </select>
    </div>
  )
}
