# ISG-SPoG

Single Pane of Glass (SPoG) dashboard for ISG Business — Enterprise Service Group (ESG) Forecasting.

## Tech Stack
- React 18 + Vite
- Recharts for data visualizations
- react-simple-maps for geo map
- Tailwind CSS

## Features
- 12-filter panel (Queue Name, Capacity Code, Plan Name, Fiscal Year/Quarter/Week, Business Partner, Region, Sub-region, L5 Manager, etc.)
- 5 KPI cards with drill-down tables
- Layer 1: Plan over Plan comparison with variance %
- Layer 2: Actual vs Plan with adherence % + stacked adherence breakdown
- Layer 3: Interactive world geo map with region/country toggle and color-coded accuracy

## Run
```
npm install
npm run dev
```
