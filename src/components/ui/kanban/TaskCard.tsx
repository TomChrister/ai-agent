import type { DragEventHandler, MouseEventHandler, ReactNode } from "react";

const STATUS_STYLES = {
    neutral: "bg-(--status-todo-bg) text-(--ink-700)",
    progress: "bg-(--status-progress-bg) text-[#8a5200]",
    done: "bg-(--status-done-bg) text-[#2c6b18]",
};

type StatusTone = keyof typeof STATUS_STYLES;

interface TaskCardProps {
    title: ReactNode;
    tags?: string[];
    statusTone?: StatusTone;
    statusLabel?: ReactNode;
    assignee?: ReactNode;
    onClick?: MouseEventHandler<HTMLDivElement>;
    draggable?: boolean;
    dragging?: boolean;
    onDragStart?: DragEventHandler<HTMLDivElement>;
    onDragEnd?: DragEventHandler<HTMLDivElement>;
}

/** TaskCard: single kanban task card — title, tags, status, avatar initial.
 *  Draggable between columns when `draggable` is set; `dragging` dims the card
 *  that is currently being carried. */
function TaskCard({
    title,
    tags = [],
    statusTone = "neutral",
    statusLabel = "To Do",
    assignee,
    onClick,
    draggable = false,
    dragging = false,
    onDragStart,
    onDragEnd,
}: TaskCardProps) {
    return (
        <div
            onClick={onClick}
            draggable={draggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={`flex flex-col gap-2.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) p-4 shadow-(--shadow-xs) transition duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-m) ${
                draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
            } ${dragging ? "opacity-40" : ""}`}
        >
            <div className="text-sm font-semibold leading-snug text-(--text-primary)">{title}</div>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                        <span
                            key={t}
                            className="rounded-md bg-(--surface-sunken) px-1.5 py-0.5 text-[11px] font-semibold text-(--text-secondary)"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-0.5 flex items-center justify-between">
                <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[statusTone] || STATUS_STYLES.neutral}`}
                >
                    {statusLabel}
                </span>
                {assignee && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--teal-200) text-[11px] font-bold text-(--teal-800)">
                        {assignee}
                    </span>
                )}
            </div>
        </div>
    );
}

export default TaskCard;
