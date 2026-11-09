import type { ReactNode } from "react";

/** Toast: error notification, fixed bottom-right. */
function Toast({ children }: { children: ReactNode }) {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-(--radius-cards) border border-(--border-subtle) bg-(--surface-card) px-5 py-3 text-sm font-medium text-(--danger) shadow-(--shadow-sm)">
            {children}
        </div>
    );
}

export default Toast;
