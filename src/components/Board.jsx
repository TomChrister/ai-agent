import { useEffect, useRef, useState } from "react";
import KanbanColumn from "./ui/kanban/KanbanColumn";
import TaskCard from "./ui/kanban/TaskCard";
import Button from "./ui/core/Button";
import Icon from "./ui/core/Icon";
import AddTaskForm from "./AddTaskForm";
import ReviseBar from "./ReviseBar";
import RevisePreviewDialog from "./RevisePreviewDialog";

const COLUMNS = [
    { key: "todo", title: "To Do", tone: "neutral" },
    { key: "progress", title: "In Progress", tone: "progress" },
    { key: "done", title: "Done", tone: "done" },
];

/** Board: goal header + revise bar + kanban columns for the generated plan. */
function Board({
    goal,
    tasks,
    onCardClick,
    onReset,
    onAddTask,
    onRevise,
    revising,
    revisionsUsed,
    revisionsMax,
    pendingRevision,
    onApplyRevision,
    onDiscardRevision,
}) {
    // Per-column collapse state (only takes effect below `md`; desktop always shows).
    // To Do starts open, the others collapsed.
    const [collapsed, setCollapsed] = useState({ todo: false, progress: true, done: true });

    const counts = COLUMNS.reduce((acc, col) => {
        acc[col.key] = tasks.filter((t) => t.col === col.key).length;
        return acc;
    }, {});

    // Auto-expand a column when a new card lands in it.
    const prevCounts = useRef(counts);
    useEffect(() => {
        setCollapsed((prev) => {
            let changed = false;
            const next = { ...prev };
            for (const col of COLUMNS) {
                if (counts[col.key] > (prevCounts.current[col.key] ?? 0) && next[col.key]) {
                    next[col.key] = false;
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
        prevCounts.current = counts;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counts.todo, counts.progress, counts.done]);

    const toggleColumn = (key) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between px-8 pt-5">
                <div>
                    <div className="text-2xl font-semibold text-(--text-primary)">{goal}</div>
                    <div className="mt-1 text-sm text-(--text-secondary)">
                        AI Planner Agent · {tasks.length} tasks
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        className='cursor-pointer'
                        variant="secondary"
                        size="s"
                        onClick={onReset}
                        icon={<Icon name="rotate-ccw" size={14} />}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            <ReviseBar
                onSubmit={onRevise}
                loading={revising}
                revisionsUsed={revisionsUsed}
                revisionsMax={revisionsMax}
            />

            <RevisePreviewDialog
                revision={pendingRevision}
                tasks={tasks}
                onApply={onApplyRevision}
                onDiscard={onDiscardRevision}
            />

            <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:gap-5 md:overflow-x-auto md:p-8">
                {COLUMNS.map((col) => (
                    <KanbanColumn
                        key={col.key}
                        title={col.title}
                        count={counts[col.key]}
                        tone={col.tone}
                        collapsed={collapsed[col.key]}
                        onToggle={() => toggleColumn(col.key)}
                    >
                        {tasks
                            .filter((t) => t.col === col.key)
                            .map((task) => (
                                <TaskCard
                                    key={task.id}
                                    title={task.title}
                                    statusTone={col.tone}
                                    statusLabel={col.title}
                                    onClick={() => onCardClick(task)}
                                />
                            ))}
                        {col.key === "todo" && <AddTaskForm onAdd={onAddTask} />}
                    </KanbanColumn>
                ))}
            </div>
        </div>
    );
}

export default Board;
