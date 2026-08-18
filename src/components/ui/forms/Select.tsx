import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Icon from "../core/Icon";

type SelectOption = string | { value: string | number; label?: ReactNode };

interface SelectProps extends ComponentPropsWithoutRef<"select"> {
    label?: ReactNode;
    options?: SelectOption[];
}

/** Select: native-backed dropdown styled to match Input. */
function Select({ label, options = [], className = "", ...rest }: SelectProps) {
    return (
        <label className="flex flex-col gap-1.5">
            {label && <span className="text-[13px] font-semibold text-(--text-primary)">{label}</span>}
            <div className="relative">
                <select
                    className={`w-full appearance-none rounded-xl border border-(--border-default) bg-(--surface-card) px-3.5 py-2.5 pr-9 text-(length:--text-body-m) text-(--text-primary) ${className}`}
                    {...rest}
                >
                    {options.map((o) => {
                        const value = typeof o === "string" ? o : o.value;
                        const label = typeof o === "string" ? o : (o.label ?? o.value);
                        return (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        );
                    })}
                </select>
                <Icon name="chevron-down" size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
        </label>
    );
}

export default Select;
