# Evastore Partner Ops — Command Centre

Real-time SLA monitoring dashboard for the Evastore partner relationship at Octopus Legacy.

## What it does
- **Dashboard** — SLA gauge, response time charts, category breakdown, recovery path tracking
- **Triage Queue** — Searchable/filterable thread list with classification, priority, action items, Gmail links
- **System Build** — Full 5-stage workflow pipeline, Zapier integration status, tech stack overview
- **Alert Config** — Escalation ladder (T+0 to T+8h), classification rules, impact summary

## Tech stack
- React 18 + Vite
- Recharts (charts)
- Lucide React (icons)
- Tailwind CSS (via CDN)

## Local development
```bash
npm install
npm run dev
```

## Deployment
Deployed as a static site on Render, auto-deploys from `main` branch.

Build command: `npm install && npm run build`
Publish directory: `dist`
