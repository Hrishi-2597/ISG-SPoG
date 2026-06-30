import React, { useState } from 'react'
import {
  ComposableMap, Geographies, Geography, Marker,
} from 'react-simple-maps'
import { GEO_REGION_DATA, GEO_COUNTRY_DATA } from '../data/mockData'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

function accuracyColor(val) {
  if (val >= 90) return '#2e7d32'
  if (val >= 80) return '#1976d2'
  if (val >= 70) return '#e65100'
  return '#b71c1c'
}

function Legend() {
  const items = [
    { label: '≥ 90% – Excellent', color: '#2e7d32' },
    { label: '80–90% – Good',     color: '#1976d2' },
    { label: '70–80% – Fair',     color: '#e65100' },
    { label: '< 70% – Critical',  color: '#b71c1c' },
  ]
  return (
    <div className="flex gap-3 flex-wrap">
      {items.map(({ label, color }) => (
        <span key={label} className="flex items-center gap-1 text-[10px] text-gray-300">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  )
}

function RegionTooltip({ hovered }) {
  if (!hovered) return null
  return (
    <div className="absolute top-2 right-2 bg-navy-800 border border-navy-500 rounded p-2 text-xs shadow-xl z-10">
      <p className="font-bold text-blue-300">{hovered.name}</p>
      <p className="text-white mt-0.5">Accuracy: <span style={{ color: accuracyColor(hovered.accuracy) }}
        className="font-bold">{hovered.accuracy}%</span></p>
    </div>
  )
}

export default function Layer3GeoMap() {
  const [open, setOpen] = useState(true)
  const [viewMode, setViewMode] = useState('Region')
  const [hovered, setHovered] = useState(null)
  const markers = viewMode === 'Region' ? GEO_REGION_DATA : GEO_COUNTRY_DATA

  return (
    <div className="bg-navy-900 rounded-lg overflow-hidden border border-navy-700">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-4 py-2 bg-navy-700 hover:bg-navy-600 transition-colors">
        <div>
          <span className="text-xs font-bold text-white uppercase tracking-wide">Layer 3</span>
          <span className="text-xs text-blue-300 ml-2">— Geo Map</span>
        </div>
        <span className="text-blue-300 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm font-bold text-white">Global Region Performance Overview</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Forecast Adherence % by {viewMode}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-300">Country</span>
              <button onClick={() => setViewMode(v => v === 'Region' ? 'Country' : 'Region')}
                className={`relative inline-flex h-5 w-10 rounded-full transition-colors ${viewMode === 'Country' ? 'bg-blue-500' : 'bg-navy-600'}`}>
                <span className={`inline-block h-3.5 w-3.5 m-0.75 rounded-full bg-white transition-transform mt-[3px] ml-[3px] ${viewMode === 'Country' ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className="text-xs text-blue-300">Region</span>
            </div>
          </div>

          <Legend />

          <div className="relative bg-[#0d2137] rounded-lg mt-2 overflow-hidden" style={{ height: 380 }}>
            <RegionTooltip hovered={hovered} />
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 140, center: [10, 20] }}
              style={{ width: '100%', height: '100%' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: { fill: '#1a3456', stroke: '#0d2137', strokeWidth: 0.5, outline: 'none' },
                        hover:   { fill: '#2a5298', stroke: '#0d2137', strokeWidth: 0.5, outline: 'none' },
                        pressed: { fill: '#2a5298', outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {markers.map(m => (
                <Marker
                  key={m.region || m.country}
                  coordinates={[m.lng, m.lat]}
                  onMouseEnter={() => setHovered({ name: m.region || m.country, accuracy: m.accuracy })}
                  onMouseLeave={() => setHovered(null)}
                >
                  <circle
                    r={viewMode === 'Region' ? 18 : 10}
                    fill={accuracyColor(m.accuracy)}
                    fillOpacity={0.85}
                    stroke="#fff"
                    strokeWidth={1}
                    style={{ cursor: 'pointer' }}
                  />
                  <text
                    textAnchor="middle"
                    y={viewMode === 'Region' ? 4 : 3}
                    style={{ fontSize: viewMode === 'Region' ? 8 : 6, fill: '#fff', fontWeight: 'bold', pointerEvents: 'none' }}
                  >
                    {m.accuracy}%
                  </text>
                  {viewMode === 'Region' && (
                    <text textAnchor="middle" y={-22}
                      style={{ fontSize: 8, fill: '#4fc3f7', fontWeight: 600, pointerEvents: 'none' }}>
                      {m.label}
                    </text>
                  )}
                </Marker>
              ))}
            </ComposableMap>

            {/* Static accuracy scale */}
            <div className="absolute bottom-2 left-2 text-[9px] text-gray-400 flex items-center gap-1">
              <span>100%</span>
              <div className="w-20 h-2 rounded" style={{ background: 'linear-gradient(to left, #b71c1c, #e65100, #1976d2, #2e7d32)' }} />
              <span>0%</span>
              <span className="ml-1">Accuracy</span>
            </div>
          </div>

          {/* Summary table */}
          <div className="mt-3 overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-blue-300 border-b border-navy-600">
                  <th className="text-left py-1 pr-4">{viewMode}</th>
                  <th className="text-right py-1 pr-4">Accuracy %</th>
                  <th className="text-right py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {markers.map(m => (
                  <tr key={m.region || m.country} className="border-b border-navy-700/50 hover:bg-navy-700/30">
                    <td className="py-1 pr-4 text-white">{m.region || m.country}</td>
                    <td className="py-1 pr-4 text-right font-bold" style={{ color: accuracyColor(m.accuracy) }}>
                      {m.accuracy}%
                    </td>
                    <td className="py-1 text-right">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                        style={{ background: accuracyColor(m.accuracy) + '33', color: accuracyColor(m.accuracy) }}>
                        {m.accuracy >= 90 ? 'Excellent' : m.accuracy >= 80 ? 'Good' : m.accuracy >= 70 ? 'Fair' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
