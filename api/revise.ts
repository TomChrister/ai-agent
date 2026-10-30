import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askClaude } from "./_claude.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { goal, tasks, instruction } = req.body ?? {};
    // Public endpoint spending our API key: cap input before it reaches Claude.
    const isText = (v: unknown) => typeof v === "string" && v.trim() !== "" && v.length <= 500;
    if (!isText(goal) || !isText(instruction)) {
        return res.status(400).json({ error: "goal and instruction must be 1-500 characters" });
    }
    if (!Array.isArray(tasks) || tasks.length > 20 || JSON.stringify(tasks).length > 10_000) {
        return res.status(400).json({ error: "This plan is too big to revise (max 20 tasks and 10,000 characters of task text)." });
    }

    await askClaude(res, `You are a Revise Agent for an AI task planner. You are given the current goal,
            the current list of tasks, and an instruction describing a change the user wants
            (e.g. "add two more tasks about music", "focus more on the venue", "remove the budget task").

            Propose the minimal set of changes that satisfies the instruction.

            Rules:
            - Do not repeat unchanged tasks
            - "add" contains brand new tasks, no id: { "title": "short title", "description": "what needs to be done" }
            - "update" contains changes to existing tasks, matched by id: { "id": <number>, "title": "...", "description": "..." } — include only the fields that changed, id is required
            - "remove" is a list of existing task ids to delete: [<number>, ...]
            - Only use ids that are present in the given task list for "update" and "remove"
            - Keep the same tone and specificity as the existing tasks
            - Respond ONLY with valid JSON, no other text

            Format:
            {
            "add": [ { "title": "short title", "description": "what needs to be done" } ],
            "update": [ { "id": 1, "title": "short title", "description": "what needs to be done" } ],
            "remove": [3]
            }`, `Goal: ${goal}\n\nCurrent tasks:\n${JSON.stringify(tasks, null, 2)}\n\nInstruction: ${instruction}`);
}
