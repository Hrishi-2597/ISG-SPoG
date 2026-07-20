import React from 'react'

// Illustrative example content, written for this page's own metrics (ASU/SR/CPASU/UCR)
// rather than reusing the Forecasting page's queue/call-volume-themed copy — see
// design_choice.md. Not generated from real incident data; once RCA/CLCA workflows
// are connected to a real data source, this panel should read from that instead.
const RCA = [
  'APJ ApexArray LOBs are trending under ASU plan for two consecutive quarters, correlated with a slower-than-modeled ramp on recently onboarded High End Storage queues.',
  'SR volume for EMEA TSA queues has outpaced ASU growth, pushing CPASU upward — an early signal of rising support intensity the current AOP baseline doesn’t capture.',
  'UCR runrate misses cluster in LOBs with the lowest bot-deflection share, suggesting UCR automation coverage — not staffing — is the binding constraint.',
  'NAMER "UCR Handled SR’s" grew faster than plan while "SR’s" held flat, indicating bot deflection is absorbing more volume than the FY27 plan assumed.',
]

const CLCA = [
  'Re-baseline the APJ ApexArray ASU ramp curve using actual onboarding velocity from the last two quarters before the Q3 AOP lock.',
  'Add a CPASU early-warning threshold (e.g. >15% QoQ increase) to flag EMEA TSA queues for a support-intensity review before it shows up in the UCR runrate.',
  'Prioritize bot-deflection coverage expansion for the LOBs on this quarter’s non-adherent list, ahead of additional headcount asks.',
  'Fold observed bot-deflection growth into the FY27 SR plan so "UCR Handled SR’s" isn’t chronically under-planned relative to actuals.',
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

export default function TsaRcaClcaPanel() {
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
