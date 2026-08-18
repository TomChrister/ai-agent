import type { ComponentPropsWithoutRef, ReactNode } from "react";

const VARIANT_STYLES = {
    ghost: "border border-transparent bg-transparent text-(--text-secondary) hover:bg-(--surface-sunken)",
    subtle: "border border-transparent bg-(--surface-sunken) text-(--text-primary)",
    outline: "border border-(--border-default) bg-(--surface-card) text-(--text-primary) hover:bg-(--surface-sunken)",
};

type Variant = keyof typeof VARIANT_STYLES;

interface IconButtonProps extends ComponentPropsWithoutRef<"button"> {
    icon?: ReactNode;
    size?: number;
    variant?: Variant;
}

/** IconButton: circular icon-only button for compact actions. */
function IconButton({ icon, size = 36, variant = "ghost", className = "", ...rest }: IconButtonProps) {
    return (
        <button
            style={{ width: size, height: size }}
            className={`inline-flex items-center justify-center rounded-full transition duration-150 ${VARIANT_STYLES[variant] || VARIANT_STYLES.ghost} ${className}`}
            {...rest}
        >
            {icon}
        </button>
    );
}

export default IconButton;
