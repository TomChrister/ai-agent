import { useEffect, useState } from "react";
import Landing from "./components/Landing";
import { parsePlan } from "./lib/parsePlan";
import { parseRevision } from "./lib/parseRevision";
import { applyRevision } from "./lib/applyRevision";
import { savePlan, loadPlan, clearPlan } from "./lib/planStorage";
import type { ColumnKey, Revision, Task, TaskUpdate } from "./types";
import { Analytics } from "@vercel/analytics/react"

const MAX_REVISIONS = 5;

function App() {
    const [goal, setGoal] = useState(() => loadPlan()?.goal ?? "");
    const [tasks, setTasks] = useState<Task[] | null>(() => loadPlan()?.tasks ?? null);
    const [revisionCount, setRevisionCount] = useState(() => loadPlan()?.revisionCount ?? 0);
    const [active, setActive] = useState<Task | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [revising, setRevising] = useState(false);
    const [pendingRevision, setPendingRevision] = useState<Revision | null>(null);

    useEffect(() => {
        if (tasks) {
            savePlan(goal, tasks, revisionCount);
        }
    }, [goal, tasks, revisionCount]);

    async function handleClick() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/planner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ goal })
            });
            const data = await res.json();
            setTasks(parsePlan(data.result));
        } catch {
            setError("Couldn't create a plan for that goal. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleMoveTask(id: number, col: ColumnKey) {
        setTasks((ts) => (ts ? ts.map((t) => (t.id === id ? { ...t, col } : t)) : ts));
        setActive((a) => (a && a.id === id ? { ...a, col } : a));
    }

    function handleAddTask(title: string, description: string) {
        setTasks((ts) => {
            if (!ts) return ts;
            const nextId = ts.length ? Math.max(...ts.map((t) => t.id)) + 1 : 1;
            return [...ts, { id: nextId, title, description, col: "todo" as const }];
        });
    }

    function handleEditTask(id: number, updates: Omit<TaskUpdate, "id">) {
        setTasks((ts) => (ts ? ts.map((t) => (t.id === id ? { ...t, ...updates } : t)) : ts));
        setActive((a) => (a && a.id === id ? { ...a, ...updates } : a));
    }

    function handleDeleteTask(id: number) {
        setTasks((ts) => (ts ? ts.filter((t) => t.id !== id) : ts));
        setActive((a) => (a && a.id === id ? null : a));
    }

    async function handleRevise(instruction: string) {
        if (revisionCount >= MAX_REVISIONS) {
            setError("You've used all your revisions for this plan. Reset to start a new plan.");
            return;
        }
        setRevising(true);
        setError(null);
        try {
            const res = await fetch("/api/revise", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ goal, tasks, instruction })
            });
            if (!res.ok) throw new Error("request-failed");
            const data = await res.json();
            const revision = parseRevision(data.result);
            setPendingRevision(revision);
            setRevisionCount((c) => c + 1);
        } catch (err) {
            if (err instanceof SyntaxError) {
                setError("Claude's response couldn't be understood. Try rephrasing your instruction.");
            } else {
                setError("Couldn't reach the Planner Agent. Please try again.");
            }
        } finally {
            setRevising(false);
        }
    }

    function handleApplyRevision() {
        setTasks((ts) => (ts && pendingRevision ? applyRevision(ts, pendingRevision) : ts));
        setPendingRevision(null);
    }

    function handleDiscardRevision() {
        setPendingRevision(null);
    }

    function handleReset() {
        setTasks(null);
        setActive(null);
        setGoal("");
        setError(null);
        setRevisionCount(0);
        setPendingRevision(null);
        clearPlan();
    }

    return (
        <div>
            <Landing
                goal={goal}
                setGoal={setGoal}
                onPlan={handleClick}
                loading={loading}
                tasks={tasks}
                onMoveTask={handleMoveTask}
                active={active}
                setActive={setActive}
                error={error}
                onReset={handleReset}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onRevise={handleRevise}
                revising={revising}
                revisionsUsed={revisionCount}
                revisionsMax={MAX_REVISIONS}
                pendingRevision={pendingRevision}
                onApplyRevision={handleApplyRevision}
                onDiscardRevision={handleDiscardRevision}
            />
            <Analytics/>
        </div>
    );
}

export default App;
