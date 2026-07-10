# AI Task Orchestrator

## Concept
User provides a goal → Planner Agent breaks it down into subtasks → Worker Agent(s) solve each task → results are shown visually (kanban-style: To Do / In Progress / Done).

## Tech stack
- Frontend: React + Tailwind (optionally Next.js)
- AI: Anthropic API (Claude), structured JSON responses
- State: React state (Zustand if it grows)

## Agents

### Planner Agent
Breaks a goal down into max 5 concrete, self-contained subtasks.
Responds ONLY with JSON:
```json
{
  "goal": "short summary",
  "tasks": [
    { "id": 1, "title": "short title", "description": "what needs to be done" }
  ]
}
```
Temperature: 0–0.3 (consistent structure).

### Worker Agent
Solves one task at a time, sequentially in MVP.

### Reviewer Agent (optional, v2)
Checks whether the Worker's result is good enough, requests revision if needed.

## UI flow
1. Input field: "What do you want to achieve?"
2. Planner generates task list → cards in "To Do"
3. Cards move automatically To Do → In Progress → Done
4. Clicking a card shows the agent's full response

## MVP scope
- Only Planner + Worker
- Sequential execution (no parallelization)
- 1–2 hardcoded example goals for demo

## API key setup
- API key is created in the Anthropic Console (console.anthropic.com)
- Stored in `.env` as `ANTHROPIC_API_KEY` (never committed — see `.gitignore`)
- Copy `.env.example` to `.env` and fill in the real key
- Key must only be read server-side, never exposed in frontend code

## Status
- [ ] Set up Anthropic Console account and billing
- [ ] Create API key and add it to `.env`
- [ ] UI skeleton
- [ ] Planner Agent integration
- [ ] Worker Agent integration
- [ ] Kanban view