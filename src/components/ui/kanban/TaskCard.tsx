import type { DragEventHandler, MouseEventHandler, ReactNode } from "react";

const STATUS_STYLES = {
    neutral: "bg-(--status-todo-bg) text-(--ink-700)",
    progress: "bg-(--status-progress-bg) text-[#8a5200]",
    done: "bg-(--status-done-bg) text-[#2c6b18]",
};

interface TaskCardProps {
    title: ReactNode;
    statusTone: keyof typeof STATUS_STYLES;
    statusLabel: ReactNode;
    onClick: MouseEventHandler<HTMLDivElement>;
    dragging: boolean;
    onDragStart: DragEventHandler<HTMLDivElement>;
    onDragEnd: DragEventHandler<HTMLDivElement>;
}

/** TaskCard: single draggable kanban card — title and status. `dragging` dims the card being carried. */
function TaskCard({ title, statusTone, statusLabel, onClick, dragging, onDragStart, onDragEnd }: TaskCardProps) {
    return (
        <div
            onClick={onClick}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={`flex cursor-grab flex-col gap-2.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) p-4 shadow-(--shadow-xs) transition duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-m) active:cursor-grabbing ${
                dragging ? "opacity-40" : ""
            }`}
        >
            <div className="text-sm font-semibold leading-snug text-(--text-primary)">{title}</div>

            <div className="mt-0.5 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[statusTone]}`}>
                    {statusLabel}
                </span>
            </div>
        </div>
    );
}

export default TaskCard;
