# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Daily Workout AI**: A Next.js web app that logs daily workouts and generates AI-powered one-line comments using the Anthropic Claude API.

- **Stack**: Next.js 14+ (App Router, TypeScript, Tailwind CSS) + Supabase (PostgreSQL) + Anthropic Claude API
- **Deployment**: GitHub → Vercel (auto-deploy on main push)
- **Development Process**: 7-stage plan (see STAGE_01-07.md files)

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Access at http://localhost:3000

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint

# Format code (if configured)
npm run format
```

---

## Project Structure

```
app/
├── (auth)/
│   ├── login/
│   ├── signup/
│   └── layout.tsx
├── api/
│   ├── workouts/
│   │   └── route.ts         # GET: fetch logs, POST: save & generate AI comment
│   └── [other API routes]
├── dashboard/
│   └── page.tsx             # Main app (requires auth)
├── page.tsx                 # Home/redirect
└── middleware.ts            # Auth guard for protected routes

components/
├── Header.tsx               # Nav + logout
├── WorkoutForm.tsx          # Form to input workout data
├── WorkoutList.tsx          # List of all logs
├── WorkoutCard.tsx          # Individual workout entry with AI comment
└── [other reusable components]

lib/
├── supabase.ts              # Supabase client setup (both client & server)
├── anthropic.ts             # Claude API client + generateWorkoutComment()
└── [other utilities]

types/
└── workout.ts               # WorkoutLog interface

.env.local (not in git)
├── NEXT_PUBLIC_SUPABASE_URL
├── NEXT_PUBLIC_SUPABASE_ANON_KEY
├── SUPABASE_SERVICE_ROLE_KEY
└── ANTHROPIC_API_KEY
```

---

## Architecture Overview

### Frontend (Next.js App Router)
- **Protected Routes**: `/dashboard/*` → Auth middleware checks session
- **Public Routes**: `/auth/login`, `/auth/signup` → Unauthenticated users
- **API Routes**: `/api/workouts` → backend logic

### Authentication (Supabase Auth)
- Email-based signup/login via Supabase Auth
- Session stored in cookies (auto-managed by Supabase client)
- RLS (Row Level Security) enforced at DB level

### API Integration
- **POST /api/workouts**: Save workout log → Call Claude API → Store ai_comment
- **GET /api/workouts**: Fetch user's logs (RLS filters by user_id)

### Database Schema
```sql
users (id, email, created_at)
  ↓
workout_logs (id, user_id, workout_date, running_distance, cycling_distance, swimming_distance, ai_comment, created_at, updated_at)
```

RLS Policies:
- Users can only SELECT/INSERT/UPDATE their own records (`WHERE auth.uid() = user_id`)

---

## Key Implementation Details

### 1. AI Comment Generation (Instant)
- Triggered automatically on POST /api/workouts
- Claude API called server-side (service role key)
- Comment inserted into `ai_comment` field
- If generation fails, log still saved with NULL comment

### 2. Environment Variables
- **Public (NEXT_PUBLIC_*)**: Supabase URL & Anon Key (safe to expose)
- **Secret**: Service Role Key (never expose), Anthropic API Key (server-only)
- Set in `.env.local` (local) and Vercel dashboard (production)

### 3. TypeScript Usage
- All components & APIs typed (WorkoutLog interface, request/response shapes)
- Strict mode enabled in tsconfig.json

---

## Development Workflow

### Stage-Based Development
Each stage has a dedicated `.md` file with detailed prompts:

1. **STAGE_01_PROJECT_SETUP.md** → GitHub repo, Next.js init, env vars
2. **STAGE_02_DATABASE_SETUP.md** → Create tables, RLS policies, test data
3. **STAGE_03_AUTH_SYSTEM.md** → Login/signup UI, middleware, session management
4. **STAGE_04_API_ROUTES.md** → Workout API, Claude integration
5. **STAGE_05_FRONTEND_UI.md** → Dashboard, form, list, cards
6. **STAGE_06_DEPLOYMENT.md** → Vercel setup, env vars, auto-deploy
7. **STAGE_07_TESTING_OPTIMIZATION.md** → Full testing, security review

### GitHub Integration (MCP)
- Use GitHub MCP for commits, pushes, PR creation
- Commits triggered after each major feature
- Pushes to `main` trigger Vercel auto-deploy

### Code Review & Testing
- Verify builds without errors: `npm run build`
- Test locally before pushing: `npm run dev`
- Use `/verify` skill to test UI changes in browser
- Use `/code-review` skill for peer review (optional: `/code-review ultra`)

---

## Common Patterns

### API Route Template
```typescript
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const { data: { user } } = await supabaseAdmin.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { data, error } = await supabaseAdmin
    .from("table_name")
    .select("*")
    .eq("user_id", user.id);
  
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json(data);
}
```

### Component with Server-Side Data Fetch
```typescript
"use client";

import { useEffect, useState } from "react";

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/endpoint")
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return loading ? <p>Loading...</p> : <div>{/* render data */}</div>;
}
```

---

## Important Notes for Future Work

- **RLS is critical**: All DB queries must respect `user_id` to prevent data leaks
- **Claude API cost**: Monitor usage (billed per token); set rate limits if needed
- **Tailwind styling**: Use Tailwind classes (no inline CSS)
- **Supabase RLS debugging**: Test with Supabase Studio's "Realtime" to verify policies
- **Vercel env vars**: Keep `.env.local` out of git; set in Vercel dashboard for production
- **Email verification**: Supabase Auth sends confirmation emails (check spam folder)

---

## References

- **PRD_UPDATED.md** → Detailed project requirements & schema
- **STAGE_*.md** → Step-by-step implementation guides with code samples
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com)
