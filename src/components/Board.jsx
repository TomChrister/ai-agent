import { useState } from "react";
import Tabs from "./ui/navigation/Tabs";
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
    const [view, setView] = useState("Board");

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
                    <Tabs items={["Board", "List", "Timeline"]} active={view} onChange={setView} />
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

            {view === "Board" ? (
                <div className="flex flex-1 gap-5 overflow-x-auto p-8">
                    {COLUMNS.map((col) => (
                        <KanbanColumn
                            key={col.key}
                            title={col.title}
                            count={tasks.filter((t) => t.col === col.key).length}
                            tone={col.tone}
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
            ) : (
                <div className="flex flex-1 items-center justify-center text-(--text-secondary)">
                    {view} view is coming soon.
                </div>
            )}
        </div>
    );
}

export default Board;
