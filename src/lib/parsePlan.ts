import type { Task } from "../types";

/** Parses the Planner Agent's response text into a task list, tolerating markdown code fences. */
export function parsePlan(rawText: string): Task[] {
    const fenced = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonText = fenced ? fenced[1] : rawText;
    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed.tasks)) {
        throw new Error("Planner response has no tasks array");
    }

    return parsed.tasks.map((task: Omit<Task, "col">) => ({ ...task, col: "todo" as const }));
}
