import { useEffect, useRef, useState } from "react";
import type { ColumnKey, Task, TaskUpdate } from "../types";
import Icon from "./ui/core/Icon";
import Button from "./ui/core/Button";
import Dialog from "./ui/overlays/Dialog";

const STATUSES: { key: ColumnKey; label: string }[] = [
    { key: "todo", label: "To Do" },
    { key: "progress", label: "In Progress" },
    { key: "done", label: "Done" },
];

interface TaskDetailPanelProps {
    task: Task | null;
    onClose: () => void;
    onMove: (id: number, col: ColumnKey) => void;
    onEdit: (id: number, updates: Omit<TaskUpdate, "id">) => void;
    onDelete: (id: number) => void;
}

/** TaskDetailPanel: side panel with description, subtasks, status control, editing, and delete. */
function TaskDetailPanel({ task, onClose, onMove, onEdit, onDelete }: TaskDetailPanelProps) {
    // State initializes from `task`; the parent passes key={task.id} so the panel
    // remounts (and resets) when a different task is opened.
    const [isEditing, setIsEditing] = useState(false);
    const [draftTitle, setDraftTitle] = useState(task?.title ?? "");
    const [draftDescription, setDraftDescription] = useState(task?.description ?? "");
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!task) return;

        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [task, onClose]);

    if (!task) return null;

    function startEditing() {
        setDraftTitle(task!.title ?? "");
        setDraftDescription(task!.description ?? "");
        setIsEditing(true);
    }

    function handleSave() {
        const trimmed = draftTitle.trim();
        if (!trimmed) return;
        onEdit(task!.id, { title: trimmed, description: draftDescription.trim() });
        setIsEditing(false);
    }

    return (
        <div
            ref={panelRef}
            className="fixed inset-y-0 right-0 z-60 flex w-95 flex-col gap-4 overflow-y-auto bg-(--surface-card) p-6 shadow-(--shadow-l)"
        >
            <div className="flex items-start justify-between gap-2">
                {isEditing ? (
                    <input
                        autoFocus
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        className="flex-1 rounded-lg border border-(--border-default) px-2.5 py-1.5 text-lg font-semibold text-(--text-primary) outline-none focus:border-(--focus-ring)"
                    />
                ) : (
                    <div className="max-w-65 text-xl font-semibold text-(--text-primary)">{task.title}</div>
                )}
                <div className="flex items-center gap-2">
                    {!isEditing && (
                        <>
                            <button
                                onClick={startEditing}
                                className="cursor-pointer border-none bg-transparent p-0 text-(--text-secondary)"
                                aria-label="Edit task"
                            >
                                <Icon name="pencil" size={16} />
                            </button>
                            <button
                                onClick={() => setConfirmingDelete(true)}
                                className="cursor-pointer border-none bg-transparent p-0 text-(--text-secondary) hover:text-(--coral-500)"
                                aria-label="Delete task"
                            >
                                <Icon name="trash-2" size={16} />
                            </button>
                        </>
                    )}
                    <button
                        onClick={onClose}
                        className="cursor-pointer border-none bg-transparent p-0 text-(--text-secondary)"
                        aria-label="Close"
                    >
                        <Icon name="x" size={18} />
                    </button>
                </div>
            </div>

            {isEditing ? (
                <textarea
                    autoFocus={false}
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    placeholder="Description"
                    rows={4}
                    className="resize-none rounded-lg border border-(--border-default) p-2.5 text-sm text-(--text-primary) outline-none focus:border-(--focus-ring)"
                />
            ) : (
                task.description && (
                    <p className="text-sm leading-relaxed text-(--text-secondary)">{task.description}</p>
                )
            )}

            {isEditing && (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold text-(--text-secondary) hover:bg-(--surface-sunken)"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="cursor-pointer rounded-full bg-(--accent-primary) px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-(--accent-primary-hover)"
                    >
                        Save
                    </button>
                </div>
            )}

            {task.subtasks && task.subtasks.length > 0 && (
                <div>
                    <div className="mb-2.5 text-xs font-bold uppercase tracking-wide text-(--text-secondary)">
                        Subtasks
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {task.subtasks.map((s, i) => (
                            <label key={i} className="flex items-center gap-2.5 text-sm">
                                <span
                                    className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[5px] ${
                                        s.done ? "bg-(--accent-primary)" : "border-[1.5px] border-(--border-strong)"
                                    }`}
                                >
                                    {s.done && <Icon name="check" size={11} className="invert brightness-200" />}
                                </span>
                                <span className={s.done ? "text-(--text-secondary) line-through" : "text-(--text-primary)"}>
                                    {s.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <div className="mb-2.5 text-xs font-bold uppercase tracking-wide text-(--text-secondary)">
                    Status
                </div>
                <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                        <button
                            key={s.key}
                            onClick={() => onMove(task.id, s.key)}
                            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition duration-150 ${
                                task.col === s.key
                                    ? "bg-(--accent-primary) text-white"
                                    : "border border-(--border-default) bg-(--surface-card) text-(--text-primary) hover:bg-(--surface-sunken)"
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <Dialog
                open={confirmingDelete}
                onClose={() => setConfirmingDelete(false)}
                title="Delete task?"
                footer={
                    <>
                        <Button className='cursor-pointer' variant="secondary" size="s" onClick={() => setConfirmingDelete(false)}>
                            Cancel
                        </Button>
                        <Button className='cursor-pointer' variant="danger" size="s" onClick={() => onDelete(task.id)}>
                            Delete
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-(--text-secondary)">
                    "{task.title}" will be permanently removed. This can't be undone.
                </p>
            </Dialog>
        </div>
    );
}

export default TaskDetailPanel;
