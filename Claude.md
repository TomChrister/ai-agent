# Planbase — AI Task Orchestrator

## Concept
User provides a goal → Planner Agent breaks it down into subtasks → tasks are shown on a kanban board (To Do / In Progress / Done) → the user can revise the plan in natural language via the Revise Agent.
Later: Worker Agent(s) solve each task.

## Tech stack
- Frontend: React 19 + TypeScript + Vite, Tailwind CSS 4 + design tokens (`src/styles/tokens.css`)
- Backend: Vercel serverless functions in `api/`; `server.ts` mounts the same handlers in Express for local dev
- AI: Anthropic API (Claude, `claude-sonnet-4-6`), structured JSON responses, temperature 0.2
- State: React state in `App.tsx`, persisted to `localStorage` (`src/lib/planStorage.ts`)
- Tests: Vitest (`npm test`); CI runs lint, build and tests on PRs to `main`

## Agents
Both agents share one Claude call in `api/_claude.ts`. Model output is untrusted: it is parsed and type-checked in `src/lib/parsePlan.ts` and `src/lib/parseRevision.ts`.

### Planner Agent (`api/planner.ts`)
Breaks a goal (1–500 chars) down into max 5 concrete, self-contained subtasks.
Responds ONLY with JSON:
```json
{
  "goal": "short summary",
  "tasks": [
    { "id": 1, "title": "short title", "description": "what needs to be done" }
  ]
}
```

### Revise Agent (`api/revise.ts`)
Takes `{ goal, tasks, instruction }` (max 20 tasks) and returns the minimal change set:
```json
{ "add": [{ "title": "...", "description": "..." }], "update": [{ "id": 1, "title": "..." }], "remove": [3] }
```
The user previews the changes before applying them. Max 5 revisions per plan (client-side).

### Worker Agent (not built yet)
Solves one task at a time, sequentially.

### Reviewer Agent (optional, v2)
Checks whether the Worker's result is good enough, requests revision if needed.

## UI flow
1. Input field with example goals → "Plan it"
2. Planner generates task list → cards in "To Do"
3. Cards move between columns by drag and drop or from the detail panel
4. Clicking a card opens a detail panel (edit, delete, change status)
5. Revise bar → preview dialog → apply or discard

## API key setup
- API key is created in the Anthropic Console (console.anthropic.com)
- Stored in `.env` as `ANTHROPIC_API_KEY` (never committed — see `.gitignore`)
- Copy `.env.example` to `.env` and fill in the real key
- Key must only be read server-side, never exposed in frontend code
- Endpoints are public and spend the key: keep the input caps in `api/` and rate-limit `/api/` in the Vercel Firewall

## Status
- [x] Set up Anthropic Console account and billing
- [x] Create API key and add it to `.env`
- [x] UI skeleton
- [x] Planner Agent integration
- [x] Kanban view (drag and drop, edit, add, delete)
- [x] Revise Agent integration
- [ ] Vercel Firewall rate limit on `/api/`
- [ ] Worker Agent integration
