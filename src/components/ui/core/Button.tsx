import type { ComponentPropsWithoutRef, ReactNode } from "react";

const SIZE_STYLES = {
    s: "gap-1.5 px-3 py-1.5 text-(length:--text-body-s)",
    m: "gap-2 px-[18px] py-2.5 text-(length:--text-body-m)",
};

const VARIANT_STYLES = {
    primary:
        "border border-transparent bg-(--accent-primary) text-white hover:bg-(--accent-primary-hover) disabled:bg-(--ink-200)",
    secondary:
        "border border-(--border-default) bg-(--surface-card) text-(--text-primary) hover:bg-(--surface-sunken)",
    danger:
        "border border-transparent bg-(--coral-500) text-white hover:bg-(--coral-600) disabled:bg-(--ink-200)",
};

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
    variant?: keyof typeof VARIANT_STYLES;
    size?: keyof typeof SIZE_STYLES;
    icon?: ReactNode;
    iconRight?: ReactNode;
}

/** Button: primary CTA and secondary/danger variants, two sizes. */
function Button({ variant = "primary", size = "m", icon, iconRight, children, className = "", ...rest }: ButtonProps) {
    return (
        <button
            className={`inline-flex cursor-pointer items-center justify-center rounded-full font-semibold transition duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${SIZE_STYLES[size]} ${VARIANT_STYLES[variant]} ${className}`}
            {...rest}
        >
            {icon}
            {children}
            {iconRight}
        </button>
    );
}

export default Button;
