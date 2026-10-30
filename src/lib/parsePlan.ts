import type { Task } from "../types";

/** Parses the Planner Agent's response text into a task list, tolerating markdown code fences. */
export function parsePlan(rawText: string): Task[] {
    const fenced = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonText = fenced ? fenced[1] : rawText;
    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed?.tasks)) {
        throw new Error("Planner response has no tasks array");
    }

    // Keep only known fields and number ids ourselves, so they are always unique integers.
    const tasks: Task[] = parsed.tasks
        .filter((t: { title?: unknown }) => typeof t?.title === "string" && t.title.trim())
        .map((t: { title: string; description?: unknown }, i: number) => ({
            id: i + 1,
            title: t.title,
            description: typeof t.description === "string" ? t.description : "",
            col: "todo" as const,
        }));

    if (!tasks.length) {
        throw new Error("Planner returned no tasks");
    }
    return tasks;
}
