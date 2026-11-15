import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import { COLUMNS, type ColumnKey, type Task } from "../types";
import KanbanColumn from "./ui/kanban/KanbanColumn";
import TaskCard from "./ui/kanban/TaskCard";
import Button from "./ui/core/Button";
import Icon from "./ui/core/Icon";
import AddTaskForm from "./AddTaskForm";
import ReviseBar from "./ReviseBar";

interface BoardProps {
    goal: string;
    tasks: Task[];
    onCardClick: (task: Task) => void;
    onMoveTask: (id: number, col: ColumnKey) => void;
    onReset: () => void;
    onAddTask: (title: string, description: string) => void;
    onRevise: (instruction: string) => void;
    revising: boolean;
    revisionsUsed: number;
    revisionsMax: number;
}

/** Board: goal header + revise bar + kanban columns for the generated plan. */
function Board({
    goal,
    tasks,
    onCardClick,
    onMoveTask,
    onReset,
    onAddTask,
    onRevise,
    revising,
    revisionsUsed,
    revisionsMax,
}: BoardProps) {
    // Per-column collapse state (only takes effect below `md`; desktop always shows).
    // To Do starts open, the others collapsed.
    const [collapsed, setCollapsed] = useState<Record<ColumnKey, boolean>>({
        todo: false,
        progress: true,
        done: true,
    });

    const counts = COLUMNS.reduce((acc, col) => {
        acc[col.key] = tasks.filter((t) => t.col === col.key).length;
        return acc;
    }, {} as Record<ColumnKey, number>);

    // Auto-expand a column when a new card lands in it.
    const prevCounts = useRef(counts);
    useEffect(() => {
        setCollapsed((prev) => {
            let changed = false;
            const next = { ...prev };
            for (const col of COLUMNS) {
                if (counts[col.key] > prevCounts.current[col.key] && next[col.key]) {
                    next[col.key] = false;
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
        prevCounts.current = counts;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counts.todo, counts.progress, counts.done]);

    const toggleColumn = (key: ColumnKey) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

    // Drag-and-drop: `draggingId` is the card being carried, `dragOverCol` the
    // column currently under the cursor (drives the drop highlight).
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [dragOverCol, setDragOverCol] = useState<ColumnKey | null>(null);

    function handleDragStart(e: DragEvent<HTMLDivElement>, task: Task) {
        setDraggingId(task.id);
        e.dataTransfer.effectAllowed = "move";
        // Some browsers require data to be set for the drag to start at all.
        e.dataTransfer.setData("text/plain", String(task.id));
    }

    function handleDragEnd() {
        setDraggingId(null);
        setDragOverCol(null);
    }

    function handleDragOver(e: DragEvent<HTMLDivElement>, key: ColumnKey) {
        if (draggingId === null) return;
        e.preventDefault(); // marks the column as a valid drop target
        e.dataTransfer.dropEffect = "move";
        setDragOverCol(key);
        // Reveal a collapsed column so the drop lands somewhere visible.
        if (collapsed[key]) setCollapsed((prev) => ({ ...prev, [key]: false }));
    }

    function handleDragLeave(e: DragEvent<HTMLDivElement>, key: ColumnKey) {
        // Ignore moves between children of the same column.
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setDragOverCol((prev) => (prev === key ? null : prev));
    }

    function handleDrop(e: DragEvent<HTMLDivElement>, key: ColumnKey) {
        e.preventDefault();
        const id = draggingId ?? Number(e.dataTransfer.getData("text/plain"));
        const task = tasks.find((t) => t.id === id);
        if (task && task.col !== key) onMoveTask(id, key);
        handleDragEnd();
    }

    return (
        // 1264px = the TopBar's 1200px content width plus this layout's 32px side padding.
        <div className="mx-auto flex w-full max-w-[1264px] flex-1 flex-col">
            <div className="flex items-start justify-between gap-4 px-4 pt-6 md:px-8">
                <div className="min-w-0">
                    <h1 className="text-2xl leading-[1.3] tracking-[-0.015em] wrap-break-word">{goal}</h1>
                    <div className="mt-1 text-sm text-(--text-secondary)">
                        AI Planner Agent · {counts.done} of {tasks.length} tasks done
                    </div>
                </div>
                <Button
                    variant="secondary"
                    size="s"
                    onClick={onReset}
                    disabled={revising}
                    icon={<Icon name="rotate-ccw" size={14} />}
                >
                    Reset
                </Button>
            </div>

            <ReviseBar
                onSubmit={onRevise}
                loading={revising}
                revisionsUsed={revisionsUsed}
                revisionsMax={revisionsMax}
            />

            {/* Drag hint — desktop only, since HTML5 drag doesn't fire on touch. */}
            <span className="hidden items-center gap-1.5 px-4 text-sm text-(--text-secondary) md:flex md:px-8">
                <Icon name="grip-vertical" size={14} />
                Drag and drop tasks between columns
            </span>

            <div className="flex flex-1 flex-col gap-4 p-4 pt-3 md:flex-row md:gap-5 md:overflow-x-auto md:p-8 md:pt-4">
                {COLUMNS.map((col, i) => {
                    const next = COLUMNS[i + 1];
                    return (
                    <KanbanColumn
                        key={col.key}
                        title={col.title}
                        count={counts[col.key]}
                        tone={col.key}
                        collapsed={collapsed[col.key]}
                        onToggle={() => toggleColumn(col.key)}
                        dropActive={dragOverCol === col.key}
                        onDragOver={(e) => handleDragOver(e, col.key)}
                        onDragLeave={(e) => handleDragLeave(e, col.key)}
                        onDrop={(e) => handleDrop(e, col.key)}
                    >
                        {tasks
                            .filter((t) => t.col === col.key)
                            .map((task) => (
                                <TaskCard
                                    key={task.id}
                                    title={task.title}
                                    description={task.description}
                                    onClick={() => onCardClick(task)}
                                    advanceLabel={next?.title}
                                    onAdvance={next && (() => onMoveTask(task.id, next.key))}
                                    dragging={draggingId === task.id}
                                    onDragStart={(e) => handleDragStart(e, task)}
                                    onDragEnd={handleDragEnd}
                                />
                            ))}
                        {col.key === "todo" && <AddTaskForm onAdd={onAddTask} />}
                    </KanbanColumn>
                    );
                })}
            </div>
        </div>
    );
}

export default Board;
