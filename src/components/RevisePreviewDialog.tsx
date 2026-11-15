import type { ReactNode } from "react";
import type { Revision, Task } from "../types";
import Dialog from "./ui/overlays/Dialog";
import Button from "./ui/core/Button";

interface RevisePreviewDialogProps {
    revision: Revision | null;
    tasks: Task[];
    onApply: () => void;
    onDiscard: () => void;
}

interface ChangeRowProps {
    badge: string;
    badgeClass: string;
    title: ReactNode;
    description?: string;
    /** Indent that lines the description up under the title (the badges differ in width). */
    descriptionClass: string;
}

/** ChangeRow: one proposed change — a coloured badge, the task title and an optional description. */
function ChangeRow({ badge, badgeClass, title, description, descriptionClass }: ChangeRowProps) {
    return (
        <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-start gap-2">
                <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${badgeClass}`}>
                    {badge}
                </span>
                <span className="text-(--text-primary)">{title}</span>
            </div>
            {description && <p className={`text-xs text-(--text-secondary) ${descriptionClass}`}>{description}</p>}
        </div>
    );
}

/** RevisePreviewDialog: shows the Revise Agent's proposed add/update/remove diff before it's applied. */
function RevisePreviewDialog({ revision, tasks, onApply, onDiscard }: RevisePreviewDialogProps) {
    if (!revision) return null;

    const findTask = (id: number) => tasks.find((t) => t.id === id);
    const findTitle = (id: number) => findTask(id)?.title ?? `Task ${id}`;
    const changeCount = revision.add.length + revision.update.length + revision.remove.length;

    return (
        <Dialog
            open
            onClose={onDiscard}
            title="Review changes"
            footer={
                <>
                    <Button variant="secondary" size="s" onClick={onDiscard}>
                        Discard
                    </Button>
                    <Button
                        variant="primary"
                        size="s"
                        onClick={onApply}
                        disabled={changeCount === 0}
                    >
                        Apply changes
                    </Button>
                </>
            }
        >
            <div className="flex max-h-80 flex-col gap-3 overflow-y-auto">
                {revision.add.map((t, i) => (
                    <ChangeRow
                        key={`add-${i}`}
                        badge="+ Add"
                        badgeClass="bg-(--status-done-bg) text-(--text-primary)"
                        title={t.title}
                        description={t.description}
                        descriptionClass="pl-[52px]"
                    />
                ))}

                {revision.update.map((t) => (
                    <ChangeRow
                        key={`update-${t.id}`}
                        badge="~ Update"
                        badgeClass="bg-(--surface-sunken) text-(--text-primary)"
                        title={
                            <>
                                {findTitle(t.id)}
                                {t.title && t.title !== findTitle(t.id) && <> → {t.title}</>}
                            </>
                        }
                        description={t.description}
                        descriptionClass="pl-[68px]"
                    />
                ))}

                {revision.remove.map((id) => (
                    <ChangeRow
                        key={`remove-${id}`}
                        badge="− Remove"
                        badgeClass="bg-(--danger-bg) text-(--danger)"
                        title={findTitle(id)}
                        description={findTask(id)?.description}
                        descriptionClass="pl-[68px] line-through"
                    />
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
