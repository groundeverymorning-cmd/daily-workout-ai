# Daily Workout AI

A Next.js web app that logs daily workouts and generates AI-powered one-line comments using the Anthropic Claude API.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router, TypeScript, Tailwind CSS)
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API
- **Deployment**: Vercel

## Setup

### 1. Clone and Install

```bash
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required keys:
- `NEXT_PUBLIC_SUPABASE_URL` - From Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` - From Supabase project settings
- `ANTHROPIC_API_KEY` - From Anthropic console

### 3. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build & Deploy

```bash
npm run build
npm start
```

## Development Process

See `STAGE_01.md` through `STAGE_07.md` for detailed implementation guides.

## Documentation

- `CLAUDE.md` - Development guide for Claude Code
- `PRD_UPDATED.md` - Project requirements & database schema
- `STAGE_*.md` - Step-by-step implementation stages
