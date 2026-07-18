import Icon from "../core/Icon";

const DOT_STYLES = {
    neutral: "bg-(--status-todo)",
    progress: "bg-(--status-progress)",
    done: "bg-(--status-done)",
};

/** KanbanColumn: board column with header, count, and stacked TaskCards.
 *  Below `md` the header toggles the card list (collapse); on desktop the list
 *  is always shown regardless of `collapsed`. */
function KanbanColumn({ title, count, tone = "neutral", collapsed = false, onToggle, children }) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl bg-(--surface-sunken) p-4 md:min-w-[260px] md:flex-1">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={!collapsed}
                className="flex items-center gap-2 text-left md:pointer-events-none md:cursor-default"
            >
                <span className={`h-2 w-2 rounded-full ${DOT_STYLES[tone] || DOT_STYLES.neutral}`} />
                <span className="text-sm font-semibold text-(--text-primary)">{title}</span>
                <span className="text-xs font-semibold text-(--text-secondary)">{count}</span>
                <Icon
                    name="chevron-down"
                    size={16}
                    className={`ml-auto text-(--text-secondary) transition-transform md:hidden ${
                        collapsed ? "" : "rotate-180"
                    }`}
                />
            </button>
            <div className={`flex-col gap-2.5 ${collapsed ? "hidden md:flex" : "flex"}`}>{children}</div>
        </div>
    );
}

export default KanbanColumn;
