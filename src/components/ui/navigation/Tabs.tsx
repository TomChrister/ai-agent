import type { ReactNode } from "react";

type TabItem = string | { value: string | number; label?: ReactNode };

interface TabsProps {
    items?: TabItem[];
    active?: string | number;
    onChange?: (value: string | number) => void;
}

/** Tabs: horizontal segmented navigation, underline active indicator. */
function Tabs({ items = [], active, onChange }: TabsProps) {
    return (
        <div className="flex gap-6 border-b border-(--border-subtle)">
            {items.map((it) => {
                const value = typeof it === "string" ? it : it.value;
                const label = typeof it === "string" ? it : (it.label ?? it.value);
                const isActive = value === active;

                return (
                    <button
                        key={value}
                        onClick={() => onChange && onChange(value)}
                        className={`-mb-px cursor-pointer border-b-2 bg-transparent px-0.5 py-2.5 text-sm font-semibold transition duration-150 ${
                            isActive
                                ? "border-(--accent-primary) text-(--text-primary)"
                                : "border-transparent text-(--text-secondary)"
                        }`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

export default Tabs;
