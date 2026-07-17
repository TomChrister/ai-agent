/** Radio: round single-select toggle. */
function Radio({ checked, onChange, label, className = "" }) {
    return (
        <label className={`inline-flex cursor-pointer items-center gap-2 text-sm text-(--text-primary) ${className}`}>
            <span
                onClick={() => onChange && onChange({ target: { checked: true } })}
                className={`box-border h-[18px] w-[18px] rounded-full bg-(--surface-card) transition duration-150 ${
                    checked ? "border-[5px] border-(--accent-primary)" : "border-[1.5px] border-(--border-strong)"
                }`}
            />
            {label}
        </label>
    );
}

export default Radio;
