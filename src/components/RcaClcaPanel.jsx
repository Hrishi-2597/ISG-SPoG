import React from 'react'

// Illustrative example content — not generated from real incident data. Once RCA/CLCA
// workflows are connected to a real data source, this panel should read from that
// instead of this static list.
const RCA = [
  'EMEA queues consistently under-forecast in Q2, driven by regional public-holiday call spikes the AOP baseline doesn’t reflect.',
  'APJ Symmetrix queues show forecast drift correlated with recent SKU launches — the seasonality model underweights new-product ramp volume.',
  'LATAM adherence dip traces back to bilingual-support attrition outpacing planned backfill hiring velocity.',
  'DB-routed NAMER queues track tighter to plan than OSP-routed queues — OSP demand signals appear to lag DB by roughly one fiscal week.',
]

const CLCA = [
  'Rebaseline the EMEA holiday calendar into the FY27 forecast model; validate against FY26 actuals before Q3 lock.',
  'Add a 4-week product-launch overlay for APJ Symmetrix queues to capture ramp volume the standard seasonality curve misses.',
  'Pull the LATAM bilingual hiring pipeline forward by 3 weeks and add an 8% contingent-staffing buffer through Q4.',
  'Move OSP demand sensing to a rolling 2-week lookahead so DB/OSP forecasts converge earlier in the cycle.',
]

function Section({ badge, badgeColor, title, subtitle, items }) {
  return (
    <div className="chart-panel" style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, color: '#070f1a', background: badgeColor,
          borderRadius: 4, padding: '2px 6px', letterSpacing: '0.03em',
        }}>{badge}</span>
        <p style={{ fontSize: 11.5, fontWeight: 700, color: '#e6f1ff' }}>{title}</p>
      </div>
      <p style={{ fontSize: 9.5, color: '#5a8bb0', marginBottom: 9 }}>{subtitle}</p>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((text, i) => (
          <li key={i} style={{ display: 'flex', gap: 7, fontSize: 11, lineHeight: 1.45, color: '#cfe8fb' }}>
            <span style={{ flexShrink: 0, width: 5, height: 5, borderRadius: '50%', background: badgeColor, marginTop: 5 }} />
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function RcaClcaPanel() {
  return (
    <div className="flex flex-col gap-3">
      <p style={{ fontSize: 10, fontWeight: 700, color: '#3d78a3', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>
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
