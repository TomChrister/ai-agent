import type { ComponentPropsWithoutRef, MouseEventHandler } from "react";
import Icon from "./Icon";

interface TagProps extends ComponentPropsWithoutRef<"span"> {
    onRemove?: MouseEventHandler<HTMLButtonElement>;
}

/** Tag: removable label chip, e.g. task category. */
function Tag({ children, onRemove, className = "", ...rest }: TagProps) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--surface-sunken) px-2 py-1 text-[13px] font-medium text-(--text-primary) ${className}`}
            {...rest}
        >
            {children}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="flex cursor-pointer border-none bg-transparent p-0 text-(--text-secondary)"
                    aria-label="Remove"
                >
                    <Icon name="x" size={12} />
                </button>
            )}
        </span>
    );
}

export default Tag;
