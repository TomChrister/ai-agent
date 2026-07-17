const SIZE_STYLES = {
    s: "gap-1.5 px-3 py-1.5 text-(length:--text-body-s)",
    m: "gap-2 px-[18px] py-2.5 text-(length:--text-body-m)",
    l: "gap-2.5 px-6 py-3.5 text-(length:--text-body-l)",
};

const VARIANT_STYLES = {
    primary:
        "border border-transparent bg-(--accent-primary) text-white hover:bg-(--accent-primary-hover) disabled:bg-(--ink-200)",
    secondary:
        "border border-(--border-default) bg-(--surface-card) text-(--text-primary) hover:bg-(--surface-sunken)",
    ghost:
        "border border-transparent bg-transparent text-(--text-primary) hover:bg-(--surface-sunken)",
    danger:
        "border border-transparent bg-(--coral-500) text-white hover:bg-(--coral-600) disabled:bg-(--ink-200)",
};

/** Button: primary CTA and secondary/ghost/danger variants, three sizes. */
function Button({ variant = "primary", size = "m", icon, iconRight, disabled, children, className = "", ...rest }) {
    return (
        <button
            disabled={disabled}
            className={`inline-flex items-center justify-center rounded-full font-semibold transition duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${SIZE_STYLES[size] || SIZE_STYLES.m} ${VARIANT_STYLES[variant] || VARIANT_STYLES.primary} ${className}`}
            {...rest}
        >
            {icon}
            {children}
            {iconRight}
        </button>
    );
}

export default Button;
