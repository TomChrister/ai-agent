import { useState } from "react";
import Button from "./ui/core/Button";

/** ReviseBar: lets the user ask Claude to adjust the current plan (add/focus/remove), within a revision budget. */
function ReviseBar({ onSubmit, loading, revisionsUsed, revisionsMax }) {
    const [value, setValue] = useState("");
    const remaining = revisionsMax - revisionsUsed;
    const limitReached = remaining <= 0;

    function handleSubmit() {
        const trimmed = value.trim();
        if (!trimmed || loading || limitReached) return;
        onSubmit(trimmed);
        setValue("");
    }

    return (
        <div className="flex items-center gap-2 px-8 py-5">
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={limitReached}
                placeholder={
                    limitReached
                        ? "No revisions left"
                        : 'Ask Claude to adjust the plan — e.g. "add two tasks about music" or "focus more on the venue"'
                }
                className="w-full max-w-md rounded-full border border-(--border-default) bg-(--surface-card) px-4 py-2 text-sm text-(--text-primary) outline-none transition duration-150 focus:border-(--focus-ring) disabled:opacity-60"
            />
            <Button
                variant="secondary"
                size="s"
                onClick={handleSubmit}
                disabled={loading || limitReached || !value.trim()}
            >
                {loading ? "Thinking…" : "Revise"}
            </Button>
            <span className="whitespace-nowrap text-xs text-(--text-secondary)">
                {remaining} revision{remaining === 1 ? "" : "s"} left
            </span>
        </div>
    );
}

export default ReviseBar;
