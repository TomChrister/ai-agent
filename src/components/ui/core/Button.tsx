import type { ComponentPropsWithoutRef, ReactNode } from "react";

const SIZE_STYLES = {
    s: "gap-1.5 px-3.5 py-1.5 text-(length:--text-body-s)",
    m: "gap-2 px-5 py-2.5 text-(length:--text-body-s)",
};

const VARIANT_STYLES = {
    primary:
        "border border-transparent bg-(--accent-primary) text-(--text-on-accent) hover:bg-(--accent-primary-hover) disabled:bg-(--border-default) disabled:text-(--text-muted)",
    secondary:
        "border border-(--border-strong) bg-transparent text-(--text-primary) hover:bg-(--surface-sunken)",
    danger:
        "border border-(--danger) bg-transparent text-(--danger) hover:bg-(--danger-bg)",
};

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
    variant?: keyof typeof VARIANT_STYLES;
    size?: keyof typeof SIZE_STYLES;
    icon?: ReactNode;
    iconRight?: ReactNode;
}

/** Button: green filled primary CTA, outline secondary/danger pills, two sizes. */
function Button({ variant = "primary", size = "m", icon, iconRight, children, className = "", ...rest }: ButtonProps) {
    return (
        <button
            className={`inline-flex cursor-pointer items-center justify-center rounded-full font-medium transition duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${SIZE_STYLES[size]} ${VARIANT_STYLES[variant]} ${className}`}
            {...rest}
        >
            {icon}
            {children}
            {iconRight}
        </button>
    );
}

export default Button;
