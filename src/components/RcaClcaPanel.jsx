import React from 'react'

// Illustrative example content — not generated from real incident data. Once RCA/CLCA
// workflows are connected to a real data source, this panel should read from that
// instead of this static list.
const RCA = [
  'EMEA queues consistently under-forecast in Q2, driven by regional public-holiday call spikes the AOP baseline doesn’t reflect.',
  'APJ ApexArray queues show forecast drift correlated with recent SKU launches — the seasonality model underweights new-product ramp volume.',
  'LATAM adherence dip traces back to bilingual-support attrition outpacing planned backfill hiring velocity.',
  'DB-routed NAMER queues track tighter to plan than OSP-routed queues — OSP demand signals appear to lag DB by roughly one fiscal week.',
]

const CLCA = [
  'Rebaseline the EMEA holiday calendar into the FY27 forecast model; validate against FY26 actuals before Q3 lock.',
  'Add a 4-week product-launch overlay for APJ ApexArray queues to capture ramp volume the standard seasonality curve misses.',
  'Pull the LATAM bilingual hiring pipeline forward by 3 weeks and add an 8% contingent-staffing buffer through Q4.',
  'Move OSP demand sensing to a rolling 2-week lookahead so DB/OSP forecasts converge earlier in the cycle.',
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

export default function RcaClcaPanel() {
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
