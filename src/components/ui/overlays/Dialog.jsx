/** Dialog: centered modal with scrim. */
function Dialog({ open, onClose, title, children, footer }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                className="w-[420px] max-w-[90vw] rounded-2xl bg-(--surface-card) p-6 shadow-(--shadow-l)"
                onClick={(e) => e.stopPropagation()}
            >
                {title && <h3 className="mb-4 text-xl">{title}</h3>}
                {children}
                {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
            </div>
        </div>
    );
}

export default Dialog;
