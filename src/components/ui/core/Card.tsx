import type { ComponentPropsWithoutRef } from "react";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
    hoverable?: boolean;
}

/** Card: base surface for content grouping (panels, list items). */
function Card({ hoverable = false, children, className = "", ...rest }: CardProps) {
    return (
        <div
            className={`rounded-xl border border-(--border-subtle) bg-(--surface-card) p-4 shadow-(--shadow-xs) transition duration-200 ${
                hoverable ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-(--shadow-m)" : ""
            } ${className}`}
            {...rest}
        >
            {children}
        </div>
    );
}

export default Card;
