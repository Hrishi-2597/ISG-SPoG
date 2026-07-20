# TSG-SPoG

Single Pane of Glass (SPoG) dashboard for TSG Business — Enterprise Service Group (MSG). Two pages, switched via a toggle in the header: **MSG Forecasting** and **TSA Forecasting**.

## Tech Stack
- React 18 + Vite
- Recharts for data visualizations
- react-simple-maps for geo map
- Tailwind CSS

## Features

### MSG Forecasting
- 12-filter panel (Queue Name, Capacity Code, Plan Name, Fiscal Year/Quarter/Week, Business Partner, Region, Sub-region, L5 Manager, etc.)
- 5 KPI cards with drill-down tables
- Layer 1: Plan over Plan comparison with variance %
- Layer 2: Actual vs Plan with adherence % + stacked adherence breakdown
- Layer 3: Interactive world geo map with region/sub-region toggle and color-coded accuracy
- RCA & CLCA sidebar alongside the analysis layers

### TSA Forecasting
- 7-filter panel (LOB, Fiscal Year/Quarter/Month/Week, Business Partner, Global Grouping)
- 5 KPI cards: ASU Actuals, SR Actuals, CPASU, Current UCR, UCR Impacted SR
- Layer 01/02: ASU/SR Actual vs Plan+Adherence, Plan-on-Plan comparison, Plan Impact Analysis (click a region to see LOB contribution)
- Layer 03: ASU impact on SR trend with CPASU (Region/Country toggle), UCR impact on SR, UCR runrate vs target with non-adherent queue list
- Layer 04: Global LOB adherence heatmap

## Run
```
npm install
npm run dev
```
