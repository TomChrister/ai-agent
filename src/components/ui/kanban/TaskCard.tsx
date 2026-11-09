import type { DragEventHandler, MouseEventHandler, ReactNode } from "react";

const STATUS_STYLES = {
    neutral: "bg-(--surface-sunken) text-(--text-secondary)",
    progress: "bg-(--surface-sunken) text-(--text-primary)",
    done: "bg-(--status-done-bg) text-(--text-primary)",
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
            className={`flex cursor-grab flex-col gap-2.5 rounded-(--radius-cards) border border-(--border-subtle) bg-(--surface-card) p-4 transition duration-200 hover:-translate-y-0.5 hover:border-(--border-default) hover:shadow-(--shadow-subtle) active:cursor-grabbing ${
                dragging ? "opacity-40" : ""
            }`}
        >
            <div className="text-sm font-medium leading-snug text-(--text-strong)">{title}</div>

            <div className="mt-0.5 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-(--tracking-label) ${STATUS_STYLES[statusTone]}`}>
                    {statusLabel}
                </span>
            </div>
        </div>
    );
}

export default TaskCard;
