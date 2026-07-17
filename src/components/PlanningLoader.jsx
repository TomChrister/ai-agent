import { useEffect, useState } from "react";

const STATUS_MESSAGES = [
    "Reading your goal…",
    "Breaking it into tasks…",
    "Organizing your board…",
    "Almost done…",
];

/** PlanningLoader: shown while the Planner Agent is working — rotating status + skeleton board. */
function PlanningLoader() {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setStep((s) => (s + 1) % STATUS_MESSAGES.length);
        }, 2000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-20">
            <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-(--accent-primary) [animation-delay:-0.3s]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-(--accent-primary) [animation-delay:-0.15s]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-(--accent-primary)" />
            </div>

            <div className="text-lg font-medium text-(--text-secondary)">
                {STATUS_MESSAGES[step]}
            </div>

            <div className="flex w-full max-w-4xl gap-5 px-6">
                {[0, 1, 2].map((col) => (
                    <div
                        key={col}
                        className="flex min-w-50 flex-1 flex-col gap-3 rounded-2xl bg-(--surface-sunken) p-4"
                    >
                        <div className="h-3 w-20 animate-pulse rounded bg-(--border-default)" />
                        {[0, 1].map((row) => (
                            <div
                                key={row}
                                className="h-16 animate-pulse rounded-xl border border-(--border-subtle) bg-(--surface-card)"
                                style={{ animationDelay: `${(col * 2 + row) * 120}ms` }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlanningLoader;
