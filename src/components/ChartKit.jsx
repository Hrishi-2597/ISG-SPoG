import React from 'react'

// Shared chart primitives used across every page (Forecasting, HES Forecasting, and
// both Capacity Plan pages) — one Visual wrapper / Tip / plan-picker implementation
// instead of near-duplicates per page. Originally lived in hes/HesChartKit.jsx;
// promoted here once a second page family (Capacity Plan) needed the exact same
// pieces — HesChartKit.jsx now re-exports everything from here so none of its
// existing imports had to change.

// Same color-role convention established on the Forecasting page: blue/orange compare
// two neutral quantities, violet is a neutral trend line, green/red mean ahead/behind.
export const C = {
  metric1: '#38bdf8', metric2: '#fb923c', trend: '#a78bfa',
  ahead: '#34d399', behind: '#f87171',
  grid: 'var(--chart-grid)', tick: '#4a6a85',
}

export function Visual({ title, subtitle, children, controls, cornerControls }) {
  return (
    <div className="chart-panel flex-1 min-w-0 flex flex-col gap-2" style={{ position: 'relative' }}>
      {cornerControls && <div style={{ position: 'absolute', top: 10, right: 12, zIndex: 2 }}>{cornerControls}</div>}
      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>{title}</p>
      {subtitle && <p style={{ fontSize: 9.5, color: 'var(--text-faint)', textAlign: 'center' }}>{subtitle}</p>}
      {controls && <div style={{ display: 'flex', justifyContent: 'center' }}>{controls}</div>}
      {children}
    </div>
  )
}

export function PillButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 10, fontWeight: 600, color: 'var(--accent)', background: 'rgba(56,189,248,0.08)',
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
      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', marginBottom: 5 }}>{label}</p>
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
    <text x={x} y={y} dy={3} textAnchor="end" fontSize={9.5} fill="var(--text-secondary)">{truncate(String(payload.value), 22)}</text>
  )
}

export function PlanDropdowns({ planA, planB, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      {[['planA', planA, 'A'], ['planB', planB, 'B']].map(([key, val, lbl]) => (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
      <label style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="select-dark">
        {options.map(p => <option key={p}>{p}</option>)}
      </select>
    </div>
  )
}

// 3-way segmented pill for Region/Country-style toggles (used by every geo map and
// several trend visuals) — knob-slide switch between exactly two named states.
export function BinaryToggle({ leftLabel, rightLabel, value, onChange }) {
  const isRight = value === rightLabel
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 10 }}>
      <span style={{ color: !isRight ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 500 }}>{leftLabel}</span>
      <button onClick={() => onChange(isRight ? leftLabel : rightLabel)}
        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center',
          width: 32, height: 17, borderRadius: 9,
          background: isRight ? 'var(--accent)' : 'var(--bg-inset)',
          border: 'none', cursor: 'pointer', transition: 'background 0.2s', padding: 0 }}>
        <span style={{ position: 'absolute', top: 2, left: isRight ? 17 : 2,
          width: 13, height: 13, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
      </button>
      <span style={{ color: isRight ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 500 }}>{rightLabel}</span>
    </div>
  )
}
