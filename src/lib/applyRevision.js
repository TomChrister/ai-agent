/** Merges an { add, update, remove } diff into the current task list, preserving column/status for untouched tasks. */
export function applyRevision(tasks, revision) {
    const removeIds = new Set(revision.remove);
    let nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

    const kept = tasks
        .filter((t) => !removeIds.has(t.id))
        .map((t) => {
            const patch = revision.update.find((u) => u.id === t.id);
            return patch ? { ...t, ...patch } : t;
        });

    const added = revision.add.map((t) => ({
        ...t,
        id: nextId++,
        col: "todo",
    }));

    return [...kept, ...added];
}
