import type { ReactNode } from "react";

/** Toast: error notification, fixed bottom-right. */
function Toast({ children }: { children: ReactNode }) {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-xl bg-(--coral-500) px-[18px] py-3 text-sm font-medium text-white shadow-(--shadow-m)">
            {children}
        </div>
    );
}

export default Toast;
