import type { DragEventHandler } from "react";
import Icon from "../core/Icon";

interface TaskCardProps {
    title: string;
    description: string;
    onClick: () => void;
    /** Title of the next column; with `onAdvance` it renders a one-click move button. */
    advanceLabel?: string;
    onAdvance?: () => void;
    dragging: boolean;
    onDragStart: DragEventHandler<HTMLDivElement>;
    onDragEnd: DragEventHandler<HTMLDivElement>;
}

/** TaskCard: single draggable kanban card — title, description preview and a quick move
 *  to the next column (the only way to move a card on touch without opening the panel).
 *  `dragging` dims the card being carried. */
function TaskCard({ title, description, onClick, advanceLabel, onAdvance, dragging, onDragStart, onDragEnd }: TaskCardProps) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                // Only the card itself: Enter on the inner move button must not open the panel.
                if (e.key === "Enter" && e.target === e.currentTarget) onClick();
            }}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            // cursor-pointer, not cursor-grab: Windows draws the grab hand white and faint.
            className={`flex cursor-pointer flex-col gap-1.5 rounded-(--radius-cards) border border-(--border-subtle) bg-(--surface-card) p-4 transition duration-150 hover:border-(--accent-primary) hover:shadow-(--shadow-sm) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring) ${
                dragging ? "opacity-40" : ""
            }`}
        >
            <div className="text-sm font-medium leading-snug text-(--text-strong)">{title}</div>

            {description && (
                <p className="m-0 line-clamp-2 text-[13px] leading-normal text-(--text-secondary)">{description}</p>
            )}

            {onAdvance && (
                <button
                    type="button"
                    aria-label={`Move to ${advanceLabel}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdvance();
                    }}
                    className="mt-1.5 flex cursor-pointer items-center gap-1 self-start rounded-full border border-(--border-default) bg-transparent px-3 py-1 text-xs font-medium text-(--text-primary) transition duration-150 hover:border-(--accent-primary) hover:bg-(--surface-sunken)"
                >
                    {advanceLabel}
                    <Icon name="arrow-right" size={12} />
                </button>
            )}
        </div>
    );
}

export default TaskCard;
