import { useState } from "react";

/** Tooltip: hover label above a trigger element. */
function Tooltip({ label, children }) {
    const [show, setShow] = useState(false);

    return (
        <span
            className="relative inline-flex"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <span className="absolute bottom-[125%] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-(--ink-950) px-2.5 py-1.5 text-xs font-medium text-white shadow-(--shadow-s)">
                    {label}
                </span>
            )}
        </span>
    );
}

export default Tooltip;
