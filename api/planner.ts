import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askClaude } from "./_claude";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { goal } = req.body ?? {};
    // Public endpoint spending our API key: cap input before it reaches Claude.
    if (typeof goal !== "string" || !goal.trim() || goal.length > 500) {
        return res.status(400).json({ error: "goal must be 1-500 characters" });
    }

    await askClaude(res, `You are a Planner Agent. Your job is to break down a goal into concrete, 
            actionable subtasks that another AI agent (Worker) can solve one at a time.
            
            Rules:
            - Maximum 5 subtasks
            - Each task must be specific and self-contained (not dependent on context outside what's given)
            - Do not solve the tasks yourself, only plan them
            - Always respond in English, regardless of what language the goal is written in
            - Respond ONLY with valid JSON, no other text
            
            Format:
            {
            "goal": "short summary of the goal",
            "tasks": [
            { "id": 1, "title": "short title", "description": "what needs to be done" }
            ]
            }`, `Goal: ${goal}`);
}
