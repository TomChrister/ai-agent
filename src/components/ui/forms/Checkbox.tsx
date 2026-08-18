import type { ReactNode } from "react";
import Icon from "../core/Icon";

interface CheckboxProps {
    checked: boolean;
    onChange?: (event: { target: { checked: boolean } }) => void;
    label?: ReactNode;
    className?: string;
}

/** Checkbox: square toggle with check glyph. */
function Checkbox({ checked, onChange, label, className = "" }: CheckboxProps) {
    return (
        <label className={`inline-flex cursor-pointer items-center gap-2 text-sm text-(--text-primary) ${className}`}>
            <span
                onClick={() => onChange && onChange({ target: { checked: !checked } })}
                className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] transition duration-150 ${
                    checked ? "bg-(--accent-primary)" : "border-[1.5px] border-(--border-strong) bg-(--surface-card)"
                }`}
            >
                {checked && <Icon name="check" size={12} className="invert brightness-200" />}
            </span>
            {label}
        </label>
    );
}

export default Checkbox;
