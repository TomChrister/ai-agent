import type { DragEventHandler, ReactNode } from "react";
import Icon from "../core/Icon";

const TONE_STYLES = {
    todo: { column: "bg-(--surface-column)", dot: "bg-(--status-todo)" },
    progress: { column: "bg-(--surface-column-progress)", dot: "bg-(--status-progress)" },
    done: { column: "bg-(--surface-column-done)", dot: "bg-(--status-done)" },
};

interface KanbanColumnProps {
    title: ReactNode;
    count: number;
    tone: keyof typeof TONE_STYLES;
    collapsed: boolean;
    onToggle: () => void;
    children: ReactNode;
    dropActive: boolean;
    onDragOver: DragEventHandler<HTMLDivElement>;
    onDragLeave: DragEventHandler<HTMLDivElement>;
    onDrop: DragEventHandler<HTMLDivElement>;
}

/** KanbanColumn: board column with header, count, and stacked TaskCards, tinted by status.
 *  Below `md` the header toggles the card list (collapse); on desktop the list
 *  is always shown regardless of `collapsed`. The whole column acts as a drop
 *  zone for dragged cards, highlighted while `dropActive`. */
function KanbanColumn({
    title,
    count,
    tone,
    collapsed,
    onToggle,
    children,
    dropActive,
    onDragOver,
    onDragLeave,
    onDrop,
}: KanbanColumnProps) {
    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`flex flex-col gap-3 rounded-(--radius-panel) p-4 outline-2 outline-offset-[-2px] transition-colors md:min-w-[260px] md:flex-1 ${TONE_STYLES[tone].column} ${
                dropActive ? "outline-dashed outline-(--accent-primary)" : "outline-transparent"
            }`}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={!collapsed}
                className="flex items-center gap-2 border-none bg-transparent p-0 text-left md:pointer-events-none md:cursor-default"
            >
                <span className={`h-2.5 w-2.5 rounded-full ${TONE_STYLES[tone].dot}`} />
                <span className="text-base font-medium text-(--text-strong)">{title}</span>
                <span className="rounded-md bg-(--surface-card) px-2 py-0.5 text-xs font-medium text-(--text-secondary)">
                    {count}
                </span>
                <Icon
                    name="chevron-down"
                    size={16}
                    className={`ml-auto transition-transform md:hidden ${collapsed ? "" : "rotate-180"}`}
                />
            </button>
            <div className={`min-h-16 flex-col gap-2.5 ${collapsed ? "hidden md:flex" : "flex"}`}>
                {count === 0 && (
                    <div className="flex min-h-16 items-center justify-center rounded-(--radius-cards) border border-dashed border-(--border-strong)/40 text-sm text-(--text-secondary)">
                        {dropActive ? "Drop it here" : "No tasks here yet"}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

export default KanbanColumn;
