const DOT_STYLES = {
    neutral: "bg-(--status-todo)",
    progress: "bg-(--status-progress)",
    done: "bg-(--status-done)",
};

/** KanbanColumn: board column with header, count, and stacked TaskCards. */
function KanbanColumn({ title, count, tone = "neutral", children }) {
    return (
        <div className="flex min-w-[260px] flex-1 flex-col gap-3 rounded-2xl bg-(--surface-sunken) p-4">
            <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${DOT_STYLES[tone] || DOT_STYLES.neutral}`} />
                <span className="text-sm font-semibold text-(--text-primary)">{title}</span>
                <span className="text-xs font-semibold text-(--text-secondary)">{count}</span>
            </div>
            <div className="flex flex-col gap-2.5">{children}</div>
        </div>
    );
}

export default KanbanColumn;
