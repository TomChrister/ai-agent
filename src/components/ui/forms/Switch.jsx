/** Switch: on/off toggle. */
function Switch({ checked, onChange, className = "" }) {
    return (
        <button
            onClick={() => onChange && onChange({ target: { checked: !checked } })}
            className={`flex h-6 w-10 items-center rounded-full p-[3px] transition duration-150 ${
                checked ? "justify-end bg-(--accent-primary)" : "justify-start bg-(--ink-200)"
            } ${className}`}
        >
            <span className="h-[18px] w-[18px] rounded-full bg-white shadow-(--shadow-xs) transition duration-150" />
        </button>
    );
}

export default Switch;
