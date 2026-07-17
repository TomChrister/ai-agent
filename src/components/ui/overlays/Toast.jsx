const TONE_STYLES = {
    default: "bg-(--ink-950) text-white",
    success: "bg-(--status-done) text-white",
    error: "bg-(--coral-500) text-white",
};

/** Toast: transient notification, fixed bottom-right. */
function Toast({ tone = "default", icon, children, className = "" }) {
    return (
        <div
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-xl px-[18px] py-3 text-sm font-medium shadow-(--shadow-m) ${TONE_STYLES[tone] || TONE_STYLES.default} ${className}`}
        >
            {icon}
            {children}
        </div>
    );
}

export default Toast;
