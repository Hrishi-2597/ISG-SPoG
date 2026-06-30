import React, { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { GEO_REGION_DATA, GEO_COUNTRY_DATA } from '../data/mockData'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

function acColor(v) {
  if (v >= 90) return '#059669'
  if (v >= 80) return '#2563eb'
  if (v >= 70) return '#d97706'
  return '#dc2626'
}
function acGlow(v) {
  if (v >= 90) return 'rgba(5,150,105,0.6)'
  if (v >= 80) return 'rgba(37,99,235,0.6)'
  if (v >= 70) return 'rgba(217,119,6,0.6)'
  return 'rgba(220,38,38,0.6)'
}

const LEGEND = [
  { label: '≥ 90% Excellent', color: '#059669' },
  { label: '80–90% Good',     color: '#2563eb' },
  { label: '70–80% Fair',     color: '#d97706' },
  { label: '< 70% Critical',  color: '#dc2626' },
]

export default function Layer3GeoMap() {
  const [open, setOpen]         = useState(true)
  const [viewMode, setViewMode] = useState('Region')
  const [hovered, setHovered]   = useState(null)
  const markers = viewMode === 'Region' ? GEO_REGION_DATA : GEO_COUNTRY_DATA

  return (
    <div style={{ background: '#0c1929', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
      <div className="layer-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, color: '#070f1a', background: '#fb923c',
            borderRadius: 4, padding: '2px 7px', letterSpacing: '0.04em',
          }}>03</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#e6f1ff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Geo Map
          </span>
          <span style={{ fontSize: 10, color: '#3d607a' }}>— global forecast adherence</span>
        </div>
        <span style={{ fontSize: 11, color: '#fb923c', transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▲</span>
      </div>

      {open && (
        <div style={{ padding: 14 }}>
          {/* Sub-header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#e6f1ff' }}>Global Region Performance Overview</p>
              <p style={{ fontSize: 10, color: '#3d607a', marginTop: 2 }}>
                Forecast adherence % · {viewMode} view
              </p>
            </div>
            {/* Region / Country toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 10 }}>
              <span style={{ color: viewMode === 'Country' ? '#38bdf8' : '#3d607a', fontWeight: 500 }}>Country</span>
              <button onClick={() => setViewMode(v => v === 'Region' ? 'Country' : 'Region')}
                style={{ position: 'relative', display: 'inline-flex', alignItems: 'center',
                  width: 36, height: 19, borderRadius: 10,
                  background: viewMode === 'Region' ? '#38bdf8' : '#1a3050',
                  border: 'none', cursor: 'pointer', transition: 'background 0.2s', padding: 0 }}>
                <span style={{ position: 'absolute', top: 3, left: viewMode === 'Region' ? 19 : 3,
                  width: 13, height: 13, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
              </button>
              <span style={{ color: viewMode === 'Region' ? '#38bdf8' : '#3d607a', fontWeight: 500 }}>Region</span>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 8, flexWrap: 'wrap' }}>
            {LEGEND.map(({ label, color }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#7fa8cc' }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: color, display: 'inline-block',
                  boxShadow: `0 0 6px ${color}80` }} />
                {label}
              </span>
            ))}
          </div>

          {/* Map container */}
          <div style={{ position: 'relative', background: '#070f1a', borderRadius: 8, overflow: 'hidden',
            height: 380, border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4)' }}>

            {/* Hovered tooltip */}
            {hovered && (
              <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                className="chart-tooltip">
                <p style={{ fontWeight: 700, color: '#38bdf8', fontSize: 11 }}>{hovered.name}</p>
                <p style={{ marginTop: 3, fontSize: 13, fontWeight: 700, color: acColor(hovered.accuracy) }}>
                  {hovered.accuracy}%
                  <span style={{ fontSize: 9, color: '#7fa8cc', fontWeight: 400, marginLeft: 5 }}>accuracy</span>
                </p>
              </div>
            )}

            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 140, center: [10, 20] }}
              style={{ width: '100%', height: '100%' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography key={geo.rsmKey} geography={geo}
                      style={{
                        default: { fill: '#0e1f35', stroke: '#070f1a', strokeWidth: 0.4, outline: 'none' },
                        hover:   { fill: '#1a3050', stroke: '#070f1a', strokeWidth: 0.4, outline: 'none' },
                        pressed: { fill: '#1a3050', outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {markers.map(m => {
                const name = m.region || m.country
                return (
                  <Marker key={name} coordinates={[m.lng, m.lat]}
                    onMouseEnter={() => setHovered({ name, accuracy: m.accuracy })}
                    onMouseLeave={() => setHovered(null)}>
                    <circle
                      r={viewMode === 'Region' ? 20 : 11}
                      fill={acColor(m.accuracy)}
                      fillOpacity={0.9}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth={1}
                      style={{ cursor: 'pointer', filter: `drop-shadow(0 0 6px ${acGlow(m.accuracy)})` }}
                    />
                    <text textAnchor="middle" y={viewMode === 'Region' ? 4 : 3.5}
                      style={{ fontSize: viewMode === 'Region' ? 8 : 6, fill: '#fff', fontWeight: 700, pointerEvents: 'none',
                        fontFamily: 'Space Grotesk, system-ui' }}>
                      {m.accuracy}%
                    </text>
                    {viewMode === 'Region' && (
                      <text textAnchor="middle" y={-25}
                        style={{ fontSize: 8, fill: '#38bdf8', fontWeight: 600, pointerEvents: 'none',
                          fontFamily: 'Space Grotesk, system-ui' }}>
                        {m.label}
                      </text>
                    )}
                  </Marker>
                )
              })}
            </ComposableMap>

            {/* Scale */}
            <div style={{ position: 'absolute', bottom: 8, left: 10, display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: '#3d607a' }}>
              <span>100%</span>
              <div style={{ width: 72, height: 5, borderRadius: 3,
                background: 'linear-gradient(to left, #dc2626, #d97706, #2563eb, #059669)' }} />
              <span>0%</span>
            </div>
          </div>

          {/* Summary table */}
          <div style={{ marginTop: 10, overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {[viewMode, 'Accuracy', 'Status'].map((h, i) => (
                    <th key={h} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '5px 10px 5px 0',
                      fontSize: 9, color: '#3d607a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {markers.map(m => {
                  const name = m.region || m.country
                  const col = acColor(m.accuracy)
                  const status = m.accuracy >= 90 ? 'Excellent' : m.accuracy >= 80 ? 'Good' : m.accuracy >= 70 ? 'Fair' : 'Critical'
                  const badgeCls = m.accuracy >= 90 ? 'badge-good' : m.accuracy >= 80 ? 'badge-good' : m.accuracy >= 70 ? 'badge-warn' : 'badge-bad'
                  return (
                    <tr key={name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '6px 10px 6px 0', color: '#e6f1ff', fontWeight: 500 }}>{name}</td>
                      <td className="num" style={{ padding: '6px 10px 6px 0', textAlign: 'right', fontWeight: 700, color: col }}>{m.accuracy}%</td>
                      <td style={{ padding: '6px 0', textAlign: 'right' }}>
                        <span className={`badge ${badgeCls}`}>{status}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
