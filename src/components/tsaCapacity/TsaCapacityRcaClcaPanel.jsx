import React from 'react'

// Illustrative example content, written for this page's own metrics (staffing/
// attrition/Cases-per-FTE/Average Case Time/SLO) rather than reusing any other
// page's copy — same "own vocabulary, own content" convention as
// MsgCapacityRcaClcaPanel.jsx/TsaRcaClcaPanel.jsx. Not generated from real incident
// data; once RCA/CLCA workflows are connected to a real data source, this panel
// should read from that instead.
const RCA = [
  'Average Case Time has run above plan for two consecutive fiscal years, concentrated in a handful of LOBs rather than spread evenly — a small number of queues are driving most of the overage.',
  'Attrition in APJ sub-regions is outpacing the rest of the portfolio, correlated with the longest average backfill lead time — new hires aren\'t landing fast enough to offset departures there.',
  'SLO is below the FY27 target in 2 of 4 regions, both of which also show above-plan Average Case Time — slower case resolution appears to be the direct driver of the SLO miss, not staffing.',
  'Cases per FTE is trending above plan across most LOBs, suggesting the current headcount plan under-forecast case volume growth rather than an efficiency shortfall.',
]

const CLCA = [
  'Prioritize an Average Case Time review for the specific LOBs identified as top defaulters this quarter, ahead of any broader staffing-level change.',
  'Pull forward APJ backfill hiring for the sub-regions on this quarter\'s highest-attrition list, and shorten the recruiting-to-productive-agent pipeline where possible.',
  'Tie the SLO recovery plan for at-risk regions to Average Case Time improvement first, since the data points there rather than to headcount.',
  'Re-baseline the FY28 Cases-per-FTE plan using the last two quarters\' actual case-volume growth before the next AOP lock, instead of carrying the current plan forward unchanged.',
]

// Compacted 2026-07-06 to fit the narrower (220px) sidebar without cramping the
// main chart area — smaller type, tighter line-height/gaps, less padding.
function Section({ badge, badgeColor, title, subtitle, items }) {
  return (
    <div className="chart-panel" style={{ padding: '9px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
        <span style={{
          fontSize: 8, fontWeight: 700, color: '#070f1a', background: badgeColor,
          borderRadius: 3, padding: '1.5px 5px', letterSpacing: '0.03em',
        }}>{badge}</span>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</p>
      </div>
      <p style={{ fontSize: 8.5, color: 'var(--text-faint)', marginBottom: 6, lineHeight: 1.3 }}>{subtitle}</p>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 5, listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((text, i) => (
          <li key={i} style={{ display: 'flex', gap: 5, fontSize: 9.5, lineHeight: 1.3, color: 'var(--text-secondary)' }}>
            <span style={{ flexShrink: 0, width: 4, height: 4, borderRadius: '50%', background: badgeColor, marginTop: 4 }} />
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TsaCapacityRcaClcaPanel() {
  return (
    <div className="flex flex-col gap-3">
      <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
        RCA &amp; CLCA
      </p>
      <Section
        badge="RCA" badgeColor="#38bdf8"
        title="Root Cause Analysis"
        subtitle="Example findings — illustrative until connected to a real RCA workflow"
        items={RCA}
      />
      <Section
        badge="CLCA" badgeColor="#34d399"
        title="Corrective / Long-Term Action"
        subtitle="Example remediation plan tied to the findings above"
        items={CLCA}
      />
    </div>
  )
}
