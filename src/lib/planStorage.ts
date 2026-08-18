import type { Plan, Task } from "../types";

const STORAGE_KEY = "planbase.plan";

/** Persists the current goal + task list + revision count so a saved plan survives a page refresh. */
export function savePlan(goal: string, tasks: Task[], revisionCount = 0): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ goal, tasks, revisionCount }));
    } catch {
        // localStorage unavailable (private browsing, quota) — plan just won't persist
    }
}

export function loadPlan(): Plan | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.tasks)) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function clearPlan() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
}
