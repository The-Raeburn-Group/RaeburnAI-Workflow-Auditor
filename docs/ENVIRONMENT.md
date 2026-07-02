# Environment

Create a local environment file named `.env.local`.

Required for AI-powered audits:

```bash
OPENAI_API_KEY=your-key-here
```

Optional:

```bash
OPENAI_MODEL=gpt-4o-mini
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEFAULT_HOURLY_RATE=35
```

The application still runs without an AI provider key by using the deterministic fallback auditor. This is deliberate so open-source contributors can install and test it quickly.
