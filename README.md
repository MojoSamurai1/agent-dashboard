# Agent Dashboard

Live monitoring system for Samurai Framework AI agents across all projects.

## Features

- **Agent Portfolio View** - See all agent instances across all projects
- **Agent Type Filtering** - Group agents by role (Orchestrator, Architecture, Development, etc.)
- **Agent Detail Pages** - Explore individual agent capabilities, memories, and context
- **Cross-Project Discovery** - Automatically discovers agents from:
  - samurai-local
  - mywinemojo
  - the-kendo-way
  - Alexa
  - wmg
  - And more
- **Authentication Gating** - Restricted access (michael@samurai.rocks only)
- **Real-Time Updates** - Live status sync across all project agents

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173/dashboard/`

## Build & Deploy

```bash
npm run build
```

Deployment to `mojosamurai.com/dashboard/` is automatic on push to `main` via GitHub Actions.

### GitHub Secrets Required

For deployment to work, configure these secrets in GitHub:

- `PROD_SSH_KEY` - Private SSH key (ED25519 recommended)
- `PROD_SSH_HOST` - SiteGround hostname (e.g., gsydm1062.siteground.biz)
- `PROD_SSH_USER` - SSH username
- `PROD_SSH_PORT` - SSH port (usually 18765)
- `PROD_DEPLOY_PATH` - Full path to production site root

## Authentication

Default credentials:
- **Email:** michael@samurai.rocks
- **Password:** ChangeMe213!!!

## Project Structure

```
agent-dashboard/
├── src/
│   ├── pages/
│   │   ├── Login.tsx          # Authentication gate
│   │   ├── Dashboard.tsx      # Agent portfolio view
│   │   └── AgentDetail.tsx    # Individual agent explorer
│   ├── App.tsx                # Main app component
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── .github/workflows/
│   └── deploy.yml             # GitHub Actions deployment
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Technology Stack

- **React 18.3.1** - UI framework
- **Vite 6.0.3** - Build tool
- **TypeScript 5.7.2** - Type safety
- **React Router 6.28** - Client-side routing

## Architecture

The dashboard follows a three-tier structure:

1. **Login Gate** - Restricts access to authorized users only
2. **Dashboard** - Portfolio view with filtering and discovery
3. **Agent Explorer** - Deep-dive into individual agent metadata

Agent data is sourced from:
- `.claude/agents/` directories across all projects
- Agent memory files (`.claude/memory/`)
- Agent prompt templates
- Project configuration files

## Deployment

Auto-deployed to `mojosamurai.com/dashboard/` on push to `main` branch.

Deployment pipeline:
1. GitHub Actions triggers on push to `main`
2. Runs `npm ci` and `npm run build`
3. Uses SSH + rsync to deploy `dist/` folder
4. Deploys to SiteGround via `webfactory/ssh-agent@v0.9.0`

See `.github/workflows/deploy.yml` for full configuration.

## License

Internal use only - Samurai Framework
