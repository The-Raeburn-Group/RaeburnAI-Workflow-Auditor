# RaeburnAI Workflow Auditor ⭐⭐⭐⭐⭐

**The open-source Lighthouse for AI adoption.**

Upload SOPs, org charts, policies, call notes, or process documents. RaeburnAI Workflow Auditor identifies automation opportunities, estimates hours and costs saved, and generates a practical AI implementation roadmap.

## Why this exists

Most SMEs know AI can save time, but they do not know where to start. This project turns messy operational documents into a structured audit covering:

- automation candidates
- workflow bottlenecks
- repetitive admin tasks
- risk and compliance issues
- human-in-the-loop requirements
- expected hours saved
- cost saving estimates
- implementation sequencing
- quick wins vs strategic projects

## Core features

- **Document upload audit** for SOPs, org charts, process notes, CSV/text/PDF inputs
- **AI opportunity scoring** by impact, feasibility, risk, urgency, and confidence
- **Savings calculator** using configurable hourly rates and frequency assumptions
- **Implementation roadmap** split into 0–30, 31–90, and 90+ day phases
- **Executive dashboard** with AI readiness score, opportunity map, and ROI summary
- **OpenAI-compatible provider layer** with a safe deterministic fallback for local demos
- **Privacy-first design**: no persistent document storage in the default implementation
- **Production deployment** via Vercel or container hosting
- **Open-source friendly** Apache-2.0 licence, contribution guide, security policy, and roadmap

## Tech stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Zod validation
- OpenAI SDK with provider abstraction
- Vitest unit tests

## Getting started

```bash
git clone https://github.com/Raebu/RaeburnAI-Workflow-Auditor.git
cd RaeburnAI-Workflow-Auditor
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEFAULT_HOURLY_RATE=35
```

The app works without an API key using a deterministic rule-based fallback so contributors can test the product locally.

## Production readiness checklist

- [x] Product UX and landing page
- [x] Audit API
- [x] File parsing path
- [x] AI provider abstraction
- [x] Rule-based fallback
- [x] Validation and error handling
- [x] Type-safe domain model
- [x] Tests for scoring and savings logic
- [x] Security policy
- [x] Contribution guide
- [x] Dockerfile
- [x] GitHub Actions CI
- [x] Vercel deployment config

## Example use cases

- Consultancy uses it as a lead magnet for AI transformation audits
- SME uploads internal SOPs and receives an implementation roadmap
- Fractional COO identifies low-risk automation quick wins
- Recruitment, finance, legal, healthcare admin, real estate, retail, and ops teams benchmark AI readiness

## Licence

Apache-2.0. See [LICENSE](LICENSE).