import React from 'react'

// Illustrative example content, written for this page's own metrics (staffing/
// utilization/SL/attrition/cases-per-FTE) rather than reusing the Forecasting page's
// queue/call-volume-themed copy — same "own vocabulary, own content" convention as
// TsaRcaClcaPanel.jsx. Not generated from real incident data; once RCA/CLCA workflows
// are connected to a real data source, this panel should read from that instead.
const RCA = [
  'EMEA queues are running below utilization target for two consecutive quarters, while headcount sits at or above plan — the shortfall traces to Aux 3 (training) and Aux 6 (system downtime) absorbing more productive time than the AOP baseline assumed.',
  'Attrition in APJ has climbed above bench for three straight fiscal years, concentrated in sub-regions with the longest average tenure-to-backfill gap — new hires aren\'t landing fast enough to offset departures.',
  'Cases per FTE is trending above plan across most queues, indicating the current headcount plan under-forecast case volume growth rather than an efficiency problem.',
  'Several queues that are over headcount plan are still missing their 90% SL target — extra heads alone haven\'t resolved the underlying service-level gap, pointing to a skill-mix or routing issue rather than a staffing-level one.',
]

const CLCA = [
  'Add an Aux-code contingency buffer to the EMEA utilization target for queues with recurring Aux 3/Aux 6 exposure, rather than treating every shortfall as a pure headcount gap.',
  'Pull forward APJ backfill hiring by one full recruiting cycle for the sub-regions on this quarter\'s highest-attrition list, and pilot a stay-interview program for at-risk tenure bands.',
  'Re-baseline the FY28 Cases-per-FTE plan using the last two quarters\' actual case-volume growth rate before the next AOP lock, instead of carrying forward the current plan unchanged.',
  'For queues over headcount plan but still below 90% SL, prioritize a skill-mix/routing review ahead of any further headcount ask — the data says the fix isn\'t more heads.',
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

export default function MsgCapacityRcaClcaPanel() {
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
