import { useState } from "react";
import Icon from "./ui/core/Icon";

/** AddTaskForm: inline "+ Add task" control that expands into a small create-task form. */
function AddTaskForm({ onAdd }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;
        onAdd(trimmed, description.trim());
        setTitle("");
        setDescription("");
        setOpen(false);
    }

    function handleCancel() {
        setTitle("");
        setDescription("");
        setOpen(false);
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-(--border-default) py-2.5 text-sm font-medium text-(--text-secondary) transition duration-150 hover:border-(--border-strong) hover:text-(--text-primary)"
            >
                <Icon name="plus" size={14} />
                Add task
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) p-3 shadow-(--shadow-xs)"
        >
            <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="border-none bg-transparent text-sm font-semibold text-(--text-primary) outline-none"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="resize-none border-none bg-transparent text-sm text-(--text-secondary) outline-none"
            />
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="cursor-pointer rounded-full px-3 py-1 text-xs font-semibold text-(--text-secondary) hover:bg-(--surface-sunken)"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="cursor-pointer rounded-full bg-(--accent-primary) px-3 py-1 text-xs font-semibold text-white hover:bg-(--accent-primary-hover)"
                >
                    Add
                </button>
            </div>
        </form>
    );
}

export default AddTaskForm;
