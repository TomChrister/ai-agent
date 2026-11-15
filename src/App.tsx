import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import GoalComposer from "./components/GoalComposer";
import PlanningLoader from "./components/PlanningLoader";
import Board from "./components/Board";
import RevisePreviewDialog from "./components/RevisePreviewDialog";
import TaskDetailPanel from "./components/TaskDetailPanel";
import Toast from "./components/ui/overlays/Toast";
import { parsePlan } from "./lib/parsePlan";
import { parseRevision } from "./lib/parseRevision";
import { applyRevision } from "./lib/applyRevision";
import { savePlan, loadPlan, clearPlan } from "./lib/planStorage";
import type { ColumnKey, Revision, Task, TaskUpdate } from "./types";
import { Analytics } from "@vercel/analytics/react"

const MAX_REVISIONS = 5;

const postJson = (url: string, body: unknown) =>
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

function App() {
    const [saved] = useState(loadPlan);
    const [goal, setGoal] = useState(saved?.goal ?? "");
    const [tasks, setTasks] = useState<Task[] | null>(saved?.tasks ?? null);
    const [revisionCount, setRevisionCount] = useState(saved?.revisionCount ?? 0);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [revising, setRevising] = useState(false);
    const [pendingRevision, setPendingRevision] = useState<Revision | null>(null);

    // The task shown in the detail panel, always read from the current list.
    const active = tasks?.find((t) => t.id === activeId) ?? null;

    useEffect(() => {
        if (tasks) {
            savePlan(goal, tasks, revisionCount);
        }
    }, [goal, tasks, revisionCount]);

    async function handlePlan() {
        setLoading(true);
        setError(null);
        try {
            const res = await postJson("/api/planner", { goal });
            if (!res.ok) throw new Error("request-failed");
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
    }

    function handleAddTask(title: string, description: string) {
        setTasks((ts) => (ts ? applyRevision(ts, { add: [{ title, description }], update: [], remove: [] }) : ts));
    }

    function handleEditTask(id: number, updates: Omit<TaskUpdate, "id">) {
        setTasks((ts) => (ts ? ts.map((t) => (t.id === id ? { ...t, ...updates } : t)) : ts));
    }

    function handleDeleteTask(id: number) {
        setTasks((ts) => (ts ? ts.filter((t) => t.id !== id) : ts));
        // Clear the id too: a task added later can reuse it and must not reopen the panel.
        setActiveId((a) => (a === id ? null : a));
    }

    async function handleRevise(instruction: string) {
        if (revisionCount >= MAX_REVISIONS) {
            setError("You've used all your revisions for this plan. Reset to start a new plan.");
            return;
        }
        setRevising(true);
        setError(null);
        try {
            const res = await postJson("/api/revise", { goal, tasks, instruction });
            if (!res.ok) {
                // A 400 explains itself (e.g. plan too big); other failures may not return JSON.
                const body = await res.json().catch(() => null);
                setError(body?.error ?? "Couldn't reach the Planner Agent. Please try again.");
                return;
            }
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

    function handleReset() {
        setTasks(null);
        setActiveId(null);
        setGoal("");
        setError(null);
        setRevisionCount(0);
        setPendingRevision(null);
        clearPlan();
    }

    return (
        <>
            <div className="flex min-h-screen flex-col">
                <TopBar />

                {loading ? (
                    <PlanningLoader />
                ) : !tasks ? (
                    <GoalComposer goal={goal} setGoal={setGoal} onPlan={handlePlan} />
                ) : (
                    <Board
                        goal={goal}
                        tasks={tasks}
                        onCardClick={(task) => setActiveId(task.id)}
                        onMoveTask={handleMoveTask}
                        onReset={handleReset}
                        onAddTask={handleAddTask}
                        onRevise={handleRevise}
                        revising={revising}
                        revisionsUsed={revisionCount}
                        revisionsMax={MAX_REVISIONS}
                    />
                )}

                <RevisePreviewDialog
                    revision={pendingRevision}
                    tasks={tasks ?? []}
                    onApply={handleApplyRevision}
                    onDiscard={() => setPendingRevision(null)}
                />

                <TaskDetailPanel
                    key={active?.id}
                    task={active}
                    onClose={() => setActiveId(null)}
                    onMove={handleMoveTask}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                />

                {error && <Toast>{error}</Toast>}
            </div>
            <Analytics/>
        </>
    );
}

export default App;
