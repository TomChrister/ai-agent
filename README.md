# Planbase — AI Task Orchestrator

[![CI](https://github.com/TomChrister/ai-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/TomChrister/ai-agent/actions/workflows/ci.yml)

Give Planbase a goal and a **Planner Agent** (powered by Claude) breaks it down into
concrete, self-contained subtasks. The tasks appear as cards on a kanban board
(**To Do / In Progress / Done**), where you can drag them between columns, edit, add,
and delete them — or
ask a **Revise Agent** to reshape the plan in natural language ("add two tasks about
music", "remove the budget task").

---

## Tech stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19 + TypeScript + Vite 8 |
| Styling    | Tailwind CSS 4 (via `@tailwindcss/vite`) + CSS design tokens (`src/styles/tokens.css`) |
| AI         | [Anthropic Claude](https://www.anthropic.com) via `@anthropic-ai/sdk` (model `claude-sonnet-4-6`) |
| Backend (local) | Express 5 (`server.ts`) |
| Backend (production) | Vercel serverless functions (`api/`) |
| State      | React state + `localStorage` persistence (`src/lib/planStorage.ts`) |
| Linting    | ESLint 10 |

There is **no separate state library** — plan state lives in `App.tsx` and is persisted
to `localStorage` so a plan survives page reloads.

---

## How the app works

### User flow
1. **Enter a goal** on the landing screen (e.g. "Plan a small launch event").
2. The frontend `POST`s the goal to `/api/planner`. While it waits, a responsive
   `PlanningLoader` shows a rotating status + skeleton board.
3. The **Planner Agent** returns JSON describing up to 5 subtasks. `parsePlan.ts`
   turns that into task cards, all starting in **To Do**.
4. Cards render on the **kanban board**. You can:
   - **Drag and drop** a card into another column to change its status.
   - Click a card to open its detail panel (edit / delete / move).
   - Add a new task via the form in the To Do column.
5. **Revise the plan**: type an instruction in the revise bar → `/api/revise`.
   The **Revise Agent** returns a minimal set of `add` / `update` / `remove` changes,
   shown in a preview dialog before you **Apply** or **Discard** them. Limited to
   `MAX_REVISIONS` (5) per plan.

### The two agents
Both live in the backend and respond with **JSON only** (temperature `0.2` for
consistent structure).

- **Planner Agent** (`/api/planner`) — input: `{ goal }`. Output:
  ```json
  { "goal": "short summary", "tasks": [ { "id": 1, "title": "...", "description": "..." } ] }
  ```
- **Revise Agent** (`/api/revise`) — input: `{ goal, tasks, instruction }`. Output:
  ```json
  { "add": [ { "title": "...", "description": "..." } ], "update": [ { "id": 1, "title": "..." } ], "remove": [3] }
  ```

### Frontend ↔ backend wiring
The frontend always calls **relative** paths (`/api/planner`, `/api/revise`):

- **In local dev**, `vite.config.ts` proxies `/api/*` → the Express server on
  `http://localhost:3000` (`server.ts`).
- **In production on Vercel**, `/api/*` is served by the serverless functions in
  `api/planner.ts` and `api/revise.ts`.

The two implementations share the same prompts and behavior; keep them in sync when
you change agent logic.

---

## API key setup

The Anthropic API key is read **server-side only** and is never exposed to the frontend.

1. Create an API key in the [Anthropic Console](https://console.anthropic.com).
2. Copy the example env file and fill in the key:
   ```bash
   cp .env.example .env
   ```
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. `.env` is git-ignored — **never commit it**.
4. For the Vercel deployment, add `ANTHROPIC_API_KEY` as an
   **Environment Variable** in the project settings (Console → Settings →
   Environment Variables), not in the repo.

---

## Running locally

The app needs **two processes**: the Vite dev server (frontend) and the Express API
server. The easiest way is one command that runs both:

```bash
# install dependencies
npm install

# start frontend + API together
npm run dev:all
```

Then open the URL Vite prints (default `http://localhost:5173`). Output from both
processes is labelled `web` and `api`; press `Ctrl+C` once to stop them both.

<details>
<summary>Prefer two terminals?</summary>

```bash
# terminal 1 — API server on :3000
npm run server

# terminal 2 — Vite dev server (proxies /api to :3000)
npm run dev
```
</details>

### Scripts
| Command            | Description |
|--------------------|-------------|
| `npm run dev:all`  | Start the frontend **and** API server together (recommended) |
| `npm run dev`      | Start only the Vite dev server (frontend) |
| `npm run server`   | Start only the Express API server on port 3000 |
| `npm run build`    | Production build to `dist/` |
| `npm run preview`  | Preview the production build locally |
| `npm run lint`     | Run ESLint |
| `npm test`         | Run the test suite (Vitest) |

---

## Continuous integration

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs lint, build, and tests on
every pull request targeting `main`. A branch ruleset on `main` blocks merging until
CI passes.

---

## Project structure

```
ai-agent/
├── api/                     # Vercel serverless functions (production backend)
│   ├── planner.js           #   POST /api/planner  → Planner Agent
│   └── revise.js            #   POST /api/revise   → Revise Agent
├── server.ts                # Express server (local dev backend, port 3000)
├── vite.config.ts           # Vite + React + Tailwind; /api proxy for dev
├── index.html               # App shell + favicons
├── public/                  # Static assets served from / (favicons, manifest)
└── src/
    ├── App.tsx              # Top-level state, plan/revise logic, localStorage
    ├── components/
    │   ├── Landing.jsx          # Goal input → board switch
    │   ├── Board.jsx            # Kanban board (drag & drop, collapsible columns)
    │   ├── PlanningLoader.jsx   # Loading state while planning
    │   ├── ReviseBar.jsx        # Natural-language revise input
    │   ├── RevisePreviewDialog.jsx
    │   ├── TaskDetailPanel.jsx
    │   ├── AddTaskForm.jsx
    │   └── ui/                  # Reusable UI primitives (core, forms, kanban, …)
    ├── lib/
    │   ├── parsePlan.ts         # Planner JSON → task cards
    │   ├── parseRevision.js     # Revise JSON → change set
    │   ├── applyRevision.js     # Apply add/update/remove to tasks
    │   └── planStorage.ts       # localStorage save/load/clear
    └── styles/tokens.css        # Design tokens (colors, surfaces, status)
```

---

## Drag and drop

Task cards can be dragged between the three columns; dropping a card calls the same
`onMoveTask` handler in `App.tsx` that the detail panel uses, so the new column is
persisted to `localStorage` immediately.

- Built on the **native HTML5 drag-and-drop API** — no extra dependency.
- The card being dragged dims; the column under the cursor gets a dashed outline.
- Dragging over a **collapsed** column expands it so the drop lands somewhere visible.
- A hint (*"Drag and drop tasks between columns"*) sits above the board, below the
  revise bar.
- Because HTML5 drag events don't fire on touch devices, dragging (and the hint) are
  **desktop only** (`≥ md`); on phones, move a task from its detail panel instead.

---

## Responsive behavior

The board and planning loader are mobile-friendly:
- On phones (`< md`, 768px) the three columns **stack vertically** and each column's
  card list is **collapsible** — tap a column header to expand/collapse it.
- **To Do** is open by default; **In Progress** and **Done** start collapsed but still
  show their task count. Columns **auto-expand** when a new card lands in them.
- On desktop (`≥ md`) the columns are always shown side by side.

---

## Notes & roadmap

- MVP scope is **Planner + Revise** agents with sequential, client-side task movement.
- A **Worker Agent** (solve each task) and **Reviewer Agent** (quality-check results)
  are planned next per the concept in `CLAUDE.md`.
