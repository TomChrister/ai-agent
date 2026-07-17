import Dialog from "./ui/overlays/Dialog";
import Button from "./ui/core/Button";

/** RevisePreviewDialog: shows the Revise Agent's proposed add/update/remove diff before it's applied. */
function RevisePreviewDialog({ revision, tasks, onApply, onDiscard }) {
    if (!revision) return null;

    const findTask = (id) => tasks.find((t) => t.id === id);
    const findTitle = (id) => findTask(id)?.title ?? `Task ${id}`;
    const changeCount = revision.add.length + revision.update.length + revision.remove.length;

    return (
        <Dialog
            open={!!revision}
            onClose={onDiscard}
            title="Review changes"
            footer={
                <>
                    <Button variant="secondary" size="s" onClick={onDiscard} className="cursor-pointer">
                        Discard
                    </Button>
                    <Button
                        variant="primary"
                        size="s"
                        onClick={onApply}
                        disabled={changeCount === 0}
                        className="cursor-pointer"
                    >
                        Apply changes
                    </Button>
                </>
            }
        >
            <div className="flex max-h-80 flex-col gap-3 overflow-y-auto">
                {revision.add.map((t, i) => (
                    <div key={`add-${i}`} className="flex flex-col gap-1 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="mt-0.5 shrink-0 rounded-full bg-(--status-done-bg) px-2 py-0.5 text-[11px] font-semibold text-[#2c6b18]">
                                + Add
                            </span>
                            <span className="text-(--text-primary)">{t.title}</span>
                        </div>
                        {t.description && (
                            <p className="pl-[52px] text-xs text-(--text-secondary)">{t.description}</p>
                        )}
                    </div>
                ))}

                {revision.update.map((t) => (
                    <div key={`update-${t.id}`} className="flex flex-col gap-1 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="mt-0.5 shrink-0 rounded-full bg-(--status-progress-bg) px-2 py-0.5 text-[11px] font-semibold text-[#8a5200]">
                                ~ Update
                            </span>
                            <span className="text-(--text-primary)">
                                {findTitle(t.id)}
                                {t.title && t.title !== findTitle(t.id) && <> → {t.title}</>}
                            </span>
                        </div>
                        {t.description && (
                            <p className="pl-[68px] text-xs text-(--text-secondary)">{t.description}</p>
                        )}
                    </div>
                ))}

                {revision.remove.map((id) => (
                    <div key={`remove-${id}`} className="flex flex-col gap-1 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="mt-0.5 shrink-0 rounded-full bg-[#ffe3dc] px-2 py-0.5 text-[11px] font-semibold text-(--coral-600)">
                                − Remove
                            </span>
                            <span className="text-(--text-primary)">{findTitle(id)}</span>
                        </div>
                        {findTask(id)?.description && (
                            <p className="pl-[68px] text-xs text-(--text-secondary) line-through">
                                {findTask(id).description}
                            </p>
                        )}
                    </div>
                ))}

                {changeCount === 0 && (
                    <p className="text-sm text-(--text-secondary)">
                        Claude didn't suggest any changes for that instruction.
                    </p>
                )}
            </div>
        </Dialog>
    );
}

export default RevisePreviewDialog;
