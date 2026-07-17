/** Input: single-line text field with optional label and icon. */
function Input({ label, icon, size = "m", className = "", ...rest }) {
    const padding = size === "l" ? "px-4 py-3.5" : "px-3.5 py-2.5";
    const fontSize = size === "l" ? "text-(length:--text-body-l)" : "text-(length:--text-body-m)";

    return (
        <label className="flex flex-col gap-1.5">
            {label && <span className="text-[13px] font-semibold text-(--text-primary)">{label}</span>}
            <div
                className={`flex items-center gap-2 rounded-xl border border-(--border-default) bg-(--surface-card) transition duration-150 focus-within:border-(--focus-ring) focus-within:shadow-[0_0_0_3px_var(--accent-primary-soft)] ${padding} ${className}`}
            >
                {icon}
                <input
                    className={`w-full flex-1 border-none bg-transparent text-(--text-primary) outline-none ${fontSize}`}
                    {...rest}
                />
            </div>
        </label>
    );
}

export default Input;
