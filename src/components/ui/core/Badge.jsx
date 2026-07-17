const TONE_STYLES = {
    neutral: "bg-(--status-todo-bg) text-(--ink-700)",
    progress: "bg-(--status-progress-bg) text-[#8a5200]",
    done: "bg-(--status-done-bg) text-[#2c6b18]",
    accent: "bg-(--accent-primary-soft) text-(--teal-700)",
};

/** Badge: small status pill (kanban status, counts). */
function Badge({ tone = "neutral", children, className = "", ...rest }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONE_STYLES[tone] || TONE_STYLES.neutral} ${className}`}
            {...rest}
        >
            {children}
        </span>
    );
}

export default Badge;
